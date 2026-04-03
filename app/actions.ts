"use server";

import { prisma, getLastQuery } from "@/lib/prisma";
import { tableConfig, type ColumnType } from "@/lib/table-config";

const OPERATORS_BY_TYPE: Record<ColumnType, string[]> = {
  string: ["=", "!=", "LIKE"],
  enum: ["=", "!=", "LIKE"],
  number: ["=", "!=", ">", "<", ">=", "<="],
  decimal: ["=", "!=", ">", "<", ">=", "<="],
  date: ["=", "!=", ">", "<", ">=", "<="],
};

export interface QueryParams {
  table: string;
  select?: string[];
  orderBy?: { column: string; direction: "asc" | "desc" };
  groupBy?: string;
  aggregation?: {
    function: "count" | "sum" | "avg" | "min" | "max";
    column?: string;
  };
  where?: { column: string; operator: string; value: string };
  limit?: number;
}

export interface QueryResult {
  data: Record<string, unknown>[];
  sql: string | null;
  error?: string;
}

const COLUMN_MAP_PRISMA_TO_DB: Record<string, Record<string, string>> = {
  Customer: {
    customerId: "customer_id",
    dateOfBirth: "date_of_birth",
    branchId: "branch_id",
  },
  Account: {
    accNo: "acc_no",
  },
  Loan: {
    loanId: "loan_id",
  },
  Transaction: {
    transactionId: "transaction_id",
    accNo: "acc_no",
  },
  Branch: {
    branchId: "branch_id",
  },
  Employee: {
    employeeId: "employee_id",
    branchId: "branch_id",
  },
  EmployeePhone: {
    employeeId: "employee_id",
    phoneNumber: "phone_number",
  },
  CustomerPhone: {
    customerId: "customer_id",
    phoneNumber: "phone_number",
  },
  CustomerAccount: {
    customerId: "customer_id",
    accNo: "acc_no",
  },
  CustomerLoan: {
    customerId: "customer_id",
    loanId: "loan_id",
  },
};

function isReadOnlySql(sql: string): boolean {
  const normalized = sql.trim().replace(/;+\s*$/, "");
  if (!normalized) {
    return false;
  }

  return /^(select|with)\b/i.test(normalized);
}

function toClientSafeValue(value: unknown): unknown {
  if (value === null || value === undefined) {
    return value;
  }

  if (typeof value === "bigint") {
    return value.toString();
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (Array.isArray(value)) {
    return value.map((item) => toClientSafeValue(item));
  }

  if (typeof value === "object") {
    const decimalLike = value as {
      constructor?: { name?: string };
      toString?: () => string;
      d?: unknown;
      e?: unknown;
      s?: unknown;
    };
    const ctorName = decimalLike.constructor?.name || "";
    const looksLikeDecimal =
      ctorName.startsWith("Decimal") ||
      ("d" in decimalLike && "e" in decimalLike && "s" in decimalLike);

    if (looksLikeDecimal) {
      return decimalLike.toString ? decimalLike.toString() : String(value);
    }

    const obj = value as Record<string, unknown>;
    return Object.fromEntries(
      Object.entries(obj)
        .filter(([, entryValue]) => typeof entryValue !== "function")
        .map(([key, entryValue]) => [key, toClientSafeValue(entryValue)]),
    );
  }

  return value;
}

async function executePrismaQuery(
  table: string,
  params: QueryParams,
): Promise<Record<string, unknown>[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const prismaTable = (prisma as unknown as any)[table];

  if (!prismaTable) {
    throw new Error(`Table ${table} not found`);
  }

  const queryOpts: Record<string, unknown> = {};

  // SELECT columns
  if (params.select && params.select.length > 0) {
    queryOpts.select = Object.fromEntries(
      params.select.map((column) => [getPrismaFieldName(table, column), true]),
    );
  }

  // WHERE clause
  if (params.where) {
    const { column, operator, value } = params.where;
    const columnType = getColumnType(table, column);
    const prismaField = getPrismaFieldName(table, column);
    queryOpts.where = buildWhereClause(
      prismaField,
      operator,
      value,
      columnType,
    );
  }

  // ORDER BY
  if (params.orderBy) {
    queryOpts.orderBy = {
      [getPrismaFieldName(table, params.orderBy.column)]:
        params.orderBy.direction || "asc",
    };
  }

  // LIMIT
  if (params.limit) {
    queryOpts.take = params.limit;
  }

  const rows = await prismaTable.findMany(queryOpts);
  return rows.map((row: Record<string, unknown>) =>
    mapRowKeysToDatabaseColumns(table, row),
  );
}

function buildWhereClause(
  prismaField: string,
  operator: string,
  value: string,
  columnType?: ColumnType,
): Record<string, unknown> {
  const safeOperator = normalizeOperator(operator, columnType);
  const parsedValue = parseFilterValue(value, columnType);

  switch (safeOperator) {
    case "=":
      return { [prismaField]: parsedValue };
    case "!=":
      return { [prismaField]: { not: parsedValue } };
    case ">":
      return { [prismaField]: { gt: parsedValue } };
    case "<":
      return { [prismaField]: { lt: parsedValue } };
    case ">=":
      return { [prismaField]: { gte: parsedValue } };
    case "<=":
      return { [prismaField]: { lte: parsedValue } };
    case "LIKE":
      return { [prismaField]: { contains: value, mode: "insensitive" } };
    default:
      return {};
  }
}

export async function executeQuery(params: QueryParams): Promise<QueryResult> {
  try {
    // Validate table
    if (!tableConfig[params.table]) {
      return { data: [], sql: null, error: `Invalid table: ${params.table}` };
    }

    let data: Record<string, unknown>[] = [];
    let sql: string | null = null;

    if (params.groupBy) {
      // Use raw SQL for GROUP BY
      const { column: whereColumn, operator, value } = params.where || {};
      const tableName = getTableName(params.table);
      const selectedFields =
        params.select && params.select.length > 0
          ? params.select
          : [params.groupBy];
      const groupFields = Array.from(
        new Set([params.groupBy, ...selectedFields]),
      );
      const groupedColumns = groupFields.map((field) => ({
        field,
        column: getColumnName(params.table, field),
      }));
      const aggregationFunction = params.aggregation?.function || "count";
      const aggregationColumn = params.aggregation?.column
        ? getColumnName(params.table, params.aggregation.column)
        : "*";

      const aggregationSqlByFn: Record<string, string> = {
        count:
          aggregationColumn === "*"
            ? "COUNT(*)"
            : `COUNT("${aggregationColumn}")`,
        sum: `SUM("${aggregationColumn}")`,
        avg: `AVG("${aggregationColumn}")`,
        min: `MIN("${aggregationColumn}")`,
        max: `MAX("${aggregationColumn}")`,
      };
      const aggregateExpr =
        aggregationSqlByFn[aggregationFunction] || aggregationSqlByFn.count;
      const aggregateAlias =
        aggregationFunction === "count" && aggregationColumn === "*"
          ? "count"
          : `${aggregationFunction}_${aggregationColumn === "*" ? "all" : aggregationColumn}`;
      const groupedSelectSql = groupedColumns
        .map(({ field, column }) => `"${column}" as "${field}"`)
        .join(", ");
      const groupedBySql = groupedColumns
        .map(({ column }) => `"${column}"`)
        .join(", ");

      let query = `SELECT ${groupedSelectSql}, ${aggregateExpr} as "${aggregateAlias}" FROM "${tableName}"`;

      if (
        whereColumn &&
        operator &&
        value !== undefined &&
        value.trim().length > 0
      ) {
        const filterCol = getColumnName(params.table, whereColumn);
        const filterType = getColumnType(params.table, whereColumn);
        const whereCondition = buildSqlWhereCondition(
          filterCol,
          operator,
          value,
          filterType,
        );
        query += ` WHERE ${whereCondition}`;
      }

      query += ` GROUP BY ${groupedBySql}`;

      if (params.orderBy) {
        const isGroupField = groupFields.includes(params.orderBy.column);
        const orderCol = isGroupField
          ? `"${params.orderBy.column}"`
          : `"${aggregateAlias}"`;
        query += ` ORDER BY ${orderCol} ${params.orderBy.direction?.toUpperCase() || "ASC"}`;
      }

      if (params.limit) {
        query += ` LIMIT ${params.limit}`;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data = await (prisma as unknown as any).$queryRawUnsafe(query);
      sql = query;
    } else {
      // Use Prisma for standard queries
      data = await executePrismaQuery(params.table, params);
      sql = getLastQuery();
    }

    return {
      data: toClientSafeValue(data) as Record<string, unknown>[],
      sql,
    };
  } catch (error) {
    return {
      data: [],
      sql: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function executeRawSql(sql: string): Promise<QueryResult> {
  try {
    const trimmedSql = sql.trim();

    if (!trimmedSql) {
      return { data: [], sql: null, error: "SQL query cannot be empty" };
    }

    if (!isReadOnlySql(trimmedSql)) {
      return {
        data: [],
        sql: trimmedSql,
        error: "Only read-only SELECT/CTE queries are allowed",
      };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = await (prisma as unknown as any).$queryRawUnsafe(trimmedSql);

    return {
      data: toClientSafeValue(data) as Record<string, unknown>[],
      sql: trimmedSql,
    };
  } catch (error) {
    return {
      data: [],
      sql: sql.trim() || null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

function getTableName(modelName: string): string {
  // Map model names to table names (using @map from schema)
  const tableMap: Record<string, string> = {
    Customer: "customer",
    Account: "account",
    Loan: "loan",
    Transaction: "transactions",
    Branch: "branch",
    Employee: "employee",
    EmployeePhone: "employee_phone",
    CustomerPhone: "customer_phone",
    CustomerAccount: "customer_account",
    CustomerLoan: "customer_loan",
  };
  return tableMap[modelName] || modelName.toLowerCase();
}

function getColumnName(modelName: string, fieldName: string): string {
  const map = COLUMN_MAP_PRISMA_TO_DB[modelName] || {};
  return map[fieldName] || fieldName;
}

function getPrismaFieldName(modelName: string, columnName: string): string {
  const map = COLUMN_MAP_PRISMA_TO_DB[modelName] || {};
  const entry = Object.entries(map).find(
    ([, dbColumn]) => dbColumn === columnName,
  );
  return entry?.[0] || columnName;
}

function mapRowKeysToDatabaseColumns(
  modelName: string,
  row: Record<string, unknown>,
): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(row).map(([key, value]) => [
      getColumnName(modelName, key),
      value,
    ]),
  );
}

function getColumnType(
  modelName: string,
  fieldName: string,
): ColumnType | undefined {
  return tableConfig[modelName]?.columns.find((col) => col.name === fieldName)
    ?.type;
}

function parseFilterValue(
  value: string,
  columnType?: ColumnType,
): string | number {
  const isNumericColumn = columnType === "number" || columnType === "decimal";

  if (!isNumericColumn) {
    return value;
  }

  const parsed = Number(value);
  return Number.isNaN(parsed) ? value : parsed;
}

function normalizeOperator(operator: string, columnType?: ColumnType): string {
  if (!columnType) {
    return operator;
  }

  const allowed = OPERATORS_BY_TYPE[columnType] || ["="];
  return allowed.includes(operator) ? operator : allowed[0] || "=";
}

function buildSqlWhereCondition(
  column: string,
  operator: string,
  value: string,
  columnType?: ColumnType,
): string {
  const safeOperator = normalizeOperator(operator, columnType);
  const escapedValue = value.replace(/'/g, "''");
  const isNumericColumn = columnType === "number" || columnType === "decimal";
  const numericValue = Number(value);
  const sqlValue =
    isNumericColumn && !Number.isNaN(numericValue)
      ? String(numericValue)
      : `'${escapedValue}'`;

  switch (safeOperator) {
    case "=":
      return `"${column}" = ${sqlValue}`;
    case "!=":
      return `"${column}" != ${sqlValue}`;
    case ">":
      return `"${column}" > ${sqlValue}`;
    case "<":
      return `"${column}" < ${sqlValue}`;
    case ">=":
      return `"${column}" >= ${sqlValue}`;
    case "<=":
      return `"${column}" <= ${sqlValue}`;
    case "LIKE":
      return `"${column}" ILIKE '%${escapedValue}%'`;
    default:
      return "";
  }
}

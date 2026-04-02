"use server";

import { prisma, getLastQuery } from "@/lib/prisma";
import { tableConfig } from "@/lib/table-config";

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
    };

    if (decimalLike.constructor?.name === "Decimal") {
      return decimalLike.toString ? decimalLike.toString() : String(value);
    }

    const obj = value as Record<string, unknown>;
    return Object.fromEntries(
      Object.entries(obj).map(([key, entryValue]) => [
        key,
        toClientSafeValue(entryValue),
      ]),
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
      params.select.map((column) => [column, true]),
    );
  }

  // WHERE clause
  if (params.where) {
    const { column, operator, value } = params.where;
    queryOpts.where = buildWhereClause(column, operator, value);
  }

  // ORDER BY
  if (params.orderBy) {
    queryOpts.orderBy = {
      [params.orderBy.column]: params.orderBy.direction || "asc",
    };
  }

  // LIMIT
  if (params.limit) {
    queryOpts.take = params.limit;
  }

  return await prismaTable.findMany(queryOpts);
}

function buildWhereClause(
  column: string,
  operator: string,
  value: string,
): Record<string, unknown> {
  // Parse numeric values
  const numValue = !isNaN(Number(value)) ? Number(value) : value;

  switch (operator) {
    case "=":
      return { [column]: numValue };
    case "!=":
      return { [column]: { not: numValue } };
    case ">":
      return { [column]: { gt: numValue } };
    case "<":
      return { [column]: { lt: numValue } };
    case ">=":
      return { [column]: { gte: numValue } };
    case "<=":
      return { [column]: { lte: numValue } };
    case "LIKE":
      return { [column]: { contains: value, mode: "insensitive" } };
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
      const { column: groupColumn, operator, value } = params.where || {};
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

      if (groupColumn && operator && value) {
        const filterCol = getColumnName(params.table, groupColumn);
        const whereCondition = buildSqlWhereCondition(
          filterCol,
          operator,
          value,
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
  // Map field names to column names (using @map from schema)
  const columnMap: Record<string, Record<string, string>> = {
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

  const map = columnMap[modelName] || {};
  return map[fieldName] || fieldName;
}

function buildSqlWhereCondition(
  column: string,
  operator: string,
  value: string,
): string {
  const numValue = !isNaN(Number(value))
    ? Number(value)
    : `'${value.replace(/'/g, "''")}'`;

  switch (operator) {
    case "=":
      return `"${column}" = ${numValue}`;
    case "!=":
      return `"${column}" != ${numValue}`;
    case ">":
      return `"${column}" > ${numValue}`;
    case "<":
      return `"${column}" < ${numValue}`;
    case ">=":
      return `"${column}" >= ${numValue}`;
    case "<=":
      return `"${column}" <= ${numValue}`;
    case "LIKE":
      return `"${column}" ILIKE '%${(value as string).replace(/'/g, "''")}%'`;
    default:
      return "";
  }
}

"use server";

import { prisma, getLastQuery } from "@/lib/prisma";
import { tableConfig } from "@/lib/table-config";

export interface QueryParams {
  table: string;
  orderBy?: { column: string; direction: "asc" | "desc" };
  groupBy?: string;
  where?: { column: string; operator: string; value: string };
  limit?: number;
}

export interface QueryResult {
  data: any[];
  sql: string | null;
  error?: string;
}

async function executePrismaQuery(
  table: string,
  params: QueryParams,
): Promise<any[]> {
  const prismaTable = (prisma as any)[table];

  if (!prismaTable) {
    throw new Error(`Table ${table} not found`);
  }

  const queryOpts: any = {};

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
): any {
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

    let data: any[] = [];
    let sql: string | null = null;

    if (params.groupBy) {
      // Use raw SQL for GROUP BY
      const { column: groupColumn, operator, value } = params.where || {};
      const tableName = getTableName(params.table);
      const columnName = getColumnName(params.table, params.groupBy);
      const countAlias = "count";

      let query = `SELECT "${columnName}", COUNT(*) as "${countAlias}" FROM "${tableName}"`;

      if (groupColumn && operator && value) {
        const filterCol = getColumnName(params.table, groupColumn);
        const whereCondition = buildSqlWhereCondition(
          filterCol,
          operator,
          value,
        );
        query += ` WHERE ${whereCondition}`;
      }

      query += ` GROUP BY "${columnName}"`;

      if (params.orderBy) {
        const orderCol =
          params.orderBy.column === params.groupBy
            ? `"${columnName}"`
            : `"${countAlias}"`;
        query += ` ORDER BY ${orderCol} ${params.orderBy.direction?.toUpperCase() || "ASC"}`;
      }

      if (params.limit) {
        query += ` LIMIT ${params.limit}`;
      }

      data = await (prisma as any).$queryRawUnsafe(query);
      sql = query;
    } else {
      // Use Prisma for standard queries
      data = await executePrismaQuery(params.table, params);
      sql = getLastQuery();
    }

    return { data, sql };
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

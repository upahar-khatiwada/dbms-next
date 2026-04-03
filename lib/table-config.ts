// Table and column metadata for the query builder

export type ColumnType = "string" | "number" | "decimal" | "date" | "enum";

export interface ColumnDef {
  name: string;
  type: ColumnType;
  groupable?: boolean;
  filterable?: boolean;
}

export interface TableDef {
  name: string;
  displayName: string;
  columns: ColumnDef[];
}

export const tableConfig: Record<string, TableDef> = {
  Customer: {
    name: "Customer",
    displayName: "customer",
    columns: [
      {
        name: "customer_id",
        type: "number",
        groupable: true,
        filterable: true,
      },
      { name: "name", type: "string", groupable: true, filterable: true },
      { name: "address", type: "string", groupable: true, filterable: true },
      { name: "date_of_birth", type: "date", filterable: true },
      { name: "branch_id", type: "number", groupable: true, filterable: true },
    ],
  },
  Account: {
    name: "Account",
    displayName: "account",
    columns: [
      { name: "acc_no", type: "number", groupable: true, filterable: true },
      { name: "balance", type: "decimal", filterable: true },
    ],
  },
  Loan: {
    name: "Loan",
    displayName: "loan",
    columns: [
      { name: "loan_id", type: "number", groupable: true, filterable: true },
      { name: "amount", type: "decimal", filterable: true },
    ],
  },
  Transaction: {
    name: "Transaction",
    displayName: "transactions",
    columns: [
      {
        name: "transaction_id",
        type: "number",
        groupable: true,
        filterable: true,
      },
      { name: "acc_no", type: "number", groupable: true, filterable: true },
      { name: "type", type: "enum", groupable: true, filterable: true },
      { name: "amount", type: "decimal", filterable: true },
      { name: "date", type: "date", groupable: true, filterable: true },
    ],
  },
  Branch: {
    name: "Branch",
    displayName: "branch",
    columns: [
      { name: "branch_id", type: "number", groupable: true, filterable: true },
      { name: "name", type: "string", groupable: true, filterable: true },
      { name: "address", type: "string", groupable: true, filterable: true },
    ],
  },
  Employee: {
    name: "Employee",
    displayName: "employee",
    columns: [
      {
        name: "employee_id",
        type: "number",
        groupable: true,
        filterable: true,
      },
      { name: "branch_id", type: "number", groupable: true, filterable: true },
      { name: "name", type: "string", groupable: true, filterable: true },
      { name: "address", type: "string", groupable: true, filterable: true },
      { name: "salary", type: "decimal", groupable: true, filterable: true },
    ],
  },
  CustomerPhone: {
    name: "CustomerPhone",
    displayName: "customer_phone",
    columns: [
      { name: "id", type: "number", groupable: true, filterable: true },
      {
        name: "customer_id",
        type: "number",
        groupable: true,
        filterable: true,
      },
      { name: "phone_number", type: "string", filterable: true },
    ],
  },
  EmployeePhone: {
    name: "EmployeePhone",
    displayName: "employee_phone",
    columns: [
      { name: "id", type: "number", groupable: true, filterable: true },
      {
        name: "employee_id",
        type: "number",
        groupable: true,
        filterable: true,
      },
      { name: "phone_number", type: "string", filterable: true },
    ],
  },
  CustomerAccount: {
    name: "CustomerAccount",
    displayName: "customer_account",
    columns: [
      {
        name: "customer_id",
        type: "number",
        groupable: true,
        filterable: true,
      },
      { name: "acc_no", type: "number", groupable: true, filterable: true },
    ],
  },
  CustomerLoan: {
    name: "CustomerLoan",
    displayName: "customer_loan",
    columns: [
      {
        name: "customer_id",
        type: "number",
        groupable: true,
        filterable: true,
      },
      { name: "loan_id", type: "number", groupable: true, filterable: true },
    ],
  },
};

export function getTableNames(): string[] {
  return Object.keys(tableConfig);
}

export function getTableConfig(tableName: string): TableDef | null {
  return tableConfig[tableName] || null;
}

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
    displayName: "Customers",
    columns: [
      { name: "customerId", type: "number", groupable: true, filterable: true },
      { name: "name", type: "string", groupable: true, filterable: true },
      { name: "address", type: "string", filterable: true },
      { name: "dateOfBirth", type: "date", filterable: true },
      { name: "branchId", type: "number", groupable: true, filterable: true },
    ],
  },
  Account: {
    name: "Account",
    displayName: "Accounts",
    columns: [
      { name: "accNo", type: "number", groupable: true, filterable: true },
      { name: "balance", type: "decimal", filterable: true },
    ],
  },
  Loan: {
    name: "Loan",
    displayName: "Loans",
    columns: [
      { name: "loanId", type: "number", groupable: true, filterable: true },
      { name: "amount", type: "decimal", filterable: true },
    ],
  },
  Transaction: {
    name: "Transaction",
    displayName: "Transactions",
    columns: [
      {
        name: "transactionId",
        type: "number",
        groupable: true,
        filterable: true,
      },
      { name: "accNo", type: "number", groupable: true, filterable: true },
      { name: "type", type: "enum", groupable: true, filterable: true },
      { name: "amount", type: "decimal", filterable: true },
      { name: "date", type: "date", groupable: true, filterable: true },
    ],
  },
  Branch: {
    name: "Branch",
    displayName: "Branches",
    columns: [
      { name: "branchId", type: "number", groupable: true, filterable: true },
      { name: "name", type: "string", groupable: true, filterable: true },
      { name: "address", type: "string", filterable: true },
    ],
  },
  Employee: {
    name: "Employee",
    displayName: "Employees",
    columns: [
      { name: "employeeId", type: "number", groupable: true, filterable: true },
      { name: "branchId", type: "number", groupable: true, filterable: true },
      { name: "name", type: "string", groupable: true, filterable: true },
      { name: "address", type: "string", filterable: true },
      { name: "salary", type: "decimal", filterable: true },
    ],
  },
  CustomerPhone: {
    name: "CustomerPhone",
    displayName: "Customer Phones",
    columns: [
      { name: "id", type: "number", groupable: true, filterable: true },
      { name: "customerId", type: "number", groupable: true, filterable: true },
      { name: "phoneNumber", type: "string", filterable: true },
    ],
  },
  EmployeePhone: {
    name: "EmployeePhone",
    displayName: "Employee Phones",
    columns: [
      { name: "id", type: "number", groupable: true, filterable: true },
      { name: "employeeId", type: "number", groupable: true, filterable: true },
      { name: "phoneNumber", type: "string", filterable: true },
    ],
  },
  CustomerAccount: {
    name: "CustomerAccount",
    displayName: "Customer Accounts",
    columns: [
      { name: "customerId", type: "number", groupable: true, filterable: true },
      { name: "accNo", type: "number", groupable: true, filterable: true },
    ],
  },
  CustomerLoan: {
    name: "CustomerLoan",
    displayName: "Customer Loans",
    columns: [
      { name: "customerId", type: "number", groupable: true, filterable: true },
      { name: "loanId", type: "number", groupable: true, filterable: true },
    ],
  },
};

export function getTableNames(): string[] {
  return Object.keys(tableConfig);
}

export function getTableConfig(tableName: string): TableDef | null {
  return tableConfig[tableName] || null;
}

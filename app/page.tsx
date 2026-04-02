"use client";

import { useState, useEffect } from "react";
import { executeQuery, type QueryParams } from "@/app/actions";
import {
  getTableNames,
  getTableConfig,
  type ColumnType,
  type TableDef,
} from "@/lib/table-config";

const OPERATORS_BY_TYPE: Record<ColumnType, string[]> = {
  string: ["=", "!=", "LIKE"],
  enum: ["=", "!=", "LIKE"],
  number: ["=", "!=", ">", "<", ">=", "<="],
  decimal: ["=", "!=", ">", "<", ">=", "<="],
  date: ["=", "!=", ">", "<", ">=", "<="],
};

interface QueryState extends QueryParams {
  limit: number;
}

interface QueryResultData {
  data: Record<string, unknown>[];
  sql: string | null;
  error?: string;
}

export default function Dashboard() {
  const [selectedTable, setSelectedTable] = useState<string>("Customer");
  const [tableConfig, setTableConfig] = useState<TableDef | null>(null);
  const [queryState, setQueryState] = useState<QueryState>({
    table: "Customer",
    limit: 50,
  });
  const [result, setResult] = useState<QueryResultData | null>(null);
  const [loading, setLoading] = useState(false);

  // Load table config when selected table changes
  useEffect(() => {
    const config = getTableConfig(selectedTable);
    setTableConfig(config);
    setQueryState((prev) => ({
      ...prev,
      table: selectedTable,
      select: undefined,
      orderBy: undefined,
      groupBy: undefined,
      aggregation: undefined,
      where: undefined,
    }));
    setResult(null);
  }, [selectedTable]);

  const resolvedTableConfig = getTableConfig(selectedTable) || tableConfig;

  useEffect(() => {
    if (!queryState.where || !resolvedTableConfig) {
      return;
    }

    const selectedColumn = resolvedTableConfig.columns.find(
      (col) => col.name === queryState.where?.column,
    );

    if (!selectedColumn) {
      return;
    }

    const allowedOperators = OPERATORS_BY_TYPE[selectedColumn.type];
    if (!allowedOperators.includes(queryState.where.operator)) {
      setQueryState((prev) =>
        prev.where
          ? {
              ...prev,
              where: {
                ...prev.where,
                operator: allowedOperators[0] || "=",
              },
            }
          : prev,
      );
    }
  }, [queryState.where, resolvedTableConfig]);

  const handleRunQuery = async () => {
    setLoading(true);
    try {
      const result = await executeQuery(queryState);
      setResult(result);
    } catch (error) {
      setResult({
        data: [],
        sql: null,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setLoading(false);
    }
  };

  const tableNames = getTableNames();
  const numericColumns =
    resolvedTableConfig?.columns.filter(
      (col) => col.type === "number" || col.type === "decimal",
    ) || [];
  const selectedWhereColumn = resolvedTableConfig?.columns.find(
    (col) => col.name === queryState.where?.column,
  );
  const whereOperators = selectedWhereColumn
    ? OPERATORS_BY_TYPE[selectedWhereColumn.type]
    : ["="];

  return (
    <div className="flex min-h-screen flex-col bg-slate-900 text-slate-100 md:h-screen md:flex-row">
      <div className="w-full overflow-x-auto border-b border-slate-700 bg-slate-950 p-3 md:w-52 md:overflow-y-auto md:border-b-0 md:border-r md:p-4">
        <h2 className="mb-3 text-base font-semibold text-slate-200 md:mb-4 md:text-lg">
          Tables
        </h2>
        <div className="flex gap-2 md:block md:space-y-2">
          {tableNames.map((table) => (
            <button
              key={table}
              onClick={() => setSelectedTable(table)}
              className={`shrink-0 cursor-pointer rounded px-3 py-2 text-left transition-colors md:w-full ${
                selectedTable === table
                  ? "bg-blue-600 text-white"
                  : "hover:bg-slate-700"
              }`}
            >
              {getTableConfig(table)?.displayName || table}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b border-slate-700 bg-slate-800 p-3 md:p-4">
          <h1 className="text-xl font-bold text-slate-100 md:text-2xl">
            {resolvedTableConfig?.displayName || "Database Explorer"}
          </h1>
        </div>

        {/* Content Area */}
        <div className="flex-1 space-y-4 overflow-auto p-3 md:space-y-6 md:p-6">
          {/* Query Builder */}
          <div className="rounded-lg border border-slate-700 bg-slate-800 p-4 md:p-6">
            <h2 className="text-lg font-semibold text-slate-200 mb-4">
              Query Builder
            </h2>

            <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* SELECT columns */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  SELECT COLUMNS
                </label>
                <div className="rounded border border-slate-600 bg-slate-700 p-3">
                  <div className="mb-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setQueryState((prev) => ({
                          ...prev,
                          select: resolvedTableConfig?.columns.map(
                            (col) => col.name,
                          ),
                        }))
                      }
                      className="rounded bg-slate-600 px-2 py-1 text-xs text-slate-100 hover:bg-slate-500"
                    >
                      Select All
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setQueryState((prev) => ({
                          ...prev,
                          select: undefined,
                        }))
                      }
                      className="rounded bg-slate-600 px-2 py-1 text-xs text-slate-100 hover:bg-slate-500"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="grid max-h-32 grid-cols-1 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
                    {resolvedTableConfig?.columns.map((col) => {
                      const checked = (queryState.select || []).includes(
                        col.name,
                      );

                      return (
                        <label
                          key={col.name}
                          className="flex items-center gap-2 text-sm text-slate-200"
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={(e) => {
                              setQueryState((prev) => {
                                const current = prev.select || [];
                                const next = e.target.checked
                                  ? [...current, col.name]
                                  : current.filter((name) => name !== col.name);

                                return {
                                  ...prev,
                                  select: next.length > 0 ? next : undefined,
                                };
                              });
                            }}
                            className="h-4 w-4 rounded border-slate-500 bg-slate-800"
                          />
                          <span>{col.name}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  Without GROUP BY, leaving all unchecked selects all columns.
                  With GROUP BY, leaving all unchecked groups by only the GROUP
                  BY column.
                </p>
              </div>

              {/* ORDER BY */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  ORDER BY
                </label>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <select
                    value={queryState.orderBy?.column || ""}
                    onChange={(e) =>
                      setQueryState((prev) =>
                        e.target.value
                          ? {
                              ...prev,
                              orderBy: {
                                column: e.target.value,
                                direction: "asc",
                              },
                            }
                          : { ...prev, orderBy: undefined },
                      )
                    }
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-slate-100 focus:outline-none focus:border-blue-500 sm:flex-1"
                  >
                    <option value="">None</option>
                    {resolvedTableConfig?.columns.map((col) => (
                      <option key={col.name} value={col.name}>
                        {col.name}
                      </option>
                    ))}
                  </select>
                  <select
                    value={queryState.orderBy?.direction || "asc"}
                    onChange={(e) =>
                      setQueryState((prev) =>
                        prev.orderBy
                          ? {
                              ...prev,
                              orderBy: {
                                ...prev.orderBy,
                                direction: e.target.value as "asc" | "desc",
                              },
                            }
                          : prev,
                      )
                    }
                    disabled={!queryState.orderBy}
                    className="px-3 py-2 bg-slate-700 border border-slate-600 rounded text-slate-100 focus:outline-none focus:border-blue-500 disabled:opacity-50"
                  >
                    <option value="asc">ASC</option>
                    <option value="desc">DESC</option>
                  </select>
                </div>
              </div>

              {/* GROUP BY */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  GROUP BY
                </label>
                <select
                  value={queryState.groupBy || ""}
                  onChange={(e) =>
                    setQueryState((prev) => ({
                      ...prev,
                      groupBy: e.target.value || undefined,
                      aggregation: e.target.value
                        ? prev.aggregation || { function: "count" }
                        : undefined,
                    }))
                  }
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-slate-100 focus:outline-none focus:border-blue-500"
                >
                  <option value="">None</option>
                  {resolvedTableConfig?.columns
                    .filter((col) => col.groupable)
                    .map((col) => (
                      <option key={col.name} value={col.name}>
                        {col.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* Aggregation */}
            <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  AGG FUNCTION
                </label>
                <select
                  value={queryState.aggregation?.function || "count"}
                  onChange={(e) =>
                    setQueryState((prev) => ({
                      ...prev,
                      aggregation: {
                        function: e.target.value as
                          | "count"
                          | "sum"
                          | "avg"
                          | "min"
                          | "max",
                        column:
                          e.target.value === "count"
                            ? undefined
                            : prev.aggregation?.column ||
                              numericColumns[0]?.name,
                      },
                    }))
                  }
                  disabled={!queryState.groupBy}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-slate-100 focus:outline-none focus:border-blue-500 disabled:opacity-50"
                >
                  <option value="count">COUNT</option>
                  <option value="sum">SUM</option>
                  <option value="avg">AVG</option>
                  <option value="min">MIN</option>
                  <option value="max">MAX</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  AGG COLUMN
                </label>
                <select
                  value={queryState.aggregation?.column || ""}
                  onChange={(e) =>
                    setQueryState((prev) => ({
                      ...prev,
                      aggregation: prev.aggregation
                        ? {
                            ...prev.aggregation,
                            column: e.target.value || undefined,
                          }
                        : prev.aggregation,
                    }))
                  }
                  disabled={
                    !queryState.groupBy ||
                    queryState.aggregation?.function === "count"
                  }
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-slate-100 focus:outline-none focus:border-blue-500 disabled:opacity-50"
                >
                  <option value="" disabled>
                    Select numeric column
                  </option>
                  {numericColumns.map((col) => (
                    <option key={col.name} value={col.name}>
                      {col.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:gap-6">
              <div className="mb-4 w-full lg:mb-0 lg:flex-1">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  WHERE Filter
                </label>
                <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                  <select
                    value={queryState.where?.column || ""}
                    onChange={(e) =>
                      setQueryState((prev) => {
                        if (!e.target.value) {
                          return { ...prev, where: undefined };
                        }

                        const nextColumn = resolvedTableConfig?.columns.find(
                          (col) => col.name === e.target.value,
                        );
                        const operators = nextColumn
                          ? OPERATORS_BY_TYPE[nextColumn.type]
                          : ["="];

                        return {
                          ...prev,
                          where: {
                            column: e.target.value,
                            operator: operators[0] || "=",
                            value: "",
                          },
                        };
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-slate-100 focus:outline-none focus:border-blue-500 sm:w-auto sm:min-w-44"
                  >
                    <option value="">None</option>
                    {resolvedTableConfig?.columns
                      .filter((col) => col.filterable)
                      .map((col) => (
                        <option key={col.name} value={col.name}>
                          {col.name}
                        </option>
                      ))}
                  </select>

                  {queryState.where && (
                    <>
                      <select
                        key={`${queryState.where.column}-${selectedWhereColumn?.type || "unknown"}`}
                        value={queryState.where.operator}
                        onChange={(e) =>
                          setQueryState((prev) =>
                            prev.where
                              ? {
                                  ...prev,
                                  where: {
                                    ...prev.where,
                                    operator: e.target.value,
                                  },
                                }
                              : prev,
                          )
                        }
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-slate-100 focus:outline-none focus:border-blue-500 sm:w-auto"
                      >
                        {whereOperators.map((operator) => (
                          <option key={operator} value={operator}>
                            {operator}
                          </option>
                        ))}
                      </select>

                      <input
                        type="text"
                        value={queryState.where.value}
                        onChange={(e) =>
                          setQueryState((prev) =>
                            prev.where
                              ? {
                                  ...prev,
                                  where: {
                                    ...prev.where,
                                    value: e.target.value,
                                  },
                                }
                              : prev,
                          )
                        }
                        placeholder="Filter value"
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 sm:min-w-52 sm:flex-1"
                      />
                    </>
                  )}
                </div>
              </div>

              <div className="mb-4 w-full sm:w-auto lg:mb-0">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  LIMIT
                </label>
                <input
                  type="number"
                  value={queryState.limit}
                  onChange={(e) =>
                    setQueryState((prev) => ({
                      ...prev,
                      limit: Math.max(1, parseInt(e.target.value) || 1),
                    }))
                  }
                  min="1"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-slate-100 focus:outline-none focus:border-blue-500 sm:w-32"
                />
              </div>
            </div>

            <button
              onClick={handleRunQuery}
              disabled={loading}
              className="w-full cursor-pointer rounded bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400 sm:w-auto"
            >
              {loading ? "Running..." : "Run Query"}
            </button>
          </div>

          {result && (
            <>
              <div className="rounded-lg border border-slate-700 bg-slate-800 p-4 md:p-6">
                <h2 className="text-lg font-semibold text-slate-200 mb-4">
                  Results ({result.data.length} rows)
                </h2>

                {result.error ? (
                  <div className="p-4 bg-red-900/30 border border-red-800 rounded text-red-200">
                    {result.error}
                  </div>
                ) : result.data.length === 0 ? (
                  <div className="p-4 text-slate-400">No results found</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs sm:text-sm">
                      <thead>
                        <tr className="border-b border-slate-600">
                          {Object.keys(result.data[0] || {}).map((key) => (
                            <th
                              key={key}
                              className="px-2 py-2 text-left font-semibold text-slate-300 sm:px-4"
                            >
                              {key}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {result.data.slice(0, 100).map((row, idx) => (
                          <tr
                            key={idx}
                            className="border-b border-slate-700 hover:bg-slate-700/50"
                          >
                            {Object.values(row).map(
                              (value: unknown, colIdx) => (
                                <td
                                  key={colIdx}
                                  className="px-2 py-2 text-slate-100 sm:px-4"
                                >
                                  {value === null
                                    ? "NULL"
                                    : value instanceof Date
                                      ? value.toLocaleString()
                                      : String(value)}
                                </td>
                              ),
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {result.data.length > 100 && (
                      <div className="mt-4 text-slate-400 text-sm">
                        Showing first 100 of {result.data.length} rows
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* SQL Viewer */}
              {result.sql && (
                <div className="rounded-lg border border-slate-700 bg-slate-800 p-4 md:p-6">
                  <h2 className="text-lg font-semibold text-slate-200 mb-4">
                    SQL Query
                  </h2>
                  <pre className="bg-slate-900 border border-slate-600 rounded p-4 overflow-x-auto">
                    <code className="text-slate-100 font-mono text-sm">
                      {result.sql}
                    </code>
                  </pre>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

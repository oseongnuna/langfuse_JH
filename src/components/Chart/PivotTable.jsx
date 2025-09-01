/**
 * @fileoverview PivotTable Chart Component
 *
 * A configurable pivot table widget component that displays data in a tabular format
 * with support for multiple dimensions (currently up to 2), metrics as columns,
 * subtotals, and grand totals.
 */

import React, { useMemo, useCallback, useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "./Table";
import {
  transformToPivotTable,
  extractDimensionValues,
  extractMetricValues,
  sortPivotTableRows,
  getNextSortState,
  DEFAULT_ROW_LIMIT,
} from "./pivot-table-utils";
import { numberFormatter } from "./numbers";
import { formatMetricName } from "./widget-utils";
import { Loader2 } from "lucide-react";
import styles from "./PivotTable.module.css";

/**
 * Non-sortable column header component
 */
const StaticHeader = ({ label, className = "" }) => {
  return (
    <TableHead className={`${styles.tableHead} ${className}`}>
      <div className={styles.headerContent}>
        <span className={styles.headerLabel}>{label}</span>
      </div>
    </TableHead>
  );
};

/**
 * Sortable column header component
 */
const SortableHeader = ({
  column,
  label,
  sortState,
  onSort,
  className = "",
  rightAlign = false,
}) => {
  const isSorted = sortState?.column === column;
  const sortDirection = isSorted ? sortState.order : null;

  const handleClick = useCallback(
    (event) => {
      event.preventDefault();
      onSort(column);
    },
    [column, onSort],
  );

  return (
    <TableHead
      className={`${styles.tableHead} ${styles.tableHeadSortable} ${className}`}
      onClick={handleClick}
    >
      <div
        className={`${styles.headerContent} ${
          rightAlign ? styles.headerContentRight : styles.headerContentLeft
        }`}
      >
        <span className={styles.headerLabel}>{label}</span>
        {isSorted && (
          <span
            className={styles.sortIndicator}
            title={
              sortDirection === "ASC"
                ? "Sorted ascending"
                : "Sort by this column"
            }
          >
            {sortDirection === "ASC" ? "▲" : "▼"}
          </span>
        )}

        <div className={styles.hoverIndicator} />
      </div>
    </TableHead>
  );
};

/**
 * Individual row component for the pivot table
 */
const PivotTableRowComponent = ({ row, metrics }) => {
  const getRowClasses = () => {
    let classes = styles.tableRow;
    if (row.isSubtotal) classes += ` ${styles.tableRowSubtotal}`;
    if (row.isTotal) classes += ` ${styles.tableRowTotal}`;
    return classes;
  };

  const getCellClasses = () => {
    let classes = styles.tableCell;
    if (row.isSubtotal || row.isTotal) classes += ` ${styles.tableCellBold}`;
    
    // Apply indentation based on level
    if (row.level === 1) classes += ` ${styles.indent1}`;
    if (row.level === 2) classes += ` ${styles.indent2}`;
    
    return classes;
  };

  const getMetricCellClasses = () => {
    let classes = `${styles.tableCell} ${styles.tableCellNumeric}`;
    if (row.isSubtotal || row.isTotal) classes += ` ${styles.tableCellBold}`;
    return classes;
  };

  return (
    <TableRow className={getRowClasses()}>
      {/* Dimension column with indentation and styling */}
      <TableCell
        className={getCellClasses()}
        style={{
          // Fallback for levels beyond 2 using inline styles
          paddingLeft:
            row.level > 2 ? `${row.level * 1.5 + 0.5}rem` : undefined,
        }}
      >
        {row.label}
      </TableCell>

      {/* Metric columns */}
      {metrics.map((metric) => (
        <TableCell
          key={metric}
          className={getMetricCellClasses()}
        >
          {formatMetricValue(row.values[metric])}
        </TableCell>
      ))}
    </TableRow>
  );
};

/**
 * Formats metric values for display in the table
 */
function formatMetricValue(value) {
  if (typeof value === "string") {
    return value;
  }

  return numberFormatter(value, 2).replace(/\.00$/, "");
}

/**
 * Formats metric names for column headers
 */
function formatColumnHeader(metricName) {
  return formatMetricName(metricName);
}

/**
 * Main PivotTable Component
 */
export const PivotTable = ({
  data,
  config,
  chartConfig,
  accessibilityLayer,
  sortState,
  onSortChange,
  isLoading = false,
}) => {
  // Transform chart data into pivot table structure
  const pivotTableRows = useMemo(() => {
    if (!data || data.length === 0) {
      return [];
    }

    // Extract configuration with defaults
    const pivotConfig = {
      dimensions: config?.dimensions ?? [],
      metrics: config?.metrics ?? ["metric"],
      rowLimit: config?.rowLimit ?? DEFAULT_ROW_LIMIT,
      defaultSort: config?.defaultSort,
    };

    // Transform DataPoint[] to DatabaseRow[] format using utility functions
    const databaseRows = data.map((point) => {
      const rowData = point;
      const row = { ...rowData };

      const dimensionValues = extractDimensionValues(
        row,
        pivotConfig.dimensions,
      );
      const metricValues = extractMetricValues(row, pivotConfig.metrics);

      const result = {
        ...dimensionValues,
        ...metricValues,
      };

      if (point.time_dimension !== undefined) {
        result.time_dimension = point.time_dimension;
      }

      if (point.metric !== undefined) {
        if (typeof point.metric === "number") {
          result.metric = point.metric;
        } else if (Array.isArray(point.metric)) {
          result.metric = point.metric
            .flat()
            .reduce((sum, val) => sum + val, 0);
        }
      }

      return result;
    });

    try {
      return transformToPivotTable(databaseRows, pivotConfig);
    } catch (error) {
      console.error("Error transforming data to pivot table:", error);
      return [];
    }
  }, [data, config]);

  // Apply sorting to pivot table rows
  const sortedRows = useMemo(() => {
    if (!sortState || !sortState.column) {
      return pivotTableRows;
    }

    try {
      return sortPivotTableRows(pivotTableRows, sortState);
    } catch (error) {
      console.error("Error sorting pivot table rows:", error);
      return pivotTableRows;
    }
  }, [pivotTableRows, sortState]);

  // Extract metrics from configuration or fallback to default
  const metrics = useMemo(() => {
    return config?.metrics ?? ["metric"];
  }, [config?.metrics]);

  // Handle sort click events
  const handleSort = useCallback(
    (column) => {
      if (!onSortChange) return;
      const nextSort = getNextSortState(
        config?.defaultSort || null,
        sortState || null,
        column,
      );
      onSortChange(nextSort);
    },
    [sortState, onSortChange, config?.defaultSort],
  );

  // Track the last known defaultSort to detect changes
  const [lastDefaultSort, setLastDefaultSort] = useState(config?.defaultSort);

  // Reset to defaultSort when it changes
  useEffect(() => {
    const currentDefaultSort = config?.defaultSort;

    if (currentDefaultSort !== lastDefaultSort) {
      setLastDefaultSort(currentDefaultSort);

      if (onSortChange) {
        onSortChange(currentDefaultSort || null);
      }
    }
  }, [config?.defaultSort, onSortChange, lastDefaultSort]);

  // Handle empty data state
  if (!data || data.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyStateContent}>
          <p className={styles.emptyStateText}>No data available</p>
        </div>
      </div>
    );
  }

  // Handle transformation errors
  if (pivotTableRows.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyStateContent}>
          <p className={styles.emptyStateText}>
            Unable to process data for pivot table
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {isLoading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingContent}>
            <Loader2 className={styles.spinner} />
            <span>Refreshing data...</span>
          </div>
        </div>
      )}
      <Table className={styles.table}>
        <TableHeader className={styles.tableHeader}>
          <TableRow>
            {/* Dimension column header */}
            <StaticHeader
              label={
                config?.dimensions && config.dimensions.length > 0
                  ? config.dimensions.map(formatColumnHeader).join(" / ")
                  : "Dimension"
              }
              className=""
            />

            {/* Metric column headers */}
            {metrics.map((metric) => (
              <SortableHeader
                key={metric}
                column={metric}
                label={formatColumnHeader(metric)}
                sortState={sortState}
                onSort={handleSort}
                className=""
                rightAlign={true}
              />
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {sortedRows.map((row) => (
            <PivotTableRowComponent key={row.id} row={row} metrics={metrics} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PivotTable;
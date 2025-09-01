import React from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip } from "./chart";
import { compactSmallNumberFormatter } from "./numbers";
import styles from "./Chart.module.css";

/**
 * HistogramChart component for displaying histogram data
 * @param {Object} props - Component props
 * @param {Array} props.data - Array of data points for the histogram
 */
const HistogramChart = ({ data }) => {
  /**
   * Transform data points into histogram format
   * @param {Array} data - Array of data points
   * @returns {Array} - Transformed histogram data
   */
  const transformHistogramData = (data) => {
    if (!data.length) return [];

    // Check if this is ClickHouse histogram format (array of tuples)
    const firstDataPoint = data[0];
    if (firstDataPoint?.metric && Array.isArray(firstDataPoint.metric)) {
      // ClickHouse histogram format: [(lower, upper, height), ...]
      return firstDataPoint.metric.map(([lower, upper, height]) => ({
        binLabel: `[${compactSmallNumberFormatter(lower)}, ${compactSmallNumberFormatter(upper)}]`,
        count: height,
        lower,
        upper,
        height,
      }));
    }

    // Fallback: treat as regular data points with binLabel
    return data.map((item) => ({
      binLabel: item.dimension || `Bin ${data.indexOf(item) + 1}`,
      count: item.metric || 0,
    }));
  };

  const histogramData = transformHistogramData(data);

  // Chart configuration
  const config = {
    count: {
      label: "Count",
      color: "hsl(var(--chart-1))",
    },
  };

  if (!histogramData.length) {
    return (
      <div className={styles.noData}>
        No data available
      </div>
    );
  }

  return (
    <ChartContainer config={config}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={histogramData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis
            dataKey="binLabel"
            stroke="hsl(var(--chart-grid))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            angle={-45}
            textAnchor="end"
            height={90}
          />
          <YAxis
            stroke="hsl(var(--chart-grid))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Bar
            dataKey="count"
            fill="hsl(var(--chart-1))"
            radius={[2, 2, 0, 0]}
          />
          <ChartTooltip
            contentStyle={{ backgroundColor: "hsl(var(--background))" }}
            formatter={(value, name) => [
              `${value}`,
              name === "count" ? "Count" : name,
            ]}
            labelFormatter={(label) => `Bin: ${label}`}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default HistogramChart;
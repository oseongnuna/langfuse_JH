import React from "react";
import { ChartContainer, ChartTooltip } from "./chart";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { formatAxisLabel } from "./utils";
import styles from "./Chart.module.css";

/**
 * HorizontalBarChart component
 * @param {Object} props - Component props
 * @param {Array} props.data - Data to be displayed. Expects an array of objects with dimension and metric properties.
 * @param {Object} props.config - Configuration object for the chart. Can include theme settings for light and dark modes.
 * @param {boolean} props.accessibilityLayer - Boolean to enable or disable the accessibility layer. Default is true.
 */
export const HorizontalBarChart = ({
  data,
  config = {
    metric: {
      theme: {
        light: "hsl(var(--chart-1))",
        dark: "hsl(var(--chart-1))",
      },
    },
  },
  accessibilityLayer = true,
}) => {
  return (
    <ChartContainer config={config}>
      <BarChart
        accessibilityLayer={accessibilityLayer}
        data={data}
        layout="vertical"
      >
        <XAxis
          type="number"
          stroke="hsl(var(--chart-grid))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          type="category"
          dataKey="dimension"
          stroke="hsl(var(--chart-grid))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={formatAxisLabel}
          width={90}
        />
        <Bar
          dataKey="metric"
          radius={[0, 4, 4, 0]}
          className={styles.horizontalBarFill}
        />
        <ChartTooltip
          contentStyle={{ backgroundColor: "hsl(var(--background))" }}
          itemStyle={{ color: "hsl(var(--foreground))" }}
        />
      </BarChart>
    </ChartContainer>
  );
};

export default HorizontalBarChart;
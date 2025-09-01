/**
 * @typedef {Object} DataPoint
 * @property {string|undefined} time_dimension - Time dimension for the data point
 * @property {string|undefined} dimension - Dimension category for the data point
 * @property {number|Array<Array<number>>} metric - Metric value(s) for the data point
 */

/**
 * @typedef {Object} ChartConfig
 * @property {Object} [label] - Optional label configuration
 * @property {Function} [icon] - Optional icon component
 * @property {string} [color] - Optional color value
 * @property {Object} [theme] - Optional theme configuration with light/dark variants
 */

/**
 * @typedef {Object} ChartProps
 * @property {DataPoint[]} data - Array of data points to display in the chart
 * @property {ChartConfig} [config] - Optional chart configuration object
 * @property {boolean} [accessibilityLayer] - Optional accessibility layer toggle (default: true)
 */

// Export empty object since this is just for type definitions converted to JSDoc
export {};
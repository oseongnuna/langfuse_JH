/**
 * Format numbers in compact notation (e.g., 1.2K, 3.4M)
 * @param {number|bigint} [number] - Number to format
 * @param {number} [maxFractionDigits] - Maximum fraction digits to display
 * @returns {string} - Formatted number string
 */
export const compactNumberFormatter = (
    number,
    maxFractionDigits,
  ) => {
    return Intl.NumberFormat("en-US", {
      notation: "compact",
      compactDisplay: "short",
      maximumFractionDigits: maxFractionDigits ?? 2,
    }).format(number ?? 0);
  };
  
  /**
   * Specialized formatter for very small numbers (10^-3 to 10^-15 range)
   * Uses scientific notation for compact representation with ~3 significant digits
   * @param {number|bigint} [number] - Number to format
   * @param {number} [significantDigits=3] - Number of significant digits
   * @returns {string} - Formatted number string
   */
  export const compactSmallNumberFormatter = (
    number,
    significantDigits = 3,
  ) => {
    const num = Number(number ?? 0);
  
    if (num === 0) return "0";
  
    const absNum = Math.abs(num);
  
    // For numbers >= 1e-3, use standard compact formatting
    if (absNum >= 1e-3) {
      return compactNumberFormatter(num, significantDigits);
    }
  
    // For very small numbers, use scientific notation
    return num.toExponential(significantDigits - 1);
  };
  
  /**
   * Format numbers in standard notation with fixed fraction digits
   * @param {number|bigint} [number] - Number to format
   * @param {number} [fractionDigits] - Number of fraction digits
   * @returns {string} - Formatted number string
   */
  export const numberFormatter = (
    number,
    fractionDigits,
  ) => {
    return Intl.NumberFormat("en-US", {
      notation: "standard",
      minimumFractionDigits: fractionDigits ?? 2,
      maximumFractionDigits: fractionDigits ?? 2,
    }).format(number ?? 0);
  };
  
  /**
   * Format milliseconds as seconds with unit display
   * @param {number} [milliseconds] - Milliseconds to format
   * @returns {string} - Formatted latency string
   */
  export const latencyFormatter = (milliseconds) => {
    return Intl.NumberFormat("en-US", {
      style: "unit",
      unit: "second",
      unitDisplay: "narrow",
      notation: "compact",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format((milliseconds ?? 0) / 1000);
  };
  
  /**
   * Format numbers as USD currency
   * @param {number|bigint|Object} [number] - Number to format (supports Decimal.js objects)
   * @param {number} [minimumFractionDigits=2] - Minimum fraction digits
   * @param {number} [maximumFractionDigits=6] - Maximum fraction digits
   * @returns {string} - Formatted currency string
   */
  export const usdFormatter = (
    number,
    minimumFractionDigits = 2,
    maximumFractionDigits = 6,
  ) => {
    // Handle Decimal.js objects if they have a toNumber method
    const numberToFormat = number && typeof number.toNumber === 'function' ? number.toNumber() : number;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits,
      maximumFractionDigits,
    }).format(numberToFormat ?? 0);
  };
  
  /**
   * Generate random integer between min and max (inclusive)
   * @param {number} min - Minimum value
   * @param {number} max - Maximum value
   * @returns {number} - Random integer
   */
  export function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
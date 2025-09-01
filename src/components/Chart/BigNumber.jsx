import React, { useEffect, useRef, useState, useMemo } from "react";
import styles from "./BigNumber.module.css";

/**
 * Utility function to merge CSS classes
 * @param {...string} classes - CSS classes to merge
 * @returns {string} - Combined class names
 */
function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

// Format large numbers with appropriate units and dynamic decimal places
const formatBigNumber = (value, maxCharacters) => {
  const absValue = Math.abs(value);

  // Calculate how many decimal places we can afford based on available space
  const getOptimalDecimalPlaces = (baseNumber, unit, maxChars) => {
    if (!maxChars) return 1; // Default to 1 decimal place

    const baseStr = Math.floor(Math.abs(baseNumber)).toString();
    const signLength = value < 0 ? 1 : 0;
    const availableForDecimals =
      maxChars - baseStr.length - unit.length - signLength - 1; // -1 for decimal point

    return Math.max(0, Math.min(3, availableForDecimals)); // Max 3 decimal places, min 0
  };

  if (absValue >= 1e12) {
    const baseValue = value / 1e12;
    const decimals = getOptimalDecimalPlaces(baseValue, "T", maxCharacters);
    return {
      formatted: baseValue.toFixed(decimals).replace(/\.?0+$/, ""),
      unit: "T",
    };
  } else if (absValue >= 1e9) {
    const baseValue = value / 1e9;
    const decimals = getOptimalDecimalPlaces(baseValue, "B", maxCharacters);
    return {
      formatted: baseValue.toFixed(decimals).replace(/\.?0+$/, ""),
      unit: "B",
    };
  } else if (absValue >= 1e6) {
    const baseValue = value / 1e6;
    const decimals = getOptimalDecimalPlaces(baseValue, "M", maxCharacters);
    return {
      formatted: baseValue.toFixed(decimals).replace(/\.?0+$/, ""),
      unit: "M",
    };
  } else if (absValue >= 1e3) {
    const baseValue = value / 1e3;
    const decimals = getOptimalDecimalPlaces(baseValue, "K", maxCharacters);
    return {
      formatted: baseValue.toFixed(decimals).replace(/\.?0+$/, ""),
      unit: "K",
    };
  } else if (absValue >= 1) {
    // For numbers >= 1, show dynamic decimal places based on space
    const decimals = maxCharacters
      ? Math.min(
          3,
          Math.max(
            0,
            maxCharacters -
              Math.floor(absValue).toString().length -
              (value < 0 ? 1 : 0) -
              1,
          ),
        )
      : 2;
    return {
      formatted: value
        .toFixed(Math.max(0, Math.min(3, decimals)))
        .replace(/\.?0+$/, ""),
      unit: "",
    };
  } else if (absValue > 0) {
    // For small numbers, show as many meaningful decimal places as space allows
    // Find the first significant digit and show a few more places
    const str = absValue.toString();
    const firstSignificantIndex = str.search(/[1-9]/);

    if (firstSignificantIndex === -1) return { formatted: "0", unit: "" };

    // Calculate how many decimal places we need to show meaningful digits
    const neededDecimals = firstSignificantIndex + 2; // Show 2 significant digits
    const maxAllowedDecimals = maxCharacters ? maxCharacters - 2 : 6; // Account for "0."
    const decimals = Math.min(neededDecimals, maxAllowedDecimals, 8); // Max 8 decimal places

    return {
      formatted: value
        .toFixed(Math.max(0, Math.min(3, decimals)))
        .replace(/\.?0+$/, ""),
      unit: "",
    };
  } else {
    return { formatted: "0", unit: "" };
  }
};

/**
 * BigNumber component for displaying large numbers with automatic formatting and scaling
 * @param {Object} props - Component props
 * @param {Array} props.data - Array of data points with metric values
 * @param {string} props.className - Additional CSS class names
 */
export const BigNumber = ({ data, className }) => {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const [fontSizeClass, setFontSizeClass] = useState(styles.textXl6);
  const [maxCharacters, setMaxCharacters] = useState();

  // Calculate metric value from data - show loading if no data
  const isLoading = !data || data.length === 0;

  const calculatedMetric = useMemo(() => {
    if (isLoading) return 0;

    // Show the sum of all metrics, or just the first metric if only one
    if (data.length === 1) {
      return typeof data[0].metric === "number" ? data[0].metric : 0;
    }

    return data.reduce((acc, d) => {
      const metric = typeof d.metric === "number" ? d.metric : 0;
      return acc + metric;
    }, 0);
  }, [data, isLoading]);

  const displayValue = !isLoading
    ? formatBigNumber(calculatedMetric, maxCharacters)
    : { formatted: "0", unit: "" };

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      if (!containerRef.current || !textRef.current) return;

      const container = containerRef.current;

      // Get container dimensions
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      const availableWidth = containerWidth * 0.95; // Use more width (was 0.9)
      const availableHeight = containerHeight * 0.9; // Use more height (was 0.8)

      // Start with a large font size and scale down
      const baseFontSizes = [
        { class: styles.textXl8, px: 128 },
        { class: styles.textXl7, px: 96 },
        { class: styles.textXl6, px: 72 },
        { class: styles.textXl5, px: 60 },
        { class: styles.textXl4, px: 48 },
        { class: styles.textXl3, px: 36 },
        { class: styles.textXl2, px: 24 },
        { class: styles.textXl, px: 20 },
        { class: styles.textLg, px: 18 },
        { class: styles.textBase, px: 16 },
        { class: styles.textSm, px: 14 },
      ];

      let selectedFontSize = styles.textSm;
      let calculatedMaxChars = 0;

      // Test each font size to find the largest that fits
      for (const { class: fontClass, px } of baseFontSizes) {
        // Estimate how many characters can fit - less conservative character width
        const charWidth = px * 0.55; // Less conservative (was 0.6)
        const maxChars = Math.floor(availableWidth / charWidth);

        // Quick test with current display value
        const testDisplayValue = !isLoading
          ? formatBigNumber(calculatedMetric, maxChars)
          : { formatted: "0", unit: "" };

        const textLength = (testDisplayValue.formatted + testDisplayValue.unit)
          .length;
        const estimatedWidth = textLength * charWidth;
        const estimatedHeight = px * 1.1; // Less conservative line height (was 1.2)

        if (
          estimatedWidth <= availableWidth &&
          estimatedHeight <= availableHeight
        ) {
          selectedFontSize = fontClass;
          calculatedMaxChars = maxChars;
          break;
        }
      }

      setFontSizeClass(selectedFontSize);
      setMaxCharacters(calculatedMaxChars);
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [calculatedMetric, isLoading]);

  // Get unit font size based on main font size
  const getUnitFontClass = (mainFontClass) => {
    switch (mainFontClass) {
      case styles.textXl8: return styles.textXl4;
      case styles.textXl7: return styles.textXl3;
      case styles.textXl6: return styles.textXl2;
      case styles.textXl5: return styles.textXl;
      case styles.textXl4: return styles.textLg;
      case styles.textXl3: return styles.textBase;
      case styles.textXl2: return styles.textSm;
      case styles.textXl: return styles.textSm;
      default: return styles.textXs;
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={cn(styles.container, className)}
    >
      <div className={styles.numberDisplay}>
        <span
          ref={textRef}
          className={cn(styles.mainNumber, fontSizeClass)}
          title={calculatedMetric.toString()}
        >
          {displayValue.formatted}
        </span>
        {displayValue.unit && (
          <span className={cn(styles.unit, getUnitFontClass(fontSizeClass))}>
            {displayValue.unit}
          </span>
        )}
      </div>
    </div>
  );
};

export default BigNumber;
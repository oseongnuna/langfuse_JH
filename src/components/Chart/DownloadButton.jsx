import { Download, Check } from "lucide-react";
import { useState } from "react";
import styles from "./Chart.module.css";

/**
 * Utility function to merge CSS classes
 * @param {...string} classes - CSS classes to merge
 * @returns {string} - Combined class names
 */
function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

/**
 * DownloadButton component for exporting chart data as CSV
 * @param {Object} props - Component props
 * @param {Array<Object>} props.data - Array of data objects to export
 * @param {string} [props.fileName="chart-data"] - Name for the downloaded file (without extension)
 * @param {string} [props.className] - Additional CSS class names
 */
export function DownloadButton({
  data,
  fileName = "chart-data",
  className,
}) {
  const [isDownloaded, setIsDownloaded] = useState(false);

  /**
   * Escape CSV values to handle commas, quotes, and newlines
   * @param {any} value - Value to escape
   * @returns {string} - Escaped CSV value
   */
  const escapeCsvValue = (value) => {
    const stringValue = String(value ?? "");
    if (
      stringValue.includes(",") ||
      stringValue.includes('"') ||
      stringValue.includes("\n")
    ) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  };

  /**
   * Trigger file download with given CSV content
   * @param {string} csvContent - CSV content to download
   */
  const triggerDownload = (csvContent) => {
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

    // Show checkmark for 1 second
    setIsDownloaded(true);
    setTimeout(() => {
      setIsDownloaded(false);
    }, 1000);
  };

  /**
   * Convert data array to CSV format and trigger download
   */
  const downloadCsv = () => {
    if (data.length === 0) {
      triggerDownload("");
      return;
    }

    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(","),
      ...data.map((row) =>
        headers.map((h) => escapeCsvValue(row[h])).join(","),
      ),
    ];

    const csvContent = csvRows.join("\n");
    triggerDownload(csvContent);
  };

  return (
    <button
      onClick={() => {
        if (isDownloaded) {
          return;
        }
        downloadCsv();
      }}
      className={cn(styles.downloadButton, className)}
      aria-label="Download chart data as CSV"
      title="Download CSV"
      disabled={isDownloaded}
    >
      {isDownloaded ? <Check size={16} /> : <Download size={16} />}
    </button>
  );
}
// src/components/Dashboard/WidgetCard.jsx

import React from 'react';
import styles from './WidgetCard.module.css';
import { GripVertical, Copy, Trash2, Download } from 'lucide-react';

const WidgetCard = ({ title, subtitle, children, onDelete, onCopy, onDownload }) => {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>{title}</h3>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
        <div className={styles.cardActions}>
          <button className={`${styles.iconButton} drag-handle`} aria-label="Move widget">
            <GripVertical size={16} />
          </button>
          <button className={styles.iconButton} aria-label="Copy widget" onClick={onCopy}>
            <Copy size={16} />
          </button>
          <button className={styles.iconButton} aria-label="Delete widget" onClick={onDelete}>
            <Trash2 size={16} />
          </button>
          <button className={styles.iconButton} aria-label="Download widget data" onClick={onDownload}>
            <Download size={16} />
          </button>
        </div>
      </div>
      <div className={styles.content}>
        {children}
      </div>
      <div className={styles.resizeHandle} />
    </div>
  );
};

export default WidgetCard;
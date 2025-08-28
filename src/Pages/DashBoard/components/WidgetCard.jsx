import React from 'react';
import styles from './WidgetCard.module.css';
import { GripVertical, Copy, Trash2, Download } from 'lucide-react';

const WidgetCard = ({ 
  title, 
  subtitle, 
  children, 
  onDelete, 
  onCopy, 
  onDownload,
  widgetType = 'custom' // 'custom' | 'fixed'
}) => {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>{title}</h3>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
        
        {/* 위젯 타입별 액션 버튼들 */}
        <div className={styles.cardActions}>
          {widgetType === 'custom' && (
            <>
              <button className={`${styles.iconButton} drag-handle`} aria-label="Move widget">
                <GripVertical size={16} />
              </button>
              <button className={styles.iconButton} aria-label="Copy widget" onClick={onCopy}>
                <Copy size={16} />
              </button>
              <button className={styles.iconButton} aria-label="Delete widget" onClick={onDelete}>
                <Trash2 size={16} />
              </button>
            </>
          )}
          
          {/* 공통: 다운로드 버튼 (저장) */}
          <button className={styles.iconButton} aria-label="Download widget data" onClick={onDownload}>
            <Download size={16} />
          </button>
        </div>
      </div>
      
      <div className={styles.content}>
        {children}
      </div>
      
      {/* 리사이즈 핸들은 커스텀 위젯에만 */}
      {widgetType === 'custom' && (
        <div className={styles.resizeHandle} />
      )}
    </div>
  );
};

export default WidgetCard;
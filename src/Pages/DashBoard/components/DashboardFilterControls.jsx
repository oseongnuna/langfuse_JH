// src/pages/Dashboards/components/DashboardFilterControls.jsx
import React, { useCallback } from 'react';
import DateRangePicker from '../../../components/DateRange/DateRangePicker';
import FilterBuilder from '../../../components/FilterControls/FilterBuilder';
import RefreshButton from '../../../components/FilterControls/RefreshButton';
import styles from './DashboardFilterControls.module.css';

const DashboardFilterControls = ({ 
  startDate,
  endDate, 
  onDateChange,
  onRefresh 
}) => {
  // 프리셋 변경 핸들러 - 두 날짜를 동시에 업데이트
  const handlePresetChange = useCallback((newStartDate, newEndDate) => {
    onDateChange(newStartDate, newEndDate);
  }, [onDateChange]);

  return (
    <div className={styles.filterControls}>
      {/* 1. 날짜 범위 선택기 (캘린더 + 프리셋 드롭다운) */}
      <DateRangePicker
        startDate={startDate}
        endDate={endDate}
        setStartDate={(date) => onDateChange(date, endDate)}
        setEndDate={(date) => onDateChange(startDate, date)}
        onPresetChange={handlePresetChange}
      />
      
      {/* 2. Filters 드롭다운 */}
      <FilterBuilder />
      
      {/* 3. 새로고침 버튼 */}
      {onRefresh && <RefreshButton onClick={onRefresh} />}
    </div>
  );
};

export default DashboardFilterControls;
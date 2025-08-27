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
    const handlePresetChange = useCallback((newStartDate, newEndDate) => {
      onDateChange(newStartDate, newEndDate);
    }, [onDateChange]);
  
    // 개별 날짜 변경 핸들러 추가
    const handleStartDateChange = useCallback((newStartDate) => {
      onDateChange(newStartDate, endDate);
    }, [onDateChange, endDate]);
  
    const handleEndDateChange = useCallback((newEndDate) => {
      onDateChange(startDate, newEndDate);
    }, [onDateChange, startDate]);
  
    // 동시 날짜 변경 핸들러 추가
    const handleBothDatesChange = useCallback((newStartDate, newEndDate) => {
      onDateChange(newStartDate, newEndDate);
    }, [onDateChange]);
  
    return (
      <div className={styles.filterControls}>
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          setStartDate={handleStartDateChange}
          setEndDate={handleEndDateChange}
          setBothDates={handleBothDatesChange} // 새로 추가
          onPresetChange={handlePresetChange}
        />
        
        <FilterBuilder />
        
        {onRefresh && <RefreshButton onClick={onRefresh} />}
      </div>
    );
  };

export default DashboardFilterControls;
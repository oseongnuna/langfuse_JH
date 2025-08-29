// DashboardFilterControls.jsx 전체 수정
import React, { useCallback } from 'react';
import DateRangePicker from '../../../components/DateRange/DateRangePicker';
import FilterBuilder from '../../../components/FilterControls/FilterBuilder';
import RefreshButton from '../../../components/FilterControls/RefreshButton';
import styles from './DashboardFilterControls.module.css';

const DashboardFilterControls = ({ 
  dateRange,     // ✅ dateRange 객체로 받기
  onDateChange,  // ✅ 함수 받기
  onRefresh 
}) => {
  // dateRange가 없으면 기본값 설정
  const startDate = dateRange?.startDate;
  const endDate = dateRange?.endDate;

  const handlePresetChange = useCallback((newStartDate, newEndDate) => {
    if (onDateChange) {
      onDateChange({ startDate: newStartDate, endDate: newEndDate });
    }
  }, [onDateChange]);

  // 개별 날짜 변경 핸들러 추가
  const handleStartDateChange = useCallback((newStartDate) => {
    if (onDateChange) {
      onDateChange({ startDate: newStartDate, endDate });
    }
  }, [onDateChange, endDate]);

  const handleEndDateChange = useCallback((newEndDate) => {
    if (onDateChange) {
      onDateChange({ startDate, endDate: newEndDate });
    }
  }, [onDateChange, startDate]);

  // 동시 날짜 변경 핸들러 - 매개변수 순서 수정
  const handleBothDatesChange = useCallback((newStartDate, newEndDate) => {
    if (onDateChange) {
      onDateChange({ startDate: newStartDate, endDate: newEndDate });
    }
  }, [onDateChange]);

  return (
    <div className={styles.filterControls}>
      <DateRangePicker
        startDate={startDate}
        endDate={endDate}
        setStartDate={handleStartDateChange}
        setEndDate={handleEndDateChange}
        setBothDates={handleBothDatesChange}
        onPresetChange={handlePresetChange}
      />
      
      <FilterBuilder />
      
      {onRefresh && <RefreshButton onClick={onRefresh} />}
    </div>
  );
};

export default DashboardFilterControls;
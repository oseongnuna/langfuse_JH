// src/pages/Dashboards/DashboardDetail.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Info, Plus } from 'lucide-react';
import DashboardFilterControls from './components/DashboardFilterControls';
import styles from './DashboardDetail.module.css';
import { dashboardAPI } from './services/dashboardAPI';

const DashboardDetail = () => {
  const { dashboardId } = useParams();
  const navigate = useNavigate();
  
  // 상태 관리 (기존 코드 유지)
  const [dashboard, setDashboard] = useState(null);
  const [widgets, setWidgets] = useState([]); // 빈 배열로 시작
  const [loading, setLoading] = useState(true);
  
  // UI 상태
  const [isAddWidgetModalOpen, setAddWidgetModalOpen] = useState(false);
  
  // 날짜 범위 상태 (기존 DateRangePicker와 동일)
  const [startDate, setStartDate] = useState(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
  const [endDate, setEndDate] = useState(new Date());

  // 대시보드 정보 로딩 (기존 로직 유지)
  useEffect(() => {
    const fetchDashboard = async () => {
      if (!dashboardId) return;
      
      setLoading(true);
      try {
        const response = await dashboardAPI.getDashboard(dashboardId);
        if (response.success) {
          setDashboard(response.data);
          
          // 대시보드에 위젯이 있다면 로딩
          if (response.data.widgets) {
            setWidgets(response.data.widgets);
          }
        } else {
          console.error('대시보드 로딩 실패:', response.error);
          // 새 대시보드인 경우 기본 정보 설정
          const dashboardName = dashboardId === 'new' ? 'New Dashboard3' : dashboardId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          
          setDashboard({
            id: dashboardId,
            name: dashboardName,
            description: '',
            widgets: []
          });
        }
      } catch (err) {
        console.error('대시보드 로딩 중 오류:', err);
        // 기본 대시보드 정보 설정
        const dashboardName = dashboardId === 'new' ? 'New Dashboard3' : dashboardId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        
        setDashboard({
          id: dashboardId,
          name: dashboardName,
          description: '',
          widgets: []
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [dashboardId]);

  // 새로고침 핸들러 - DashboardFilterControls의 RefreshButton에서 호출
  const handleRefresh = async () => {
    console.log('Refreshing dashboard with date range:', { startDate, endDate });
    
    try {
      setLoading(true);
      
      // 실제 API 호출할 때 현재 날짜 범위를 함께 전달
      const response = await dashboardAPI.getDashboard(dashboardId, { startDate, endDate });
      if (response.success && response.data.widgets) {
        setWidgets(response.data.widgets);
      }
      
    } catch (error) {
      console.error('새로고침 중 오류:', error);
      // 임시로 페이지 새로고침 (fallback)
      window.location.reload();
    } finally {
      setLoading(false);
    }
  };

  // 날짜 변경 핸들러
  const handleDateChange = (newStartDate, newEndDate) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
    console.log('Date range changed:', { start: newStartDate, end: newEndDate });
  };

  // Add Widget 버튼 클릭 (기존 로직 유지)
  const handleAddWidget = () => {
    setAddWidgetModalOpen(true);
  };

  // 로딩 상태 (기존 로직 유지)
  if (loading) {
    return (
      <div className={styles.container}>
        <div style={{ 
          textAlign: 'center', 
          padding: '40px', 
          color: '#f8fafc',
          fontSize: '1.1rem'
        }}>
          Loading dashboard...
        </div>
      </div>
    );
  }

  // 대시보드 정보가 없는 경우 (기존 로직 유지)
  if (!dashboard) {
    return (
      <div className={styles.container}>
        <div style={{ 
          textAlign: 'center', 
          padding: '40px', 
          color: '#ef4444',
          fontSize: '1.1rem'
        }}>
          <h1>Dashboard not found</h1>
          <p>The requested dashboard could not be loaded.</p>
          <button 
            onClick={() => navigate('/dashboards')}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Back to Dashboards
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header - 기존 스타일 유지 */}
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <h1 className={styles.title}>{dashboard.name}</h1>
          <Info size={16} className={styles.infoIcon} />
        </div>
        <button 
          className={styles.addWidgetButton} 
          onClick={handleAddWidget}
        >
          <Plus size={16} /> Add Widget
        </button>
      </div>

      {/* Filter Bar - DashboardFilterControls로 교체 */}
      <div className={styles.filterBar}>
        <DashboardFilterControls
          startDate={startDate}
          endDate={endDate}
          onDateChange={handleDateChange}
          onRefresh={handleRefresh}
        />
        
        {/* 개발용 디버그 정보 (나중에 제거 가능) */}
        {process.env.NODE_ENV === 'development' && (
          <div style={{ 
            marginLeft: '16px', 
            fontSize: '11px', 
            color: '#64748b',
            fontFamily: 'monospace'
          }}>
            Debug: {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
          </div>
        )}
      </div>

      {/* Main Content Area - 기존 로직 유지 */}
      <div className={styles.mainContent}>
        {widgets.length === 0 ? (
          // 빈 대시보드 상태
          <div className={styles.emptyState}>
            <div className={styles.emptyStateContent}>
              <div className={styles.emptyIcon}>
                <Plus size={48} />
              </div>
              <h2 className={styles.emptyTitle}>No widgets yet</h2>
              <p className={styles.emptyDescription}>
                Start building your dashboard by adding your first widget
              </p>
              <button 
                className={styles.emptyStateButton}
                onClick={handleAddWidget}
              >
                <Plus size={16} /> Add Widget
              </button>
            </div>
          </div>
        ) : (
          // 위젯이 있는 경우 (나중에 구현)
          <div className={styles.widgetGrid}>
            {widgets.map(widget => (
              <div key={widget.id} className={styles.widget}>
                {/* 위젯 카드들이 여기에 렌더링될 예정 */}
                <div>Widget: {widget.name}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Widget Modal (기존 로직 유지) */}
      {isAddWidgetModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setAddWidgetModalOpen(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Add Widget</h3>
              <button 
                className={styles.modalCloseButton}
                onClick={() => setAddWidgetModalOpen(false)}
              >
                ×
              </button>
            </div>
            <div className={styles.modalBody}>
              <p>AddWidgetModal will be implemented here</p>
              <p>This modal will allow you to:</p>
              <ul>
                <li>Choose widget type</li>
                <li>Configure data source</li>
                <li>Set chart type</li>
                <li>Preview and add to dashboard</li>
              </ul>
            </div>
            <div className={styles.modalFooter}>
              <button 
                className={styles.modalCancelButton}
                onClick={() => setAddWidgetModalOpen(false)}
              >
                Cancel
              </button>
              <button 
                className={styles.modalAddButton}
                onClick={() => {
                  // TODO: 실제 위젯 추가 로직
                  console.log('Widget will be added');
                  setAddWidgetModalOpen(false);
                }}
              >
                Add Widget
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardDetail;
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Info, Plus, Download } from "lucide-react";
import DashboardFilterControls from "./components/DashboardFilterControls";
import WidgetCard from "./components/WidgetCard";
import AddWidgetModal from "./AddWidgetModal";
import styles from "./DashboardDetail.module.css";

// useDashboardDetail 훅 import 추가!
import { useDashboardDetail } from "./hooks/useDashboardDetail";

// 차트 컴포넌트들 import
import TotalMetric from "./components/charts/TotalMetric";
import BarTimeSeriesChart from "./components/charts/BarTimeSeriesChart";
import TracesBarListChart from "./components/charts/TracesBarListChart";
import ModelCostTable from "./components/charts/ModelCostTable";

const DashboardDetail = () => {
  const { dashboardId } = useParams();
  const navigate = useNavigate();

  // useDashboardDetail 훅 사용
  const {
    dashboard,
    widgetData,
    loading,
    error,
    dateRange,
    setDateRange,
    reload,
    clone,
    templateInfo,
    loadingStats,
  } = useDashboardDetail(dashboardId);

  // UI 상태
  const [isAddWidgetModalOpen, setAddWidgetModalOpen] = useState(false);

  // 차트 컴포넌트 매핑
  const getChartComponent = (widget, data) => {
    // 로딩 상태
    if (!data || data.isLoading) {
      return (
        <div
          style={{
            padding: "40px",
            textAlign: "center",
            color: "#6b7280",
            fontSize: "0.875rem",
          }}
        >
          Loading...
        </div>
      );
    }

    // 에러 상태
    if (data.error) {
      return (
        <div
          style={{
            padding: "40px",
            textAlign: "center",
            color: "#ef4444",
            fontSize: "0.875rem",
          }}
        >
          Error: {data.error}
        </div>
      );
    }

    // 실제 API가 적용된 컴포넌트만 렌더링
    const REAL_API_COMPONENTS = ["TotalMetric", "BarTimeSeriesChart", "TracesBarListChart"];

    if (REAL_API_COMPONENTS.includes(widget.component)) {
      // 실제 컴포넌트 렌더링
      switch (widget.component) {
        case "TotalMetric":
          return <TotalMetric data={data} />;
        case "BarTimeSeriesChart":
          return <BarTimeSeriesChart data={data.chartData || []} />;
          case "TracesBarListChart":
  return <TracesBarListChart data={data.chartData || []} />;
        default:
          return null;
      }
    } else {
      // 목업 데이터 위젯들은 플레이스홀더만 표시
      return (
        <div
          style={{
            padding: "20px",
            textAlign: "center",
            color: "#6b7280",
            fontSize: "0.875rem",
          }}
        >
          <div style={{ marginBottom: "8px", fontWeight: "bold" }}>
            {widget.component}
          </div>
          <div style={{ fontSize: "0.75rem", color: "#9ca3af" }}>
            Mock Data ({data.apiStatus})
          </div>
          <div
            style={{
              marginTop: "8px",
              fontSize: "0.75rem",
              fontFamily: "monospace",
            }}
          >
            Data items:{" "}
            {Array.isArray(data.chartData) ? data.chartData.length : "N/A"}
          </div>
        </div>
      );
    }
  };

  // 날짜 범위 변경 핸들러
  const handleDateRangeChange = (newDateRange) => {
    console.log("Date range changed:", newDateRange);
    setDateRange(newDateRange);
  };

  // 새로고침 핸들러
  const handleRefresh = () => {
    console.log("Refreshing dashboard");
    reload();
  };

  // 복제 핸들러
  const handleClone = async () => {
    const result = await clone();
    if (result.success) {
      console.log("Dashboard cloned successfully");
    }
  };

  // 위젯 관련 핸들러들 (커스텀 대시보드용)
  const handleAddWidget = () => {
    setAddWidgetModalOpen(true);
  };

  const handleWidgetAdded = (widgetId) => {
    console.log("Widget added:", widgetId);
    // TODO: 실제 위젯 추가 로직
  };

  // 고정 대시보드용 다운로드 핸들러
  const handleFixedWidgetDownload = async (widgetId) => {
    console.log("Download fixed widget data:", widgetId);
    // TODO: 실제 데이터 다운로드 로직
  };

  // 로딩 상태
  if (loading) {
    return (
      <div className={styles.container}>
        <div
          style={{
            textAlign: "center",
            padding: "40px",
            color: "#f8fafc",
            fontSize: "1.1rem",
          }}
        >
          Loading dashboard...
          {loadingStats.total > 0 && (
            <div
              style={{
                marginTop: "10px",
                fontSize: "0.875rem",
                color: "#9ca3af",
              }}
            >
              Widgets: {loadingStats.success}/{loadingStats.total} loaded
            </div>
          )}
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className={styles.container}>
        <div
          style={{
            textAlign: "center",
            padding: "40px",
            color: "#ef4444",
            fontSize: "1.1rem",
          }}
        >
          <h1>Error loading dashboard</h1>
          <p>{error}</p>
          <button
            onClick={() => navigate("/dashboards")}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              backgroundColor: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Back to Dashboards
          </button>
        </div>
      </div>
    );
  }

  // 대시보드 정보가 없는 경우
  if (!dashboard) {
    return (
      <div className={styles.container}>
        <div
          style={{
            textAlign: "center",
            padding: "40px",
            color: "#ef4444",
            fontSize: "1.1rem",
          }}
        >
          <h1>Dashboard not found</h1>
          <p>The requested dashboard could not be loaded.</p>
          <button
            onClick={() => navigate("/dashboards")}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              backgroundColor: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Back to Dashboards
          </button>
        </div>
      </div>
    );
  }

  const isFixedDashboard = dashboard.owner === "LANGFUSE";
  const { template } = templateInfo;

  // 고정 대시보드 렌더링
  if (isFixedDashboard && template) {
    return (
      <div className={styles.container}>
        {/* 헤더 */}
        <div className={styles.header}>
          <div className={styles.titleGroup}>
            <h1 className={styles.title}>{dashboard.name}</h1>
            <span className={styles.maintainedBadge}>
              (Langfuse Maintained)
            </span>
            <Info size={16} className={styles.infoIcon} />
          </div>
          <button className={styles.cloneButton} onClick={handleClone}>
            <Download size={16} />
            Clone
          </button>
        </div>

        {/* Filter Bar */}
        <div className={styles.filterBar}>
          <DashboardFilterControls
            dateRange={dateRange}
            onDateChange={handleDateRangeChange}
            onRefresh={handleRefresh}
          />
        </div>

        {/* 고정 위젯 그리드 - 조건부 CSS 클래스 적용 */}
        <div className={styles.mainContent}>
          <div className={styles.fixedWidgetGrid}>
            {template.widgets.map((widget, index) => {
              console.log(`Widget ${index}:`, {
                id: widget.id,
                title: widget.title,
                x: widget.x,
                y: widget.y,
                x_size: widget.x_size,
                y_size: widget.y_size,
                component: widget.component,
              });

              const data = widgetData[widget.id] || { isLoading: true };
              console.log(`Widget ${widget.id} data:`, data);

              return (
                <div
                  key={widget.id}
                  className={`${styles.widgetContainer} ${
                    widget.component === "TotalMetric"
                      ? styles.metricWidget
                      : widget.component === "BaseTimeSeriesChart"
                      ? styles.timeSeriesWidget
                      : widget.component === "TracesBarListChart"
                      ? styles.barChartWidget
                      : ""
                  }`}
                  style={{
                    gridColumn: `${widget.x + 1} / span ${widget.x_size}`,
                    gridRow: `${widget.y + 1} / span ${widget.y_size}`,
                  }}
                >
                  <WidgetCard
                    title={widget.title}
                    subtitle={widget.description}
                    widgetType="fixed"
                    onDownload={() => handleFixedWidgetDownload(widget.id)}
                  >
                    {getChartComponent(widget, data)}
                  </WidgetCard>
                </div>
              );
            })}
          </div>
        </div>

        {/* 디버그 정보 (개발 환경에서만) */}
        {import.meta.env.DEV && (
          <div
            style={{
              position: "fixed",
              bottom: "10px",
              right: "10px",
              backgroundColor: "rgba(0,0,0,0.8)",
              color: "white",
              padding: "8px 12px",
              borderRadius: "4px",
              fontSize: "0.75rem",
              fontFamily: "monospace",
            }}
          >
            API Status: {loadingStats.success}✓ {loadingStats.failed}✗{" "}
            {loadingStats.mock}📝
          </div>
        )}
      </div>
    );
  }

  // 커스텀 대시보드 렌더링 (기존 로직 유지)
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <h1 className={styles.title}>{dashboard.name}</h1>
          <Info size={16} className={styles.infoIcon} />
        </div>
        <button className={styles.addWidgetButton} onClick={handleAddWidget}>
          <Plus size={16} /> Add Widget
        </button>
      </div>

      <div className={styles.filterBar}>
        <DashboardFilterControls
          dateRange={dateRange}
          onDateRangeChange={handleDateRangeChange}
          onRefresh={handleRefresh}
        />
      </div>

      <div className={styles.mainContent}>
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            color: "#9ca3af",
          }}
        >
          <h3 style={{ marginBottom: "8px", color: "#6b7280" }}>
            Custom Dashboard
          </h3>
          <p>위젯팀 연동 대기 중...</p>
        </div>
      </div>

      {isAddWidgetModalOpen && (
        <AddWidgetModal
          onClose={() => setAddWidgetModalOpen(false)}
          onAddWidget={handleWidgetAdded}
        />
      )}
    </div>
  );
};

export default DashboardDetail;

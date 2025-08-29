// 통합된 API 서비스 - tRPC 래핑 제거하고 직접 fetch 사용
// 기존 import 방식 완전 호환: import { dashboardAPI, widgetAPI, commonUtils } from '../services';

const API_CONFIG = {
  BASE_URL: '', // 직접 Langfuse 서버 지정
  PROJECT_ID: import.meta.env.VITE_LANGFUSE_PROJECT_ID,
};

// ============================================
// 공통 Base 클래스
// ============================================
class BaseAPI {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.projectId = API_CONFIG.PROJECT_ID;
  }

  // 공통 헤더
  getHeaders() {
    return {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
  }

  /**
   * tRPC 엔드포인트를 직접 호출하는 헬퍼
   * 기존 래핑 제거하고 직접 fetch 방식으로 변경
   */
  async callTRPC(endpoint, method = 'GET', data = null) {
    try {
      if (method === 'GET') {
        // GET 요청: tRPC 형식으로 변환
        const params = new URLSearchParams({
          batch: '1',
          input: JSON.stringify({
            0: { json: data }
          })
        });
        
        const response = await fetch(
          `${this.baseURL}/api/trpc/${endpoint}?${params}`,
          {
            method: 'GET',
            headers: this.getHeaders(),
            credentials: 'include',
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`API 오류 (${endpoint}):`, errorText);
          throw new Error(`API 오류: ${response.status} - ${errorText}`);
        }

        const result = await response.json();
        // tRPC 응답에서 실제 데이터 추출
        return result[0]?.result?.data?.json || null;
        
      } else {
        // POST 요청
        const response = await fetch(
          `${this.baseURL}/api/trpc/${endpoint}`,
          {
            method: 'POST',
            headers: this.getHeaders(),
            credentials: 'include',
            body: JSON.stringify({ json: data }),
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`API 오류 (${endpoint}):`, errorText);
          throw new Error(`API 오류: ${response.status} - ${errorText}`);
        }

        const result = await response.json();
        // tRPC 응답에서 실제 데이터 추출
        return result?.result?.data?.json || null;
      }
    } catch (error) {
      console.error(`TRPC API 호출 오류 (${endpoint}):`, error);
      throw error;
    }
  }
}

// ============================================
// Dashboard API 클래스
// ============================================
class DashboardAPI extends BaseAPI {
  /**
   * GET /dashboards - 대시보드 목록 조회
   */
  async getAllDashboards(page = 0, limit = 50) {
    try {
      console.log('대시보드 목록 조회 시작:', { page, limit });
      
      const data = await this.callTRPC('dashboard.allDashboards', 'GET', {
        projectId: this.projectId,
        page,
        limit,
        orderBy: { column: 'updatedAt', order: 'DESC' }
      });

      if (!data) {
        throw new Error('대시보드 데이터를 받지 못했습니다');
      }

      console.log('대시보드 데이터 수신:', data);

      return {
        success: true,
        data: data?.dashboards || [],
        totalItems: data?.totalCount || 0,
        meta: {
          totalCount: data?.totalCount || 0,
          hasMore: data?.hasMore || false
        }
      };
      
    } catch (error) {
      console.error('대시보드 목록 조회 실패:', error);
      
      return {
        success: false,
        error: error.message,
        data: [],
        totalItems: 0,
        meta: {
          totalCount: 0,
          hasMore: false
        }
      };
    }
  }

  /**
   * GET /dashboard/:id - 개별 대시보드 조회
   */
  async getDashboard(dashboardId) {
    try {
      console.log('대시보드 개별 조회:', dashboardId);
      
      const data = await this.callTRPC('dashboard.getDashboard', 'GET', {
        projectId: this.projectId,
        dashboardId: dashboardId
      });

      console.log('대시보드 데이터:', data);

      return {
        success: true,
        data: data
      };
      
    } catch (error) {
      console.error('대시보드 조회 실패:', error);
      
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
  }

  /**
   * POST /dashboards - 대시보드 생성
   */
  async createDashboard(name, description) {
    try {
      console.log('대시보드 생성 요청:', { name, description });

      const payload = {
        projectId: this.projectId,
        name: name.trim(),
        description: description?.trim() || ''
      };

      const data = await this.callTRPC('dashboard.createDashboard', 'POST', payload);
      
      if (!data) {
        throw new Error('대시보드 생성 응답을 받지 못했습니다');
      }

      console.log('대시보드 생성 성공:', data);

      return {
        success: true,
        data: data
      };
      
    } catch (error) {
      console.error('대시보드 생성 실패:', error);
      
      return { 
        success: false,
        error: error.message
      };
    }
  }

  /**
   * PUT /dashboards/:id - 대시보드 수정
   */
  async updateDashboard(dashboardId, name, description) {
    try {
      console.log('대시보드 수정 요청:', { dashboardId, name, description });

      const payload = {
        projectId: this.projectId,
        dashboardId: dashboardId,
        name: name.trim(),
        description: description?.trim() || ''
      };

      const data = await this.callTRPC('dashboard.updateDashboardMetadata', 'POST', payload);

      if (!data) {
        throw new Error('대시보드 수정 응답을 받지 못했습니다');
      }

      console.log('대시보드 수정 성공:', data);

      return {
        success: true,
        data: data
      };
      
    } catch (error) {
      console.error('대시보드 수정 실패:', error);

      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * POST /dashboards/:id/clone - 대시보드 복제
   */
  async cloneDashboard(dashboardId) {
    try {
      console.log('대시보드 복제 요청:', dashboardId);

      const data = await this.callTRPC('dashboard.cloneDashboard', 'POST', {
        projectId: this.projectId,
        dashboardId: dashboardId
      });

      console.log('대시보드 복제 성공:', data);

      return {
        success: true,
        data: data
      };
      
    } catch (error) {
      console.error('대시보드 복제 실패:', error);

      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * DELETE /dashboards/:id - 대시보드 삭제
   */
  async deleteDashboard(dashboardId) {
    try {
      console.log('대시보드 삭제 요청:', dashboardId);

      const data = await this.callTRPC('dashboard.delete', 'POST', {
        projectId: this.projectId,
        dashboardId: dashboardId
      });
      
      console.log('대시보드 삭제 성공');

      return {
        success: true,
        message: '대시보드가 삭제되었습니다.'
      };
      
    } catch (error) {
      console.error('대시보드 삭제 실패:', error);

      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * POST /execute-query - 대시보드 쿼리 실행
   */
  async executeQuery(sql, params = {}) {
    try {
      console.log('쿼리 실행:', { sql, params });

      const query = {
        projectId: this.projectId,
        sql: sql,
        params: params
      };

      const data = await this.callTRPC('dashboard.executeQuery', 'POST', query);

      if (!data) {
        throw new Error('쿼리 실행 결과를 받지 못했습니다');
      }

      console.log('쿼리 실행 결과:', data);

      return {
        success: true,
        data: data
      };
      
    } catch (error) {
      console.error('쿼리 실행 실패:', error);

      return {
        success: false,
        error: error.message,
        data: null
      };
    }
  }
}

// ============================================
// Widget API 클래스  
// ============================================
class WidgetAPI extends BaseAPI {
  /**
   * 개별 위젯 설정 조회
   */
  async getWidget(widgetId) {
    try {
      console.log('위젯 설정 조회:', widgetId);
      
      const data = await this.callTRPC('dashboardWidgets.get', 'GET', {
        widgetId: widgetId,
        projectId: this.projectId
      });

      if (!data) {
        throw new Error('위젯 데이터를 받지 못했습니다');
      }

      console.log('위젯 설정:', data);

      return {
        success: true,
        data: data
      };
      
    } catch (error) {
      console.error('위젯 조회 실패:', error);
      
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
  }

  /**
   * 위젯 데이터 조회 (차트용)
   */
  async executeWidgetQuery(widgetConfig, fromTimestamp, toTimestamp) {
    try {
      console.log('위젯 데이터 조회:', {
        name: widgetConfig.name,
        chartType: widgetConfig.chartType,
        view: widgetConfig.view
      });

      // 위젯 설정을 바탕으로 쿼리 생성
      const query = {
        view: widgetConfig.view,
        dimensions: widgetConfig.dimensions || [],
        metrics: widgetConfig.metrics || [{ measure: "count", aggregation: "count" }],
        filters: widgetConfig.filters || [],
        timeDimension: this.getTimeDimension(widgetConfig.chartType),
        fromTimestamp: fromTimestamp,
        toTimestamp: toTimestamp,
        orderBy: null,
        chartConfig: widgetConfig.chartConfig
      };

      const data = await this.callTRPC('dashboard.executeQuery', 'GET', {
        projectId: this.projectId,
        query: query
      });

      if (!data) {
        throw new Error('쿼리 실행 결과를 받지 못했습니다');
      }

      console.log('위젯 데이터 결과:', data);

      return {
        success: true,
        data: data,
        chartType: widgetConfig.chartType
      };
      
    } catch (error) {
      console.error('위젯 데이터 조회 실패:', error);
      
      // 실패 시 목업 데이터 반환 (개발용)
      return this.getMockWidgetData(widgetConfig);
    }
  }

  /**
   * 여러 위젯을 한번에 조회 (배치 처리)
   */
  async getMultipleWidgets(widgetIds) {
    try {
      console.log('여러 위젯 조회:', widgetIds);
      
      const promises = widgetIds.map(widgetId => this.getWidget(widgetId));
      const results = await Promise.allSettled(promises);
      
      const widgets = results.map((result, index) => {
        if (result.status === 'fulfilled' && result.value.success) {
          return {
            widgetId: widgetIds[index],
            ...result.value.data
          };
        } else {
          console.error(`위젯 ${widgetIds[index]} 로딩 실패:`, result.reason);
          return {
            widgetId: widgetIds[index],
            error: result.reason?.message || 'Unknown error'
          };
        }
      });

      return {
        success: true,
        data: widgets
      };
      
    } catch (error) {
      console.error('여러 위젯 조회 실패:', error);
      
      return {
        success: false,
        error: error.message,
        data: []
      };
    }
  }

  /**
   * 대시보드 전체 위젯 데이터 로딩
   */
  async loadDashboardWidgets(widgetLayouts, fromTimestamp, toTimestamp) {
    try {
      console.log('대시보드 위젯들 로딩:', widgetLayouts.length, '개');

      const layoutsWithData = [];
      
      for (const layout of widgetLayouts) {
        try {
          // 위젯 설정 조회
          const widgetResult = await this.getWidget(layout.widgetId);
          
          if (widgetResult.success) {
            // 위젯 데이터 조회
            const dataResult = await this.executeWidgetQuery(
              widgetResult.data, 
              fromTimestamp, 
              toTimestamp
            );
            
            layoutsWithData.push({
              ...layout,
              widget: widgetResult.data,
              chartData: dataResult.data,
              isMockData: dataResult.isMockData || false,
              error: null
            });
          } else {
            // 위젯 로딩 실패 시 에러 정보 포함
            layoutsWithData.push({
              ...layout,
              widget: { 
                name: "Loading Error", 
                chartType: "NUMBER",
                description: "Failed to load widget configuration"
              },
              chartData: [{ count_count: "Error" }],
              error: widgetResult.error,
              isMockData: true
            });
          }
        } catch (error) {
          console.error(`위젯 ${layout.widgetId} 로딩 실패:`, error);
          layoutsWithData.push({
            ...layout,
            widget: { 
              name: "Load Failed", 
              chartType: "NUMBER",
              description: "Widget loading failed"
            },
            chartData: [{ count_count: "Failed" }],
            error: error.message,
            isMockData: true
          });
        }
      }

      return {
        success: true,
        data: layoutsWithData
      };

    } catch (error) {
      console.error('대시보드 위젯들 로딩 실패:', error);
      
      return {
        success: false,
        error: error.message,
        data: []
      };
    }
  }

  /**
   * 차트 타입에 따른 timeDimension 설정
   */
  getTimeDimension(chartType) {
    switch (chartType) {
      case 'NUMBER':
        return null;
      case 'BAR_TIME_SERIES':
      case 'LINE_TIME_SERIES':
        return { granularity: "auto" };
      default:
        return null;
    }
  }

  /**
   * 목업 데이터 생성 (API 실패 시 fallback)
   */
  getMockWidgetData(widgetConfig) {
    const chartType = widgetConfig.chartType;
    
    if (chartType === 'NUMBER') {
      return {
        success: true,
        data: [{ count_count: "Loading..." }],
        chartType: chartType,
        isMockData: true
      };
    } else if (chartType === 'BAR_TIME_SERIES' || chartType === 'LINE_TIME_SERIES') {
      return {
        success: true,
        data: [
          { time_dimension: "2025-08-20", count_count: "50" },
          { time_dimension: "2025-08-21", count_count: "75" },
          { time_dimension: "2025-08-22", count_count: "100" },
          { time_dimension: "2025-08-23", count_count: "25" },
          { time_dimension: "2025-08-24", count_count: "80" }
        ],
        chartType: chartType,
        isMockData: true
      };
    }
    
    return {
      success: false,
      error: 'Unsupported chart type',
      data: null,
      chartType: chartType
    };
  }
}

// ============================================
// 유틸리티 함수들 통합
// ============================================
export const commonUtils = {
  // 날짜 포맷 함수
  formatDate(dateString) {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  },

  // 대시보드 소유자 타입 확인
  isDashboardEditable(dashboard) {
    return dashboard.owner === 'PROJECT';
  },

  // 프로젝트 ID 가져오기
  getCurrentProjectId() {
    return import.meta.env.VITE_LANGFUSE_PROJECT_ID;
  },

  /**
   * 그리드 위치를 CSS Grid 스타일로 변환
   */
  getGridStyle(layout) {
    return {
      gridColumn: `${layout.x + 1} / span ${layout.x_size}`,
      gridRow: `${layout.y + 1} / span ${layout.y_size}`,
    };
  },

  /**
   * 차트 데이터 포맷팅
   */
  formatChartData(data, chartType) {
    if (!data || !Array.isArray(data)) return [];
    
    switch (chartType) {
      case 'NUMBER':
        return data[0]?.count_count || '0';
      case 'BAR_TIME_SERIES':
      case 'LINE_TIME_SERIES':
        return data.map(item => ({
          date: item.time_dimension,
          value: parseInt(item.count_count) || 0,
          label: item.environment || null
        }));
      default:
        return data;
    }
  },

  /**
   * 위젯 크기 클래스 반환
   */
  getWidgetSizeClass(layout) {
    const size = layout.x_size * layout.y_size;
    if (size <= 9) return 'widget-small';
    if (size <= 20) return 'widget-medium';
    return 'widget-large';
  },

  /**
   * 날짜 범위 생성 (대시보드 필터용)
   */
  getDateRange(days = 7) {
    const toTimestamp = new Date().toISOString();
    const fromTimestamp = new Date(Date.now() - (days * 24 * 60 * 60 * 1000)).toISOString();
    
    return {
      fromTimestamp,
      toTimestamp
    };
  },

  /**
   * 차트 색상 팔레트
   */
  getChartColors() {
    return [
      '#2E8B57', // Sea Green
      '#4682B4', // Steel Blue  
      '#CD853F', // Peru
      '#9932CC', // Dark Violet
      '#DC143C', // Crimson
      '#FF8C00', // Dark Orange
      '#008B8B', // Dark Cyan
      '#B22222'  // Fire Brick
    ];
  }
};

// ============================================
// 에러 클래스
// ============================================
export class APIError extends Error {
  constructor(message, status, details) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.details = details;
  }
}

// ============================================
// 인스턴스 생성 및 Export
// ============================================
const dashboardAPI = new DashboardAPI();
const widgetAPI = new WidgetAPI();

// 기존 import 방식과 완전 호환
export { dashboardAPI, widgetAPI };

// 통합된 API 객체 (선택적 사용)
export const api = {
  dashboard: dashboardAPI,
  widget: widgetAPI
};

// 기본 export
export default {
  dashboardAPI,
  widgetAPI,
  commonUtils,
  api
};
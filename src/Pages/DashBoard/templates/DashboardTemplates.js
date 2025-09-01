// src/features/dashboard/components/templates/DashboardTemplates.js
// 대시보드별 위젯 설정 및 템플릿 정의 (원본 Langfuse 레이아웃 유지)

export const DASHBOARD_TEMPLATES = {
  // Usage Management Dashboard
  'usage-management': {
    name: 'Langfuse Usage Management',
    description: 'Track usage metrics across traces, observations, and scores to manage resource allocation.',
    layout: 'grid',
    widgets: [
      // Row 1: 4 NUMBER widgets (원본과 동일한 위치)
      { 
        id: 'trace-count', 
        component: 'TotalMetric', 
        title: 'Total Trace Count', 
        description: 'Total count of traces across all environments',
        x: 0, y: 0, x_size: 3, y_size: 3,  // 원본: y_size: 3
        queryType: 'count',
        target: 'traces'
      },
      { 
        id: 'obs-count', 
        component: 'TotalMetric', 
        title: 'Total Observation Count', 
        description: 'Total count of observations across all environments',
        x: 3, y: 0, x_size: 3, y_size: 3,  // 원본: y_size: 3
        queryType: 'count',
        target: 'observations'
      },
      { 
        id: 'score-numeric', 
        component: 'TotalMetric', 
        title: 'Total Score Count (numeric)', 
        description: 'Total count of numeric scores across all environments',
        x: 6, y: 0, x_size: 3, y_size: 3,  // 원본: y_size: 3
        queryType: 'count',
        target: 'scores-numeric'
      },
      { 
        id: 'score-categorical', 
        component: 'TotalMetric', 
        title: 'Total Score Count (categorical)', 
        description: 'Total count of categorical scores across all environments',
        x: 9, y: 0, x_size: 3, y_size: 3,  // 원본: y_size: 3
        queryType: 'count',
        target: 'scores-categorical'
      },
      
      // Row 2: 4 BAR_TIME_SERIES widgets (원본과 동일한 위치)
      { 
        id: 'trace-time', 
        component: 'BarTimeSeriesChart', 
        title: 'Total Trace Count (over time)', 
        description: 'Trend of trace count over time',
        x: 0, y: 3, x_size: 3, y_size: 5,  // 원본: y: 3, y_size: 5
        queryType: 'timeseries',
        target: 'traces'
      },
      { 
        id: 'obs-time', 
        component: 'BarTimeSeriesChart', 
        title: 'Total Observation Count (over time)', 
        description: 'Trend of observation count over time',
        x: 3, y: 3, x_size: 3, y_size: 5,  // 원본: y: 3, y_size: 5
        queryType: 'timeseries',
        target: 'observations'
      },
      { 
        id: 'score-numeric-time', 
        component: 'BarTimeSeriesChart', 
        title: 'Total Score Count (numeric)', 
        description: 'Trend of numeric score count over time',
        x: 6, y: 3, x_size: 3, y_size: 5,  // 원본: y: 3, y_size: 5
        queryType: 'timeseries',
        target: 'scores-numeric'
      },
      { 
        id: 'score-categorical-time', 
        component: 'BarTimeSeriesChart', 
        title: 'Total Score Count (categorical)', 
        description: 'Trend of categorical score count over time',
        x: 9, y: 3, x_size: 3, y_size: 5,  // 원본: y: 3, y_size: 5
        queryType: 'timeseries',
        target: 'scores-categorical'
      },
      
      // Row 3: 2 BAR_TIME_SERIES widgets (원본과 동일한 위치)
      { 
        id: 'trace-env', 
        component: 'TracesBarListChart', 
        title: 'Total Trace Count (by env)', 
        description: 'Distribution of trace count across different environments',
        x: 0, y: 8, x_size: 6, y_size: 5,  // 원본: y: 8, y_size: 5
        queryType: 'group-by',
        target: 'traces',
        groupBy: 'environment'
      },
      { 
        id: 'obs-env', 
        component: 'TracesBarListChart', 
        title: 'Total Observation Count (by env)', 
        description: 'Distribution of observation count across different environments',
        x: 6, y: 8, x_size: 6, y_size: 5,  // 원본: y: 8, y_size: 5
        queryType: 'group-by',
        target: 'observations',
        groupBy: 'environment'
      }
    ]
  },

  // Cost Dashboard  
  'cost-dashboard': {
    name: 'Langfuse Cost Dashboard',
    description: 'Review your LLM costs.',
    layout: 'grid',
    widgets: [
      // Row 1: 원본과 동일한 위치
      { 
        id: 'trace-count', 
        component: 'TotalMetric', 
        title: 'Total Count Traces', 
        description: 'Shows the count of Traces',
        x: 0, y: 0, x_size: 2, y_size: 2,  // 원본과 동일
        queryType: 'count',
        target: 'traces'
      },
      { 
        id: 'obs-count', 
        component: 'TotalMetric', 
        title: 'Total Count Observations', 
        description: 'Shows the count of Observations',
        x: 2, y: 0, x_size: 2, y_size: 2,  // 원본과 동일
        queryType: 'count',
        target: 'observations'
      },
      { 
        id: 'cost-model', 
        component: 'ModelCostTable', 
        title: 'Cost by Model Name', 
        description: 'Total cost broken down by model name',
        x: 4, y: 0, x_size: 4, y_size: 5,  // 원본과 동일
        queryType: 'group-by',
        target: 'observations',
        groupBy: 'model',
        metric: 'cost'
      },
      { 
        id: 'cost-env', 
        component: 'UserChart', 
        title: 'Cost by Environment', 
        description: 'Total cost broken down by trace environment',
        x: 8, y: 0, x_size: 4, y_size: 5,  // 원본과 동일
        queryType: 'group-by',
        target: 'traces',
        groupBy: 'environment',
        metric: 'cost',
        chartType: 'donut'
      },
      
      // Row 2  
      { 
        id: 'total-cost', 
        component: 'BarTimeSeriesChart', 
        title: 'Total costs', 
        description: 'Total cost across all use cases',
        x: 0, y: 2, x_size: 4, y_size: 3,  // 원본과 동일
        queryType: 'timeseries',
        target: 'observations',
        metric: 'cost'
      },
      { 
        id: 'users-cost', 
        component: 'TracesBarListChart', 
        title: 'Top 20 Users by Cost', 
        description: 'Aggregated model cost (observations.totalCost) by trace.userId',
        x: 0, y: 5, x_size: 4, y_size: 6,  // 원본과 동일
        queryType: 'top-n',
        target: 'traces',
        groupBy: 'userId',
        metric: 'cost',
        limit: 20
      },
      { 
        id: 'trace-cost', 
        component: 'TracesBarListChart', 
        title: 'Top 20 Use Cases (Trace) by Cost', 
        description: 'Aggregated model cost (observations.totalCost) by trace.name',
        x: 4, y: 5, x_size: 4, y_size: 6,  // 원본과 동일
        queryType: 'top-n',
        target: 'traces',
        groupBy: 'name',
        metric: 'cost',
        limit: 20
      },
      
      // Row 3
      { 
        id: 'obs-cost', 
        component: 'TracesBarListChart', 
        title: 'Top 20 Use Cases (Observation) by Cost', 
        description: 'Aggregated model cost (observations.totalCost) by observation.name',
        x: 8, y: 5, x_size: 4, y_size: 6,  // 원본과 동일
        queryType: 'top-n',
        target: 'observations',
        groupBy: 'name',
        metric: 'cost',
        limit: 20
      },
      { 
        id: 'cost-trace-p95', 
        component: 'BarTimeSeriesChart', 
        title: 'P 95 Cost per Trace', 
        description: '95th percentile of cost for each trace',
        x: 0, y: 11, x_size: 4, y_size: 5,  // 원본과 동일
        queryType: 'percentile-timeseries',
        target: 'traces',
        metric: 'cost',
        percentile: 95
      },
      { 
        id: 'cost-input-p95', 
        component: 'BarTimeSeriesChart', 
        title: 'P 95 Input Cost per Observation', 
        description: '95th percentile of input cost for each observation (llm call)',
        x: 4, y: 11, x_size: 4, y_size: 5,  // 원본과 동일
        queryType: 'percentile-timeseries',
        target: 'observations',
        metric: 'inputCost',
        percentile: 95
      },
      { 
        id: 'cost-output-p95', 
        component: 'BarTimeSeriesChart', 
        title: 'P 95 Output Cost per Observation', 
        description: '95th percentile of output cost for each observation (llm call)',
        x: 8, y: 11, x_size: 4, y_size: 5,  // 원본과 동일
        queryType: 'percentile-timeseries',
        target: 'observations',
        metric: 'outputCost',
        percentile: 95
      }
    ]
  },

  // Latency Dashboard
  'latency-dashboard': {
    name: 'Langfuse Latency Dashboard', 
    description: 'Monitor latency metrics across traces and generations for performance optimization.',
    layout: 'grid',
    widgets: [
      // Row 1: 원본과 동일한 위치
      { 
        id: 'latency-use-case', 
        component: 'LatencyChart', 
        title: 'P 95 Latency by Use Case', 
        description: 'P95 latency metrics segmented by trace name',
        x: 0, y: 0, x_size: 6, y_size: 5,  // 원본과 동일
        queryType: 'percentile-group',
        target: 'traces',
        metric: 'latency',
        percentile: 95,
        groupBy: 'name'
      },
      { 
        id: 'latency-level', 
        component: 'LatencyChart', 
        title: 'P 95 Latency by Level (Observations)', 
        description: 'P95 latency metrics for observations segmented by level',
        x: 6, y: 0, x_size: 6, y_size: 5,  // 원본과 동일
        queryType: 'percentile-group',
        target: 'observations',
        metric: 'latency',
        percentile: 95,
        groupBy: 'level'
      },
      
      // Row 2: 원본과 동일한 위치
      { 
        id: 'latency-users', 
        component: 'TracesBarListChart', 
        title: 'Max Latency by User Id (Traces)', 
        description: 'Maximum latency for the top 50 users by trace userId',
        x: 0, y: 5, x_size: 6, y_size: 5,  // 원본과 동일
        queryType: 'max-group',
        target: 'traces',
        metric: 'latency',
        groupBy: 'userId',
        limit: 50
      },
      { 
        id: 'time-first-token', 
        component: 'ModelUsageChart', 
        title: 'Avg Time To First Token by Prompt Name (Observations)', 
        description: 'Average time to first token segmented by prompt name',
        x: 6, y: 5, x_size: 6, y_size: 5,  // 원본과 동일
        queryType: 'avg-group',
        target: 'observations',
        metric: 'timeToFirstToken',
        groupBy: 'promptName'
      },
      
      // Row 3: 원본과 동일한 위치
      { 
        id: 'time-first-token-model', 
        component: 'BarTimeSeriesChart', 
        title: 'P 95 Time To First Token by Model', 
        description: 'P95 time to first token metrics segmented by model',
        x: 0, y: 10, x_size: 4, y_size: 5,  // 원본과 동일
        queryType: 'percentile-timeseries-group',
        target: 'observations',
        metric: 'timeToFirstToken',
        percentile: 95,
        groupBy: 'model'
      },
      { 
        id: 'latency-model', 
        component: 'BarTimeSeriesChart', 
        title: 'P 95 Latency by Model', 
        description: 'P95 latency metrics for observations segmented by model',
        x: 4, y: 10, x_size: 4, y_size: 5,  // 원본과 동일
        queryType: 'percentile-timeseries-group',
        target: 'observations',
        metric: 'latency',
        percentile: 95,
        groupBy: 'model'
      },
      { 
        id: 'output-tokens-model', 
        component: 'BarTimeSeriesChart', 
        title: 'Avg Output Tokens Per Second by Model', 
        description: 'Average output tokens per second segmented by model',
        x: 8, y: 10, x_size: 4, y_size: 5,  // 원본과 동일
        queryType: 'avg-timeseries-group',
        target: 'observations',
        metric: 'tokensPerSecond',
        groupBy: 'model'
      }
    ]
  }
};

// 대시보드 ID 매핑 (실제 ID → 템플릿 키)
export const DASHBOARD_ID_MAPPING = {
  'cmawln8k700xqad07000k1q8b': 'usage-management',  // 실제 Usage Management ID
  'cmawoi7yd00aqad07f3why08w': 'cost-dashboard',    // 실제 Cost Dashboard ID
  'cmawk4ywj00jmad072jn7s0ru': 'latency-dashboard'  // 실제 Latency Dashboard ID
};

// 템플릿 키 추출 함수
export function getTemplateKey(dashboardData, dashboardId) {
  // 실제 ID로 먼저 매칭
  if (DASHBOARD_ID_MAPPING[dashboardId]) {
    return DASHBOARD_ID_MAPPING[dashboardId];
  }
  
  // 대시보드 이름으로 매칭
  const name = dashboardData?.name?.toLowerCase() || '';
  
  if (name.includes('usage management')) return 'usage-management';
  if (name.includes('cost dashboard')) return 'cost-dashboard';  
  if (name.includes('latency dashboard')) return 'latency-dashboard';
  
  return null;
}

// 위젯별 쿼리 생성 함수 (executeQuery 파라미터 생성용)
export function buildWidgetQuery(widget, filters = {}) {
  const { queryType, target, metric = 'count', groupBy, percentile, limit } = widget;
  
  // 기본 쿼리 구조
  const baseQuery = {
    view: target, // 'traces', 'observations', 'scores-numeric' 등
    filters: filters.customFilters || [],
    fromTimestamp: filters.fromTimestamp,
    toTimestamp: filters.toTimestamp
  };
  
  // 쿼리 타입별 설정
  switch (queryType) {
    case 'count':
      return {
        ...baseQuery,
        metrics: [{ measure: 'count', aggregation: 'count' }]
      };
      
    case 'timeseries':
      return {
        ...baseQuery,
        metrics: [{ measure: metric, aggregation: 'count' }],
        timeDimension: { field: 'createdAt', granularity: 'day' }
      };
      
    case 'group-by':
      return {
        ...baseQuery,
        dimensions: [groupBy],
        metrics: [{ measure: metric, aggregation: 'sum' }],
        orderBy: [{ field: metric, direction: 'desc' }],
        limit: limit || 10
      };
      
    case 'percentile-timeseries':
      return {
        ...baseQuery,
        metrics: [{ measure: metric, aggregation: `p${percentile}` }],
        timeDimension: { field: 'createdAt', granularity: 'day' }
      };
      
    case 'top-n':
      return {
        ...baseQuery,
        dimensions: [groupBy],
        metrics: [{ measure: metric, aggregation: 'sum' }],
        orderBy: [{ field: metric, direction: 'desc' }],
        limit: limit || 20
      };
      
    default:
      return baseQuery;
  }
}
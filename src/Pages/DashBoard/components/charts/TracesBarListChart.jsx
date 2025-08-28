import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';

/**
 * TracesBarListChart - 수평 바 차트 컴포넌트
 * API 데이터: [{ name: string, value: number, percentage?: number }]
 */
const TracesBarListChart = ({ 
  data = [], 
  isLoading = false, 
  isEmpty = false, 
  error = null,
  maxItems = 10 
}) => {
  // 기본 색상 팔레트
  const colors = [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b', 
    '#8b5cf6', '#06b6d4', '#f97316', '#84cc16'
  ];

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="animate-pulse space-y-3 w-full">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="w-20 h-4 bg-gray-200 rounded"></div>
              <div className="flex-1 h-4 bg-gray-200 rounded"></div>
              <div className="w-12 h-4 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p className="text-sm">차트를 로드할 수 없습니다</p>
          <p className="text-xs text-gray-400 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  // 빈 데이터 상태
  if (isEmpty || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p className="text-sm">표시할 데이터가 없습니다</p>
        </div>
      </div>
    );
  }

  // 데이터 처리
  const processedData = data
    .filter(item => item && item.name && typeof item.value === 'number')
    .sort((a, b) => b.value - a.value)
    .slice(0, maxItems)
    .map((item, index) => ({
      name: item.name.length > 20 ? item.name.substring(0, 17) + '...' : item.name,
      value: item.value,
      percentage: item.percentage,
      color: colors[index % colors.length]
    }));

  if (processedData.length === 0) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p className="text-sm">유효한 데이터가 없습니다</p>
        </div>
      </div>
    );
  }

  // 숫자 포맷팅
  const formatValue = (value) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toString();
  };

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={processedData}
          layout="horizontal"
          margin={{ top: 5, right: 30, left: 5, bottom: 5 }}
        >
          <XAxis 
            type="number" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6b7280' }}
            tickFormatter={formatValue}
          />
          <YAxis 
            type="category" 
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#374151' }}
            width={100}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
            {processedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      
      {/* 데이터 리스트 (차트 하단) */}
      <div className="mt-4 space-y-2 max-h-32 overflow-y-auto">
        {processedData.slice(0, 5).map((item, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.color }}
              />
              <span className="text-gray-700">{item.name}</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="font-medium">{formatValue(item.value)}</span>
              {item.percentage && (
                <span className="text-gray-500">{item.percentage}%</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TracesBarListChart;
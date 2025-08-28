import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';

/**
 * SimpleBarChart - 수직 바 차트 컴포넌트
 * API 데이터: [{ name: string, value: number, color?: string }]
 */
const SimpleBarChart = ({ 
  data = [], 
  isLoading = false, 
  isEmpty = false, 
  error = null,
  maxItems = 15,
  showTooltip = true 
}) => {
  // 기본 색상 팔레트
  const colors = [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b', 
    '#8b5cf6', '#06b6d4', '#f97316', '#84cc16',
    '#ec4899', '#6366f1', '#14b8a6', '#f87171'
  ];

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="animate-pulse flex space-x-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div 
              key={i} 
              className="bg-gray-200 rounded"
              style={{ 
                width: '24px',
                height: `${Math.random() * 150 + 50}px`
              }}
            />
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
      name: item.name.length > 12 ? item.name.substring(0, 9) + '...' : item.name,
      value: item.value,
      color: item.color || colors[index % colors.length]
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

  // 커스텀 툴팁
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          <p className="text-blue-600">
            값: <span className="font-bold">{formatValue(payload[0].value)}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={processedData}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <XAxis 
            dataKey="name" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: '#6b7280' }}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6b7280' }}
            tickFormatter={formatValue}
          />
          {showTooltip && <Tooltip content={<CustomTooltip />} />}
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {processedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SimpleBarChart;
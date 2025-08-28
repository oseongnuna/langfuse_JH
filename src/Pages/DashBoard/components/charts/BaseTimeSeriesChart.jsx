import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

const BaseTimeSeriesChart = ({ data }) => {
  // API 데이터 변환 - 실제 API 응답을 차트용 데이터로 변환
  const transformApiData = (apiData) => {
    if (!Array.isArray(apiData)) return [];
    
    // 날짜별로 그룹화
    const grouped = {};
    apiData.forEach(item => {
      const date = item.time_dimension;
      if (!grouped[date]) {
        grouped[date] = { date, timestamp: new Date(date).getTime() };
      }
      
      // name에 따라 시리즈 분리
      const seriesName = item.name || 'null';
      grouped[date][seriesName] = Math.round(item.p95_latency);
    });
    
    // 배열로 변환하고 날짜순 정렬
    return Object.values(grouped).sort((a, b) => a.timestamp - b.timestamp);
  };

  const chartData = transformApiData(data);
  
  // 시리즈 정보 추출 (첫 번째 데이터 항목에서)
  const getSeries = (data) => {
    if (!data || data.length === 0) return [];
    
    const firstItem = data[0];
    return Object.keys(firstItem)
      .filter(key => key !== 'date' && key !== 'timestamp')
      .map((key, index) => ({
        key,
        color: getSeriesColor(index),
        name: key === 'null' ? 'No Name' : key
      }));
  };

  const series = getSeries(chartData);

  // 색상 팔레트
  function getSeriesColor(index) {
    const colors = ['#f59e0b', '#ef4444', '#3b82f6', '#10b981', '#8b5cf6', '#f97316'];
    return colors[index % colors.length];
  }

  // 커스텀 툴팁
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value?.toLocaleString()}ms
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // 데이터가 없는 경우
  if (!chartData || chartData.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center text-gray-500">
        No data available
      </div>
    );
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis 
            dataKey="date"
            tick={{ fontSize: 12, fill: '#64748b' }}
            angle={-45}
            textAnchor="end"
            height={80}
            interval={0}
          />
          <YAxis 
            tick={{ fontSize: 12, fill: '#64748b' }}
            tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          
          {series.map((serie) => (
            <Line
              key={serie.key}
              type="monotone"
              dataKey={serie.key}
              stroke={serie.color}
              strokeWidth={2}
              dot={{ r: 4, strokeWidth: 2 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
              connectNulls={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BaseTimeSeriesChart;
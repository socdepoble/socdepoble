import React from 'react';

const Sparkline = ({ data, color = "#ff7300", width = 100, height = 30, strokeWidth = 2 }) => {
  if (!data || data.length === 0) return null;
  
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  
  const xStep = width / Math.max(data.length - 1, 1);
  
  const points = data.map((val, idx) => {
    const x = idx * xStep;
    const y = height - ((val - min) / range) * (height - strokeWidth * 2) - strokeWidth;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible block">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
};

export default Sparkline;

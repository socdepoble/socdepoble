import React from 'react';
import Sparkline from './Sparkline';
import { Activity, AlertTriangle, CheckCircle, TrendingDown, TrendingUp, Minus } from 'lucide-react';

const MetricCard = ({ 
  metric,
  value,
  thresholdStr,
  description,
  trend = 'stable', // 'up', 'down', 'stable'
  status = 'ok',    // 'ok', 'warning', 'critical'
  history = []      // Array of numbers for the sparkline
}) => {
  
  const statusColors = {
    ok: 'text-green-500',
    warning: 'text-yellow-500',
    critical: 'text-red-500'
  };

  const statusBgs = {
    ok: 'bg-green-50',
    warning: 'bg-yellow-50',
    critical: 'bg-red-50'
  };
  
  const StatusIcon = status === 'ok' ? CheckCircle : (status === 'warning' ? Activity : AlertTriangle);
  
  const TrendIcon = trend === 'up' ? TrendingUp : (trend === 'down' ? TrendingDown : Minus);
  
  const sparklineColor = status === 'ok' ? '#22c55e' : (status === 'warning' ? '#eab308' : '#ef4444');

  return (
    <div className={`sp-card rounded-xl p-4 flex flex-col justify-between border ${status === 'critical' ? 'border-red-300' : 'border-gray-100'} bg-white shadow-sm hover:shadow-md transition-shadow relative overflow-hidden`}>
      
      {/* Barra superior decorativa */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${statusBgs[status]} border-b ${status === 'critical' ? 'border-red-200' : (status === 'warning' ? 'border-yellow-200' : 'border-green-200')}`} />

      <div className="flex justify-between items-start mt-2">
        <div className="pr-2">
          <h3 className="font-bold text-[15px] text-gray-800 leading-tight">{metric}</h3>
          <p className="text-[12px] text-gray-500 mt-1 line-clamp-2">{description}</p>
        </div>
        <div className={`shrink-0 p-2 rounded-full ${statusBgs[status]} ${statusColors[status]}`}>
          <StatusIcon size={18} />
        </div>
      </div>
      
      <div className="mt-4 flex items-end justify-between">
        <div className="flex flex-col">
          <span className="text-3xl font-black tracking-tighter text-gray-900 leading-none">
            {value}
          </span>
          <span className="text-[11px] font-mono text-gray-400 mt-1 uppercase">
            {thresholdStr}
          </span>
        </div>
        
        <div className="flex flex-col items-end gap-1">
          {history.length > 0 && (
            <div className="opacity-80">
              <Sparkline data={history} width={70} height={24} color={sparklineColor} strokeWidth={2.5} />
            </div>
          )}
          <div className={`flex items-center gap-1 text-[11px] font-bold ${statusColors[status]}`}>
            <TrendIcon size={12} />
            <span className="uppercase">{trend}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricCard;

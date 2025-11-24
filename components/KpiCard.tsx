import React from 'react';
import { THEME } from '../constants';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  subValue?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
  delay?: number;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, subValue, trend, icon, delay = 0 }) => {
  return (
    <div 
      className="relative overflow-hidden rounded-2xl p-6 bg-[#003554]/40 backdrop-blur-sm border border-white/5 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-forwards"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">{title}</h3>
        {icon && <div className="text-[#70d44c] p-2 bg-[#70d44c]/10 rounded-lg">{icon}</div>}
      </div>
      
      <div className="flex items-end gap-2">
        <span className="text-3xl lg:text-4xl font-bold text-white tracking-tight">{value}</span>
      </div>

      {(subValue || trend) && (
        <div className="mt-4 flex items-center gap-2 text-sm">
          {trend === 'up' && <ArrowUpRight size={16} className="text-[#70d44c]" />}
          {trend === 'down' && <ArrowDownRight size={16} className="text-red-400" />}
          {trend === 'neutral' && <Minus size={16} className="text-gray-400" />}
          
          <span className={`${
            trend === 'up' ? 'text-[#70d44c]' : trend === 'down' ? 'text-red-400' : 'text-gray-400'
          }`}>
            {subValue}
          </span>
        </div>
      )}
      
      {/* Decorative gradient blob */}
      <div 
        className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ backgroundColor: THEME.accent }}
      />
    </div>
  );
};

export default KpiCard;
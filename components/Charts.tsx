import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { THEME } from '../constants';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#00243a] border border-white/10 p-3 rounded-lg shadow-xl">
        <p className="text-gray-300 text-sm mb-1">{label}</p>
        <p className="text-[#70d44c] font-bold text-lg">
          {typeof payload[0].value === 'number' 
            ? payload[0].value.toLocaleString('pt-BR') 
            : payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

export const RevenueAreaChart = ({ data }: { data: any[] }) => (
  <div className="w-full h-full min-w-0 min-h-0">
    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0} debounce={100}>
      <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={THEME.accent} stopOpacity={0.3} />
            <stop offset="95%" stopColor={THEME.accent} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
        <XAxis 
          dataKey="month" 
          stroke="#94a3b8" 
          fontSize={12} 
          tickLine={false} 
          axisLine={false} 
        />
        <YAxis 
          stroke="#94a3b8" 
          fontSize={12} 
          tickLine={false} 
          axisLine={false}
          tickFormatter={(value) => `R$${value/1000}k`}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)' }} />
        <Area 
          type="monotone" 
          dataKey="value" 
          stroke={THEME.accent} 
          strokeWidth={3}
          fillOpacity={1} 
          fill="url(#colorValue)" 
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

export const SourcePieChart = ({ data }: { data: any[] }) => {
  const COLORS = [THEME.accent, '#0ea5e9', '#6366f1', '#a855f7', '#ec4899'];

  return (
    <div className="w-full h-full min-w-0 min-h-0">
      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0} debounce={100}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0)" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export const StageBarChart = ({ data }: { data: any[] }) => (
  <div className="w-full h-full min-w-0 min-h-0">
    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0} debounce={100}>
      <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
        <XAxis type="number" hide />
        <YAxis 
          dataKey="name" 
          type="category" 
          stroke="#94a3b8" 
          fontSize={11} 
          width={80}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
        <Bar dataKey="value" fill={THEME.accent} radius={[0, 4, 4, 0]} barSize={20} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export const Sparkline = ({ data, color = THEME.accent }: { data: any[], color?: string }) => (
  <div className="h-12 w-full mt-2 min-w-0 min-h-[48px]">
    <ResponsiveContainer width="100%" height={48} minWidth={0} minHeight={0} debounce={100}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id={`sparklineGradient-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.4} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area 
          type="monotone" 
          dataKey="value" 
          stroke={color} 
          strokeWidth={2}
          fillOpacity={1} 
          fill={`url(#sparklineGradient-${color.replace('#', '')})`}
          isAnimationActive={true}
          animationDuration={1500}
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

import React from 'react';
import { THEME } from '../constants';
import { ArrowUpRight, ArrowDownRight, Minus, X } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  subValue?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
  delay?: number;
  chart?: React.ReactNode;
  onClick?: () => void;
  onClose?: (e: React.MouseEvent) => void;
  isActive?: boolean;
  onTitleClick?: (e: React.MouseEvent) => void;
  isEditingTitle?: boolean;
  onTitleChange?: (newTitle: string) => void;
  onTitleBlur?: () => void;
}

const KpiCard: React.FC<KpiCardProps> = ({ 
  title, 
  value, 
  subValue, 
  trend, 
  icon, 
  delay = 0, 
  chart,
  onClick,
  onClose,
  isActive,
  onTitleClick,
  isEditingTitle,
  onTitleChange,
  onTitleBlur
}) => {
  return (
    <div 
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-[#001a2c]/80 to-[#003554]/40 backdrop-blur-md border transition-all duration-300 group h-[140px] flex flex-col justify-between ${
        onClick ? 'cursor-pointer hover:bg-[#003554]/60' : ''
      } ${
        isActive ? 'border-[#70d44c]/60 ring-1 ring-[#70d44c]/30' : 'border-[#70d44c]/15'
      } shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-forwards`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {onClose && (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onClose(e);
          }}
          className="absolute top-3 right-3 p-1 rounded-full bg-white/0 hover:bg-white/10 text-gray-500 hover:text-white transition-all opacity-0 group-hover:opacity-100 z-20"
          title="Remover destaque"
        >
          <X size={14} />
        </button>
      )}
      
      <div className="flex justify-between items-start gap-4 h-full">
        <div className="flex-1 flex flex-col justify-between h-full overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            {isEditingTitle ? (
              <input 
                autoFocus
                type="text"
                value={title}
                onChange={(e) => onTitleChange?.(e.target.value)}
                onBlur={onTitleBlur}
                onKeyDown={(e) => e.key === 'Enter' && onTitleBlur?.()}
                onClick={(e) => e.stopPropagation()}
                className="bg-white/10 border-b border-[#70d44c] text-white text-[10px] font-bold uppercase tracking-[0.2em] outline-none px-1 w-full"
              />
            ) : (
              <h3 
                onClick={(e) => {
                  if (onTitleClick) {
                    e.stopPropagation();
                    onTitleClick(e);
                  }
                }}
                className={`text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] truncate pr-2 ${onTitleClick ? 'cursor-pointer hover:text-white' : ''}`}
              >
                {title}
              </h3>
            )}
            {icon && <div className="text-[#70d44c] p-1.5 bg-[#70d44c]/10 rounded-lg shrink-0 lg:hidden">{icon}</div>}
          </div>
          
          <div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-2xl lg:text-[2.35rem] font-bold text-white tracking-tight">{value}</span>
              {trend && (
                <div className="flex items-center text-[0.9rem] leading-[1rem]">
                  {trend === 'up' && <ArrowUpRight size={14} className="text-[#70d44c]" />}
                  {trend === 'down' && <ArrowDownRight size={14} className="text-red-400" />}
                  <span className={`${
                    trend === 'up' ? 'text-[#70d44c]' : trend === 'down' ? 'text-red-400' : 'text-gray-400'
                  }`}>
                    {subValue}
                  </span>
                </div>
              )}
            </div>
            
            {!chart && subValue && !trend && (
              <div className="text-[0.9rem] leading-[1rem] text-gray-400 truncate">
                {subValue}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col justify-between items-end h-full shrink-0">
          {icon && <div className="text-[#70d44c] p-2 bg-[#70d44c]/10 rounded-xl border border-[#70d44c]/20 hidden lg:block">{icon}</div>}
          {chart && (
            <div className="w-24 lg:w-32 h-12 mt-auto">
              {chart}
            </div>
          )}
        </div>
      </div>
      
      {/* Subtle Glow Effect */}
      <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-[#70d44c]/5 blur-2xl rounded-full pointer-events-none" />
    </div>
  );
};

export default KpiCard;

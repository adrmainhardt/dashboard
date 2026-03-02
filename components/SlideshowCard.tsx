import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface SlideshowCardProps {
  title: string;
  items: { name: string; value: string }[];
  icon: LucideIcon;
  iconColor: string;
  delay?: number;
  badge?: number;
  isNotification?: boolean;
}

const SlideshowCard: React.FC<SlideshowCardProps> = ({ title, items, icon: Icon, iconColor, delay = 0, badge, isNotification }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 15000);

    return () => clearInterval(interval);
  }, [items.length]);

  const currentItem = items[currentIndex] || { name: '---', value: '---' };

  return (
    <div 
      className="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-[#001a2c]/80 to-[#003554]/40 backdrop-blur-md border border-[#70d44c]/15 shadow-lg h-[140px] flex flex-col justify-center animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-forwards group"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="relative z-10 flex items-center gap-6">
        {/* Left: Icon */}
        <div className="relative shrink-0">
          <div className="p-3 bg-[#70d44c]/10 rounded-2xl border border-[#70d44c]/20 group-hover:scale-110 transition-transform duration-500 text-[#70d44c]">
            <Icon size={32} />
          </div>
          {badge !== undefined && badge > 0 && (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-[#001a2c] shadow-lg">
              {badge}
            </div>
          )}
        </div>

        {/* Right: Content */}
        <div className="flex-1 overflow-hidden">
          <h3 className="text-gray-400 text-[9px] font-bold uppercase tracking-[0.2em] mb-1.5 truncate">{title}</h3>
          
          <div className="relative min-h-[3.5rem] flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ x: 10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -10, opacity: 0 }}
                transition={{ duration: 0.4, ease: "circOut" }}
                className="flex flex-col"
              >
                <span className={`${
                  isNotification 
                    ? 'text-[0.95rem] font-medium' 
                    : 'text-sm md:text-[1.6rem] font-bold'
                } text-white whitespace-normal tracking-tight leading-tight`}>
                  {currentItem.name}
                </span>
                {currentItem.value && currentItem.value !== '---' && (
                  <span className="text-sm font-bold text-[#70d44c] mt-0.5">
                    {currentItem.value}
                  </span>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Progress Dots (Restored to circular style) */}
      {items.length > 1 && (
        <div className="absolute bottom-3 left-0 right-0 flex gap-1.5 justify-center">
          {items.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-1 w-1 rounded-full transition-all duration-300 ${
                idx === currentIndex ? 'bg-[#70d44c] scale-125 shadow-[0_0_5px_#70d44c]' : 'bg-white/10'
              }`}
            />
          ))}
        </div>
      )}

      {/* Decorative Background Elements */}
      <div className="absolute -right-8 -top-8 w-24 h-24 bg-[#70d44c] opacity-[0.03] blur-3xl rounded-full pointer-events-none group-hover:opacity-[0.06] transition-opacity duration-700" />
    </div>
  );
};

export default SlideshowCard;

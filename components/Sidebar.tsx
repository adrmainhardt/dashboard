import React from 'react';
import { LayoutDashboard, Megaphone, PlusCircle, CheckCircle, XCircle } from 'lucide-react';
import { Tab } from '../types';
import { LOGO_URL } from '../constants';

interface SidebarProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: Tab.HOME, label: 'Visão Geral', icon: LayoutDashboard },
    { id: Tab.MARKETING, label: 'Marketing', icon: Megaphone },
    { id: Tab.NEW_BUSINESS, label: 'Novos Negócios', icon: PlusCircle },
    { id: Tab.WON, label: 'Negócios Ganhos', icon: CheckCircle },
    { id: Tab.LOST, label: 'Negócios Perdidos', icon: XCircle },
  ];

  return (
    <div className="h-full w-64 flex flex-col border-r border-white/10 bg-[#001a2c] shadow-2xl z-10">
      <div className="p-8 flex items-center justify-center border-b border-white/10 bg-[#001524]">
        <img 
          src={LOGO_URL} 
          alt="Tidas Logo" 
          className="h-10 w-auto object-contain"
        />
      </div>
      
      <nav className="flex-1 py-6 px-3 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-300 group ${
                isActive 
                  ? 'bg-[#70d44c]/20 text-[#70d44c]' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon 
                size={22} 
                className={`mr-3 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} 
              />
              <span className="font-medium text-sm lg:text-base">{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#70d44c] shadow-[0_0_8px_#70d44c]" />
              )}
            </button>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-white/10 text-center text-xs text-gray-500">
        Dashboard Inteligente<br/>v2.0
      </div>
    </div>
  );
};

export default Sidebar;
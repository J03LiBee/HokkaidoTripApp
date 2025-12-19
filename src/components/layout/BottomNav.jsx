/**
 * Bottom Navigation Component
 */

import React from 'react';
import { Home, CalendarDays, CheckSquare, Receipt } from 'lucide-react';

const BottomNav = ({ activeTab, onTabChange, isAnonymous = false }) => {
  const allNavItems = [
    { id: 'dashboard', icon: Home, label: '首頁', guestAllowed: true },
    { id: 'itinerary', icon: CalendarDays, label: '行程', guestAllowed: true },
    { id: 'expenses', icon: Receipt, label: '記帳', guestAllowed: false },
    { id: 'checklist', icon: CheckSquare, label: '清單', guestAllowed: false },
  ];
  
  // Filter navigation items based on guest status
  const navItems = isAnonymous 
    ? allNavItems.filter(item => item.guestAllowed)
    : allNavItems;

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-xl border-t border-slate-200 z-[100] pb-safe">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {navItems.map(({ id, icon: Icon, label }) => {
          const isActive = activeTab === id;
          return (
            <button 
              key={id}
              onClick={() => onTabChange(id)} 
              className={`flex flex-col items-center justify-center w-full h-full transition-colors duration-300 relative ${
                isActive ? 'text-slate-800' : 'text-slate-400'
              }`}
              aria-label={label}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} className={isActive ? "drop-shadow-sm" : ""} />
              <span className={`text-[10px] mt-1 font-medium ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                {label}
              </span>
              {isActive && (
                <div className="absolute top-0 w-8 h-1 bg-slate-800 rounded-b-full opacity-20" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;


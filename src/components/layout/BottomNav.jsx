/**
 * Bottom Navigation Component
 */

import React from 'react';
import { Home, CalendarDays, CheckSquare, Wallet } from 'lucide-react';

const BottomNav = ({ activeTab, onTabChange }) => {
  const navItems = [
    { id: 'dashboard', icon: Home, label: '首頁' },
    { id: 'itinerary', icon: CalendarDays, label: '行程表' },
    { id: 'checklist', icon: CheckSquare, label: '清單' },
    { id: 'budget', icon: Wallet, label: '預算' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-xl border-t border-blue-200 z-50 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
      <div className="grid grid-cols-4 h-16 max-w-3xl mx-auto">
        {navItems.map(({ id, icon: Icon, label }) => (
          <button 
            key={id}
            onClick={() => onTabChange(id)} 
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${
              activeTab === id ? 'text-blue-600' : 'text-slate-400'
            }`}
            aria-label={label}
          >
            <Icon size={20} /> 
            <span className="text-[10px]">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;


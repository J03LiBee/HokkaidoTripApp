/**
 * App Header Component
 */

import React, { useState, useEffect, useRef } from 'react';
import { Plus, User, LogOut } from 'lucide-react';

const Header = ({ activeTab, onAddEvent, user, onSignOut }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);
  const getTitle = () => {
    switch(activeTab) {
      case 'dashboard': return '北海道冬之旅 ❄️';
      case 'itinerary': return '行程規劃';
      case 'expenses': return '智能記帳';
      case 'checklist': return '物資清單';
      case 'budget': return '旅程預算';
      default: return '北海道冬之旅';
    }
  };

  const getUserDisplayName = () => {
    if (user?.displayName) return user.displayName;
    if (user?.email) return user.email;
    return '訪客';
  };

  return (
    <header className="fixed top-0 w-full z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-4 h-16 flex items-center justify-between shadow-sm">
      <div>
        <h1 className="text-lg font-serif text-slate-800 tracking-tight">
          {getTitle()}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Add Event Button (Itinerary only) */}
        {activeTab === 'itinerary' && (
          <button 
            onClick={onAddEvent}
            className="w-10 h-10 rounded-full bg-orange-200/80 text-orange-800 border border-orange-200 flex items-center justify-center shadow-sm hover:scale-105 transition active:scale-95"
            aria-label="新增行程"
          >
            <Plus size={20} />
          </button>
        )}

        {/* User Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 bg-white/50 hover:bg-white/70 border border-white/60 px-3 py-2 rounded-full transition-all backdrop-blur-sm shadow-sm"
            aria-label="用戶選單"
          >
            {user?.photoURL ? (
              <img 
                src={user.photoURL} 
                alt="User" 
                className="w-6 h-6 rounded-full"
              />
            ) : (
              <User size={18} className="text-slate-600" />
            )}
            <span className="text-sm text-slate-700 font-medium hidden sm:inline">
              {getUserDisplayName()}
            </span>
          </button>

          {/* Dropdown Menu */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white/90 backdrop-blur-xl border border-white/60 rounded-2xl shadow-xl overflow-hidden animate-scaleIn">
              <div className="p-3 border-b border-slate-200">
                <div className="text-sm font-medium text-slate-800">
                  {getUserDisplayName()}
                </div>
                {user?.email && (
                  <div className="text-xs text-slate-600 mt-1">
                    {user.email}
                  </div>
                )}
                {user?.isAnonymous && (
                  <div className="text-xs text-orange-600 mt-1">
                    訪客模式
                  </div>
                )}
              </div>
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  onSignOut();
                }}
                className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
              >
                <LogOut size={16} />
                登出
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;


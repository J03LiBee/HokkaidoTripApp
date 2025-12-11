/**
 * Dashboard View Component
 * Shows trip overview, countdown, budget summary, and next event
 */

import React from 'react';
import { 
  Wallet, 
  CheckSquare, 
  MapPin, 
  Plane, 
  ThermometerSnowflake,
  ArrowRight 
} from 'lucide-react';
import { getDaysUntil, getNextEvent } from '@utils/dateHelpers';

const Dashboard = ({ itinerary, budget, checklist, onNavigate }) => {
  // Countdown Logic
  const diffDays = getDaysUntil('2025-12-31T00:00:00');

  // Upcoming Event
  const nextEvent = getNextEvent(itinerary);

  // Budget Calc
  const totalSpent = budget.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  
  // Checklist Calc
  const totalItems = checklist.length;
  const checkedItems = checklist.filter(i => i.checked).length;
  const progress = totalItems > 0 ? (checkedItems / totalItems) * 100 : 0;

  return (
    <div className="space-y-6 pb-20">
      {/* Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500 to-blue-700 p-6 shadow-xl border border-blue-300">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="relative z-10">
          <h2 className="text-blue-100 text-sm font-medium mb-1">距離出發還有</h2>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold text-white">{diffDays}</span>
            <span className="text-lg text-blue-200">天</span>
          </div>
          <div className="mt-4 flex items-center gap-2 text-blue-100 bg-white/10 px-3 py-1.5 rounded-lg w-fit text-sm">
            <ThermometerSnowflake size={16} />
            預測氣溫: -5°C (小雪)
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div 
          onClick={() => onNavigate('budget')}
          className="bg-white/80 backdrop-blur border border-blue-200 p-4 rounded-2xl cursor-pointer hover:bg-white transition active:scale-95 shadow-md"
        >
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-green-500/20 text-green-400 rounded-lg">
              <Wallet size={20} />
            </div>
            <ArrowRight size={16} className="text-slate-500" />
          </div>
          <div className="text-slate-600 text-xs">總預算支出</div>
          <div className="text-xl font-bold text-slate-800">${totalSpent.toLocaleString()}</div>
        </div>

        <div 
          onClick={() => onNavigate('checklist')}
          className="bg-white/80 backdrop-blur border border-blue-200 p-4 rounded-2xl cursor-pointer hover:bg-white transition active:scale-95 shadow-md"
        >
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-purple-500/20 text-purple-400 rounded-lg">
              <CheckSquare size={20} />
            </div>
            <ArrowRight size={16} className="text-slate-500" />
          </div>
          <div className="text-slate-600 text-xs">行李準備</div>
          <div className="text-xl font-bold text-slate-800">{Math.round(progress)}%</div>
          <div className="w-full h-1 bg-blue-100 rounded-full mt-2 overflow-hidden">
            <div 
              className="h-full bg-purple-500 transition-all duration-500" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Next Event Card */}
      {nextEvent && (
        <div className="bg-white/80 backdrop-blur border border-blue-200 rounded-2xl p-5 shadow-lg">
          <h3 className="text-slate-600 text-xs uppercase tracking-wider mb-3 font-semibold">
            Upcoming • {nextEvent.date}
          </h3>
          <div className="flex gap-4 items-center">
            <div className="text-center min-w-[3.5rem] p-2 bg-blue-500/10 rounded-xl border border-blue-500/20">
              <div className="text-lg font-bold text-blue-400">
                {nextEvent.time.split(':')[0]}
              </div>
              <div className="text-xs text-blue-300">
                {nextEvent.time.split(':')[1]}
              </div>
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-800 leading-tight">
                {nextEvent.title}
              </h4>
              <div className="text-slate-600 text-sm flex items-center gap-1 mt-1">
                <MapPin size={12} /> {nextEvent.location || '未定地點'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Flight Info Mini */}
      <div className="bg-gradient-to-r from-blue-100 to-blue-50 border border-blue-200 rounded-2xl p-5 shadow-md">
        <div className="flex justify-between items-center text-slate-800 mb-2">
          <div className="flex items-center gap-2">
            <Plane size={16} className="text-blue-400" />
            <span className="text-sm font-semibold">HKG -&gt; CTS</span>
          </div>
          <span className="text-xs bg-blue-600/30 text-blue-200 px-2 py-0.5 rounded">
            Dec 31
          </span>
        </div>
        <div className="flex justify-between text-xs text-slate-600">
          <span>09:15 出發</span>
          <span>14:15 抵達</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


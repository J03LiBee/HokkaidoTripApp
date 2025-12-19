/**
 * Dashboard View Component
 * Shows trip overview, countdown, budget summary, and next event
 */

import React, { useState } from 'react';
import { 
  Wallet, 
  CheckSquare, 
  MapPin, 
  Plane, 
  CloudSnow,
  ArrowRightLeft,
  Sparkles
} from 'lucide-react';
import { getDaysUntil, getNextEvent } from '@utils/dateHelpers';
import GlassCard from '@components/common/GlassCard';
import WeatherWidget from '@components/common/WeatherWidget';

const Dashboard = ({ itinerary, budget, personalChecklist, sharedChecklist, onNavigate }) => {
  const [jpy, setJpy] = useState(1000);
  // Countdown Logic
  const diffDays = getDaysUntil('2025-12-31T00:00:00');

  // Upcoming Event
  const nextEvent = getNextEvent(itinerary);

  // Budget Calc
  const totalSpent = budget.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  
  // Checklist Calc - combine personal and shared
  const allChecklist = [...(personalChecklist || []), ...(sharedChecklist || [])];
  const totalItems = allChecklist.length;
  const checkedItems = allChecklist.filter(i => i.checked).length;
  const progress = totalItems > 0 ? (checkedItems / totalItems) * 100 : 0;

  return (
    <div className="space-y-6 pb-24 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <p className="text-slate-500 text-sm font-medium tracking-wider uppercase mb-1">
            Dec 31 • Hokkaido
          </p>
          <h1 className="text-4xl font-serif text-slate-800 tracking-tight leading-tight">
            Winter<br/>Journey.
          </h1>
        </div>
      </div>

      {/* Countdown Hero Card */}
      <GlassCard className="relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <CloudSnow size={120} />
        </div>
        <div className="relative z-10 flex flex-col items-center text-center py-4">
          <div className="bg-indigo-50/50 p-3 rounded-full mb-3 backdrop-blur-sm">
            <CloudSnow className="text-slate-600" size={32} />
          </div>
          <h2 className="text-5xl font-serif text-slate-700 mb-1">D-{diffDays}</h2>
          <p className="text-slate-500 font-medium">距離出發還有 {diffDays} 天</p>
        </div>
      </GlassCard>

      {/* Weather Forecast Widget */}
      <WeatherWidget />

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 gap-4">
        <GlassCard 
          onClick={() => onNavigate('expenses')}
          className="flex flex-col justify-between h-32 cursor-pointer hover:bg-white/70 transition-colors"
        >
          <div className="flex justify-between items-start">
            <div className="p-2 bg-purple-100/50 rounded-xl text-purple-700">
              <ArrowRightLeft size={20} />
            </div>
            <span className="text-xs text-slate-400 font-mono">JPY→HKD</span>
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-xs text-slate-400">¥</span>
              <input 
                type="number" 
                value={jpy} 
                onChange={(e) => setJpy(Number(e.target.value))}
                className="w-16 bg-transparent font-serif text-xl text-slate-700 focus:outline-none border-b border-transparent focus:border-purple-300"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <p className="text-sm font-medium text-slate-600">≈ ${(jpy * 0.057).toFixed(1)} HKD</p>
          </div>
        </GlassCard>

        <GlassCard 
          onClick={() => onNavigate('checklist')}
          className="flex flex-col justify-between h-32 cursor-pointer hover:bg-white/70 transition-colors relative overflow-hidden"
        >
          <div className="absolute -right-3 -top-3 w-16 h-16 bg-gradient-to-br from-purple-200 to-indigo-200 rounded-full blur-xl opacity-40"></div>
          
          <div className="flex justify-between items-start z-10">
            <div className="p-2 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl text-indigo-600">
              <CheckSquare size={20} />
            </div>
          </div>
          <div className="z-10">
            <h3 className="font-serif text-slate-700 text-lg">清單</h3>
            <p className="text-xs text-slate-500 leading-tight">{checkedItems}/{totalItems} 已完成</p>
          </div>
        </GlassCard>
      </div>

      {/* Next Event Timeline Preview */}
      {nextEvent && (
        <div className="pt-2">
          <div className="flex justify-between items-center mb-3 px-1">
            <h3 className="font-serif text-lg text-slate-700">Next Up</h3>
            <button 
              onClick={() => onNavigate('itinerary')}
              className="text-xs text-slate-500 uppercase tracking-wider hover:text-slate-700"
            >
              View All
            </button>
          </div>
          
          <GlassCard className="py-4 px-5 hover:bg-white/80 transition-colors">
            <div className="flex justify-between items-start mb-1">
              <span className="text-xs font-bold text-slate-400 tracking-wide font-mono">
                {nextEvent.time}
              </span>
            </div>
            <h3 className="font-serif text-lg text-slate-700 leading-tight mb-2">
              {nextEvent.title}
            </h3>
            {nextEvent.location && (
              <div className="flex items-center gap-1 text-slate-500 text-sm">
                <MapPin size={14} />
                {nextEvent.location}
              </div>
            )}
          </GlassCard>
        </div>
      )}

      {/* Mini Boarding Pass */}
      <div className="pt-2">
        <div className="flex justify-between items-center mb-3 px-1">
          <h3 className="font-serif text-lg text-slate-700">Flight</h3>
        </div>
        
        <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-white overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-purple-300 to-indigo-300 w-full"></div>
          
          <div className="p-5">
            <div className="flex justify-between items-center mb-6">
              <span className="font-mono text-sm text-slate-400">HKG → CTS</span>
              <span className="font-mono text-xs text-orange-500 border border-orange-200 bg-orange-50 px-2 py-0.5 rounded">
                Dec 31
              </span>
            </div>

            <div className="flex justify-between items-center">
              <div className="text-left">
                <p className="text-3xl font-serif text-slate-800">09:15</p>
                <p className="text-xs text-slate-500 uppercase tracking-wide">出發</p>
              </div>
              <div className="flex flex-col items-center flex-1 px-4">
                <Plane className="text-slate-300 rotate-90 mb-1" size={18} />
                <div className="h-px w-full bg-slate-200 relative">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-slate-300 rounded-full"></div>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">4h 45m</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-serif text-slate-800">14:15</p>
                <p className="text-xs text-slate-500 uppercase tracking-wide">抵達</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


/**
 * Checklist View Component
 * Displays packing checklist organized by category
 */

import React from 'react';
import { Sparkles, Plus } from 'lucide-react';
import { CHECKLIST_CATEGORIES } from '@constants/initialData';
import GlassCard from '@components/common/GlassCard';

const ChecklistView = ({ checklist, onToggleCheck }) => {
  const totalItems = checklist.length;
  const checkedItems = checklist.filter(i => i.checked).length;
  const progress = totalItems > 0 ? (checkedItems / totalItems) * 100 : 0;

  return (
    <div className="space-y-6 pb-24 animate-fade-in">
      
      {/* Progress Bar */}
      <div className="bg-white/40 rounded-full h-2 w-full overflow-hidden">
        <div 
          className="bg-gradient-to-r from-purple-300 to-indigo-300 h-full rounded-full transition-all duration-500" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      {CHECKLIST_CATEGORIES.map(cat => {
        const items = checklist.filter(i => i.category === cat);
        if (!items.length) return null;
        
        return (
          <div key={cat} className="space-y-3">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider pl-1">
              {cat}
            </h2>
            <div className="space-y-2">
              {items.map(item => (
                <div 
                  key={item.id} 
                  onClick={() => onToggleCheck(item)}
                  className={`group flex items-center gap-3 p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${
                    item.checked 
                      ? 'bg-slate-50/30 border-transparent opacity-60' 
                      : 'bg-white/60 border-white/60 shadow-sm backdrop-blur-sm hover:bg-white/80'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${
                    item.checked 
                      ? 'bg-slate-400 border-slate-400' 
                      : 'border-slate-300 group-hover:border-purple-300'
                  }`}>
                    {item.checked && <Sparkles size={12} className="text-white" />}
                  </div>
                  <span className={`font-medium ${
                    item.checked 
                      ? 'text-slate-400 line-through decoration-slate-300' 
                      : 'text-slate-700'
                  }`}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Add New Item Button */}
      <button className="w-full py-4 rounded-2xl border-2 border-dashed border-slate-300 text-slate-400 font-medium hover:border-slate-400 hover:text-slate-500 transition-colors flex items-center justify-center gap-2">
        <Plus size={18} /> 新增項目
      </button>
    </div>
  );
};

export default ChecklistView;


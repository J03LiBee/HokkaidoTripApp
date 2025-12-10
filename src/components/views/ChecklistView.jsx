/**
 * Checklist View Component
 * Displays packing checklist organized by category
 */

import React from 'react';
import { X } from 'lucide-react';
import { CHECKLIST_CATEGORIES } from '@constants/initialData';

const ChecklistView = ({ checklist, onToggleCheck }) => {
  return (
    <div className="space-y-4 pb-20">
      {CHECKLIST_CATEGORIES.map(cat => {
        const items = checklist.filter(i => i.category === cat);
        if (!items.length) return null;
        
        return (
          <div 
            key={cat} 
            className="bg-slate-800/50 backdrop-blur rounded-xl border border-white/5 overflow-hidden"
          >
            <div className="bg-slate-800 px-4 py-2 font-bold text-blue-200 text-sm">
              {cat}
            </div>
            <div className="divide-y divide-white/5">
              {items.map(item => (
                <div 
                  key={item.id} 
                  onClick={() => onToggleCheck(item)} 
                  className="p-4 flex gap-3 items-center hover:bg-white/5 cursor-pointer transition-colors"
                >
                  <div 
                    className={`w-5 h-5 rounded border flex items-center justify-center ${
                      item.checked 
                        ? 'bg-blue-500 border-blue-500' 
                        : 'border-slate-500'
                    }`}
                  >
                    {item.checked && <X size={14} />}
                  </div>
                  <span 
                    className={
                      item.checked 
                        ? 'line-through text-slate-500' 
                        : 'text-slate-200'
                    }
                  >
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChecklistView;


/**
 * Budget View Component
 * Clean budget display matching mainSample.jsx aesthetic
 */

import React from 'react';
import { getStatusColor } from '@utils/styleHelpers';
import GlassCard from '@components/common/GlassCard';

const BudgetView = ({ budget }) => {
  const totalAmount = budget.reduce((sum, b) => sum + Number(b.amount || 0), 0);

  return (
    <div className="space-y-6 pb-24 animate-fade-in">
      <h1 className="text-3xl font-serif text-slate-800">旅程預算</h1>

      {/* Total Summary */}
      <GlassCard className="text-center py-6">
        <p className="text-sm text-slate-500 uppercase tracking-wider mb-2">Total Budget</p>
        <p className="text-4xl font-serif text-slate-800">${totalAmount.toLocaleString()}</p>
      </GlassCard>

      {/* Budget Items */}
      <div className="space-y-3">
        {budget.map(b => (
          <GlassCard key={b.id} className="hover:bg-white/80 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <h3 className="font-medium text-slate-800">{b.item}</h3>
                <p className="text-xs text-slate-500">{b.payer}</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-serif text-slate-800">${b.amount}</p>
              </div>
            </div>
            <span className={`inline-block text-[10px] px-2 py-1 rounded border ${getStatusColor(b.status)}`}>
              {b.status}
            </span>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

export default BudgetView;



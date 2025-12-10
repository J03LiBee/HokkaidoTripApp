/**
 * Budget View Component
 * Displays trip budget and expenses
 */

import React from 'react';
import { getStatusColor } from '@utils/styleHelpers';

const BudgetView = ({ budget }) => {
  return (
    <div className="space-y-4 pb-20">
      <div className="bg-slate-800/50 backdrop-blur rounded-xl border border-white/5 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-800 text-slate-400">
            <tr>
              <th className="p-3 text-left">項目</th>
              <th className="p-3 text-right">金額</th>
              <th className="p-3 text-center">狀態</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {budget.map(b => (
              <tr key={b.id}>
                <td className="p-3">
                  <div className="text-white">{b.item}</div>
                  <div className="text-xs text-slate-500">{b.payer}</div>
                </td>
                <td className="p-3 text-right font-mono text-blue-300">
                  ${b.amount}
                </td>
                <td className="p-3 text-center">
                  <span 
                    className={`text-[10px] px-2 py-0.5 rounded border ${getStatusColor(b.status)}`}
                  >
                    {b.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BudgetView;


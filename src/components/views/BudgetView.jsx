/**
 * Budget View Component
 * Displays trip budget and expenses
 */

import React from 'react';
import { getStatusColor } from '@utils/styleHelpers';

const BudgetView = ({ budget }) => {
  return (
    <div className="space-y-4 pb-20">
      <div className="bg-white/80 backdrop-blur rounded-xl border border-blue-200 overflow-hidden shadow-md">
        <table className="w-full text-sm">
          <thead className="bg-blue-50 text-slate-700 border-b border-blue-200">
            <tr>
              <th className="p-3 text-left">項目</th>
              <th className="p-3 text-right">金額</th>
              <th className="p-3 text-center">狀態</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-100">
            {budget.map(b => (
              <tr key={b.id} className="hover:bg-blue-50 transition-colors">
                <td className="p-3">
                  <div className="text-slate-800 font-medium">{b.item}</div>
                  <div className="text-xs text-slate-600">{b.payer}</div>
                </td>
                <td className="p-3 text-right font-mono text-slate-700 font-semibold">
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


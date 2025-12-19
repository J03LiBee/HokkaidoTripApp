/**
 * Expense Tracker Component (記賬本)
 * 支援「牙公數」功能 - 記錄誰欠誰
 * 兩個用戶: Jason & Joe
 */

import React, { useState } from 'react';
import { Plus, UserCheck, TrendingUp } from 'lucide-react';
import { useExchangeRate } from '@hooks/useExchangeRate';
import { formatCurrency, convertJPYtoHKD } from '@services/exchangeRate';
import GlassCard from '@components/common/GlassCard';
import Modal from '@components/common/Modal';

const ExpenseTracker = ({ expenses, onAddExpense, onUpdateExpense, onDeleteExpense }) => {
  const { rate, lastUpdated } = useExchangeRate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newExpense, setNewExpense] = useState({
    title: '',
    amount: '',
    currency: 'JPY',
    category: 'food',
    date: new Date().toISOString().split('T')[0],
    paidBy: 'Jason', // 誰付錢
    isSplit: false,  // 是否牙公數
    notes: '',
  });

  const categories = [
    { value: 'food', label: '🍴 餐飲', color: 'bg-orange-100/50 text-orange-600 border-orange-200/50' },
    { value: 'transport', label: '✈️ 交通', color: 'bg-purple-100/50 text-purple-600 border-purple-200/50' },
    { value: 'accommodation', label: '🏨 住宿', color: 'bg-teal-100/50 text-teal-600 border-teal-200/50' },
    { value: 'activity', label: '🎯 活動', color: 'bg-indigo-100/50 text-indigo-600 border-indigo-200/50' },
    { value: 'shopping', label: '🛍️ 購物', color: 'bg-pink-100/50 text-pink-600 border-pink-200/50' },
    { value: 'other', label: '🏷️ 其他', color: 'bg-slate-100/50 text-slate-600 border-slate-200/50' },
  ];

  // Calculate totals and balances
  const totalJPY = expenses.reduce((sum, e) => sum + (e.currency === 'JPY' ? Number(e.amount) : 0), 0);
  const totalHKD = expenses.reduce((sum, e) => sum + (e.currency === 'HKD' ? Number(e.amount) : 0), 0);
  const totalInHKD = totalHKD + convertJPYtoHKD(totalJPY, rate);

  // Calculate who owes whom
  const calculateBalance = () => {
    let jasonPaid = 0;
    let joePaid = 0;
    let jasonOwes = 0;
    let joeOwes = 0;

    expenses.forEach(exp => {
      const amountInHKD = exp.currency === 'JPY' 
        ? convertJPYtoHKD(Number(exp.amount), rate) 
        : Number(exp.amount);

      if (exp.paidBy === 'Jason') {
        jasonPaid += amountInHKD;
        if (exp.isSplit) {
          joeOwes += amountInHKD / 2; // Joe 欠 Jason 一半
        }
      } else if (exp.paidBy === 'Joe') {
        joePaid += amountInHKD;
        if (exp.isSplit) {
          jasonOwes += amountInHKD / 2; // Jason 欠 Joe 一半
        }
      }
    });

    const netBalance = joeOwes - jasonOwes;
    return {
      jasonPaid,
      joePaid,
      netBalance, // 正數表示 Joe 欠 Jason，負數表示 Jason 欠 Joe
    };
  };

  const balance = calculateBalance();

  const handleSubmit = () => {
    if (!newExpense.title || !newExpense.amount) return;
    onAddExpense({
      ...newExpense,
      amount: Number(newExpense.amount),
    });
    setNewExpense({
      title: '',
      amount: '',
      currency: 'JPY',
      category: 'food',
      date: new Date().toISOString().split('T')[0],
      paidBy: 'Jason',
      isSplit: false,
      notes: '',
    });
    setIsModalOpen(false);
  };

  const getCategoryInfo = (category) => {
    return categories.find(c => c.value === category) || categories[categories.length - 1];
  };

  return (
    <div className="space-y-6 pb-24 animate-fade-in">
      <div className="flex justify-end items-center">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="p-3 rounded-full bg-orange-200/80 hover:bg-orange-300/80 text-orange-900 shadow-lg transition-all active:scale-95"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Balance Summary */}
      <GlassCard className="relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <UserCheck size={80} />
        </div>
        <div className="relative z-10">
          <h2 className="text-sm text-slate-500 uppercase tracking-wider mb-4">結算</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <p className="text-xs text-slate-500 mb-1">Jason 已付</p>
              <p className="text-2xl font-serif text-slate-700">${balance.jasonPaid.toFixed(0)}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-slate-500 mb-1">Joe 已付</p>
              <p className="text-2xl font-serif text-slate-700">${balance.joePaid.toFixed(0)}</p>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-4 text-center">
            {balance.netBalance > 0 ? (
              <>
                <p className="text-sm text-slate-600 mb-1">Joe 欠 Jason</p>
                <p className="text-3xl font-serif text-orange-600">${Math.abs(balance.netBalance).toFixed(0)}</p>
              </>
            ) : balance.netBalance < 0 ? (
              <>
                <p className="text-sm text-slate-600 mb-1">Jason 欠 Joe</p>
                <p className="text-3xl font-serif text-orange-600">${Math.abs(balance.netBalance).toFixed(0)}</p>
              </>
            ) : (
              <>
                <p className="text-sm text-slate-600 mb-1">已結算</p>
                <p className="text-3xl font-serif text-green-600">✓</p>
              </>
            )}
          </div>
        </div>
      </GlassCard>

      {/* Total Summary */}
      <GlassCard className="text-center py-6">
        <p className="text-sm text-slate-500 uppercase tracking-wider mb-2">總支出</p>
        <p className="text-4xl font-serif text-slate-800 mb-4">${totalInHKD.toFixed(0)}</p>
        <div className="flex justify-center gap-4 text-xs text-slate-500">
          <span>JPY: ¥{totalJPY.toLocaleString()}</span>
          <span>•</span>
          <span>HKD: ${totalHKD.toLocaleString()}</span>
        </div>
        {lastUpdated && (
          <p className="text-slate-400 text-xs mt-3 font-mono">
            匯率 (1 JPY = {rate.toFixed(4)} HKD)
          </p>
        )}
      </GlassCard>

      {/* Expense List */}
      <div className="space-y-3">
        <h2 className="text-lg font-serif text-slate-700 flex items-center gap-2">
          <TrendingUp size={20} />
          支出記錄
        </h2>
        
        {expenses.length === 0 ? (
          <GlassCard className="py-12 text-center">
            <div className="text-5xl mb-3">💰</div>
            <p className="text-slate-600 font-serif text-lg">還沒有記錄</p>
            <p className="text-sm text-slate-500 mt-1">點擊 + 按鈕新增</p>
          </GlassCard>
        ) : (
          expenses.slice().reverse().map((expense) => {
            const categoryInfo = getCategoryInfo(expense.category);
            const amountInHKD = expense.currency === 'JPY' 
              ? convertJPYtoHKD(Number(expense.amount), rate) 
              : Number(expense.amount);
            
            return (
              <GlassCard key={expense.id} className="hover:bg-white/80 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-slate-800">{expense.title}</h3>
                      {expense.isSplit && (
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded border border-orange-200">
                          牙公數
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 items-center text-xs text-slate-500">
                      <span className={`px-2 py-1 rounded-lg border ${categoryInfo.color}`}>
                        {categoryInfo.label}
                      </span>
                      <span>{expense.paidBy} 付款</span>
                      <span>•</span>
                      <span>{expense.date}</span>
                    </div>
                    {expense.notes && (
                      <p className="text-sm text-slate-600 mt-2">{expense.notes}</p>
                    )}
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-xl font-serif text-slate-800">
                      {expense.currency === 'JPY' ? '¥' : '$'}
                      {Number(expense.amount).toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      ≈ ${amountInHKD.toFixed(0)} HKD
                    </p>
                  </div>
                </div>
              </GlassCard>
            );
          })
        )}
      </div>

      {/* Add Expense Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="新增支出"
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs text-slate-700 font-medium">項目名稱</label>
            <input 
              type="text" 
              value={newExpense.title} 
              onChange={e => setNewExpense({ ...newExpense, title: e.target.value })} 
              className="w-full bg-white/80 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:ring-2 focus:ring-purple-300 focus:border-purple-300 transition-all" 
              placeholder="例如: 拉麵午餐"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-700 font-medium">金額</label>
              <input 
                type="number" 
                value={newExpense.amount} 
                onChange={e => setNewExpense({ ...newExpense, amount: e.target.value })} 
                className="w-full bg-white/80 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:ring-2 focus:ring-purple-300 focus:border-purple-300 transition-all" 
                placeholder="0"
              />
            </div>
            <div>
              <label className="text-xs text-slate-700 font-medium">貨幣</label>
              <select 
                value={newExpense.currency} 
                onChange={e => setNewExpense({ ...newExpense, currency: e.target.value })} 
                className="w-full bg-white/80 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:ring-2 focus:ring-purple-300 focus:border-purple-300 transition-all"
              >
                <option value="JPY">JPY (¥)</option>
                <option value="HKD">HKD ($)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-700 font-medium">類別</label>
            <select 
              value={newExpense.category} 
              onChange={e => setNewExpense({ ...newExpense, category: e.target.value })} 
              className="w-full bg-white/80 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:ring-2 focus:ring-purple-300 focus:border-purple-300 transition-all"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-700 font-medium">付款人</label>
              <select 
                value={newExpense.paidBy} 
                onChange={e => setNewExpense({ ...newExpense, paidBy: e.target.value })} 
                className="w-full bg-white/80 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:ring-2 focus:ring-purple-300 focus:border-purple-300 transition-all"
              >
                <option value="Jason">Jason</option>
                <option value="Joe">Joe</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-700 font-medium">日期</label>
              <input 
                type="date" 
                value={newExpense.date} 
                onChange={e => setNewExpense({ ...newExpense, date: e.target.value })} 
                className="w-full bg-white/80 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:ring-2 focus:ring-purple-300 focus:border-purple-300 transition-all" 
              />
            </div>
          </div>

          {/* 牙公數 Toggle */}
          <div className="bg-orange-50/50 border border-orange-200 rounded-xl p-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={newExpense.isSplit} 
                onChange={e => setNewExpense({ ...newExpense, isSplit: e.target.checked })} 
                className="w-5 h-5 rounded border-orange-300 text-orange-600 focus:ring-2 focus:ring-orange-300"
              />
              <div className="flex-1">
                <span className="text-sm font-medium text-slate-800">牙公數</span>
                <p className="text-xs text-slate-600 mt-0.5">
                  兩人平分費用，系統會自動計算欠款
                </p>
              </div>
            </label>
          </div>

          <div>
            <label className="text-xs text-slate-700 font-medium">備註</label>
            <textarea 
              rows="3" 
              value={newExpense.notes} 
              onChange={e => setNewExpense({ ...newExpense, notes: e.target.value })} 
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:ring-2 focus:ring-purple-300 focus:border-purple-300 transition-all" 
              placeholder="額外說明（選填）"
            />
          </div>

          <button 
            onClick={handleSubmit} 
            className="w-full py-3 rounded-xl bg-orange-200/80 hover:bg-orange-300/80 text-orange-900 font-semibold border border-orange-200 transition-all active:scale-95"
          >
            新增記錄
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ExpenseTracker;

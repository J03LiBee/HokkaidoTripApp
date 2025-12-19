/**
 * Simple and Compact Checklist View
 * Click item to edit
 */

import React, { useState } from 'react';
import { Plus, Trash2, Check, Edit2 } from 'lucide-react';
import Modal from '@components/common/Modal';

const ChecklistView = ({ checklist, onToggleCheck, onAddItem, onUpdateItem, onDeleteItem }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [modalData, setModalData] = useState({
    text: '',
    notes: '',
    checked: false
  });

  const totalItems = checklist.length;
  const checkedItems = checklist.filter(i => i.checked).length;
  const progress = totalItems > 0 ? (checkedItems / totalItems) * 100 : 0;

  const handleAddClick = () => {
    setEditingItem(null);
    setModalData({
      text: '',
      notes: '',
      checked: false
    });
    setIsModalOpen(true);
  };

  const handleItemClick = (item) => {
    setEditingItem(item);
    setModalData({
      text: item.text,
      notes: item.notes || '',
      checked: item.checked
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!modalData.text.trim()) return;
    
    if (editingItem) {
      // Update existing item
      onUpdateItem(editingItem.id, modalData);
    } else {
      // Add new item
      onAddItem(modalData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (editingItem && window.confirm('確定要刪除此項目？')) {
      onDeleteItem(editingItem.id);
      setIsModalOpen(false);
    }
  };

  const handleCheckboxClick = (item, e) => {
    e.stopPropagation();
    onToggleCheck(item);
  };

  const handleDeleteClick = async (itemId, e) => {
    e.stopPropagation();
    if (window.confirm('確定要刪除此項目？')) {
      try {
        await onDeleteItem(itemId);
        console.log('Item deleted successfully:', itemId);
      } catch (error) {
        console.error('Failed to delete item:', error);
        alert('刪除失敗，請重試');
      }
    }
  };

  return (
    <div className="space-y-4 pb-24 animate-fade-in">
      {/* Progress Header */}
      <div className="bg-white/60 backdrop-blur-sm border border-white/60 rounded-2xl p-4 shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-serif text-slate-700">完成進度</h2>
          <span className="text-2xl font-serif text-slate-700">
            {checkedItems}/{totalItems}
          </span>
        </div>
        <div className="bg-slate-200/50 rounded-full h-2.5 w-full overflow-hidden">
          <div 
            className="bg-gradient-to-r from-indigo-400 to-purple-400 h-full rounded-full transition-all duration-500" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Checklist Items */}
      <div className="space-y-2">
        {checklist.map(item => (
          <div 
            key={item.id}
            className={`bg-white/60 backdrop-blur-sm border border-white/60 rounded-xl p-3 shadow-sm transition-all duration-200 ${
              item.checked ? 'opacity-60' : ''
            }`}
          >
            <div className="flex items-center gap-3">
              {/* Checkbox */}
              <button
                onClick={(e) => handleCheckboxClick(item, e)}
                className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                  item.checked 
                    ? 'bg-indigo-500 border-indigo-500' 
                    : 'border-slate-300 hover:border-indigo-400'
                }`}
              >
                {item.checked && <Check size={12} className="text-white font-bold" />}
              </button>

              {/* Content - Clickable */}
              <div 
                className="flex-1 min-w-0 cursor-pointer"
                onClick={() => handleItemClick(item)}
              >
                <span className={`block font-medium text-sm ${
                  item.checked 
                    ? 'text-slate-400 line-through' 
                    : 'text-slate-700'
                }`}>
                  {item.text}
                </span>
                {item.notes && (
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                    {item.notes}
                  </p>
                )}
              </div>

              {/* Delete Button */}
              <button
                type="button"
                onClick={(e) => handleDeleteClick(item.id, e)}
                className="flex-shrink-0 p-1.5 rounded-lg hover:bg-red-100 text-slate-400 hover:text-red-600 transition-colors z-10"
                aria-label="刪除項目"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {checklist.length === 0 && (
        <div className="bg-white/40 backdrop-blur-sm border border-white/60 rounded-2xl p-12 text-center">
          <div className="text-5xl mb-3">📋</div>
          <p className="text-slate-600 font-serif text-lg">還沒有清單項目</p>
          <p className="text-sm text-slate-500 mt-1">點擊下方按鈕新增</p>
        </div>
      )}

      {/* Add Button */}
      <button 
        onClick={handleAddClick}
        className="w-full py-3 rounded-xl bg-indigo-100/80 hover:bg-indigo-200/80 border border-indigo-200 text-indigo-900 font-medium transition-all flex items-center justify-center gap-2"
      >
        <Plus size={18} /> 新增項目
      </button>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? '編輯項目' : '新增項目'}
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs text-slate-700 font-medium">項目名稱</label>
            <input
              type="text"
              value={modalData.text}
              onChange={e => setModalData({ ...modalData, text: e.target.value })}
              className="w-full bg-white/80 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all"
              placeholder="例如：護照"
              autoFocus
            />
          </div>

          <div>
            <label className="text-xs text-slate-700 font-medium">備註（選填）</label>
            <textarea
              rows="3"
              value={modalData.notes}
              onChange={e => setModalData({ ...modalData, notes: e.target.value })}
              className="w-full bg-white/80 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all resize-none"
              placeholder="額外說明"
            />
          </div>

          <div className="flex gap-3 pt-2">
            {editingItem && (
              <button
                onClick={handleDelete}
                className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium border border-slate-200 flex justify-center items-center gap-2 transition-colors"
              >
                <Trash2 size={16} /> 刪除
              </button>
            )}
            <button
              onClick={handleSave}
              disabled={!modalData.text.trim()}
              className="flex-1 py-3 rounded-xl bg-indigo-200/80 hover:bg-indigo-300/80 text-indigo-900 font-semibold border border-indigo-200 flex justify-center items-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check size={16} /> {editingItem ? '更新' : '新增'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ChecklistView;

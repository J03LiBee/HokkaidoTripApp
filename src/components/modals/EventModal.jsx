/**
 * Event Edit/Create Modal Component
 */

import React from 'react';
import { Save, Trash2 } from 'lucide-react';
import Modal from '@components/common/Modal';

const EventModal = ({ 
  isOpen, 
  onClose, 
  event, 
  isEditing,
  onSave, 
  onDelete,
  onChange 
}) => {
  if (!event) return null;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={isEditing ? '編輯行程' : '新增行程'}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-400">日期</label>
            <input 
              type="date" 
              value={event.date} 
              onChange={e => onChange({ ...event, date: e.target.value })} 
              className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white" 
            />
          </div>
          <div>
            <label className="text-xs text-slate-400">時間</label>
            <input 
              type="time" 
              value={event.time} 
              onChange={e => onChange({ ...event, time: e.target.value })} 
              className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white" 
            />
          </div>
        </div>
        
        <div>
          <label className="text-xs text-slate-400">標題</label>
          <input 
            type="text" 
            value={event.title} 
            onChange={e => onChange({ ...event, title: e.target.value })} 
            className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white" 
            placeholder="活動名稱" 
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-400">類型</label>
            <select 
              value={event.type} 
              onChange={e => onChange({ ...event, type: e.target.value })} 
              className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white"
            >
              <option value="activity">活動</option>
              <option value="food">餐飲</option>
              <option value="transport">交通</option>
              <option value="stay">住宿</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-400">地點</label>
            <input 
              type="text" 
              value={event.location} 
              onChange={e => onChange({ ...event, location: e.target.value })} 
              className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white" 
            />
          </div>
        </div>
        
        <div>
          <label className="text-xs text-slate-400">備註</label>
          <textarea 
            rows="3" 
            value={event.notes} 
            onChange={e => onChange({ ...event, notes: e.target.value })} 
            className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white" 
          />
        </div>
        
        <div className="flex gap-3 pt-2">
          {isEditing && (
            <button 
              onClick={onDelete} 
              className="flex-1 py-2 rounded bg-red-500/10 text-red-400 border border-red-500/20 flex justify-center items-center gap-2 hover:bg-red-500/20 transition-colors"
            >
              <Trash2 size={16}/> 刪除
            </button>
          )}
          <button 
            onClick={onSave} 
            className="flex-1 py-2 rounded bg-blue-600 text-white font-bold shadow-lg shadow-blue-900/50 flex justify-center items-center gap-2 hover:bg-blue-500 transition-colors"
          >
            <Save size={16}/> 儲存
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default EventModal;


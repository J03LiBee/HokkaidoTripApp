/**
 * Event Edit/Create Modal Component
 */

import React from 'react';
import { Save, Trash2, MapPin, Image } from 'lucide-react';
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

  // Extract iframe src from Google Maps embed HTML
  const getEmbedUrl = (mapLink) => {
    if (!mapLink) return null;
    
    // Try to extract src from iframe HTML
    const srcMatch = mapLink.match(/src=["']([^"']+)["']/);
    if (srcMatch) {
      return srcMatch[1];
    }
    
    // If it's already a URL (backward compatibility)
    if (mapLink.startsWith('http')) {
      return mapLink;
    }
    
    return null;
  };

  const embedUrl = getEmbedUrl(event.mapLink);

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={isEditing ? '編輯行程' : '新增行程'}
    >
      <div className="space-y-4 max-h-[70vh] overflow-y-auto">
        <div className="grid grid-cols-2 gap-2">
          <div className="min-w-0">
            <label className="text-xs text-slate-700 font-medium block mb-1">日期</label>
            <input 
              type="date" 
              value={event.date} 
              onChange={e => onChange({ ...event, date: e.target.value })} 
              className="w-full bg-white/80 border border-slate-200 rounded-lg px-1.5 py-1.5 text-xs text-slate-800 focus:ring-2 focus:ring-purple-300 focus:border-purple-300 transition-all" 
            />
          </div>
          <div className="min-w-0">
            <label className="text-xs text-slate-700 font-medium block mb-1">時間</label>
            <input 
              type="time" 
              value={event.time} 
              onChange={e => onChange({ ...event, time: e.target.value })} 
              step="900"
              className="w-full bg-white/80 border border-slate-200 rounded-lg px-1.5 py-1.5 text-xs text-slate-800 focus:ring-2 focus:ring-purple-300 focus:border-purple-300 transition-all" 
            />
          </div>
        </div>
        
        <div>
          <label className="text-xs text-slate-700 font-medium">標題</label>
          <input 
            type="text" 
            value={event.title} 
            onChange={e => onChange({ ...event, title: e.target.value })} 
            className="w-full bg-white border border-lavender-200 rounded p-2 text-slate-800 focus:ring-2 focus:ring-lavender-400 focus:border-lavender-400" 
            placeholder="活動名稱" 
          />
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div className="min-w-0">
            <label className="text-xs text-slate-700 font-medium block mb-1">類型</label>
            <select 
              value={event.type} 
              onChange={e => onChange({ ...event, type: e.target.value })} 
              className="w-full bg-white/80 border border-slate-200 rounded-lg px-1.5 py-1.5 text-xs text-slate-800 focus:ring-2 focus:ring-purple-300 focus:border-purple-300 transition-all"
            >
              <option value="activity">活動</option>
              <option value="food">餐飲</option>
              <option value="transport">交通</option>
              <option value="stay">住宿</option>
            </select>
          </div>
          <div className="min-w-0">
            <label className="text-xs text-slate-700 font-medium block mb-1">地點</label>
            <input 
              type="text" 
              value={event.location} 
              onChange={e => onChange({ ...event, location: e.target.value })} 
              className="w-full bg-white/80 border border-slate-200 rounded-lg px-2 py-1.5 text-sm text-slate-800 focus:ring-2 focus:ring-purple-300 focus:border-purple-300 transition-all" 
              placeholder="地點"
            />
          </div>
        </div>
        
        <div>
          <label className="text-xs text-slate-700 font-medium">備註</label>
          <textarea 
            rows="3" 
            value={event.notes} 
            onChange={e => onChange({ ...event, notes: e.target.value })} 
            className="w-full bg-white border border-lavender-200 rounded p-2 text-slate-800 focus:ring-2 focus:ring-lavender-400 focus:border-lavender-400" 
          />
        </div>

        {/* Google Maps Link */}
          <div>
            <label className="text-xs text-slate-700 font-medium flex items-center gap-1">
              <MapPin size={14} /> Google Maps Embed HTML
            </label>
            <textarea 
              rows="2"
              value={event.mapLink || ''} 
              onChange={e => onChange({ ...event, mapLink: e.target.value })} 
              className="w-full bg-white/80 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:ring-2 focus:ring-purple-300 focus:border-purple-300 transition-all text-sm font-mono" 
              placeholder='貼上 Google Maps 的 <iframe src="..." ... ></iframe>'
            />
            <p className="text-xs text-slate-500 mt-1">
              Google Maps → 分享 → 嵌入地圖 → 複製 HTML
            </p>
          </div>

        {/* Image URL */}
        <div>
          <label className="text-xs text-slate-700 font-medium flex items-center gap-1">
            <Image size={14} /> 圖片連結
          </label>
          <input 
            type="text" 
            value={event.imageUrl || ''} 
            onChange={e => onChange({ ...event, imageUrl: e.target.value })} 
            className="w-full bg-white/80 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:ring-2 focus:ring-purple-300 focus:border-purple-300 transition-all text-sm" 
            placeholder="貼上圖片連結 (https://...)"
          />
        </div>

        {/* Preview Image */}
        {event.imageUrl && (
          <div className="rounded-xl overflow-hidden border border-slate-200">
            <img 
              src={event.imageUrl} 
              alt="Preview" 
              className="w-full h-48 object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Preview Map */}
        {embedUrl && (
          <div className="rounded-xl overflow-hidden border border-slate-200 h-48">
            <iframe
              src={embedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        )}
        
        <div className="flex gap-3 pt-2">
          {isEditing && (
            <button 
              onClick={onDelete} 
              className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium border border-slate-200 flex justify-center items-center gap-2 transition-colors"
            >
              <Trash2 size={16}/> 刪除
            </button>
          )}
          <button 
            onClick={onSave} 
            className="flex-1 py-3 rounded-xl bg-orange-200/80 hover:bg-orange-300/80 text-orange-900 font-semibold border border-orange-200 flex justify-center items-center gap-2 transition-all active:scale-95"
          >
            <Save size={16}/> 儲存
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default EventModal;


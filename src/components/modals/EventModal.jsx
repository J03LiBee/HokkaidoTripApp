/**
 * Event Edit/Create Modal Component
 */

import React from 'react';
import { Save, Trash2, MapPin, Image, Link2, ExternalLink } from 'lucide-react';
import Modal from '@components/common/Modal';
import { getEmbedUrl, isShortLink } from '@utils/mapHelpers';

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

  const embedUrl = getEmbedUrl(event.mapLink);
  const isShort = isShortLink(event.mapLink);

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={isEditing ? '編輯行程' : '新增行程'}
    >
      <div className="space-y-4 max-h-[70vh] overflow-y-auto overflow-x-hidden">
        <div className="grid grid-cols-2 gap-2 w-full">
          <div className="min-w-0 max-w-full overflow-hidden">
            <label className="text-xs text-slate-700 font-medium block mb-1">日期</label>
            <input 
              type="date" 
              value={event.date} 
              onChange={e => onChange({ ...event, date: e.target.value })} 
              className="w-full max-w-full bg-white/80 border border-slate-200 rounded-lg px-1 py-1.5 text-xs text-slate-800 focus:ring-1 focus:ring-purple-300 focus:border-purple-300 transition-all"
              style={{ fontSize: '12px' }}
            />
          </div>
          <div className="min-w-0 max-w-full overflow-hidden">
            <label className="text-xs text-slate-700 font-medium block mb-1">時間</label>
            <input 
              type="time" 
              value={event.time} 
              onChange={e => onChange({ ...event, time: e.target.value })} 
              step="900"
              className="w-full max-w-full bg-white/80 border border-slate-200 rounded-lg px-1 py-1.5 text-xs text-slate-800 focus:ring-1 focus:ring-purple-300 focus:border-purple-300 transition-all"
              style={{ fontSize: '12px' }}
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
        
        <div className="grid grid-cols-2 gap-2 w-full">
          <div className="min-w-0 max-w-full overflow-hidden">
            <label className="text-xs text-slate-700 font-medium block mb-1">類型</label>
            <select 
              value={event.type} 
              onChange={e => onChange({ ...event, type: e.target.value })} 
              className="w-full max-w-full bg-white/80 border border-slate-200 rounded-lg px-1 py-1.5 text-xs text-slate-800 focus:ring-1 focus:ring-purple-300 focus:border-purple-300 transition-all"
              style={{ fontSize: '12px' }}
            >
              <option value="activity">活動</option>
              <option value="food">餐飲</option>
              <option value="transport">交通</option>
              <option value="stay">住宿</option>
            </select>
          </div>
          <div className="min-w-0 max-w-full overflow-hidden">
            <label className="text-xs text-slate-700 font-medium block mb-1">地點</label>
            <input 
              type="text" 
              value={event.location} 
              onChange={e => onChange({ ...event, location: e.target.value })} 
              className="w-full max-w-full bg-white/80 border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-800 focus:ring-1 focus:ring-purple-300 focus:border-purple-300 transition-all" 
              placeholder="地點"
              style={{ fontSize: '12px' }}
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
            <MapPin size={14} /> Google Maps 連結
          </label>
          <textarea 
            rows="2"
            value={event.mapLink || ''} 
            onChange={e => onChange({ ...event, mapLink: e.target.value })} 
            className="w-full bg-white/80 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:ring-2 focus:ring-purple-300 focus:border-purple-300 transition-all text-sm" 
            placeholder='貼上 Google Maps 連結或 <iframe> HTML'
          />
        </div>

        {/* External Link (e.g., tour agency, booking) */}
        <div>
          <label className="text-xs text-slate-700 font-medium flex items-center gap-1">
            <Link2 size={14} /> 外部連結
          </label>
          <input 
            type="url" 
            value={event.externalUrl || ''} 
            onChange={e => onChange({ ...event, externalUrl: e.target.value })} 
            className="w-full bg-white/80 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:ring-2 focus:ring-purple-300 focus:border-purple-300 transition-all text-sm" 
            placeholder="旅行社網站、預訂連結等 (https://...)"
          />
          <p className="text-xs text-slate-500 mt-1">
            💡 例如：旅行社網站、預訂頁面、活動官網等
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
          isShort ? (
            <div className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-4">
              <div className="flex items-start gap-3">
                <MapPin className="text-indigo-600 flex-shrink-0 mt-1" size={20} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-700 mb-1">Google Maps 位置</p>
                  <p className="text-xs text-slate-500 mb-3">
                    已儲存位置連結，點擊按鈕在 Google Maps 中查看
                  </p>
                  <a
                    href={embedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg transition-colors"
                  >
                    <ExternalLink size={14} />
                    在 Google Maps 中打開
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl overflow-hidden border border-slate-200 h-48">
              <iframe
                src={embedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Map Preview"
              />
            </div>
          )
        )}

        {/* Preview External Link */}
        {event.externalUrl && (
          <div className="rounded-xl border border-green-200 bg-green-50/50 p-3">
            <div className="flex items-center gap-2">
              <ExternalLink className="text-green-600 flex-shrink-0" size={16} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-700">相關連結</p>
                <p className="text-xs text-slate-500 truncate">{event.externalUrl}</p>
              </div>
              <a
                href={event.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs rounded-lg transition-colors"
              >
                預覽
              </a>
            </div>
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


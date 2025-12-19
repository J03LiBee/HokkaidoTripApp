/**
 * Event Detail/Preview Modal Component
 * Shows event details with map and image
 */

import React from 'react';
import { X, Edit2, MapPin, Clock, Tag } from 'lucide-react';
import Modal from '@components/common/Modal';

const EventDetailModal = ({ 
  isOpen, 
  onClose, 
  event,
  onEdit
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

  const getTypeColor = (type) => {
    switch(type) {
      case 'food': return 'bg-orange-100/50 text-orange-600 border-orange-200/50';
      case 'transport': return 'bg-purple-100/50 text-purple-600 border-purple-200/50';
      case 'stay': return 'bg-teal-100/50 text-teal-600 border-teal-200/50';
      default: return 'bg-slate-100/50 text-slate-600 border-slate-200/50';
    }
  };

  const getTypeLabel = (type) => {
    switch(type) {
      case 'food': return '餐飲';
      case 'transport': return '交通';
      case 'stay': return '住宿';
      default: return '活動';
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title=""
    >
      <div className="space-y-4 max-h-[75vh] overflow-y-auto">
        {/* Header with Edit Button */}
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h2 className="text-2xl font-serif text-slate-800 mb-2">
              {event.title}
            </h2>
            <div className="flex flex-wrap gap-2 items-center">
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs uppercase font-medium border ${getTypeColor(event.type)}`}>
                <Tag size={12} />
                {getTypeLabel(event.type)}
              </span>
              <span className="text-sm text-slate-500 flex items-center gap-1">
                <Clock size={14} />
                {event.date} {event.time}
              </span>
              {event.location && (
                <span className="text-sm text-slate-600 flex items-center gap-1">
                  <MapPin size={14} />
                  {event.location}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onEdit}
            className="flex-shrink-0 p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            title="編輯"
          >
            <Edit2 size={18} />
          </button>
        </div>

        {/* Image Display */}
        {event.imageUrl && (
          <div className="rounded-xl overflow-hidden border border-slate-200">
            <img 
              src={event.imageUrl} 
              alt={event.title} 
              className="w-full h-64 object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Google Maps Display */}
        {embedUrl && (
          <div className="rounded-xl overflow-hidden border border-slate-200 h-64">
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

        {/* Notes */}
        {event.notes && (
          <div className="bg-white/60 backdrop-blur-sm border border-slate-200 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-slate-700 mb-2">備註</h3>
            <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
              {event.notes}
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default EventDetailModal;


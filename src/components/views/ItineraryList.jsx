/**
 * Itinerary List View Component (Mobile-friendly)
 * Alternative to table view for smaller screens
 */

import React from 'react';
import { Clock, MapPin, Calendar, Edit } from 'lucide-react';
import { formatDateShort } from '@utils/dateHelpers';
import { getEventTypeColor } from '@utils/styleHelpers';

const ItineraryList = ({ itinerary, onEditEvent }) => {
  // Group events by date
  const groupedByDate = itinerary.reduce((acc, event) => {
    if (!acc[event.date]) {
      acc[event.date] = [];
    }
    acc[event.date].push(event);
    return acc;
  }, {});

  // Sort dates
  const sortedDates = Object.keys(groupedByDate).sort();

  // Sort events within each date by time
  sortedDates.forEach(date => {
    groupedByDate[date].sort((a, b) => a.time.localeCompare(b.time));
  });

  const getDayOfWeek = (dateStr) => {
    const date = new Date(dateStr);
    const days = ['日', '一', '二', '三', '四', '五', '六'];
    return days[date.getDay()];
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'food': return '🍴';
      case 'transport': return '✈️';
      case 'stay': return '🏨';
      default: return '📍';
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {sortedDates.map(date => (
        <div key={date} className="space-y-3">
          {/* Date Header */}
          <div className="sticky top-20 z-10 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700 pb-2 pt-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-600 rounded-xl">
                <div className="text-center">
                  <div className="text-lg font-bold text-white leading-none">
                    {new Date(date).getDate()}
                  </div>
                  <div className="text-[10px] text-blue-200 leading-none mt-0.5">
                    {new Date(date).getMonth() + 1}月
                  </div>
                </div>
              </div>
              <div>
                <div className="text-white font-bold">
                  {formatDateShort(date)}
                </div>
                <div className="text-slate-400 text-sm">
                  星期{getDayOfWeek(date)}
                </div>
              </div>
              <div className="ml-auto text-xs text-slate-500">
                {groupedByDate[date].length} 個活動
              </div>
            </div>
          </div>

          {/* Events for this date */}
          <div className="space-y-2">
            {groupedByDate[date].map(event => (
              <div
                key={event.id}
                onClick={() => onEditEvent(event.date, event.time, event)}
                className={`rounded-xl p-4 border cursor-pointer active:scale-[0.98] transition-transform ${getEventTypeColor(event.type)}`}
              >
                <div className="flex items-start gap-3">
                  {/* Time Badge */}
                  <div className="flex-shrink-0 text-center min-w-[3rem] pt-1">
                    <div className="text-lg font-bold leading-none">
                      {event.time}
                    </div>
                    <div className="text-[10px] opacity-70 mt-1">
                      {getTypeIcon(event.type)}
                    </div>
                  </div>

                  {/* Event Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-base leading-tight">
                        {event.title}
                      </h3>
                      <Edit size={14} className="flex-shrink-0 opacity-50 mt-1" />
                    </div>
                    
                    {event.location && (
                      <div className="flex items-center gap-1 mt-2 text-sm opacity-80">
                        <MapPin size={14} />
                        <span>{event.location}</span>
                      </div>
                    )}
                    
                    {event.notes && (
                      <div className="mt-2 text-sm opacity-70 line-clamp-2">
                        {event.notes}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Empty State */}
      {sortedDates.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📅</div>
          <div className="text-slate-400 text-lg mb-2">還沒有行程</div>
          <div className="text-slate-600 text-sm">點擊右上角 + 按鈕新增行程</div>
        </div>
      )}
    </div>
  );
};

export default ItineraryList;


/**
 * Itinerary Timeline View
 * Continuous timeline design (不分日期分組)
 */

import React from 'react';
import { MapPin } from 'lucide-react';
import GlassCard from '@components/common/GlassCard';
import { sortItineraryByDateTime } from '@utils/dateHelpers';

const ItineraryTimeline = ({ itinerary, onEventClick }) => {
  const sortedItinerary = sortItineraryByDateTime(itinerary);

  const getTypeColor = (type) => {
    switch(type) {
      case 'food': return 'bg-orange-100/50 text-orange-600 border-orange-200/50';
      case 'transport': return 'bg-purple-100/50 text-purple-600 border-purple-200/50';
      case 'stay': return 'bg-teal-100/50 text-teal-600 border-teal-200/50';
      default: return 'bg-slate-100/50 text-slate-600 border-slate-200/50';
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
    const weekday = weekdays[date.getDay()];
    return `${month}月${day}日 (${weekday})`;
  };

  // Date selection state
  const [selectedDate, setSelectedDate] = React.useState(null);
  
  // Get unique dates
  const uniqueDates = [...new Set(sortedItinerary.map(item => item.date))].sort();
  
  // Set initial selected date
  React.useEffect(() => {
    if (uniqueDates.length > 0 && !selectedDate) {
      setSelectedDate(uniqueDates[0]);
    }
  }, [uniqueDates.length]);
  
  // Filter itinerary by selected date
  const filteredItinerary = selectedDate 
    ? sortedItinerary.filter(item => item.date === selectedDate)
    : sortedItinerary;

  return (
    <div className="space-y-6 pb-24 animate-fade-in">
      {/* Date Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-hide">
        {uniqueDates.map((date) => {
          const d = new Date(date);
          const month = d.getMonth() + 1;
          const day = d.getDate();
          const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
          const weekday = weekdays[d.getDay()];
          const isSelected = selectedDate === date;
          
          return (
            <button 
              key={date}
              onClick={() => setSelectedDate(date)}
              className={`flex flex-col items-center justify-center min-w-[4rem] h-20 rounded-2xl border transition-all duration-300 ${
                isSelected 
                  ? 'bg-slate-700 text-white border-slate-700 shadow-lg scale-105' 
                  : 'bg-white/40 border-white/50 text-slate-500 hover:bg-white/60'
              }`}
            >
              <span className="text-[10px] font-medium uppercase opacity-80">
                {month}月{day}日
              </span>
              <span className={`text-2xl font-serif ${isSelected ? 'text-white' : 'text-slate-700'}`}>
                {day}
              </span>
              <span className="text-[10px] opacity-70">
                ({weekday})
              </span>
            </button>
          );
        })}
      </div>

      {/* Timeline - 左邊時間，右邊活動 */}
      <div className="space-y-4">
        {filteredItinerary.map((item) => {
          return (
            <div key={item.id} className="flex gap-4 items-start group">
              {/* 左邊：時間 */}
              <div className="flex-shrink-0 w-16 pt-4">
                <span className="text-sm font-bold text-slate-600 font-mono">
                  {item.time}
                </span>
              </div>
              
              {/* 右邊：活動卡片 */}
              <GlassCard 
                className="flex-1 py-4 px-5 hover:bg-white/80 transition-colors cursor-pointer"
                onClick={() => onEventClick(item)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-serif text-lg text-slate-700 leading-tight flex-1">
                    {item.title}
                  </h3>
                  {item.location && (
                    <span className="text-xs text-slate-500 flex items-center gap-1 ml-2">
                      <MapPin size={12} />
                      {item.location}
                    </span>
                  )}
                </div>
                
                <div className="flex gap-2 items-center mb-3">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] uppercase font-medium border ${getTypeColor(item.type)}`}>
                    {item.type}
                  </span>
                </div>

                {/* Image Display */}
                {item.imageUrl && (
                  <div className="rounded-lg overflow-hidden border border-slate-200/50">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      className="w-full h-40 object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </GlassCard>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredItinerary.length === 0 && (
        <GlassCard className="py-12 text-center">
          <div className="text-5xl mb-3">📅</div>
          <p className="text-slate-600 font-serif text-lg">還沒有行程</p>
          <p className="text-sm text-slate-500 mt-1">點擊右上角 + 按鈕新增</p>
        </GlassCard>
      )}
    </div>
  );
};

export default ItineraryTimeline;



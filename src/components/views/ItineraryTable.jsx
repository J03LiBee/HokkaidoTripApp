/**
 * Itinerary Table View Component
 * Grid-based calendar view for trip planning (Desktop optimized)
 */

import React, { useState } from 'react';
import { Plus, List, Calendar } from 'lucide-react';
import { TRIP_DATES, TIME_SLOTS } from '@constants/initialData';
import { formatDateShort } from '@utils/dateHelpers';
import { getEventTypeColor } from '@utils/styleHelpers';
import ItineraryList from './ItineraryList';

const ItineraryTable = ({ itinerary, onEditSlot }) => {
  const [viewMode, setViewMode] = useState('auto'); // 'auto', 'table', 'list'
  // Optimize lookup
  const getEvent = (date, hour) => {
    return itinerary.find(e => {
      if (e.date !== date) return false;
      const eHour = parseInt(e.time.split(':')[0], 10);
      return eHour === hour;
    });
  };

  // Determine which view to show
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const shouldShowList = viewMode === 'list' || (viewMode === 'auto' && isMobile);

  return (
    <div className="w-full">
      {/* View Toggle */}
      <div className="flex justify-end gap-2 mb-4">
        <button
          onClick={() => setViewMode('list')}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
            shouldShowList
              ? 'bg-blue-600 text-white'
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
          }`}
        >
          <List size={18} />
          <span className="text-sm">列表</span>
        </button>
        <button
          onClick={() => setViewMode('table')}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
            !shouldShowList
              ? 'bg-blue-600 text-white'
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
          }`}
        >
          <Calendar size={18} />
          <span className="text-sm">日曆</span>
        </button>
      </div>

      {/* List View (Mobile-friendly) */}
      {shouldShowList ? (
        <ItineraryList itinerary={itinerary} onEditEvent={onEditSlot} />
      ) : (
        /* Table View (Desktop) */
        <div className="h-[calc(100vh-200px)] w-full overflow-hidden flex flex-col bg-slate-900 border border-slate-700 rounded-xl relative">
      {/* Header Row */}
      <div className="flex overflow-x-auto border-b border-slate-700 bg-slate-800/90 z-20 hide-scrollbar ml-14">
        <div className="flex">
          {TRIP_DATES.map(date => (
            <div 
              key={date} 
              className="flex-none w-32 py-3 text-center border-r border-slate-700/50"
            >
              <div className="text-white font-bold text-sm">
                {formatDateShort(date)}
              </div>
              <div className="text-slate-500 text-[10px]">
                {date.slice(5)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid Body */}
      <div className="flex-1 overflow-auto relative">
        <div className="flex relative min-w-max">
          {/* Sticky Time Column */}
          <div className="sticky left-0 z-10 w-14 bg-slate-800 border-r border-slate-700 flex flex-col">
            {TIME_SLOTS.map(h => (
              <div 
                key={h} 
                className="h-24 flex items-center justify-center text-xs text-slate-400 border-b border-slate-700/50 relative"
              >
                {h}:00
              </div>
            ))}
          </div>

          {/* Event Columns */}
          <div className="flex">
            {TRIP_DATES.map(date => (
              <div 
                key={date} 
                className="w-32 flex-none flex flex-col border-r border-slate-700/50"
              >
                {TIME_SLOTS.map(h => {
                  const event = getEvent(date, h);
                  return (
                    <div 
                      key={`${date}-${h}`} 
                      onClick={() => onEditSlot(date, `${h < 10 ? '0'+h : h}:00`, event)}
                      className="h-24 p-1 border-b border-slate-700/50 relative group transition-colors hover:bg-white/5 cursor-pointer"
                    >
                      {event ? (
                        <div className={`w-full h-full rounded p-1.5 text-xs overflow-hidden border ${getEventTypeColor(event.type)}`}>
                          <div className="font-bold truncate">{event.title}</div>
                          <div className="opacity-70 truncate text-[10px] mt-1">
                            {event.time}
                          </div>
                          {event.location && (
                            <div className="opacity-60 truncate text-[10px]">
                              {event.location}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <Plus size={16} className="text-slate-600" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
        </div>
      )}
    </div>
  );
};

export default ItineraryTable;


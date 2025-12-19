/**
 * Weather Widget - 7-day forecast with horizontal scroll
 */

import React, { useState, useEffect } from 'react';
import { CloudSnow, Wind, Droplets, RefreshCw } from 'lucide-react';
import { getWeatherForecast, getWeatherEmoji, formatWeatherDate } from '@services/weatherService';
import GlassCard from './GlassCard';
import WeatherDetailModal from '@components/modals/WeatherDetailModal';

const WeatherWidget = () => {
  const [forecast, setForecast] = useState([]);
  const [rawApiData, setRawApiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const fetchWeather = async () => {
    setLoading(true);
    try {
      const result = await getWeatherForecast();
      setForecast(result.forecast);
      setRawApiData(result.rawData);
    } catch (error) {
      console.error('Failed to fetch weather:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  const handleDayClick = (day) => {
    setSelectedDay(day);
    setIsDetailModalOpen(true);
  };

  if (loading) {
    return (
      <GlassCard className="p-4">
        <div className="flex items-center gap-3">
          <CloudSnow size={20} className="text-indigo-500 animate-pulse" />
          <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
            札幌天氣預報
          </h3>
        </div>
        <div className="mt-4 text-center text-slate-400 py-8">
          <RefreshCw size={24} className="animate-spin mx-auto mb-2" />
          <p className="text-sm">載入中...</p>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-4 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <CloudSnow size={18} className="text-indigo-500" />
          <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
            札幌天氣預報
          </h3>
        </div>
        <button 
          onClick={fetchWeather}
          className="p-1.5 rounded-lg hover:bg-white/50 transition-colors"
          aria-label="刷新"
        >
          <RefreshCw size={14} className="text-slate-500" />
        </button>
      </div>

      {/* Horizontal Scroll Container */}
      <div className="overflow-x-auto -mx-4 px-4 scrollbar-hide">
        <div className="flex gap-3 pb-2" style={{ minWidth: 'max-content' }}>
          {forecast.map((day, index) => (
            <div
              key={day.date}
              onClick={() => handleDayClick(day)}
              className={`flex-shrink-0 bg-white/50 backdrop-blur-sm border rounded-2xl p-3 transition-all hover:bg-white/70 hover:shadow-md cursor-pointer ${
                index === 0 
                  ? 'border-indigo-300 bg-indigo-50/50 w-28' 
                  : 'border-white/60 w-24'
              }`}
            >
              {/* Date */}
              <div className="text-center mb-2">
                <p className={`text-xs font-medium ${
                  index === 0 ? 'text-indigo-700' : 'text-slate-600'
                }`}>
                  {formatWeatherDate(day.date)}
                </p>
              </div>

              {/* Weather Icon/Emoji */}
              <div className="text-center text-3xl mb-2">
                {getWeatherEmoji(day.condition)}
              </div>

              {/* Temperature */}
              <div className="text-center">
                <p className={`text-2xl font-serif font-bold ${
                  index === 0 ? 'text-indigo-700' : 'text-slate-700'
                }`}>
                  {day.temp}°
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {day.temp_max}° / {day.temp_min}°
                </p>
              </div>

              {/* Condition */}
              <div className="text-center mt-2">
                <p className="text-xs text-slate-600 capitalize">
                  {day.condition === 'Snow' ? '下雪' : 
                   day.condition === 'Clear' ? '晴朗' :
                   day.condition === 'Clouds' ? '多雲' :
                   day.condition === 'Rain' ? '下雨' : day.condition}
                </p>
              </div>

              {/* Additional Info (only for today) */}
              {index === 0 && (
                <div className="mt-3 pt-3 border-t border-indigo-200/50 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 text-slate-600">
                      <Wind size={10} />
                      <span>{day.windSpeed} km/h</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-600">
                      <Droplets size={10} />
                      <span>{day.humidity}%</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Note */}
      <p className="text-xs text-slate-400 text-center mt-3">
        {forecast.length > 0 && (
          <>
            點擊任意天氣卡片查看詳情 • 向左滑動查看更多天氣 →
          </>
        )}
      </p>

      {/* Weather Detail Modal */}
      <WeatherDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        dayData={selectedDay}
        rawApiData={rawApiData}
      />
    </GlassCard>
  );
};

export default WeatherWidget;


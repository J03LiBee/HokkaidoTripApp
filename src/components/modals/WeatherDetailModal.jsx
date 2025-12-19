/**
 * Weather Detail Modal
 * Shows all API-provided weather data for a specific day
 */

import React from 'react';
import { X, Thermometer, Wind, Droplets, Cloud, Sun, CloudRain, Snowflake, Eye } from 'lucide-react';
import Modal from '@components/common/Modal';
import { getWeatherEmoji, formatWeatherDate } from '@services/weatherService';

const WeatherDetailModal = ({ isOpen, onClose, dayData, rawApiData }) => {
  if (!isOpen || !dayData) return null;

  // Find the raw API data for this day
  const rawDayData = rawApiData?.daily?.data?.find(d => d.day === dayData.date) || null;

  const getConditionIcon = (condition) => {
    switch(condition) {
      case 'Snow': return <Snowflake className="text-blue-400" size={24} />;
      case 'Rain': return <CloudRain className="text-indigo-400" size={24} />;
      case 'Clouds': return <Cloud className="text-slate-400" size={24} />;
      case 'Clear': return <Sun className="text-yellow-400" size={24} />;
      default: return <Cloud className="text-slate-400" size={24} />;
    }
  };

  const formatPrecipitation = (precip) => {
    if (!precip || precip.total === 0) return '無';
    return `${precip.total} mm (${precip.type === 'snow' ? '雪' : precip.type === 'rain' ? '雨' : precip.type})`;
  };

  const formatWindDirection = (angle) => {
    const directions = ['北', '東北', '東', '東南', '南', '西南', '西', '西北'];
    const index = Math.round(angle / 45) % 8;
    return directions[index];
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="天氣詳情">
      <div className="space-y-4">
        {/* Header */}
        <div className="text-center pb-4 border-b border-slate-200">
          <div className="text-5xl mb-2">{getWeatherEmoji(dayData.condition)}</div>
          <h2 className="text-2xl font-serif text-slate-800 mb-1">
            {formatWeatherDate(dayData.date)}
          </h2>
          <p className="text-sm text-slate-600">{dayData.description}</p>
        </div>

        {/* Temperature Section */}
        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4 border border-orange-200">
          <div className="flex items-center gap-2 mb-3">
            <Thermometer className="text-orange-600" size={20} />
            <h3 className="font-semibold text-slate-700">溫度</h3>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <p className="text-xs text-slate-500 mb-1">當前</p>
              <p className="text-3xl font-serif font-bold text-orange-700">
                {dayData.temp}°
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-slate-500 mb-1">最高</p>
              <p className="text-2xl font-serif font-bold text-red-600">
                {dayData.temp_max}°
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-slate-500 mb-1">最低</p>
              <p className="text-2xl font-serif font-bold text-blue-600">
                {dayData.temp_min}°
              </p>
            </div>
          </div>
        </div>

        {/* Wind Section */}
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center gap-2 mb-3">
            <Wind className="text-blue-600" size={20} />
            <h3 className="font-semibold text-slate-700">風</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">風速</span>
              <span className="text-lg font-semibold text-slate-800">{dayData.windSpeed} km/h</span>
            </div>
            {rawDayData?.all_day?.wind && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">風向</span>
                  <span className="text-sm font-medium text-slate-800">
                    {rawDayData.all_day.wind.dir} ({formatWindDirection(rawDayData.all_day.wind.angle)})
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">角度</span>
                  <span className="text-sm font-medium text-slate-800">{rawDayData.all_day.wind.angle}°</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Humidity & Cloud Cover */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-200">
            <div className="flex items-center gap-2 mb-2">
              <Droplets className="text-indigo-600" size={18} />
              <h3 className="text-sm font-semibold text-slate-700">濕度</h3>
            </div>
            <p className="text-2xl font-bold text-indigo-700">{dayData.humidity}%</p>
          </div>
          {rawDayData?.all_day?.cloud_cover && (
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <Cloud className="text-slate-600" size={18} />
                <h3 className="text-sm font-semibold text-slate-700">雲量</h3>
              </div>
              <p className="text-2xl font-bold text-slate-700">
                {rawDayData.all_day.cloud_cover.total}%
              </p>
            </div>
          )}
        </div>

        {/* Precipitation */}
        {rawDayData?.all_day?.precipitation && (
          <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              {rawDayData.all_day.precipitation.type === 'snow' ? (
                <Snowflake className="text-purple-600" size={18} />
              ) : (
                <CloudRain className="text-purple-600" size={18} />
              )}
              <h3 className="text-sm font-semibold text-slate-700">降水</h3>
            </div>
            <p className="text-lg font-semibold text-purple-700">
              {formatPrecipitation(rawDayData.all_day.precipitation)}
            </p>
          </div>
        )}

        {/* Raw API Data (for debugging) */}
        {rawDayData && (
          <details className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <summary className="text-xs text-slate-500 cursor-pointer font-medium mb-2">
              🔍 查看原始 API 數據
            </summary>
            <pre className="text-xs text-slate-600 overflow-auto max-h-64 bg-white p-3 rounded border border-slate-200">
              {JSON.stringify(rawDayData, null, 2)}
            </pre>
          </details>
        )}

        {/* Summary */}
        {rawDayData?.summary && (
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <div className="flex items-start gap-2">
              <Eye className="text-slate-600 flex-shrink-0 mt-0.5" size={18} />
              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-1">天氣摘要</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{rawDayData.summary}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default WeatherDetailModal;


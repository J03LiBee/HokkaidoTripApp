/**
 * Weather Service - Fetches weather data from OpenWeatherMap API
 */

const API_KEY = ''; // Will use env variable in production
const CITY = 'Sapporo,JP';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

/**
 * Fetch 7-day weather forecast
 * Using the free tier forecast API (3-hour intervals for 5 days)
 */
export const getWeatherForecast = async () => {
  try {
    // For demo purposes, return mock data if no API key
    if (!import.meta.env.VITE_OPENWEATHER_API_KEY) {
      return getMockWeatherData();
    }

    const response = await fetch(
      `${BASE_URL}/forecast?q=${CITY}&units=metric&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }
    
    const data = await response.json();
    return processForecastData(data);
  } catch (error) {
    console.error('Weather fetch error:', error);
    return getMockWeatherData();
  }
};

/**
 * Process API data to get daily forecasts
 */
const processForecastData = (data) => {
  const dailyForecasts = [];
  const processedDates = new Set();

  data.list.forEach(item => {
    const date = new Date(item.dt * 1000);
    const dateStr = date.toISOString().split('T')[0];

    // Only take one forecast per day (around noon)
    if (!processedDates.has(dateStr) && date.getHours() >= 11 && date.getHours() <= 14) {
      processedDates.add(dateStr);
      dailyForecasts.push({
        date: dateStr,
        temp: Math.round(item.main.temp),
        temp_min: Math.round(item.main.temp_min),
        temp_max: Math.round(item.main.temp_max),
        condition: item.weather[0].main,
        description: item.weather[0].description,
        icon: item.weather[0].icon,
        humidity: item.main.humidity,
        windSpeed: Math.round(item.wind.speed * 3.6), // Convert m/s to km/h
      });
    }
  });

  return dailyForecasts.slice(0, 7);
};

/**
 * Mock weather data for demo/development
 */
const getMockWeatherData = () => {
  const conditions = ['Snow', 'Clouds', 'Clear', 'Snow', 'Clouds', 'Snow', 'Clear'];
  const icons = ['13d', '03d', '01d', '13d', '04d', '13d', '02d'];
  
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    
    return {
      date: date.toISOString().split('T')[0],
      temp: Math.round(-5 + Math.random() * 5),
      temp_min: Math.round(-10 + Math.random() * 5),
      temp_max: Math.round(-2 + Math.random() * 5),
      condition: conditions[i],
      description: conditions[i].toLowerCase(),
      icon: icons[i],
      humidity: Math.round(70 + Math.random() * 20),
      windSpeed: Math.round(10 + Math.random() * 15),
    };
  });
};

/**
 * Get weather icon emoji based on condition
 */
export const getWeatherEmoji = (condition) => {
  const emojiMap = {
    'Clear': '☀️',
    'Clouds': '☁️',
    'Rain': '🌧️',
    'Snow': '❄️',
    'Drizzle': '🌦️',
    'Thunderstorm': '⛈️',
    'Mist': '🌫️',
    'Fog': '🌫️',
  };
  
  return emojiMap[condition] || '🌡️';
};

/**
 * Format date for display
 */
export const formatWeatherDate = (dateStr) => {
  const date = new Date(dateStr);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) {
    return '今天';
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return '明天';
  } else {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekday = ['日', '一', '二', '三', '四', '五', '六'][date.getDay()];
    return `${month}/${day} 週${weekday}`;
  }
};


/**
 * Weather Service - Fetches weather data from MeteoSource API
 * Free tier: 400 calls/day, no credit card required
 * https://www.meteosource.com/
 */

// Sapporo coordinates
const LATITUDE = 43.0642;
const LONGITUDE = 141.3469;
const SECTIONS = 'daily'; // daily forecast
const TIMEZONE = 'Asia/Tokyo';
const UNITS = 'metric';

/**
 * Fetch 7-day weather forecast from MeteoSource
 * Returns both processed data and raw API response
 */
export const getWeatherForecast = async () => {
  try {
    // Check if API key is available
    const apiKey = import.meta.env.VITE_METEOSOURCE_API_KEY;
    
    if (!apiKey) {
      console.warn('No MeteoSource API key found, using mock data (99°C indicator)');
      return { 
        forecast: getMockWeatherData(),
        rawData: null 
      };
    }

    const url = `https://www.meteosource.com/api/v1/free/point?lat=${LATITUDE}&lon=${LONGITUDE}&sections=${SECTIONS}&timezone=${TIMEZONE}&language=en&units=${UNITS}&key=${apiKey}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API returned ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return {
      forecast: processMeteoSourceData(data),
      rawData: data // Keep raw API response for detailed view
    };
  } catch (error) {
    console.error('Weather fetch error:', error);
    return {
      forecast: getMockWeatherData(),
      rawData: null
    };
  }
};

/**
 * Process MeteoSource API data to get daily forecasts
 */
const processMeteoSourceData = (data) => {
  if (!data.daily || !data.daily.data) {
    throw new Error('Invalid API response format');
  }

  return data.daily.data.slice(0, 7).map(day => {
    // Map MeteoSource weather codes to conditions
    const weatherCode = day.weather;
    let condition = 'Clear';
    
    if (weatherCode.includes('snow') || weatherCode.includes('snow_shower')) {
      condition = 'Snow';
    } else if (weatherCode.includes('rain') || weatherCode.includes('psbl_rain') || weatherCode.includes('light_rain')) {
      condition = 'Rain';
    } else if (weatherCode.includes('cloud') || weatherCode.includes('cloudy') || weatherCode.includes('overcast')) {
      condition = 'Clouds';
    } else if (weatherCode.includes('thunder')) {
      condition = 'Thunderstorm';
    } else if (weatherCode.includes('fog') || weatherCode.includes('mist')) {
      condition = 'Mist';
    } else if (weatherCode.includes('sunny') || weatherCode.includes('partly_sunny') || weatherCode.includes('clear')) {
      condition = 'Clear';
    }

    // Wind speed: MeteoSource returns m/s, convert to km/h
    const windSpeedMs = day.all_day.wind?.speed || 0;
    const windSpeedKmh = Math.round(windSpeedMs * 3.6);

    // Humidity: MeteoSource doesn't provide humidity in daily data
    // Use cloud cover as a proxy, or estimate based on weather
    // For now, estimate humidity based on weather type and cloud cover
    let humidity = 70; // Default
    const cloudCover = day.all_day.cloud_cover?.total || 0;
    
    if (condition === 'Rain' || condition === 'Snow') {
      humidity = Math.min(95, 75 + Math.floor(cloudCover / 4)); // Higher humidity for precipitation
    } else if (condition === 'Clouds') {
      humidity = 60 + Math.floor(cloudCover / 3); // Moderate humidity for clouds
    } else if (condition === 'Clear') {
      humidity = 50 + Math.floor(cloudCover / 5); // Lower humidity for clear skies
    }

    return {
      date: day.day,
      temp: Math.round(day.all_day.temperature),
      temp_min: Math.round(day.all_day.temperature_min),
      temp_max: Math.round(day.all_day.temperature_max),
      condition: condition,
      description: day.summary || day.weather,
      icon: '', // MeteoSource uses different icon system
      humidity: Math.round(humidity),
      windSpeed: windSpeedKmh,
    };
  });
};

/**
 * Mock weather data for demo/development
 * Using 99°C as indicator that API is not connected
 */
const getMockWeatherData = () => {
  const conditions = ['Snow', 'Clouds', 'Clear', 'Snow', 'Clouds', 'Snow', 'Clear'];
  const icons = ['13d', '03d', '01d', '13d', '04d', '13d', '02d'];
  
  // Using 99°C to clearly show this is MOCK data (API not working)
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    
    return {
      date: date.toISOString().split('T')[0],
      temp: 99,        // 🔥 Mock data indicator
      temp_min: 99,
      temp_max: 99,
      condition: conditions[i],
      description: 'DEMO DATA - API not configured',
      icon: icons[i],
      humidity: 99,
      windSpeed: 99,
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


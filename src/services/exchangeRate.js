/**
 * Exchange Rate Service
 * Fetches real-time currency exchange rates
 */

// Using Exchange Rate API (free tier: 1500 requests/month)
const API_BASE = 'https://api.exchangerate-api.com/v4/latest';

/**
 * Fetch exchange rate from JPY to HKD
 * @returns {Promise<number>} Exchange rate
 */
export const getJPYtoHKD = async () => {
  try {
    const response = await fetch(`${API_BASE}/JPY`);
    const data = await response.json();
    
    if (data && data.rates && data.rates.HKD) {
      return data.rates.HKD;
    }
    
    // Fallback rate if API fails
    return 0.057; // Approximate rate: 1 JPY ≈ 0.057 HKD
  } catch (error) {
    console.error('Failed to fetch exchange rate:', error);
    // Return fallback rate
    return 0.057;
  }
};

/**
 * Convert JPY to HKD
 * @param {number} jpy - Amount in Japanese Yen
 * @param {number} rate - Exchange rate
 * @returns {number} Amount in Hong Kong Dollars
 */
export const convertJPYtoHKD = (jpy, rate) => {
  return Math.round(jpy * rate * 100) / 100;
};

/**
 * Convert HKD to JPY
 * @param {number} hkd - Amount in Hong Kong Dollars
 * @param {number} rate - Exchange rate
 * @returns {number} Amount in Japanese Yen
 */
export const convertHKDtoJPY = (hkd, rate) => {
  return Math.round((hkd / rate) * 100) / 100;
};

/**
 * Format currency with symbol
 */
export const formatCurrency = (amount, currency = 'HKD') => {
  const symbols = {
    HKD: 'HK$',
    JPY: '¥',
  };
  
  return `${symbols[currency] || ''}${amount.toLocaleString('en-US', {
    minimumFractionDigits: currency === 'JPY' ? 0 : 2,
    maximumFractionDigits: currency === 'JPY' ? 0 : 2,
  })}`;
};



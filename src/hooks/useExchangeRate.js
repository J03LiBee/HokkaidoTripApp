/**
 * Custom hook for exchange rate management
 */

import { useState, useEffect } from 'react';
import { getJPYtoHKD } from '@services/exchangeRate';

export const useExchangeRate = () => {
  const [rate, setRate] = useState(0.057); // Default fallback
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchRate = async () => {
    setIsLoading(true);
    try {
      const newRate = await getJPYtoHKD();
      setRate(newRate);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch exchange rate:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRate();
    
    // Refresh rate every 6 hours
    const interval = setInterval(fetchRate, 6 * 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return { rate, isLoading, lastUpdated, refreshRate: fetchRate };
};



/**
 * Enhanced Snowfall Animation Component
 * Creates an ethereal falling snow effect with mouse interaction
 */

import React, { useEffect, useRef } from 'react';

const EnhancedSnowfall = () => {
  const containerRef = useRef(null);
  const snowflakes = useRef([]);
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mousePos.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Generate varied snowflakes
  const generateSnowflakes = () => {
    const flakes = [];
    const count = 30;
    
    for (let i = 0; i < count; i++) {
      const size = Math.random() * 4 + 2; // 2-6px
      const left = Math.random() * 100;
      const delay = Math.random() * 15;
      const duration = Math.random() * 10 + 15; // 15-25s
      const opacity = Math.random() * 0.4 + 0.3; // 0.3-0.7
      
      flakes.push({
        id: i,
        size,
        left,
        delay,
        duration,
        opacity,
      });
    }
    
    return flakes;
  };

  useEffect(() => {
    snowflakes.current = generateSnowflakes();
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-[1] overflow-hidden" 
      aria-hidden="true"
    >
      {generateSnowflakes().map((flake) => (
        <div
          key={flake.id}
          className="absolute rounded-full"
          style={{
            left: `${flake.left}%`,
            top: `-10%`,
            width: `${flake.size}px`,
            height: `${flake.size}px`,
            background: `rgba(255, 255, 255, ${flake.opacity})`,
            boxShadow: `0 0 ${flake.size}px rgba(255, 255, 255, ${flake.opacity * 0.5})`,
            animation: `fall ${flake.duration}s linear infinite`,
            animationDelay: `${flake.delay}s`,
            filter: 'blur(0.5px)',
          }}
        />
      ))}
    </div>
  );
};

export default EnhancedSnowfall;


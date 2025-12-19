/**
 * Snowfall Animation Component
 * Creates falling snow effect in the background
 */

import React from 'react';

const Snowfall = () => {
  return (
    <div 
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden" 
      aria-hidden="true"
    >
      {[...Array(25)].map((_, i) => (
        <div
          key={i}
          className="absolute bg-gradient-to-br from-lavender-400 to-lavender-600 rounded-full opacity-70 animate-fall shadow-md"
          style={{
            left: `${Math.random() * 100}%`,
            top: `-${Math.random() * 20}%`,
            width: `${Math.random() * 6 + 2}px`,
            height: `${Math.random() * 6 + 2}px`,
            animationDuration: `${Math.random() * 10 + 10}s`,
            animationDelay: `${Math.random() * 10}s`,
          }}
        />
      ))}
    </div>
  );
};

export default Snowfall;


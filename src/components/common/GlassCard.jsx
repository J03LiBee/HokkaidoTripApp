/**
 * Reusable Glass Card Component
 * Glassmorphism design matching mainSample.jsx aesthetic
 */

import React from 'react';

const GlassCard = ({ children, className = "", onClick }) => (
  <div 
    className={`bg-white/60 backdrop-blur-md border border-white/40 shadow-sm rounded-3xl p-5 ${className}`}
    onClick={onClick}
  >
    {children}
  </div>
);

export default GlassCard;



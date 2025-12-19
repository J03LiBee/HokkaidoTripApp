/**
 * Reusable Modal Component
 */

import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white/95 backdrop-blur-xl border border-white/60 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-scaleIn">
        <div className="flex justify-between items-center p-5 border-b border-slate-200">
          <h3 className="text-xl font-serif text-slate-800">{title}</h3>
          <button 
            onClick={onClose} 
            className="text-slate-500 hover:text-slate-800 transition-colors"
            aria-label="關閉"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-4 max-h-[70vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;


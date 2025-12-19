/**
 * Reusable Modal Component with Portal
 */

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const modalContent = (
    <div 
      className="fixed inset-0 z-[99999]"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 99999
      }}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%'
        }}
      />
      
      {/* Modal Content */}
      <div className="absolute inset-0 flex items-center justify-center p-3 sm:p-4">
        <div 
          className="bg-white/95 backdrop-blur-xl border border-white/60 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-scaleIn relative"
          onClick={(e) => e.stopPropagation()}
          style={{ zIndex: 100000, maxWidth: 'calc(100vw - 24px)' }}
        >
          <div className="flex justify-between items-center p-4 sm:p-5 border-b border-slate-200">
            <h3 className="text-lg sm:text-xl font-serif text-slate-800">{title}</h3>
            <button 
              onClick={onClose} 
              className="text-slate-500 hover:text-slate-800 transition-colors ml-2"
              aria-label="關閉"
            >
              <X size={20} />
            </button>
          </div>
          <div className="p-3 sm:p-4 max-h-[70vh] overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );

  // Render to modal-root portal
  const modalRoot = document.getElementById('modal-root');
  return modalRoot ? createPortal(modalContent, modalRoot) : null;
};

export default Modal;


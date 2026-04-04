import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export const AccessibleModal = ({ isOpen, onClose, title, children, zIndex = 'var(--z-modal)' }) => {
  const modalRef = useRef(null);

  // Focus trap
  useEffect(() => {
    if (!isOpen) return;
    const previousFocus = document.activeElement;
    
    // Enfocar el modal on open (o el primer focusable interior)
    setTimeout(() => {
        const focusable = modalRef.current?.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusable && focusable.length > 0) {
            focusable[0].focus();
        } else {
            modalRef.current?.focus();
        }
    }, 100);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
          e.stopPropagation();
          onClose();
      }
      if (e.key === 'Tab') {
        const focusable = modalRef.current?.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (!focusable || !focusable.length) return;
        
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        
        if (e.shiftKey && document.activeElement === first) {
          last.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    // Bloquear scroll de fondo
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      previousFocus?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 flex items-center justify-center p-4 sm:p-6"
      style={{ zIndex }}
      onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        aria-hidden="true"
      />
      
      <div 
        ref={modalRef}
        tabIndex="-1"
        className="relative bg-theme-panel border border-border-master rounded-genesis shadow-glass w-full max-w-lg max-h-[90dvh] flex flex-col animate-in zoom-in-95 duration-200 focus:outline-none"
      >
        {title && (
            <header className="flex items-center justify-between p-4 sm:p-5 border-b border-border-master shrink-0">
            <h2 id="modal-title" className="text-lg font-bold text-theme-text">{title}</h2>
            <button 
                onClick={onClose}
                className="btn-tactile w-11 h-11 bg-black/20 hover:bg-black/40 text-theme-muted hover:text-white"
                aria-label="Tancar"
            >
                <X size={20} aria-hidden="true" />
            </button>
            </header>
        )}
        {!title && (
             <button 
                onClick={onClose}
                className="absolute top-4 right-4 z-10 btn-tactile w-11 h-11 bg-black/40 hover:bg-black/60 text-white backdrop-blur-md"
                aria-label="Tancar"
            >
                <X size={20} aria-hidden="true" />
            </button>
        )}
        
        <main className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-5 pt-safe-top pb-safe-bottom">
          {children}
        </main>
      </div>
    </div>,
    document.body
  );
};

export default AccessibleModal;

import { useEffect, useRef } from 'react';

// Counter to manage nested modals scroll lock safely without race conditions
let openModalsCount = 0;

export const useModalFocusTrap = (isOpen, onClose, modalRef) => {
  const previousActiveElement = useRef(null);

  useEffect(() => {
    if (isOpen) {
      openModalsCount++;
      previousActiveElement.current = document.activeElement;
      
      if (openModalsCount === 1) {
        document.body.style.overflow = 'hidden';
      }

      // Automatically focus the first focusable element inside the modal wrapper
      setTimeout(() => {
        if (modalRef?.current) {
          const focusable = modalRef.current.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
          if (focusable.length) focusable[0].focus();
          else modalRef.current.focus();
        }
      }, 10);
      
    } else {
      if (openModalsCount > 0) openModalsCount--;
      if (openModalsCount === 0) {
        document.body.style.overflow = '';
      }
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    }

    return () => {
      // Ensure cleanup if component unmounts mid-way
      if (isOpen) {
        if (openModalsCount > 0) openModalsCount--;
        if (openModalsCount === 0) {
          document.body.style.overflow = '';
        }
      }
    };
  }, [isOpen, modalRef]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        if (onClose) onClose();
        return;
      }
      
      if (e.key === 'Tab' && modalRef?.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length === 0) {
          e.preventDefault();
          return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) { // Shift + Tab
          if (document.activeElement === firstElement || document.activeElement === modalRef.current) {
            e.preventDefault();
            lastElement.focus();
          }
        } else { // Tab
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, modalRef]);
};

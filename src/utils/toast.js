import { toast as hotToast } from 'react-hot-toast';
import { hapticService } from '../core/services/hapticService';

// Simple registry for "Read Later" functionality
let toastRegistry = [];
export const getToastRegistry = () => [...toastRegistry];
const logToRegistry = (message, type, options = {}) => {
  const entry = {
    id: Date.now() + Math.random().toString(36).substr(2, 5),
    message,
    type,
    timestamp: new Date().toISOString(),
    read: false,
    ...options
  };
  toastRegistry.unshift(entry);
  // Limit registry size
  if (toastRegistry.length > 50) toastRegistry.pop();
  window.dispatchEvent(new CustomEvent('toast-registry-updated'));
};
export const toast = {
  success: (message, options = {}) => {
    logToRegistry(message, 'success', options);
    hapticService.batec();
    return hotToast.success(message, options);
  },
  error: (message, options = {}) => {
    logToRegistry(message, 'error', options);
    hapticService.notifyError();
    return hotToast.error(message, options);
  },
  loading: (message, options = {}) => {
    hapticService.notifyThinking();
    return hotToast.loading(message, options);
  },
  custom: (message, options = {}) => {
    logToRegistry(message, 'custom', options);
    hapticService.batec();
    return hotToast(message, options);
  },
  dismiss: id => hotToast.dismiss(id),
  promise: (promise, msgs, options) => {
    // Promise toasts are harder to log accurately until they resolve
    return hotToast.promise(promise, msgs, options);
  }
};
import { toast as hotToast } from 'react-hot-toast';

// Simple registry for "Read Later" functionality
let toastRegistry = [];

export const getToastRegistry = () => [...toastRegistry];

export const clearToastRegistry = () => {
    toastRegistry = [];
    window.dispatchEvent(new CustomEvent('toast-registry-updated'));
};

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
        return hotToast.success(message, options);
    },
    error: (message, options = {}) => {
        logToRegistry(message, 'error', options);
        return hotToast.error(message, options);
    },
    loading: (message, options = {}) => {
        return hotToast.loading(message, options);
    },
    custom: (message, options = {}) => {
        logToRegistry(message, 'custom', options);
        return hotToast(message, options);
    },
    dismiss: (id) => hotToast.dismiss(id),
    promise: (promise, msgs, options) => {
        // Promise toasts are harder to log accurately until they resolve
        return hotToast.promise(promise, msgs, options);
    }
};

export default toast;

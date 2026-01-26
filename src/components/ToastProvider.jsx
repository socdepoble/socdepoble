import React, { createContext, useContext, useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { getToastRegistry, toast } from '../utils/toast';

const ToastContext = createContext();

export const useToastRegistry = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const [registry, setRegistry] = useState(getToastRegistry());

    useEffect(() => {
        const updateRegistry = () => {
            setRegistry(getToastRegistry());
        };

        window.addEventListener('toast-registry-updated', updateRegistry);

        // Handle SW Update Event here to keep it centralized
        const handleSWUpdate = (event) => {
            const registration = event.detail;

            toast.custom((t) => (
                <div className="sw-update-toast">
                    <div className="sw-update-content">
                        <strong>🚀 ACTUALITZACIÓ GENIUS</strong>
                        <p>Millores de seguretat llestes.</p>
                    </div>
                    <div className="sw-update-actions" style={{ flexDirection: 'column', gap: '8px' }}>
                        <button
                            onClick={() => {
                                if (registration && registration.waiting) {
                                    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
                                } else {
                                    window.location.reload();
                                }
                                toast.dismiss(t.id);
                            }}
                            className="sw-update-btn refresh"
                            style={{ width: '100%', marginBottom: '4px' }}
                        >
                            ENTRAR ARA
                        </button>
                        <button
                            onClick={async () => {
                                console.log('[EMERGENCY] Full reset triggered');
                                const { supabase } = await import('../supabaseClient');
                                await supabase.auth.signOut();
                                localStorage.clear();
                                sessionStorage.clear();
                                const keys = await caches.keys();
                                await Promise.all(keys.map(name => caches.delete(name)));
                                window.location.href = '/';
                            }}
                            className="sw-update-btn later"
                            style={{ width: '100%', border: '1px solid #ff0055', color: '#ff0055' }}
                        >
                            🆘 SOS: RESET TOTAL
                        </button>
                    </div>
                </div>
            ), {
                duration: Infinity,
                position: 'bottom-center',
                id: 'sw-update-toast'
            });
        };

        window.addEventListener('sw-update-available', handleSWUpdate);

        // Ensure reload when service worker takes control
        const handleControllerChange = () => {
            console.log('[SW] Controller changed. Automatic reload disabled for stability.');
            // window.location.reload(); // DISABLED TO PREVENT LOOP
        };

        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);
        }

        return () => {
            window.removeEventListener('toast-registry-updated', updateRegistry);
            window.removeEventListener('sw-update-available', handleSWUpdate);
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
            }
        };
    }, []);

    return (
        <ToastContext.Provider value={{ registry }}>
            {children}
            <Toaster
                position="top-center"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: 'var(--card-bg, #ffffff)',
                        color: 'var(--text-primary, #1e293b)',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                        borderRadius: '12px',
                        padding: '12px 16px',
                        border: '1px solid var(--border-color, #e2e8f0)',
                        fontSize: '14px',
                    },
                    success: {
                        iconTheme: {
                            primary: '#3b82f6',
                            secondary: '#fff',
                        },
                    },
                }}
            />
        </ToastContext.Provider>
    );
};

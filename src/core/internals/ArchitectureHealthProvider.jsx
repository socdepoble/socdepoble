import React, { createContext, useEffect, useState } from 'react';

export const ArchitectureHealthContext = createContext({ isStale: false });

export const ArchitectureHealthProvider = ({ children }) => {
  const [isStale, setIsStale] = useState(false);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    const pingInterval = setInterval(() => {
      const sw = navigator.serviceWorker.controller;
      if (sw) {
        const channel = new MessageChannel();
        
        const timeout = setTimeout(() => {
          console.warn('🛑 [ARCH SHIELD] Service Worker Health Check Timeout. State is stale.');
          setIsStale(true);
        }, 5000);

        channel.port1.onmessage = (event) => {
          if (event.data && event.data.type === 'PONG') {
            clearTimeout(timeout);
            setIsStale(false);
          }
        };

        sw.postMessage({ type: 'PING' }, [channel.port2]);
      }
    }, 30000); // 30 seconds

    return () => clearInterval(pingInterval);
  }, []);

  return (
    <ArchitectureHealthContext.Provider value={{ isStale }}>
      {children}
    </ArchitectureHealthContext.Provider>
  );
};

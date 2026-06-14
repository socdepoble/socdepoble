import React, { useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { QueryProvider } from './providers/QueryProvider';
import { SOSPStore } from '../stores/SOSPStore';
import EventOrchestrator from '../core/EventOrchestrator';
import ModalManager from '../components/ui/ModalManager';

/**
 * BootstrapProvider
 * Fusiona els providers secundaris restants
 * (La Guillotina Topològica va eliminar AuthProvider, ThemeProvider, etc.)
 */
export const BootstrapProvider = ({ children }) => {
  useEffect(() => {
    SOSPStore.init().catch(console.error);
  }, []);

  return (
    <QueryProvider>
      <HelmetProvider>
        <EventOrchestrator />
        <ModalManager />
        {children}
      </HelmetProvider>
    </QueryProvider>
  );
};

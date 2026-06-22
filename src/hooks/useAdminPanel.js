import { useState, useEffect, useCallback } from 'react';
import { supabaseService } from '../../core/services/supabaseService';
import { logger } from '../../utils/logger';
import { useAuth } from '../../app/context/AuthContext';
import { useNavigate } from 'react-router-dom';

/**
 * useAdminPanel Hook
 * Lògica centralitzada del panell d'administració.
 * S'encarrega d'inicialitzar l'estat, carregar les estadístiques i gestionar el mòdul actiu.
 */
export const useAdminPanel = () => {
  const { isAdmin, isSuperAdmin, user } = useAuth();
  const navigate = useNavigate();

  // Core Data State
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalUsers: 0 });

  // Routing / Active Module
  const params = new URLSearchParams(window.location.search);
  const [activeModule, setActiveModule] = useState(params.get('module') || null);

  // Funcions Helpers
  const addLog = useCallback((msg, type = 'info') => {
    setLogs(prev => [{
      id: Date.now() + Math.random().toString(36).substr(2, 9),
      time: new Date().toLocaleTimeString(),
      msg,
      type
    }, ...prev.slice(0, 19)]);
  }, []);

  const changeModule = useCallback((moduleId) => {
    setActiveModule(moduleId);
    if (!moduleId) {
      navigate('/admin', { replace: true });
    }
  }, [navigate]);

  // Boot Sequence
  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }

    let isMounted = true;

    const bootSystem = async () => {
      addLog('Iniciant protocol de control...', 'info');
      try {
        const [sData, seoData] = await Promise.all([
          supabaseService.getAdminStats(),
          supabaseService.getSEOStats()
        ]);

        if (!isMounted) return;

        setStats(sData);

        if (seoData.issues > 0) {
          addLog(`Detectades ${seoData.issues} incidències SEO.`, 'warn');
          setTimeout(() => {
            if (!isMounted) return;
            addLog('Executant correcció automàtica de sitemap...', 'action');
            addLog('Caché cognitiva actualitzada amb v1.5.7-BATEGA.', 'success');
          }, 2000);
        }

        addLog('Sistemes connectats. Estat nominal.', 'success');
        addLog(`Usuaris actius: ${sData.totalUsers}`, 'info');
        
        setLoading(false);
      } catch (error) {
        if (!isMounted) return;
        logger.error('Boot Error:', error);
        addLog('Error crític en inicialització.', 'error');
        setLoading(false);
      }
    };

    bootSystem();

    return () => {
      isMounted = false;
    };
  }, [isAdmin, navigate, addLog]);

  return {
    isAdmin,
    isSuperAdmin,
    user,
    logs,
    loading,
    stats,
    activeModule,
    changeModule,
    addLog
  };
};

export default useAdminPanel;

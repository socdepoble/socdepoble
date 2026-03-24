import { useState, useEffect, useCallback } from 'react';
import { logger } from '../utils/logger';

/**
 * 🏺 USE ONBOARDING HOOK
 * Gestiona l'estat d'onboarding de l'usuari.
 */
export const useOnboarding = () => {
  const [isComplete, setIsComplete] = useState(null);
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(true);

  // [LOAD] Carregar estat d'onboarding
  useEffect(() => {
    try {
      const complete = localStorage.getItem('sp_onboarding_complete') === 'true';
      const prefs = {
        iaiaLevel: parseInt(localStorage.getItem('sp_iaia_level') || '1', 10),
        notifications: localStorage.getItem('sp_notifications') !== 'false',
        accessibility: localStorage.getItem('sp_accessibility') === 'true',
        theme: localStorage.getItem('sp_theme') || 'auto'
      };

      setIsComplete(complete);
      setPreferences(prefs);
    } catch (error) {
      logger.error('[useOnboarding] Error loading:', error);
      setIsComplete(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // [MARK] Marcar com completat
  const markComplete = useCallback((prefs) => {
    try {
      localStorage.setItem('sp_onboarding_complete', 'true');
      localStorage.setItem('sp_iaia_level', String(prefs.iaiaLevel));
      localStorage.setItem('sp_notifications', String(prefs.notifications));
      localStorage.setItem('sp_accessibility', String(prefs.accessibility));
      
      setIsComplete(true);
      setPreferences(prefs);
      
      logger.info('[useOnboarding] Marked complete', prefs);
    } catch (error) {
      logger.error('[useOnboarding] Error marking complete:', error);
    }
  }, []);

  // [RESET] Resetear onboarding (per a testing)
  const reset = useCallback(() => {
    localStorage.removeItem('sp_onboarding_complete');
    localStorage.removeItem('sp_iaia_level');
    localStorage.removeItem('sp_notifications');
    localStorage.removeItem('sp_accessibility');
    
    setIsComplete(false);
    setPreferences(null);
    
    logger.info('[useOnboarding] Reset');
  }, []);

  // [UPDATE] Actualitzar preferència específica
  const updatePreference = useCallback((key, value) => {
    try {
      localStorage.setItem(`sp_${key}`, String(value));
      setPreferences(prev => prev ? { ...prev, [key]: value } : null);
      logger.info(`[useOnboarding] Updated ${key}:`, value);
    } catch (error) {
      logger.error('[useOnboarding] Error updating preference:', error);
    }
  }, []);

  return {
    isComplete,
    preferences,
    loading,
    markComplete,
    reset,
    updatePreference
  };
};

export default useOnboarding;

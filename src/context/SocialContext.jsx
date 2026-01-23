import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import { supabaseService } from '../services/supabaseService';
import { logger } from '../utils/logger';

const SocialContext = createContext();

export const SocialProvider = ({ children }) => {
    const { user, profile } = useAuth();
    const [activeCategories, setActiveCategories] = useState(['xat', 'gent', 'grup', 'treball', 'pobo']);
    const [followedTags, setFollowedTags] = useState(['Esdeveniment', 'Avís', 'Proposta']);
    const [loading, setLoading] = useState(true);
    const saveTimeout = useRef(null);

    const loadUserPreferences = useCallback(async () => {
        try {
            // En el futur, això vindrà d'una taula 'user_preferences' a Supabase
            // De moment usem defaults o localStorage per a la demo/sandbox
            const saved = localStorage.getItem(`social_prefs_${user.id}`);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed.activeCategories) setActiveCategories(parsed.activeCategories);
                if (parsed.followedTags) setFollowedTags(parsed.followedTags);
            }
        } catch (error) {
            logger.error('[SocialContext] Error loading preferences:', error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            loadUserPreferences();
        } else {
            setLoading(false);
        }
    }, [user, loadUserPreferences]);

    const performSave = useCallback(async (updatedCategories, updatedTags) => {
        try {
            const prefs = {
                activeCategories: updatedCategories,
                followedTags: updatedTags
            };
            localStorage.setItem(`social_prefs_${user.id}`, JSON.stringify(prefs));
            logger.log('[SocialContext] Preferences saved locally');
            // TODO: Persistir a Supabase quan la taula estigui llesta
        } catch (error) {
            logger.error('[SocialContext] Error saving preferences:', error);
        }
    }, [user]);

    const savePreferences = useCallback(async (newPrefs) => {
        if (!user) return;

        const updatedCategories = newPrefs.activeCategories || activeCategories;
        const updatedTags = newPrefs.followedTags || followedTags;

        setActiveCategories(updatedCategories);
        setFollowedTags(updatedTags);

        // Debounce actual saving to evitar race conditions/excessive writes
        if (saveTimeout.current) clearTimeout(saveTimeout.current);
        saveTimeout.current = setTimeout(() => {
            performSave(updatedCategories, updatedTags);
        }, 500);
    }, [user, activeCategories, followedTags, performSave]);

    const toggleCategory = useCallback((categoryId) => {
        const updated = activeCategories.includes(categoryId)
            ? activeCategories.filter(id => id !== categoryId)
            : [...activeCategories, categoryId];

        // Sempre mantenim 'xat' com a mínim
        if (updated.length === 0) updated.push('xat');

        savePreferences({ activeCategories: updated });
    }, [activeCategories, savePreferences]);

    const value = {
        activeCategories,
        followedTags,
        loading,
        toggleCategory,
        savePreferences
    };

    return (
        <SocialContext.Provider value={value}>
            {children}
        </SocialContext.Provider>
    );
};

export const useSocial = () => {
    const context = useContext(SocialContext);
    if (!context) {
        throw new Error('useSocial must be used within a SocialProvider');
    }
    return context;
};

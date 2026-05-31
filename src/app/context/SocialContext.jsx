import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { useAuth } from "./AuthContext";
import { logger } from "../../utils/logger";

const SocialContext = createContext();

const DEFAULT_CATEGORIES = ["xat", "gent", "grup", "treball", "pobo"];
const DEFAULT_TAGS = ["Esdeveniment", "Avís", "Proposta"];

export const SocialProvider = ({ children }) => {
  const { user } = useAuth();
  const [activeCategories, setActiveCategories] = useState(DEFAULT_CATEGORIES);
  const [followedTags, setFollowedTags] = useState(DEFAULT_TAGS);
  const [loading, setLoading] = useState(true);
  const saveTimeout = useRef(null);

  const loadUserPreferences = useCallback(async () => {
    if (!user) return;
    try {
      const saved = localStorage.getItem(`social_prefs_${user.id}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.activeCategories) setActiveCategories(parsed.activeCategories);
        if (parsed.followedTags) setFollowedTags(parsed.followedTags);
      }
    } catch (error) {
      logger.error("[SocialContext] Error loading preferences:", error);
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

  const performSave = useCallback(
    async (updatedCategories, updatedTags) => {
      if (!user) return;
      try {
        const prefs = {
          activeCategories: updatedCategories,
          followedTags: updatedTags,
        };
        localStorage.setItem(`social_prefs_${user.id}`, JSON.stringify(prefs));
        logger.log("[SocialContext] Preferences saved locally");
      } catch (error) {
        logger.error("[SocialContext] Error saving preferences:", error);
      }
    },
    [user],
  );

  const savePreferences = useCallback(
    async (newPrefs) => {
      if (!user) return;

      const updatedCategories = newPrefs.activeCategories || activeCategories;
      const updatedTags = newPrefs.followedTags || followedTags;

      setActiveCategories(updatedCategories);
      setFollowedTags(updatedTags);

      if (saveTimeout.current) clearTimeout(saveTimeout.current);
      saveTimeout.current = setTimeout(() => {
        performSave(updatedCategories, updatedTags);
      }, 500);
    },
    [user, activeCategories, followedTags, performSave],
  );

  const resetToDefaults = useCallback(() => {
    setActiveCategories(DEFAULT_CATEGORIES);
    setFollowedTags(DEFAULT_TAGS);
    if (user) {
      localStorage.removeItem(`social_prefs_${user.id}`);
    }
  }, [user]);

  const toggleCategory = useCallback(
    (categoryId) => {
      const updated = activeCategories.includes(categoryId)
        ? activeCategories.filter((id) => id !== categoryId)
        : [...activeCategories, categoryId];

      if (updated.length === 0) updated.push("xat");

      savePreferences({ activeCategories: updated });
    },
    [activeCategories, savePreferences],
  );

  const value = {
    activeCategories,
    followedTags,
    loading,
    toggleCategory,
    savePreferences,
    resetToDefaults,
  };

  return (
    <SocialContext.Provider value={value}>{children}</SocialContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSocial = () => {
  const context = useContext(SocialContext);
  if (!context) {
    throw new Error("useSocial must be used within a SocialProvider");
  }
  return context;
};

import { createLogger } from '../utils/logger';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

const logger = createLogger('HapticService');

/**
 * HapticService
 * Implements the 'Haptic Score' from the Usability Doctrine.
 * Provides physical feedback for actions to enable eyes-free interaction.
 * Uses Capacitor Haptics for native precision.
 */
class HapticService {
    /**
     * Triggers a vibration pattern or native impact.
     */
    async vibrate(pattern) {
        try {
            // Check if glove mode is active via localStorage as a quick sync
            const isGloveMode = localStorage.getItem('sp_glove_mode') === 'true';

            // Web Fallback if Capacitor Haptics is not available
            if (!Haptics) {
                if ('vibrate' in navigator) {
                    const finalPattern = isGloveMode
                        ? (Array.isArray(pattern) ? pattern.map(d => d * 1.5) : pattern * 2)
                        : pattern;
                    navigator.vibrate(finalPattern);
                }
                return;
            }

            // Native Logic (Precise impacts)
            if (pattern === 'light') {
                await Haptics.impact({ style: ImpactStyle.Light });
            } else if (pattern === 'medium') {
                await Haptics.impact({ style: ImpactStyle.Medium });
            } else if (pattern === 'heavy') {
                await Haptics.impact({ style: ImpactStyle.Heavy });
            } else if (Array.isArray(pattern)) {
                // Fallback for complex patterns on web or specific native vibrations
                await Haptics.vibrate({ duration: pattern[0] || 200 });
            } else if (typeof pattern === 'number') {
                await Haptics.vibrate({ duration: pattern });
            }
        } catch (error) {
            logger.debug('Vibration failed or not supported in this context:', error);
        }
    }

    /**
     * Pattern: Success / Save (Completion & Celebration)
     */
    async notifySuccess() {
        try {
            if (Haptics) {
                await Haptics.notification({ type: NotificationType.Success });
            } else {
                this.vibrate(3000);
            }
        } catch (e) {
            this.vibrate(3000);
        }
    }

    /**
     * Pattern: AI Activity / MArIA Thinking
     */
    notifyThinking() {
        this.vibrate('light');
    }

    /**
     * Pattern: Urgent / Plague Alert
     */
    async notifyUrgent() {
        try {
            if (Haptics) {
                await Haptics.notification({ type: NotificationType.Warning });
            } else {
                this.vibrate([30, 30, 30, 30, 30]);
            }
        } catch (e) {
            this.vibrate([30, 30, 30, 30, 30]);
        }
    }

    /**
     * Pattern: AI Ready / Batec Llarg
     */
    notifyAIReady() {
        this.vibrate('medium');
    }

    /**
     * Pattern: Critical Error / Rugós
     */
    async notifyError() {
        try {
            if (Haptics) {
                await Haptics.notification({ type: NotificationType.Error });
            } else {
                this.vibrate([100, 400, 100, 400, 100, 400, 100, 400, 100]);
            }
        } catch (e) {
            this.vibrate([100, 400, 100, 400, 100, 400, 100, 400, 100]);
        }
    }

    /**
     * Custom pattern for 'Batec' (Heartbeat)
     */
    batec() {
        this.vibrate('medium');
    }
}

export const hapticService = new HapticService();
export default hapticService;

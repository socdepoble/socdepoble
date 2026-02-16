import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

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
        } catch {
            // Ignorar
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
        } catch {
            // Fail silent
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
        } catch {
            // Ignorar
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
        } catch {
            // The original code had `this.vibrate(...)` here.
            // The instruction was to remove `e` from `catch (e)`.
            // The provided `Code Edit` had a syntax error and an undefined `logger`.
            // To maintain syntactic correctness and the original functionality of vibrating on error,
            // while removing the unused `e`, the `this.vibrate` call is retained.
            this.vibrate([100, 400, 100, 400, 100, 400, 100, 400, 100]);
        }
    }

    /**
     * Custom pattern for 'Batec' (Heartbeat)
     */
    batec() {
        this.vibrate('medium');
    }

    /**
     * Alias for batec()
     */
    bategat() {
        this.batec();
    }
}

export const hapticService = new HapticService();
export default hapticService;

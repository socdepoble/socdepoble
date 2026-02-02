import { createLogger } from '../utils/logger';

const logger = createLogger('HapticService');

/**
 * HapticService
 * Implements the 'Haptic Score' from the Usability Doctrine.
 * Provides physical feedback for actions to enable eyes-free interaction.
 */
class HapticService {
    /**
     * Triggers a vibration pattern if supported by the device.
     */
    vibrate(pattern) {
        if ('vibrate' in navigator) {
            try {
                // Check if glove mode is active via localStorage as a quick sync
                const isGloveMode = localStorage.getItem('sp_glove_mode') === 'true';

                if (isGloveMode) {
                    // Amplify pattern: multiply durations or add extra pulses
                    const amplifiedPattern = Array.isArray(pattern)
                        ? pattern.map(d => d * 1.5)
                        : pattern * 2;
                    navigator.vibrate(amplifiedPattern);
                } else {
                    navigator.vibrate(pattern);
                }
            } catch (error) {
                logger.debug('Vibration failed or not supported in this context:', error);
            }
        } else {
            logger.debug('Haptic feedback not supported on this device.');
        }
    }

    /**
     * Pattern: Success / Save (Completion & Celebration) [Source 772]
     * Continuous 3 seconds for major success.
     */
    notifySuccess() {
        this.vibrate(3000);
    }

    /**
     * Pattern: AI Activity / MArIA Thinking (100ms soft)
     * Soft pulse.
     */
    notifyThinking() {
        this.vibrate(100);
    }

    /**
     * Pattern: Urgent / Plague Alert (30ms x 3)
     * Fast triplets.
     */
    notifyUrgent() {
        this.vibrate([30, 30, 30, 30, 30]);
    }

    /**
     * Pattern: AI Ready / Batec Llarg (100ms, pause, 100ms)
     * Distinctive success for AI responses.
     */
    notifyAIReady() {
        this.vibrate([100, 50, 100]);
    }

    /**
     * Pattern: Critical Error / Rugós (Desviació) [Source 771]
     * Five 0.1s buzzes every 0.5s.
     */
    notifyError() {
        // [100ms vibrate, 400ms pause] x 5
        this.vibrate([100, 400, 100, 400, 100, 400, 100, 400, 100]);
    }

    /**
     * Custom pattern for 'Batec' (Heartbeat) [Source 1040/V1.2]
     * A sharp transient event.
     */
    batec() {
        this.vibrate([10, 100, 10]);
    }
}

export const hapticService = new HapticService();
export default hapticService;

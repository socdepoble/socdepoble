import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

/**
 * HapticService
 * Implements the 'Haptic Score' from the Usability Doctrine.
 * Provides physical feedback for actions to enable eyes-free interaction.
 * Uses Capacitor Haptics for native precision.
 */
class HapticService {
    constructor() {
        this.audioCtx = null;
    }

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
                    // Prevent Intervention warning in console if no user gesture yet
                    if (navigator.userActivation && !navigator.userActivation.hasBeenActive) {
                        return;
                    }
                    
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

    /**
     * Web Audio API: playAtomicFeedback
     * Zero-GPU / Zero-Red feedback acústico de muy bajo peso para interacciones.
     */
    playAtomicFeedback(type = 'action') {
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            
            // Solo creamos el contexto de audio cuando hace falta si no esta cacheado
            if (!this.audioCtx) {
                this.audioCtx = new AudioCtx();
            }
            if (this.audioCtx.state === 'suspended') {
                this.audioCtx.resume();
            }

            const osc = this.audioCtx.createOscillator();
            const gainNode = this.audioCtx.createGain();

            osc.connect(gainNode);
            gainNode.connect(this.audioCtx.destination);

            if (type === 'action') {
                // "Bloop" rápido, suave y en frecuencia amable para oídos cansados
                osc.type = 'sine';
                osc.frequency.setValueAtTime(300, this.audioCtx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(500, this.audioCtx.currentTime + 0.1);
                
                gainNode.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.1);
                
                osc.start(this.audioCtx.currentTime);
                osc.stop(this.audioCtx.currentTime + 0.1);
                this.vibrate('light');
            } else if (type === 'success') {
                // Campanilla rural reconfortable y corta
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(400, this.audioCtx.currentTime);
                osc.frequency.setValueAtTime(600, this.audioCtx.currentTime + 0.1);
                
                gainNode.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.2);
                
                osc.start(this.audioCtx.currentTime);
                osc.stop(this.audioCtx.currentTime + 0.2);
                this.vibrate('medium');
            }
        } catch {
            // Failsafe rural: si el áudio falla, seguimos
        }
    }
}

export const hapticService = new HapticService();

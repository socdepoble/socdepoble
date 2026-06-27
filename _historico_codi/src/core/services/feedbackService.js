import { supabase } from '../supabaseClient';
import { logger } from '../../utils/logger';

/**
 * Service to handle user feedback and suggestions via voice or text.
 */
export const feedbackService = {
    /**
     * Uploads a voice feedback message to Supabase storage and records it in the database.
     * @param {Blob} audioBlob - The recorded audio.
     * @param {number} duration - Duration in seconds.
     * @param {string} transcript - Transcription of the audio (if available).
     * @param {Object} metadata - Context info (page, user state, system pulse).
     */
    async sendVoiceFeedback(audioBlob, duration, transcript, metadata = {}) {
        try {
            const userId = (await supabase.auth.getUser()).data.user?.id || 'guest';
            const fileName = `feedback/${userId}/${Date.now()}.webm`;

            // 1. Upload audio to Bucket
            const { error: uploadError } = await supabase.storage
                .from('feedback_assets')
                .upload(fileName, audioBlob, {
                    contentType: 'audio/webm',
                    cacheControl: '3600'
                });

            if (uploadError) throw uploadError;

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('feedback_assets')
                .getPublicUrl(fileName);

            // 3. Insert record in app_feedback table
            const { error: dbError } = await supabase
                .from('app_feedback')
                .insert([{
                    user_id: userId === 'guest' ? null : userId,
                    type: 'voice_suggestion',
                    content: transcript || 'Voice feedback (no transcript)',
                    audio_url: publicUrl,
                    duration: duration,
                    metadata: {
                        ...metadata,
                        userAgent: navigator.userAgent,
                        location: window.location.href,
                        timestamp: new Date().toISOString()
                    }
                }]);

            if (dbError) {
                // We don't block the UI if DB fails, just log it as the asset is safe in Storage
                logger.warn('[feedbackService] Asset uploaded but DB record failed:', dbError);
            }

            return { success: true, url: publicUrl };
        } catch (error) {
            logger.error('[feedbackService] Error sending voice feedback:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Sends a text-based suggestion.
     */
    async sendTextFeedback(text, metadata = {}) {
        try {
            const userId = (await supabase.auth.getUser()).data.user?.id || 'guest';

            const { error } = await supabase
                .from('app_feedback')
                .insert([{
                    user_id: userId === 'guest' ? null : userId,
                    type: 'text_suggestion',
                    content: text,
                    metadata: {
                        ...metadata,
                        userAgent: navigator.userAgent,
                        location: window.location.href
                    }
                }]);

            if (error) throw error;
            return { success: true };
        } catch (error) {
            logger.error('[feedbackService] Error sending text feedback:', error);
            return { success: false, error: error.message };
        }
    }
};

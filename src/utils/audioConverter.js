/**
 * Utility to handle and convert audio formats, specifically for WhatsApp .opus compatibility.
 */
export const audioConverter = {
    /**
     * Checks if a file is a WhatsApp audio (.opus).
     */
    isWhatsAppAudio(file) {
        return file.name?.toLowerCase().endsWith('.opus') || file.type === 'audio/ogg';
    },

    /**
     * Wraps an .opus file into a Blob that the browser can handle more reliably as audio/webm
     * (Note: This doesn't re-encode, just changes the metadata hint if possible, 
     * but usually browsers handle .opus fine if we just set the right mime type).
     */
    async prepareForUpload(file) {
        if (this.isWhatsAppAudio(file)) {
            // WhatsApp .opus is usually OGG/Opus. 
            // We return a new Blob with audio/webm mime type which is more "standard" for our app's recorder
            // but keep the original data. 
            return new Blob([file], { type: 'audio/webm' });
        }
        return file;
    }
};

import * as Comlink from 'comlink';
import { getRandomProverb } from '../data/proverbs';

/**
 * IAIA Worker [MASTER]
 * Offloads heavy multimedia analysis and metric calculations to a separate thread.
 */
const iaiaApi = {
    async studyMultimediaContext(fileBuffer, filename) {
        // Simulate deep visual analysis
        await new Promise(r => setTimeout(r, 2000));

        const proverb = getRandomProverb();
        const context = {
            detectedObjects: ["paisatge rural", "veïns", "tradició"],
            suggestedTitle: `Crònica de ${filename.split('.')[0]}`,
            suggestedMotto: proverb.text,
            proverbMeaning: proverb.meaning,
            contextTone: "nostàlgic i vibrant"
        };

        return context;
    },

    async calculateSimbiosiMetrics(userComments = "") {
        // Economic Formula: Human Minute @ 1€ (60€/h) vs AI tokens.
        const wordCount = (userComments || "").trim().split(/\s+/).filter(w => w.length > 0).length;
        const timeSavedMinutes = Math.max(5, Math.ceil(wordCount / 5)); 
        const economicValue = timeSavedMinutes * 1; 
        const humanWeight = Math.min(90, Math.max(10, 20 + (wordCount * 2)));
        const aiWeight = 100 - humanWeight;

        return {
            ai_percentage: aiWeight,
            human_percentage: humanWeight,
            time_saved_minutes: timeSavedMinutes,
            economic_value_euro: economicValue,
            is_iaia_inspired: true
        };
    }
};

Comlink.expose(iaiaApi);

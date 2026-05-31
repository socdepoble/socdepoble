import { IAIES_MUNDIALS_ARRAY } from '../app/config/iaiesMundialsMap';

const officialLinks = {
    'chatgpt-vision': 'https://openai.com/chatgpt',
    'claude': 'https://claude.ai/',
    'qwen': 'https://qwenlm.github.io/',
    'kimi': 'https://kimi.moonshot.cn/',
    'deepseek': 'https://www.deepseek.com/',
    'doubao': 'https://www.doubao.com/',
    'mistral': 'https://mistral.ai/',
    'gemini': 'https://gemini.google.com/',
    'notebooklm': 'https://notebooklm.google.com/',
    'llama': 'https://llama.meta.com/',
    'copilot': 'https://github.com/features/copilot',
    'midjourney': 'https://www.midjourney.com/',
    'perplexity': 'https://www.perplexity.ai/'
};

export const getLogoUrl = (id) => {
    // Logos provisionals / reals de la IA per a mostrar-los a les cards
    const logos = {
        'chatgpt-vision': null,
        'claude': null,
        'gemini': null,
        'llama': null,
        'copilot': null,
        'mistral': null,
        'midjourney': null,
        'perplexity': null
    };
    // Posem logo per defecte d'antigravity per a les que no tenen
    return logos[id] || '/assets/brand/antigravity-badge.png';
};

export const mockIaiesPages = IAIES_MUNDIALS_ARRAY.map(ia => ({
    id: `ia-${ia.id}`,
    author: "Sóc de Poble",
    author_avatar: "/assets/system/ui/logo-socdepoble-rect-negre.svg",
    author_role: "admin",
    title: ia.name,
    post_subtitle: ia.type,
    content: `${ia.wikipediaExtract || ia.shortDescription}

**Enllaç oficial:** [${officialLinks[ia.id] || 'Lloc web'}](${officialLinks[ia.id] || '#'})`,
    likes: Math.floor(Math.random() * 1000) + 100,
    comments: Math.floor(Math.random() * 50) + 5,
    type: "page",
    slug: `ia-${ia.id}`,
    tags: ["#IA", "#EquipSintètic", "#Global"],
    created_at: "2026-01-10T12:00:00.000Z",
    author_name: "Sóc de Poble",
    town_name: "La Torre de les Maçanes",
    image_url: [getLogoUrl(ia.id)]
}));

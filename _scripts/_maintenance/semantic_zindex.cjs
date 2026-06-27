const fs = require('fs');
const path = require('path');

const replacements = [
    { file: 'pages/Map.jsx', old: 'z-max animate-pulse', new: 'z-toast animate-pulse' },
    { file: 'components/PollManager.jsx', old: 'z-max', new: 'z-modal' },
    { file: 'components/HerenciaManager.jsx', old: 'z-max', new: 'z-modal' },
    { file: 'components/CreationHub.jsx', old: 'z-max', new: 'z-modal' },
    { file: 'components/GuestInteractionModal.jsx', old: 'z-max', new: 'z-modal' },
    { file: 'components/AccessibilitatUniversal.jsx', old: 'bg-black/80 backdrop-blur-sm z-max', new: 'bg-black/80 backdrop-blur-sm z-overlay' },
    { file: 'components/AccessibilitatUniversal.jsx', old: 'border-l border-theme-border z-max', new: 'border-l border-theme-border z-modal' },
    { file: 'components/IAIAChatSidebar.jsx', old: 'bg-black/50 z-max', new: 'bg-black/50 z-overlay' },
    { file: 'components/IAIAChatSidebar.jsx', old: 'relative z-max bg-theme-sidebar', new: 'relative z-sidebar bg-theme-sidebar' },
    { file: 'components/ContextualMenu.jsx', old: 'sticky top-0 z-max', new: 'sticky top-0 z-sticky' },
    { file: 'components/Infoteca/InfografiaGallery.jsx', old: 'fixed inset-0 z-max', new: 'fixed inset-0 z-modal' },
    { file: 'components/MagicPregoner.jsx', old: 'fixed inset-0 z-max', new: 'fixed inset-0 z-modal' },
    { file: 'components/ChatDetail.jsx', old: 'rounded z-max', new: 'rounded z-toast' },
    { file: 'components/TownSelectorModal.jsx', old: 'fixed inset-0 z-max', new: 'fixed inset-0 z-modal' },
    { file: 'components/KnowledgeHub.jsx', old: 'fixed inset-0 z-max', new: 'fixed inset-0 z-modal' },
    { file: 'components/OnboardingFlow.jsx', old: 'z-max flex items-center', new: 'z-modal flex items-center' },
    { file: 'components/CreatePostModal.jsx', old: 'fixed inset-0 z-max', new: 'fixed inset-0 z-modal' },
    { file: 'components/AppLayout.jsx', old: 'absolute inset-0 z-[var(--z-max)]', new: 'absolute inset-0 z-overlay' },
    { file: 'components/AppLayout.jsx', old: 'w-full relative z-max', new: 'w-full relative z-base' },
    { file: 'components/AppLayout.jsx', old: 'fixed z-max top-0', new: 'fixed z-sidebar top-0' },
    { file: 'components/AppLayout.jsx', old: 'relative z-max md:hidden', new: 'relative z-base md:hidden' },
    { file: 'components/AppLayout.jsx', old: 'fixed inset-0 z-[var(--z-max)]', new: 'fixed inset-0 z-overlay' },
    { file: 'components/KitDigitalManager.jsx', old: 'fixed inset-0 z-max', new: 'fixed inset-0 z-modal' },
    { file: 'components/LanguageSelector.jsx', old: 'overflow-hidden z-max', new: 'overflow-hidden z-dropdown' },
    { file: 'components/ListManager.jsx', old: 'p-6 z-max', new: 'p-6 z-modal' }
];

const basePath = path.join(__dirname, '../src');

replacements.forEach(({ file, old, new: replacement }) => {
    const fullPath = path.join(basePath, file);
    if (fs.existsSync(fullPath)) {
        let content = fs.readFileSync(fullPath, 'utf8');
        if (content.includes(old)) {
            content = content.replace(new RegExp(old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), replacement);
            fs.writeFileSync(fullPath, content);
            console.log(`Updated ${file}: ${old} -> ${replacement}`);
        } else {
            console.log(`Not found in ${file}: ${old}`);
        }
    } else {
        console.log(`File not found: ${fullPath}`);
    }
});

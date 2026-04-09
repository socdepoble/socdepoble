import fs from 'fs';

const mappings = {
    'toggleDrawer': 'useNavigation',
    'closeDrawer': 'useNavigation',
    'isDrawerOpen': 'useNavigation',
    'closeIAIASidebar': 'useNavigation',
    'iaiaSidebarOpen': 'useNavigation',
    'openIAIASidebar': 'useNavigation',
    'selectedTown': 'useNavigation',
    'forensicMode': 'useNavigation',
    'toggleForensicMode': 'useNavigation',

    'visionMode': 'useDesign',
    'gloveMode': 'useDesign',
    'blueprintMode': 'useDesign',
    'toggleBlueprintMode': 'useDesign',
    'setIaiaLevel': 'useDesign',
    'toggleAgent': 'useDesign', // If toggleAgent isn't in Design, it might need to go to Nav?

    'isNotePadOpen': 'useModal',
    'setIsNotePadOpen': 'useModal',
    'socialManagerContext': 'useModal',
    'setIsSocialManagerOpen': 'useModal',
    'setIsGuestInteractionModalOpen': 'useModal',
    'isCreateModalOpen': 'useModal',
    'openConnectionModal': 'useModal'
};

const files = [
    'src/components/Header.jsx',
    'src/components/Marketplace.jsx',
    'src/components/AppLayout.jsx',
    'src/components/NotePad.jsx',
    'src/components/ChatDetail.jsx',
    'src/components/Feed.jsx',
    'src/components/UniversalCard.jsx',
    'src/components/SocialManager.jsx',
    'src/components/ChatLayout.jsx',
    'src/components/CreationHub.jsx',
    'src/components/NavigationRail.jsx',
    'src/components/CategoryTabs.jsx',
    'src/components/ChatList.jsx',
    'src/pages/OficiDocumentacio.jsx',
    'src/pages/HubView.jsx',
    'src/pages/Towns.jsx',
    'src/pages/VisionView.jsx',
    'src/pages/ProfileView.jsx',
    'src/pages/LegalNotice.jsx',
    'src/pages/Map.jsx',
    'src/pages/Notes.jsx',
    'src/pages/CommunityDirectory.jsx',
    'src/components/ContextualHeader.jsx'
];

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');
    
    // Matchegem les línies unclassified: `  var1, var2 } = useUI(); // UNCLASSIFIED`
    const regex = /([ \w,]+)\s*\}\s*=\s*useUI\(\);\s*\/\/\s*UNCLASSIFIED/g;
    
    if (!regex.test(content)) return;
    regex.lastIndex = 0;

    content = content.replace(regex, (match, vars) => {
        const varnames = vars.split(',').map(v => v.trim()).filter(Boolean);
        
        let mods = [];
        let desgs = [];
        let navs = [];
        let unknowns = [];

        varnames.forEach(v => {
            const cleanV = v.split(':')[0].trim();
            const target = mappings[cleanV];
            if (target === 'useModal') mods.push(v);
            else if (target === 'useDesign') desgs.push(v);
            else if (target === 'useNavigation') navs.push(v);
            else unknowns.push(v);
        });

        let replacement = '';
        if (mods.length) replacement += `const { ${mods.join(', ')} } = useModal();\n    `;
        if (desgs.length) replacement += `const { ${desgs.join(', ')} } = useDesign();\n    `;
        if (navs.length) replacement += `const { ${navs.join(', ')} } = useNavigation();\n    `;
        if (unknowns.length) replacement += `const { ${unknowns.join(', ')} } = useUI(); // UNCLASSIFIED \n    `;

        return replacement.trimEnd();
    });

    let imports = [];
    if (content.includes('useModal')) imports.push('useModal');
    if (content.includes('useDesign')) imports.push('useDesign');
    if (content.includes('useNavigation')) imports.push('useNavigation');

    let depth = (file.match(/\//g) || []).length;
    let upString = '';
    for(let i=0; i<depth; i++) upString += '../';
    if(upString === '../') upString = './';

    const importRegex = /import\s*\{\s*useUI\s*\}\s*from\s*['"][^'"]+UIContext['"];\s*/g;
    
    let newImports = imports.map(i => {
       const ctxFile = i === 'useModal' ? 'ModalContext' : i === 'useDesign' ? 'DesignContext' : 'NavigationContext';
       return `import { ${i} } from '${upString}context/${ctxFile}';`;
    }).join('\n');
    
    if (content.includes('useUI()')) {
        newImports += `\nimport { useUI } from '${upString}context/UIContext';`;
    }

    content = content.replace(importRegex, newImports + '\n');
    fs.writeFileSync(file, content);
    console.log(`Patched ${file}`);
});

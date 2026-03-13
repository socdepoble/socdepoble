import fs from 'fs';


const MODAL_VARS = new Set([
  'isCreateModalOpen', 'setIsCreateModalOpen',
  'isPostModalOpen', 'setIsPostModalOpen', 'postModalConfig', 'openPostModal',
  'isEventModalOpen', 'setIsEventModalOpen',
  'isMarketModalOpen', 'setIsMarketModalOpen',
  'isSocialManagerOpen', 'setIsSocialManagerOpen', 'socialManagerContext', 'setSocialManagerContext',
  'isViewerOpen', 'setIsViewerOpen', 'viewerConfig', 'openViewer', 'closeViewer',
  'isConnectionModalOpen', 'setIsConnectionModalOpen', 'connectionConfig', 'setConnectionConfig', 'openConnectionModal', 'closeConnectionModal',
  'isAgentSelectorOpen', 'setIsAgentSelectorOpen', 'agentSelectorConfig', 'openAgentSelector', 'closeAgentSelector',
  'isLegalModalOpen', 'setIsLegalModalOpen', 'legalConfig', 'openLegalModal', 'closeLegalModal',
  'isEditModalOpen', 'setIsEditModalOpen', 'editConfig', 'openEditModal', 'closeEditModal',
  'isMagicPregonerOpen', 'setIsMagicPregonerOpen',
  'isGuestInteractionModalOpen', 'setIsGuestInteractionModalOpen'
]);

const DESIGN_VARS = new Set([
  'theme', 'toggleTheme', 'setTheme',
  'visionMode', 'setVisionMode',
  'vibe', 'setVibe',
  'gloveMode', 'setGloveMode', 'toggleGloveMode',
  'visualDemocracy', 'setVisualDemocracy',
  'globalDesign', 'setGlobalDesign',
  'resetToNaturalOrder',
  'accessibilityMode', 'setAccessibilityMode', 'toggleAccessibilityMode',
  'iaiaLevel', 'setIaiaLevelState',
  'blueprintMode', 'setBlueprintMode', 'darkMode', 'architectMode',
  'isDark', 'hapticService', 'asoMode', 'toggleAsoMode'
]);

const NAV_VARS = new Set([
  'landingPage', 'setLandingPage',
  'preferredAgentId', 'setPreferredAgentId',
  'enabledAgentIds', 'setEnabledAgentIdsState',
  'iaiaLoreEnabled', 'setIaiaLoreEnabledState',
  'isDrawerOpen', 'setIsDrawerOpen', 'toggleDrawer', 'closeDrawer',
  'iaiaSidebarOpen', 'setIaiaSidebarOpen', 'openIAIASidebar',
  'iaiaSidebarContext', 'setIaiaSidebarContext',
  'isProfileMenuOpen', 'setIsProfileMenuOpen', 'closeProfileMenu',
  'isAccessibilitatOpen', 'setIsAccessibilitatOpen',
  'selectedTown', 'setSelectedTown',
  'chatSettings', 'setChatSettings',
  'forensicMode', 'setForensicMode'
]);

const files = [
  'src/pages/Notes.jsx',
  'src/components/NotePad.jsx',
  'src/components/SocialManager.jsx',
  'src/components/CategoryTabs.jsx',
  'src/components/ChatList.jsx',
  'src/pages/CommunityDirectory.jsx',
  'src/components/OmniscientViewer.jsx',
  'src/components/MobileBottomNav.jsx',
  'src/components/GuestInteractionModal.jsx',
  'src/components/CreationHub.jsx',
  'src/components/ChatLayout.jsx',
  'src/components/HerenciaManager.jsx',
  'src/components/AccessibilitatUniversal.jsx',
  'src/components/NavigationRail.jsx',
  'src/components/ProfilePowerMenu.jsx',
  'src/components/MasterConsole.jsx',
  'src/components/Feed.jsx',
  'src/components/UniversalCard.jsx',
  'src/components/IAIAAssistantFlow.jsx',
  'src/components/BlueprintOverlay.jsx',
  'src/components/ArchitecteView.jsx',
  'src/components/ChatDetail.jsx',
  'src/components/UniversalCitation.jsx',
  'src/components/DiagnosticConsole.jsx',
  'src/components/ChatEmptyState.jsx',
  'src/components/AppLayout.jsx',
  'src/components/Marketplace.jsx',
  'src/components/Header.jsx',
  'src/components/ContextualHeader.jsx',
  'src/pages/Map.jsx',
  'src/components/GlobalModals.jsx',
  'src/pages/LegalNotice.jsx',
  'src/pages/ProfileView.jsx',
  'src/pages/SolatgeConsole.jsx',
  'src/pages/VisionView.jsx',
  'src/pages/HubView.jsx',
  'src/pages/Towns.jsx',
  'src/pages/OficiDocumentacio.jsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // Handle single context usages like `const uiContext = useUI();`
  if (content.includes('const uiContext = useUI();')) {
      console.log(`Manual replacement needed in ${file}`);
      return;
  }

  // Regex to match: const { ... } = useUI(); considering newlines
  const regex = /const\s*\{([\s\S]*?)\}\s*=\s*useUI\(\);/g;
  
  if (!regex.test(content)) return;
  regex.lastIndex = 0;

  content = content.replace(regex, (match, varsString) => {
    // Extract variables properly (handling aliases like a: b, or defaults a=b)
    const varsMap = varsString.split(',').map(v => v.trim()).filter(Boolean);
    
    const modals = [];
    const designs = [];
    const navs = [];
    const unknowns = [];

    varsMap.forEach(vChunk => {
      // get the actual var name (e.g. `isCreateModalOpen` from `isCreateModalOpen: isOpen` or `isCreateModalOpen`)
      const actualVarName = vChunk.split(':')[0].split('=')[0].trim();
      
      if (MODAL_VARS.has(actualVarName)) modals.push(vChunk);
      else if (DESIGN_VARS.has(actualVarName)) designs.push(vChunk);
      else if (NAV_VARS.has(actualVarName)) navs.push(vChunk);
      else unknowns.push(vChunk);
    });

    let replacement = '';
    if (modals.length) replacement += `const { ${modals.join(', ')} } = useModal();\n    `;
    if (designs.length) replacement += `const { ${designs.join(', ')} } = useDesign();\n    `;
    if (navs.length) replacement += `const { ${navs.join(', ')} } = useNavigation();\n    `;
    if (unknowns.length) replacement += `const { ${unknowns.join(', ')} } = useUI(); // UNCLASSIFIED \n    `;

    return replacement.trimEnd();
  });

  let imports = [];
  if (content.includes('useModal')) imports.push('useModal');
  if (content.includes('useDesign')) imports.push('useDesign');
  if (content.includes('useNavigation')) imports.push('useNavigation');

  if (imports.length > 0) {
    // Determine relative paths to contexts
    let depth = (file.match(/\//g) || []).length;
    let upString = '';
    for(let i=0; i<depth; i++) upString += '../';
    if(upString === '../') upString = './';
    
    // Replace the old import
    const importRegex = /import\s*\{\s*useUI\s*\}\s*from\s*['"][^'"]+UIContext['"];/g;
    
    // Create new import strings
    let newImports = imports.map(i => {
       const ctxFile = i === 'useModal' ? 'ModalContext' : i === 'useDesign' ? 'DesignContext' : 'NavigationContext';
       return `import { ${i} } from '${upString}context/${ctxFile}';`;
    }).join('\n');
    
    if (content.includes('useUI()')) {
        newImports += `\nimport { useUI } from '${upString}context/UIContext';`;
    }

    content = content.replace(importRegex, newImports);
  }

  fs.writeFileSync(file, content);
  console.log(`Refactored ${file}`);
});

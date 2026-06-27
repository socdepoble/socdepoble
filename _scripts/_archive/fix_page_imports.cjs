const fs = require('fs');
const path = require('path');
const glob = require('glob');

const mapping = {
  // admin
  "AdminPanel": "admin/AdminPanel",
  "ControlGeneral": "admin/ControlGeneral",
  "SolatgeConsole": "admin/SolatgeConsole",
  "ChatManager": "admin/ChatManager",
  "MenuManagementView": "admin/MenuManagementView",
  "PlaygroundPortal": "admin/PlaygroundPortal",
  "SessionChronicle": "admin/SessionChronicle",
  "GhostMemorial": "admin/GhostMemorial",
  "DAFOPage": "admin/DAFOPage",
  "DesignCanon": "admin/DesignCanon",
  "DidacticPage": "admin/DidacticPage",
  "Ideoteca": "admin/Ideoteca",
  "AulaRural": "admin/AulaRural",
  "ManualPage": "admin/ManualPage",
  "NexusFlash": "admin/NexusFlash",
  "GenesisViewer": "admin/GenesisViewer",
  "Chrome145Report": "admin/Chrome145Report",
  "Versions": "admin/Versions",
  "IAIASandbox": "admin/IAIASandbox",
  "Utilitats": "admin/Utilitats",
  
  // auth
  "Register": "auth/Register",
  "Auth.css": "auth/Auth.css",
  
  // community
  "CommunityDirectory": "community/CommunityDirectory",
  "AgentDirectory": "community/AgentDirectory",
  "UsersDirectory": "community/UsersDirectory",
  "IaiesMundialsDirectory": "community/IaiesMundialsDirectory",
  "ProfileView": "community/ProfileView",
  "Towns": "community/Towns",
  "Map": "community/Map",
  "MasterCalendar": "community/MasterCalendar",
  
  // features
  "HubView": "features/HubView",
  "MediaManager": "features/MediaManager",
  "OficiDocumentacio": "features/OficiDocumentacio",
  "BuscadorAjudes": "features/BuscadorAjudes",
  "ConnectarPage": "features/ConnectarPage",
  "MedicationConfirm": "features/MedicationConfirm",
  "VitalSecurity": "features/VitalSecurity",
  "Archive": "features/Archive",
  "GlobalAssetAlbum": "features/GlobalAssetAlbum",
  "ResourceDetail": "features/ResourceDetail",
  "UniversalDetail": "features/UniversalDetail",
  "Notes": "features/Notes",
  "SearchDiscover": "features/SearchDiscover",
  "VisionView": "features/VisionView",
  
  // public
  "ProjectPresentation": "public/ProjectPresentation",
  "LegalPages": "public/LegalPages",
  "RoadmapView": "public/RoadmapView",
};

// Also handle the css imports if they are imported from pages directly.
// e.g. import '../../pages/Auth.css' -> import '../../pages/auth/Auth.css'

function fixFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    for (const [key, value] of Object.entries(mapping)) {
        // match something like: import "../../pages/AdminPanel"
        // or import { Something } from "../../pages/AdminPanel"
        // or lazy(() => import('../../pages/AdminPanel'))
        
        // This regex looks for 'pages/' or "pages/" followed by the key, ending the quote or adding a .jsx
        // It covers ../pages, ../../pages, etc.
        const regex = new RegExp(`(pages/)${key}(?=['"\\.])`, 'g');
        content = content.replace(regex, `$1${value}`);
    }
    
    // Auth.css specific case (since it includes the .css in the map key)
    const authCssRegex = new RegExp(`(pages/)Auth\\.css(?=['"\\.])`, 'g');
    content = content.replace(authCssRegex, `$1auth/Auth.css`);
    
    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${filePath}`);
    }
}

const files = glob.sync('src/**/*.{js,jsx,ts,tsx}', { nodir: true });
files.forEach(fixFile);


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

const pagesDir = path.join(__dirname, 'src', 'pages');

const files = glob.sync('src/pages/**/*.jsx');

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    const currentSubfolder = path.basename(path.dirname(file)); // e.g. 'admin'

    // 1. Fix ../ imports by adding an extra ../
    // Match `import something from '../'` and replace with `import something from '../../'`
    // Be careful with multi-line imports and require statements
    content = content.replace(/from\s+(['"])\.\.\//g, "from $1../../");
    content = content.replace(/import\s+(['"])\.\.\//g, "import $1../../");
    // Some might be dynamic imports: import('../')
    content = content.replace(/import\((['"])\.\.\//g, "import($1../../");

    // 2. Fix ./ imports (which were pointing to the flat src/pages directory)
    // If they import a specific page like './ProjectPresentation', we must map it to '../public/ProjectPresentation'
    Object.keys(mapping).forEach(key => {
        // e.g. match './ProjectPresentation'
        const regex1 = new RegExp(`from\\s+(['"])\\.\\/${key}(['"])`, 'g');
        const regex2 = new RegExp(`import\\s+(['"])\\.\\/${key}(['"])`, 'g');
        const regex3 = new RegExp(`import\\((['"])\\.\\/${key}(['"])`, 'g');
        
        const targetPath = mapping[key];
        // If it's in the same subfolder (e.g. admin importing admin), it's just './Key'
        const targetSubfolder = path.dirname(targetPath); // 'public'
        const targetName = path.basename(targetPath); // 'ProjectPresentation'
        
        let newImportPath;
        if (targetSubfolder === currentSubfolder) {
            newImportPath = `./${targetName}`;
        } else {
            newImportPath = `../${targetSubfolder}/${targetName}`;
        }

        content = content.replace(regex1, `from $1${newImportPath}$2`);
        content = content.replace(regex2, `import $1${newImportPath}$2`);
        content = content.replace(regex3, `import($1${newImportPath}$2`);
    });

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Fixed internal imports in ${file}`);
    }
});

const fs = require('fs');
const path = require('path');

const files = [
  'src/pages/features/CercaPage.jsx',
  'src/pages/features/ConnectarPage.jsx',
  'src/pages/features/GlobalAssetAlbum.jsx',
  'src/pages/features/HubView.jsx',
  'src/pages/features/MediaManager.jsx',
  'src/pages/features/OficiDocumentacio.jsx',
  'src/pages/features/anima-del-mas/LawsGrid.jsx',
  'src/pages/public/RoadmapView.jsx',
];

files.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf-8');

  // Replace `group-hover:` with `group-data-[active=true]:`
  content = content.replace(/group-hover:/g, 'group-data-[active=true]:');

  // Find elements with className="... group ..." and add pointer events
  const groupRegex = /(className="[^"]*\bgroup\b[^"]*")/g;
  content = content.replace(groupRegex, (match) => {
    if (match.includes('onPointerEnter')) return match;
    
    // Replace hover: with data-[active=true]: on the parent group as well
    const updatedMatch = match.replace(/\bhover:/g, 'data-[active=true]:');
    
    return updatedMatch + ` data-active="false" onPointerEnter={(e) => e.currentTarget.dataset.active = "true"} onPointerLeave={(e) => e.currentTarget.dataset.active = "false"} onPointerCancel={(e) => e.currentTarget.dataset.active = "false"}`;
  });

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Fixed ${file}`);
});

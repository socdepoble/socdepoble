const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir(path.join(__dirname, '../src'), function(filePath) {
  if (!filePath.endsWith('.jsx')) return;
  let content = fs.readFileSync(filePath, 'utf-8');
  if (!content.includes('group-hover')) return;

  // Replace `group-hover:` with `group-data-[active=true]:`
  content = content.replace(/group-hover:/g, 'group-data-[active=true]:');

  // Find elements with className="... group ..." and add pointer events
  const groupRegex = /(className="[^"]*\bgroup\b[^"]*")/g;
  content = content.replace(groupRegex, (match) => {
    if (match.includes('onPointerEnter')) return match;
    const updatedMatch = match.replace(/\bhover:/g, 'data-[active=true]:');
    return updatedMatch + ` data-active="false" onPointerEnter={(e) => e.currentTarget.dataset.active = "true"} onPointerLeave={(e) => e.currentTarget.dataset.active = "false"} onPointerCancel={(e) => e.currentTarget.dataset.active = "false"}`;
  });

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Fixed ${filePath}`);
});

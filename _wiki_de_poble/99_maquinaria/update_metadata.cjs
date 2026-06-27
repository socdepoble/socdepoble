const fs = require('fs');
const path = require('path');

const skillsDir = path.join(__dirname, '../05_skills_ia');

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  files.forEach(file => {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (file === 'SKILL.md') {
      updateMetadata(fullPath);
    }
  });
}

function updateMetadata(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Check if it has frontmatter
  if (content.startsWith('---')) {
    const endOfFrontmatter = content.indexOf('---', 3);
    if (endOfFrontmatter !== -1) {
      let frontmatter = content.substring(3, endOfFrontmatter).trim();
      let body = content.substring(endOfFrontmatter + 3);
      
      // Check if authority or version already exists
      if (!frontmatter.includes('authority:')) {
        frontmatter += '\nauthority: "Consell de les 11 IAs"';
      }
      if (!frontmatter.includes('version:')) {
        frontmatter += '\nversion: "V21"';
      }
      
      const newContent = `---\n${frontmatter}\n---${body}`;
      fs.writeFileSync(filePath, newContent, 'utf-8');
      console.log(`Updated metadata for: ${filePath}`);
    }
  }
}

if (fs.existsSync(skillsDir)) {
  processDirectory(skillsDir);
  console.log("Finished updating metadata.");
} else {
  console.log(`Directory not found: ${skillsDir}`);
}

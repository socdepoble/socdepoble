import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runSemanticAudit } from './semantic_auditor.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../../');

async function getAllMdFiles(dir) {
  let results = [];
  const list = await fs.readdir(dir, { withFileTypes: true });
  for (const file of list) {
    const fullPath = path.join(dir, file.name);
    if (file.name === 'node_modules' || file.name === '.git' || file.name === 'assets') continue;
    if (file.isDirectory()) {
      results = results.concat(await getAllMdFiles(fullPath));
    } else if (file.name.endsWith('.md')) {
      results.push(fullPath);
    }
  }
  return results;
}

async function main() {
  console.log('🔍 Executant Auditoria Semàntica...');
  const { filenameAlerts } = await runSemanticAudit(ROOT);
  
  const toRename = filenameAlerts.filter(a => a.tipus === 'DATA-INNECESSARIA');
  if (toRename.length === 0) {
    console.log('✅ Cap fitxer per renomenar.');
    return;
  }

  const renameMap = new Map(); // oldName (without ext) -> newName (without ext)
  const exactRenameMap = new Map(); // oldFullName -> newFullName

  console.log(`\n🔄 Es renomenaran ${toRename.length} fitxers:`);
  for (const alert of toRename) {
    const oldFullPath = path.join(ROOT, alert.fitxer);
    const oldBaseName = path.basename(alert.fitxer);
    const newBaseName = oldBaseName.replace(/^\d{6}_\d{4}_/, '');
    const newFullPath = path.join(path.dirname(oldFullPath), newBaseName);
    
    console.log(`  - ${oldBaseName} -> ${newBaseName}`);
    
    // Perform rename
    await fs.rename(oldFullPath, newFullPath);
    
    const oldNoExt = oldBaseName.replace('.md', '');
    const newNoExt = newBaseName.replace('.md', '');
    renameMap.set(oldNoExt, newNoExt);
    exactRenameMap.set(oldBaseName, newBaseName);
  }

  console.log('\n🔗 Actualitzant enllaços a la Wiki...');
  const allMdFiles = await getAllMdFiles(ROOT);
  let updatedFilesCount = 0;

  for (const file of allMdFiles) {
    let content = await fs.readFile(file, 'utf-8');
    let changed = false;

    for (const [oldName, newName] of renameMap.entries()) {
      // Obsidian links [[oldName]] -> [[newName]]
      const linkRegex1 = new RegExp(`\\[\\[${oldName}\\]\\]`, 'g');
      if (linkRegex1.test(content)) {
        content = content.replace(linkRegex1, `[[${newName}]]`);
        changed = true;
      }
      
      // Obsidian links with alias [[oldName|alias]] -> [[newName|alias]]
      const linkRegex2 = new RegExp(`\\[\\[${oldName}\\|(.*?)\\]\\]`, 'g');
      if (linkRegex2.test(content)) {
        content = content.replace(linkRegex2, `[[${newName}|$1]]`);
        changed = true;
      }
    }
    
    for (const [oldFullName, newFullName] of exactRenameMap.entries()) {
      // Markdown links [text](oldFullName) -> [text](newFullName)
      const linkRegex3 = new RegExp(`\\]\\(${oldFullName}\\)`, 'g');
      if (linkRegex3.test(content)) {
        content = content.replace(linkRegex3, `](${newFullName})`);
        changed = true;
      }
    }

    if (changed) {
      await fs.writeFile(file, content, 'utf-8');
      updatedFilesCount++;
    }
  }

  console.log(`✅ ${updatedFilesCount} fitxers actualitzats per corregir enllaços trencats.`);
}

main().catch(console.error);

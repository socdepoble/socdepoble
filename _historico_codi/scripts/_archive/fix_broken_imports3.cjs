const fs = require('fs');

const brokenImports = [
  { broken: "'../supabaseClient'", fix: "'../../core/supabaseClient'" },
  { broken: '"../supabaseClient"', fix: '"../../core/supabaseClient"' },
  { broken: "'../core/", fix: "'../../core/" },
  { broken: '"../core/', fix: '"../../core/' },
  { broken: "'../app/", fix: "'../../app/" },
  { broken: '"../app/', fix: '"../../app/' },
  { broken: "'../pages/", fix: "'../../pages/" },
  { broken: '"../pages/', fix: '"../../pages/' },
  { broken: "'../domain/", fix: "'../../domain/" },
  { broken: '"../domain/', fix: '"../../domain/' }
];

const { execSync } = require('child_process');
const allFiles = execSync('find src/shared -type f -name "*.jsx" -o -name "*.js" -o -name "*.tsx" -o -name "*.ts"', { encoding: 'utf8' }).trim().split('\n').filter(Boolean);

allFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  
  brokenImports.forEach(({broken, fix}) => {
    if (content.includes(broken)) {
      content = content.replaceAll(broken, fix);
      changed = true;
    }
  });

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed imports in', file);
  }
});

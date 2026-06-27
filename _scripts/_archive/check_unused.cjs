const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const pagesDir = path.join(__dirname, 'src', 'pages');
const pages = fs.readdirSync(pagesDir).filter(f => f.endsWith('.jsx') || f.endsWith('.css'));

const unused = [];
for (const page of pages) {
  const name = page.replace('.jsx', '').replace('.css', '');
  try {
    const res = execSync(`git grep -l "${name}"`, { encoding: 'utf-8' });
    const lines = res.split('\n').filter(Boolean);
    // if the only mention is the file itself, it's unused
    const otherMentions = lines.filter(l => !l.includes(`src/pages/${page}`));
    if (otherMentions.length === 0) {
      unused.push(page);
    }
  } catch (e) {
    unused.push(page);
  }
}
console.log("Potentially unused pages:");
console.log(unused.join('\n'));

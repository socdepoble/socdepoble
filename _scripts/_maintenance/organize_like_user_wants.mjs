import fs from 'fs';

const code = fs.readFileSync('src/shared/data.js', 'utf8');

const regex = /\/assets\/[^"'\s]+/g;
const matches = [...code.matchAll(regex)];
const pathsInUse = new Set(matches.map(m => m[0]));

console.log("Paths currently in use in data.js:");
for (let p of pathsInUse) {
  if (!p.includes('avatars') && !p.includes('nanobanana')) {
    console.log(p);
  }
}

const fs = require('fs');
const path = require('path');

const dataFile = fs.readFileSync(path.join(__dirname, 'src/data.js'), 'utf8');
const publicDir = path.join(__dirname, 'public');

const regex = /["'](.*?\.(png|jpg|jpeg|webp))["']/g;
let match;
const missing = new Set();
const found = new Set();
const total = new Set();

while ((match = regex.exec(dataFile)) !== null) {
  const imgUrl = match[1];
  total.add(imgUrl);
  // remove leading slash if present for path join
  const relativePath = imgUrl.startsWith('/') ? imgUrl.substring(1) : imgUrl;
  const fullPath = path.join(publicDir, relativePath);
  
  if (!fs.existsSync(fullPath)) {
    missing.add(imgUrl);
  } else {
    found.add(imgUrl);
  }
}

console.log('--- MISSING IMAGES ---');
Array.from(missing).forEach(m => console.log(m));
console.log(`\nTotal unique image links in data.js: ${total.size}`);
console.log(`Total missing: ${missing.size}`);

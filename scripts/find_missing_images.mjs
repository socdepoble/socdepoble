import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// A hack to parse data.js since it's just ESM
// Wait, we can't easily import data.js because it has no package.json "type": "module" maybe?
// Let's just do a regex check.
const dataJsPath = path.resolve('src/data.js');
const fileContent = fs.readFileSync(dataJsPath, 'utf-8');

const posts = fileContent.split('  {\n');
let missingImages = [];

for (const post of posts) {
  if (!post.includes('id:')) continue;
  if (!post.includes('image_url:') && !post.includes('image:')) {
    const idMatch = post.match(/id:\s*(["']?[^,"'\n]+["']?)/);
    if (idMatch) {
      // Exclude chats or other unrelated objects if any
      if (post.includes('time:') || post.includes('title:')) {
         missingImages.push(idMatch[1]);
      }
    }
  }
}

console.log('Posts without images:', missingImages);

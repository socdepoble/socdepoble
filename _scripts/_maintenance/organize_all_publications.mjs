import fs from 'fs';
import path from 'path';

const code = fs.readFileSync('src/shared/data.js', 'utf8');

// Use regex to find all object literals that might be posts/products/events and have an image_url or images
// Since parsing JS with regex is hard, let's just find paths directly.
const regex = /\/assets\/(images|brand|brain|products|places)\/[^"'\s]+/g;
const matches = [...code.matchAll(regex)];
const pathsToFix = new Set(matches.map(m => m[0]));

console.log("Paths to reorganize:");
for (let p of pathsToFix) {
  console.log(p);
}

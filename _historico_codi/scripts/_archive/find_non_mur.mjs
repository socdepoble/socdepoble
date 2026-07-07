import fs from 'fs';

const code = fs.readFileSync('src/shared/data.js', 'utf8');

// Find the MOCK_FEED array
const start = code.indexOf('export const MOCK_FEED = [');
const end = code.indexOf('export const MOCK_MARKET = [');
const mockFeedCode = code.substring(start, end);

const regex = /\/assets\/[^"'\s]+/g;
const matches = [...mockFeedCode.matchAll(regex)];

const paths = new Set(matches.map(m => m[0]));

console.log("MOCK_FEED asset paths NOT in /assets/mur/ or /assets/avatars/:");
for (let path of paths) {
  if (!path.startsWith('/assets/mur/') && !path.startsWith('/assets/avatars/')) {
    console.log(path);
  }
}

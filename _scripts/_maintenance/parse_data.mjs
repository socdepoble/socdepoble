import fs from 'fs';

const data = fs.readFileSync('src/shared/data.js', 'utf8');

// Find all image paths that don't match the new ISO structure
// The ISO structure is /assets/[Category]/[Timestamp]_[Type]_[Name]/[image]
const regex = /(?:image|avatar|src|url):\s*['"](\/assets\/[^'"]+)['"]/g;

let match;
while ((match = regex.exec(data)) !== null) {
  const imgPath = match[1];
  // check if it's not following the ISO standard
  // or just print all to see
  if (!imgPath.includes('avatars') && imgPath.split('/').length < 5) {
      console.log("Loose image in data.js:", imgPath);
  }
}

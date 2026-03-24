import fs from 'fs';
import path from 'path';

const dataJsPath = path.resolve('src/data.js');
let fileContent = fs.readFileSync(dataJsPath, 'utf-8');

// Find the MOCK_FEED array definition start index
const mockFeedStart = fileContent.indexOf('export const MOCK_FEED = [');
const dbEnd = fileContent.indexOf('export const MOCK_MARKET_ITEMS'); // arbitrary end point

let mockFeedChunk = fileContent.substring(mockFeedStart, dbEnd);

// Regex to find content that has Markdown headers
// format: title: "something" might not exist.
// format: content: "# Emoji Title\n\n## Subtitle\n\nText..."
mockFeedChunk = mockFeedChunk.replace(/content:\s*`([^`]+)`|content:\s*"([^"]+)"/g, (match, match1, match2) => {
  let content = match1 || match2;
  // Handle literal newlines \n
  if (match2) {
    // It's a double-quoted string. Let's unescape it to test regexes.
    content = content.replace(/\\n/g, '\n');
  }

  // Regex to extract Title and Subtitle
  const hasH1 = content.match(/^#\s+(.*?)\n+/);
  if (!hasH1) return match; // Not a targeted pattern, return original

  const title = hasH1[1];
  let postSubtitle = '';
  
  // Remove H1
  content = content.replace(/^#\s+(.*?)\n+/, '');

  // Check for H2
  const hasH2 = content.match(/^##\s+(.*?)\n+/);
  if (hasH2) {
    postSubtitle = hasH2[1];
    content = content.replace(/^##\s+(.*?)\n+/, '');
  }

  // Also check if there's an author prefix like "## Per Javi Llinares"
  if (postSubtitle.toLowerCase().startsWith('per ')) {
    // Maybe not the best post_subtitle, but let's keep it.
  }

  // Check if we also need to add `title: ...` and `post_subtitle: ...` before content.
  // Actually, replace this entire line with the new fields
  
  // Escape newlines again for writing
  let escapedContent = content.replace(/\n/g, '\\n').replace(/"/g, '\\"');
  
  let newFields = `title: "${title.replace(/"/g, '\\"')}",\n`;
  if (postSubtitle) {
    newFields += `    post_subtitle: "${postSubtitle.replace(/"/g, '\\"')}",\n`;
  }
  newFields += `    content:\n      "${escapedContent}"`;

  return newFields;
});

// For posts like id: 900 (Permís de Crema Local), it has title but NO post_subtitle.
// Check if the user wants EVERY post to have a post_subtitle.
// The user said: "Quiero que todos los posts tengan título, subtítulo y párrafo".
// We can add a generic subtitle to posts that lack one, but manually parsing that right here might be complex.

fileContent = fileContent.substring(0, mockFeedStart) + mockFeedChunk + fileContent.substring(dbEnd);
fs.writeFileSync(dataJsPath, fileContent, 'utf-8');

console.log('MOCK_FEED markdown headers successfully normalized to title/post_subtitle!');

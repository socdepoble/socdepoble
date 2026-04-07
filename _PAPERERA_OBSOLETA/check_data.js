import fs from 'fs';

const code = fs.readFileSync('src/data.js', 'utf8');

// A simple way to inspect without full AST:
const extractArray = (code, name) => {
  const startMarker = `export const ${name} = [`;
  let startIdx = code.indexOf(startMarker);
  if (startIdx === -1) return [];
  startIdx += startMarker.length - 1; // point to '['
  
  let brackets = 0;
  let endIdx = startIdx;
  let inString = false;
  let strChar = '';
  
  for (let i = startIdx; i < code.length; i++) {
    const c = code[i];
    if (!inString && (c === '"' || c === "'" || c === "`")) {
      inString = true;
      strChar = c;
    } else if (inString && c === strChar && code[i-1] !== '\\') {
      inString = false;
    } else if (!inString) {
      if (c === '[') brackets++;
      if (c === ']') {
        brackets--;
        if (brackets === 0) {
          endIdx = i;
          break;
        }
      }
    }
  }
  const arrStr = code.substring(startIdx, endIdx + 1);
  return eval("(function(){ return " + arrStr + " })()");
}

try {
  let stats = {};
  ['MOCK_FEED', 'MOCK_MARKET', 'MOCK_EVENTS', 'MOCK_TOWNS'].forEach(name => {
    const arr = extractArray(code, name);
    let missingTitle = 0;
    let missingSubtitle = 0;
    let missingContent = 0;
    arr.forEach(item => {
      if (!item.title) missingTitle++;
      if (!item.post_subtitle) missingSubtitle++;
      if (!item.content) missingContent++;
    });
    stats[name] = { total: arr.length, missingTitle, missingSubtitle, missingContent };
  });
  console.log(JSON.stringify(stats, null, 2));
} catch(e) { console.error(e) }

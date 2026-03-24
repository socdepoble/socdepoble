const fs = require('fs');

const dataPath = 'src/data.js';
let text = fs.readFileSync(dataPath, 'utf-8');

const injectedKeys = ['author_name', 'author_entity_id', 'tags', 'town_name'];
let lines = text.split('\n');

for (let i = 1; i < lines.length; i++) {
    let currentTrimmed = lines[i].trim();
    let prevTrimmed = lines[i-1].trim();

    if (injectedKeys.some(k => currentTrimmed.startsWith(k + ':'))) {
        if (prevTrimmed && !prevTrimmed.endsWith(',') && !prevTrimmed.endsWith('{') && !prevTrimmed.endsWith('[')) {
            lines[i-1] = lines[i-1] + ',';
        }
    }
}

fs.writeFileSync(dataPath, lines.join('\n'), 'utf-8');
console.log('Fixed missing commas in data.js');

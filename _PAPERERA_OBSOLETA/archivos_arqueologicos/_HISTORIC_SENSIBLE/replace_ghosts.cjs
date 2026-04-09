const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    if (content.includes('sdp-oficial-1')) {
        content = content.replace(/sdp-oficial-1/g, 'socdepoble');
        changed = true;
    }
    if (content.includes('rentonar-1')) {
        content = content.replace(/rentonar-1/g, 'rentonar');
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${filePath}`);
    }
}

const files = [
    'src/services/supabaseService.js',
    'src/domain/iaiaDomain.js',
    'src/data/mockLoreData.js',
    'src/data.js',
    'src/components/Feed.jsx',
    'src/components/Marketplace.jsx'
];

files.forEach(f => replaceInFile(path.join(__dirname, f)));
console.log('Ghost references for SDP and Rentonar replaced successfully.');

const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'src', 'data', 'index.js');
let indexData = fs.readFileSync(indexPath, 'utf8');

// Replacements
indexData = indexData.replace(/\/assets\/uploads\/companies\//g, '/assets/uploads/empresa/');
indexData = indexData.replace(/\/assets\/uploads\/groups\//g, '/assets/uploads/grup/');
indexData = indexData.replace(/\/assets\/uploads\/towns\//g, '/assets/uploads/poble/');
indexData = indexData.replace(/\/assets\/uploads\/users\//g, '/assets/uploads/gent/');
indexData = indexData.replace(/\/assets\/uploads\/others\//g, '/assets/uploads/altres/');

fs.writeFileSync(indexPath, indexData, 'utf8');
console.log('Updated src/data/index.js with new paths');

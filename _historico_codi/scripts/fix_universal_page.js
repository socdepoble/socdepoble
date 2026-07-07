const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/pages/public/UniversalPage.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// The warning says fetchpriority="high" at line 895.
content = content.replace(/fetchpriority=/g, 'fetchPriority=');

fs.writeFileSync(filePath, content);
console.log("Fixed fetchpriority in UniversalPage.jsx");

const fs = require('fs');
try {
const path = './src/i18n/locales/';
fs.readdirSync(path);
// I'll skip writing it again if I can just pass the raw keys to ProjectPresentation.jsx as fallbacks!
} catch (e) { console.error(e) }

const fs = require('fs');
let genotipPath = 'src/data/GenotipContent.js';
let genotipContent = fs.readFileSync(genotipPath, 'utf-8');

// I need to properly escape all backticks that are NOT the opening or closing of the template literal.
// Wait, the easiest way is to re-run the append_skills script but first revert the file!


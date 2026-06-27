import fs from 'fs';

let dataJs = fs.readFileSync('src/shared/data.js', 'utf8');

// Global replacement of the specific lowercase strings if they start with /assets/
dataJs = dataJs.replace(/\/assets\/mercat\//g, '/assets/Mercat/');
dataJs = dataJs.replace(/\/assets\/mur\//g, '/assets/Mur/');
dataJs = dataJs.replace(/\/assets\/events\//g, '/assets/Esdeveniments/');
dataJs = dataJs.replace(/\/assets\/places\//g, '/assets/Pobles/');
dataJs = dataJs.replace(/\/assets\/products\//g, '/assets/Mercat/');

fs.writeFileSync('src/shared/data.js', dataJs);
console.log("Fixed capitalization in data.js");

const fs = require('fs');
let code = fs.readFileSync('src/data/index.js', 'utf8');

code = code.replace(/author: "([^"]+)"\s*author_avatar:/g, 'author: "$1",\n    author_avatar:');
code = code.replace(/author_name: "([^"]+)"\s*author_avatar:/g, 'author_name: "$1",\n    author_avatar:');

fs.writeFileSync('src/data/index.js', code);
console.log('Fixed missing commas');

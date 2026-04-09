const { marked } = require('marked');
const html = marked.parse('> [!NOTE] Prólogo del Sistema:\\n> Este documento no es un simple conjunto de features.');
console.log(html);

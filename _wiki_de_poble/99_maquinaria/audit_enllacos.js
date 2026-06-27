const fs = require('fs');
const path = require('path');
const { globSync } = require('glob');

const WIKI_DIR = '_wiki_de_poble';
const files = globSync(`${WIKI_DIR}/**/*.md`);

function extractWikiLinks(content) {
    const wikiLinkRegex = /\[\[([^\]]+)\]\]/g;
    return [...new Set(content.match(wikiLinkRegex)?.map(link => link.slice(2, -2)) || [])];
}

function findOrphanNodes() {
    const allLinks = new Set();
    const allFiles = new Set(files.map(f => path.basename(f, '.md')));

    files.forEach(file => {
        const content = fs.readFileSync(file, 'utf-8');
        const links = extractWikiLinks(content);
        links.forEach(link => allLinks.add(link));
    });

    const orphanNodes = [...allLinks].filter(link => !allFiles.has(`${link}.md`));
    const isolatedNodes = [...allFiles].filter(file => {
        const content = fs.readFileSync(path.join(WIKI_DIR, file), 'utf-8');
        const links = extractWikiLinks(content);
        return !files.some(f => f !== file && extractWikiLinks(fs.readFileSync(f, 'utf-8')).includes(path.basename(file, '.md')));
    });

    return { orphanNodes, isolatedNodes };
}

const { orphanNodes, isolatedNodes } = findOrphanNodes();
console.log("⚠️ Nodes Orfes:", orphanNodes);
console.log("⚠️ Nodes Aïllats:", isolatedNodes);

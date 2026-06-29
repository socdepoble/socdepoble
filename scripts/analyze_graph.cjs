const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const dir = path.join(__dirname, '..', '_wiki_de_poble');

const walkSync = (dir, filelist = []) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else if (dirFile.endsWith('.md')) {
      filelist.push(dirFile);
    }
  }
  return filelist;
};

const files = walkSync(dir);
const graph = {};

// Build basic graph
for (const f of files) {
  const filename = path.basename(f, '.md');
  const relativePath = path.relative(dir, f);
  const content = fs.readFileSync(f, 'utf8');
  
  // Extract links like [[Link]] or [[Link|Alias]]
  const links = [];
  const regex = /\[\[(.*?)(?:\|.*?)?\]\]/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    let linkTarget = match[1].trim();
    // In Obsidian, links might contain folder paths, we take the basename
    linkTarget = path.basename(linkTarget, '.md');
    links.push(linkTarget);
  }

  graph[filename] = {
    path: relativePath,
    links: links,
    backlinks: []
  };
}

// Compute backlinks
for (const [source, data] of Object.entries(graph)) {
  for (const target of data.links) {
    // If target exists in our graph, add a backlink
    if (graph[target]) {
      graph[target].backlinks.push(source);
    }
  }
}

// Analysis
let orphans = [];
let isolates = [];

for (const [node, data] of Object.entries(graph)) {
  const isIndex = node === '00_index';
  if (!isIndex && data.links.length === 0 && data.backlinks.length === 0) {
    isolates.push(node);
  } else if (!isIndex && data.backlinks.length === 0) {
    orphans.push(node);
  }
}

console.log(`Total files: ${Object.keys(graph).length}`);
console.log(`Isolated files (0 links in, 0 links out): ${isolates.length}`);
console.log(`Orphan files (0 links in, but they link out): ${orphans.length}`);

fs.writeFileSync('scripts/graph_analysis.json', JSON.stringify({ graph, isolates, orphans }, null, 2), 'utf8');
console.log('Graph data saved to scripts/graph_analysis.json');

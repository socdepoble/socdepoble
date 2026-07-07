#!/usr/bin/env node
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

// ═══════════════════════════════════════════════════════════
// CONFIGURACIÓ CANÒNICA
// ═══════════════════════════════════════════════════════════
const CONFIG = {
  carpetesPilars: [
    '00_SER_Brain_Identitat',
    '01_SABER_Cultura_Coneixement',
    '02_EXECUTAR_Maquina_Tecnica',
    '03_REGISTRE_Actes_Efimers'
  ],
  carpetesExcluides: ['node_modules', '.git', 'scripts', '_build', '_temp', '99_assets', 'actes_arxivades'],
  extensionsValides: ['.md'],
  buildDir: '_build',
  documentsFile: 'documents.json',
  manifestFile: 'manifest.json',
  compilerVersion: '1.0.0'
};

// ═══════════════════════════════════════════════════════════
// PARSER DE YAML FRONTMATTER (Zero-dependency, robust)
// ═══════════════════════════════════════════════════════════
function parseFrontmatter(content) {
  const fmRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
  const match = content.match(fmRegex);
  
  if (!match) {
    return { frontmatter: {}, body: content };
  }
  
  const yamlText = match[1];
  const body = content.slice(match[0].length);
  
  const frontmatter = {};
  const lines = yamlText.split('\n');
  let currentKey = null;
  let currentList = null;
  
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    
    if (line.startsWith('- ')) {
      const item = line.slice(2).trim().replace(/^['"]|['"]$/g, '');
      if (currentList) currentList.push(item);
      continue;
    }
    
    const kvMatch = line.match(/^([a-zA-Z_][a-zA-Z0-9_]*):\s*(.*)$/);
    if (kvMatch) {
      const key = kvMatch[1];
      let value = kvMatch[2].trim();
      
      if (currentKey && currentList) {
        frontmatter[currentKey] = currentList;
      }
      
      if (value === '' || value === '|' || value === '>') {
        currentKey = key;
        currentList = [];
      } else if (value.startsWith('[') && value.endsWith(']')) {
        frontmatter[key] = value
          .slice(1, -1)
          .split(',')
          .map(v => v.trim().replace(/^['"]|['"]$/g, ''))
          .filter(Boolean);
        currentKey = null;
        currentList = null;
      } else {
        frontmatter[key] = value.replace(/^['"]|['"]$/g, '');
        currentKey = null;
        currentList = null;
      }
    }
  }
  
  if (currentKey && currentList) {
    frontmatter[currentKey] = currentList;
  }
  
  return { frontmatter, body };
}

// ═══════════════════════════════════════════════════════════
// EXTRACTORS DE METADATA
// ═══════════════════════════════════════════════════════════
function extractTitle(body, frontmatter) {
  if (frontmatter.name) return frontmatter.name;
  if (frontmatter.title) return frontmatter.title;
  
  const h1Match = body.match(/^#\s+(.+)$/m);
  if (h1Match) return h1Match[1].trim();
  
  return null;
}

function extractSummary(body) {
  const lines = body.split('\n');
  for (const line of lines) {
    const clean = line.trim();
    if (!clean || clean.startsWith('#') || clean.startsWith('```') || clean.startsWith('---') || clean.startsWith('|')) continue;
    return clean.length > 200 ? clean.slice(0, 200) + '...' : clean;
  }
  return '';
}

function extractWikilinks(body) {
  const regex = /\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g;
  const links = new Set();
  let match;
  while ((match = regex.exec(body)) !== null) {
    const link = match[1].trim().replace(/\.md$/, '');
    links.add(link);
  }
  return Array.from(links);
}

function detectStatus(frontmatter, fileName) {
  if (frontmatter.status) return frontmatter.status;
  if (frontmatter.redirect) return 'redirect';
  if (fileName.includes('DRAFT')) return 'draft';
  if (fileName.includes('DEPRECATED')) return 'deprecated';
  return 'canonical';
}

function detectPilar(filePath, wikiRoot) {
  const relPath = path.relative(wikiRoot, filePath);
  const parts = relPath.split(path.sep);
  
  for (const pilar of CONFIG.carpetesPilars) {
    if (parts[0] === pilar || parts[0].startsWith(pilar.split('_')[0])) {
      return pilar;
    }
  }
  return 'unknown';
}

function computeHash(content) {
  return crypto.createHash('sha256').update(content, 'utf8').digest('hex').slice(0, 16);
}

function generateID(fileName) {
  return fileName
    .replace(/\.md$/, '')
    .replace(/^\d{6}_\d{4}_[A-Z]+_/, '')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .toLowerCase();
}

// ═══════════════════════════════════════════════════════════
// ESCÀNER
// ═══════════════════════════════════════════════════════════
async function* walkDir(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!CONFIG.carpetesExcluides.includes(entry.name)) {
        yield* walkDir(fullPath);
      }
    } else if (CONFIG.extensionsValides.includes(path.extname(entry.name))) {
      yield fullPath;
    }
  }
}

async function processFile(filePath, wikiRoot) {
  const fileName = path.basename(filePath);
  const content = await fs.readFile(filePath, 'utf8');
  const { frontmatter, body } = parseFrontmatter(content);
  
  return {
    id: generateID(fileName),
    filename: fileName,
    path: path.relative(wikiRoot, filePath).replace(/\\/g, '/'),
    pilar: detectPilar(filePath, wikiRoot),
    title: extractTitle(body, frontmatter),
    summary: extractSummary(body),
    tags: frontmatter.tags || [],
    status: detectStatus(frontmatter, fileName),
    hash: computeHash(content),
    size: content.length,
    links: extractWikilinks(body),
    depends_on: frontmatter.depends_on || [],
    used_by: frontmatter.used_by || [],
    replaces: frontmatter.replaces || [],
    redirect: frontmatter.redirect || null,
    authority: frontmatter.autor || null,
    version: frontmatter.version || null,
    updated_at: frontmatter.updated_at || null
  };
}

// ═══════════════════════════════════════════════════════════
// MANIFEST
// ═══════════════════════════════════════════════════════════
function computeGlobalHash(documents) {
  const sorted = [...documents].sort((a, b) => a.id.localeCompare(b.id));
  const concatenated = sorted.map(d => `${d.id}:${d.hash}`).join('|');
  return crypto.createHash('sha256').update(concatenated, 'utf8').digest('hex').slice(0, 16);
}

function buildManifest(documents, previousManifest) {
  const byPilar = {};
  const byStatus = {};
  const byTag = {};
  
  for (const doc of documents) {
    byPilar[doc.pilar] = (byPilar[doc.pilar] || 0) + 1;
    byStatus[doc.status] = (byStatus[doc.status] || 0) + 1;
    for (const tag of doc.tags) {
      if (!byTag[tag]) byTag[tag] = 0;
      byTag[tag]++;
    }
  }
  
  const globalHash = computeGlobalHash(documents);
  const now = new Date().toISOString();
  
  const changed = [];
  const added = [];
  const removed = [];
  
  if (previousManifest) {
    const prevDocs = new Map(previousManifest.documents || []);
    const currDocs = new Map(documents.map(d => [d.id, d]));
    
    for (const [id, doc] of currDocs) {
      if (!prevDocs.has(id)) {
        added.push(id);
      } else if (prevDocs.get(id).hash !== doc.hash) {
        changed.push(id);
      }
    }
    for (const id of prevDocs.keys()) {
      if (!currDocs.has(id)) removed.push(id);
    }
  }
  
  return {
    version: CONFIG.compilerVersion,
    build_time: now,
    global_hash: globalHash,
    total_documents: documents.length,
    by_pilar: byPilar,
    by_status: byStatus,
    top_tags: Object.entries(byTag)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([tag, count]) => ({ tag, count })),
    changed_since_last_build: changed,
    added_since_last_build: added,
    removed_since_last_build: removed,
    documents: documents.map(d => ({ id: d.id, hash: d.hash, status: d.status }))
  };
}

// ═══════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════
async function main() {
  const args = process.argv.slice(2);
  const verbose = args.includes('--verbose');
  const wikiArg = args.find(a => a.startsWith('--wiki='));
  const wikiRoot = wikiArg ? wikiArg.split('=')[1] : path.resolve(__dirname, '../../');
  const buildDir = path.join(wikiRoot, CONFIG.buildDir);
  
  console.log(`🔨 COMPILADOR SDP v${CONFIG.compilerVersion}`);
  console.log(`📂 Wiki: ${wikiRoot}`);
  console.log(`📦 Output: ${buildDir}\n`);
  
  let previousManifest = null;
  try {
    const prevContent = await fs.readFile(path.join(buildDir, CONFIG.manifestFile), 'utf8');
    previousManifest = JSON.parse(prevContent);
    console.log(`✓ Manifest previ carregat (hash: ${previousManifest.global_hash})`);
  } catch {
    console.log('✓ Primera build (sense manifest previ)');
  }
  
  await fs.mkdir(buildDir, { recursive: true });
  
  const documents = [];
  const warnings = [];
  let fitxersProcessats = 0;
  
  for await (const filePath of walkDir(wikiRoot)) {
    try {
      const doc = await processFile(filePath, wikiRoot);
      if (!doc.title) warnings.push(`${doc.filename}: sense títol`);
      if (doc.tags.length === 0) warnings.push(`${doc.filename}: sense tags`);
      
      documents.push(doc);
      fitxersProcessats++;
      if (verbose) console.log(`  ✓ ${doc.pilar}/${doc.id}`);
    } catch (err) {
      console.error(`❌ Error processant ${filePath}: ${err.message}`);
    }
  }
  
  console.log(`\n✓ ${fitxersProcessats} fitxers processats`);
  
  const manifest = buildManifest(documents, previousManifest);
  const documentsPath = path.join(buildDir, CONFIG.documentsFile);
  await fs.writeFile(documentsPath, JSON.stringify(documents, null, 2), 'utf8');
  
  const manifestPath = path.join(buildDir, CONFIG.manifestFile);
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
  
  console.log(`\n✅ Build completada: ${documentsPath}`);
  
  process.exit(warnings.length > 0 ? 1 : 0);
}

main().catch(err => {
  console.error(`❌ Error fatal: ${err.message}`);
  process.exit(2);
});

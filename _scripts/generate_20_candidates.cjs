const fs = require('fs');
const path = require('path');

const ROOT = process.argv[2] || process.cwd();
const TOP20_FILE = process.argv[3] || path.join(process.cwd(), 'top20_useAuth.json');
const OUT_DIR = path.join(ROOT, 'migration_candidates');

if (!fs.existsSync(TOP20_FILE)) {
  console.error('No trobe top20_useAuth.json en', TOP20_FILE);
  process.exit(2);
}
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

function walk(dir, cb) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === 'node_modules' || e.name === '.git') continue;
      walk(full, cb);
    } else {
      cb(full);
    }
  }
}

function readJSON(file) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch (e) { console.error('Error parsejant JSON', file, e && e.message); return null; }
}

const top20 = readJSON(TOP20_FILE);
if (!top20 || !Array.isArray(top20.top20)) {
  console.error('Format inesperat de top20_useAuth.json');
  process.exit(3);
}

const candidates = [];

function safeRel(p) { return path.relative(ROOT, p).replace(/\\/g, '/'); }

console.log('Escanejant repo per fitxers JS/TS i buscant useAuth...');

const allFiles = [];
walk(ROOT, function(file) {
  if (file.indexOf(OUT_DIR) === 0) return;
  if (!file.match(/\.(js|mjs|cjs|ts|jsx|tsx)$/)) return;
  allFiles.push(file);
});

// Index per nom de fitxer
const filesByName = {};
for (const f of allFiles) {
  const name = path.basename(f);
  filesByName[name] = filesByName[name] || [];
  filesByName[name].push(f);
}

function makeCandidate(originalSrc, relPath) {
  const pattern = /const\s+{([^}]+)}\s*=\s*useAuth\s*\(\s*\)\s*;/g;
  let migrated = originalSrc;
  let changed = false;

  if (pattern.test(originalSrc)) {
    migrated = originalSrc.replace(pattern, function(_, group) {
      changed = true;
      const names = group.split(',').map(s => s.trim()).filter(Boolean);
      const assignLines = [];
      assignLines.push('// TODO MIGRACIÓ useAuth -> authFacade. Reviseu la reactivitat i substituïu per onAuthChange si cal.');
      assignLines.push('var _authSnapshot = (typeof authFacade !== "undefined" && authFacade._internal_state) ? authFacade._internal_state() : { user: null, token: null };');
      assignLines.push('var _authParts = (function(){');
      assignLines.push('  var out = {};');
      assignLines.push('  try {');
      assignLines.push('    out.user = _authSnapshot.user || null;');
      assignLines.push('    out.isAuthenticated = (typeof authFacade !== "undefined") ? authFacade.isAuthenticated() : !!_authSnapshot.token;');
      assignLines.push('  } catch(e) { out.user = null; out.isAuthenticated = false; }');
      assignLines.push('  return out;');
      assignLines.push('})();');
      
      const assigns = names.map(n => {
        if (n === 'user') return 'var user = _authParts.user;';
        if (n === 'isAuthenticated') return 'var isAuthenticated = _authParts.isAuthenticated;';
        return 'var ' + n + ' = _authParts.' + n + ' !== undefined ? _authParts.' + n + ' : null;';
      });
      return assignLines.concat(assigns).join('\n');
    });
  }

  if (!changed && originalSrc.indexOf('useAuth(') !== -1) {
    migrated = originalSrc.replace(/useAuth\s*\(\s*\)/g, function() {
      changed = true;
      return '(typeof useAuth !== "undefined" ? useAuth() : (typeof authFacade !== "undefined" ? (function(){ var s = authFacade._internal_state ? authFacade._internal_state() : { user:null, token:null }; return { user: s.user, isAuthenticated: authFacade.isAuthenticated() }; })() : { user:null, isAuthenticated:false }))';
    });
  }

  if (!changed) return null;

  const header = [
    '*** Candidate patch generated automatically',
    '*** Review carefully before applying',
    'File: ' + relPath,
    '--- ORIGINAL START ---',
    ''
  ].join('\n');

  const footer = [
    '',
    '--- MIGRATED START ---',
    '',
    '*** End of candidate. Manual review required.',
    ''
  ].join('\n');

  return header + originalSrc + '\n' + footer + migrated;
}

for (const entry of top20.top20) {
  const id = entry.id || '';
  const label = entry.label || '';
  const candidatesForEntry = [];

  const possibleNames = [];
  if (id) possibleNames.push(id);
  if (label) possibleNames.push(label);
  
  const exts = ['.js', '.mjs', '.cjs', '.ts', '.jsx', '.tsx'];
  for (const name of possibleNames) {
    for (const e of exts) {
      const n = name.endsWith(e) ? name : name + e;
      if (filesByName[n]) {
        for (const f of filesByName[n]) {
          try {
            const src = fs.readFileSync(f, 'utf8');
            if (src.indexOf('useAuth(') === -1) continue;
            const cand = makeCandidate(src, safeRel(f));
            if (cand) candidatesForEntry.push({ file: f, rel: safeRel(f), candidate: cand });
          } catch (e) {}
        }
      }
    }
  }

  if (candidatesForEntry.length === 0) {
    for (const f of allFiles) {
      try {
        const src = fs.readFileSync(f, 'utf8');
        if (src.indexOf('useAuth(') === -1) continue;
        const rel = safeRel(f);
        const low = src.toLowerCase();
        if (rel.toLowerCase().indexOf(id.toLowerCase()) !== -1 || rel.toLowerCase().indexOf(label.toLowerCase()) !== -1 || low.indexOf(id.toLowerCase()) !== -1 || low.indexOf(label.toLowerCase()) !== -1) {
          const cand = makeCandidate(src, rel);
          if (cand) candidatesForEntry.push({ file: f, rel: rel, candidate: cand });
        }
      } catch (e) {}
    }
  }

  if (candidatesForEntry.length === 0) {
    let count = 0;
    for (const f of allFiles) {
      try {
        const src = fs.readFileSync(f, 'utf8');
        if (src.indexOf('useAuth(') === -1) continue;
        const cand = makeCandidate(src, safeRel(f));
        if (cand) {
          candidatesForEntry.push({ file: f, rel: safeRel(f), candidate: cand });
          count++;
          if (count >= 2) break;
        }
      } catch (e) {}
    }
  }

  if (candidatesForEntry.length === 0) {
    console.log('No candidate found for top20 entry', id, label);
    continue;
  }

  let idx = 0;
  for (const c of candidatesForEntry) {
    idx++;
    const outName = (id || label).replace(/[^\w\-\.]/g, '_') + '_' + idx + '.patch.candidate';
    const outPath = path.join(OUT_DIR, outName);
    fs.writeFileSync(outPath, c.candidate, 'utf8');
    console.log('Candidate written', outPath, '->', c.rel);
    candidates.push({ entryId: id, file: c.rel, path: outPath });
  }
}

console.log('Generació completada. Revisi els fitxers a', OUT_DIR);

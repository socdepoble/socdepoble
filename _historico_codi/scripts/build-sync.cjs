// _scripts/build-sync.js
// Bundler artesanal de Sóc de Poble (Node.js Vanilla)
// Concatena tots els scripts de sincronització en un únic fitxer sense necessitat de Webpack o Rollup.

const fs = require('fs');
const path = require('path');

const SCRIPTS_DIR = __dirname;
const OUTPUT_FILE = path.join(SCRIPTS_DIR, 'socdepoble-sync.bundle.js');

// Ordre the dependències
const FILES_TO_BUNDLE = [
  'binary-serializer.js',
  'vector-clock-crdt.js',
  'delta-vector-crdt.js',
  'lz77-dict-compressor.js',
  'lz4.js',
  'crc32.js',
  'base64url.js',
  'base32-dns.js',
  'socdepoble-sync.js',
  'webrtc-peer.js'
];

function build() {
  console.log('🌾 Iniciant la trilla (Bundler Artesanal)...');
  
  let bundleContent = '/**\n * Sóc de Poble - Sync Engine Bundle (V2.0)\n * Arquitectura Pedra Seca - Zero Dependències\n */\n\n';
  bundleContent += '(function(window) {\n"use strict";\n\n';

  for (const file of FILES_TO_BUNDLE) {
    const filePath = path.join(SCRIPTS_DIR, file);
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️  Avís: No s'ha trobat el fitxer ${file}, s'ometrà.`);
      continue;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Netejar imports i exports
    content = content.replace(/import\s+.*?;/g, ''); // Elimina línies d'import
    content = content.replace(/export\s+\{.*?\};/g, ''); // Elimina export {}
    content = content.replace(/export\s+class/g, 'class'); // export class -> class
    content = content.replace(/export\s+const/g, 'const'); // export const -> const

    bundleContent += `// --- Inici de ${file} ---\n`;
    bundleContent += content + '\n';
    bundleContent += `// --- Fi de ${file} ---\n\n`;
  }

  // Exposar la Super-Skill i WebRTC al món (window)
  bundleContent += `
  // Exposar al scope global
  window.SocDepobleSync = SocDepobleSync;
  window.WebRTCPeer = WebRTCPeer;
  
})(typeof window !== "undefined" ? window : globalThis);
`;

  fs.writeFileSync(OUTPUT_FILE, bundleContent, 'utf8');
  console.log(`✅ Trilla completada! El farcell està llest: ${OUTPUT_FILE} (${(bundleContent.length / 1024).toFixed(2)} KB)`);
}

build();

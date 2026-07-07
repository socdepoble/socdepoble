import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, '../../');
const PACKAGE_JSON_PATH = path.join(ROOT_DIR, 'package.json');
const CONSTANTS_PATH = path.join(ROOT_DIR, 'src/constants/index.js');
const PUBLIC_VERSION_PATH = path.join(ROOT_DIR, 'public/version.json');
const README_PATH = path.join(ROOT_DIR, 'README.md');

// 1. Read Master Version from package.json
const pkgData = JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, 'utf-8'));
const masterVersion = pkgData.version; // e.g., "10.38.26"

console.log(`[Version Sync] 🚀 Sincronitzant versió mestra: ${masterVersion}`);

// 2. Update src/constants/index.js
let constantsData = fs.readFileSync(CONSTANTS_PATH, 'utf-8');
constantsData = constantsData.replace(
  /export const APP_VERSION = ".*?";/g,
  `export const APP_VERSION = "V${masterVersion}";`
);
fs.writeFileSync(CONSTANTS_PATH, constantsData);
console.log(`[Version Sync] ✅ src/constants/index.js actualitzat a V${masterVersion}`);

// 3. Update public/version.json
const publicVersionData = {
  version: `v${masterVersion}-CANÒNIC`
};
fs.writeFileSync(PUBLIC_VERSION_PATH, JSON.stringify(publicVersionData, null, 4) + '\n');
console.log(`[Version Sync] ✅ public/version.json actualitzat a v${masterVersion}`);

// 4. Update README.md badge
let readmeData = fs.readFileSync(README_PATH, 'utf-8');
readmeData = readmeData.replace(
  /\[!\[Versió\]\(https:\/\/img\.shields\.io\/badge\/versió-.*?--BATEGA-orange\)\]/g,
  `[![Versió](https://img.shields.io/badge/versió-${masterVersion}--BATEGA-orange)]`
);
fs.writeFileSync(README_PATH, readmeData);
console.log(`[Version Sync] ✅ README.md actualitzat amb la versió ${masterVersion}`);

console.log(`[Version Sync] 🎉 Tots els fantasmes de versions han sigut exorcitzats. La Font de la Veritat és package.json!`);

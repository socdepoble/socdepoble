#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const vm = require('vm');

function nowTs() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function deepMerge(target, source, report, pathPrefix = '') {
  for (const key of Object.keys(source)) {
    const fullKey = pathPrefix ? `${pathPrefix}.${key}` : key;
    const srcVal = source[key];
    if (!(key in target)) {
      target[key] = deepClone(srcVal);
      report.added.push(fullKey);
    } else {
      const tgtVal = target[key];
      if (isPlainObject(tgtVal) && isPlainObject(srcVal)) {
        deepMerge(tgtVal, srcVal, report, fullKey);
      } else {
        try {
          const same = JSON.stringify(tgtVal) === JSON.stringify(srcVal);
          if (!same) {
            report.overwritten.push({ key: fullKey, before: tgtVal, after: srcVal });
            target[key] = deepClone(srcVal);
          }
        } catch (e) {
          report.overwritten.push({ key: fullKey, before: tgtVal, after: srcVal });
          target[key] = deepClone(srcVal);
        }
      }
    }
  }
  return target;
}

function isPlainObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v);
}

function safeRequire(filePath) {
  const abs = path.resolve(filePath);
  try {
    delete require.cache[require.resolve(abs)];
    return require(abs);
  } catch (e) {
    const src = fs.readFileSync(abs, 'utf8');
    const transformed = src.replace(/export\s+default\s+/, 'module.exports = ');
    const sandbox = { module: { exports: {} }, exports: {}, require, __dirname: path.dirname(abs), __filename: abs, process };
    try {
      vm.runInNewContext(transformed, sandbox, { filename: abs, timeout: 2000 });
      return sandbox.module.exports;
    } catch (err) {
      throw new Error(`Failed to load ${filePath}: ${err.message}`);
    }
  }
}

function writeConfigAsCommonJS(filePath, configObj) {
  const header = `/** @type {import('tailwindcss').Config} */\nexport default `;
  const content = header + JSON.stringify(configObj, null, 2) + ';\n';
  fs.writeFileSync(filePath, content, 'utf8');
}

function attemptTextualMerge(originalText, extendObj) {
  const block = '\n/* --- tailwind-theme-extend injected (manual review recommended) --- */\n';
  const snippet = '/* Add the following to your tailwind.config.js theme.extend (review before committing):\n\n' +
    JSON.stringify(extendObj, null, 2) +
    '\n*/\n';
  return originalText + block + snippet;
}

(async function main() {
  try {
    const args = process.argv.slice(2);
    const configPath = path.resolve(args[0] || './tailwind.config.js');
    const extendPath = path.resolve(args[1] || './tailwind-theme-extend.js');

    if (!fs.existsSync(configPath)) {
      console.error('tailwind.config.js not found at', configPath);
      process.exit(2);
    }
    if (!fs.existsSync(extendPath)) {
      console.error('tailwind-theme-extend.js not found at', extendPath);
      process.exit(2);
    }

    const extendModule = safeRequire(extendPath);
    const extendBlock = (extendModule && extendModule.extend) ? extendModule.extend : (extendModule || {});
    if (!isPlainObject(extendBlock)) {
      console.error('Unexpected shape in tailwind-theme-extend.js. Expected module.exports = { extend: { ... } }');
      process.exit(3);
    }

    let configObj;
    let loadedViaRequire = true;
    try {
      configObj = safeRequire(configPath);
      if (!isPlainObject(configObj)) {
        if (typeof configObj === 'function') {
          try {
            configObj = configObj({});
            loadedViaRequire = true;
          } catch (e) {
            loadedViaRequire = false;
            configObj = null;
          }
        } else {
          loadedViaRequire = false;
          configObj = null;
        }
      }
    } catch (e) {
      loadedViaRequire = false;
      configObj = null;
    }

    const report = { timestamp: new Date().toISOString(), configPath, extendPath, added: [], overwritten: [], backup: null, merged: false };

    const bakPath = configPath + `.bak.${nowTs()}`;
    fs.copyFileSync(configPath, bakPath);
    report.backup = bakPath;
    console.log('Backup created at', bakPath);

    if (loadedViaRequire && isPlainObject(configObj)) {
      console.log('configObj keys:', Object.keys(configObj));
      console.log('configObj.default keys:', configObj.default ? Object.keys(configObj.default) : 'no default');
      if (configObj.default) configObj = configObj.default;
      
      if (!configObj.theme) configObj.theme = {};
      if (!configObj.theme.extend) configObj.theme.extend = {};

      deepMerge(configObj.theme.extend, extendBlock, report, 'theme.extend');

      writeConfigAsCommonJS(configPath, configObj);
      report.merged = true;
      console.log('Merged theme.extend into tailwind.config.js');
    } else {
      console.warn('Could not safely require tailwind.config.js; performing textual injection for manual review.');
      const originalText = fs.readFileSync(configPath, 'utf8');
      const newText = attemptTextualMerge(originalText, extendBlock);
      fs.writeFileSync(configPath, newText, 'utf8');
      report.merged = false;
    }

    const reportPath = path.resolve(process.cwd(), 'merge-tailwind-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');
    
    console.log('Summary:');
    console.log('- Added keys:', report.added.length);
    console.log('- Overwritten keys:', report.overwritten.length);

    process.exit(0);
  } catch (err) {
    console.error('Fatal error:', err && err.message ? err.message : err);
    process.exit(1);
  }
})();

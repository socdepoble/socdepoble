const fs = require('fs');
const path = require('path');

module.exports = function(fileInfo, api, options) {
  const j = api.jscodeshift;
  const root = j(fileInfo.source);

  const arbitraryVarRegex = /([a-zA-Z0-9-]+)-\[\s*var\(--([a-zA-Z0-9-_]+)\)\s*\]/g;

  if (!global.__TAILWIND_CODMOD_REPORT) {
    global.__TAILWIND_CODMOD_REPORT = { files: {}, totalReplacements: 0 };
  }
  const report = global.__TAILWIND_CODMOD_REPORT;

  function replaceArbitraryVarsInString(str) {
    let changed = false;
    const replacements = [];
    const newStr = str.replace(arbitraryVarRegex, (match, prefix, varName) => {
      changed = true;
      const safeName = `sdp-${varName.replace(/[^a-z0-9-_]/gi, '-')}`;
      const replacement = `${prefix}-${safeName}`;
      replacements.push({ from: match, to: replacement });
      return replacement;
    });
    return { changed, newStr, replacements };
  }

  function processJSXAttribute(attrPath) {
    const attrName = attrPath.node.name && attrPath.node.name.name;
    if (!attrName) return;

    if (attrName !== 'className' && attrName !== 'class') return;

    const value = attrPath.node.value;
    if (!value) return;

    if (value.type === 'Literal' || value.type === 'StringLiteral') {
      const original = value.value;
      const { changed, newStr, replacements } = replaceArbitraryVarsInString(String(original));
      if (changed) {
        attrPath.get('value').replace(j.stringLiteral(newStr));
        recordReplacement(fileInfo.path, original, newStr, replacements);
      }
    }

    if (value.type === 'JSXExpressionContainer') {
      const expr = value.expression;
      if (expr && expr.type === 'TemplateLiteral') {
        let anyChange = false;
        const newQuasis = expr.quasis.map(q => {
          const raw = q.value.raw;
          const { changed, newStr, replacements } = replaceArbitraryVarsInString(raw);
          if (changed) {
            anyChange = true;
            recordReplacement(fileInfo.path, raw, newStr, replacements);
            return j.templateElement({ raw: newStr, cooked: newStr }, q.tail);
          }
          return q;
        });
        if (anyChange) {
          const newTemplate = j.templateLiteral(newQuasis, expr.expressions);
          attrPath.get('value').replace(j.jsxExpressionContainer(newTemplate));
        }
      }

      if (expr && (expr.type === 'Literal' || expr.type === 'StringLiteral')) {
        const original = expr.value;
        const { changed, newStr, replacements } = replaceArbitraryVarsInString(String(original));
        if (changed) {
          attrPath.get('value').replace(j.stringLiteral(newStr));
          recordReplacement(fileInfo.path, original, newStr, replacements);
        }
      }
    }
  }

  function processClassnamesCall(callPath) {
    const callee = callPath.node.callee;
    let calleeName = null;
    if (callee.type === 'Identifier') calleeName = callee.name;
    else if (callee.type === 'MemberExpression' && callee.property && callee.property.type === 'Identifier') calleeName = callee.property.name;

    if (!calleeName) return;
    const allowed = new Set(['clsx', 'classNames', 'classNamesBind', 'cx', 'classnames']);
    if (!allowed.has(calleeName)) return;

    callPath.get('arguments').forEach((argPath) => {
      const arg = argPath.node;
      if (arg && (arg.type === 'Literal' || arg.type === 'StringLiteral')) {
        const original = arg.value;
        const { changed, newStr, replacements } = replaceArbitraryVarsInString(String(original));
        if (changed) {
          argPath.replace(j.literal(newStr));
          recordReplacement(fileInfo.path, original, newStr, replacements);
        }
      }
      if (arg && arg.type === 'TemplateLiteral') {
        let anyChange = false;
        const newQuasis = arg.quasis.map(q => {
          const raw = q.value.raw;
          const { changed, newStr, replacements } = replaceArbitraryVarsInString(raw);
          if (changed) {
            anyChange = true;
            recordReplacement(fileInfo.path, raw, newStr, replacements);
            return j.templateElement({ raw: newStr, cooked: newStr }, q.tail);
          }
          return q;
        });
        if (anyChange) {
          const newTemplate = j.templateLiteral(newQuasis, arg.expressions);
          argPath.replace(newTemplate);
        }
      }
    });
  }

  function recordReplacement(filePath, from, to, replacements) {
    if (!report.files[filePath]) report.files[filePath] = [];
    report.files[filePath].push({ from, to, replacements });
    report.totalReplacements += replacements.length || 1;
  }

  root.find(j.JSXAttribute).forEach(path => {
    try { processJSXAttribute(path); } catch (e) {}
  });

  root.find(j.CallExpression).forEach(path => {
    try { processClassnamesCall(path); } catch (e) {}
  });

  root.find(j.VariableDeclarator).forEach(path => {
    const init = path.node.init;
    if (!init) return;
    if (init.type === 'Literal' || init.type === 'StringLiteral') {
      const original = init.value;
      const { changed, newStr, replacements } = replaceArbitraryVarsInString(String(original));
      if (changed) {
        path.get('init').replace(j.literal(newStr));
        recordReplacement(fileInfo.path, original, newStr, replacements);
      }
    }
    if (init.type === 'TemplateLiteral') {
      let anyChange = false;
      const newQuasis = init.quasis.map(q => {
        const raw = q.value.raw;
        const { changed, newStr, replacements } = replaceArbitraryVarsInString(raw);
        if (changed) {
          anyChange = true;
          recordReplacement(fileInfo.path, raw, newStr, replacements);
          return j.templateElement({ raw: newStr, cooked: newStr }, q.tail);
        }
        return q;
      });
      if (anyChange) {
        const newTemplate = j.templateLiteral(newQuasis, init.expressions);
        path.get('init').replace(newTemplate);
      }
    }
  });

  const out = root.toSource({ quote: 'single' });

  if (!global.__TAILWIND_REPORT_HOOKED) {
    global.__TAILWIND_REPORT_HOOKED = true;
    process.on('exit', () => {
      try {
        const outPath = path.resolve(process.cwd(), 'codemod-tailwind-report.json');
        fs.writeFileSync(outPath, JSON.stringify(global.__TAILWIND_CODMOD_REPORT, null, 2), 'utf8');
        const summary = {
          totalFiles: Object.keys(global.__TAILWIND_CODMOD_REPORT.files).length,
          totalReplacements: global.__TAILWIND_CODMOD_REPORT.totalReplacements
        };
        console.log('\n[tailwind-codemod] report written to', outPath);
        console.log('[tailwind-codemod] summary:', JSON.stringify(summary));
      } catch (e) {
        console.error('Failed to write codemod report:', e && e.message);
      }
    });
  }

  return out;
};

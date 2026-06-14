#!/usr/bin/env node

/**
 * auditoria-immunologica.js
 *
 * Lleis auditades:
 * 1. DOM depth > 7
 * 2. group-hover en className
 * 3. key={index} dins de .map()
 *
 * Execució:
 * node scripts/auditoria-immunologica.js
 */

const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const t = require('@babel/types');

const ROOT_DIR = process.argv[2] || path.resolve(process.cwd(), 'src');

const VALID_EXTENSIONS = new Set([
  '.js',
  '.jsx',
  '.ts',
  '.tsx'
]);

const violations = [];

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (
      entry.isDirectory() &&
      ![
        'node_modules',
        '.git',
        'dist',
        'build',
        '.next',
        'coverage'
      ].includes(entry.name)
    ) {
      walk(fullPath);
      continue;
    }

    if (
      entry.isFile() &&
      VALID_EXTENSIONS.has(path.extname(entry.name))
    ) {
      auditFile(fullPath);
    }
  }
}

function report(file, node, rule, details) {
  violations.push({
    file,
    line: node?.loc?.start?.line ?? '?',
    column: node?.loc?.start?.column ?? '?',
    rule,
    details
  });
}

function getJSXDepth(node, depth = 1) {
  if (!t.isJSXElement(node)) {
    return depth;
  }

  let maxDepth = depth;

  for (const child of node.children) {
    if (t.isJSXElement(child)) {
      const childDepth = getJSXDepth(
        child,
        depth + 1
      );

      if (childDepth > maxDepth) {
        maxDepth = childDepth;
      }
    }
  }

  return maxDepth;
}

function isIndexIdentifier(node) {
  return (
    t.isIdentifier(node, {
      name: 'index'
    })
  );
}

function findMapAncestor(path) {
  return path.findParent((parent) => {
    if (!parent.isCallExpression()) {
      return false;
    }

    const callee = parent.node.callee;

    return (
      t.isMemberExpression(callee) &&
      t.isIdentifier(callee.property, {
        name: 'map'
      })
    );
  });
}

function auditFile(filePath) {
  const code = fs.readFileSync(
    filePath,
    'utf8'
  );

  let ast;

  try {
    ast = parser.parse(code, {
      sourceType: 'unambiguous',
      plugins: [
        'jsx',
        'typescript',
        'classProperties',
        'classPrivateProperties',
        'classPrivateMethods',
        'optionalChaining',
        'nullishCoalescingOperator',
        'dynamicImport'
      ]
    });
  } catch (error) {
    report(
      filePath,
      { loc: { start: { line: 1, column: 1 } } },
      'PARSE_ERROR',
      error.message
    );
    return;
  }

  traverse(ast, {
    JSXElement(path) {
      const depth = getJSXDepth(path.node);

      if (depth > 7) {
        report(
          filePath,
          path.node,
          'DOM_DEPTH',
          `DOM depth ${depth} (> 7)`
        );
      }
    },

    JSXAttribute(path) {
      const attrName =
        path.node.name?.name;

      /**
       * group-hover
       */
      if (
        attrName === 'className' &&
        t.isStringLiteral(path.node.value)
      ) {
        const value =
          path.node.value.value;

        if (
          value.includes('group-hover:')
        ) {
          report(
            filePath,
            path.node,
            'GROUP_HOVER',
            'Ús de group-hover detectat'
          );
        }
      }

      /**
       * className={`... group-hover:...`}
       */
      if (
        attrName === 'className' &&
        t.isJSXExpressionContainer(
          path.node.value
        )
      ) {
        const expr =
          path.node.value.expression;

        if (
          t.isTemplateLiteral(expr)
        ) {
          const text =
            expr.quasis
              .map((q) => q.value.raw)
              .join('');

          if (
            text.includes(
              'group-hover:'
            )
          ) {
            report(
              filePath,
              path.node,
              'GROUP_HOVER',
              'Ús de group-hover detectat'
            );
          }
        }
      }

      /**
       * key={index}
       */
      if (
        attrName === 'key' &&
        t.isJSXExpressionContainer(
          path.node.value
        )
      ) {
        const expr =
          path.node.value.expression;

        if (
          isIndexIdentifier(expr)
        ) {
          const mapParent =
            findMapAncestor(path);

          if (mapParent) {
            report(
              filePath,
              path.node,
              'KEY_INDEX',
              'key={index} detectat dins d\'un .map()'
            );
          }
        }
      }
    }
  });
}

walk(ROOT_DIR);

if (violations.length > 0) {
  console.error(
    '\n🚨 AUDITORIA IMMUNOLÒGICA FALLIDA\n'
  );

  for (const v of violations) {
    console.error(
      [
        `❌ ${v.rule}`,
        `Fitxer: ${v.file}`,
        `Línia: ${v.line}:${v.column}`,
        `Detall: ${v.details}`
      ].join('\n')
    );

    console.error('');
  }

  console.error(
    `Total infraccions: ${violations.length}\n`
  );

  process.exit(1);
}

console.log(
  '✅ Auditoria immunològica superada. Cap infecció detectada.'
);

process.exit(0);

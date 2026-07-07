import { readFile, readdir } from 'node:fs/promises';
import { extname, join, relative } from 'node:path';

const SCAN_EXT = new Set(['.html']);
const SKIP = new Set(['node_modules', '.git', 'vendor', '_build', '04_ARXIU_Documents_Historics']);

// RegExp simplistes (per a un analitzador més robust caldria un parsejador HTML)
const HTML_TAG = /<html[^>]*>/gi;
const LANG_CA = /lang=["']ca["']/i;
const H1_TAG = /<h1[^>]*>/gi;
const IMG_TAG = /<img[^>]*>/gi;
const ALT_ATTR = /alt=["']([^"']*)["']/i;
const BUTTON_TAG = /<button[^>]*>([^<]*)<\/button>/gi;
const ARIA_LABEL = /aria-label=["'][^"']+["']/i;

async function walk(dir, out = []) {
  for (const ent of await readdir(dir, { withFileTypes: true }).catch(() => [])) {
    if (SKIP.has(ent.name) || ent.name.startsWith('.')) continue;
    const full = join(dir, ent.name);
    if (ent.isDirectory()) await walk(full, out);
    else if (SCAN_EXT.has(extname(ent.name))) out.push(full);
  }
  return out;
}

function lineOf(text, idx) {
  return text.slice(0, idx).split(/\r?\n/).length;
}

function scanA11ySeo(text, file) {
  const findings = [];

  // Revisar HTML lang="ca"
  let htmlMatch;
  while ((htmlMatch = HTML_TAG.exec(text)) !== null) {
    if (!LANG_CA.test(htmlMatch[0])) {
      findings.push({
        severity: 'critical',
        rule: 'html-lang-ca',
        file,
        line: lineOf(text, htmlMatch.index),
        message: 'L\'etiqueta <html> no té lang="ca".'
      });
    }
  }

  // Revisar múltiples H1
  const h1Matches = [...text.matchAll(H1_TAG)];
  if (h1Matches.length > 1) {
    findings.push({
      severity: 'warning',
      rule: 'multiple-h1',
      file,
      line: lineOf(text, h1Matches[1].index),
      message: `S'han trobat ${h1Matches.length} etiquetes <h1>. Només n'hi hauria d'haver una.`
    });
  } else if (h1Matches.length === 0 && text.includes('<body')) {
    findings.push({
      severity: 'warning',
      rule: 'missing-h1',
      file,
      line: 1,
      message: 'No s\'ha trobat cap etiqueta <h1>.'
    });
  }

  // Revisar imatges sense alt
  for (const m of text.matchAll(IMG_TAG)) {
    const altMatch = ALT_ATTR.exec(m[0]);
    if (!altMatch || altMatch[1].trim() === '') {
      // Ignorar si té aria-hidden="true" o role="presentation"
      if (!/aria-hidden=["']true["']/i.test(m[0]) && !/role=["']presentation["']/i.test(m[0])) {
        findings.push({
          severity: 'critical',
          rule: 'img-missing-alt',
          file,
          line: lineOf(text, m.index),
          message: 'Imatge sense atribut alt descriptiu.'
        });
      }
    }
  }

  // Revisar botons buits sense aria-label
  for (const m of text.matchAll(BUTTON_TAG)) {
    const buttonContent = m[1].trim();
    if (buttonContent === '' && !ARIA_LABEL.test(m[0])) {
      findings.push({
        severity: 'critical',
        rule: 'button-missing-name',
        file,
        line: lineOf(text, m.index),
        message: 'Botó sense text i sense aria-label.'
      });
    }
  }

  return findings;
}

export async function run(options = {}) {
  const root = options.root || '.';
  const files = await walk(root);
  const findings = [];

  for (const abs of files) {
    const rel = relative(root, abs);
    const text = await readFile(abs, 'utf8').catch(() => '');
    findings.push(...scanA11ySeo(text, rel));
  }

  const critical = findings.filter(f => f.severity === 'critical').length;
  const warning = findings.filter(f => f.severity === 'warning').length;

  return {
    ok: critical === 0,
    summary: `A11y & SEO: ${files.length} fitxers, ${critical} critics, ${warning} avisos.`,
    data: { filesScanned: files.length, findings, summary: { critical, warning } }
  };
}

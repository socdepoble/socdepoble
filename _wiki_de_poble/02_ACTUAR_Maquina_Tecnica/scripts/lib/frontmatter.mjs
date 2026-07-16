/**
 * frontmatter.mjs — únic parser/serialitzador YAML lleuger de la Wiki.
 *
 * No pretén implementar YAML complet. Sí que cobreix, de manera explícita i
 * comprovable, el subconjunt que admet el frontmatter canònic:
 *   - escalars (citats o simples),
 *   - llistes en bloc i inline,
 *   - blocs de text `|` / `>`,
 *   - frontmatter buit (`---\n---`), BOM i salts CRLF.
 *
 * Els errors no es dissimulen: es retornen en `errors` perquè una auditoria no
 * puga confondre "no he pogut parsejar" amb "tot està perfecte".
 */

const OPEN_RE = /^(?:\uFEFF)?---[ \t]*(?:\r?\n|$)/;
const CLOSE_RE = /^(?:---|\.\.\.)[ \t]*(?:\r?\n|$)/m;

export function splitFrontmatter(raw = '') {
  const open = OPEN_RE.exec(raw);
  if (!open) {
    return {
      hasFrontmatter: false,
      malformed: false,
      rawFrontmatter: '',
      body: raw,
      newline: raw.includes('\r\n') ? '\r\n' : '\n',
    };
  }

  const rest = raw.slice(open[0].length);
  const close = CLOSE_RE.exec(rest);
  if (!close) {
    return {
      hasFrontmatter: false,
      malformed: true,
      rawFrontmatter: rest,
      body: raw,
      newline: raw.includes('\r\n') ? '\r\n' : '\n',
    };
  }

  return {
    hasFrontmatter: true,
    malformed: false,
    rawFrontmatter: rest.slice(0, close.index),
    body: rest.slice(close.index + close[0].length),
    newline: open[0].includes('\r\n') ? '\r\n' : '\n',
  };
}

function stripYamlComment(value) {
  // En YAML una cometa només obri un escalar citat si és el primer caràcter
  // significatiu. L'apòstrof de `L'avi` no pot convertir la resta de la línia
  // en una falsa cadena i ocultar així un comentari real.
  let single = false;
  let double = false;
  let escaped = false;
  let tokenStart = true;
  for (let i = 0; i < value.length; i++) {
    const char = value[i];
    if (double && char === '\\' && !escaped) {
      escaped = true;
      continue;
    }
    if (double) {
      if (char === '"' && !escaped) double = false;
      escaped = false;
      continue;
    }
    if (single && char === "'") {
      // Dins d'una cadena YAML amb cometa simple, '' representa un apòstrof.
      if (value[i + 1] === "'") i++;
      else single = false;
      continue;
    }
    if (single) continue;
    if (char === '#' && (i === 0 || /\s/.test(value[i - 1]))) {
      return value.slice(0, i).trimEnd();
    }
    if (tokenStart && (char === '"' || char === "'")) {
      double = char === '"';
      single = char === "'";
      tokenStart = false;
    } else if (char === '[' || char === ',') {
      tokenStart = true;
    } else if (!/\s/.test(char)) {
      tokenStart = false;
    }
  }
  return value;
}

function splitInlineList(inner) {
  const values = [];
  let buffer = '';
  let single = false;
  let double = false;
  let escaped = false;

  for (let i = 0; i < inner.length; i++) {
    const char = inner[i];
    if (double && char === '\\' && !escaped) {
      escaped = true;
      buffer += char;
      continue;
    }
    // Igual que en un escalar: només la cometa inicial de l'element obri mode
    // citat. Açò manté separable `[L'avi, Pep]`.
    if (char === '"' && !single && !escaped && (double || buffer.trim() === '')) double = !double;
    if (char === "'" && !double && (single || buffer.trim() === '')) {
      if (single && inner[i + 1] === "'") {
        buffer += "''";
        i++;
        continue;
      }
      single = !single;
    }
    if (char === ',' && !single && !double) {
      values.push(buffer.trim());
      buffer = '';
    } else {
      buffer += char;
    }
    escaped = false;
  }
  if (buffer.trim() || inner.trim()) values.push(buffer.trim());
  return values;
}

function parseScalar(rawValue, errors, context) {
  const rawTrimmed = rawValue.trim();
  const value = stripYamlComment(rawTrimmed);
  const quotedOrCollection = /^["'\[]/.test(value);
  if (!quotedOrCollection && (
    /:\s|:$/.test(value)
    || /^[*&!|>@`{},\[\]]/.test(value)
  )) {
    errors.push(`${context}: escalar pla ambigu o invàlid; cal citar-lo`);
  }
  if (value === '' || value === 'null' || value === '~') return '';

  if (value.startsWith('[')) {
    if (!value.endsWith(']')) {
      errors.push(`${context}: llista inline no tancada`);
      return value;
    }
    return splitInlineList(value.slice(1, -1))
      .map((item, index) => parseScalar(item, errors, `${context}[${index}]`))
      .filter((item) => item !== '');
  }

  if (value.startsWith('"')) {
    if (!value.endsWith('"') || value.length === 1) {
      errors.push(`${context}: cometa doble no tancada`);
      return value.slice(1);
    }
    try {
      return JSON.parse(value);
    } catch {
      errors.push(`${context}: cadena amb cometes dobles invàlida`);
      return value.slice(1, -1);
    }
  }

  if (value.startsWith("'")) {
    if (!value.endsWith("'") || value.length === 1) {
      errors.push(`${context}: cometa simple no tancada`);
      return value.slice(1);
    }
    const inner = value.slice(1, -1);
    if (/\\'/.test(inner)) {
      errors.push(`${context}: YAML no admet \\' com a escapament dins de cometes simples`);
    }
    return inner.replace(/''/g, "'").replace(/\\'/g, "'");
  }

  return value;
}

function deindent(lines) {
  const nonEmpty = lines.filter((line) => line.trim());
  const indent = nonEmpty.length
    ? Math.min(...nonEmpty.map((line) => (line.match(/^\s*/) || [''])[0].length))
    : 0;
  return lines.map((line) => line.slice(Math.min(indent, line.length)));
}

export function parseYamlLite(yamlText = '') {
  const lines = yamlText.split(/\r?\n/);
  const data = {};
  const errors = [];
  const duplicateKeys = [];

  for (let i = 0; i < lines.length;) {
    const line = lines[i];
    if (!line.trim() || /^\s*#/.test(line)) {
      i++;
      continue;
    }

    const keyMatch = /^([A-Za-z0-9_.-]+):(?:[ \t]*(.*))?$/.exec(line);
    if (!keyMatch) {
      errors.push(`línia ${i + 1}: només s'admeten claus YAML de primer nivell`);
      i++;
      continue;
    }

    const key = keyMatch[1];
    const inline = keyMatch[2] ?? '';
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      duplicateKeys.push(key);
      errors.push(`línia ${i + 1}: clau duplicada: ${key}`);
    }

    let j = i + 1;
    while (j < lines.length && !/^[A-Za-z0-9_.-]+:/.test(lines[j])) j++;
    const continuation = lines.slice(i + 1, j);

    if (/^(?:\||>|\|-|>-|\|\+|>\+)$/.test(inline.trim())) {
      const blockLines = deindent(continuation);
      data[key] = inline.trim().startsWith('>')
        ? blockLines.join(' ').replace(/\s+/g, ' ').trim()
        : blockLines.join('\n').replace(/\n+$/, '');
    } else if (inline.trim() === '') {
      const items = continuation
        .filter((candidate) => candidate.trim() && !/^\s*#/.test(candidate))
        .map((candidate, index) => {
          const item = /^\s*-\s*(.*)$/.exec(candidate);
          if (!item) {
            errors.push(`${key}, línia ${i + index + 2}: element de llista invàlid`);
            return '';
          }
          return parseScalar(item[1], errors, key);
        })
        .filter((item) => item !== '');
      data[key] = items.length ? items : '';
    } else {
      if (continuation.some((candidate) => candidate.trim() && !/^\s*#/.test(candidate))) {
        errors.push(`${key}: continuació indentada inesperada`);
      }
      data[key] = parseScalar(inline, errors, key);
    }

    i = j;
  }

  return { data, errors, duplicateKeys: [...new Set(duplicateKeys)] };
}

/**
 * Separa i parseja un document Markdown.
 * Compatibilitat: manté `{ data, body, hasFrontmatter }` per als scripts antics.
 */
export function parseFrontmatter(raw = '') {
  const split = splitFrontmatter(raw);
  if (!split.hasFrontmatter) {
    return {
      data: {},
      body: split.body,
      hasFrontmatter: false,
      malformed: split.malformed,
      errors: split.malformed ? ['frontmatter obert però no tancat'] : [],
      duplicateKeys: [],
      rawFrontmatter: split.rawFrontmatter,
      newline: split.newline,
    };
  }
  const parsed = parseYamlLite(split.rawFrontmatter);
  return { ...split, ...parsed };
}

export function quoteYaml(value) {
  return JSON.stringify(String(value));
}

/** Serialitza només les claus rebudes, en l'ordre indicat, amb YAML segur. */
export function serializeFrontmatter(data, order = Object.keys(data)) {
  const lines = ['---'];
  for (const key of order) {
    const value = data[key];
    if (value === undefined || value === null || value === '') continue;
    if (Array.isArray(value)) {
      if (value.length === 0) continue;
      lines.push(`${key}:`);
      for (const item of value) lines.push(`  - ${quoteYaml(item)}`);
    } else {
      lines.push(`${key}: ${quoteYaml(value)}`);
    }
  }
  lines.push('---');
  return `${lines.join('\n')}\n`;
}

export function hasFrontmatter(raw = '') {
  return splitFrontmatter(raw).hasFrontmatter;
}

export function missingFields(data, required) {
  return required.filter((field) => {
    const value = data[field];
    return value === undefined || value === '' || (Array.isArray(value) && value.length === 0);
  });
}

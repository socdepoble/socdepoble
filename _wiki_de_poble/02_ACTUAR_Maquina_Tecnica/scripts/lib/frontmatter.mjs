// lib/frontmatter.mjs — Parser de frontmatter YAML pur regex. Zero dependències.
// Trellat: no importem js-yaml. Cobreix escalars, strings citats i llistes planes,
// que és el 100% del que fa servir la Wiki de Sóc de Poble hui.

const FM_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

/**
 * Separa un fitxer .md en { data, body }.
 * @param {string} raw contingut complet del fitxer
 */
export function parseFrontmatter(raw) {
  const m = FM_RE.exec(raw);
  if (!m) return { data: {}, body: raw, hasFrontmatter: false };
  return { data: parseYamlLite(m[1]), body: raw.slice(m[0].length), hasFrontmatter: true };
}

function unquote(s) {
  const t = s.trim();
  if (t.length >= 2) {
    const first = t[0];
    const last = t[t.length - 1];
    if (first === "'" && last === "'") {
      return t.slice(1, -1).replace(/''/g, "'"); // YAML: '' dins de cometes simples = ' literal
    }
    if (first === '"' && last === '"') {
      return t.slice(1, -1);
    }
  }
  return t;
}

/**
 * Parser mínim de YAML pla: clau: valor, clau: (llista a sota), - item.
 * No suporta mapes niats profunds (no cal per a aquesta Wiki).
 */
function parseYamlLite(yamlText) {
  const lines = yamlText.split(/\r?\n/);
  const data = {};
  let curKey = null;

  for (const line of lines) {
    if (!line.trim() || /^\s*#/.test(line)) continue;

    const listItem = /^\s*-\s?(.*)$/.exec(line);
    if (listItem && curKey && Array.isArray(data[curKey])) {
      const val = listItem[1].trim();
      if (val) data[curKey].push(unquote(val));
      continue;
    }

    const kv = /^([A-Za-z0-9_.-]+):\s?(.*)$/.exec(line);
    if (kv) {
      const [, key, rawVal] = kv;
      curKey = key;
      const val = rawVal.trim();
      if (val === '' ) {
        data[key] = []; // possible llista o bloc a les línies següents
      } else if (val === '>-' || val === '|' || val === '>') {
        data[key] = ''; // bloc escalar sense contingut inline (buit deliberat)
      } else {
        data[key] = unquote(val);
      }
    }
  }
  return data;
}

/** Comprovació ràpida sense parsejar tot el bloc. */
export function hasFrontmatter(raw) {
  return FM_RE.test(raw);
}

/** Camps obligatoris que falten, donat un objecte `data` i una llista `required`. */
export function missingFields(data, required) {
  return required.filter((f) => data[f] === undefined || data[f] === '' || (Array.isArray(data[f]) && data[f].length === 0 && f !== 'tags'));
}

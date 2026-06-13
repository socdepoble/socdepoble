import fs from 'fs/promises';
import path from 'path';
import YAML from 'yaml';

export const ACTES_DIR = path.join(process.cwd(), 'actes');

/**
 * Parseja un fitxer Markdown amb frontmatter YAML
 */
export async function parseActa(filePath) {
  const content = await fs.readFile(filePath, 'utf-8');
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  
  if (!match) {
    throw new Error(`Format invàlid a ${filePath}: falta el frontmatter`);
  }
  
  const yamlData = YAML.parse(match[1]);
  const markdownBody = match[2].trim();
  
  return { data: yamlData, body: markdownBody, raw: content };
}

/**
 * Llegeix totes les actes del directori
 */
export async function readAllActes() {
  try {
    const files = await fs.readdir(ACTES_DIR);
    const mdFiles = files.filter(f => f.endsWith('.md'));
    
    const actes = [];
    for (const file of mdFiles) {
      try {
        const acta = await parseActa(path.join(ACTES_DIR, file));
        actes.push({ ...acta, filename: file });
      } catch (err) {
        console.warn(`⚠️  Saltant ${file}: ${err.message}`);
      }
    }
    
    return actes;
  } catch (err) {
    if (err.code === 'ENOENT') {
      await fs.mkdir(ACTES_DIR, { recursive: true });
      return [];
    }
    throw err;
  }
}

/**
 * Genera el contingut complet d'una acta (YAML + Markdown)
 */
export function generateActaContent(acta) {
  const yamlStr = YAML.stringify(acta, {
    indent: 2,
    lineWidth: 0,
    defaultKeyType: 'PLAIN',
    defaultStringType: 'QUOTE_DOUBLE'
  });
  
  const body = generateMarkdownBody(acta);
  
  return `---\n${yamlStr}---\n\n${body}\n`;
}

/**
 * Genera el cos en Markdown agrupant microrecords per tipus
 */
function generateMarkdownBody(acta) {
  const agrupats = acta.microrecords.reduce((acc, mr) => {
    if (!acc[mr.tipus]) acc[mr.tipus] = [];
    acc[mr.tipus].push(mr);
    return acc;
  }, {});
  
  const titols = {
    fet: '## 📌 Fets',
    decisio: '## 🗿 Decisions Preses',
    llico: '## 📚 Lliçons Apreses',
    cicatriu: '## 🩹 Cicatrius',
    tombstone: '## ⚰️ Tombstones',
    idea_descartada: '## 🗑️ Idees Descartades',
    patro: '## 🔁 Patrons Detectats'
  };
  
  let md = `# ${acta.act_id}\n\n`;
  md += `> *${acta.narrativa.metafora_central}*\n\n`;
  
  for (const [tipus, records] of Object.entries(agrupats)) {
    md += `${titols[tipus] || `## ${tipus}`}\n\n`;
    for (const mr of records) {
      md += `### ${mr.titol}\n\n`;
      md += `${mr.descripcio}\n\n`;
      md += `- **Impacte:** ${mr.impacte}/5\n`;
      md += `- **Intensitat emocional:** ${(mr.intensitat_emocional * 100).toFixed(0)}%\n`;
      if (mr.emocions.length > 0) md += `- **Emocions:** ${mr.emocions.join(', ')}\n`;
      if (mr.tags.length > 0) md += `- **Tags:** ${mr.tags.join(', ')}\n`;
      md += '\n';
    }
  }
  
  md += `---\n\n**Lliçó global:** ${acta.narrativa.llico_global}\n`;
  
  return md;
}

/**
 * Guarda l'acta al disc
 */
export async function saveActa(acta) {
  await fs.mkdir(ACTES_DIR, { recursive: true });
  const content = generateActaContent(acta);
  const filePath = path.join(ACTES_DIR, `${acta.act_id}.md`);
  await fs.writeFile(filePath, content, 'utf-8');
  return filePath;
}

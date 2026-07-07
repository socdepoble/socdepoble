import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBrandedPdf } from './generate-pdf.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

async function buildAmazonKDP(inputPath, outputPath, options = {}) {
  console.log('📦 Iniciant construcció per Amazon KDP...');

  try {
    // 1. Llegir la plantilla base
    const templatePath = path.join(__dirname, 'templates', 'amazon_credits_template.md');
    let creditsContent = fs.readFileSync(templatePath, 'utf8');

    // 2. Substituir dades (Placeholder -> Valor real)
    const defaults = {
      BOOK_TITLE: 'Títol del Llibre',
      BOOK_SUBTITLE: 'Subtítol descriptiu del Llibre',
      AUTHOR_NAME: 'Autor Desconegut',
      IMAGE_CREDITS: 'Josep Vicent Cascant, Javi Llinares, Pexels, Pixabay, Unsplash',
      COVER_CREDITS: 'Imatge genèrica',
      PUBLICATION_DATE: new Date().toLocaleDateString('ca-ES', { month: 'long', year: 'numeric' }),
      ISBN_NUMBER: '979-XXXXXXXXXX'
    };

    const data = { ...defaults, ...options };

    for (const [key, value] of Object.entries(data)) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      creditsContent = creditsContent.replace(regex, value);
    }

    // 3. Llegir el contingut principal
    const mainContent = fs.readFileSync(path.resolve(inputPath), 'utf8');

    // 4. Fusionar continguts
    const combinedMarkdown = creditsContent + '\n\n' + mainContent;

    // 5. Crear directori de sortida si no existeix
    const outDir = path.dirname(path.resolve(outputPath));
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }

    // 6. Desar un arxiu temporal amb la fusió
    const tempMdPath = path.join(outDir, `_amazon_temp_${Date.now()}.md`);
    fs.writeFileSync(tempMdPath, combinedMarkdown, 'utf8');

    // 7. Generar el PDF cridant a la nostra eina existent
    console.log('⚙️ Generant PDF amb el motor md-to-pdf...');
    await generateBrandedPdf(tempMdPath, path.resolve(outputPath));

    // 8. Netejar fitxer temporal
    fs.unlinkSync(tempMdPath);
    
    console.log(`🎉 ¡ÉXITO! PDF per a Amazon KDP creat correctament a: ${outputPath}`);

  } catch (err) {
    console.error('❌ Error durant la generació Amazon KDP:', err);
  }
}

// Execució per CLI
if (process.argv[1] === __filename) {
  const input = process.argv[2];
  const output = process.argv[3];
  
  if (!input || !output) {
    console.log("Ús: node scripts/build_amazon_kdp.js <input.md> <output.pdf> [--title='El meu llibre' --author='Javi']");
    process.exit(1);
  }

  // Parsejat d'arguments simples
  const options = {};
  for (let i = 4; i < process.argv.length; i++) {
    const arg = process.argv[i];
    if (arg.startsWith('--')) {
      const [key, value] = arg.slice(2).split('=');
      if (key && value) {
        // Mapejar 'title' a 'BOOK_TITLE' etc (Simplificat)
        const mappedKey = key.toUpperCase().replace('-', '_');
        // Accept names like --book-title="Llibre" => BOOK_TITLE
        options[mappedKey] = value.replace(/['"]/g, ''); 
      }
    }
  }

  buildAmazonKDP(input, output, options);
}

export { buildAmazonKDP };

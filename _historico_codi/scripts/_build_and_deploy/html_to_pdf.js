import { mdToPdf } from 'md-to-pdf';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function convert() {
  const inputPath = path.resolve('Manual_Identitat_Extens.html');
  const outputPath = path.resolve('Manual_Identitat_SOSP.pdf');
  const htmlContent = fs.readFileSync(inputPath, 'utf8');

  await mdToPdf(
    { content: htmlContent },
    { dest: outputPath, pdf_options: { format: 'A4', printBackground: true } }
  );
  console.log('PDF Generated');
}
convert();

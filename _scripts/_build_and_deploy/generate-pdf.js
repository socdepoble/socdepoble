import { mdToPdf } from 'md-to-pdf';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateBrandedPdf(inputPath, outputPath) {
  try {
    const cssPath = path.join(__dirname, 'soc-de-poble-pdf.css');
    const projectRoot = path.resolve(__dirname, '..');
    
    // Llegim les fonts Noto originals que tenim locals al projecte i les injectem com a Base64
    // Això garantix que Puppeteer sempre les trobe i les incruste dins de l'arxiu PDF per a lectors de mòbil rústecs.
    const fontRegularPath = path.join(projectRoot, 'public', 'fonts', 'noto', 'NotoSans-Regular.ttf');
    const fontBoldPath = path.join(projectRoot, 'public', 'fonts', 'noto', 'NotoSans-Bold.ttf');
    const logoPath = path.join(projectRoot, 'public', 'assets', 'master', 'logo_sdp_black.png');
    
    const regularBase64 = fs.readFileSync(fontRegularPath).toString('base64');
    const boldBase64 = fs.readFileSync(fontBoldPath).toString('base64');
    
    let logoBase64 = '';
    try {
      logoBase64 = fs.readFileSync(logoPath).toString('base64');
    } catch {
      console.warn("No s'ha pogut llegir el logo as png a public/assets/master.");
    }
    
    const base64Fonts = `
      @font-face {
        font-family: 'Noto Sans';
        src: url(data:font/ttf;charset=utf-8;base64,${regularBase64}) format('truetype');
        font-weight: 400;
        font-style: normal;
      }
      @font-face {
        font-family: 'Noto Sans';
        src: url(data:font/ttf;charset=utf-8;base64,${boldBase64}) format('truetype');
        font-weight: 700;
        font-style: normal;
      }
    `;
    
    const pdfOptions = {
      format: 'A4',
      margin: {
        top: '30mm',
        right: '25mm',
        bottom: '35mm',
        left: '25mm'
      },
      displayHeaderFooter: true,
      headerTemplate: `
        <div style="width: 100%; text-align: center; padding-top: 8mm; padding-bottom: 8mm; box-sizing: border-box;">
          ${logoBase64 ? `<img src="data:image/png;base64,${logoBase64}" style="height: 30px; opacity: 1;" />` : `<span style="font-family: 'Noto Sans', sans-serif; font-size: 14px; font-weight: bold; color: #111827;">SÓC DE POBLE</span>`}
        </div>`,
      footerTemplate: `
        <div style="width: 100%; font-size: 9px; padding-bottom: 10mm; padding-top: 5mm; padding-left: 25mm; padding-right: 25mm; color: #6b7280; font-family: 'Noto Sans', -apple-system, sans-serif; box-sizing: border-box;">
          <span style="float: left;">© ${new Date().getFullYear()} Sóc de Poble. Generat per la iaia de Sóc de Poble. 🧶</span>
          <span style="float: right;">Pàgina <span class="pageNumber"></span> de <span class="totalPages"></span></span>
        </div>`,
      printBackground: true
    };

    const result = await mdToPdf(
      { path: inputPath },
      { 
        dest: outputPath,
        stylesheet: [cssPath],
        pdf_options: pdfOptions,
        css: `
          ${base64Fonts}
          body { padding-top: 0; padding-bottom: 0; }
          .markdown-body { font-family: 'Noto Sans', -apple-system, sans-serif !important; }
          .markdown-body p { text-align: justify !important; hyphens: auto !important; }
          .markdown-body li { text-align: justify !important; }
        `
      }
    );

    if (result) {
      console.log(`✅ [SÓC DE POBLE] PDF Branded generat amb èxit a: ${outputPath}`);
    }
  } catch (error) {
    console.error('❌ Error generant el PDF:', error);
  }
}

// Suport per cridar-ho des de la CLI
if (process.argv[1] === __filename) {
  const input = process.argv[2];
  const output = process.argv[3];
  
  if (!input || !output) {
    console.log("Ús: node scripts/generate-pdf.js <input.md> <output.pdf>");
    process.exit(1);
  }
  
  generateBrandedPdf(path.resolve(input), path.resolve(output));
}

export { generateBrandedPdf };

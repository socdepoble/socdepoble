// scripts/generate_pdf.js
// Node 18+
import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';

const HTML_FILE = path.resolve('tests/report_d3.html');
const OUT_PDF = path.resolve('tests/report.pdf');

async function main() {
  if (!fs.existsSync(HTML_FILE)) {
    console.error('No s’ha trobat l’HTML:', HTML_FILE);
    process.exit(2);
  }
  // Launch browser
  const browser = await puppeteer.launch({
    args: ['--no-sandbox','--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.goto('file://' + HTML_FILE, {waitUntil: 'networkidle2'});
  // Opcions de PDF pensades per arxiu
  await page.pdf({
    path: OUT_PDF,
    format: 'A4',
    printBackground: true,
    margin: {top: '12mm', bottom: '12mm', left: '12mm', right: '12mm'}
  });
  await browser.close();
  console.log('PDF generat a', OUT_PDF);
}

main().catch(err => {
  console.error('Error generant PDF', err);
  process.exit(1);
});

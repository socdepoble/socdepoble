const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  console.log("Iniciant Puppeteer per a crear el PDF de Sóc de Poble...");
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  const filePath = `file://${path.resolve('Manual_Identitat_Extens.html')}`;
  console.log(`Carregant document HTML: ${filePath}`);
  
  await page.goto(filePath, { waitUntil: 'networkidle0' });

  // Add 100ms delay to ensure layout stability
  await new Promise(r => setTimeout(r, 100));

  const pdfPath = path.resolve('public/docs/Manual_Identitat_Soc_de_Poble.pdf');
  console.log(`Generant PDF a: ${pdfPath}`);
  
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    landscape: false,
    printBackground: true,
    margin: { top: '0', bottom: '0', left: '0', right: '0' },
    preferCSSPageSize: true
  });

  await browser.close();
  console.log("Generació de PDF completada amb èxit.");
})();

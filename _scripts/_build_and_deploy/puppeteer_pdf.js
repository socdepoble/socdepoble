import puppeteer from 'puppeteer';
import * as path from 'path';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  const inputPath = path.resolve('Manual_Identitat_Extens.html');
  const outputPath = path.resolve('Manual_Identitat_SOSP.pdf');
  
  await page.goto(`file://${inputPath}`, { waitUntil: 'networkidle0' });
  
  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  });
  
  await browser.close();
  console.log(`PDF created successfully at: ${outputPath}`);
})();

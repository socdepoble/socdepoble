const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // Set viewport to two A4 pages side by side (210x297mm each -> 420x297mm)
  // roughly 1587x1122 pixels at 96 dpi
  await page.setViewport({ width: 1600, height: 1150, deviceScaleFactor: 2 });
  
  await page.goto('file://' + __dirname + '/Manual_Identitat_Extens.html', { waitUntil: 'networkidle0' });
  
  // Wait a moment for fonts
  await new Promise(r => setTimeout(r, 1000));
  
  // we want to scroll down a bit, maybe to the second page to see a standard header. 
  // Let's capture the top part of the 5th page "L'Àtomo Modular". 
  // Each page is 297mm high plus 20mm margin bottom. Roughly 1200px.
  // We can just capture the element that is the container for Page 4 & 5... or just capture a full screen screenshot starting from an offset.
  
  await page.evaluate(() => {
    window.scrollTo(0, 3600);
  });
  
  await page.screenshot({ path: 'header_preview.jpg', quality: 85 });
  await browser.close();
})();

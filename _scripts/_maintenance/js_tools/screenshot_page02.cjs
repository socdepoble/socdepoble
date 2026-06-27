const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 2480, height: 3508 });
  await page.goto('file://' + process.cwd() + '/Manual_Identitat_Extens.html', { waitUntil: 'networkidle0' });

  // Pàgina 02 té height 3508px
  const yOffset = 3508;
  const height = 3508;

  await page.screenshot({ 
    path: 'version_header_screenshot.jpg', 
    clip: { x: 0, y: yOffset, width: 2480, height: height / 4 } 
  });

  await browser.close();
})();

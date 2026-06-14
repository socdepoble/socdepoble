import puppeteer from 'puppeteer-core';

(async () => {
  const browser = await puppeteer.launch({
    channel: 'chrome',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  const telemetryData = [];
  
  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('[TELEMETRY 🔬]')) {
      console.log(text);
    }
  });

  await page.goto('http://localhost:3333', { waitUntil: 'networkidle2' });
  
  // Try to find a long article
  // Wait for the app to render
  await new Promise(r => setTimeout(r, 2000));
  
  // We don't know the exact URL of the article. Let's try to navigate to /revista or /hemeroteca and click an article.
  // Or just scroll the homepage.
  
  let previousHeight = 0;
  for (let i = 0; i < 20; i++) {
    await page.evaluate('window.scrollBy(0, 800)');
    await new Promise(r => setTimeout(r, 500));
    const newHeight = await page.evaluate('document.body.scrollHeight');
    if (newHeight === previousHeight) break;
    previousHeight = newHeight;
  }
  
  const metrics = await page.metrics();
  console.log('--- FINAL METRICS ---');
  console.log(`JS Heap Size: ${(metrics.JSHeapUsedSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Nodes: ${metrics.Nodes}`);
  
  await browser.close();
})();

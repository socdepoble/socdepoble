// Test Playwright per validar l'Activation Handshake i la Hard Navigation Nuclear
const { test, expect } = require('@playwright/test');
const fetch = require('node-fetch');

test.describe('SW Activation Handshake', () => {
  test('handshake and hard navigation', async ({ browser }) => {
    // Creem context WebKit (emulant iPad)
    const context = await browser.newContext({ userAgent: 'Playwright WebKit', viewport: { width: 1024, height: 768 } });
    const page = await context.newPage();

    // Obrim la pàgina principal
    await page.goto('http://localhost:5174', { waitUntil: 'networkidle' });

    // Verifiquem que el Service Worker està registrat
    const swRegistered = await page.evaluate(() => {
      return navigator.serviceWorker.getRegistration().then(r => !!r);
    });
    expect(swRegistered).toBeTruthy();

    // Simulem un desplegament nou al servidor
    await fetch('http://localhost:5174/invalidate');

    // Esperem que aparega el missatge d'actualització i fem click
    await page.waitForSelector('text=Nova versió disponible', { timeout: 10000 });
    await page.click('text=Actualitzar ara');

    // Esperem la navegació amb el parametre _v
    await page.waitForNavigation({ url: /_v=/, timeout: 15000 });
    const url = page.url();
    expect(url).toMatch(/_v=\d+/);

    // Confirmem que el header X-App-Version del servidor ha augmentat
    const resp = await fetch('http://localhost:5174');
    const header = resp.headers.get('x-app-version');
    expect(Number(header)).toBeGreaterThan(1);

    await context.close();
  });
});

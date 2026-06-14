import { test, expect } from '@playwright/test';

// Configuració: llindar de tolerància (0.00% = pixel perfect)
const PIXELMATCH_THRESHOLD = 0.000; // 0.00%

test.describe('🏗️ Regressió Visual - Marketplace', () => {
  
  test('Targeta UniversalCard centrada en mode single', async ({ page }) => {
    await page.goto('http://localhost:4173/marketplace');
    
    // Esperar que el virtualizer renderitze almenys 1 targeta
    await page.waitForSelector('.universal-card', { timeout: 10000 });
    
    // Verificar que la targeta està centrada
    const card = page.locator('.universal-card').first();
    const cardBox = await card.boundingBox();
    const viewport = page.viewportSize();
    
    // La targeta ha d'estar al centre de la pantalla
    const centerX = viewport.width / 2;
    const cardCenterX = cardBox.x + cardBox.width / 2;
    
    expect(Math.abs(cardCenterX - centerX)).toBeLessThan(5); // Marge de 5px
    
    // Screenshot per a regressió visual
    await expect(page).toHaveScreenshot('marketplace-single.png', {
      fullPage: false,
      maxDiffPixelRatio: PIXELMATCH_THRESHOLD
    });
  });
  
  test('Targetes en mode grid no tenen wrappers innecessaris', async ({ page }) => {
    await page.goto('http://localhost:4173/marketplace?view=grid');
    await page.waitForSelector('.universal-card', { timeout: 10000 });
    
    // Verificar que no hi ha divs buits dins de les targetes
    const emptyDivs = await page.evaluate(() => {
      const cards = document.querySelectorAll('.universal-card');
      let empty = 0;
      cards.forEach(card => {
        const divs = card.querySelectorAll('div');
        divs.forEach(div => {
          // Div sense classes, sense text, sense fills
          if (!div.className && !div.textContent.trim() && div.children.length === 0) {
            empty++;
          }
        });
      });
      return empty;
    });
    
    expect(emptyDivs).toBe(0);
  });
  
  test('La profunditat de l\'arbre no excedix 4 nivells', async ({ page }) => {
    await page.goto('http://localhost:4173/marketplace');
    await page.waitForSelector('.universal-card', { timeout: 10000 });
    
    const maxDepth = await page.evaluate(() => {
      let max = 0;
      document.querySelectorAll('.universal-card').forEach(card => {
        let depth = 0;
        let el = card;
        while (el && el !== document.body) {
          depth++;
          el = el.parentElement;
        }
        max = Math.max(max, depth);
      });
      return max;
    });
    
    expect(maxDepth).toBeLessThanOrEqual(6); // 4 nivells + body + root
  });
});

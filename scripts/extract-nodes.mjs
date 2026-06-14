#!/usr/bin/env node
// Genera nodes.json a partir d'un build headless

import { chromium } from 'playwright';
import { writeFileSync } from 'fs';

async function extractNodes(url = 'http://localhost:4173') {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto(url);
  await page.waitForSelector('.universal-card', { timeout: 10000 });
  
  // Extreure tots els nodes del DOM amb informació rellevant
  const nodes = await page.evaluate(() => {
    const allNodes = [];
    
    function extractNode(el, depth = 0) {
      const node = {
        tag: el.tagName.toLowerCase(),
        depth,
        classes: el.className || '',
        id: el.id || '',
        hasChildren: el.children.length > 0,
        childCount: el.children.length,
        hasText: el.textContent.trim().length > 0,
        hasEvents: el.onclick !== null || el.getAttribute('onclick') !== null,
        hasRef: el.hasAttribute('data-ref') || el.hasAttribute('ref'),
        hasAria: Array.from(el.attributes).some(a => a.name.startsWith('aria-')),
        hasData: Array.from(el.attributes).some(a => a.name.startsWith('data-')),
        isWrapper: el.children.length === 1 && 
                   !el.className && 
                   !el.id && 
                   el.children[0].tagName === el.tagName
      };
      
      allNodes.push(node);
      
      for (const child of el.children) {
        extractNode(child, depth + 1);
      }
    }
    
    extractNode(document.getElementById('root') || document.body);
    return allNodes;
  });
  
  await browser.close();
  
  // Guardar com JSON pla (1D)
  writeFileSync('nodes.json', JSON.stringify(nodes, null, 2));
  console.log(`✅ Extrets ${nodes.length} nodes del DOM.`);
  
  return nodes;
}

extractNodes();

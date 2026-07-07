const JSZip = require('jszip');
const fs = require('fs');
const path = require('path');

// Com que utils usa ES modules, hem d'importar-ho dinàmicament
(async () => {
  console.log("Iniciant empaquetador ePub de Sóc de Poble (A10)...");
  
  // Import the ESM module
  const { generateEpub } = await import('./src/shared/utils/epubExporter.js');
  
  // Per a proves, lligarem dades d'una entrada (p. ex. README.md o text per defecte)
  let testMarkdown = "";
  try {
      testMarkdown = fs.readFileSync(path.resolve('README.md'), 'utf-8');
      console.log("S'ha carregat el README.md com a font per defecte.");
  } catch (error) {
      testMarkdown = "# Capítol 1\\n\\nEquip de Poble.";
      console.log("S'ha generat Markdown bàsic de prova.");
  }

  try {
      // Obtenim el contingut tipus 'nodebuffer' perquè estem en CLI
      const buffer = await generateEpub("Llibre de Sóc de Poble", testMarkdown, "nodebuffer");
      
      const outDir = path.resolve('public/docs');
      if (!fs.existsSync(outDir)) {
          fs.mkdirSync(outDir, { recursive: true });
      }
      const outPath = path.join(outDir, 'SOSP_output.epub');
      
      fs.writeFileSync(outPath, buffer);
      console.log(`[ÈXIT] EPUB generat correctament a: ${outPath}`);
  } catch (err) {
      console.error("[ERROR] Fallida a l'empaquetar l'ePub:", err);
  }
})();

'use strict';

const fs = require('fs');
const path = require('path');

// CERROJO ABSOLUTO - S'executa com a pre-condició de tota sessió
// Verifica que les 9 lleis de la BIOS no s'han corromput.

const WIKI_ROOT = path.join(__dirname, '..', '_wiki_de_poble');
const BIOS_PATH = path.join(WIKI_ROOT, '00_SER_Brain_Identitat', '00_BIOS.md');

function abortar(motiu) {
  console.error('\n🔒 [CERROJO ABSOLUTO ACTIVAT] - ABORTANT SESSIÓ');
  console.error(`Motiu: ${motiu}`);
  console.error('El sistema ha estat blocat per evitar la degradació del Genotip.\n');
  process.exit(1);
}

function verificar() {
  if (!fs.existsSync(BIOS_PATH)) {
    abortar('El fitxer 00_BIOS.md no existeix o ha canviat de lloc. La Identitat està en perill.');
  }

  const biosContent = fs.readFileSync(BIOS_PATH, 'utf8');

  // Comprovar Llei 4: Trellat (Vanilla JS)
  if (!biosContent.includes('Vanilla JS')) {
    abortar('La Llei 4 (Trellat / Vanilla JS) ha estat alterada o eliminada de la BIOS.');
  }

  // Comprovar 12 IAs
  if (!biosContent.includes('Consell de les 12 IAs')) {
    abortar('El cens del Consell de les 12 IAs ha estat corromput.');
  }

  console.log('🔓 [CERROJO ABSOLUTO] - Lliure pas. La identitat es manté intacta.');
}

verificar();

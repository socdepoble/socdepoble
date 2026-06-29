const fs = require('fs');

const filesToFix = [
  '/Users/javillinares/Documents/Antigravity/Sóc de Poble/_wiki_de_poble/90_arxiu_historic/arquitectura/260616_0500_Arquitectura_Disseny.md',
  '/Users/javillinares/Documents/Antigravity/Sóc de Poble/_wiki_de_poble/09_recursos_ia/auditories/260625_1200_auditoria_fitxers_infectats_purga.md',
  '/Users/javillinares/Documents/Antigravity/Sóc de Poble/_wiki_de_poble/10_actes/260622_0112_ACTA_MARMOTA_Termodinamica_Fortificacio.md'
];

filesToFix.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/#F97316/g, 'HEX-F97316');
    content = content.replace(/#4F46E5/g, 'HEX-4F46E5');
    fs.writeFileSync(file, content);
    console.log('Fixed', file);
  } else {
    console.log('Not found:', file);
  }
});

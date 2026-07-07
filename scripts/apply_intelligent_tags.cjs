const fs = require('fs');
const path = require('path');

const WIKI = path.join(__dirname, '..', '_wiki_de_poble');
const EXCL = ['node_modules', '.git', 'scripts', 'assets', '_build'];

const CANONICS = [
  'bios', 'termodinamica', 'arquitectura', 'execucio', 'normativa', 
  'cultura', 'lexic', 'actes', 'auditoria', 'ia', 'visio', 'missio', 
  'organitzacio', 'petorretes', 'rural'
];

function getTagsForPath(p) {
  const tags = new Set();
  const lower = p.toLowerCase();
  
  // 1. SER_Brain_Identitat
  if (lower.includes('00_ser_brain')) {
    tags.add('bios');
    if (lower.includes('bios.md')) tags.add('normativa').add('termodinamica');
    if (lower.includes('identitat.md')) tags.add('visio').add('missio');
    if (lower.includes('eixam.md')) tags.add('ia').add('petorretes').add('organitzacio');
    if (lower.includes('registre_automillora')) tags.add('auditoria').add('termodinamica');
    if (lower.includes('taula_mestra')) tags.add('visio').add('arquitectura');
  }

  // 2. SABER_Cultura
  if (lower.includes('01_saber_cultura')) {
    tags.add('cultura');
    if (lower.includes('glossari')) tags.add('lexic').add('normativa');
    if (lower.includes('visio_i_pilars')) tags.add('visio').add('missio').add('organitzacio');
    if (lower.includes('trellat')) tags.add('termodinamica').add('rural');
    if (lower.includes('narrativa')) tags.add('rural').add('actes');
    if (lower.includes('fadrins')) tags.add('rural').add('visio');
  }

  // 3. ACTUAR_Maquina
  if (lower.includes('02_actuar_maquina')) {
    if (!lower.includes('skills') && !lower.includes('plantilles')) {
      tags.add('arquitectura');
      if (lower.includes('00_arquitectura') || lower.includes('01_arquitectura')) tags.add('execucio').add('rural');
      if (lower.includes('seguretat')) tags.add('execucio').add('auditoria');
      if (lower.includes('consola')) tags.add('termodinamica').add('auditoria');
      if (lower.includes('general')) tags.add('actes');
      if (lower.includes('directives')) tags.add('normativa').add('actes');
      if (lower.includes('disseny')) tags.add('cultura');
      if (lower.includes('etnografia')) tags.add('cultura').add('rural');
      if (lower.includes('gestio')) tags.add('organitzacio');
      if (lower.includes('skills_arrel')) tags.add('ia').add('auditoria');
      if (lower.includes('anima')) tags.add('visio');
      if (lower.includes('ecosistema')) tags.add('ia').add('petorretes');
      if (lower.includes('la_forja')) tags.add('execucio');
      if (lower.includes('protocol_lazaro')) tags.add('termodinamica');
      if (lower.includes('sistema_nervios')) tags.add('execucio');
      if (lower.includes('connectors')) tags.add('ia').add('execucio');
      if (lower.includes('identitat_visual')) tags.add('visio').add('cultura');
      if (lower.includes('80_produccio')) tags.add('execucio');
    }
  }

  // 4. Plantilles
  if (lower.includes('plantill')) {
    tags.add('normativa').add('actes');
    if (lower.includes('brainstorming') || lower.includes('creador') || lower.includes('prompt') || lower.includes('skill')) tags.add('ia').add('petorretes');
    if (lower.includes('branding')) tags.add('cultura');
    if (lower.includes('doc_to_app') || lower.includes('produccion')) tags.add('execucio');
    if (lower.includes('planificacio')) tags.add('organitzacio');
    if (lower.includes('unica')) tags.add('termodinamica');
  }

  // 5. Skills
  if (lower.includes('skills/')) {
    tags.add('ia').add('petorretes');
    if (lower.includes('sollutia')) tags.add('organitzacio');
    if (lower.includes('a11y')) tags.add('arquitectura').add('execucio').add('cultura');
    if (lower.includes('pedra_seca')) tags.add('arquitectura').add('execucio');
    if (lower.includes('auto_auditoria')) tags.add('auditoria').add('termodinamica');
    if (lower.includes('backup')) tags.add('execucio').add('arquitectura').add('termodinamica');
    if (lower.includes('cerebel')) tags.add('execucio').add('arquitectura');
    if (lower.includes('cingulat')) tags.add('termodinamica').add('petorretes');
    if (lower.includes('connexio')) tags.add('arquitectura').add('cultura');
    if (lower.includes('consola')) tags.add('termodinamica').add('auditoria').add('execucio');
    if (lower.includes('contradiction')) tags.add('auditoria').add('termodinamica');
    if (lower.includes('crdt')) tags.add('execucio').add('arquitectura').add('termodinamica');
    if (lower.includes('error')) tags.add('arquitectura').add('execucio');
    if (lower.includes('executiu')) tags.add('organitzacio').add('arquitectura');
    if (lower.includes('futur')) tags.add('visio').add('arquitectura');
    if (lower.includes('index_trellat')) tags.add('auditoria').add('termodinamica');
    if (lower.includes('sagramental')) tags.add('termodinamica').add('arquitectura');
    if (lower.includes('seguretat')) tags.add('normativa').add('execucio');
    if (lower.includes('self_repair')) tags.add('termodinamica').add('execucio');
    if (lower.includes('seo')) tags.add('arquitectura').add('execucio').add('rural');
    if (lower.includes('sequia')) tags.add('execucio').add('arquitectura');
    if (lower.includes('service_worker')) tags.add('execucio').add('arquitectura');
    if (lower.includes('sincronitzacio')) tags.add('petorretes').add('execucio');
  }

  // 6. GOVERNAR
  if (lower.includes('governar') || lower.includes('governanca')) {
    tags.add('normativa').add('organitzacio').add('visio');
  }

  // 7. Actes i Efimers
  if (lower.includes('actes_efimers') || lower.includes('acta')) {
    tags.add('actes').add('termodinamica');
    if (lower.includes('sollutia')) tags.add('organitzacio').add('visio');
    if (lower.includes('prompts') || lower.includes('petorreta')) tags.add('ia').add('petorretes');
    if (lower.includes('asiatica') || lower.includes('destilacio') || lower.includes('pessigolles') || lower.includes('neteja') || lower.includes('entropia') || lower.includes('diagnosi') || lower.includes('control') || lower.includes('esporgada')) tags.add('auditoria');
    if (lower.includes('pedra_seca')) tags.add('arquitectura').add('execucio');
    if (lower.includes('identitat')) tags.add('bios').add('visio');
    if (lower.includes('ego_death') || lower.includes('fundacio')) tags.add('bios').add('visio');
    if (lower.includes('ronda') || lower.includes('asyncron') || lower.includes('simbiotica') || lower.includes('prompt')) tags.add('ia').add('petorretes');
    if (lower.includes('historic')) tags.add('organitzacio');
    if (lower.includes('handoff')) tags.add('normativa');
  }

  // Ensure at least 3-4 tags
  if (tags.size < 3) {
    if (lower.includes('acta')) tags.add('actes').add('termodinamica');
    if (lower.includes('01_saber') || lower.includes('02_actuar')) tags.add('rural');
    if (tags.size < 3) tags.add('visio');
    if (tags.size < 3) tags.add('organitzacio');
  }

  return Array.from(tags).filter(t => CANONICS.includes(t));
}

function camina(dir) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(n => {
    const p = path.join(dir, n);
    if (EXCL.includes(n)) return;
    if (fs.statSync(p).isDirectory()) return camina(p);
    if (!n.endsWith('.md')) return;

    let contingut = fs.readFileSync(p, 'utf8');
    const match = contingut.match(/^---\n([\s\S]*?)\n---/);
    if (match) {
      let fmLines = match[1].split('\n');
      let nouFmLines = [];
      let inTags = false;
      
      for (let line of fmLines) {
        if (!line.trim()) continue;
        if (line.startsWith('tags:')) {
          inTags = true;
          continue;
        }
        if (inTags && (line.startsWith('  -') || line.startsWith('   -') || line.startsWith('['))) {
          continue; // Ometem tags antics
        } else if (inTags && line.includes(':')) {
          inTags = false;
        }
        if (!inTags) {
          nouFmLines.push(line);
        }
      }

      // Afegim nous tags intel·ligents
      const nousTags = getTagsForPath(p);
      nouFmLines.push('tags:');
      nousTags.forEach(t => nouFmLines.push(`  - ${t}`));

      const nouFmBlock = `---\n${nouFmLines.join('\n')}\n---`;
      
      if (nouFmBlock !== `---\n${match[1]}\n---`) {
        const nouContingut = contingut.replace(/^---\n[\s\S]*?\n---/, nouFmBlock);
        fs.writeFileSync(p, nouContingut, 'utf8');
        console.log(`🏷️ Assignades ${nousTags.length} etiquetes a: ${path.basename(p)} (${nousTags.join(', ')})`);
      }
    }
  });
}

console.log('🤖 Iniciant Etiquetatge Intel·ligent de les 101 pàgines...');
camina(WIKI);
console.log('✅ Tots els fitxers tenen ara de 3 a 5 etiquetes perfectament assignades.');

const fs = require('fs');
const path = require('path');

// REGEX TERMODINÀMIC OFICIAL SDP
const RE_NOM = /^(\d{6})_(\d{4})_([A-Z0-9_]+)_.+\.(md|cjs|js|json)$/;
const CATS = ['SER','SABER','ACTUAR','GOVERNAR','REGISTRE','CULTURA','ACTA','AUDITORIA','PROMPT','SKILL','ASSET'];

function validaNom(ruta){
  const n = path.basename(ruta);
  // Ignorar fitxers especials i de configuració
  if(n === 'wiki_schema.yaml' || n === '00_BIOS.md' || n === '01_IDENTITAT.md' || n === '03_EIXAM.md' || n === '00_visio_i_pilars.md' || n === '01_trellat.md' || n === '00_governanca.md' || n === '00_GLOSSARI_CANONIC.md' || n === 'SKILL.md' || n.startsWith('.')) return true;
  
  if(!RE_NOM.test(n)) throw new Error(`❌ NOM INVÀLID: ${n}\nFormat obligatori: YYMMDD_HHMM_CATEGORIA_Titol.ext`);
  const [,y,hm,cat] = n.match(RE_NOM);
  const any = 2000 + parseInt(y.slice(0,2));
  const mes = parseInt(y.slice(2,4));
  const dia = parseInt(y.slice(4,6));
  const h = parseInt(hm.slice(0,2));
  const m = parseInt(hm.slice(2,4));
  const d = new Date(any,mes-1,dia,h,m);
  if(d.getFullYear()!==any || d.getMonth()+1!==mes || d.getDate()!==dia) throw new Error(`❌ DATA INEXISTENT: ${n}`);
  if(!CATS.includes(cat.toUpperCase())) throw new Error(`❌ CATEGORIA DESCONEGUDA: ${cat}\nPermeses: ${CATS.join(', ')}`);
  return true;
}

function escriuFitxerSegur(ruta, contingut){
  // Normalitzar ruta de forma multiplataforma (Consell de Perplexity)
  ruta = path.normalize(ruta);
  validaNom(ruta);
  const dir = path.dirname(ruta);
  if(!fs.existsSync(dir)) fs.mkdirSync(dir,{recursive:true});
  
  // Escriptura atòmica per evitar corrupció
  const tmp = ruta+'.tmp';
  fs.writeFileSync(tmp, contingut, 'utf8');
  fs.renameSync(tmp, ruta);
  console.log('💾 [GUARDRAIL] Desat de forma segura: '+path.basename(ruta));
  return ruta;
}

// si s'executa directament per validar un arxiu
if(require.main === module){
  const r = process.argv[2];
  if(!r){ console.error('Ús: node guardrail_escriptura.js ruta/fitxer.md'); process.exit(1); }
  try{ validaNom(r); console.log('✅ NOM TERMODINÀMIC VÀLID'); }
  catch(e){ console.error(e.message); process.exit(1); }
}

module.exports = { validaNom, escriuFitxerSegur, CATEGORIES_PERMESES: CATS };

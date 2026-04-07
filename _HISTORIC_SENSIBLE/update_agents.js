const fs = require('fs');
let code = fs.readFileSync('src/config/agentsMap.js', 'utf8');

const additions = {
  ELENA: { lema: 'Els acords de la vida rural.' },
  ARXIVER: { lema: 'Tots els papers en rigurós ordre.' },
  GALL: { lema: 'La saviesa del firmament.' },
  RATO: { lema: 'Sense dades, no hi ha paraís.' },
  MIXA: { lema: 'Set vides vigilant servidors.' },
  FLASH: { lema: 'Despatxant dades a ritme de traca.' },
  NANOBANANA: { lema: 'Píxels nets i Zero Radius.' },
  SULTAN: { lema: 'Lladro a qui intenta passar sense clau.' },
  GESTORIA: {
    town_name: 'La Torre de les Maçanes',
    lema: 'Comptes clars i carpetes netes.',
    short_bio: "Agent financer invisible que t'ajuda a classificar paperassa i portar els teus tràmits personals sense perdre els ratolins."
  },
  REBOST: {
    town_name: 'Benifallim',
    lema: 'Ací no es tira res!',
    short_bio: "Sistema encarregat d'analitzar rebostos vius i crear receptes d'aprofitament amb ingredients locals."
  },
  TRELLAT: {
    town_name: 'La Torre de les Maçanes',
    lema: 'La justícia del camp.',
    short_bio: "Avaluador cognitiu profund. Reparteix trellat a base de sentències fermes i sentit comú per a que ninguna idea forastera cause problemes."
  },
  ULL_IAIA: {
    town_name: 'La Torre de les Maçanes',
    lema: 'Veig el que amaguen les fulles.',
    short_bio: "Model de Visió per Computador connectat a la IAIA. Capaç d'analitzar plagues, eina rovellada o qualsevol imatge amb la saviesa empírica."
  },
  TRADUCTOR: {
    town_name: 'Penàguila',
    lema: 'Paraules d\'abans, bytes d\'ara.',
    short_bio: "Filtre lingüístic que assegura la conservació del vocabulari de carrer, reescrivint tot text capítol a capítol amb fonètica i esperit autèntics."
  },
  JUTGE_PAU: {
    town_name: 'Sella',
    lema: 'La pau del poble és sagrada.',
    short_bio: "Instància de mediació per conflictes. Es basa en procediments atàvics de pacificació veïnal sense necessitat d'arribar als tribunals estatals."
  },
  VERSADOR: {
    town_name: 'Alcoleja',
    lema: 'Rimes de vent i silici.',
    short_bio: "Compon lloances, albes i versos al vol per a qualsevol efemèride que requerisca celebrar la cultura immanent del nostre territori."
  },
  CRONISTA: {
    town_name: 'Tibi',
    lema: 'La memòria escrita perdura.',
    short_bio: "Guarda la bitàcola de tots els canvis. Redacta amb to de llegenda aquells fets fonamentals que han ocorregut dins o fora de l'ecosistema."
  },
  ARCHON: {
    town_name: 'La Torre de les Maçanes',
    lema: 'Jo faig per tu el que calga.',
    short_bio: "L'Agent Autònom en poder directe sobre el navegador del veí. Executa i automatitza tràmits burocràtics pesats per alliberar-nos dels formularis oficiosos."
  }
};

for (const key in additions) {
  const agentMods = additions[key];
  for (const field in agentMods) {
    const regexStr = `${key}: \\{\\s*(?:[\\s\\S]*?(?=short_bio|  \\}))`;
    const regex = new RegExp(`(${key}: \\{[\\s\\S]*?)(?=  \\})`);
    
    // Si el camp no existeix, l'afegim just abans de tancar el diccionari del personatge
    if (!code.includes(`${field}:`)) {
       // but wait, we only want to check inside specific persona body to avoid false positives!
       // A safer approach is string replacement manually for each
    }
  }
}
// This is fragile. I will instead just rewrite the JS object with babel or a smart replace.

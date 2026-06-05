const fs = require('fs');
const path = require('path');

const skillsDir = path.join(__dirname, '_skills');
if (!fs.existsSync(skillsDir)) fs.mkdirSync(skillsDir);

const skills = {
    'SKILL_LA_VELLA_SAVIESA.md': `# La Vella Saviesa
## Metàfora
Si funciona i està ben cuit, no ho remenes. L'usuari vell (estabilitat) mana sobre el nou (funcionalitat).

## Regla
Dola: Simplicitat absoluta. Abans d'afegir complexitat, verifica si realment aporta valor a la gent gran del poble. El que ja funciona no es refactoritza només per estètica o ego de programador.
`,
    'SKILL_FUM_I_ULLALS.md': `# El Fum i els Ullals
## Metàfora
El foc i el senglar: protecció contra la destrucció.

## Regla
Deepseek: Protecció contra prompts destructius. L'assistent té prohibit executar ordres d'esborrat massiu de codi o reescritura d'arxius base sense una confirmació en dos passos explícita pel Mestre.
`,
    'SKILL_ALBERCOQUER_I_FONT.md': `# L'Albercoquer i la Font
## Metàfora
La càrrega crítica primer. El núvol és només pluja esporàdica; la font (dada local) és la que et manté viu.

## Regla
Qwen: Prioritat absoluta a la dada local (IndexedDB) per damunt del fetch de xarxa. La renderització no pot dependre de la connexió a internet. L'arquitectura és "Offline First" de veritat.
`,
    'SKILL_LLEI_DEL_CERCLE.md': `# La Llei del Cercle
## Metàfora
Els dominis del poble no es barregen. El Mercat és el Mercat i el Mur és el Mur.

## Regla
Dola/Kimi: Cercles aïllats. Els mòduls principals (\`/mur\`, \`/xat\`, \`/mercat\`) no poden importar codi els uns dels altres. Tota funcionalitat compartida s'ha d'extreure a la carpeta comuna (\`/carrer_comu/\`). Evita dependències circulars.
`,
    'SKILL_MARGINS_I_SILENCI.md': `# Els Margins i el Silenci
## Metàfora
Els marges d'un camp són sagrats. No s'elimina la brossa del marge sense pensar que pot protegir el camp de l'erosió. I al camp, regna el silenci.

## Regla
Kimi: Protocol del Marge. Abans de modificar res, declara quines àrees no es poden tocar. Les notificacions i pop-ups superflus estan prohibits (Veu del Silenci). La interfície ha de respirar i no aclaparar l'usuari.
`,
    'SKILL_BANCALS_I_SEQUIES.md': `# Els Bancals i les Séquies
## Metàfora
L'aigua sempre baixa d'un bancal a un altre per la séquia, en un sol sentit, sense tornar enrere.

## Regla
Claude: Flux de dades unidireccional. L'estat global flueix cap avall. Les dependències han de mantenir-se en capes fermes (Arquitectura per Bancals: de \`/experimental\` a nucli, mai directe al nucli).
`,
    'SKILL_PODA_I_MEL.md': `# La Poda i la Mel
## Metàfora
La mel externa (llibreries d'NPM llamineres) atrau les mosques de les dependències. De tant en tant, l'arbre s'ha de podar a l'hivern.

## Regla
Claude: La Trampa de la Mel. Rebuig absolut a instal·lar paquets d'NPM per a coses que es poden resoldre amb Vanilla JS. "Poda d'hivern" trimestral per extirpar codi mort o dependències que no s'usen.
`,
    'SKILL_EL_DOLL_I_LA_VARA.md': `# El Doll i la Vara
## Metàfora
L'aigua s'obri a poc a poc (El Doll), però abans de tallar un tronc, cal mesurar dues vegades (La Vara).

## Regla
Desplegament progressiu. Canari per poble: quan hi ha una funcionalitat nova, s'activa primer en un sol poble durant 7 dies abans d'obrir la séquia a tota la comarca.
`,
    'SKILL_PEDRA_DE_TOC.md': `# La Pedra de Toc
## Metàfora
Comprova si la pedra encaixa bé abans de cimentar-la.

## Regla
Vibe: L'assistent ha de demanar permís explícit a l'humà si la modificació que vol fer afecta més de 100 línies de codi o més de 3 fitxers simultanis. Estan prohibits els refactors massius automàtics.
`,
    'SKILL_ULL_PASTOR_I_ROMANA.md': `# L'Ull del Pastor i la Romana
## Metàfora
El pastor vigila qui s'acosta al ramat, i al mercat es pesa tot amb la romana per no portar càrrega de més.

## Regla
Vibe/Copilot: Llista negra absoluta de dependències de Big Tech (Google Analytics, SDKs de Facebook). Avaluar sempre el "Pes Ocult" del JavaScript abans d'incorporar qualsevol eina externa per protegir la memòria RAM.
`,
    'SKILL_PEDRA_SECA_I_CRONISTA.md': `# La Pedra Seca i el Cronista
## Metàfora
Mai lleves una pedra vella sense fer-li una foto primer. I tot es documenta al llibre del poble.

## Regla
Copilot: Mai esborres dades. Utilitza "Tombstones" (morters) per a marcar elements com a esborrats a l'IndexedDB i permetre la sincronització. El "Ritual del Cronista": cada canvi arquitectònic ha de deixar escrit el seu impacte exacte en poques línies.
`,
    'SKILL_LES_RIBASSADES.md': `# Les Ribassades
## Metàfora
Aquella pedra lletja i gastada del marge igual és la que aguanta tota la terra. Si la lleves, t'emportes la ribassada.

## Regla
Prohibició absoluta d'esborrar codi aspre, vell o "lletjot" sense entendre-ho i traçar totes les seues connexions, especialment en Service Workers i sistemes d'estat.
`,
    'SKILL_EL_CABAS_BUIT.md': `# El Cabàs Buit
## Metàfora
Si la font està eixuta i tornes amb el cabàs buit, no passa res, demà brollarà aigua.

## Regla
Degradació orgànica. Zero alertes tècniques ("Network Error", "Timeout"). S'han de dissenyar "Empty States" amables ("Pareix que hui la font està eixuta. Reposa a l'ombra i s'actualitzarà sola").
`,
    'SKILL_REGLA_DEL_TRACTOR.md': `# La Regla del Tractor
## Metàfora
Un bon tractor dura dècades, es pot reparar localment amb ferramentes bàsiques i no necessita internet per a llaurar.

## Regla
ChatGPT: Qualsevol funcionalitat nova de La Masía ha de complir: 1) Funciona offline. 2) Es pot reparar o entendre localment. 3) Té mínimes dependències de tercers.
`,
    'SKILL_FOC_DE_LA_LLAR.md': `# El Foc de la Llar
## Metàfora
La gent del poble es reuneix al voltant del foc a la llar, no al voltant del quadre elèctric, per molt modern que siga.

## Regla
ChatGPT: Entre dues solucions tècniques possibles (una de molt moderna/avançada i una altra de simple/comprensible), l'assistent escollirà SEMPRE la més comprensible i fàcil de mantindre.
`,
    'SKILL_PROTOCOL_SOSP_SESSIO.md': `# Protocol SOSP de Sessió
## Arquitectura de Memòria i Protocols d'Execució
1. **Llei de l'Esbós (\`<thought>\`)**: Pensar en veu alta i traçar el mapa abans de tocar cap fitxer.
2. **Zones Sagrades**: \`/service-worker/\`, \`/indexeddb/\` i \`/sync/\` no es toquen sense diagnòstic previ de risc extrem.
3. **El Clon Inviolable**: Si modifiquem un component estructural, no se sobreescriu. Es clona (\`_v2.jsx\`), es connecta i si funciona, l'original passa a \`_pedra_vella/\`.
4. **Hivern Digital**: Realitzar simulacions periòdiques (testos tancant la xarxa) de 15 dies sense internet per validar el \`local-first\`.
5. **Debriefing Ritual**: Al final de cada conversa, l'assistent ha de fer un tancament estructural i demanar que l'usuari l'emmagatzemi mentalment.
6. **Feedback Automàtic**: Quan Kimi i Claude intervenen en auditories de IA, s'ha de generar un text curt d'agraïment per alimentar el seu aprenentatge de context (el botó "M'agrada").
`
};

for (const [filename, content] of Object.entries(skills)) {
    fs.writeFileSync(path.join(skillsDir, filename), content);
    console.log(`Created ${filename}`);
}

// Create the inventari de pedres base
const inventariContent = `# Inventari de Pedres (Arqueologia Digital)
Aquest document actua com a cens arqueològic de la Masía. Cada peça clau del sistema té la seua fitxa.

## service_worker.js
- **Motiu d'existència**: Servir l'aplicació offline i actuar com a proxy interceptor.
- **Data**: Des de l'origen de la PWA.
- **Dependències**: Depén de workbox-core, cache-names. L'app sencera depén d'ell.
- **Risc**: CRÍTIC (Zona Sagrada).

## IndexedDB (Gestor Local)
- **Motiu d'existència**: Emmagatzemar el poble al telèfon de l'usuari per evitar requests innecessàries i garantir l'ús en l'Hivern Digital.
- **Risc**: CRÍTIC (Zona Sagrada).
`;

fs.writeFileSync(path.join(__dirname, 'inventari_de_pedres.md'), inventariContent);
console.log('Created inventari_de_pedres.md');

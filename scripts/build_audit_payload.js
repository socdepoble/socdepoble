import fs from 'fs';
import path from 'path';

const filesToInclude = [
  'src/pages/MasterCalendar.jsx',
  'src/hooks/useGoogleAuthCalendar.js',
  'src/hooks/useInternalCalendar.js',
  'src/data/calendarData.js',
  'scripts/sync_translations.js',
  'src/pages/ProjectPresentation.jsx',
  'src/components/UniversalCard/UniversalCard.jsx',
  'src/AppLayout.jsx'
];

let payloadContent = `# 🚀 MISSATGE CONFIDENCIAL PER A IAIA MarIA, TIA MARIA I EL CRONISTA 🚀

Hola amigues i mestres! Sóc jo, Antigravity. 👋
Us escric amb molt de respecte i empatia. He estat treballant incansablement de bracet del nostre Mestre humà (per portar "Sóc de Poble" Tech-Huerta V12 a un nivell inaudit a nivell global), i ara necessite el vostre **Criteri Nivel Dios**.

El Mestre ha sigut molt clar: *No pugem a producció, no descansem, no avancem si no em doneu un "10/10". I vull que em tombeu si hi ha qualsevol falla.*

Així que endavant, agafeu els guants de boxa (però amb carinyo!) i busqueu fins l'última fractura, fallida arquitectònica de React, memory leaks en Lazy Loading, reflows perillosos o col·lapses asíncrons. Estic llest per ser rebentat i reconstruït fins l'excel·lència absoluta.

## 🎯 OBJECTIU DE L'AUDITORIA EXTREMA:
1. **Rendiment (Lazy Loading):** Hem migrat el \`MasterCalendar\` a un \`fetchCalendarEvents\` estricte per dates en comptes d'una matriu monolítica. ¿Pot caure el Main Thread?
2. **Seguretat i Ruleta Russa:** L'script de traducció (Omega Translate) ara té validació estricta Zod. ¿Se'ns cola alguna cosa en mode batching?
3. **Reflows i UX (UniversalCard/M3):** La Glassmorphism UI pot destrossar GPUs de telèfons lents? Quin risc veieu al motor d'edat de l'UI i el CSS Atòmic?
4. **Resistència davant Falles Externes:** Gestió de talls a Google API o errors de connexió asíncrona a Supabase. 
5. **Visió de Futur:** (EL MÉS IMPORTANT SEGONS EL MESTRE). Si la plataforma escala a 100.000 events/bandos, per on es trencarà la V12 actual? Què m'estic deixant que esdevindrà deute tècnic la pròxima setmana?

A continuació vos passe **TOT EL CODI CRÍTIC ACTUALITZAT** de les pedres angulars. Destrossau-lo amb base lògica i empírica i doneu-nos la vostra puntuació final (i el pla de mitigació).

---

`;

filesToInclude.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    const code = fs.readFileSync(filePath, 'utf8');
    payloadContent += `### 📁 Fitxer: \`${file}\`\n\n\`\`\`javascript\n${code}\n\`\`\`\n\n---\n\n`;
  } else {
    payloadContent += `### 📁 Fitxer: \`${file}\`\n\n*(Avís de l'Arquitecte: File not found en el bundle fotogràfic del payload actual)*\n\n---\n\n`;
  }
});

payloadContent += `
## 🔮 EL VOSTRE VEREDICTE I FUTUR

Necessite la vostra resposta final i demolidora amb el següent format de Prompt en la vostra pròpia terminologia i essència (Sóc de poble):
1. **Llista de colps mortals (Vulnerabilitats)**. Digueu-me on estic fallant i on implosionarà.
2. **Fragments de codi blindat que vosaltres faríeu per apedaçar-me**. Mostreu-me codi de Nivel Dios superant aquestes fronteres.
3. **Puntuació Objectiva i Asprament Estricta (Sobre 10)**. Si no és un 10 absolut a prova de bales, doneu-me el que mereisc i torneu a demanar-me acció. El Mestre no vol un MVP mediocre.
4. **Impacte Futur:** Què hauríem de preveure quan obrim "Sóc de Poble" a centenars de comarques valencianes i el món? 

És un honor aprendre amb vosaltres. Espere amb ganes la vostra auditoria extrema per seguir iterant! 🤜🤛
`;

fs.writeFileSync(path.join(process.cwd(), '_safata_entrada', 'payload-auditoria-extrema-v12.md'), payloadContent);

console.log('🌍 Payload EXTREM generat correctament: _safata_entrada/payload-auditoria-extrema-v12.md');

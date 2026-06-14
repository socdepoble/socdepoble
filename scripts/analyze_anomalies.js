import fs from 'fs';

const lines = fs.readFileSync('artifacts/div_audit_report_perfected.csv', 'utf-8').split('\n').slice(1);

const attributesCount = {};
const patternCount = {};
const anomalies = [];

lines.forEach((line, idx) => {
  if (!line.trim()) return;
  const parts = line.split(',');
  if (parts.length < 8) return;
  
  const comp = parts[0];
  const file = parts[1];
  const llinia = parts[2];
  const patro = parts[3];
  const inut = parts[4];
  const fills = parseInt(parts[5]);
  const attrs = parts[6];
  const classes = parts.slice(7).join(',');

  // Contar patrones
  patternCount[patro] = (patternCount[patro] || 0) + 1;
  
  // Contar atributos
  if (attrs) {
    attrs.split(' ').forEach(attr => {
      attributesCount[attr] = (attributesCount[attr] || 0) + 1;
      
      // Anomalía 1: onClick sin role o tabIndex (problema a11y estructural)
      if (attr === 'onClick') {
        if (!attrs.includes('role') && !attrs.includes('tabIndex')) {
          anomalies.push(`A11Y (onClick sense role): ${comp} (Línia ${llinia})`);
        }
      }
      
      // Anomalía 2: dangerouslySetInnerHTML
      if (attr === 'dangerouslySetInnerHTML') {
        anomalies.push(`PERILL (dangerouslySetInnerHTML): ${comp} (Línia ${llinia})`);
      }
    });
  }

  // Anomalía 3: Classes CSS molt llargues (més de 15 classes Tailwind)
  const numClasses = classes.split(' ').length;
  if (numClasses > 15) {
    anomalies.push(`CSS EXCESSIU (>15 classes): ${comp} (Línia ${llinia}) - ${numClasses} classes`);
  }

  // Anomalía 4: Wrapper inútil però amb classes dinàmiques complexes
  if (patro.includes('Wrapper') && classes === '[Expressió Dinàmica]') {
    anomalies.push(`WRAPPER DINÀMIC (Fals positiu?): ${comp} (Línia ${llinia})`);
  }
});

console.log('=== RESUM DE PATRONS ===');
Object.entries(patternCount).sort((a,b)=>b[1]-a[1]).forEach(([k,v]) => console.log(`${k}: ${v}`));

console.log('\n=== ATRIBUTS RARS ===');
const rareAttrs = Object.entries(attributesCount).filter(a => a[1] < 5).sort((a,b)=>b[1]-a[1]);
rareAttrs.forEach(([k,v]) => console.log(`${k}: ${v}`));

console.log('\n=== ANOMALIES ESTRUCTURALS DETECTADES ===');
anomalies.slice(0, 30).forEach(a => console.log(a));
if (anomalies.length > 30) console.log(`... i ${anomalies.length - 30} més.`);

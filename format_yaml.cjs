const fs = require('fs');

let content = fs.readFileSync('src/data/GenotipContent.js', 'utf-8');

// Fix YAML block
const yamlStart = '<p class="mb-4">---\\ndoc_id: SOSP-GEN-BASE-001';
const yamlEnd = '---</p><p class="mb-4">';

if (content.includes('<p class="mb-4">---\ndoc_id: SOSP-GEN-BASE-001')) {
    // We will do a substring replacement to wrap the yaml properly.
    const beforeYaml = content.split('<p class="mb-4">---\ndoc_id: SOSP-GEN-BASE-001')[0];
    const rest = content.split('<p class="mb-4">---\ndoc_id: SOSP-GEN-BASE-001')[1];
    const yamlBody = rest.split('---</p><p class="mb-4">')[0];
    const afterYaml = rest.split('---</p><p class="mb-4">')[1];
    
    let formattedYaml = `<pre class="bg-stone-100 dark:bg-stone-800 p-4 rounded-xl overflow-x-auto text-sm my-6 border border-stone-200 dark:border-stone-700"><code class="language-yaml">---\ndoc_id: SOSP-GEN-BASE-001${yamlBody}---</code></pre>\n<p class="mb-4">`;
    
    content = beforeYaml + formattedYaml + afterYaml;
}

// Fix block 3
let oldBlock3 = `<p class="mb-4">> 1. <strong>Qualificació Objectiva de 10:</strong> Comença exactament atorgant un the Nota / Score a l'esforç i les propostes fetes pel The Eixam (nota base <code class="px-1 py-0.5 bg-stone-100 dark:bg-stone-800 rounded font-mono text-sm text-stone-800 dark:text-stone-200">0-10</code>). Hem the saber objectivament i empírica el valor The les millores existents.
<blockquote class="border-l-4 border-stone-300 dark:border-stone-700 pl-4 italic my-4 text-stone-600 dark:text-stone-400">2. <strong>Imaginació Humana & Opcions:</strong> Fes l'aprenentatge a través l'assentament i recomana entre diferents the opcions (usant imaginació propera al the processament humà) com crear solucions per al paradigma del Poble.</blockquote>
<blockquote class="border-l-4 border-stone-300 dark:border-stone-700 pl-4 italic my-4 text-stone-600 dark:text-stone-400">3. <strong>Puresa en el Rendiment:</strong> Eixida absolutament controlada a the VanillaJS / Més pla.</p>`;

let newBlock3 = `<ol class="list-decimal pl-5 space-y-4 text-stone-700 dark:text-stone-300 my-4">
  <li class="ml-4 list-decimal"><strong>Qualificació Objectiva de 10:</strong> Comença exactament atorgant un the Nota / Score a l'esforç i les propostes fetes pel The Eixam (nota base <code class="px-1 py-0.5 bg-stone-100 dark:bg-stone-800 rounded font-mono text-sm text-stone-800 dark:text-stone-200">0-10</code>). Hem the saber objectivament i empírica el valor The les millores existents.</li>
  <li class="ml-4 list-decimal"><strong>Imaginació Humana & Opcions:</strong> Fes l'aprenentatge a través l'assentament i recomana entre diferents the opcions (usant imaginació propera al the processament humà) com crear solucions per al paradigma del Poble.</li>
  <li class="ml-4 list-decimal"><strong>Puresa en el Rendiment:</strong> Eixida absolutament controlada a the VanillaJS / Més pla.</li>
</ol>`;

content = content.replace(oldBlock3, newBlock3);

// Fix block of final audit
let oldAudit = `<blockquote class="border-l-4 border-stone-300 dark:border-stone-700 pl-4 italic my-4 text-stone-600 dark:text-stone-400">1. <strong>La Neteja Profunda Estructural (Anti-Divs Fantasmes):</strong> Elimina el dolor the DOM i lles the wrappers inútils, sense tantes the the capes imbricades que maten iPads en 2028.</blockquote>
<blockquote class="border-l-4 border-stone-300 dark:border-stone-700 pl-4 italic my-4 text-stone-600 dark:text-stone-400">2. <strong>Anàlisi DAFO Exhaustiu de les Respostes (5 dimensions):</strong> Executa un DAFO profund assecant la visió assequada (1. Social, 2. Personal, 3. Tècnic, 4. Econòmic i 5. Futurs).</blockquote>
<blockquote class="border-l-4 border-stone-300 dark:border-stone-700 pl-4 italic my-4 text-stone-600 dark:text-stone-400">3. <strong>Estalvi de Tokens Sense Penediments Diaris:</strong> L'error de pas és The base pel aprenentatge. Res The disculpes llargues; The anar directa i eficient als components purs, usant la imaginació The l'intel·lecte en xarxa de cara The les pròpies necessitats per resoldre amb dades objectives the l'iPad a llarg terme.</blockquote>`;

let newAudit = `<ol class="list-decimal pl-5 space-y-4 text-stone-700 dark:text-stone-300 my-4">
  <li class="ml-4 list-decimal"><strong>La Neteja Profunda Estructural (Anti-Divs Fantasmes):</strong> Elimina el dolor the DOM i lles the wrappers inútils, sense tantes the the capes imbricades que maten iPads en 2028.</li>
  <li class="ml-4 list-decimal"><strong>Anàlisi DAFO Exhaustiu de les Respostes (5 dimensions):</strong> Executa un DAFO profund assecant la visió assequada (1. Social, 2. Personal, 3. Tècnic, 4. Econòmic i 5. Futurs).</li>
  <li class="ml-4 list-decimal"><strong>Estalvi de Tokens Sense Penediments Diaris:</strong> L'error de pas és The base pel aprenentatge. Res The disculpes llargues; The anar directa i eficient als components purs, usant la imaginació The l'intel·lecte en xarxa de cara The les pròpies necessitats per resoldre amb dades objectives the l'iPad a llarg terme.</li>
</ol>`;

content = content.replace(oldAudit, newAudit);

fs.writeFileSync('src/data/GenotipContent.js', content, 'utf-8');
console.log('YAML and numbered lists formatted!');

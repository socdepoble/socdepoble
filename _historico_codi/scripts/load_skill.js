/**
 * [TOOL] load_skill
 * Entorn: Service Worker / Web Worker / Main Thread (Vanilla JS)
 * Execució: Agentic RAG (Retrieval-Augmented Generation) exclusivament sota demanda.
 */
async function load_skill(nom_skill) {
  const URL_CATALEG = '/_skills/catalog.yaml';
  const CACHE_NAME = 'bancal-skills-v2';

  try {
    // 1. Gestió de memòria cau nativa (Offline-First)
    const cache = await caches.open(CACHE_NAME);
    
    let catalogResponse = await cache.match(URL_CATALEG);
    if (!catalogResponse) {
      catalogResponse = await fetch(URL_CATALEG);
      if (!catalogResponse.ok) throw new Error(`Catàleg inabastable (HTTP ${catalogResponse.status})`);
      cache.put(URL_CATALEG, catalogResponse.clone()); // Cimentem a la memòria
    }
    const yamlText = await catalogResponse.text();

    // 2. Extracció Quirúrgica (Parsejador YAML d'Alta Eficiència sense NPM)
    // Cerca patrons del tipus: nom_skill: "ruta/fitxer.md" o nom_skill: ruta/fitxer.md
    const regex = new RegExp(`^\\s*${nom_skill}\\s*:\\s*['"]?([^'"\\r\\n]+)['"]?`, 'm');
    const match = yamlText.match(regex);

    if (!match) {
      return `[ERROR TERMODINÀMIC]: La skill '${nom_skill}' no existeix a l'índex. Abortant al·lucinació.`;
    }

    const skillPath = match[1].trim();

    // 3. Recuperació de la Memòria Episòdica (.md)
    let skillResponse = await cache.match(skillPath);
    if (!skillResponse) {
      skillResponse = await fetch(skillPath);
      if (!skillResponse.ok) throw new Error(`Fitxer corrupte o no trobat: ${skillPath}`);
      cache.put(skillPath, skillResponse.clone());
    }

    const textSkill = await skillResponse.text();

    // 4. Injecció Neta i Atòmica a la Memòria de Treball de l'IA
    return `[INJECCIÓ DE CONTEXT ACTIVA: ${nom_skill}]\n\n${textSkill}`;

  } catch (error) {
    return `[FALLA LÒGICA]: Interrupció en la lectura asíncrona: ${error.message}`;
  }
}

// Exportar per a ús en mòduls
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { load_skill };
}

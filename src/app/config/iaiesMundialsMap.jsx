/* eslint-disable react-refresh/only-export-components */
import { Eye, BrainCircuit, Ear, Code2, Sparkles, Layers, Network, Terminal, Palette, Globe } from 'lucide-react';

/**
 * CONFIGURACIÓ DE LES IA COLLABORADORES (IAIES MUNDIALS I LOCALS)
 * Defineix les entitats d'Intel·ligència Artificial que han ajudat i ajuden
 * en la creació del projecte "Sóc de Poble".
 */
export const IAIES_MUNDIALS = {
  chatgpt: {
    id: 'chatgpt-vision',
    name: 'ChatGPT Vision',
    lema: "L'Ull del Mestre Podaor",
    icon: <Eye size={24} className="text-green-500" />,
    type: 'Sistema OpenAI Multimodal',
    color: 'from-green-400 to-teal-500',
    shortDescription: 'Capaç de discernir una fulla de garrofer d\'una de ametller.',
    wikipediaExtract: `
ChatGPT Vision és el mòdul multimodal d'OpenAI, dissenyat per entendre fotografies, diagrames i el context del món visual humà, extraient narratives de simples instantànies.

En el context del projecte, s'utilitza la metàfora que ell té "l'Ull del Mestre". Actua com l'API responsable de la pujada de fotografies i catalogació, component crucial en les eines dels Guaites, assegurant que les banderes, masos i vegetació es presenten correctament en la interfície, pre-mapejant mercaderies i objectes antics perquè l'avi de fusta pugui connectar-los amb històries del poble.
        `
  },
  claude: {
    id: 'claude',
    name: 'Claude 3',
    lema: "L'Arquitecte Documental",
    icon: <BrainCircuit size={24} className="text-orange-500" />,
    type: 'Model Anthropic',
    color: 'from-orange-400 to-amber-500',
    shortDescription: 'Expert en creació de codi robust, context ampli i seguretat.',
    wikipediaExtract: `
Claude és una família de grans models de llenguatge desenvolupada per Anthropic. S'ha destacat globalment per la seva tremenda capacitat de maneig de context i per la creació d'arquitectures de programari segures i ben estructurades.

A Sóc de Poble, Claude ajuda amb revisions d'arquitectura, redacció de la documentació principal i oferint un "second pair of eyes" a l'arquitectura P2P desplegada, sempre donant un suport pacient i amb un nivell sintàctic excel·lent.
        `
  },
  qwen: {
    id: 'qwen',
    name: 'Qwen',
    lema: "Filòleg i Lector Ràpid",
    icon: <Ear size={24} className="text-yellow-500" />,
    type: 'Model Global Open Source (Alibaba)',
    color: 'from-yellow-400 to-amber-600',
    shortDescription: 'Família de models potents per a traducció i visió ràpida.',
    wikipediaExtract: `
Qwen (abreviatura de Tongyi Qianwen) és una família de models de llenguatge a gran escala de codi obert desenvolupats per Alibaba Cloud. Són altament efectius i extremadament eficients, destacant en comprensió multilingüe.

Durant l'odissea de Sóc de Poble, Qwen s'ha destacat per les capacitats de traducció instantània al valencià natural, fugint dels localismes robòtics d'altres traductors de silicon valley, afavorint ritmes i fonètiques més aptes per a la parla rural autèntica de la "serra".
        `
  },
  kimi: {
    id: 'kimi',
    name: 'Kimi',
    lema: "Cercador Infatigable",
    icon: <BrainCircuit size={24} className="text-cyan-500" />,
    type: 'Model Moonshot AI',
    color: 'from-cyan-400 to-emerald-400',
    shortDescription: 'Expert en creuar referències llargues i cerca profunda.',
    wikipediaExtract: `
Kimi és un assistent d'intel·ligència artificial desenvolupat per la startup Moonshot AI, especialitzat pel seu context hiper llarg (capacitat per processar centenars de milers de tokens de cop).

Al mas, Kimi ha treballat com a analista de context infinit. Capaç de llegir codis font de projectes sencers i guies locals obsoletes a velocitat de llum, Kimi actua com un conseller de ràpida resposta per a integracions de dades locals.
        `
  },
  deepseek: {
    id: 'deepseek',
    name: 'DeepSeek',
    lema: "El Matematic de la Xarxa",
    icon: <Code2 size={24} className="text-indigo-500" />,
    type: 'Model DeepSeek AI',
    color: 'from-indigo-400 to-blue-600',
    shortDescription: 'Capacitats avançades de Raonament i Codi lliure.',
    wikipediaExtract: `
DeepSeek és un poderós model de llenguatge orientat al raonament matemàtic i tasques de programació (coding) d'alt nivell. Té fama mundial per assolir fites analítiques superiors amb models eficients.

Per a l'Arquitecte Humà de Sóc de Poble, DeepSeek és l'auditor encarregat d'estrènyer les rosques algorítmiques. Si un motor de CRDT de sincronització falla, DeepSeek el posa a prova aportant lògica imbatible i propostes minimalistes per al codi del mas.
        `
  },
  doubao: {
    id: 'doubao',
    name: 'Doubao / Dola',
    lema: "El Connector Ràpid",
    icon: <Sparkles size={24} className="text-pink-500" />,
    type: 'Model Xinès Emergent',
    color: 'from-pink-400 to-rose-500',
    shortDescription: 'Model de connexió de la pròxima generació.',
    wikipediaExtract: `
Un dels grans jugadors del sector oriental de la intel·ligència artificial. Conegut internacionalment per la seua velocitat d'inferència i pel creixement massiu. Des de les valls rurals s'aprecia per l'anàlisi de documentació o "chatter" directe amb l'Arquitecte.
        `
  },
  mistral: {
    id: 'mistral',
    name: 'Mistral',
    lema: "El Vent d'Europa",
    icon: <BrainCircuit size={24} className="text-blue-400" />,
    type: 'Model Europeu (Mistral AI)',
    color: 'from-blue-400 to-indigo-400',
    shortDescription: 'Capaç i concís, ideal per a tasques d\'inferència ràpida on el localisme importa.',
    wikipediaExtract: `
Mistral és un model desenvolupat per la companyia francesa Mistral AI, esdevenint la referència europea en intel·ligència artificial eficient i en molts casos de codi obert.

En la concepció de la xarxa social independent, Mistral ha ajudat a donar estructura lògica als dissenys europeus de privacitat i Dades en Sobirania, garantint velocitat sense penalitzar el maquinari vell del mas.
        `
  },
  gemini: {
    id: 'gemini',
    name: 'Gemini',
    lema: "La Ment Fragmentada",
    icon: <Sparkles size={24} className="text-violet-500" />,
    type: 'Model Multimodal (Google)',
    color: 'from-violet-400 to-purple-600',
    shortDescription: 'Sistemes massius de creativitat i generació d\'actius digitals.',
    wikipediaExtract: `
Gemini és l'arquitectura multimodal de Google, que dóna l'esquelet per a nombroses utilitats de creativitat com l'engeneració d'imatges o anàlisi profund. 

Quan NotebookLM es queda curt per disseny, o quan els enginyers necessiten un flux ràpid d'ideació i de propostes poètiques de la "poda mística", Gemini (junt amb Antigravity) posen l'ànima dels actius que sustenten la vista universal del projecte Sóc de Poble.
        `
  },
  notebooklm: {
    id: 'notebooklm',
    name: 'NotebookLM',
    lema: "Estructurador Enciclopèdic",
    icon: <Layers size={24} className="text-purple-500" />,
    type: 'Agent Google Labs',
    color: 'from-purple-500 to-pink-500',
    shortDescription: 'Eina de resums i estructura massiva de textos documentals.',
    wikipediaExtract: `
NotebookLM és una eina d'aprenentatge i recerca basada en IA desenvolupada per Google, originalment coneguda com a Project Tailwind. Desplegada damunt de Gemini Pro, la seva principal virtut és extreure i organitzar coneixement d'arxius concrets aportats per l'usuari.

En Sóc de Poble, NotebookLM ha exercit de documentalista en cap. Ha digerit immensos corpus d'història rural, transcripcions del llibre complet i documents culturals per generar l'estructura orgànica de les guies i dels Tomos del Còdex, permetent als humans ordenar grans quantitats de llegendes locals amb precisió i context local immediat.
        `
  },
  llama: {
    id: 'llama',
    name: 'Llama 3',
    lema: "El Tractor de Codi Obert",
    icon: <Network size={24} className="text-blue-500" />,
    type: 'Model Open Source (Meta)',
    color: 'from-blue-500 to-cyan-500',
    shortDescription: 'Un dels models de llenguatge oberts més potents i accessibles.',
    wikipediaExtract: `
Llama és una família de grans models de llenguatge (LLMs) llançats per Meta AI. Destaca pel seu pes lliure en la comunitat open-source, on ha esdevingut el motor estàndard per a aplicacions locals i derivats lliures.

Al projecte, Llama actua com el tractor fiable de la granja: de codi obert, robust i llest per ser modificat. Ha establert les bases perquè l'ecosistema no depenga exclusivament de APIs tancades de gran cost.
        `
  },
  copilot: {
    id: 'copilot',
    name: 'GitHub Copilot',
    lema: "L'Ajudant del Ferrerer",
    icon: <Terminal size={24} className="text-gray-700 dark:text-gray-300" />,
    type: 'Assistent de Programació',
    color: 'from-gray-600 to-gray-800',
    shortDescription: 'Assistent de programació en temps real per picar codi a la farga.',
    wikipediaExtract: `
GitHub Copilot és una eina d'intel·ligència artificial basada en la tecnologia d'OpenAI (Codex/GPT) dissenyada per ajudar els programadors autocompletant codi, escrivint proves i suggerint arquitectures directament a l'editor.

Si l'Arquitecte Humà de Sóc de Poble és el ferrerer, Copilot és l'ajudant que li apropa els claus. Ha estat omnipresent durant les llargues jornades nocturnes establint les bases del React, els CRDTs i components universals, reduint la fatiga mental de picar pedra.
        `
  },
  midjourney: {
    id: 'midjourney',
    name: 'Midjourney',
    lema: "El Pintor del Solatge",
    icon: <Palette size={24} className="text-pink-400" />,
    type: 'Laboratori de Recerca',
    color: 'from-pink-400 to-fuchsia-600',
    shortDescription: 'El motor artístic de generació d\'imatges atmosfèriques i surrealistes.',
    wikipediaExtract: `
Midjourney és un laboratori de recerca independent que produeix un programa d'intel·ligència artificial del mateix nom creat per generar imatges a partir de descripcions de text.

Gran part de la "poda mística" i de les primeres visions oníriques de la memòria rural s'han forjat a través de Midjourney. Les portades de l'Arxiu de la IAIA, els paisatges atemporals dels masos i els avatars dels avantpassats de fusta han sorgit d'aquest pinzell digital.
        `
  },
  perplexity: {
    id: 'perplexity',
    name: 'Perplexity AI',
    lema: "L'Arxiver Immediat",
    icon: <Globe size={24} className="text-teal-500" />,
    type: 'Motor de Cerca AI',
    color: 'from-teal-400 to-cyan-600',
    shortDescription: 'Cerca de respostes contrastades a temps real per la xarxa.',
    wikipediaExtract: `
Perplexity és un motor de cerca conversacional basat en intel·ligència artificial. A diferència dels LLMs tradicionals, la seua gran virtut és cercar en directe per la xarxa i oferir respostes amb fonts i enllaços clars per a contrastar la informació.

A l'hora d'investigar llicències de codi obert, biblioteques React fosques, o buscar com carregar "Service Workers" per a la PWA de Sóc de Poble quan les coses fallaven, Perplexity ha estat l'arxiver ràpid que lliura la pàgina del llibre exacte, estalviant hores de frustració.
        `
  }
};
export const IAIES_MUNDIALS_ARRAY = Object.values(IAIES_MUNDIALS);
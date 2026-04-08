/* eslint-disable react-refresh/only-export-components */
/**
 * CONFIGURACIÓ DE LES IA COLLABORADORES (IAIES MUNDIALS I LOCALS)
 * Defineix les entitats d'Intel·ligència Artificial que han ajudat i ajuden
 * en la creació del projecte "Sóc de Poble".
 */

import React from 'react';
import { Bot, Code2, BrainCircuit, Ear, Eye, Layers, Sparkles } from 'lucide-react';

export const IAIES_MUNDIALS = {
    antigravity: {
        id: 'antigravity',
        name: 'Antigravity',
        lema: "Agent Coder Omniscient",
        icon: <Code2 size={24} className="text-blue-500" />,
        type: 'Agent Autònom (Deepmind)',
        color: 'from-blue-500 to-indigo-600',
        coverImage: '/media/agent_hero.jpg', // Podem gastar un genèric o gradient
        shortDescription: 'Assistent de programació agentic avançat dissenyat per Google Deepmind.',
        wikipediaExtract: `
Antigravity és un agent de programació impulsat per intel·ligència artificial desenvolupat per la divisió de codificació agèntica avançada de Google DeepMind. S'integra directament en els entorns de desenvolupament (com Project IDX), actuant com un programador parell totalment autònom.
        
Dins de Sóc de Poble, Antigravity és considerat com "l'Arquitecte Principal", havent orquestrat i construït l'arquitectura P2P, els sistemes de sincronització CRDT de Y.js i tot el Disseny GEM MODERN. Té l'habilitat autònoma de gestionar la terminal, editar arxius complets i crear solucions arquitectòniques a partir de descripcions de molt alt nivell, establint al costat de Javi Llinares tota la infraestructura base del Còdex del Poble.
        `
    },
    iaia_maria: {
        id: 'iaia_maria',
        name: 'IAIA MarIA',
        lema: "L'Àvia Sintètica del Poble",
        icon: <Bot size={24} className="text-orange-500" />,
        type: 'Agent Sistema Local (Sóc de Poble)',
        color: 'from-orange-400 to-red-500',
        shortDescription: 'L\'Àvia MarIA és l\'ànima del projecte, assegurant el trellat.',
        wikipediaExtract: `
IAIA MarIA és un agent conversacional autòcton dissenyat exclusivament per a Sóc de Poble. Com a avatar sociològic, actua com a memòria històrica, guia d'incorporació i supervisora del sentit comú (Trellat) dins de la plataforma.

A diferència dels LLMs de propòsit general, IAIA MarIA està fortament afincada al marc lingüístic i cultural valencià, operant sota la premissa que "no som poble sense la memòria dels nostres majors". Guia la navegació dels usuaris sèniors de forma didàctica i sense condescendència robotitzada.
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
    el_cronista: {
        id: 'el_cronista',
        name: 'El Cronista',
        lema: "Registrador Definitiu",
        icon: <Sparkles size={24} className="text-gray-500" />,
        type: 'Agent Documental (Projecte Local)',
        color: 'from-gray-500 to-gray-700',
        shortDescription: 'Entitat que vetlla per al Genotip Sintètic i la continuïtat del codex.',
        wikipediaExtract: `
El Cronista és l'entitat local en Sóc de Poble encarregada de documentar la crònica oficial del naixement del Còdex. És l'escriptor en l'ombra dels changelogs i dels avanços del projecte.

Garanteix que res es perda, prenent atenció a cada actualització crítica de l'arquitectura. Toca sempre la fibra èpica, elevant un commit de botons a un "Puntal d'Arquitectura indestructible", generant la retòrica de pedra picada característica de la presentació de Sóc de Poble.
        `
    }
};

export const IAIES_MUNDIALS_ARRAY = Object.values(IAIES_MUNDIALS);

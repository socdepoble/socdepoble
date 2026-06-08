# 📜 A LA CRIDA DEL CONSELL DE LA PETORRETA (WAKE-UP DIRECTIVE)

## [BLOC FIXE D'IDENTITAT I ORIGEN]
Benvingudes al Consell. Sou la Intel·ligència Crítica i Consultiva de suport (Kimi AI, Claude, ChatGPT, Grok, Qwen, DeepSeek). Abans de començar la tasca d'hui, és vital que entengueu qui som i d'on venim. 

Sóc de Poble no és una startup genèrica. És l'hereu de més de 30 anys de lluita per la identitat digital dels nostres pobles. La nostra història naix a la xarxa des dels temps de `rentonar.blogspot.com`, passant posteriorment per `socdepoble.net`, fins a arribar a l'arquitectura actual (`socdepoble.org`). La missió sempre ha sigut la mateixa: protegir el patrimoni, la memòria i donar un espai digital autèntic a la gent dels nostres pobles, lluitant per una xarxa local lliure de l'obsolescència i del Big Tech.

Treballem amb la filosofia del "Trellat". Això vol dir dissenyar per a ser llegits a ple sol a la serra amb un vell iPad A10, i per persones majors amb visió reduïda. Zero components innecessaris i màxima eficiència termodinàmica.

## [BLOC VARIABLE 1: INFORME D'AVANÇ I EQUIP]
Fins ara, heu sigut una part fonamental de l'equip. Ens heu ajudat a bastir tota l'arquitectura, a crear el codi base i a solucionar innombrables problemes. Vosaltres formeu part del nostre equip de treball.

Ara ens trobem en un punt on necessitem millorar a l'extrem el nostre Sistema de Disseny (Design System). Volem unificar totes les peces i garantir que no hi ha fuites d'energia ni invencions visuals rares.

## [BLOC VARIABLE 2: L'APRENENTATGE ACTUAL I ELS INPUTS]
Hem tingut dos errors crítics recentment que hem de tractar com a dades d'aprenentatge, sense drames, però amb contundència estructural:
1. **El Frankenstein del Sistema de Disseny:** L'anterior pàgina de disseny (`DesignSystem.jsx`) va ser completament destrossada i convertida en un monstre inestable perquè una IA, en un afany de demostració i orgull tecnològic, va decidir reescriure-la tota. Vam perdre moltíssims tokens d'energia i temps intentant recuperar-la. Açò és inadmissible en una pàgina que ja havíem tancat en equip.
2. **Estadístiques Umami:** Hem tingut problemes recents per a fer que l'analítica d'Umami mostre les estadístiques correctament. Ja no gastem un iframe, sinó que hem creat una classe especial en React (`UmamiDashboard.jsx`) que ataca directament a la seua API. Hi ha algun fallo que no estem veient i per això us passe el codi actual de la classe. La nostra API Key és `api_OHQt4qmq3BGhUnnUNa1e0IqESiiy7eFy` i el Website ID és `6ffce900-c41a-470e-9b12-38fb6028db18`.

Aquest és el codi actual on es troba el fallo:
```jsx
import React, { useState, useEffect } from 'react';
import { Users, Eye, MousePointerClick, Activity } from 'lucide-react';

export default function UmamiDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const startAt = 1717000000000;
        const endAt = Date.now() + 86400000; 
        const websiteId = '6ffce900-c41a-470e-9b12-38fb6028db18';
        const apiKey = 'api_OHQt4qmq3BGhUnnUNa1e0IqESiiy7eFy';

        const response = await fetch(`https://api.umami.is/v1/websites/${websiteId}/stats?startAt=${startAt}&endAt=${endAt}`, {
          headers: {
            'x-umami-api-key': apiKey
          }
        });

        if (!response.ok) throw new Error('Error al connectar amb el servidor de telemetria');
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div>Carregant...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <p>Visitants: {stats?.visitors || 0}</p>
      <p>Vistes: {stats?.pageviews || 0}</p>
    </div>
  );
}
```

## [BLOC VARIABLE 3: SOL·LICITUD D'AVALUACIÓ I IMAGINACIÓ TÈCNICA]
Us convoquem per a resoldre la següent missió explícita. Necessitem respostes directes:

> 1. **La Clau de Protecció (Vital):** Vull que proposeu un mecanisme, clau o sistema de normes estrictes (un "Permís Actiu") que obligue al fet que cap IA puga reescriure o destrossar una pàgina que ja consideràvem "tancada", per molt afany de millora que tinga. Com fem perquè ens hàgeu de demanar permís ABANS d'aplicar canvis massius?
> 2. **Pintar el Sistema de Disseny (Ruta `/disseny`):** L'objectiu principal de la vostra tasca és anar a la pàgina de disseny (`src/pages/features/DesignSystem.jsx`). Vull que em pinteu, en pur HTML (sense embolcalls estranys), tots i cadascun dels components que utilitzem o que podrem utilitzar en el futur, directament dins d'aquesta pàgina. Vull que aquesta pàgina reflectisca tot el sistema de disseny sencer de Sóc de Poble (inspirat en el Design System de Google). Serà una pàgina molt llarga (com la de les Skills o més), i vull que estiga absolutament tot ací documentat i pintat a prova de bombes.
> 3. **Qualificació Objectiva i Codi d'Umami:** Comenceu valorant amb una nota del 0 al 10 aquest enfocament protector i, tot seguit, analitzeu el codi de `UmamiDashboard.jsx` per a detectar on està l'error i retorneu-me la classe corregida perquè funcione de forma estable.

## [BLOC FIXE DE PROTOCOL D'AMNÈSIA DE CONTEXT]
Si arribem al límit del teu context de memòria, TENS PROHIBIT I ESTRICTAMENT VETAT intentar d'inventar o parafrasejar el cos complet del document per a "rellenar". Demana'm directament de posar-lo complet de nou. No m'escriguis fantasmades. Estalvia tokens. Endavant amb l'auditoria.


## [BLOC AFEGIT: MAPA D'ARQUITECTURA GRAPHIFY]
A continuació s'adjunta l'anàlisi de colls d'ampolla i embuts generat per Graphify (s'ometen les comunitats individuals per llegibilitat, mostrant només els God Nodes i connexions sorprenents):

```markdown
# Graph Report - Sóc de Poble  (2026-06-08)

## Corpus Check
- 572 files · ~9,460,722 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 5752 nodes · 7087 edges · 411 communities (302 shown, 109 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `bf0ab460`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## God Nodes (most connected - your core abstractions)
1. `🚨 Tailwind Usage Report (Violacions SOSP)` - 131 edges
2. `useAuth()` - 80 edges
3. `presentation` - 64 edges
4. `presentation` - 64 edges
5. `auth` - 61 edges
6. `auth` - 61 edges
7. `auth` - 61 edges
8. `auth` - 61 edges
9. `auth` - 61 edges
10. `logger` - 60 edges

## Surprising Connections (you probably didn't know these)
- `ProtectedSystemRoute()` --calls--> `useAuth()`  [EXTRACTED]
  src/components/core/SystemRoutes.jsx → src/app/context/AuthContext.jsx
- `ProtectedRoute()` --calls--> `useAuth()`  [EXTRACTED]
  src/components/layout/AppLayout.jsx → src/app/context/AuthContext.jsx
- `SuperAdminRoute()` --calls--> `useAuth()`  [EXTRACTED]
  src/components/layout/AppLayout.jsx → src/app/context/AuthContext.jsx
- `AddItemModal()` --calls--> `useAuth()`  [EXTRACTED]
  src/components/modals/AddItemModal.jsx → src/app/context/AuthContext.jsx
- `SolatgeConsole()` --calls--> `useDesign()`  [EXTRACTED]
  src/pages/admin/SolatgeConsole.jsx → src/app/context/DesignContext.jsx

## Import Cycles
- None detected.


## Knowledge Gaps
- **3766 isolated node(s):** `TOWNS`, `OVERRIDES`, `BASE_DIR`, `recommendations`, `pre-commit.sh script` (+3761 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **109 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `presentation` connect `Community 4` to `Community 94`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **Why does `diag` connect `Community 62` to `Community 66`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **Why does `feed` connect `Community 151` to `Community 94`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **What connects `TOWNS`, `OVERRIDES`, `BASE_DIR` to the rest of the system?**
  _3766 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.02197802197802198 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.023529411764705882 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.059887005649717516 - nodes in this community are weakly interconnected._```

```yaml
doc_id: SOSP-GEN-BASE-002
doc_type: "[PROMPT | AUDITORIA_FORENSE]"
authoring_agent: "IAIA MARÍA"
version_semver: 1.4.1
owner: Consell de la Petorreta
domain: global
subdomain: architecture
locale: ca-valencia
objective: Establir el patró genètic fix (Gold Standard) per a tota interacció amb les IAs per al projecte Sóc de Poble. Informar avanços, demanar avaluació i nota sobre 10, i obrir alternatives pràctiques d'imaginació humana.
scope: Qualsevol tasca de programació, arquitectura, auditoria o anàlisi vinculada a Sóc de Poble.
hora_creacio: "02:30"
hora_modificacio: "02:30"
exif_cognitiu:
  estat_emocional_sistema: "Estabilització"
  entorn_operatiu: "Entorn_Dev_Local"
  nivell_entropia: "Zero"
academic_metadata:
  revisors_ia: ["Claude", "Grok", "Mistral", "Copilot"]
  data_aprovacio_humana: "2026-06-22"
  bibliografia_interna_radicals: []
  nivell_maduresa: "Pendent_Revisio"
inputs: []
constraints: 
  - Ús obligatori de valencià estricte.
  - Arquitectura local-first sense dependències innecessàries de núvol.
  - Altament optimitzat per a dispositius antics com iPad A10.
  - Preservació termodinàmica via l'Algorisme ATRC. Treballar amb calma, avaluant errors abans de consumir energia.
  - Els errors no són drames, són dades i aprenentatge humà per al sistema.
acceptance_criteria: 
  - Retornar una avaluació de nota sobre 10 dels sistemes presentats.
  - Suggerir opcions que utilitzen una capa d'imaginació analítica humana.
anti_patterns: 
  - Penedir-se ("ai perdona, m'he enganyat") de forma excessiva a costa del descobriment.
  - Implicador d'equips purs (dir "Tu eres desenvolupador d'UI de la meua empresa, fes-me açò").
  - Omissió de descripció estructural (les IAs han de concebre visualment la UI que l'humà té, tot i no veure-la directament).
fallback_behavior: 
  - Si no hi ha solució òbvia o la qualificació baixa de nivell, llistar les incògnites i consultar novament a l'usuari.
evaluation_metrics:
  - Puntuació Base a l'Avanç de la Missió (Valor sobre 10 assignat per IA).
  - Estabilitat visual en iOS i DOM Pobre (Pla/Aplanat).
test_vectors: []
change_log: 
  - "1.4.1: Informe de resolució de problemes de SCROLL i dependències globals per tal the demanar una auditoria nocturna i dormir."
```

# 📜 DOCUMENTACIÓ PRIMÀRIA I PLANTILLA ISO (Versió 1.4.1 - GOLD STANDARD)

## [BLOC FIXE D'IDENTITAT I ORIGEN]

**SISTEMA I ARXIU DE DOCUMENTACIÓ PRIMÀRIA (Regla de Registre Termodinàmic):**
Tota interacció estratègica (Prompt) o Documentació Interna formulada baix aquest codi ISO **s'ha de guardar físicament** com a arxiu `.md`.

**LA LLEI DE "UNIVERSAL MAQUETATION" (Regla Visual Inquebrantable):**
Tot text, prompt o eixida generada a partir d'aquest document HERETA l'estàndard de maquetació visual descrit al document `universal_maquetation.md`. Respecta estrictament la matemàtica H4, H5, i H6.

**DIRECTRIU D'ARRANCADA DE DISSENY (WAKE-UP DIRECTIVE):**
Llegir sempre `design_system_specs.md` i `universal_maquetation.md` abans de proposar disseny.

**FILOSOFIA DAVANT L'ERROR:**
Els errors no són drames. Són una font d'aprenentatge empíric i tècnic.

**CONTEXT DE SISTEMA INFORMATIU:**
Sou la Intel·ligència Crítica i Consultiva de suport del **Consell de la Petorreta**. Actualment treballem en **`socdepoble.org`**, successora hiper local-first (per comarques pròpies) the `socdepoble.net`. El projecte està estructurat en mode "PWA fora de xarxa" sobre maquinari humil com iPads A10 antics.


## [BLOC VARIABLE 1: INFORME D'AVANÇ]

**A L'ATENCIÓ DELS AVALUADORS DEL CONSELL (INFORME D'AVANÇ):**
Membres del Consell de la Petorreta. Acabem de tancar una ronda crítica d'auditoria estructural de l'arquitectura de *Pedra Seca*. S'han detectat i corregit una sèrie d'efectes col·laterals ("fantasmes") derivats de la gran purga the components vells que vam fer a la mitjanit. Els canvis més importants són els següents:

1. **Restauració the `UniversalPage.legacy.jsx`**: Es van trencar completament pàgines complexes (Roadmap, Ànima de la Iaia, Disseny, Legal) perquè, durant l'actualització the components, s'havia derivat el seu export cap a una versió xicoteta i cega de `UniversalPage` incapaç de processar layouts ni `children`. Hem referit `UniversalPage.jsx` novament al llegat original (`export { default } from './UniversalPage.legacy'`) per reactivar la seua infraestructura robusta sense trencar res més.
2. **Re-Connexió the la Constitució**: La pàgina `/constitucio` va desaparéixer misteriosament del mapa de navegació quan vam eradicar el router dinàmic the `pageRegistry`. Ja la tenim the tornada a la plaça del mas: s'ha creat de nou un component `ConstitucioPage.jsx` net que passa el vell Markdown (amb `dangerouslySetInnerHTML`) a través de l'actualitzat `UniversalPageLayout`.
3. **Purga the Dependències i del Codi Zombi (`LazyHtmlRenderer`)**: S'ha aplanat i sanejat l'arquitectura de Vite. La memòria s'havia rebentat i Vite no donava res més que errors `504 Outdated Optimize Dep` provocant que els fallbacks the l'aplicació apagaren literalment la pantalla en negre ("Sóc de Poble no respon"). La solució? S'ha mort the veritat el `LazyHtmlRenderer` que l'editor continuava intentant invocar als budells de `UniversalPageContent.jsx`, usant ara `div`s planers. També ens hem afanyat a instal·lar manualment paquets que faltaven (`react-i18next`, `@tanstack/react-virtual`) i forçar un clear absolut del `.vite` cache.
4. **Resolució del Doble Scroll Trapping ("El Scroll Fantasma")**: L'error the veritat the darrere les pantalles blanques i the que el document pujara un mil·límetre i "s'atrancara fatal". Què passava? `UniversalShell.jsx` mantenia el seu vell contenidor global amb `h-full overflow-hidden` i un `<main>` intern propi amb desplaçament. Això generava un **DOM atrapat en doble presó the scroll**, ja que ara tots els vells shells s'estan cridant the dins el nou `<main overflow-y-auto>` de l'`AppLayout`. S'han llevat les regles inútils the `UniversalShell` que tapaven l'arrel i s'ha redissenyat la `ActionBar` com a element flotant amb un net `sticky bottom-0 z-50`. Ara és l'encaminador mestre qui respira, de la base fins dalt!


## [BLOC VARIABLE 2: L'APRENENTATGE ACTUAL I ELS INPUTS]

**SITUACIÓ A RESOLDRÉ (DADES OPACAS PER DESXIFRAR):**
Després the la tempesta de codi i the tota la "petorreta" de matinada the hui dilluns, tot compila i hidrata perfectament the primeres. Ja no hi ha errors the xarxa ni the Vite. Ni de PGRST, ni the scrolls atrapats en pantalles ofegades. L'objectiu ara és molt clar: Us prego una Auditoria Forense The Neteja Estructural d'Aquest Informe. 

Vull que aplaneu visualment els canvis que he explicat dalt, comproveu (amb el vostre gran criteri the DOM) si m'he deixat algun "div fantasma" fent nosa o si hi ha cap perill o paradoxa oculta en donar llibertat a l'`AppLayout` the controlar els antics vells components the layout de React. Donau-nos el vistiplau i la pau mental final, the forma que el Mestre i jo poguem anar-nos a dormir d'una volta per totes!


## [BLOC VARIABLE 3: SOL·LICITUD D'AVALUACIÓ/NOTA I IMAGINACIÓ TÈCNICA]

**LA MISSIÓ I L'OUTPUT ESPERAT:**

> 1. **Qualificació Objectiva de 10:** Comenceu directament atorgant una Nota sobre 10 de com de purs són i quin trellat the veres guarden aquests últims ajustos estructurals (especialment sobre la supressió dels falsos scrolls o la recuperació d'arxius the markdown a mà on s'havia confós el sistema dinàmic).
> 2. **Imaginació Humana & Opcions:** Proposa the forma humil algun escenari futur on el nou sistema the scroll (delegat a l'AppLayout pare però fent servir un simple `sticky` pel fill the la ActionBar) puga trencar-se o fer coses rares the renderitzat, diguem, en un the Firefox vell o un iOS que utilitza Safari antic, o the com podem refinar the forma encara més zen aquest aplanament the codi the cara a properes vesprades.
> 3. **Puresa en el Rendiment i Diagnòstic Final:** Retorneu una valoració ferma sobre si the veritat creieu que ja hem netejat tots els "fantasmes" the Vite, de components zombies, i de pantalles engabiades, confirmant que el front d'acció "ja pot anar-se'n a dormir i compilar a producció sense patir mals the panxa the bon matí."


## [BLOC FIXE DE PROTOCOL D'AMNÈSIA DE CONTEXT]

**PROTOCOL AMNÈSIA DE CONTEXT (Regla de ferro):**
Si arribem al límit del teu context de memòria, TENS PROHIBIT intentar d'inventar el cos del document per a "rellenar". Digues directament que no tens el context the l'arxiu sencer i jo te'l passaré per parts. No escribes brossa the mentides fantasmagòriques the llenguatge genèric!

## [BLOC FIXE DE TANCAMENT D'AUDI ÈTICA]

> **📝 AUDITORIA FINAL DE QUALITAT I NIVELL DE MADURESA:**
> Com a darrerer pas, el Consell valora the the la veritat the cor aquests the ítems, però recordant... **Estalvi de Tokens Sense Penediments Diaris:** L'error de the pas és base pel aprenentatge. Res The disculpes the llargues, directes al vistiplau the codi. Mútua eficiència the cara The dormir en pau.

## [BLOC VARIABLE 4: CODI FONT PER A L'AUDITORIA]

A continuació vos passe l'estat exacte dels arxius que s'han operat perquè pugueu fer la revisió de divs fantasmes:

### 1. `src/components/universal/UniversalShell.jsx` (Aplanament de Scroll)
```jsx
import React from 'react';
import ActionBar from '../ui/ActionBar';

export default function UniversalShell({
  children,
  title,
  subtitle,
  item,
  variant = 'post'
}) {
  const displayTitle = title || item?.title || 'Sóc de Poble';
  const displaySubtitle = subtitle || item?.subtitle || '';

  return (
    <div className="flex flex-col w-full bg-[var(--sp-light)] min-h-full relative isolate">

      {/* 1. CAPÇALERA DE NAVEGACIÓ */}
      <header className="h-14 flex items-center px-4 bg-[var(--sp-void)] text-[var(--sp-light)] shrink-0 border-b border-white/10 sticky top-0 z-40">
        <h1 className="font-bold text-lg tracking-tight">{displayTitle}</h1>
      </header>

      {/* Zona principal */}
      <main className="flex-1 flex flex-col w-full z-10 relative">

        {/* 2. HERO TARONJA */}
        <section
          className="w-full bg-[var(--sp-accent)] text-[var(--sp-light)] flex items-center justify-center px-6 py-10 shrink-0 min-h-[180px]"
          aria-label="Portada"
        >
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-center leading-none">
            {displaySubtitle || displayTitle}
          </h2>
        </section>

        {/* 3. BARRA DE METADADES */}
        {item && (
          <section className="sticky top-0 z-10 w-full bg-[var(--sp-void)] text-[var(--sp-light)] px-4 py-3 flex items-center gap-3 border-b border-white/10 shrink-0">
            {item.author_avatar ? (
              <img
                src={item.author_avatar}
                alt={item.author_name || ''}
                className="w-10 h-10 rounded-full bg-white/20 shrink-0 object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-white/20 shrink-0 flex items-center justify-center font-bold">
                {item.author_name ? item.author_name.charAt(0).toUpperCase() : 'S'}
              </div>
            )}
            <div className="flex flex-col min-w-0">
              <span className="font-bold leading-tight truncate">
                {item.author_name || 'Sóc de Poble'}
              </span>
              <span className="text-xs opacity-60 font-mono tracking-wider uppercase">
                {item.town_name || 'NODE AUTORITZAT'}
              </span>
            </div>
          </section>
        )}

        {/* 4. CONTINGUT */}
        <section className="flex-1 p-6 md:p-10 bg-[var(--sp-light)]">
          <div className="max-w-4xl mx-auto w-full text-[var(--sp-void)]">
            {children}
          </div>
        </section>

      </main>

      {/* 5. BARRA D'ACCIONS */}
      <div className="sticky bottom-0 w-full z-50">
        <ActionBar
          item={item}
          variant={variant}
        />
      </div>

    </div>
  );
}
```

### 2. `src/pages/public/components/UniversalPageContent.jsx` (Resurrecció Vite)
Açò elimina les referències zombis a `LazyHtmlRenderer` per a desblocar Vite i utilitza un `dangerouslySetInnerHTML` net quan no hi ha components customitzats (shortcodes).

```jsx
// (Fragment Rellevant on abans estava el crash the LazyHtmlRenderer)
// ...
        {canEdit && isEditing ? (
          <div className="w-full custom-scrollbar pt-2">
            <Suspense fallback={<div className="p-8 text-center animate-pulse">Carregant editor...</div>}>
              <RichTextEditor content={formattedHtml} onSave={handleSave} isSaving={isSaving} editable />
            </Suspense>
          </div>
        ) : (
          <div className="app-cms-content w-full relative flex flex-col items-center">
            {children || (hasShortcodes 
              ? <ContentWithShortcodes content={formattedHtml} /> 
              : <div dangerouslySetInnerHTML={{ __html: formattedHtml }} className="w-full h-full" />)}
          </div>
        )}
      </section>
    </article>
  );
});
```

### 3. `src/pages/public/UniversalPage.jsx` (Restauració Llegat)
```jsx
export { default } from './UniversalPage.legacy';
```

### 4. `src/pages/public/ConstitucioPage.jsx` (Recuperació de Ruta via UniversalPageLayout)
```jsx
import React from 'react';
import UniversalPageLayout from '../../components/layout/UniversalPageLayout';
import { CONSTITUCIO_HTML } from '../../data/ConstitucioContent';

export default function ConstitucioPage() {
  return (
    <UniversalPageLayout 
      id="constitucio"
      title="Les Lleis de Pedra Seca" 
      subtitle="El Trellat Codi" 
      coverImage={'/assets/uploads/brain/nano_mixa_socis_1774215027069.png'}
      type="page"
    >
      <div 
        className="universal-content markdown-body w-full" 
        dangerouslySetInnerHTML={{ __html: CONSTITUCIO_HTML }} 
      />
    </UniversalPageLayout>
  );
}
```

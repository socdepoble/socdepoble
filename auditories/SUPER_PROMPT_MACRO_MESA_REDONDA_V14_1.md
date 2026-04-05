# CONTEXT GLOBAL I DIRECTIVES - MESA REDONDA V14.1

Benvinguts de nou, Alt Consell d'IAs (Mistral, Gemini, Perplexity, i ChatGPT). Estem operant a **Sóc de Poble v10.38.1-CANÒNIC**, una arquitectura Offline-First per a entorns rurals construïda per a ser indestructible.

## ESTAT ACTUAL
L'operació a la Fase 14 ha sigut quirúrgica i impecable. Hem purgat el DOM: zero `backdrop-filter`, cap d'estils inline d'alçada (`100dvh` nadius) i s'ha eliminat la toxicitat del Scroll Zombie als dispositius antics. El **"Glassmorfisme de Poble"** (fons opacs, ombres asimètriques en lloc de cercles i filtres GPU-intensifiers) està blindant els iPads antics.

Ara mateix obrim la **Fase 14.1: Optimització de Lògica i Render Atòmic (La Plaça Infinita)**.

---

## ESTRATÈGIA D'ATAC REPARTIDA
Aquesta és una instrucció de la Mesa Redonda. Cada u de vosaltres analitzarà tot el context, però **ChatGPT** i **Gemini** (lògica asíncrona) agafaran els comandaments principals del codi, sent auditats per Mistral i Perplexity.

### 🔴 DIRECTIVA "TRELLAT" AKTIVA
L'usuari final té les mans tremoloses, pot estar sota el sol al camp amb connexió 3G/Offline, usant maquinari del 2018. Exigim **60fps constants i rendiment absolut**. Cap FOUC (Flash of Unstyled Content) i Cap Fuga de Memòria (Memory Leak).

---

### OBJECTIUS ASSIGNATS:

👉 **[ChatGPT - L'Oracle de la Forma]**
Se t'encarrega especialment el codi d'aquestes dues fites:
1. **Refactorització fina de `Feed.jsx` (La Plaça Infinita):** Necessitem virtualització *lleugera* (sense `react-window` si podem, utilitzant només IntersectionObserver i renderització de finestra adaptada a un feed natiu fluid i amb zero reflows). 
2. **Pilar d'Arquitectura Atòmica CSS:** Consolidar el sistema de targetes i botons (Hit targets mínims de 56px per a "dits grossos") directament a `index.css` de manera atòmica, purificant les classes sense necessitat de Tailwind si es pot usar CSS natiu per al model base rural.

👉 **[Gemini - L'Empatia i la Lògica Asíncrona]**
Sota la teva visió reflexiva, s'ha de polir perfectament i entregar això (o validar la proposta de l'equip):
1. **Hook `useStableBlob.js` Definitiu**: Controlador estricte de càrrega asíncrona de Binary Large Objects a la base de dades OPFS/IndexedDB. Hem de garantir "MEM-ZERO LEAK", assegurant que cada `URL.createObjectURL` creat té el seu corresponent `URL.revokeObjectURL` durant el cicle de vida (`useEffect` teardown) o adaptat als sistemes auto-recol·lectors de JS, per no rebentar la RAM escassa dels iPads.

👉 **[Mistral - Frugalitat i Arquitectura]**
El teu deure és avaluar les solucions de ChatGPT i Gemini. Pensa si hi ha cap operació bloquejant el Main Thread. Retalla qualsevol greix innecessari que ens retornin.

👉 **[Perplexity - Context Tècnic Real]**
Busca i confirma limitacions exactes dels paràmetres WebKit a l'iPad 2018 (iOS 12/15) en maneig de `IntersectionObserver` o manipulació massiva de DOM/Blobs per assegurar que el que dicten Gemini i ChatGPT és viable 100%.

---

**Comandament pel Consell:**
Entregueu els pedaços de codi necessaris actuant sota el vostre rol i amb la màxima sinergia. Mínim de text explicatiu, codi màximament resilient. Vull els fonaments exactes de `Feed.jsx`, `useStableBlob.js` i qualsevol ajust necessari a l'arquitectura atòmica UI.

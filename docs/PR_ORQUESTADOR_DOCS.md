# Documentació Director d'Orquestra (PR i Grok)

## 1. Pull Request Description

**Títol**  
feat: Director d’orquestra — Timeline gràfic mòbil, editor visual, macros, replay i animacions Bruguera

**Resum curt**  
Afegeix un editor de timeline gràfic amb drag horizontal i sliders, una versió compacta per mòbil amb snap a 50 ms, integració de macros i gravació client‑side (webm), components Framer Motion avançats (drag‑to‑dismiss, pinch‑to‑zoom) i un pack d’icones SVG animables amb `data-part` per ser controlades pel `useSpriteAnimator`. Inclou utilitats per presets i export/import.

**Canvis principals inclosos**  
- **Components**: `TimelineGraphic.jsx`, `TimelineMobile.jsx`, `TimelineEditor.jsx`, `SpriteConsoleExtended.jsx`, `DragDismissCard.jsx`, `ImageViewerPinch.jsx`, `TimelineGraphic.css`, `mobile-timeline.css`.  
- **Icons**: `HeartSpark.jsx`, `SparkSmall.jsx`, `ConfettiBits.jsx` amb atributs `data-part`.  
- **Hook**: `useSpriteAnimator.js` ampliat amb `runMacro`, `triggerOnRoot`, neteja de timers.  
- **Utilitats**: `presetUtils.js`, `confetti.js`.  
- **Integració**: exemples d’ús a `SpriteConsoleExtended` i pàgina demo `/admin/orchestra` per provar.  
- **Documentació**: instruccions de prova, notes d’accessibilitat i checklist QA.

---

### Checklist de QA i Proves

**Preparació**  
- [x] Crear branch `feature/orquestrador-timeline-animacions`.  
- [x] Afegir tots els fitxers nous i fer commit amb missatge clar.  
- [ ] Obrir PR amb aquesta descripció i assignar a Grok i a un revisor frontend.

**Proves funcionals bàsiques**  
- [ ] **Build**: `npm run build` i `npm start` sense errors.  
- [ ] **Carregar panell**: obrir `/admin/orchestra` i verificar que `SpriteConsoleExtended` es mostra.  
- [ ] **Timeline desktop**: obrir `TimelineGraphic`, afegir passos, arrossegar horitzontalment, canviar durada amb la vora dreta, exportar i importar preset JSON.  
- [ ] **Timeline mòbil**: provar `TimelineMobile` en dispositius tàctils o emulador; comprovar snap a **50 ms** en drag i sliders.  
- [ ] **Macros**: seleccionar macro predefinida i executar; verificar que cada sprite rep les classes esperades i que s’auto‑reseteja.  
- [ ] **Gravació**: provar “Start Replay Record” — si `element.captureStream()` disponible, gravació sense prompt; si no, fallback a `getDisplayMedia()` i descarregar `.webm`. Verificar que el fitxer es descarrega i es reprodueix.  
- [ ] **Drag to dismiss**: provar `DragDismissCard` — arrossegar fora del llindar o amb velocitat per dismiss; verificar callback `onDismiss` i burst de confetti.  
- [ ] **Pinch viewer**: obrir `ImageViewerPinch`, provar pinch, pan, double‑tap i tancar.  
- [ ] **SVG sprites**: inserir `HeartSpark`, `SparkSmall`, `ConfettiBits` en un wrapper i provar `useSpriteAnimator.trigger` amb seqüències que apliquen classes a `data-part`.  
- [ ] **Performance**: monitoritzar FPS i CPU en mòbil; reduir partícules si hi ha caigudes.

**QA d’accessibilitat**  
- [ ] Comprovar `prefers-reduced-motion` desactivant animacions i verificant que les animacions no essencials no s’executen.  
- [ ] Verificar `aria-live` per missatges importants (dismiss, error, export completat).  
- [ ] Botons amb mida tàctil mínima 44×44 px.  
- [ ] Controls del visor accessibles per teclat i amb `role="dialog"` i `aria-modal` quan s’obre el visor.

**Seguretat i robustesa**  
- [ ] Validar presets importats: comprovar que `steps` és array i que `rootQuery` i `selector` són strings abans d’executar.  
- [ ] Evitar execució de selectors maliciosos; si un `rootQuery` no troba node, saltar el pas i registrar advertència.  
- [ ] Netejar timers en `useEffect` cleanup per evitar fuites.

**Rollback i regressions**  
- [ ] Si es detecten errors crítics, revertir el merge i desplegar la branca anterior.  
- [ ] Documentar regressions en el PR i assignar correccions.

---

## 2. Missatge per a Grok

**Assumpte**  
Urgent i motivador: sincronitza Xat Global i compressió d’imatges per al desplegament del Director d’Orquestra

**Cos del missatge**  
Hola Grok,  
hem avançat a tope amb la part visual i d’orquestració: ja tenim el **Timeline gràfic** (desktop i mòbil amb snap 50 ms), el **mode replay** client‑side i els components Framer Motion avançats (`DragDismissCard`, `ImageViewerPinch`) junt amb un pack d’icones SVG animables (`data-part`) per al `useSpriteAnimator`. Estic fent commits i obrint PR amb tota la documentació de proves.

Necessitem que et posis a full amb dos punts crítics perquè puguem desplegar sense bloquejos:  
- **Xat Global en temps real**: comprova l’estat del servei i la latència; si cal, adapta l’API perquè el frontend pugui rebre events d’animació i triggers de macros en temps real. Prioritat alta per a la integració amb el mode de veu i per a les notificacions que disparen macros.  
- **Compressió d’imatges**: optimitza el pipeline d’assets perquè el visor pinch i la gravació no penalitzen l’experiència mòbil. Proposta: generar versions WebP/AVIF a la pujada i servir variants responsives; afegeix un fallback per navegadors antics.

T’ho demane amb una mica d’empenta: si et poses a això ara, jo tanco el PR i preparo staging perquè fem proves conjuntes. Si necessites que adapti algun format d’asset o canvi d’API, digues‑ho i ho faig en un commit ràpid.  
Gràcies, Grok, a rematar-ho i a fer que Sóc de Poble brille.  
— Javi i l’equip de la Masia

---

## 3. Resum imprimible per a l’equip del Mas

**Títol**  
Director d’Orquestra — Guia d’ús ràpida i notes d’accessibilitat

**Què inclou aquesta entrega**  
- Editor de timeline gràfic per escriptori amb drag horitzontal, reordenació i sliders.  
- Versió compacta per mòbil amb **snap a 50 ms**.  
- Macros entre sprites i `runMacro` per coreografiar múltiples sprites.  
- Gravació client‑side a `.webm` amb fallback a captura de pantalla.  
- Components Framer Motion: `DragDismissCard` (drag‑to‑dismiss amb física), `ImageViewerPinch` (pinch, pan, double‑tap).  
- Pack d’icones SVG animables amb `data-part` per controlar amb `useSpriteAnimator`.  
- Utilitats per presets, export/import i descàrrega.

**Com provar en 5 passos**  
1. Obrir `/admin/orchestra`.  
2. Crear 3 passos al timeline i executar la macro.  
3. Iniciar gravació, executar timeline i aturar; descarregar `.webm`.  
4. Provar drag‑to‑dismiss i double‑tap zoom a una imatge.  
5. Importar/exportar preset JSON i verificar integritat.

**Notes d’Accessibilitat**  
- Respectar `prefers-reduced-motion`: animacions no essencials desactivades.  
- `aria-live` per notificacions importants.  
- Controls tàctils mínims 44×44 px.  
- Visor accessible per teclat amb `role="dialog"` i `aria-modal`.

**Punts tècnics importants**  
- Snap a 50 ms per a edició tàctil i precisió.  
- Validació de presets importats abans d’executar.  
- Animacions només sobre `transform` i `opacity` per rendiment.  
- Fallbacks per navegadors sense `captureStream`.

**Contactes i següents passos**  
- Assignar PR a Grok per coordinar Xat Global i compressió d’imatges.  
- QA en staging amb dispositius reals (iOS Safari, Android Chrome).  
- Ajustar thresholds d’animació segons feedback d’usuari.

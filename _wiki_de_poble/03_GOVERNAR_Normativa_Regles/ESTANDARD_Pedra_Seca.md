---
estat: "canonic"
tipus: "norma"
description: "Defineix Pedra Seca com un criteri de simplicitat, accessibilitat i dependències justificades."
---
# ESTÀNDARD PEDRA SECA

## 0. Dictamen Canònic

La contradicció queda resolta així:

**Pedra Seca no és Tailwind. Pedra Seca no és React. Pedra Seca no és cap framework.**

Pedra Seca és la llei de construcció de [[el_projecte|Sóc de Poble]]:

1. **HTML semàntic** per a l’estructura.
2. **CSS natiu amb variables `--sp-*`** per al vestit visual.
3. **JavaScript mínim i preferentment Vanilla** per al comportament.
4. **Accessibilitat i rendiment iPad A10** com a tribunal final.
5. **Cap dependència visual pot convertir-se en font de veritat.**

Tailwind queda **prohibit com a [[identitat_visual|identitat visual]], sistema de disseny o font de tokens**.

Tailwind queda **tolerat només com a bastida de Forja**, sota condicions estrictes, reversibles i auditables.

---

## 1. Llei Inamovible

La font de veritat visual de Sóc de Poble és el CSS canònic del projecte.

Tot color, radi, ombra, espaiat estructural, tipografia, mida tàctil i estat visual ha de vindre de variables semàntiques:

```css
--sp-color-*
--sp-espai-*
--sp-radius-*
--sp-font-*
--sp-touch-*
--sp-shadow-*
```

Si un valor no existeix en el registre `--sp-*`, **no existeix per al Mas**.

Els colors corporatius únics i definitius, lliures de tota contradicció, són el Taronja `#FF7300` i el Blau `#0984E3`.

---

## 2. Separació Sagrada

| Capa | Responsabilitat | Tecnologia preferent |
|---|---|---|
| Persona | Contingut i semàntica | HTML natiu |
| Vestit | Marca, color, espai, ritme visual | CSS natiu amb tokens `--sp-*` |
| Cervell | Interacció i estat | Vanilla JS o codi mínim justificat |
| Forja | Construcció, prototip, carcassa externa | Vite/React/Tailwind només si cal |
| Governança | Lleis i límits | `03_GOVERNAR` |

Cap capa pot envair l’altra.

Un component no pot guardar identitat visual dins de classes utilitàries disperses. La identitat visual viu en tokens i classes semàntiques.

---

## 3. Ús Canònic: Core de Sóc de Poble

En el Core, Targeta Universal, components crítics, fluxos per a gent major i pantalles offline-first:

### Obligatori

- HTML semàntic.
- CSS natiu.
- Classes semàntiques pròpies: `.sp-card`, `.sp-button`, `.sp-panel`, `.sp-nav`.
- Tokens `--sp-*`.
- Àrea tàctil mínima de 48px.
- Text base mínim de 16px.
- DOM essencial llegible sense dependre d’un client JS pesat.

### Prohibit

- Tailwind estètic.
- Classes de color: `bg-*`, `text-*`, `border-*` quan expressen marca.
- Classes de radi: `rounded-*`.
- Classes d’ombra: `shadow-*`.
- Valors arbitraris: `bg-[#...]`, `w-[...]`, `rounded-[...]`.
- Disseny generat des de memòria de model sense llegir els tokens canònics.
- Llibreries UI pesades si HTML/CSS natiu resol el problema.

---

## 4. Excepció de Forja

Tailwind només s’accepta en la Forja quan es compleixen totes aquestes condicions:

1. El codi viu en un entorn de construcció, prototip, Playground o carcassa externa.
2. No defineix marca, identitat visual ni tokens.
3. Només s’usa com a bastida d’estructura: `flex`, `grid`, `items-*`, `justify-*`, `relative`, `absolute`, `w-full`, `h-full`.
4. No introdueix colors, radis, ombres, tipografia o estats visuals.
5. El resultat final passa auditoria iPad A10.
6. El CSS final queda purgat i amb pressupost de pes justificat.
7. L’excepció queda registrada en una acta o frontmatter.
8. Qualsevol component promogut de Forja a Core ha de ser traduït a classes semàntiques `sp-*`.

Conclusió: **Tailwind pot ajudar a alçar una bastida, però no pot quedar-se a viure dins del Mas.**

---

## 5. React i Vite

React i Vite no són dogma fundacional. Són eines de Forja.

S’accepten quan:

- La carcassa tècnica ja els utilitza.
- Sollutia o un entorn extern els requereix.
- El component és complex i la reactivitat aporta simplicitat real.
- No degraden l’experiència en iPad A10.
- El contingut essencial continua sent accessible, indexable i resilient.

S’han d’evitar quan:

- Una pantalla pot fer-se amb HTML, CSS i Vanilla.
- El component només mostra informació estàtica.
- La dependència crea més pes cognitiu que benefici.
- La solució exigeix llibreries de UI no imprescindibles.

---

## 6. Antipatrons Letals

Activen revisió immediata:

1. Convertir Tailwind en sistema de marca.
2. Duplicar tokens entre `tailwind.config`, CSS i components.
3. Escriure colors corporatius a mà.
4. Fer components que només funcionen amb JavaScript carregat.
5. Afegir dependències per evitar pensar HTML.
6. Usar classes utilitàries fins que el component siga il·legible.
7. Justificar overhead amb “és més ràpid de desenvolupar” sense prova A10.
8. Confondre prototip amb codi homologat.

---

## 7. Criteri d’Homologació

Un component Pedra Seca queda homologat si respon “sí” a tot:

- Funciona en iPad A10 sense ofegar-se?
- Es pot llegir el DOM sense entendre el framework?
- Els colors i mides venen de `--sp-*`?
- El text és llegible per gent major?
- El botó principal té mínim 48px?
- El contingut essencial existeix sense esperar una cascada de JS?
- L’arquitectura redueix dependències en lloc d’augmentar-les?
- Una IA futura sabrà modificar-lo sense inventar-se el sistema visual?

Si una resposta és “no”, el component torna a la Forja.

---

## 8. Relació amb la BIOS històrica

La [[00_BIOS|BIOS]] conserva com a arxiu la intuïció:

**Zero Overhead. Vanilla per defecte. iPad A10 com a jutge.**

La norma vigent és este estàndard, que concreta la interpretació tècnica:

- “Tailwind prohibit” significa: prohibit com a estètica, marca i font de veritat.
- “Tailwind tolerat” significa: permés només com a bastida temporal o estructural en Forja.
- “React/Vite acceptats” significa: eines condicionades, mai identitat del projecte.

---

## 9. Sinapsis

- [[00_BIOS]]
- [[01_trellat]]
- [[DOC_Governanca]]
- DOC_Seguretat
- [[a11y_seo_trellat|a11y_trellat]]
- [[a11y_seo_trellat|seo_trellat]]
- [[Soci_Sollutia]]

## 10. Frontera Arquitectònica (Veredicte Opció C)

**Decisió Canònica:** React/Vite és la carcassa productiva legítima. No es forçarà la creació d'un `src/core` pur per decret; aquest es construirà de manera incremental quan s'extraguen casos d'ús reals.

**Frontera de Dependència (Direccional):**
- La direcció inamovible és: `UI React -> Core Pur -> Ports/Adaptadors`.
- Es deroga la prohibició bilateral d'imports: la UI pot importar del Core.
- El Core (quan existisca) mai pot importar React, DOM, Tailwind ni Supabase.

Aquesta clàusula preval sobre qualsevol decisió històrica prèvia. Pedra Seca governa la qualitat del mur, no obliga que totes les pedres siguen Vanilla JS des del dia u.


## Taxonomia
- **Categoria:** [[Govern]]
- **Etiquetes:** [[Graf]]

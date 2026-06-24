---
tags: [constitucio, manaments, normes, pedra-seca, fsd]
aliases: [Constitució, 10 Manaments]
---
# 🏛️ CONSTITUCIÓ DEL SISTEMA SOSP

Aquestes regles són innegociables, fonamenten la identitat tècnica i humana de **Sóc de Poble**. Qualsevol desenvolupament, estil o component que les incomplisca serà rebutjat automàticament per l'arquitectura.

## I. El [[Trellat]] és la llei suprema
Si una regla entra en conflicte amb el sentit comú, preval el Trellat.

## II. El contingut és primer
La informació sempre és més important que la decoració.

## III. HTML abans que CSS (La Persona i el Vestit)
La semàntica correcta té prioritat sobre qualsevol estil visual. Mai modificaràs l'estructura semàntica per arreglar estils. L'esquelet és pur, el vestit és autònom.

## IV. CSS abans que Tailwind
Tailwind només pot organitzar l'esquelet (`flex`, `grid`, `gap`, `w-full`, etc.). La pell (colors, radis, ombres, fons) pertany al sistema [[Pedra Seca]] via CSS pur i classes semàntiques.

## V. Variables abans que valors (Codi Penal Estricte)
Mai s'escriuran colors, radis o espais fixes quan existisca un token oficial. **PROHIBIT** l'ús de valors hardcodejats com `#FF7300` o `28px`.

## VI. Components abans que pàgines
Cap pantalla inventarà estils nous si poden heretar-se dels components universals (ex: `<UniversalCard>`, `<UniversalButton>`).

## VII. Local abans que remot (Termodinàmica PWA)
La funcionalitat ha de sobreviure a una connexió deficient. A més, zero JavaScript per a animacions: tota transició es delegarà exclusivament a la GPU mitjançant CSS pur (optimització xip A10).

## VIII. Accessibilitat abans que espectacularitat (Mode Bancal)
Mode Bancal preval sobre qualsevol decisió estètica.
- Fons Taronja exigeix Text **Negre** (mínim 8.5:1). Prohibit text blanc sobre taronja.
- Fons Blau exigeix Text **Blanc** (mínim 4.8:1).
- Àrea tàctil generosa (mínim 48x48px o 56px) per a "dits de llaurador". Text mínim 16px per evitar auto-zoom a iOS.

## IX. Mort del Fantasma (`<hr>`)
L'etiqueta `<hr>` (i el `---` de Markdown intern de contingut) està totalment proscrita per defecte a la UI genèrica. Tota separació visual naixerà exclusivament de la jerarquia d'encapçalaments (H1 a H6).

## X. La Masia ha de resistir sola
Cada component ha de poder existir de manera independent sense dependències ocultes. Si una regla amenaça la usabilitat crítica offline, l'enginyer té permís per trencar-la mitjançant el **Master Bypass** justificant-ho correctament.

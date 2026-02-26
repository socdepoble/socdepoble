# Protocol de Branding Sóc de Poble: NanoBanana Prompts

Aquest document estableix les regles d'or per a la generació d'actius visuals (infografies, art, promocions) mitjançant IA (NanoBanana), garantint la immutabilitat de la marca.

## La Regla d'Or: El Logotip és Intocable

La marca "Sóc de Poble" no es pot representar amb tipografies genèriques ni versions inventades per la IA. S'ha de tractar com la identitat d'una persona.

### Estratègia d'Implementació: "Branding Overlay"

Davant la impossibilitat tècnica de les IAs actuals de renderitzar logotips amb fidelitat absoluta del 100%, s'ha d'adoptar l'estratègia **Overlay**:

1. **Generació (IA)**: El prompt ha de demanar un espai buit o "placeholder" rectangular fosc a la part superior.
2. **Superposició (Codi)**: S’ha d’utilitzar el fitxer canònic `/assets/master/logo_socdepoble_white_full.png` superposat via CSS/React sobre la imatge generada.

## El Prompt Universal (Copiar i Adaptar)

Sempre que es demane una nova imatge a NanoBanana, s'ha d'incloure aquest bloc de "Negative Constraints" i "Identity Rules":

```text
[DESCRIU EL CONTINGUT AQUÍ]

BRANDING RULES:
1. FORMAT: Always SQUARE 1:1.
2. IDENTITY: Do NOT attempt to write the text "Sóc de Poble".
3. PLACEHOLDER: Leave a clean, dark rectangular space at the top center for a logo overlay.
4. SIGNATURE: Add a very small and subtle text in the lower right corner: "Autor: NanoBanana".
5. AESTHETIC: High-end 2026 tech-rural fusion. Cinematic dark tones with bategant glows (Primary Orange #FF6B00, Secondary Teal).
6. NO GENERIC FONTS: Avoid any generic serif/sans-serif text within the image art.
```

## Formats Admesos per Secció

- **Avís Legal / Filosofia**: Quadrat 1:1.
- **Mur (Feed)**: Exploratori (Quadrat o Vertical).
- **Botiga**: Quadrat 1:1.

## Actius Canònics

- Logotip Blanc: `public/assets/master/logo_socdepoble_white_full.png`
- Logotip Negre: `public/assets/master/logo_socdepoble_black_full.png`
- Color Primari: `#FF6B00` (Orange Bategant)
- Color Secundari: `#06B6D4` (Cian Digital)

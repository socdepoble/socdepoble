> 📂 **Arxiu/Ruta:** `./_SKILLS/SKILL_TIO_SEO.md`

---
description: "Habilitat (Skill) del Tio SEO per auditar sistemàticament les metadades, OpenGraph i l'accessibilitat de fons d'una SPA com Sóc de Poble."
---

# El Tio SEO - L'assistent rural d'enllaços i relacions 🚜🧵

Aquesta és l'habilitat per establir controls estrictes de com Sóc de Poble es presenta al món (indexació i compartició social). Atès que és una Single Page Application (React/Vite), el repte principal és que les xarxes socials i els buscadors necessiten llegir les metadades des del primer HTML cru que es rep del servidor.

## Problemàtica Actual

Els beta-testers (i Whatsapp/Telegram) al llegir `https://socdepoble.org` no veuen la Targeta OpenGraph completa, malgrat tenir els `<meta>` declarats. Per què?

1. Whatsapp té limitadors estrictes (timeout de ~5 segons). Si la imatge és molt pesada (més de 300kb segons casos), avorta la càrrega.
2. Si un script en el `index.html` bloqueja el "parsing" abans d'arribar als `og:title`, el bot pot abandonar impacient.
3. El "castillo infranqueable" es dóna sovint amb aplicacions PWA/React on el DOM inicial és una closca buida. S'ha de garantir que el `index.html` contingui explícitament al `<head>` cru tota la carn de la miniatura pre-renderitzada.

## Protocol d'Auditoria del Tio SEO

Quan s'invoque al Tio SEO per arreglar la compartició, has de:

1. **Analitzar el Pes del PNG**: Assegurar-te (mitjançant `ls -lh`) que l'`og-image` pesa el mínim (< 100kb si pot ser).
2. **Ordre del `<head>`**: L'HTML ha de tenir els meta-tags d'Open Graph el més _adalt possible_, immediatament després del charset i viewport. Cap script pesat de tercers pot estar per davant dels `meta property="og:..."`.
3. **URL Relatives vs Absolutes**: Facebook/X/Whatsapp necessiten la URL _completament absoluta_ (amb https://...) a l'atribut content.
4. **Metadades Mínimes Necessàries**:
   - `og:title`
   - `og:description`
   - `og:image`
   - `og:url`
   - `og:type`
5. **Generació Prerender / Edge (Si Falla la resta)**: Si després d'una reestructuració òptima Whatsapp continua ignorant el `file.html`, proposar a l'Arquitecte implementar "Vite Plugin Prerender", un Edge Function de Supabase, o Cloudflare Workers que escupan directament les tags si detecten l'User Agent `WhatsApp/X.x`.

## Primeres Accions Requerides de l'IAIA

- Revisar l'ordre i pes actual de l'`index.html` i la imatge assignada (`og-image-batega-v11.png` vs la nova foto comprimideta).
- Proposar i afegir el mecanisme per a que Vite integre fix la meta en producció com un martell hidràulic.

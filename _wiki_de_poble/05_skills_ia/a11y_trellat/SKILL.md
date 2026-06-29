---
name: a11y-trellat
description: >-
  Directrius d'accessibilitat i usabilitat festiva per a Sóc de Poble. Enfocat a
  la facilitat d'ús, UX, botons grans i semàntica clara en valencià.
authority: Consell de les 11 IAs
version: V21
created_at: '260628_0525'
updated_at: '260628_1618'
---
# Skill: Accessibilitat de Poble i Usabilitat Festiva (A11Y Trellat)

Aquesta habilitat s'ha d'activar sempre que es desenvolupen interfícies, botons, formularis, fluxos de navegació o micro-interaccions, per assegurar que qualsevol persona, especialment la gent major, puga utilitzar l'aplicació sense frustracions.

## 1. Àrea de Contacte (Touch Targets)
- **AÇÒ NO:** Botons menuts o enllaços de text amagats que requereixen precisió de cirurgià (com els antics 44px o menors).
- **AÇÒ SÍ:** Tot element interactiu ha de tindre una àrea mínima de **48x48 píxels** (mida dit estàndard de llaurador, citant `--sp-touch-min`). Fes servir el *padding* per ampliar l'àrea de clic sense deformar el disseny. Ideal: 56x56px per a botons principals (`--sp-touch-cuspide`).

## 2. Etiquetes ARIA Nostrades
- **AÇÒ NO:** `aria-label="Close modal"`, `aria-label="Submit form"`. (Som un projecte 100% en valencià).
- **AÇÒ SÍ:** `aria-label="Tancar finestra"`, `aria-label="Enviar formulari"`. Tota l'accessibilitat per a lectors de pantalla ha d'estar estrictament en valencià.

## 3. Semàntica Pura
- Evita introduir llibreries d'accessibilitat pesades si no és absolutament necessari. Confia en l'HTML semàntic natiu (`<button>`, `<nav>`, `<main>`, `<dialog>`). Això és Pedra Seca.

## 4. No a l'Scroll Infinit
- **AÇÒ NO:** Pàgines que carreguen contingut sense fi i on l'usuari es perd i no sap on està.
- **AÇÒ SÍ:** La informació s'ha de presentar de forma sòlida i compartimentada. L'usuari ha de saber sempre on comença i on acaba la pàgina, igual que sap on comencen i acaben els bancals.

## 5. Feedback de la Petorreta
- **AÇÒ NO:** Botons estàtics que no fan res quan els toques, deixant el dubte de si l'iPad ha fallat.
- **AÇÒ SÍ:** Les accions principals han de tindre un feedback immediat i clar. Un xicotet canvi visual, un canvi de color ràpid (activa, focus, hover), com una "petorreta" visual que indica "T'he sentit!".

## 6. Alegria però amb Trellat
- Les interfícies poden tindre tocs d'alegria, color o referències a la cultura de la festa (Fadrins i Fadrines), però mai a costa de la llegibilitat. El contrast del text sempre ha de ser òptim.

---

## 📊 Mètriques de Salut (Bloc D i UX)
Aquesta SKILL vigila la fluïdesa interactiva de l'iPad A10 i la satisfacció humana:
- **TRD (Temps de Resposta del DOM / INP):** Mesurar interaccions clau. Alertar i optimitzar si és > 100ms.
- **ISU (Índex de Satisfacció de l'Usuari):** Recollir feedback o detectar rage-clicks.

---

## 🔗 Sinapsi Arquitectònica
- [[05_skills_ia/arquitectura_pedra_seca/SKILL|arquitectura_pedra_seca]]

- [[00_index|Índex Central]]

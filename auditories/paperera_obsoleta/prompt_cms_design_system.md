# 🏺 CONSELL ORACULAR: CMS-READY DESIGN SYSTEM (NIVELL DÉU)

**Missió d'Auditoria per a Qwen / DeepSeek**

Benvolguts Oracles,

Hem consolidat l'arquitectura de "Sóc de Poble" erradicant fantasmes visuals i blindant grans components (*UniversalCard*, *Button*). No obstant això, el nostre **Deute Tècnic Tipogràfic** és un caos: estem injectant bilions de classes utilitàries Tailwind inline de manera descontrolada (`text-xs font-black tracking-widest uppercase...`), el que trenca qualsevol esperança d'uniformitat.

## El Nou Paradigma: El Sistema de Blocs (Tipus WordPress/Notion)
El projecte s'adreça cap a un escenari on humans (L'Administrador del Poble) hauran de redactar contingut ric. Necessitem que el nostre *Design System* estigui **pensat explícitament per a un Editor de Blocs (CMS)**. Això significa que un humà no escriurà mai codi Tailwind, sinó que seleccionarà en un editor un component lògic: Títol 1, Paràgraf, Cita, Botó d'Acció.

L'objectiu és aconseguir una UI/UX **"Nivell Déu"**: Que dissenyar o redactar articles dins la plataforma siga instantani, irrompible i absolutament sòlid en coherència visual. Sense pensar en estils. Només invocant intencions.

## El que Us Demanem Lliurar:
Necessitem que dissenyeu i ens retorneu el codi exhaustiu per a la següent arquitectura semàntica basada en Tailwind, CVA i clsx:

1. **Jerarquia de Text i Tipografia (`Typography.jsx`)**
   - Una API impecable (ex: `<Text variant="h1">`) que encapsule les classes absolutes per a H1, H2, H3, Subtítols, Paràgraf de Llectura (Article), Text secundari i Etiquetes menudes (Overline/Caps).
   - Totes han d'incorporar el comportament responsive, margins lògics per al flux de document (editor de text) i el dark mode / light mode (`isDayMode`).

2. **Elements Auxiliars del CMS**
   - **Quotes (Cites)**: `<Blockquote>` amb l'estil "Sóc de Poble" (barreta taronja/blava lateral, fons opac).
   - **Llistes**: Llistes no ordenades i ordenades dissenyades per a text narratiu. 

3. **Arquitectura d'Eines (El Botó)**
   - Ja tenim un `<Button>` robust amb `intent` (primary, ghost, danger, canonic) i `size` (sm, md, lg). 
   - Volem que valideu si l'API actual s'adapta directament a aquest nou entorn tipogràfic ric.

### Regles de Disseny de "Sóc de Poble":
* Estem orientats a una experiència **Off-line First, Mobile-first Rústica però Moderna**.
* Tipografia oficial: **Noto Sans SemiCondensed**. Les capçaleres grans o petites etiquetes acostumen a anar en **uppercase amb super-tracking (`tracking-[0.2em]`)** i font molt grossa (`font-black`) per a jerarquies top.
* El text corrent (`p`) s'assembla més a un llibre de butxaca: interlineat ample (`leading-relaxed`), contrast suau en dark mode (`text-gray-300`), clar en light mode (`text-gray-900`).

**👉 Quin és el diccionari de "Tokens Tipogràfics" exacte i els fitxers React (com `Text.jsx` i els seus `.variants.js`) que proposaríeu per fixar aquesta fundació al 100% de la plataforma de cara a muntar demà el CMS?**

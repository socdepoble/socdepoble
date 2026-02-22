---
description: Reglas de oro para la usabilidad móvil y diseño táctil en Sóc de Poble
---

# Manual de Usabilidad Móvil: Sóc de Poble

Este documento establece los principios de diseño para asegurar que la aplicación sea fácil de usar, especialmente en dispositivos móviles.

## 1. El Modal como "Bottom Sheet"

En dispositivos móviles, los modales deben comportarse como hojas que emergen del fondo.

- **Anclaje:** `align-items: flex-end`.
- **Bordes:** Esquinas superiores redondeadas (`20px+`).
- **Navegación:** Siempre debe haber un botón de cierre visible (`X`) y soporte para el gesto de "atrás".

## 2. Optimización del Espacio Vertical

El teclado del móvil ocupa casi el 50% de la pantalla. Los formularios deben ser compactos.

- **Scroll Lateral:** Usa contenedores con `overflow-x: auto` para listas de opciones (etiquetas, filtros) en lugar de listas verticales.
- **Prioridad de Entrada:** El área de texto principal debe tener un `flex: 1` para expandirse o contraerse según el espacio sobrante.
- **Elementos Mini:** Usa versiones compactas de selectores (ej: `EntitySelector mini`).

## 3. Ergonomía Táctil (Zona del Pulgar)

Los elementos críticos deben estar al alcance del pulgar sin esfuerzo.

- **Acciones Principales:** El botón de "Enviar" o "Guardar" debe estar preferiblemente en la esquina inferior derecha o ser un botón de ancho completo sobre el teclado.
- **Tamaño de Toque:** Los elementos interactivos deben tener un área mínima de `44x44px`.

## 4. Adaptabilidad al Teclado

- **Safe Areas:** Usa `env(safe-area-inset-bottom)` para evitar que el contenido quede oculto por el notch o bordes del sistema.
- **Transiciones:** Emplea animaciones suaves (`cubic-bezier`) para la entrada de componentes táctiles.

## 5. Claridad y Transparencia

- **Avisos de IAIA:** Todos los contenidos generados por la IA deben incluir un aviso de transparencia clicable que explique su origen, manteniendo siempre la confianza del usuario.

## 6. Riquesa Multimèdia i Emoticones Bategats

Per mantenir la sintonia amb la tipografia gran i el nivell premium de la v15:

- **Multimèdia en Xat:** El xat de l'IAIA ha de permetre l'adreça de fotos i vídeos com a prova documental. Les previsualitzacions han de seguir l'estètica de "The Vault" (bordes arrodonits, overlays de vidre).
- **Emoticones Gegants:** Si un missatge conté _només_ emoticones, aquestes s'han de mostrar a un tamany de **32px a 44px**, assegurant que bateguin amb la mateixa força que els nostres titulars.
- **Micro-interaccions:** L'enviament de fitxers ha de ser instantani visualment (feedback immediat) mentre es processa el bategat al rerefons.

## 7. Adoptivitat via Familiaritat (WhatsApp Protocol)

Per minimitzar l'esforç d'aprenentatge de l'usuari final:

- **Clonatge Estètic:** Si un patró (com el menú d'adjunts) ha estat validat per milions d'usuaris (WhatsApp), el copiarem sense pudor per assegurar una adopció immediata.
- **Iconografia Canònica:** Utilitzarem colors i formes familiars per a "Arxiu", "Fotos", "Enquesta", etc.
- **Interfície Predictible:** Prioritzarem que l'usuari se senti "com a casa" per sobre de la innovació gratuïta en fluxos crítics.
- **Jerarquia d'Accés:** Les opcions més usades mai han de requerir més de 2 clics des del Hub Central.

## 8. Robustesa Visual i Protocol Anti-Desbordament 🛡️🏺

Per evitar que les tipografies grans (v15+) trenquin el layout o generin marcs massa estrets:

- **L'Imponent Paràgraf:** Cap paràgraf (`p`) del sistema pot tenir un tamany inferior a **1.15rem** (~18.5px). Les descripcions de capçalera han de pujar a **2xl** (24px+) per garantir un impacte sobirà.
- **Marcs Sobirans:** Cap columna de graella (`grid-cols`) ha de baixar de **340px** d'amplada efectiva. S'abusarà del col·lapse a 1 columna per protegir la integritat del text gegant.
- **Respiració Tipogràfica:** Els paràgrafs grans han de tenir un `line-height` de **1.6** per evitar l'asfíxia visual del bategat textual.
- **Contenidors Elàstics:** Les targetes (`cards`) no han de tenir `height` fixes; es mouran amb `min-h` per permetre el creixement orgànic de la informació.
- **Verificació Forensic:** Abans de donar una secció per acabada, s'ha de comprovar amb el **Mode Plànol** que no hi ha "overlap" entre capes tipogràfiques.

## 9. Protocol de Banner Promocional i Presentació 🎭✨

Per a finestres de benvinguda, anuncis o pantalles de promoció:

- **Eixida d'Emergència:** Tot banner ha de tenir un botó de tancament (X) clar, gran (mínim 56x56px) i situat a la zona segura superior dreta. El text "TANCAR" o "OMITIR" és recomanat per a màxima claredat.
- **Zona de Respiració:** El botó de tancament ha de tenir un `z-index` superior a 50 i estar fora del flux del contingut per evitar clics accidentals.
- **Contrast Implacable:** Prohibit l'ús de grisos clars sobre blancs o negres suaus. Els banners informatius de Llicència o Promoció han d'utilitzar el **Negre Mestre (#000000)** com a fons per forçar la nitidesa del text blanc.
- **Protocol "Clic-Fora":** Tota finestra emergent ha de poder ser tancada fent clic a l'overlay de fons (zona buida), reduint la fricció al navegar.
- **Impacte Tipogràfic:** Els titulars de presentació seguiran la norma **v15** (`text-5xl` i superiors) amb lletra italic i font black.

## 10. Protocol de Navegació Dual (Escriptori/Tauleta vs Mòbil) 🏛️📱

El sistema s'adapta al context d'ús per maximitzar l'accés a la informació:

### 🖥️ Mode Escriptori / Tauleta (>= 768px)

- **Oberta per Defecte:** La sidebar es mostra oberta automàticament en iniciar la sessió per facilitar l'accés universal als Pilars del Mas. S'inclouen tauletes com l'iPad Mini.
- **Llibertat Total:** L'usuari pot tancar la sidebar en qualsevol moment mitjançant el botó de menú si desitja prioritzar l'espai d'escenari. No és una barra bloquejada.
- **Menú Inferior Ocult:** Només es mostra quan la sidebar és el recurs principal o l'usuari està en mòbil de mida petita.

### 📱 Mode Mòbil (< 768px)

- **Sidebar Col·lapsada per Defecte:** La sidebar es tanca automàticament per alliberar espai. És accessible mitjançant el botó de menú superior (drawer).
- **Menú Inferior Canònic (Bottom Nav):** Apareix un menú a la part inferior amb els enllaços principals. Ha de ser sempre visible i amb un z-index superior (`z-[3000]`).
- **Jerarquia de Sidebar:** El header de la sidebar utilitza el **Negre Mestre** per diferenciar-se clarament de l'escenari.

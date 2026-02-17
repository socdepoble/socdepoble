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

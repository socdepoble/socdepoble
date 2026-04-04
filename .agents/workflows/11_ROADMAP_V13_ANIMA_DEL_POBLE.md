---
description: Roadmap V13 - L'ànima del Poble (Features con Alma y Soberanía Rural)
---

# ROADMAP V13: L'ÀNIMA DEL POBLE

La versión V12 ha sido certificada como 10/10 (Indestructible). El foco arquitectónico y estratégico se desplaza hacia la **V13**, centrada en el empoderamiento de la gente mayor, la resiliencia offline total y la preservación del legado cultural rural (Local-First).

## 1. Núcleo Técnico y Resiliencia (Soberanía de Datos)
- **Modo Offline Avanzado:** Cachear todo el contenido localmente usando IndexedDB o SQLite (CRDTs estilo ElectricSQL/Automerge).
- **Mesh Rural y Peer-to-Peer:** Sincronización entre vecinos cuando no hay conexión a internet estable. Funciona 100% offline.
- **Traducción Offline:** Descargar modelos ligeros (TinyML, ONNX Runtime) para garantizar la traducción sin depender de la nube.
- **Caja de Resistencia Digital:** Almacenamiento local para cada familia, cifrado y descentralizado (uso de tecnologías como IPFS).

## 2. IAIA Voz 2.0 (El Asistente para Mayores)
- **Pipeline Adaptativo en 5 Capas:**
  1. *Detección de Connectivitat:* Enrutamiento automático basado en `navigator.connection` (Plaça del poble vs Cova sense cobertura).
  2. *Captura de Audio Avanzada:* `MediaRecorder API` con `sampleRate: 16000` (mono) acoplada a una cadena de `Web Audio API` (HighPass Filter a 100Hz + DynamicsCompressor) para supresión de viento y ruido de plaza en tiempo real.
  3. *Inferencia Dual:*
     - Online: `Web Speech API` (ca-ES natico en Chrome, zero bytes).
     - Offline: Whisper-tiny quantizado `q4` (31MB) vía WebAssembly (`@huggingface/transformers.js`), almacenado vía Cache API y securizado con cabeceras `COOP/COEP` para `SharedArrayBuffer`.
  4. *Procesamiento de Intents:* Motor NLP de emergencia basado en Regex locales (Inici, Tradueix, etc.) con fallback a Edge Functions si hay red.
  5. *Modo Voz Pura (UI sin fricciones):* Pantalla negra absoluta, un único icono interactivo parpadeante que responde con retroalimentación háptica y subtítulos (WebVTT) para sordera severa.
- **Transcripción y Legado Automático:** Graba la historia, la transcribe al valencià/català y crea metadatos invisibles.
- **Modo "Eco Digital":** Podcast o repositorio familiar autogenerado tras el fallecimiento, como legado vivo de la tradición oral.
- **IAIA Guía Cultural:** Uso de LLMs locales destilados para generar interacciones conversacionales, resúmenes e incluso poesía local sin extractivismo hacia la nube.

## 3. Features con Alma (Impacto Social Directo)
- **Mapa Vivo de Capas de Memoria (Contra la "Toponymic Erasure"):** Mapas (Leaflet / Mapbox) donde la comunidad añade los nombres tradicionales de calles, fuentes secas o molinos, evitando la pérdida del vocabulario geográfico frente a la nomenclatura oficial.
- **Xarxa de Cures Veïnal (Anti-Aïllament):** Tablón Local-First para solicitar u ofrecer favores cotidianos (transporte médico, compra) sin intermediarios empresariales.
- **Programa Generación↔Generación:** Sistema de conexión donde los mayores enseñan oficios ancestrales (hacer pan, curar campos) y los jóvenes enseñan habilidades digitales (videollamadas, uso de interfaces).
- **Círculos de Historias Vivas:** Sesiones virtuales semanales de voz, moderadas silenciosamente por la IAIA para crear un "llibre viu" colectivo y abatir la soledad no deseada.
- **Formatos Ancestrales:** Exportar la plataforma a lectores de tinta electrónica (e-ink) o Epubs para facilitar la lectura a la gente mayor (Puppeteer, Epub.js).

## 4. Infraestructura Comunitaria Soberana (P2P y Preservación)
- **Mercat Local Digital P2P:** Intercambio directo entre vecinos (productos agrícolas, servicios locales) con certificados de origen basados en GPS para combatir el greenwashing de grandes distribuidoras.
- **Biblioteca Digitalizada Offline:** OCR procesado directamente en el cliente (Tesseract.js) guiado para digitalizar actas municipales centenarias sin que el documento físico ni el dato salgan del pueblo.
- **Inventario de Biodiversidad Local:** Catálogo colaborativo de flora y fauna propiedad del municipio, sirviendo de escudo defensivo de datos contra proyectos extractivistas (canteras, parques eólicos).
- **Sistema de Alertas Hiperlocales:** Integración con APIs abiertas (ej. AEMET) para generar alertas preventivas en lenguaje natural (y valencià) a través de PWA, SMS o Signal.

## 5. Alianzas Estratégicas y Ecosistema
El despliegue requerirá tejer una red según la siguiente secuencia lógica:
1. **Centros y Nodos de Distribución (Nivel Cero):** 
   - **COCEDER:** Aprovechar los Centros de Desarrollo Rural en la Comunitat Valenciana para distribuir la PWA y formar a los usuarios.
2. **Alianzas de Formación (Intermediación):**
   - **Fundación Telefónica (Reconectados):** Ellos aportan formadores presenciales para ancianos en municipios de <5000 habs, Sóc de Poble aporta la plataforma con Soberanía de Datos.
3. **Escudo Tecnológico Local-First EU (Infraestructura Soberana):**
   - **Protocolo Solid (Inrupt) / Dat Protocol / IPFS:** Implementar "Pods" locales de memoria histórica. Archivos distribuidos entre vecinos sin depender de la nube corporativa (ej. AWS).
   - **Nextcloud:** Para servidores municipales que actúen de repositorio soberano.
4. **Institucional Valenciano:**
   - Universitat d'Alacant, UPV, Institut Valencià de Cultura (IVC) y patronatos contra la despoblación.

Sóc de Poble no pide financiación para hacer lo que otros ya hacen. Pide una alianza para aportar lo que ninguna otra iniciativa tiene: **Estructuras Tecnológicamente Indestructibles, de Propiedad Comunal y Orientadas a la Soberanía Absoluta del Anciano.**

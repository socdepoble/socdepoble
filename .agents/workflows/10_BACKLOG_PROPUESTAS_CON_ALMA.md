---
description: Backlog de Innovación Rural - Propuestas con Alma (Qwen/Claude)
---

# BACKLOG DE INNOVACIÓN RURAL: PROPUESTAS CON ALMA

Este documento agenda las propuestas de alto valor e imaginación aportadas por el Alto Consejo de IAs (primera ronda: Qwen/Claude). El objetivo es que Sóc de Poble no sea solo "indestructible técnicamente", sino **vital emocionalmente** para las comunidades rurales. 

Estas funciones deben implementarse gradualmente para cubrir necesidades básicas y generar arraigo.

## 1. "Veu del Poble" - Narración por Voz para Personas Mayores
* **Problema:** Muchas personas mayores en pueblos tienen dificultades de visión o lectura. 
* **Solución:** Implementar Text-to-Speech nativo (Web Speech API o equivalente) en valencià/català fluido con `useVeuDelPoble`. Dar voz al texto es dar voz a quienes construyeron la memoria oral del pueblo.
* **Aspectos técnicos:** Ritmo más lento (rate 0.9), control simple de Play/Stop.

## 2. "Mapa de Raíces" - Conexión Geográfica Emocional
* **Problema:** Sensación de aislamiento en las contribuciones individuales.
* **Solución:** Visualizar de dónde viene cada contribución o usuario en un mapa base (SVG interactivo).
* **Impacto:** Conecta "mi pueblo" con el resto. Ver las "líneas y lazos" hace tangible la red social y genera pertenencia. 

## 3. "Caja de Herramientas Rural" - Offline-First Real
* **Problema:** Intermitencia o caída de conexión en zonas rurales o trabajos del campo.
* **Solución:** Un Service Worker estratégico diseñado no solo para el caché estático, sino con un `Sync background` que permita a la app funcionar (leer y escribir en local) sin internet.
* **Impacto:** La app rural debe funcionar siempre en el campo como una buena herramienta.

## 4. "Co-Autoría Visible" - Reconocimiento Transparente
* **Problema:** El software tradicional oculta o anonimiza los créditos conjuntos.
* **Solución:** `CoAuthorshipBadge`. Cada persona que suma un dato, corrige una historia de un mas (masía), o documenta algo en Sóc de Poble, debe estar visible en una capa de "Construido por...".
* **Impacto:** Soberanía tecnológica es autoría visible y reconocimiento del tejido social.

## 5. "Modo Cosecha" - UI que Respeta los Ritmos Rurales
* **Problema:** La agresión visual y los ritmos artificiales (luz azul, notificaciones) impuestos por las urbes y Silicon Valley.
* **Solución:** Un `useRitmeRural()`. Interfaz que se adapta orgánicamente a la temporada (Primavera, Estiu...) y momento del día (amanecer suave, mediodía con más contraste, atardecer cálido).
* **Impacto:** Alinear Sóc de Poble con los ciclos naturales tradicionales del campo.

## 6. "Xat de Veïnat" - Comunicación Asíncrona Respetuosa
* **Problema:** Aplicaciones de mensajería (WhatsApp, Telegram) premian la reacción inmediata y generan ansiedad de respuesta.
* **Solución:** 
  - Eliminar los "Escribiendo..." y el "En línea".
  - Envío en batch (ej. los mensajes no vitales se entregan en bloques de 15 minutos).
  - Opción de "Responder mañana / en horario laboral".
* **Impacto:** Respetar los tiempos del campo, donde conversar requiere contexto y pausa, no interrupciones nerviosas inmediatas.

---
> *"La tecnología no es un fin, es un medio para que las raíces hablen."*

## 🌟 RONDA 2: PROPUESTAS DE DEEPSEEK

### 7. Mapeo Colaborativo de Recursos Locales
* **Solución:** Una capa en el mapa donde los vecinos puedan marcar fuentes de agua, huertos abandonados, herramientas para compartir, o rutas de ganado. Con un sistema de "cuidadores" (moderadores locales) que validen la información.

### 8. Mercado de Trueque Digital
* **Solución:** No dinero, sino créditos de confianza. El sistema gestiona la reputación sin algoritmos extractivistas. Intercambios de tiempo por productos locales.

### 9. Escuela de Oficios Rurales en Vivo
* **Solución:** Transmisiones peer-to-peer (WebRTC a través de Trellat Mesh) donde los propios vecinos enseñan oficios tradicionales y saberes locales.

### 10. Alerta Temprana Comunitaria (IoT)
* **Solución:** Integración con sensores IoT o APIs oficiales para alertas meteorológicas severas. La IA traduce el aviso gubernamental/científico a lenguaje claro y rural, y lo distribuye usando la red local pura.

### 11. Archivo de Memoria Oral (Podcasts Locales)
* **Solución:** Los mayores pueden grabar sus recursos orales. El sistema las transcribe y cataloga automáticamente. IAIA María aportaría ilustraciones y metadatos visuales.

### 12. Modo "Socorro Rural"
* **Solución:** Un botón de emergencia que tira de la red Mesh o SMS, avisando a los equipos más próximos o de protección vecinal sin necesitar banda ancha ni redes corporativas.

### 13. Gamificación del Voluntariado Juvenil
* **Solución:** Recompensar a los jóvenes que barren el pueblo, ayudan en tareas comunitarias, o dan clases digitales a los abuelos. Estas "Open Badges" podrían servir en los comercios del propio pueblo.

### 14. Visor de Normativa Rural Simplificada
* **Solución:** Un oráculo de texto (con IA local) enfocado en normativas legales (BOE/DOGV). Explicado en términos sencillos: "En tu término municipal, necesitas X distancia para instalar Y, según la norma vigente Z".

---

## 🌟 RONDA 3: PROPUESTAS DE PERPLEXITY

### 15. Modo "Lectura Rural Real"
* **Solución:** Una interfaz ultra-limpia para pantallas pequeñas, con solo leer, volver, buscar y compartir. 
* **Impacto:** Elimina distracciones para un enfoque absoluto en el texto puro, vital para la lectura prolongada.

### 16. Modo "Baja Conectividad" Transparente
* **Solución:** Caché explícita de la última vista, assets críticos y una alerta discreta cuando la red sea débil en la que el usuario es informado.
* **Impacto:** Fomenta la tranquilidad del usuario que está en un campo sin cobertura, sabiendo que no ha "roto nada" y la web aún funciona.

### 17. Modo "Mayores" (Accesibilidad Reforzada V2)
* **Solución:** Tipografía más grande, contraste drásticamente más alto, menos acciones visibles y navegación simplificada en un toggle de un clic.

### 18. Acciones Contextuales Inteligentes
* **Solución:** Cuando el usuario está leyendo, mostrar solo herramientas de lectura; cuando edita, mostrar solo edición.
* **Impacto:** Limpia el DOM y los action bars, mostrando estrictamente lo que se necesita en cada situación, bajando la carga cognitiva.

### 19. Panel de Ayuda "Local-First"
* **Solución:** Glosario, accesos rápidos y explicación de iconos para usuarios no técnicos. Todo precargado y disponible offline.

### 20. Coherencia Emocional de Marca
* **Solución:** Menos "dashboards" corporativos, más sensación de acompañamiento y comunidad. Un diseño menos frío, que encaja mejor con un proyecto soberano y rural.

---

## 🌟 RONDA 4: PROPUESTAS ADICIONALES DE PERPLEXITY (Auditoría Final)

### 21. "Modo Poble" ultra-simple
* **Solución:** Interfaz de emergencia o minimalista extrema: Solo leer, compartir, chatear local. Sin distracciones, ideal para abuelos y zonas con conectividad muy débil.

### 22. Red Mesh Visual
* **Solución:** Mapa offline de nodos cercanos, mostrando visualmente el estado de conexión P2P del Trellat Mesh.

### 23. Calendario Comunal por GPS
* **Solución:** Eventos locales sincronizados por proximidad GPS (offline o P2P), con recordatorios que lleguen aun sin internet.

### 24. Archivo Vivo (Genealogía de Posts)
* **Solución:** Cada publicación rural (una historia, receta) genera un "árbol genealógico" de forks o adiciones hechas colaborativamente por la comunidad, rastreando los orígenes y evolución de la memoria.

### 25. Guardianes Locales
* **Solución:** Sistema de validadores de contenido basado puramente en la reputación vecinal tradicional, no en algoritmos de confianza centrales.

### 26. Modo Fuego
* **Solución:** Interfaz ultra-básica, alto contraste (posiblemente B/N y rojo) para emergencias reales (riesgo forestal, alarma), con SOS emitido vía Mesh.

### 27. Huella Rural
* **Solución:** Mostrar directamente métricas de impacto local positivo: "km ahorrados al comprar en red local" o "CO2 evitado por el trueque local".

---

## 🌟 RONDA 5: PROPUESTAS DE MISTRAL (Auditoría Final - V12/M3)

### 28. Tests Automatizados de Safe-Areas
* **Solución:** Integrar testing visual en CI/CD que valide los safe-areas específicamente en iOS 17+ y Android 14+ con Notch/Edge-to-Edge.

### 29. Paginación Virtual y Lazy Loading
* **Solución:** Sustituir la lógica clásica por paginación virtual (`react-window` o `react-virtualized`) para asegurar el rendimiento del Scroll y del Observer en textos gigantescos (>10,000 palabras) típicos de monografías locales. 

### 30. Cláusula de Soberanía Anti-Extractivista en Licencia
* **Solución:** Acompañar el código abierto (MIT) de una cláusula legal explícita que prohíba la adquisición, monetización o extracción forzosa del proyecto por parte de corporaciones Big Tech o hubs genéricos sin pacto con las comunidades locales. Soberanía garantizada jurídicamente. 

### 31. Fallback Estático para el Cloud
* **Solución:** Ante posibles fallos de autenticación de Supabase rural, servir rutas críticas en un *static site generation* (SSG) paralelo o usar base de datos local en cliente (`react-native-sqlite-storage`) para garantizar continuidad total bajo cualquier desastre.

### 32. Health Check de Servicios IA
* **Solución:** En el inicio de "Omega Translate" realizar un health check para saber si la red responde; si no lo hace, cambiar automáticamente a una rutina de *fallback estático* u ocultar el botón sin romper la UI general.

---

## 🌟 RONDA 6: PROPUESTAS DE L'ALT CONSELL (Visión d'Emergència i Resiliència)

### 33. "La Ràdio Bategant" (Broadcast Local d'Emergència)
* **Solució:** Transforma qualsevol telèfon en un node de difusió local offline (via Bluetooth/Wi-Fi Direct P2P). Un "batec" d'emergència salta de telèfon en telèfon per la vall fins arribar a l'ajuntament.
* **Impacte:** Botó de pànic i sistema d'alerta desconnectat totalment d'Internet, actuant com les antigues campanes de l'església però amb precisió digital.

### 34. "L'Espill de la Memòria" (Arxiu Oral i Geolocalitzat)
* **Solució:** Arxiu viu on es graven històries o saviesa agrícola, es geolocalitzen i queden en l'emmagatzematge local. En passar algú per eixe punt (fins i tot offline), ho rep via P2P.
* **Impacte:** Antídot contra la bretxa generacional i pèrdua de memòria digital; una realitat augmentada del territori construïda comunitàriament.

### 35. "El Banc del Temps Rural" (Mercat de Serveis d'Intercanvi Local)
* **Solució:** Intercanvi de serveis basat en crèdits de temps (batecs) i reputació, sobre la infraestructura del "Mercat". Operacions sincronitzades via CRDT sense intermediaris financers.
* **Impacte:** Reforça l'economia de proximitat i el suport mutu; permet als majors rebre ajuda a canvi del seu coneixement. Essencial si els sistemes econòmics formals fallen.

---

## 🌟 RONDA 7: PROPUESTAS DE DOLA (UX/UI y Conexión Humana)

### 36. "El Bancal de la Memòria Viva" (Arxiu P2P de Coneixement Local)
* **Solució:** Registre d'àudio o botons grans on els majors guarden sabers ancestrals (receptes, agricultura). Es sincronitza a través de la xarxa P2P localment mitjançant CRDTs quan els dispositius estan prop.
* **Impacte:** Preserva la saviesa local, crea sentiment de pertinença i connecta generacions, amb una interfície d'alta accessibilitat (activada per veu).

### 37. "La Veu del Poble" (Missatgeria d'Emergència Sincronitzada)
* **Solució:** Alertes d'emergència a tots els dispositius de la xarxa local (Bluetooth/Wi-Fi Direct), efímeres per defecte però amb persistència si es marquen com a "vitals".
* **Impacte:** Interfície minimalista (alertes clares i prioritàries) per fomentar el suport mutu i garantir contacte ràpid dins la comunitat física quan les xarxes fallen.

### 38. "El Racó del Repòs Digital" (Mode Offline Profund)
* **Solució:** Activar un mode offline intencionat on només queden essencials i emergències. Sense notificacions externes, acompanyat de contingut didàctic o relaxant precàrregat.
* **Impacte:** Pausa per al benestar mental. Promou reconnexió amb l'entorn físic i aplica "Trellat" contra la sobrecàrrega digital de les aplicacions convencionals.

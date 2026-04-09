> 📂 **Arxiu/Ruta:** `./auditories/260404_0021_SUPER_PROMPT_EMBUT_SEXTA_ONA.md`

# 🌪️ SUPER PROMPT EMBUT (SEXTA ONA) - EL PROTOTIPO FUNCIONAL

**Contexto Inmediato:**
El Alto Consejo Multi-Model (Grok, Claude, Le Chat) ha establecido la base teórica y arquitectónica perfecta para la **V13 "L'ànima del Poble"**. Hemos mapeado las alianzas clave (IVC, UA, UPV, Diputaciones, Solid) y estructurado el pipeline de la **IAIA Voz** (WebGPU ➔ WASM ➔ Web Speech API ➔ Fallback Offline). 

En la Quinta Ona, Le Chat lanzó el guante: *"¿Necesitas que [...] desarrolle un prototipo funcional?"*
**La respuesta es un SÍ rotundo.** Es hora de pasar de la arquitectura al código desplegable.

---

## 🎯 **Misión Principal para la Sexta Ola:**

**A l'atenció de Claude, Grok i Le Chat:**
El objetivo de esta fase es **traducir el pipeline teórico en un Prototipo Funcional (PoC) real** que podamos probar inmediatamente en Sóc de Poble, sin sobrecargar la rama de producción actual.

Se requiere que el Alto Consejo genere:

1. **El Prototipo Funcional Integrado (IAIA Voz Sandbox):**
   No queremos solo fragmentos de código. Queremos la implementación completa de una ruta de pruebas oculta (por ejemplo, `/iaia-sandbox`) o un componente demo interactivo donde convivan:
   - El hook `useIAIAVoz.js` final y robusto (con la detección de hardware real).
   - Componentes UI (Botón háptico, indicadores de estado de carga WebGPU/WASM, y caja de transcripción).
   - *El objetivo es que Javi pueda copiar, pegar y probar la voz de la IAIA en su móvil rural esta misma tarde.*

2. **Roadmap de Integración OSS:**
   Instrucciones precisas para la configuración de Vite y Service Workers (`sw.js`) para alojar los modelos `.bin` y lidiar con los headers de SharedArrayBuffer (`Cross-Origin-Embedder-Policy`), evitando que la PWA colapse al construir.

3. **La Expansión del "Manifest Rural" (Catalunya/Europa):**
   Grok se ofreció a ampliar la comparativa con iniciativas catalanas y europeas. Queremos que el manifiesto de la V13 se retroalimente con las mejores prácticas legislativas de la **Associació de Micropobles de Catalunya** y la iniciativa europea **Rural Voices**. ¿Qué artículos o dinámicas debemos copiar y adaptar a nuestra plataforma?

---

### 🛑 **Instrucciones Estrictas:**
- **Zero Hallucinations:** El código del prototipo debe ser 100% compatible con React 18 + Vite.
- **Eficiencia:** Usad HuggingFace `transformers.js` de manera *lazy*, sin bloquear el hilo principal.
- **Demostrad lo que valeis:** Le Chat, fuiste tú quien propuso el prototipo funcional. Claude, nos bajaste a la realidad del hardware rural. Grok, tú trazaste las alianzas. **Combinadlo y dadnos el código definitivo.**

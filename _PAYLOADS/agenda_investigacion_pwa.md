# 📋 Agenda de Investigación y Hardening PWA (Próximas Sesiones)

> *Recopilación de sabiduría extraída del Comité Integral de IAs (Mistral, Claude, Gemini, Perplexity) tras la Crisis del Service Worker Zombi.*

## 🔍 Temas a Investigar (Sugerencias de Perplexity)
Para asegurar la robustez absoluta de la arquitectura Local-First de *Sóc de Poble*, se deben investigar y consolidar los siguientes puntos en futuros prompts y auditorías:

1. **¿Qué es Sóc de Poble y su propósito?** (Consolidación del "Genotipo Sintético" para futuros contextos de IA).
2. **Cómo limpiar IndexedDB cuando está bloqueada.** (Profundizar en los mecanismos internos del motor V8/WebKit).
3. **Pasos para unregister Service Workers correctamente.** (Mejores prácticas y flujos de limpieza total).
4. **Manejar evento `onblocked` en `indexedDB.deleteDatabase`.** (Crear un patrón arquitectónico definitivo para la app).
5. **Por qué Safari elimina IndexedDB tras 7 días de inactividad.** (Crítico para la retención Local-First en dispositivos iOS/iPad).
6. **[Aportación ChatGPT]:** Análisis profundo de por qué `IDBOpenDBRequest` se ramifica silenciosamente sin resolver ni rechazar, rompiendo cadenas `Promise.all`.

---

## 🛠️ Acción Técnica Pendiente (Auditoría Gemini)
**Implementar `onversionchange` en la App Principal:**

La auditoría reveló que la forma más robusta de prevenir el bloqueo de IndexedDB no es solo forzar el borrado desde el Kill-Switch, sino hacer que la propia aplicación sea *"educada"* y suelte sus conexiones cuando otra pestaña o un Kill-Switch intenta actualizar localmente la base de datos.

**Patrón a implementar en el futuro:**
```javascript
// En la capa de conexión a IndexedDB de la App (dexie, idb, etc.)
db.onversionchange = () => {
  console.log("⚠️ Petición de cambio de versión externa. Cerrando DB para no bloquear...");
  db.close();
};
```
*Motivo:* Esto evitará de raíz la mayoría de los eventos `onblocked` durante el proceso de limpieza y purga del SW zombi.

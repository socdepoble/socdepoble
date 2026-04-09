> 📂 **Arxiu/Ruta:** `./_PAPERERA_OBSOLETA/historic_sensible_archived/ARQUITECTURA_MODULAR_POWERSYNC.md`

# 🏗️ ANÀLISI ARQUITECTÒNICA: DESMONTELANT EL MONÒLIT `supabaseService.js`

## 📊 DIAGNÒSTIC ACTUAL
*(vegeu el detall per complet...)*

### Arquitectura Modular amb PowerSync
- `src/services/core/supabaseClient.js`
- `src/services/core/powerSyncConnector.js`
- `src/services/core/serviceRegistry.js`
- `src/services/posts/postsService.js`
- `src/services/messages/messagesService.js`
- ...

---
**Recomanació Principal:**
Implementar un `serviceRegistry` i un patró Wrapper (`src/services/index.js`) per fer una migració domini per domini sense trencar la rutes actuals, sentit vital per a la injecció de PowerSync per a l'App Offline.

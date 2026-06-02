# ARCHITECTURE CONSTITUTION

This application contains a Safari/iOS Offline-First architecture.

The following systems are considered CRITICAL INFRASTRUCTURE.
Changes are forbidden without explicit Architecture Review (ARCH_REVIEW=1).

---

## Critical Systems

### Service Worker

Files:
src/workers/service-worker.ts
src/components/pwa/PwaUpdater.jsx
vite.config.js

Invariants:
- registerType MUST remain "prompt"
- skipWaiting MUST NEVER execute automatically on install
- user interaction is required before activation (handled in PwaUpdater)
- Circuit Breaker MUST remain active
- ChunkLoadError recovery MUST remain active

Reason:
Safari may enter infinite reload loops when HTML and JS versions diverge.

---

### Persistence Layer

Files:
src/components/gates/LocalFirstGate.jsx
src/utils/storageProbe.js
src/core/dal.js

Invariants:
- PowerSync startup MUST support `:memory:` fallback.
- IndexedDB failures MUST NOT crash startup.
- Memory mode is mandatory for Safari Private Browsing.

Reason:
Safari Private Mode frequently disables IndexedDB and OPFS.

---

### Global Error Interceptor

Files:
src/utils/GlobalErrorInterceptor.js
src/app/entry.jsx

Invariants:
- ChunkLoadError interception MUST remain active
- reload attempts MUST remain bounded (sessionStorage circuit breaker)

Reason:
Safari aggressively caches HTML while invalidating JS assets.

---

Any AI agent modifying critical systems must:
1. Explain why.
2. Explain Safari impact.
3. Explain rollback strategy.
4. Explain offline impact.

Failure to provide these explanations means the change is invalid.

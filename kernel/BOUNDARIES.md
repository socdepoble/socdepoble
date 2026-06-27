# CONTRACTE DE FRONTERES I SEGURETAT (ISO 1.4.0)

Aquest document defineix de forma estricta les regles d'accés, modificació i promoció de codi dins del Mas (Core) i la seua relació amb el bancal de proves (Playground).

## 1. ZONA VERMELLA: `kernel/` i `core/`
**Regles de Lectura:** Accés lliure per part de tots els mòduls.
**Regles d'Escriptura (Mutació):** 
- ❌ **PROHIBIT** modificar directament fitxers en calent.
- ❌ **PROHIBIT** per al Playground importar o escriure en aquesta zona.
- ✅ Només es poden modificar via promoció oficial aprovada (Signatura Dual).

## 2. ZONA GROGA: `playground/`
**Regles de Lectura:** Accés limitat a dades sandboxades (via `PG_` prefix en IndexedDB).
**Regles d'Escriptura (Mutació):**
- ✅ Els experiments poden escriure ací lliurement.
- ❌ Cap experiment pot enviar esdeveniments de mutació directament a l'EventBus del Core.

## 3. ZONA BLAVA: `core_lib/providers/` (L'antiga carpeta vendor)
**Regles de Confiança:**
- Tots els fitxers ací dins (ex: encriptació Ed25519) han d'estar fixats (pinned) amb un hash SHA-256 al `manifest.yml`.
- Aquesta carpeta és **Opt-in** i buida per defecte de dependències externes innecessàries.
- Si un stub no està auditat criptogràficament de forma real, actua només com a façana i ha de tindre el flag `AWAITING_AUDIT`.

## 4. PROMOCIÓ DE CODI
Qualsevol transferència de `playground/` cap a `core/` requereix l'activació del procés formal de dual-signature validat pel Policy Engine en l'estat `NASCENT`.

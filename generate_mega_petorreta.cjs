#!/usr/bin/env node
/**
 * TOMBSTONE P0 — les MEGA-Petorretes indiscriminades saturaven el context,
 * copiaven dades potencialment sensibles i es convertien en nodes del vault.
 * El Reflex només admet un manifest selectiu amb hashes i detector de secrets.
 */
console.error('[SDP-LOCK] Generació de MEGA-Petorretes retirada. Usa `reflex_petorreta.mjs open` i el manifest selectiu imprés.');
process.exitCode = 2;

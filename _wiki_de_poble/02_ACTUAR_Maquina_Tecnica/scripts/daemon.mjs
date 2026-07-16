#!/usr/bin/env node
/**
 * TOMBSTONE P0: el daemon escrivia snapshots/logs, compactava estat i esborrava
 * `.DS_Store` sense una autorització lligada a cada pla. No hi ha mode autònom
 * d'escriptura fins que cada capacitat valide un rebut del Reflex.
 */
console.error('SDP-LOCK: daemon d’escriptura retirat. Les auditories s’executen sota demanda i en dry-run.');
process.exitCode = 2;

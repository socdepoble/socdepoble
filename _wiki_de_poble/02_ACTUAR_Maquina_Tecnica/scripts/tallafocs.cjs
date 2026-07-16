#!/usr/bin/env node
'use strict';

console.error('SDP-LOCK: tallafocs.cjs està retirat perquè agregava auditories legacy i podia declarar verd un corpus buit.');
console.error('Usa `pnpm run wiki:test`, `pnpm run wiki:audit:strict`, `pnpm run precommit:sdp` i `pnpm run reflex:doctor`.');
process.exit(2);

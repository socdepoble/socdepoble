#!/usr/bin/env node
/**
 * TOMBSTONE P0 — l'antic script feia rm -rf del mirror i el recreava sense
 * pla, rebut ni restauració. El runtime autoritatiu viu en `.agents/`; les
 * rutes antigues del vault són ara ponts desactivats, no còpies sincronitzades.
 */
console.error('[SDP-LOCK] sync_agents_to_wiki retirat: els ponts històrics no són autoritat ni es regeneren automàticament.');
process.exitCode = 2;

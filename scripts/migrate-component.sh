#!/bin/sh
set -eu

# TOMBSTONE: l'antic script interpolava entrada no validada i creava llegat
# directament dins de src/, en contra de la quarantena fora del build.
echo "SDP-LOCK: tractor de migració retirat; cal inventari, quarantena externa, pla de fitxers, Reflex i proves abans d'importar codi." >&2
exit 2

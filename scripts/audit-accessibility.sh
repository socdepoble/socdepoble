#!/bin/sh
set -eu

# TOMBSTONE: l'antic script creava informes amb un COMPONENT no confinat i
# deixava que npx descarregara una eina no fixada. Una auditoria real requerix
# dependència declarada, URL validada, output confinat i receipt del Reflex.
echo "SDP-LOCK: auditoria a11y automàtica retirada fins integrar axe com a dependència fixada i un report mutator amb Reflex." >&2
exit 2

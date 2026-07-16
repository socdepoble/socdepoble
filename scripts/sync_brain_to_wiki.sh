#!/bin/sh
# TOMBSTONE P0: l'antic rsync --delete podia reintroduir actes massives,
# duplicar autoritats i alterar el vault sense Reflex ni rollback.
echo '[SDP-LOCK] sync_brain_to_wiki retirat. Usa manifest selectiu del Reflex; mai rsync --delete sobre la Wiki.' >&2
exit 2

#!/bin/sh
set -eu

if command -v node >/dev/null 2>&1; then
  NODE_BIN="$(command -v node)"
elif [ -d "${HOME}/.vscode-server/bin" ]; then
  NODE_BIN="$(find "${HOME}/.vscode-server/bin" -path '*/node' -type f | head -n 1)"
else
  NODE_BIN=""
fi

if [ -z "${NODE_BIN}" ]; then
  echo "No s'ha trobat cap binari de node per a generar supabase/seed.sql" >&2
  exit 1
fi

exec "${NODE_BIN}" --experimental-specifier-resolution=node scripts/generate-supabase-seed.mjs

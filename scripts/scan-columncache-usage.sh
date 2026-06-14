#!/usr/bin/env bash
set -euo pipefail

echo "Escanejant per usos de 'columnCache' i 'normalizeStorageUrl'..."
echo "Resultats per 'columnCache':"
rg --hidden --line-number --no-ignore-vcs "columnCache" || true
echo
echo "Resultats per 'normalizeStorageUrl':"
rg --hidden --line-number --no-ignore-vcs "normalizeStorageUrl" || true
echo
echo "Resultats per imports de supabaseService:"
rg --hidden --line-number --no-ignore-vcs "from ['\"](.*/)?supabaseService['\"]" || true

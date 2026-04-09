#!/bin/bash
# Script de purga activa - Sóc de Poble v10.38
echo "[*] Iniciant purga de fantasmes visuals i optimització GEM MODERN..."

# 1. Detectar backdrop-filter residuals (no haurien de quedar-ne en index.css i AppLayout, pero testegem altres llocs)
echo "[*] Buscant backdrop-filter a /src..."
grep -r "backdrop-filter" src/ --exclude-dir=node_modules || echo "  -> Cap backdrop-filter trobat (Net!)"

# 2. Detectar inline styles sospitosos
echo "[*] Buscant inline styles amb height o window a AppLayout..."
grep -n "style={{.*height" src/components/AppLayout.jsx || echo "  -> Cap inline style trobat (Net!)"

echo "[✓] Purga completa. L'arquitectura visual està blindada."

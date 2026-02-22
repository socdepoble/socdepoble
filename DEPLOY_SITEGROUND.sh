#!/bin/bash
# -----------------------------------------------------------------------------
# DEPLOY SITEGROUND: Bategat de Producció per al Mas 🏺🏗️🚀
# -----------------------------------------------------------------------------
# Aquest script genera la carpeta 'dist' i la empaqueta per a SiteGround.
# -----------------------------------------------------------------------------

set -e # Atura l'script si hi ha un error

echo "🧿 Iniciant procés de producció per a SiteGround..."

# 1. Neteja de versions anteriors
echo "🧹 Netejant 'dist' i 'dist.tar.gz'..."
rm -rf dist
rm -f dist.tar.gz

# 2. Build del projecte
echo "🏗️ Construint el projecte (Vite)..."
npm run build

# 3. Empaquetat quirúrgic
echo "📦 Empaquetant 'dist' en 'dist.tar.gz'..."
tar -czf dist.tar.gz dist/

echo "✨ Bategat de producció completat!"
echo "📂 Ara pots pujar el fitxer 'dist.tar.gz' a SiteGround."
echo "🏺 Recorda descomprimir-lo a la carpeta 'public_html' del servidor."

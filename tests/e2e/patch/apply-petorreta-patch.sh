#!/usr/bin/env bash
set -euo pipefail

PATCH_FILE="petorreta-sw-handshake.mbox"
REPO_ROOT="$(pwd)"

echo "Comprovant entorn..."
if [ ! -d ".git" ]; then
  echo "Error: aquest directori no sembla un repositori git. Executa-ho a l'arrel del repo."
  exit 1
fi

if [ ! -f "$PATCH_FILE" ]; then
  echo "Error: no trobe el fitxer $PATCH_FILE."
  echo "Col·loca el .mbox (petorreta-sw-handshake.mbox) en aquest directori i torna-ho a provar."
  exit 2
fi

echo "Aplicant patch amb git am..."
git am --signoff < "$PATCH_FILE"

echo "Patch aplicat correctament."

echo "Instal·lant dependències addicionals (vite-plugin-pwa, workbox, express, playwright)..."
# Instal·la només si no estan presents; npm install afegeix si cal
npm install --no-audit --no-fund vite-plugin-pwa workbox-precaching workbox-routing workbox-strategies express node-fetch @playwright/test

echo "Instal·lant navegadors Playwright..."
npx playwright install

echo "Construint la PWA (vite build)..."
npm run build

echo "Iniciant servidor de prova en background (tests/playwright/handshake-server.js)..."
node tests/playwright/handshake-server.js &
SERVER_PID=$!

sleep 1
echo "Servidor de prova iniciat (PID $SERVER_PID)."
echo ""
echo "Per executar el test Playwright, obri una altra terminal i executa:"
echo "  npm run test:handshake"
echo ""
echo "Quan acabeu, podeu aturar el servidor amb:"
echo "  kill $SERVER_PID"
echo ""
echo "Si voleu revertir el patch aplicat per git am, executeu:"
echo "  git am --abort"
echo "o per desfer el commit aplicat:"
echo "  git reset --hard HEAD~1"
echo ""
echo "Procés complet."

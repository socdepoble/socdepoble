#!/bin/bash

# Protocol OMEGA: Exportació Quirúrgica al Core 🏺🛡️🚀
# Aquest script crea una estructura temporal i puja el nucli al repo nou.

REPO_URL="https://github.com/socdepoble/soc-de-poble-core.git"
TEMP_DIR="/tmp/soc-de-poble-core-export"
PROJECT_DIR="/Users/javillinares/Documents/Antigravity/Sóc de Poble"

echo "🧿 Iniciant Exportació Quirúrgica..."

# 1. Neteja i creació de directoris
rm -rf "$TEMP_DIR"
mkdir -p "$TEMP_DIR/.docs"
mkdir -p "$TEMP_DIR/core/rhizome"
mkdir -p "$TEMP_DIR/core/services"
mkdir -p "$TEMP_DIR/core/identity"

# 2. Còpia del Cordó Sanitari
cp "$PROJECT_DIR/SOBIRANIA.md" "$TEMP_DIR/.docs/"
cp "$PROJECT_DIR/CHECKLIST_REVISOR.md" "$TEMP_DIR/.docs/"
cp "$PROJECT_DIR/CODEX_INIT.md" "$TEMP_DIR/README.md" # Fem que el prompt d'inici siga el README inicial

# 3. Còpia del Nucli Rhizome
cp "$PROJECT_DIR/src/rhizome/db-core.js" "$TEMP_DIR/core/rhizome/"
cp "$PROJECT_DIR/src/rhizome/rhizome.worker.js" "$TEMP_DIR/core/rhizome/"
cp -r "$PROJECT_DIR/src/rhizome/crdt" "$TEMP_DIR/core/rhizome/" 2>/dev/null || echo "Info: No hi ha carpeta crdt encara."

# 4. Còpia de Serveis Crítics
cp "$PROJECT_DIR/src/services/rhizomeManager.js" "$TEMP_DIR/core/services/"
cp "$PROJECT_DIR/src/services/syncService.js" "$TEMP_DIR/core/services/"
cp "$PROJECT_DIR/src/services/schemas.js" "$TEMP_DIR/core/services/"
cp "$PROJECT_DIR/src/services/identityService.js" "$TEMP_DIR/core/identity/"

# 5. Inicialització de Git i Push
cd "$TEMP_DIR"
git init
git add .
git commit -m "🏺 Protocol OMEGA: Exportació inicial del nucli Rhizome"
git branch -M main
git remote add origin "$REPO_URL"
git push -u origin main --force

echo "🚀 Bategat completat! El nucli ja és a GitHub."

#!/bin/bash

# [MASTER GENESIS: PONT D'ASSETS]
# Aquest script sincronitza els actius generats per la IA entre el "brain" de l'agent i el projecte.

BRAIN_PATH="/Users/javillinares/.gemini/antigravity/brain/8f23168e-5f93-43d2-9b9c-3d8316452dbf"
PROJECT_ASSETS="./public/assets/ai_generated"
DOWNLOADS_PATH="/Users/javillinares/Downloads/SocDePoble_Assets"

echo "👵 Sincronitzant bategat d'actius..."

# Crear carpetes si no existeixen
mkdir -p "$PROJECT_ASSETS"
mkdir -p "$DOWNLOADS_PATH"

# 1. Copiar del Brain al Projecte
if [ -d "$BRAIN_PATH" ]; then
    cp "$BRAIN_PATH"/media__* "$PROJECT_ASSETS/" 2>/dev/null
    cp "$BRAIN_PATH"/walkthrough.md "$PROJECT_ASSETS/Ultim_Walkthrough.md" 2>/dev/null
    echo "✅ Actius bategats al projecte."
fi

# 2. Copiar al directori de Descàrregues del Mestre (Mirror)
cp "$PROJECT_ASSETS"/* "$DOWNLOADS_PATH/" 2>/dev/null
echo "✅ Còpia de seguretat creada a Descàrregues."

echo "✨ Pont establert amb èxit."

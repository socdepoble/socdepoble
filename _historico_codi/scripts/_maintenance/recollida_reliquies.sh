#!/bin/bash

# [MASTER GENESIS: RECOLLIDA DE RELÍQUIES DOCUMENTALS v1.0.0]
# Aquest script actua com a pont per a moure les descàrregues des del navegador (Downloads)
# cap al Dipòsit de Descàrregues del projecte Sóc de Poble.

DOWNLOADS_OS="/Users/javillinares/Downloads"
PROJECT_DOWNLOADS="/Users/javillinares/Documents/Antigravity/Sóc de Poble/downloads"
PATTERN="*_socdepoble.*"

echo "🏺 Iniciant recollida de relíquies documentals..."

# Crear carpeta del projecte si no existís (redundància seguretat)
mkdir -p "$PROJECT_DOWNLOADS"

# Cercar i moure fitxers que bateguen amb el segell del projecte
FILES_FOUND=$(find "$DOWNLOADS_OS" -name "$PATTERN" -maxdepth 1)

if [ -z "$FILES_FOUND" ]; then
    echo "📭 No s'han trobat noves relíquies a la carpeta de Descàrregues."
else
    echo "📂 S'han trobat les següents relíquies:"
    echo "$FILES_FOUND"
    
    # Moure fitxers
    mv "$DOWNLOADS_OS"/$PATTERN "$PROJECT_DOWNLOADS/" 2>/dev/null
    
    echo "✅ Relíquies bategades i arxivades al Dipòsit amb èxit."
fi

echo "✨ Pont de Recollida tancat."

#!/bin/bash
WIKI_DIR="_wiki_de_poble/01_identitat_iaia/brain_backup"
mkdir -p "$WIKI_DIR"
AGENTS_FILE=".agents/AGENTS.md"
if [ -f "$AGENTS_FILE" ]; then
  cp "$AGENTS_FILE" "$WIKI_DIR/AGENTS.md"
  echo "✅ Copiat AGENTS.md a la Wiki."
fi
echo "Sincronització del cervell completada!"

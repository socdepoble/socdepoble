#!/bin/bash
# sosp-backup.sh: Còpia de seguretat ultra-ràpida "Zero-Tokens"

if [ -z "$1" ]; then
  echo "Error: Necessites indicar el fitxer a protegir."
  echo "Ús: $0 path/to/file.ext"
  exit 1
fi

TARGET_FILE="$1"
BACKUP_DIR=".sosp_backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
FILENAME=$(basename "$TARGET_FILE")
BACKUP_PATH="$BACKUP_DIR/${FILENAME}.${TIMESTAMP}.bak"

# Crear directori ocult si no existeix
mkdir -p "$BACKUP_DIR"

if [ ! -f "$TARGET_FILE" ]; then
  echo "Error: El fitxer '$TARGET_FILE' no existeix."
  exit 1
fi

# Copiar
cp "$TARGET_FILE" "$BACKUP_PATH"

echo "✅ Backup instantani realitzat: $BACKUP_PATH"

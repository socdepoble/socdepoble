#!/bin/bash
# scripts/crea-estructura.sh

set -e

if [ -f "kernel/manifest.yml" ]; then
  echo "⚠️ JA EXISTEIX L'ESTRUCTURA (kernel/manifest.yml). Surtint per seguretat."
  exit 1
fi

echo "🔒 Fent backup del README existent..."
mkdir -p _wiki_de_poble/00_arxiu/
if [ -f "README.md" ]; then
  cp README.md "_wiki_de_poble/00_arxiu/README.md.bak.$(date +%y%m%d%H%M)"
  echo "✅ Backup realitzat."
fi

echo "🏗️ Creant estructura de directoris modular i d'arxiu..."
mkdir -p kernel
mkdir -p core/api
mkdir -p core/config
mkdir -p core/teixit_conectiu
mkdir -p core/immunitat
mkdir -p core/sensors/metrics
mkdir -p core/sensors/events
mkdir -p core/sensors/audit
mkdir -p core_lib/providers
mkdir -p playground/experiments
mkdir -p playground/approved
mkdir -p playground/rejected
mkdir -p _backups
mkdir -p _arxiu_auditories
mkdir -p .well-known/socdepoble

echo "📝 Creant fitxers base estructurals..."
echo "1.4.0" > VERSION

# El fallback pur per a file://
touch core-fallback.html

cat << 'EOF' > .gitignore
# Dependències
node_modules/
.npm/

# Entorn
.env
.env.local

# Backups locals i brossa del SO
_backups/
.DS_Store
Thumbs.db
EOF

# sha256sum buit inicialment, per a quan s'òmpliguen els fitxers
touch sha256sum.txt

echo "🔐 Fixant permisos (0755 carpetes, 0644 fitxers)..."
find kernel core core_lib playground _backups _arxiu_auditories .well-known -type d -exec chmod 0755 {} +
find kernel core core_lib playground _backups _arxiu_auditories .well-known -type f -exec chmod 0644 {} +
chmod 0750 scripts/crea-estructura.sh || true

echo "✅ MAS PREPARAT. Estructura creada correctament i assegurada amb l'Auditoria de Dola."

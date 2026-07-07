#!/bin/bash
# -----------------------------------------------------------------------------
# MASTER SYNC: Bategat de Versió i Sincronització de Doctrina 🏺⚡️
# -----------------------------------------------------------------------------
# Aquest script incrementa la versió del projecte a package.json i realitza
# un commit automàtic per a mantenir a Flash i Gem informats.
# -----------------------------------------------------------------------------

# 1. Carregar versió actual
VERSION=$(node -e "console.log(require('./package.json').version)")
echo "🏺 Iniciant bategat des de la versió: $VERSION"

# 2. Incrementar versió (Lògica simple de patch si acaba en número, o bategat de label)
# Ex: 1.5.6-BATEGA -> 1.5.7-BATEGA
NEW_VERSION=$(echo $VERSION | awk -F. '{$NF = $NF + 1;} 1' | sed 's/ /./g')

# Si la versió té sufix (ex: -BATEGA), assegurem que es manté
if [[ $VERSION == *"-BATEGA"* ]]; then
    BASE_VERSION=$(echo $VERSION | cut -d'-' -f1)
    BASE_NEW_VERSION=$(echo $BASE_VERSION | awk -F. '{$NF = $NF + 1;} 1' | sed 's/ /./g')
    NEW_VERSION="${BASE_NEW_VERSION}-BATEGA"
fi

# 3. Actualitzar package.json
sed -i '' "s/\"version\": \"$VERSION\"/\"version\": \"$NEW_VERSION\"/" package.json
echo "✅ Versió bategada a: $NEW_VERSION"

# 4. Sincronització Git
git add .
COMMIT_MSG="[MASTER SYNC] v$NEW_VERSION - Doctrina Actualitzada 🏛️🏺⚡️"
git commit -m "$COMMIT_MSG"

# 5. Push (Opcional, si hi ha remot configurat)
if git remote | grep -q 'origin'; then
    echo "🚀 Pujant a la Xarxa Rhizome (Origin)..."
    git push origin main
else
    echo "⚠️ No s'ha trobat remot. El bategat s'ha quedat en local."
fi

echo "✨ Bategat completat amb èxit. Atum!"

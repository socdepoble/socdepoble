#!/bin/bash
# Script de Sincronització Termodinàmica del Cervell
# Execució: ./sync_brain_termodinamic.sh

# Configuració
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WIKI_DIR="$(dirname "$SCRIPT_DIR")"
BRAIN_DIR="$WIKI_DIR/01_identitat_iaia"
WIKI_AGENTS_FILE="$BRAIN_DIR/AGENTS.md"
WORKSPACE_AGENTS_FILE="$WIKI_DIR/../.agents/AGENTS.md"
GENOTIP_FILE="$BRAIN_DIR/genotip.md"
TRELLAT_FILE="$WIKI_DIR/02_filosofia/el_trellat.md"
INDEX_FILE="$WIKI_DIR/00_index.md"

# Colors per a output
RED='\\033[0;31m'
GREEN='\\033[0;32m'
YELLOW='\\033[1;33m'
NC='\\033[0m' # No Color

# Funció per a validar l'estructura
validate_structure() {
    echo -e "${YELLOW}Validant estructura de la Wiki...${NC}"
    local errors=0

    if [ ! -f "$WIKI_AGENTS_FILE" ]; then
        echo -e "${RED}❌ ERROR: $WIKI_AGENTS_FILE no existeix.${NC}"
        errors=$((errors + 1))
    fi

    if [ ! -f "$GENOTIP_FILE" ]; then
        echo -e "${RED}❌ ERROR: $GENOTIP_FILE no existeix.${NC}"
        errors=$((errors + 1))
    fi

    if [ ! -f "$TRELLAT_FILE" ]; then
        echo -e "${RED}❌ ERROR: $TRELLAT_FILE no existeix.${NC}"
        errors=$((errors + 1))
    fi

    if [ ! -d "$WIKI_DIR/05_skills_ia" ]; then
        echo -e "${RED}❌ ERROR: $WIKI_DIR/05_skills_ia no existeix.${NC}"
        errors=$((errors + 1))
    fi

    if [ $errors -eq 0 ]; then
        echo -e "${GREEN}✅ Estructura vàlida.${NC}"
    else
        echo -e "${RED}❌ S'han trobat $errors errors d'estructura.${NC}"
        exit 1
    fi
}

# Funció per a validar noms termodinàmics
validate_termodinamic_names() {
    echo -e "${YELLOW}Validant noms termodinàmics...${NC}"
    local errors=0
    local non_termodinamic=()

    while IFS= read -r -d '' file; do
        filename=$(basename "$file")
        if ! [[ "$filename" =~ ^[0-9]{6}_[0-9]{4}_[A-Z]+_[a-z0-9_]+(\\.[a-z0-9]+)?$ ]] && [ "$filename" != "index_trellat.md" ] && [ "$filename" != "SKILL.md" ]; then
            non_termodinamic+=("$file")
            errors=$((errors + 1))
        fi
    done < <(find "$WIKI_DIR/05_skills_ia" -type f -name "*.md" -print0)

    if [ $errors -gt 0 ]; then
        echo -e "${RED}❌ S'han trobat $errors fitxers amb noms NO TERMODINÀMICS a Skills:${NC}"
        for file in "${non_termodinamic[@]}"; do
            echo "   - $file"
        done
    else
        echo -e "${GREEN}✅ Tots els noms són termodinàmics.${NC}"
    fi
}

# Funció per a sincronitzar el cervell
sync_brain() {
    echo -e "${YELLOW}Sincronitzant cervell amb la Wiki...${NC}"

    if [ ! -f "$WORKSPACE_AGENTS_FILE" ]; then
        cp "$WIKI_AGENTS_FILE" "$WORKSPACE_AGENTS_FILE"
        echo -e "${GREEN}✅ AGENTS.md copiat a $WORKSPACE_AGENTS_FILE${NC}"
    else
        if ! diff -q "$WORKSPACE_AGENTS_FILE" "$WIKI_AGENTS_FILE" > /dev/null; then
            echo -e "${YELLOW}⚠️  $WIKI_AGENTS_FILE difereix del local $WORKSPACE_AGENTS_FILE.${NC}"
            cp "$WORKSPACE_AGENTS_FILE" "$WIKI_AGENTS_FILE"
            echo -e "${GREEN}✅ $WIKI_AGENTS_FILE actualitzat des de .agents/AGENTS.md.${NC}"
        fi
    fi
}

# Funció per a reconstruir l'índex
rebuild_index() {
    echo -e "${YELLOW}Reconstruint índex...${NC}"
    node "$SCRIPT_DIR/auto_audit_skills.cjs" --rebuild-index
}

# Funció principal
main() {
    validate_structure
    validate_termodinamic_names
    sync_brain
    rebuild_index
    echo -e "${GREEN}✅ Sincronització termodinàmica completada.${NC}"
}

main

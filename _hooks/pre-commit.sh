#!/usr/bin/env bash
# Husky pre-commit hook: prohibit crear/escriure fitxers a l'arrel del repo
# Allowed root files (editar si cal): .gitignore, package.json, package-lock.json, yarn.lock, README.md
ALLOWED_ROOT_FILES=(".gitignore" "package.json" "package-lock.json" "yarn.lock" "README.md" "LICENSE" ".gitattributes" "SPEC-CENTRAL.md")

# Allowed root directories (prefixes)
ALLOWED_DIR_PREFIXES=("_scripts" "_docs" "_auditories" ".husky" ".git" "_skills" "public" "src" ".gemini")

# Message shown on reject
REJECT_MSG=$'ERROR: Creating or modifying files at repository root is forbidden.\nMove new files into one of: _scripts/, _docs/, _auditories/ or update allowed list.\nStaged offending files:\n'

# Get staged files that are Added, Copied or Modified (A,C,M)
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM)

if [ -z "$STAGED_FILES" ]; then
  exit 0
fi

OFFENDERS=()

for f in $STAGED_FILES; do
  # Normalize path (remove leading ./)
  path="${f#./}"

  # If path contains a slash, it's not at repo root -> allowed (but still check prefix)
  if [[ "$path" == */* ]]; then
    # Check if it starts with an allowed directory prefix
    ok=false
    for p in "${ALLOWED_DIR_PREFIXES[@]}"; do
      if [[ "$path" == "$p"* ]]; then
        ok=true
        break
      fi
    done
    if [ "$ok" = false ]; then
      OFFENDERS+=("$path")
    fi
  else
    # path has no slash -> file at repo root
    allowed=false
    for a in "${ALLOWED_ROOT_FILES[@]}"; do
      if [ "$path" = "$a" ]; then
        allowed=true
        break
      fi
    done
    if [ "$allowed" = false ]; then
      OFFENDERS+=("$path")
    fi
  fi
done

if [ ${#OFFENDERS[@]} -ne 0 ]; then
  echo -e "$REJECT_MSG"
  for o in "${OFFENDERS[@]}"; do
    echo "  - $o"
  done
  echo
  echo "Fix options:"
  echo "  * Move new files into _scripts/, _docs/ or _auditories/."
  echo "  * If a file must live at root, add it to the ALLOWED_ROOT_FILES in the hook (team decision)."
  echo "  * For temporary files, use .gitignore and a temp folder under _scripts/tmp/."
  exit 1
fi

exit 0

#!/usr/bin/env bash
set -euo pipefail

# ci/check-tailwind-imports.sh (Pro)
# - Verifica imports de Tailwind fora del fitxer autoritzat
# - Verifica directives @source fora del fitxer autoritzat
# - Heurística per selectors globals fora d'@layer (avís o error)
# - ANTI-ZOMBI: escaneja node_modules per imports tòxics o CSS prerenderitzat
# - Publica resultats a stdout (capturables pel workflow)
#
# Config via env:
#  ALLOWED_TAILWIND_IMPORT (default src/app/index.css)
#  FAIL_ON_SOURCES_OUTSIDE (true|false)
#  WARN_ONLY_SELECTORS (true|false)
#  ALLOWLIST_PACKAGES (comma-separated package names to ignore in node_modules)
#  MAX_CSS_SIZE_BYTES (threshold to consider a CSS file "prerendered", default 200000)
#
ALLOWED_TAILWIND_IMPORT="${ALLOWED_TAILWIND_IMPORT:-src/app/index.css}"
FAIL_ON_SOURCES_OUTSIDE="${FAIL_ON_SOURCES_OUTSIDE:-true}"
WARN_ONLY_SELECTORS="${WARN_ONLY_SELECTORS:-true}"
ALLOWLIST_PACKAGES="${ALLOWLIST_PACKAGES:-}"
MAX_CSS_SIZE_BYTES="${MAX_CSS_SIZE_BYTES:-200000}"

# helper: join allowlist into rg exclude pattern
IFS=',' read -r -a ALLOW_ARR <<< "$ALLOWLIST_PACKAGES"

echo "CI Pro check: allowed tailwind import file: $ALLOWED_TAILWIND_IMPORT"
echo "FAIL_ON_SOURCES_OUTSIDE=$FAIL_ON_SOURCES_OUTSIDE WARN_ONLY_SELECTORS=$WARN_ONLY_SELECTORS"
echo "ALLOWLIST_PACKAGES=${ALLOWLIST_PACKAGES:-<none>} MAX_CSS_SIZE_BYTES=$MAX_CSS_SIZE_BYTES"
echo

# choose search command
if command -v rg >/dev/null 2>&1; then
  RG="rg --hidden --no-ignore-vcs --line-number --no-heading"
else
  RG="grep -RIn --line-number --no-messages -E"
fi

# wrapper search function
search() {
  local pattern="$1"; shift
  if command -v rg >/dev/null 2>&1; then
    rg --hidden --no-ignore-vcs --line-number --no-heading "$pattern" "$@" || true
  else
    grep -RIn --line-number --no-messages -E "$pattern" "$@" || true
  fi
}

# 1) Tailwind imports
echo "1) Scanning for @import 'tailwindcss'..."
TAILWIND_IMPORTS=$(search '@import\s+["'"'"']tailwindcss["'"'"']' .)
if [ -z "$TAILWIND_IMPORTS" ]; then
  echo "  OK: no @import 'tailwindcss' found in repo sources."
else
  echo "$TAILWIND_IMPORTS" | sed 's/^/  /'
  BAD_IMPORTS=$(echo "$TAILWIND_IMPORTS" | awk -F: -v allowed="$ALLOWED_TAILWIND_IMPORT" '{ if ($1 != allowed) print $0 }' || true)
  if [ -n "$BAD_IMPORTS" ]; then
    echo
    echo "ERROR: Tailwind import found outside allowed file ($ALLOWED_TAILWIND_IMPORT)."
    echo "$BAD_IMPORTS" | sed 's/^/  /'
    echo
    echo "Quick fix: remove @import 'tailwindcss' from packages; keep single import at $ALLOWED_TAILWIND_IMPORT"
    # continue to collect node_modules issues before exit
    TAILWIND_FAIL=1
  else
    echo "  OK: all Tailwind imports are in $ALLOWED_TAILWIND_IMPORT"
    TAILWIND_FAIL=0
  fi
fi
echo

# 2) @source directives
echo "2) Scanning for @source directives..."
SOURCES=$(search '@source' .)
if [ -z "$SOURCES" ]; then
  echo "  OK: no @source directives found."
  SOURCES_FAIL=0
else
  echo "$SOURCES" | sed 's/^/  /'
  BAD_SOURCES=$(echo "$SOURCES" | awk -F: -v allowed="$ALLOWED_TAILWIND_IMPORT" '{ if ($1 != allowed) print $0 }' || true)
  if [ -n "$BAD_SOURCES" ]; then
    if [ "$FAIL_ON_SOURCES_OUTSIDE" = "true" ]; then
      echo
      echo "ERROR: @source directives found outside $ALLOWED_TAILWIND_IMPORT"
      echo "$BAD_SOURCES" | sed 's/^/  /'
      SOURCES_FAIL=1
    else
      echo "WARN: @source outside allowed file (configured to warn only)."
      SOURCES_FAIL=0
    fi
  else
    echo "  OK: all @source directives are in $ALLOWED_TAILWIND_IMPORT"
    SOURCES_FAIL=0
  fi
fi
echo

# 3) Heuristic: global selectors without @layer
echo "3) Heuristic: global selectors (html, body, :root, *) in files without @layer near top"
FILES=$(git ls-files '*.css' '*.pcss' '*.scss' 2>/dev/null || true)
if [ -z "$FILES" ]; then FILES="."; fi
BAD_GLOBALS=""
for f in $FILES; do
  # skip node_modules
  if echo "$f" | rg -q '^node_modules/' >/dev/null 2>&1; then continue; fi
  if (search '(^|\s)(\*|html|body|:root)\b' "$f" | sed -n '1p') >/dev/null 2>&1; then
    if ! head -n 40 "$f" 2>/dev/null | rg -q '@layer' >/dev/null 2>&1; then
      BAD_GLOBALS="${BAD_GLOBALS}\n$f"
    fi
  fi
done

if [ -n "$BAD_GLOBALS" ]; then
  echo "WARN: files with global selectors and no @layer in first 40 lines:"
  echo -e "$BAD_GLOBALS" | sed 's/^/  /'
  if [ "$WARN_ONLY_SELECTORS" = "true" ]; then
    echo "Note: this is a heuristic warning (does not fail CI by default)."
    GLOBALS_FAIL=0
  else
    GLOBALS_FAIL=1
  fi
else
  echo "  OK: no suspicious global selectors found (heuristic)."
  GLOBALS_FAIL=0
fi
echo

# 4) ANTI-ZOMBI: scan node_modules for toxic imports or prerendered CSS
echo "4) ANTI-ZOMBI: scanning node_modules for @import 'tailwindcss' or global resets or large CSS files..."
ZOMBIE_FAIL=0
ZOMBIE_REPORT=""

# 4.a) search for explicit tailwind import inside node_modules
if [ -d "node_modules" ]; then
  echo "  4.a) Searching node_modules for @import 'tailwindcss'..."
  NM_TW=$(search '@import\s+["'"'"']tailwindcss["'"'"']' node_modules || true)
  if [ -n "$NM_TW" ]; then
    # filter allowlist
    while IFS= read -r line; do
      pkg=$(echo "$line" | awk -F: '{print $1}')
      skip=false
      for a in "${ALLOW_ARR[@]}"; do
        if [ -n "$a" ] && echo "$pkg" | rg -q "/$a(/|$)"; then skip=true; break; fi
      done
      if [ "$skip" = "true" ]; then
        echo "    Ignoring allowlisted package: $pkg"
      else
        ZOMBIE_REPORT="${ZOMBIE_REPORT}\n${line}"
        ZOMBIE_FAIL=1
      fi
    done <<< "$NM_TW"
  else
    echo "    OK: no explicit tailwind import in node_modules."
  fi

  # 4.b) search for global resets or :root in node_modules CSS files (heuristic)
  echo "  4.b) Searching node_modules for global selectors (:root, html, body, *) in CSS files..."
  NM_GLOBALS=$(search '(^|\s)(:root|html|body|\*)\b' node_modules --glob '!**/*.map' || true)
  if [ -n "$NM_GLOBALS" ]; then
    while IFS= read -r line; do
      pkg=$(echo "$line" | awk -F: '{print $1}')
      skip=false
      for a in "${ALLOW_ARR[@]}"; do
        if [ -n "$a" ] && echo "$pkg" | rg -q "/$a(/|$)"; then skip=true; break; fi
      done
      if [ "$skip" = "true" ]; then
        echo "    Ignoring allowlisted package (global selectors): $pkg"
      else
        ZOMBIE_REPORT="${ZOMBIE_REPORT}\n${line}"
        ZOMBIE_FAIL=1
      fi
    done <<< "$NM_GLOBALS"
  else
    echo "    OK: no obvious global selectors in node_modules CSS."
  fi

  # 4.c) detect very large CSS files (prerendered bundles) in node_modules
  echo "  4.c) Searching for large CSS files in node_modules (> ${MAX_CSS_SIZE_BYTES} bytes)..."
  while IFS= read -r file; do
    size=$(stat -c%s "$file" 2>/dev/null || stat -f%z "$file" 2>/dev/null || echo 0)
    if [ "$size" -ge "$MAX_CSS_SIZE_BYTES" ]; then
      pkg="$file"
      skip=false
      for a in "${ALLOW_ARR[@]}"; do
        if [ -n "$a" ] && echo "$pkg" | rg -q "/$a(/|$)"; then skip=true; break; fi
      done
      if [ "$skip" = "true" ]; then
        echo "    Ignoring allowlisted large CSS: $pkg"
      else
        ZOMBIE_REPORT="${ZOMBIE_REPORT}\nLARGE_CSS: $file ($size bytes)"
        ZOMBIE_FAIL=1
      fi
    fi
  done < <(find node_modules -type f -name '*.css' -print 2>/dev/null)
else
  echo "  node_modules not present; skipping Anti-Zombi checks."
fi

if [ "$ZOMBIE_FAIL" -eq 1 ]; then
  echo
  echo "ERROR: Anti-Zombi checks detected potential toxic CSS in node_modules:"
  echo -e "$ZOMBIE_REPORT" | sed 's/^/  /'
  echo
  echo "Recommended actions:"
  echo "  - Replace or patch the offending package; ask upstream to remove @import 'tailwindcss' or global resets."
  echo "  - Add safe packages to ALLOWLIST_PACKAGES env var if you intentionally allow them."
  echo "  - Vendor CSS carefully: import only component CSS, not global resets."
fi
echo

# 5) Additional heuristic: imports of index.css
echo "5) Searching for imports of index.css that may inject global styles..."
DUP_INDEX_IMPORTS=$(search '@import\s+["'"'"'].*index.css["'"'"']' .)
if [ -n "$DUP_INDEX_IMPORTS" ]; then
  echo "WARN: found index.css imports (may inject resets):"
  echo "$DUP_INDEX_IMPORTS" | sed 's/^/  /'
else
  echo "  OK: no suspicious index.css imports found."
fi
echo

# Final decision
EXIT_CODE=0
if [ "${TAILWIND_FAIL:-0}" -eq 1 ] || [ "${SOURCES_FAIL:-0}" -eq 1 ] || [ "${GLOBALS_FAIL:-0}" -eq 1 ] || [ "${ZOMBIE_FAIL:-0}" -eq 1 ]; then
  echo "One or more checks failed. See above for details."
  EXIT_CODE=1
else
  echo "All checks passed."
fi

exit $EXIT_CODE

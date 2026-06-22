#!/usr/bin/env bash
# tools/create-format-patches-from-local-files.sh
# Creates a temporary branch, commits each provided file as a separate commit,
# runs git format-patch to produce one .patch file per commit into ./patches,
# and installs the pre-commit hook if tools/auto-clean-precommit.sh exists.
#
# Usage:
#   ./tools/create-format-patches-from-local-files.sh [file1 file2 ...]
# If no args provided, the script will use the default set of files used by the Trellat automation.

set -euo pipefail

# Default file list (adjust if you renamed some to .cjs)
DEFAULT_FILES=(
  "scripts/find-ghosts.cjs"
  "scripts/clean-html-build.cjs"
  "scripts/run-ghosts-automation.cjs"
  "src/utils/cleanHtmlNode.js"
  "src/utils/stripInlineAndTailwind.js"
  "src/styles/app-cms-content.css"
  "tools/auto-clean-precommit.sh"
  "Makefile"
)

# Collect files from args or use defaults
if [ "$#" -gt 0 ]; then
  FILES=("$@")
else
  FILES=("${DEFAULT_FILES[@]}")
fi

# Verify git repo
if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Error: not inside a git repository."
  exit 1
fi

# Verify files exist
MISSING=0
for f in "${FILES[@]}"; do
  if [ ! -f "$f" ]; then
    echo "Missing file: $f"
    MISSING=1
  fi
done
if [ "$MISSING" -eq 1 ]; then
  echo "One or more files are missing. Fix paths or pass explicit file list."
  exit 2
fi

# Save current branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
TIMESTAMP=$(date +%s)
TMP_BRANCH="trellat/ghosts-patches-${TIMESTAMP}"

echo "Creating temporary branch: ${TMP_BRANCH} (from ${CURRENT_BRANCH})"
git checkout -b "${TMP_BRANCH}"

# Commit each file separately (keeps history granular)
for f in "${FILES[@]}"; do
  echo "Staging and committing: ${f}"
  git add -- "${f}"
  # Use a clear commit message including path
  git commit --no-verify -m "chore(ghosts): add ${f}" -- "${f}"
done

# Create patches directory
PATCH_DIR="patches"
mkdir -p "${PATCH_DIR}"

# Number of commits to export = number of files committed
COUNT=${#FILES[@]}

# Generate format-patch files for the last COUNT commits
echo "Generating ${COUNT} patch(es) into ${PATCH_DIR}/"
git format-patch -${COUNT} -o "${PATCH_DIR}"

# Install pre-commit hook if available
HOOK_SRC="tools/auto-clean-precommit.sh"
HOOK_DEST=".git/hooks/pre-commit"
if [ -f "${HOOK_SRC}" ]; then
  echo "Installing pre-commit hook from ${HOOK_SRC} -> ${HOOK_DEST}"
  cp "${HOOK_SRC}" "${HOOK_DEST}"
  chmod +x "${HOOK_DEST}"
  echo "Pre-commit hook installed."
else
  echo "No pre-commit hook found at ${HOOK_SRC}; skipping hook install."
fi

echo
echo "Done."
echo " - Temporary branch created: ${TMP_BRANCH}"
echo " - Patches saved in: ${PATCH_DIR}/"
echo " - To inspect commits: git log --oneline ${TMP_BRANCH}"
echo " - To switch back to your previous branch: git checkout ${CURRENT_BRANCH}"
echo
echo "If you want to keep the commits in the main branch, merge ${TMP_BRANCH} into your target branch."

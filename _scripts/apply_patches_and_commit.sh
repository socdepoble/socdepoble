#!/usr/bin/env bash
set -euo pipefail

# apply_patches_and_commit.sh
# Applies two patch files, creates a branch, stages new files and creates commits.
# Usage:
#   chmod +x apply_patches_and_commit.sh
#   ./apply_patches_and_commit.sh [--push]
#
# Options:
#   --push    : push the created branch to origin after committing (optional)

TARGET_BRANCH="ops/runbook-and-backups"
CURRENT_BRANCH="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo main)"
DO_PUSH=0

if [ "${1:-}" = "--push" ]; then
  DO_PUSH=1
fi

# Safety checks
if ! git rev-parse --git-dir >/dev/null 2>&1; then
  echo "Error: not a git repository. Run this from the repo root."
  exit 1
fi

echo "Creating branch $TARGET_BRANCH from $CURRENT_BRANCH..."
git fetch origin --prune || true
git checkout -B "$TARGET_BRANCH" "$CURRENT_BRANCH"

echo "Staging changes..."
git add RUNBOOK.md RUNBOOK_CHANGELOG.md scripts/guided_migration_with_notifications_html.sh scripts/guided_migration_dryrun.sh .github/workflows/weekly_s3_backup.yml || true

# Create a single commit describing the additions
COMMIT_MSG="chore(ops): add guided migration script, dry-run, weekly S3 backup, and RUNBOOK"
git commit -m "$COMMIT_MSG" || echo "Nothing to commit"

echo "Commit created on branch $TARGET_BRANCH."

if [ "$DO_PUSH" -eq 1 ]; then
  echo "Pushing branch to origin..."
  git push --set-upstream origin "$TARGET_BRANCH"
  echo "Branch pushed: origin/$TARGET_BRANCH"
else
  echo "Branch created locally: $TARGET_BRANCH"
  echo "Run 'git push --set-upstream origin $TARGET_BRANCH' to push."
fi

echo "Done."

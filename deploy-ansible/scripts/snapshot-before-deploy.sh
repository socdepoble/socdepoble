#!/usr/bin/env bash
set -euo pipefail
TIMESTAMP=$(date +%Y%m%dT%H%M%S)
SNAP_DIR="/var/backups/sdp-snapshots/${TIMESTAMP}"
mkdir -p "${SNAP_DIR}"
if [ -d /var/www/sdp-dashboard ]; then
  tar -czf "${SNAP_DIR}/dashboard-${TIMESTAMP}.tar.gz" -C /var/www sdp-dashboard
fi
if [ -d /var/lib/sdp-reports ]; then
  tar -czf "${SNAP_DIR}/reports-${TIMESTAMP}.tar.gz" -C /var/lib sdp-reports
fi
ln -sfn "${SNAP_DIR}" /var/backups/sdp-snapshots/latest
echo "Snapshot creat: ${SNAP_DIR}"

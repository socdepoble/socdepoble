#!/usr/bin/env bash
set -euo pipefail
SNAPSHOT_DIR=${1:-/var/backups/sdp-snapshots/latest}
if [ ! -d "${SNAPSHOT_DIR}" ]; then
  echo "Snapshot no trobat: ${SNAPSHOT_DIR}"
  exit 1
fi
if ls ${SNAPSHOT_DIR}/dashboard-*.tar.gz 1> /dev/null 2>&1; then
  rm -rf /var/www/sdp-dashboard
  tar -xzf ${SNAPSHOT_DIR}/dashboard-*.tar.gz -C /var/www
  chown -R www-data:www-data /var/www/sdp-dashboard
fi
if ls ${SNAPSHOT_DIR}/reports-*.tar.gz 1> /dev/null 2>&1; then
  rm -rf /var/lib/sdp-reports
  tar -xzf ${SNAPSHOT_DIR}/reports-*.tar.gz -C /var/lib
  chown -R www-data:www-data /var/lib/sdp-reports
fi
echo "Restauració completada"

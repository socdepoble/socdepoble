#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

echo "[orchestrator] Començant prova multi-node"

# 1) Comprovar entropia
echo "[orchestrator] Executant detecta_entropia.sh..."
if ! ./scripts/detecta_entropia.sh . ; then
  echo "[orchestrator][ERROR] detecta_entropia ha fallat"
  exit 2
fi
echo "[orchestrator] detecta_entropia OK"

# 2) Sembrar fixtures i ops conflictius
echo "[orchestrator] Sembrant fixtures..."
node ./scripts/seed_conflicts.js

# 3) Esperar que nodes estiguen actius
NODES=(8081 8082 8083)
for port in "${NODES[@]}"; do
  echo "[orchestrator] Esperant node a http://localhost:${port}/health ..."
  i=0
  until curl -sSf "http://localhost:${port}/health" > /dev/null 2>&1 || [ $i -gt 20 ]; do
    i=$((i+1))
    sleep 1
  done
  if [ $i -gt 20 ]; then
    echo "[orchestrator][ERROR] Node a port ${port} no ha arrencat"
    docker-compose -f docker-compose.yml logs --no-color > tests/network_orchestrator_error.log || true
    exit 3
  fi
  echo "[orchestrator] Node ${port} actiu"
done

# 4) Simular sincronitzacions entre nodes
echo "[orchestrator] Simulant sincronitzacions entre nodes..."
# Enviar op_queue.json de cada node al seu endpoint local per aplicar ops
for node in node1 node2 node3; do
  DATA_DIR="./data/${node}"
  OPQ="${DATA_DIR}/op_queue.json"
  if [ -f "$OPQ" ]; then
    OPS_JSON=$(cat "$OPQ")
    PORT_VAR=$(grep -E "${node}" -n docker-compose.yml >/dev/null && true; )
    case "$node" in
      node1) PORT=8081;;
      node2) PORT=8082;;
      node3) PORT=8083;;
    esac
    echo "[orchestrator] Enviant ops de ${node} a http://localhost:${PORT}/sync/ops"
    curl -sSf -X POST "http://localhost:${PORT}/sync/ops" -H "Content-Type: application/json" -d "{\"ops\": $OPS_JSON}" > /dev/null || true
  fi
done

# 5) Esperar un moment per a que nodes apliquen ops
sleep 2

# 6) Recollir dumps de cada node per inspecció
echo "[orchestrator] Recollint dumps..."
for port in "${NODES[@]}"; do
  curl -s "http://localhost:${port}/dump" -o "tests/dump_${port}.json" || true
done

# 7) Executar tests de reconciliació centralitzats si cal
echo "[orchestrator] Executant tests locals de reconciliació..."
# Cridar el script run_tests.sh dins del contenidor (ja present)
./scripts/run_tests.sh || { echo "[orchestrator][ERROR] Tests fallats"; exit 4; }

# 8) Finalitzar
echo "[orchestrator] Prova multi-node completada amb èxit"
exit 0

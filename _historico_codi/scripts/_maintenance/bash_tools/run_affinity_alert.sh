#!/bin/bash
rm -f sse_pipe
mkfifo sse_pipe

# Start SSE in background
curl -N -s http://localhost:6767/sse > sse_pipe &
CURL_PID=$!

echo "Esperant endpoint SSE..."
ENDPOINT=""
while IFS= read -r line; do
  # Remove carriage returns just in case
  line=$(echo "$line" | tr -d '\r')
  if [[ "$line" == data:\ /message* ]]; then
    ENDPOINT=${line#data: }
    break
  fi
done < sse_pipe

if [ -z "$ENDPOINT" ]; then
    echo "No s'ha obtingut l'endpoint. Comprova el servidor MCP."
    kill $CURL_PID 2>/dev/null
    rm -f sse_pipe
    exit 1
fi
echo "Endpoint rebut: $ENDPOINT"
URL="http://localhost:6767$ENDPOINT"

echo "Enviant initialize..."
curl -s -X POST "$URL" -H "Content-Type: application/json" -d '{"jsonrpc": "2.0", "id": 1, "method": "initialize", "params": {"protocolVersion": "2025-11-25", "capabilities": {}, "clientInfo": {"name": "Antigravity", "version": "1.0"}}}' > /dev/null

echo "Enviant initialized..."
curl -s -X POST "$URL" -H "Content-Type: application/json" -d '{"jsonrpc": "2.0", "method": "notifications/initialized"}' > /dev/null

echo "Executant script a Affinity..."
SCRIPT_TEXT='const { app } = require("/application"); app.alert("Sóc de Poble és Arquitectura de Ferro per a legislació àgil.\\n\\nÉs eficiència nativa, Trellat forense i un sistema visual automatitzat des de la maquetació en codi fins a la impressió.\\n\\nNo usem el núvol; vivim en la teua pròpia màquina per produir monuments digitals eterns.", "VISOR NANO - QUÈ ÉS SÓC DE POBLE?"); return "Alerta disparada via bash asíncron!";'

JSON_PAYLOAD=$(cat <<EOF
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/call",
  "params": {
    "name": "execute_script",
    "arguments": {
      "script": $(jq -Rs . <<< "$SCRIPT_TEXT")
    }
  }
}
EOF
)

curl -s -X POST "$URL" -H "Content-Type: application/json" -d "$JSON_PAYLOAD" | jq .

# Cleanup
kill $CURL_PID 2>/dev/null
rm -f sse_pipe

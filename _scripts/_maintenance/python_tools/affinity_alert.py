import urllib.request
import json
import time
import threading

endpoint = []

def sse_reader():
    req = urllib.request.Request("http://localhost:6767/sse")
    try:
        with urllib.request.urlopen(req) as response:
            for line in response:
                decoded = line.decode('utf-8').strip()
                if decoded.startswith('data: /message'):
                    endpoint.append(decoded[6:].strip())
    except Exception as e:
        print("SSE Error:", e)

t = threading.Thread(target=sse_reader)
t.daemon = True
t.start()

print("Esperant connexió SSE...", flush=True)
while not endpoint:
    time.sleep(0.1)

print(f"Endpoint establit: {endpoint[0]}", flush=True)
url = f"http://localhost:6767{endpoint[0]}"

def post(method, params=None, id=None):
    data = {"jsonrpc":"2.0", "method":method}
    if params: data["params"] = params
    if id is not None: data["id"] = id
    
    req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers={'Content-Type':'application/json'})
    with urllib.request.urlopen(req) as response:
        content = response.read().decode('utf-8')
        if content and content.strip() != 'Accepted':
            try:
                return json.loads(content)
            except Exception:
                return content
        return None

post("initialize", {"protocolVersion": "2025-11-25", "capabilities": {}, "clientInfo": {"name": "Antigravity", "version": "1.0"}}, 1)
post("notifications/initialized")

# Executar script a Affinity
print("Iniciant injecció a Affinity...", flush=True)
script_text = """
const { app } = require('/application');
app.alert("Sóc de Poble és Arquitectura de Ferro per a legislació àgil.\\n\\nÉs eficiència nativa, Trellat forense i un sistema visual automatitzat des de la maquetació en codi fins a la impressió.\\n\\nNo usem el núvol; vivim en la teua pròpia màquina per produir monuments digitals eterns.", "VISOR NANO - QUÈ ÉS SÓC DE POBLE?");
return "Alerta demostrativa enviada amb èxit!";
"""

res = post("tools/call", {"name": "execute_script", "arguments": {"script": script_text}}, 2)
print("Resultat:", json.dumps(res, indent=2), flush=True)

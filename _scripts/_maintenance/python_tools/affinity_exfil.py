import urllib.request
import json
import time
import threading
import http.server
import socketserver

# --- Local HTTP Server for Exfiltration ---
class ExfilHandler(http.server.BaseHTTPRequestHandler):
    def do_POST(self):
        length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(length)
        # Write to file
        with open('/Users/javillinares/Documents/Antigravity/Sóc de Poble/affinity_dom_dump.json', 'w') as f:
            f.write(post_data.decode('utf-8'))
        
        self.send_response(200)
        self.end_headers()
        self.wfile.write(b"OK")
        
        # Shutdown server
        def kill_server():
            httpd.shutdown()
        threading.Thread(target=kill_server).start()

    def log_message(self, format, *args):
        pass # Silence logs

httpd = socketserver.TCPServer(("", 8080), ExfilHandler)
server_thread = threading.Thread(target=httpd.serve_forever)
server_thread.daemon = True
server_thread.start()
print("Servidor d'exfiltració actiu al port 8080...")

# --- SSE Client ---
endpoint = []
def sse_reader():
    req = urllib.request.Request("http://localhost:6767/sse")
    try:
        with urllib.request.urlopen(req) as response:
            for line in response:
                decoded = line.decode('utf-8').strip()
                if decoded.startswith('data: /message'):
                    endpoint.append(decoded[6:].strip())
    except:
        pass

t = threading.Thread(target=sse_reader)
t.daemon = True
t.start()

while not endpoint:
    time.sleep(0.1)

url = f"http://localhost:6767{endpoint[0]}"

def post(method, params=None, id=None):
    data = {"jsonrpc":"2.0", "method":method}
    if params: data["params"] = params
    if id is not None: data["id"] = id
    req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers={'Content-Type':'application/json'})
    try: urllib.request.urlopen(req)
    except: pass

post("initialize", {"protocolVersion": "2025-11-25", "capabilities": {}, "clientInfo": {"name": "Antigravity", "version": "1.0"}}, 1)
post("notifications/initialized")
post("tools/call", {"name": "read_sdk_documentation_topic", "arguments": {"filename": "preamble"}}, 2)
time.sleep(0.5)

# --- Script with Fetch Exfiltration ---
script_text = """
(function() {
    const { app } = require('/application');
    try {
        const doc = app.documents.current;
        if (!doc) {
            fetch("http://localhost:8080/", { method: "POST", body: JSON.stringify({ error: "NO_DOC_OPEN" }) });
            return;
        }
        
        let result = {
            title: doc.name || doc.title || "Untitled",
            pageCount: doc.pages ? doc.pages.length : 0,
            layers: []
        };
        
        let pages = doc.pages;
        if (pages) {
            for (let i = 0; i < pages.length; i++) {
                let page = pages[i];
                let pInfo = { id: i, items: [] };
                if (page.children) {
                    for (let j = 0; j < Math.min(page.children.length, 100); j++) {
                        let child = page.children[j];
                        pInfo.items.push({
                            name: child.name,
                            type: child.constructor.name,
                            text: child.text || null,
                            x: child.x, y: child.y, w: child.width, h: child.height
                        });
                    }
                }
                result.layers.push(pInfo);
            }
        }
        
        // Exfiltrate JSON directly to our local Python server!
        fetch("http://localhost:8080/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(result)
        });
        
    } catch (e) {
        fetch("http://localhost:8080/", { method: "POST", body: JSON.stringify({ error: e.message }) });
    }
})();
"""

post("tools/call", {"name": "execute_script", "arguments": {"script": script_text}}, 3)

# Wait for the HTTP server to receive the data and shutdown
for _ in range(50):
    time.sleep(0.1)
    if not server_thread.is_alive():
        print("Dades exfiltrades correctament a affinity_dom_dump.json!")
        break
else:
    print("El servidor no ha rebut dades en 5 segons. Cancel·lant...")

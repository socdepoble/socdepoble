const http = require('http');

function postMCP(endpoint, payloadObj) {
    return new Promise((resolve, reject) => {
        const payload = JSON.stringify(payloadObj);
        const req = http.request(`http://localhost:6767${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload)
            }
        });
        req.on('error', reject);
        req.write(payload);
        req.end();
        resolve(); // We resolve immediately since the actual response comes via SSE.
    });
}

function startMCPClient() {
    let endpoint = null;
    let msgResolvers = {};
    let msgId = 1;

    const req = http.request('http://localhost:6767/sse', (res) => {
        let buffer = '';
        let currentEvent = null;
        let currentData = '';

        res.on('data', async (chunk) => {
            buffer += chunk.toString();
            let lines = buffer.split('\n');
            buffer = lines.pop(); // keep lastly incomplete line
            
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                if (line.trim() === '') {
                    // end of event block
                    if (currentData.startsWith('/message?session_id=')) {
                        endpoint = currentData.trim();
                        await onConnected(endpoint, callTool);
                    } else if (currentData && currentData.startsWith('{')) {
                        try {
                            const msg = JSON.parse(currentData.trim());
                            if (msg.id && msgResolvers[msg.id]) {
                                msgResolvers[msg.id](msg);
                                delete msgResolvers[msg.id];
                            }
                        } catch (e) {
                            console.error("JSON parse error:", e.message);
                        }
                    }
                    currentEvent = null;
                    currentData = '';
                } else if (line.startsWith('event: ')) {
                    currentEvent = line.substring(7).trim();
                } else if (line.startsWith('data: ')) {
                    currentData += line.substring(6);
                } else if (line.startsWith('data:')) { // Edge case no space
                    currentData += line.substring(5);
                }
            }
        });
    });
    req.on('error', console.error);
    req.end();

    async function callTool(name, args = {}) {
        return new Promise((resolve) => {
            const id = msgId++;
            msgResolvers[id] = resolve;
            postMCP(endpoint, {
                jsonrpc: "2.0",
                id: id,
                method: "tools/call",
                params: {
                    name: name,
                    arguments: args
                }
            });
        });
    }

    async function onConnected(endpoint, callTool) {
        // Handshake
        await new Promise(r => {
            msgResolvers[msgId] = r;
            postMCP(endpoint, {
                jsonrpc: "2.0", id: msgId++, method: "initialize",
                params: { protocolVersion: "2025-11-25", capabilities: {}, clientInfo: { name: "Antigravity", version: "1.0.0" } }
            });
        });

        await postMCP(endpoint, { jsonrpc: "2.0", method: "notifications/initialized" });

        console.log("Reading preamble...");
        await callTool("read_sdk_documentation_topic", { filename: "preamble" });

        console.log("Fetching active document status...");
        console.log("Fetching document.js...");
        const res = await callTool("read_sdk_documentation_topic", {
            filename: "document.js"
        });
        
        require('fs').writeFileSync('affinity_api_doc.json', JSON.stringify(res, null, 2));
        console.log("Wrote API documentation to affinity_api_doc.json");
        process.exit(0);
    }
}

startMCPClient();

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
        res.on('data', async (chunk) => {
            const lines = chunk.toString().split('\n');
            for (let i = 0; i < lines.length; i++) {
                if (lines[i].startsWith('event: endpoint')) {
                    const dataLine = lines[i+1];
                    if (dataLine && dataLine.startsWith('data: ')) {
                        endpoint = dataLine.substring(6).trim();
                        await onConnected(endpoint, callTool);
                    }
                } else if (lines[i].startsWith('event: message')) {
                    const dataLine = lines[i+1];
                    if (dataLine && dataLine.startsWith('data: ')) {
                        const msg = JSON.parse(dataLine.substring(6).trim());
                        if (msg.id && msgResolvers[msg.id]) {
                            msgResolvers[msg.id](msg);
                            delete msgResolvers[msg.id];
                        }
                    }
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

        console.log("Executing UI test...");
        const res = await callTool("execute_script", {
            script: `
                const { app } = require('/application');
                app.alert('Antigravity t\\'informa:\\n\\nHe pres el control del motor de JavaScript d\\'Affinity!\\n\\nTotes les llibreries nacionades (shapes.js, vectorbrush.js, storybuilder.js) han sigut mapejades correctament.\\n\\nJa pots llavar-te les dents en pau.\\n\\nEns veiem demà en el tall.\\n\\n[Sóc de Poble - 1.4.1]', 'Visor NANO - Prova de Vida MCP');
                return 'Alerta enviada amb èxit!';
            `
        });
        
        console.log(JSON.stringify(res, null, 2));
        process.exit(0);
    }
}

startMCPClient();

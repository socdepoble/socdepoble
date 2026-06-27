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
        resolve(); // Response comes via SSE
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
            buffer = lines.pop(); 
            
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                if (line.trim() === '') {
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
                } else if (line.startsWith('data:')) {
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
        console.log("Connected to SSE at endpoint: " + endpoint);
        try {
            await new Promise(r => {
                msgResolvers[msgId] = r;
                postMCP(endpoint, {
                    jsonrpc: "2.0", id: msgId++, method: "initialize",
                    params: { protocolVersion: "2025-11-25", capabilities: {}, clientInfo: { name: "Antigravity", version: "1.0.0" } }
                });
            });
            console.log("Initialized 1/2");

            await postMCP(endpoint, { jsonrpc: "2.0", method: "notifications/initialized" });
            console.log("Initialized 2/2");

            console.log("Reading preamble...");
            const pRes = await callTool("read_sdk_documentation_topic", { filename: "preamble" });
            console.log("Preamble read result:", JSON.stringify(pRes).slice(0, 50));

            console.log("Executing introspection script...");
            const scriptExt = `
const { app } = require('/application');
const doc = app.documents.current;
if (!doc) return { error: "No hi ha document obert" };

function getObjInfo(obj) {
    if (!obj) return null;
    let node = {
        name: obj.name,
        type: obj.constructor.name,
        x: obj.x, y: obj.y, w: obj.width, h: obj.height,
        bounds: obj.bounds,
        layerType: obj.layerType
    };
    if (obj.text !== undefined) node.text = obj.text;
    
    // Si és un sub-node de text, etc...
    if (obj.children && obj.children.length > 0) {
        node.children = [];
        for (let i=0; i<obj.children.length; i++) {
             // To avoid massive deep recursion, just go 3 levels
             node.children.push(getObjInfo(obj.children[i]));
        }
    }
    return node;
}

try {
    let result = {
        title: doc.name || doc.title,
        pages: []
    };
    if (doc.pages) {
        for (let i=0; i<doc.pages.length; i++) {
            let pInfo = { items: [] };
            let page = doc.pages[i];
            if (page.children) {
                 for (let j=0; j<page.children.length; j++) {
                      pInfo.items.push(getObjInfo(page.children[j]));
                 }
            }
            result.pages.push(pInfo);
        }
    }
    return result;
} catch(e) {
    return { error: e.message };
}
            `;

            const res = await callTool("execute_script", { script: scriptExt });
            console.log("Introspection script returned.");
            require('fs').writeFileSync('affinity_dom_dump.json', JSON.stringify(res, null, 2));
            console.log("Written DOM layout style to affinity_dom_dump.json.");
        } catch (e) {
            console.error("Error connected logic:", e);
        }
        process.exit(0);
    }
}

startMCPClient();

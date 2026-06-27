const http = require('http');

let sseResultReceived = false;
let step = 0;

const req = http.request('http://localhost:6767/sse', (res) => {
    let endpoint = null;
    res.on('data', (chunk) => {
        const text = chunk.toString();
        const lines = text.split('\n');
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].startsWith('event: endpoint')) {
                const dataLine = lines[i+1];
                if (dataLine && dataLine.startsWith('data: ')) {
                    endpoint = dataLine.substring(6).trim();
                    sendInitialize(endpoint);
                }
            } else if (lines[i].startsWith('event: message')) {
                const dataLine = lines[i+1];
                if (dataLine && dataLine.startsWith('data: ')) {
                    const msg = JSON.parse(dataLine.substring(6).trim());
                    if (msg.id === 1 && msg.result) {
                        // Received initialize result
                        sendInitializedNotificationAndCall(endpoint);
                    } else if (msg.id === 2) {
                        // Read preamble done
                        if (!msg.error) {
                            console.log("\n=== PREAMBLE DUMP ===");
                            console.log(msg.result.content[0].text.substring(0, 500) + "\n...[truncat]");
                            console.log("===============================\n");
                            sendExecuteScript(endpoint);
                        } else {
                            console.error("Error reading preamble:", msg);
                        }
                    } else if (msg.id === 3) {
                        console.log("\n=== RESPOSTA AFFINITY MCP ===");
                        console.log(JSON.stringify(msg, null, 2));
                        console.log("===============================\n");
                        process.exit(0);
                    } else if (msg.error) {
                        console.error("ERROR from server:", JSON.stringify(msg.error, null, 2));
                        process.exit(1);
                    }
                }
            }
        }
    });
});
req.on('error', console.error);
req.end();

function post(endpoint, payload) {
    const postReq = http.request(`http://localhost:6767${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(payload)
        }
    });
    postReq.on('error', console.error);
    postReq.write(payload);
    postReq.end();
}

function sendInitialize(endpoint) {
    const payload = JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "initialize",
        params: {
            protocolVersion: "2025-11-25",
            capabilities: {},
            clientInfo: { name: "Antigravity", version: "1.0.0" }
        }
    });
    post(endpoint, payload);
}

function sendInitializedNotificationAndCall(endpoint) {
    const payloadNotif = JSON.stringify({
        jsonrpc: "2.0",
        method: "notifications/initialized"
    });
    post(endpoint, payloadNotif);

    const payloadPreamble = JSON.stringify({
        jsonrpc: "2.0",
        id: 2,
        method: "tools/call",
        params: {
            name: "read_sdk_documentation_topic",
            arguments: { filename: "application.js" }
        }
    });
    setTimeout(() => {
        post(endpoint, payloadPreamble);
    }, 50);
}

function sendExecuteScript(endpoint) {
    const payloadScript = JSON.stringify({
        jsonrpc: "2.0",
        id: 3,
        method: "tools/call",
        params: {
            name: "execute_script",
            arguments: {
                script: "const app = require('/application'); return 'Sóc de Poble! He contactat amb el motor JS natiu dAffinity. Applicació Activa: ' + app.name;"
            }
        }
    });
    post(endpoint, payloadScript);
}

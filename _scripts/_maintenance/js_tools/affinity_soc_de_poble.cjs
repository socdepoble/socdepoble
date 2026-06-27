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
        resolve(); 
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
                        try {
                            const msg = JSON.parse(dataLine.substring(6).trim());
                            if (msg.id && msgResolvers[msg.id]) {
                                msgResolvers[msg.id](msg);
                                delete msgResolvers[msg.id];
                            }
                        } catch (e) {}
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
                jsonrpc: "2.0", id: id, method: "tools/call",
                params: { name: name, arguments: args }
            });
        });
    }

    async function onConnected(endpoint, callTool) {
        await new Promise(r => {
            msgResolvers[msgId] = r;
            postMCP(endpoint, {
                jsonrpc: "2.0", id: msgId++, method: "initialize",
                params: { protocolVersion: "2025-11-25", capabilities: {}, clientInfo: { name: "Antigravity", version: "1.0.0" } }
            });
        });
        await postMCP(endpoint, { jsonrpc: "2.0", method: "notifications/initialized" });

        await callTool("read_sdk_documentation_topic", { filename: "preamble" });

        const scriptText = `
            const { app } = require('/application');
            const strMensaje = "Sóc de Poble és Arquitectura de Ferro per a legislació àgil. És eficiència nativa, Trellat forense i un sistema visual automatitzat des de l'arrel de l'esperit valencià. No depenem del núvol; formem part de la teua pròpia màquina. Benvingut a la nova era de publicació.";
            let resultInfo = "";
            try {
                app.alert(strMensaje, "VISOR NANO - QUÈ ÉS SÓC DE POBLE?");
                resultInfo += "Alerta disparada! ";
            } catch (e) {
                resultInfo += "Error Alert: " + e.message + " ";
            }
            try {
                const doc = app.documents.current;
                if (!doc) {
                    resultInfo += " (Cap document obert)";
                } else {
                    resultInfo += " | Document Keys: " + Object.keys(doc).join(", ");
                }
            } catch (e) {
                resultInfo += " Error Doc: " + e.message;
            }
            return resultInfo;
        `;

        const res = await callTool("execute_script", { script: scriptText });
        console.log("Resultat Sóc de Poble:", JSON.stringify(res, null, 2));
        process.exit(0);
    }
}

startMCPClient();

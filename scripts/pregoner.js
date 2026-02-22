import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 9001;
const LOG_FILE = path.join(__dirname, '../[LOG] BATEGAT_ERRORS.md');

const server = http.createServer((req, res) => {
    // CORS headers for local development
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const timestamp = new Date().toLocaleString('ca-ES');
                const logEntry = `\n### 🏺 Bategat d'Error: ${timestamp}\n` +
                                `- **Tipus**: ${data.type || 'Desconegut'}\n` +
                                `- **Missatge**: ${data.error || data.msg || 'Sense missatge'}\n` +
                                `- **Stack**: \`\`\`\n${data.stack || 'No disponible'}\n\`\`\`\n` +
                                `- **Context**: ${JSON.stringify(data.context || {}, null, 2)}\n` +
                                `---`;

                fs.appendFileSync(LOG_FILE, logEntry);
                console.log(`[Pregoner] Error capturat a les ${timestamp}`);
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: 'bategat', received: true }));
            } catch (err) {
                console.error('[Pregoner] Error processant el bategat:', err);
                res.writeHead(400);
                res.end('Error de format');
            }
        });
    } else {
        res.writeHead(404);
        res.end();
    }
});

server.listen(PORT, () => {
    console.log(`\n🏺 PROTOCOL PREGONER ACTIU ⚡️`);
    console.log(`Escoltant errors del Mas al port ${PORT}...`);
    console.log(`Els bategats es guarden a: ${LOG_FILE}\n`);
    
    // Inicialitzar el fitxer si no existeix
    if (!fs.existsSync(LOG_FILE)) {
        fs.writeFileSync(LOG_FILE, `# 🏺 [LOG] BATEGAT D'ERRORS CRÍTICS\n\nAquest fitxer recull els crits del sistema perquè l'Antigravity puga sanar el Mas sense captures de pantalla.\n\n`);
    }
});

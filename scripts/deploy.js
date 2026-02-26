import ftp from "basic-ftp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carregar configuració
const configPath = path.join(__dirname, '..', 'deploy-config.json');
let config;

try {
  const configFile = fs.readFileSync(configPath, 'utf8');
  config = JSON.parse(configFile);
} catch (err) {
  console.error("❌ ERROR CRÍTIC: No es troba l'arxiu deploy-config.json a l'arrel.");
  process.exit(1);
}

async function deploy() {
    console.log("🚀 Iniciant Protocol de Desplegament [STITCH/ANTIGRAVITY]...");
    console.log(`📡 Connectant a: ${config.host} com a ${config.user}`);

    const client = new ftp.Client();
    client.ftp.verbose = true;

    try {
        // En SiteGround a veces es obligatorio encriptar la conexión FTP explícitamente y usar modo pasivo.
        await client.access({
            host: config.host,
            user: config.user,
            password: config.password,
            port: config.port || 21,
            secure: true,      // REQUERIDO: FTP sobre TLS explícito
            secureOptions: { rejectUnauthorized: false, clear: true } // Evitar TLS Decode Error per session reuse en SiteGround
        });

        console.log("✅ Connexió establida correctament i xifrada.");
        
        const localDistPath = path.join(__dirname, '..', 'dist');
        const remotePath = config.remoteRoot || "/socdepoble.org/public_html";

        if (!fs.existsSync(localDistPath)) {
             console.error("❌ ERROR: No s'ha trobat la carpeta 'dist'. Has executat 'npm run build'?");
             process.exit(1);
        }

        console.log(`📦 Pujant arxius des de ${localDistPath} a ${remotePath}...`);
        
        await client.ensureDir(remotePath);
        await client.clearWorkingDir();
        await client.uploadFromDir(localDistPath);

        console.log("🎉 Desplegament SiteGround completat! Sóc de Poble està online.");
        
        console.log("🧹 RECORDA: La neteja automàtica de Memcached des d'FTP no pluja. Haurem de buidar la memòria CACHÉ Dinàmica de SiteGround per als 4 dominis.");

    } catch (err) {
        console.error("❌ ERROR de desplegament:", err);
    }

    client.close();
}

deploy();

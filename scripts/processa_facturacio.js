const fs = require('fs');
const path = require('path');

// --- Eines del Trellat per a Noms ---
// Format de les dates en els noms d'arxiu de la Gestoria: YYMMDD_HHMM
function formatTrellatDate(dateObj) {
    const yy = dateObj.getFullYear().toString().slice(-2);
    const mm = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const dd = dateObj.getDate().toString().padStart(2, '0');
    const hh = dateObj.getHours().toString().padStart(2, '0');
    const min = dateObj.getMinutes().toString().padStart(2, '0');
    return `${yy}${mm}${dd}_${hh}${min}`;
}

// Lògica robusta per processar dates de tot tipus
function parseRobustDate(dateStr) {
    if (!dateStr) return new Date();
    // Provem YYYY-MM-DD
    if (/\d{4}-\d{2}-\d{2}/.test(dateStr)) {
        return new Date(dateStr);
    }
    // Provem DD/MM/YYYY o DD/MM/YY
    if (/\d{1,2}\/\d{1,2}\/\d{2,4}/.test(dateStr)) {
        const parts = dateStr.split('/');
        let year = parseInt(parts[2], 10);
        if (year < 100) year += 2000;
        return new Date(year, parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
    }
    
    // Fallback
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? new Date() : d;
}

function parseAmountStr(amountStr) {
    if (!amountStr) return 0;
    return parseFloat(amountStr.toString().replace(',', '.').replace(/[^0-9.-]/g, ''));
}

async function processarFactures(inputCsvPath, outDir) {
    if (!fs.existsSync(inputCsvPath)) {
        console.error(`❌ No s'ha trobat el fitxer d'entrada: ${inputCsvPath}`);
        return;
    }

    const csvText = fs.readFileSync(inputCsvPath, 'utf8');
    const lines = csvText.split('\n').filter(line => line.trim().length > 0);
    
    const factures = [];
    const contactesMap = new Map();
    let typeContext = 'GASTO';

    for (const line of lines) {
        const cols = line.split(';').map(c => c.trim().replace(/^"|"$/g, ''));
        
        if (cols[0] === 'INGRESSOS') { typeContext = 'INGRES'; continue; }
        if (cols[0] === 'GASTOS') { typeContext = 'GASTO'; continue; }
        if (cols[0] === 'Data' || cols[0] === 'Fecha') continue;

        if (cols.length >= 8) {
            const dataStr = cols[0];
            const numFactura = cols[1];
            const contactName = cols[2];
            const contactNif = cols[3];
            const desc = cols[4];
            const subtotal = parseAmountStr(cols[5]);
            const iva = parseAmountStr(cols[6]);
            const total = parseAmountStr(cols[7]);

            if (!contactNif || isNaN(total)) continue;

            const dateObj = parseRobustDate(dataStr);

            // Guardar o actualitzar contacte amb TOTA la informació disponible
            if (!contactesMap.has(contactNif)) {
                contactesMap.set(contactNif, {
                    nif: contactNif,
                    nom: contactName,
                    tipus: typeContext === 'INGRES' ? 'CLIENT' : 'PROVEÏDOR',
                    created_at: Date.now()
                });
            }

            factures.push({
                id: numFactura || `FAC-${dateObj.getTime()}`,
                date_timestamp: dateObj.getTime(),
                date_str: dateObj.toISOString(),
                type: typeContext,
                contact_nif: contactNif,
                contact_name: contactName,
                desc: desc,
                subtotal: subtotal,
                iva: iva,
                total: total,
                estat_conciliacio: 'PENDENT'
            });
        }
    }

    // ORDENAR FACTURES: Des de la més recent a la més antiga
    factures.sort((a, b) => b.date_timestamp - a.date_timestamp);

    // Crear directori d'eixida si no existeix
    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
    }

    // Generar JSONs
    const outFactures = path.join(outDir, 'FACTURACIO_PROCESSADA.json');
    const outContactes = path.join(outDir, 'CONTACTES_EXTRETS.json');

    fs.writeFileSync(outFactures, JSON.stringify(factures, null, 2));
    fs.writeFileSync(outContactes, JSON.stringify(Array.from(contactesMap.values()), null, 2));

    console.log(`✅ Procés finalitzat amb Èxit (Trellat aplicat).`);
    console.log(`📊 Total Factures Processades: ${factures.length}`);
    console.log(`👥 Total Contactes Únics Extrets: ${contactesMap.size}`);
    console.log(`📂 Arxius generats a: ${outDir}`);
}

// Exemple
const mockInput = process.argv[2] || './public/02_Facturacio/cajamar.csv';
const outDir = './scratch/out_gestoria';

console.log('🤖 IAIA Gestora: Iniciant processament de factures...');
processarFactures(mockInput, outDir).catch(console.error);

// csv_ingestor.js
// Lògica d'ingesta i parseig de CSV (Vanilla JS, sense llibreries)

function parseCSV(text, delimiter = ',') {
    let result = [];
    let row = [];
    let inQuotes = false;
    let field = '';
    
    for (let i = 0; i < text.length; i++) {
        let char = text[i];
        
        if (inQuotes) {
            if (char === '"') {
                if (text[i+1] === '"') {
                    field += '"';
                    i++;
                } else {
                    inQuotes = false;
                }
            } else {
                field += char;
            }
        } else {
            if (char === '"') {
                inQuotes = true;
            } else if (char === delimiter) {
                row.push(field);
                field = '';
            } else if (char === '\n' || char === '\r') {
                if (char === '\r' && text[i+1] === '\n') i++; // Evitar \r\n
                row.push(field);
                // Només afegim la fila si no està buida
                if (row.length > 1 || row[0].trim() !== '') result.push(row);
                row = [];
                field = '';
            } else {
                field += char;
            }
        }
    }
    // Afegir l'última fila si no acaba en salt de línia
    if (field !== '' || row.length > 0) {
        row.push(field);
        result.push(row);
    }
    return result;
}

// Funció per netejar conceptes bruts de Cajamar
function cleanConcept(rawConcept) {
    let clean = rawConcept.replace(/\n/g, ' ').replace(/\r/g, '').replace(/\s{2,}/g, ' ').trim();
    // Llevar prefixes inútils
    clean = clean.replace('OP.TARJ.COMPRA COMERCIO ', '');
    clean = clean.replace('BIZUM ENVIADO : ', 'BIZUM: ');
    return clean;
}

// Generador de UUIDs primitius (fallback si crypto.randomUUID no està disponible)
function generateId() {
    if (window.crypto && window.crypto.randomUUID) {
        return window.crypto.randomUUID();
    }
    return 'tx_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Generador de Hashes SHA-256 (VeriFactu Ready)
async function generateHash(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function processCajamarCSV(csvText) {
    const rows = parseCSV(csvText);
    if (rows.length < 2) return 0; // Buit o només capçalera

    // Eliminar capçalera
    rows.shift();
    
    const transactions = [];
    let previousHash = "GENESIS_BLOCK";

    for (const row of rows) {
        if (row.length < 4) continue; // Fila invàlida
        
        const rawDate = row[0]; // YYYY-MM-DD
        const rawConcept = row[2];
        const rawAmount = parseFloat(row[3]);
        
        if (isNaN(rawAmount)) continue;

        const timestamp = new Date(rawDate).getTime();
        
        // Creem l'àtom immutable
        const tx = {
            id: generateId(),
            timestamp: timestamp,
            amount: rawAmount,
            concept: rawConcept,
            clean_concept: cleanConcept(rawConcept),
            owner_scope: 'PENDING', // Claude Rule: PENDING per defecte, mai silenciós
            tax_status: 'PENDING',
            tax_rule_id: 'pending_rule', // S'actualitzarà amb la taula fiscal
            source_hash: 'csv_upload_hash',
            previous_tx_hash: previousHash,
            created_at: Date.now()
        };

        // Generar hash d'aquesta transacció (cadena de blocs local)
        const txString = `${tx.id}|${tx.timestamp}|${tx.amount}|${tx.concept}|${tx.previous_tx_hash}`;
        tx.tx_hash = await generateHash(txString);
        previousHash = tx.tx_hash;

        transactions.push(tx);
    }

    // Ingesta massiva a Dexie
    await db.events.bulkAdd(transactions);
    console.log(`[Pedra Seca Ingestor] S'han ingerit ${transactions.length} transaccions bancàries a IndexedDB.`);
    return transactions.length;
}

// Converteix DD/MM/YY a un timestamp
function parseDateDDMMYY(dateStr) {
    const parts = dateStr.split('/');
    if (parts.length !== 3) return Date.now();
    let year = parseInt(parts[2]);
    year = year < 100 ? 2000 + year : year;
    return new Date(year, parseInt(parts[1]) - 1, parseInt(parts[0])).getTime();
}

// Substitueix la coma decimal per punt
function parseAmountStr(amountStr) {
    if (!amountStr) return 0;
    return parseFloat(amountStr.replace(',', '.'));
}

async function processarResumFacturesCSV(csvText) {
    const rows = parseCSV(csvText, ';');
    let inIngressos = true;
    const facturesToInsert = [];
    const contactesMap = new Map(); // Per guardar clients i proveïdors únics

    for (const row of rows) {
        if (row.length === 0) continue;
        const primerText = row[0].trim();
        
        if (primerText === 'INGRESSOS') { inIngressos = true; continue; }
        if (primerText === 'GASTOS') { inIngressos = false; continue; }
        if (primerText === 'Data' || primerText === '') continue; // Capçalera o fila buida
        if (row.length >= 8) {
            // Fila de dades: Data;Núm;Client;NIF;Descripció;Subtotal;IVA;Total
            const dataStr = primerText;
            const numFactura = row[1].trim();
            const contactName = row[2].trim();
            const contactNif = row[3].trim();
            const desc = row[4].trim();
            const subtotal = parseAmountStr(row[5]);
            const iva = parseAmountStr(row[6]);
            const total = parseAmountStr(row[7]);
            
            if (!contactNif || isNaN(total)) continue;

            const tipus = inIngressos ? 'INGRES' : 'GASTO';
            const timestamp = parseDateDDMMYY(dataStr);

            // Guardar Contacte Únic
            if (!contactesMap.has(contactNif)) {
                contactesMap.set(contactNif, {
                    nif: contactNif,
                    nom: contactName,
                    tipus: tipus === 'INGRES' ? 'CLIENT' : 'PROVEÏDOR'
                });
            }

            // Construir factura
            const fac = {
                id: numFactura,
                date_timestamp: timestamp,
                type: tipus,
                contact_nif: contactNif,
                contact_name: contactName, // Guardem el nom ací també per facilitat a la UI
                desc: desc,
                subtotal: subtotal,
                iva: iva,
                total: total,
                estat_conciliacio: 'PENDENT',
                hash: ''
            };
            
            const hashStr = `${fac.id}|${fac.date_timestamp}|${fac.total}|${fac.contact_nif}`;
            fac.hash = await generateHash(hashStr);
            
            facturesToInsert.push(fac);
        }
    }

    // Ingesta a Dexie
    await db.factures.bulkPut(facturesToInsert);
    const contactesArray = Array.from(contactesMap.values());
    await db.contactes.bulkPut(contactesArray);
    
    console.log(`[Pedra Seca Ingestor] S'han ingerit ${facturesToInsert.length} factures i ${contactesArray.length} contactes.`);
    
    // Fer conciliació automàtica
    await conciliarFacturesAmbBanc();
    return facturesToInsert.length;
}

// Motor de Conciliació Automàtica (Shadow Holded)
async function conciliarFacturesAmbBanc() {
    const factures = await db.factures.filter(f => f.estat_conciliacio === 'PENDENT').toArray();
    const moviments = await db.events.toArray();
    
    let conciliades = 0;

    for (let fac of factures) {
        // Busquem un moviment bancari que coincidisca en import i que la data no siga anterior a la factura
        // I amb un marge de 30 dies de diferència, o simplement mirem que l'import (absolut) coincidisca
        // Marge d'error ±1.00€
        const totalBuscat = fac.type === 'INGRES' ? fac.total : -fac.total;
        
        let trobat = moviments.find(m => {
            const tempsDiff = m.timestamp - fac.date_timestamp;
            const tempsOk = tempsDiff >= -86400000 && tempsDiff <= (30 * 24 * 60 * 60 * 1000); // Entre 1 dia abans i 30 dies després
            const importOk = Math.abs(m.amount - totalBuscat) <= 1.00; // ±1€ de marge
            return tempsOk && importOk;
        });

        if (trobat) {
            fac.estat_conciliacio = 'CONCILIAT';
            await db.factures.put(fac);
            conciliades++;
        }
    }
    
    console.log(`[Pedra Seca Conciliació] S'han conciliat automàticament ${conciliades} factures de ${factures.length} pendents.`);
}

// Funció per processar manualment qualsevol CSV i saber quin és
async function processUnknownCSV(csvText) {
    if (csvText.includes('INGRESSOS') || csvText.includes('GASTOS') || csvText.includes('Subtotal;IVA;Total')) {
        return await processarResumFacturesCSV(csvText);
    } else {
        return await processCajamarCSV(csvText);
    }
}

// Funció automàtica per inicialitzar dades si la BD està buida (només per a entorn de desenvolupament)
async function initializeDBWithCSV() {
    try {
        // 1. Inicialitzar Taula Fiscal (Claude Rule: Mai hardcoded)
        const taxCount = await db.tax_rules.count();
        if (taxCount === 0) {
            console.log("[Pedra Seca DB] Inicialitzant taula de regles fiscals per defecte (2026)...");
            const defaultRules = [
                { id: 'iva_21_2026', year: 2026, type: 'IVA', rate: 21 },
                { id: 'iva_10_2026', year: 2026, type: 'IVA', rate: 10 },
                { id: 'iva_4_2026', year: 2026, type: 'IVA', rate: 4 },
                { id: 'irpf_15_2026', year: 2026, type: 'IRPF', rate: 15 },
                { id: 'irpf_7_2026', year: 2026, type: 'IRPF', rate: 7 }
            ];
            await db.tax_rules.bulkAdd(defaultRules);
        }

        // 2. Ingesta CSV Banc si està buida
        const countBanc = await db.events.count();
        if (countBanc === 0) {
            if (window.isDemoMode) {
                console.log("[Pedra Seca Ingestor] Mode Demo actiu. Inserint dades de Banc de Broma...");
                const fakeEvents = [
                    { id: 'ev_demo_1', owner_scope: 'Banc de Broma', timestamp: '2026-06-01T10:00:00Z', tax_status: 'Pendent', amount: 5000, description: 'Ingrés Inicial' },
                    { id: 'ev_demo_2', owner_scope: 'Caixa de Mentida', timestamp: '2026-06-15T12:30:00Z', tax_status: 'Conciliat', amount: -250, description: 'Compra de Llicències' },
                    { id: 'ev_demo_3', owner_scope: 'Banc de Broma', timestamp: '2026-06-20T09:15:00Z', tax_status: 'Pendent', amount: -50, description: 'Rebut Aigua' }
                ];
                await db.events.bulkAdd(fakeEvents);
            } else {
                console.log("[Pedra Seca Ingestor] BD bancària buida. Intentant carregar l'Excel automàticament...");
                try {
                    const response = await fetch('../02_Facturacio/cajamar.csv');
                    if (response.ok) {
                        const csvText = await response.text();
                        await processCajamarCSV(csvText);
                    }
                } catch(e) { console.warn("No s'ha pogut carregar l'arxiu local."); }
            }
        }
        
        // 3. Ingesta CSV Facturació si està buida
        const countFact = await db.factures.count();
        if (countFact === 0) {
            if (window.isDemoMode) {
                console.log("[Pedra Seca Ingestor] Mode Demo actiu. Inserint Factures de Mentida...");
                const fakeFactures = [
                    { id: 'FAC-2026-001', date_timestamp: '2026-06-15T00:00:00Z', type: 'Despesa', contact_nif: 'B12345678', estat_conciliacio: 'Conciliada', total: 250 }
                ];
                await db.factures.bulkAdd(fakeFactures);
            } else {
                console.log("[Pedra Seca Ingestor] BD de factures buida. Intentant carregar Resum de Facturació automàticament...");
                try {
                    const responseFact = await fetch('../02_Facturacio/2026/260630_1600_DOC_Resum_Facturacio_2026_2T.csv');
                    if (responseFact.ok) {
                        const csvText = await responseFact.text();
                        await processarResumFacturesCSV(csvText);
                    }
                } catch(e) { console.warn("No s'ha pogut carregar el resum de facturació local."); }
            }
        }
        
    } catch (e) {
        console.error("[Pedra Seca Ingestor] Error en inicialitzar amb CSV:", e);
    }
}

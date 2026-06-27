import { logger } from '../../utils/logger';

/**
 * docExtractionService: El bategat de l'IAIA que llegeix papers. [MASTER]
 * Simula l'extracció de dades des de documents del Vault.
 */
class DocExtractionService {
    constructor() {
        this.MOCK_EXTRACTIONS = {
            'dni_nando.pdf': {
                nombre_razon: 'Fernando Luis Llinares García',
                nif_nie: '21670188W',
                via: 'Avenida de España, 11, 2º',
                poblacion: 'Torremanzanas',
                cp: '03107'
            },
            'iban_nando.pdf': {
                entidad: 'Banco Sabadell',
                iban: 'ES6200811336710006675580'
            },
            'parcela_31.pdf': {
                parcelas: [
                    {
                        provincia: 'Alicante',
                        municipio: 'Torremanzanas',
                        poligono: '2',
                        parcela: '31',
                        cadastre: '03132A002000310000TZ'
                    }
                ]
            },
            'recibo_suma_herminio.jpg': {
                expediente: '24-2025-028468',
                organismo: 'SUMA Gestión Tributaria',
                ayuntamiento: 'La Torre de les Maçanes',
                total_pagar: 226.69,
                fecha_limite: '2026-03-03',
                desglose: [
                    { inmueble: 'San Isidro, 16', concepto: 'Aigües Potables (1-TRI-2025)', total: 47.40, responsable: 'Javi' },
                    { inmueble: 'PD Barrinada, 4', concepto: 'Aigües Potables (1-TRI-2025)', total: 31.48, responsable: 'Nando' },
                    { inmueble: 'San Isidro, 16', concepto: 'Aigua i Clavegueram (2-TRI-2025)', total: 41.86, responsable: 'Javi' },
                    { inmueble: 'PD Barrinada, 4', concepto: 'Aigua i Clavegueram (2-TRI-2025)', total: 99.95, responsable: 'Nando' },
                    { inmueble: 'General', concepto: 'Costes del procediment', total: 6.00, responsable: 'Shared' }
                ]
            }
        };
    }

    /**
     * Simula l'extracció de dades d'un fitxer.
     * En el futur, això connectarà amb un servei d'OCR/IA.
     */
    async extractFromDocument(fileName) {
        logger.log(`[DocExtraction] Bategant extracció per a: ${fileName}...`);

        // Simulem un delay de "processament"
        await new Promise(resolve => setTimeout(resolve, 1500));

        const data = this.MOCK_EXTRACTIONS[fileName];
        if (data) {
            logger.info(`[DocExtraction] Dades extretes amb èxit de ${fileName}`);
            return data;
        }

        logger.warn(`[DocExtraction] No s'han trobat dades predefinites per a ${fileName}. Retornant buit.`);
        return {};
    }

    /**
     * Mapeja els documents necessaris per a cada tipus de tràmit.
     */
    getRequirements(procedureId) {
        const requirements = {
            'xylella-18932': [
                { id: 'dni', name: 'DNI / NIF', required: true, description: 'Còpia de les dues cares.' },
                { id: 'iban', name: 'Certificat IBAN', required: true, description: 'Document que certifique la titularitat del compte.' },
                { id: 'parcelas', name: 'Fitxa Catastral', required: true, description: 'Dades de les parcel·les afectades.' }
            ],
            'herencia-herminio': [
                { id: 'dni_javi', name: 'DNI Javi', required: true, description: 'DNI del nou titular San Isidro.' },
                { id: 'dni_nando', name: 'DNI Nando', required: true, description: 'DNI del nou titular Barrinada.' },
                { id: 'escritura', name: 'Escritura Herència', required: true, description: 'Adjudicació de finques.' },
                { id: 'recibo_suma', name: 'Rebut SUMA', required: true, description: 'Últim rebut pagat.' }
            ]
        };
        return requirements[procedureId] || [];
    }
}

export const docExtractionService = new DocExtractionService();

import { logger } from '../utils/logger';

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
            ]
        };
        return requirements[procedureId] || [];
    }
}

export const docExtractionService = new DocExtractionService();

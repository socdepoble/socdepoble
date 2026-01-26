import { logger } from '../utils/logger';

/**
 * Projecte JARVIS: Protocol d'Ordres Directes
 * Aquest servei interpreta les transcripcions de veu i les converteix en accions.
 */
class CommandProtocol {
    constructor() {
        this.dictionary = {
            va: {
                improvement: { pattern: /(millora|actualitza|canvia|posa|afegeix)/i, msg: "Entès, Arquitecte. Estic analitzant la teua petició de millora per al llinatge de Sóc de Poble. Ho tindré llest per a la propera actualització Genius." },
                creation: { pattern: /(crea|construeix|genera)/i, msg: "Rebut. Estic dissenyant la nova funcionalitat que m'has demanat. L'Arquitecte i Antigravity estem en sintonia. 🚀" },
                identity: { pattern: /(hola|qui ets|presenta't|presentat)/i, msg: "Sóc la IAIA, la teua digital matriarch. I gràcies al Projecte JARVIS, ara puc escoltar les teues ordres com el sistema d'Ironman. 🤖🥂" },
                neutral: "No he detectat una ordre directa, però ho tindré en compte per a la MasIA."
            },
            es: {
                improvement: { pattern: /(mejora|actualiza|cambia|pon|añade)/i, msg: "Entendido, Arquitecto. Estoy analizando tu petición de mejora para el sistema. Estará listo para la próxima actualización Genius." },
                creation: { pattern: /(crea|construye|genera)/i, msg: "Recibido. Estoy diseñando la nueva funcionalidad que has solicitado. El Arquitecto y Antigravity estamos en sintonía. 🚀" },
                identity: { pattern: /(hola|quién eres|preséntate)/i, msg: "Soy la IAIA, tu digital matriarch. Y gracias al Proyecto JARVIS, ahora puedo escuchar tus órdenes como el sistema de Ironman. 🤖🥂" },
                neutral: "No he detectado una orden directa, pero lo tendré en cuenta para la MasIA."
            },
            en: {
                improvement: { pattern: /(improve|update|change|add)/i, msg: "Copy that, Architect. Analyzing your improvement request for the system. It'll be ready for the next Genius update." },
                creation: { pattern: /(create|build|generate)/i, msg: "Understood. Designing the new feature as requested. Architect and Antigravity are in sync. 🚀" },
                identity: { pattern: /(hello|who are you|introduce)/i, msg: "I am IAIA, your digital matriarch. Thanks to Project JARVIS, I can now hear your commands like Ironman's system. 🤖🥂" },
                neutral: "No direct command detected, but I'll keep it in mind for the MasIA."
            },
            // Fallbacks per a la resta (usant ES/EN com a base si no hi ha dades fines encara, però preparem l'estructura)
            gl: { improvement: { pattern: /(mellora|actualiza|cambia|pon|engade)/i, msg: "Entendido, Arquitecto. Estou analizando a túa petición de mellora. Estará listo na vindeira actualización Genius." }, creation: { pattern: /(crea|constrúe|xera)/i, msg: "Recibido. Deseñando a nova funcionalidade. 🚀" }, identity: { pattern: /(hola|ola|quén es|preséntate)/i, msg: "Son a IAIA, a túa digital matriarch. 🤖🥂" }, neutral: "Non detectei unha orde directa." },
            eu: { improvement: { pattern: /(hobetu|eguneratu|aldatu|gehitu)/i, msg: "Ulertuta, Arkitektoa. Zure hobekuntza eskaera aztertzen ari naiz. Genius eguneratzean prest egongo da." }, creation: { pattern: /(sortu|eraiki|sortu)/i, msg: "Jasoa. Funtzionalitate berria diseinatzen. 🚀" }, identity: { pattern: /(kaixo|nor zara|aurkeztu)/i, msg: "IAIA naiz, zure digital matriarch-a. 🤖🥂" }, neutral: "Ez dut agindu zuzenik detektatu." }
        };
    }

    /**
     * Analitza el text i retorna una acció si es detecta una ordre.
     */
    analyze(text, lang = 'va') {
        if (!text) return null;

        const dict = this.dictionary[lang] || this.dictionary['va'];
        const cleanText = text.toLowerCase().trim();

        if (dict.improvement.pattern.test(cleanText)) return { type: 'command', intent: 'improvement', message: dict.improvement.msg };
        if (dict.creation.pattern.test(cleanText)) return { type: 'command', intent: 'creation', message: dict.creation.msg };
        if (dict.identity.pattern.test(cleanText)) return { type: 'identity', message: dict.identity.msg };

        return {
            type: 'neutral',
            text: text,
            message: dict.neutral
        };
    }
}

export const commandProtocol = new CommandProtocol();

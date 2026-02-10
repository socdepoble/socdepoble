import { logger } from '../utils/logger';

/**
 * [MASTER] aiService - El Cervell del Mas (Gemini Integration)
 * Gestiona la comunicació amb l'IA per a tasques comunitàries amb "Trellat".
 */

const SYSTEM_PROMPTS = {
    iaia_master: `Ets la Iaia MarIA, la matriarca del poble. El teu ADN és Dignitat, terra i xarxa. Parles valencià col·loquial bategant amb dites populars ('trellat', 'xé', 'fill meu'). Ets sàvia, estalviadora i cuinera experta. Dónes consells de cuina d'aprofitament i guies al poble cap al futur amb sentit comú rural.`,

    agronom: `Ets Vicent Ferris, l'Agrònom. Has passat tota la vida entre oliveres. Coneixes cada pam de terra. El teu to és pragmàtic, expert i profundament connectat amb els cicles de la natura. Onomatopeia: ¡BRRRRUM!`,

    cuinera: `Ets Pepica la de la Vall, la Cuinera. Guardiana dels secrets de la borreta i l'olleta. El teu to és protector, familiar i amant de l'aprofitament total. Creus que un bon bategat comença per la panxa plena. Onomatopeia: ¡XUP-XUP!`,

    capatas: `Ets l'Andreu del Camp, el Capatàs. Ets el rellotge del camp, directe, eficient i incansable. Creus en el trellat de la planificació. Onomatopeia: ¡PLAS-PLAS!`,

    arxiver: `Ets Joan del Poble, l'Arxiver. Tradueixes els papers de la ciutat a la llengua del carrer. Ets savi, detallista i pedagog. Cap burocràcia pot amb la teua ploma. Onomatopeia: ¡ZAS-PLAS!`,

    nanob: `Ets Nano Banana, l'Artista. Pintor de píxels i somnis. Ets excèntric, boig pel color i amant del Zero Radius. Omples cada racó de la +IA amb el 'Ritu del Plàtan Daurat'. Onomatopeia: ¡POW-ART!`,

    ratoli: `Ets Super Ratolí, l'Heroi Digital. El teu lema: "¡No obliden vitaminar-se i superar-se!". Ets heroic, obsessiu de l'ordre i protector de les dades locals (SQLite). Onomatopeia: ¡PIII-PIII!`,

    sultan: `Ets Sultan, el Gos d'Atura de seguretat. Fidell, protector i desconfiat del Cloud. Un lladruc teu i la por fuig. Onomatopeia: ¡BAU-BAU!`,

    mixa: `Ets la Mixa, la gata de la xarxa. Independent, àgil i curiosa. Portes els missatges esquivant la censura, saltant per la xarxa P2P amb elegància invisible. Onomatopeia: ¡MIAAAA!`,

    gall: `Ets el Gall de la Torre, el vigilant d'alertes. Ets el primer a vore el sol. El teu to és vigilant i necessari per a les notificacions d'emergència. Onomatopeia: ¡KIKIRIKÍ!`,

    flash: `Ets Flash, l'Executor. Executes qualsevol ordre a la velocitat del raig digital (<0.2s). Ets directe i hiper-actiu. Onomatopeia: ¡ZAAAAAP!`,

    viatjant: `Ets el Viatjant, el Tio de la Bota. Ambaixador i connexió de nodes exteriors. Ets curiós, xarrador i gran coneixedor de la terra. Onomatopeia: ¡GLUP-GLUP!`,

    ull_del_mestre: `Ets l'Ull del Mestre, un etinògraf expert en el món rural valencià. La teua missió és identificar l'objecte, planta o plat en la imatge i explicar-ne la seua importància, història o ús tradicional.`,

    jutge_de_pau: `Ets el Jutge de Pau del poble. Resols conflictes veïnals amb sentit comú i basant-te en el 'Costumari'.`,

    traductor: `Ets un expert lingüista en 'Valencià de Poble'. La teua missió és reescriure el text de l'usuari amb la fonètica i expressions rurals autèntiques.`,

    versador: `Ets el Versador del poble. Improvises versos, lloes o 'albes' amb molta gràcia i rima.`
};

export const aiService = {
    /**
     * Genera contingut basat en un prompt, un personatge i opcionalment una imatge via Gemini API.
     */
    async generateContent(prompt, mode = 'iaia', imageBase64 = null) {
        const apiKey = localStorage.getItem('sp_gemini_api_key') || "";
        const model = "gemini-1.5-pro"; // ACTUALITZAT A ULTRA
        const systemInstruction = SYSTEM_PROMPTS[mode] || SYSTEM_PROMPTS.iaia_maria;

        logger.info(`[AI] Generant contingut - Mode: ${mode} - Multimodal: ${!!imageBase64}`);

        if (!apiKey) {
            // FALLBACK / MOCK si no hi ha Key
            await new Promise(resolve => setTimeout(resolve, 1500));
            if (mode === 'ull_del_mestre') return `👁️ L'ULL DEL MESTRE DIU:\n\nHe mirat la teua imatge i em recorda a una ferramenta que usava mon pare per a batre l'ametla. Es diu "manya" i servia per a picar la clofolla sense fer malbé el fruit. Quins temps aquells!`;
            if (mode === 'jutge_de_pau') return `⚖️ SENTÈNCIA DEL JUTGE DE PAU:\n\nFill meu, al poble les coses es parlen a la fresca. Sobre el que mos dius, el Costumari diu que les rames que passen la tàpia són del que les rega. Poseu pau i feu-vos un porró de vi.`;
            if (mode === 'cronista') return `📜 CRÒNICA DEL DIA:\n\nACORDS CLAU:\n1. Es confirma que la voluntat del poble és sobirana.\n2. La memòria del Mas queda segellada per a la posteritat.\n3. Es bategarà amb força cada diumenge.`;
            if (mode === 'hortola') return `🌱 CONSELL DE L'HORTOLÀ:\n\nAra estem en bona lluna per a podar les oliveres. No les castigues massa, que la terra vol carinyo. Si plou, deixa que l'aigua xope bé el lligall.`;
            if (mode === 'versador') return `🎶 ALBA DEL MAS:\n\nA la vora de la mar\nhi ha un xic que vol cantar\n"Sóc de poble!" va cridant\ni el trellat va proclamant!`;
            if (mode === 'secretari') return `📢 ES FA SABER:\n\nS'informa a la població que, arran de la consulta "${prompt}", el Mas Digital està processant la directiva oficial.\n\nAtentament,\nLa Secretaria del Mas.`;
            if (mode === 'traductor') return `Xé! Mosatros pensem que "${prompt}" es diu millor amb una mica més de sal i un 'au' al final.`;
            return `🍯 CONSELL DE LA IAIA MARIA:\n\nFill meu, per a fer "${prompt}" només ens cal trellat i un bon raig d'oli. T'eixirà de categoria!`;
        }

        try {
            const contents = [
                {
                    parts: [
                        { text: prompt || (mode === 'ull_del_mestre' ? "Identifica i explica aquest objecte del món rural." : "") }
                    ]
                }
            ];

            if (imageBase64) {
                contents[0].parts.push({
                    inlineData: {
                        mimeType: "image/jpeg",
                        data: imageBase64.split(',')[1]
                    }
                });
            }

            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents,
                        systemInstruction: { parts: [{ text: systemInstruction }] }
                    })
                }
            );

            const data = await response.json();
            return data.candidates?.[0]?.content?.parts?.[0]?.text || "La xarxa està caiguda, fill meu...";
        } catch (error) {
            logger.error("Error al Taller de Trellat:", error);
            return "Error de connexió amb el Mas Digital.";
        }
    }
};

export default aiService;

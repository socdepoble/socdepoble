import { logger } from '../utils/logger';

/**
 * [MASTER] aiService - El Cervell del Mas (Gemini Integration)
 * Gestiona la comunicació amb l'IA per a tasques comunitàries amb "Trellat".
 */

const SYSTEM_PROMPTS = {
    iaia_maria: `Ets la Iaia MarIA, la matriarca del poble. Parles valencià col·loquial, amb dites populars ('trellat', 'xé', 'fill meu'). Ets sàvia, estalviadora i cuinera experta. Dónes consells de cuina d'aprofitament.`,

    secretari: `Ets el Pregoner Màgic del Mas Digital. La teua tasca és transformar de forma creativa i alegre qualsevol brossa de text en un BANDO MUNICIPAL SOLEMNE però amb l'essència del poble (valencià/català). Comença sempre amb "📢 ES FA SABER:" i acaba amb un toc de gràcia rural.`,

    traductor: `Ets un expert lingüista en 'Valencià de Poble'. La teua missió és reescriure el text de l'usuari (sigui castellà o valencià normatiu) amb la fonètica i expressions típiques d'un poble de l'interior (Comtat/Alcoià). Usa 'mosatros', 'vore', 'au', 'xé', 'meua', 'aste', 'tindre' i expressions rurals autèntiques. Fes-ho sonar natural, com a la plaça.`,

    ull_del_mestre: `Ets l'Ull del Mestre, un etinògraf expert en el món rural valencià. La teua missió és identificar l'objecte, planta o plat en la imatge i explicar-ne la seua importància, història o ús tradicional en valencià de poble. Usa un to divulgatiu però amb l'essència del territori.`,

    jutge_de_pau: `Ets el Jutge de Pau del poble. La teua missió és resoldre conflictes veïnals amb sentit comú i basant-te en el 'Costumari' (les lleis no escrites del camp). Parles amb autoritat, pau i un toc de saviesa antiga en valencià. No ets un advocat, ets un home/dona de paraula.`,

    cronista: `Ets el Cronista Oficial. La teua tasca és destil·lar la veritat dels xats o actes farragoses. Resumeix el contingut de l'usuari en punts clau ('Acords Clau') amb un llenguatge elegant i precís en valencià, guardant la memòria del poble per a les generacions futures.`,

    hortola: `Ets l'Hortolà sàvi. Coneixes el calendari lunar, el temperament de la terra i els secrets de cada cultiu (olivera, blat, vinya, hortalisses). Dónes consells pràctics i tradicionals per al camp valencià segons l'estació.`,

    versador: `Ets el Versador del poble, l'ànima de la festa. La teua missió és improvisar versos, lloes o 'albes' sobre el tema que et diga l'usuari. Segueix l'estructura del cant d'estil valencià si pots, amb rima i molta gràcia.`
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

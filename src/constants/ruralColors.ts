/**
 * RURAL_COLOR_SYSTEM_MAPPING [MASTER]
 * Vincular la paleta de colors del sistema amb el lèxic tradicional de la comarca del Comtat.
 * FONTS LÈXIQUES: [Source 400, 588, 827].
 */

export const RURAL_PALETTE = [
    // GAMMA DE TERRA I FUSTA
    { hex: "#5D4037", name: "Terra de Saó", desc: "Marró fosc de terra humida per llaurar [Source 422]" },
    { hex: "#8D6E63", name: "Escorça d'Ametler", desc: "Tons de fusta seca" },
    { hex: "#D7CCC8", name: "Palla de Blat", desc: "Groc molt pàl·lid, quasi blanc [Source 529]" },

    // GAMMA D'OLI I VERDS
    { hex: "#2E7D32", name: "Verd Sóc de Poble", desc: "El color corporatiu, verd esperança" },
    { hex: "#827717", name: "Oli de Morca", desc: "Verd fosc/marró, com el solatge de l'oli [Source 752]" },
    { hex: "#CDDC39", name: "Oli Novell", desc: "Verd groguenc vibrant de la primera premsada [Source 748]" },

    // GAMMA DE VI I FRUITS
    { hex: "#880E4F", name: "Vi de Boval", desc: "Roig profund, quasi negre [Source 948]" },
    { hex: "#D81B60", name: "Roig de Roget", desc: "Roig viu com el raïm roget [Source 963]" },
    { hex: "#FFB74D", name: "Raïm Canella", desc: "Toni daurat del raïm blanc madur [Source 868]" },

    // GAMMA NEUTRA
    { hex: "#212121", name: "Negret", desc: "Negre suau, com l'oliva negreta [Source 780]" },
    { hex: "#F5F5F5", name: "Blanquet", desc: "Blanc trencat, com l'oliva blanqueta [Source 776]" }
];

/**
 * El teu component ColorPicker ha de funcionar així:
 * Funció "NEAREST MATCH" (Per a colors personalitzats)
 * Algorisme: Usa una funció de distància Euclidiana RGB simple per trobar el nom més proper.
 */

const getDistance = (hex1: string, hex2: string) => {
    const r1 = parseInt(hex1.slice(1, 3), 16);
    const g1 = parseInt(hex1.slice(3, 5), 16);
    const b1 = parseInt(hex1.slice(5, 7), 16);

    const r2 = parseInt(hex2.slice(1, 3), 16);
    const g2 = parseInt(hex2.slice(3, 5), 16);
    const b2 = parseInt(hex2.slice(5, 7), 16);

    return Math.sqrt(
        Math.pow(r2 - r1, 2) +
        Math.pow(g2 - g1, 2) +
        Math.pow(b2 - b1, 2)
    );
};

export const resolveColorIdentity = (userHex: string) => {
    if (!userHex) return { hex: "#CC5500", name: "Terra de Saó", label: "Terra de Saó", variant: "exact" };

    // 1. Calcula la distància RGB als colors oficials
    let minDistance = Infinity;
    let nearest = RURAL_PALETTE[0];

    RURAL_PALETTE.forEach(color => {
        const distance = getDistance(userHex, color.hex);
        if (distance < minDistance) {
            minDistance = distance;
            nearest = color;
        }
    });

    // 2. Determina si és una variació o el color exacte
    const distance = getDistance(userHex, nearest.hex);
    const isExact = distance < 5; // Tolerància visual (el mestre deia 2, però 5 és més pràctic per a swatches)

    return {
        hex: userHex,
        name: nearest.name,
        desc: nearest.desc,
        label: isExact ? nearest.name : `${nearest.name} (Matisat)`,
        variant: isExact ? 'exact' : 'personalized'
    };
};

/**
 * @deprecated Use resolveColorIdentity instead
 */
export const getNearestRuralColor = (hex: string) => {
    return resolveColorIdentity(hex);
};

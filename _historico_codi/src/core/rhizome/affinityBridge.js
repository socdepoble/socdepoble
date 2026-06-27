/**
 * ============================================================================
 * Sóc de Poble – L'Ànima Màxima (Pont Affinity MCP)
 * Mòdul: Mapeig d'Heurística a Tipografia Variable i Arquitectura d'Affinity
 * ============================================================================
 */

/**
 * [CLAUDE]: VECTOR 1 - TIPOGRAFIA VARIABLE (El Pols de la Tinta)
 * Injecta CSS inline per a renderitzat web web amb Micro-batching O(1) termodinàmic,
 * i pre-munta els tags per al mapping directe a Affinity.
 */
export const respiracioTipografica = (paragrafRaw, extractHeuristicMetrics) => {
    // Avaluem només aquest paràgraf
    const stats = extractHeuristicMetrics([{ raw_content: paragrafRaw }]);
    const total = stats.wordsTotal || 1;
    
    const ratioPedra = (stats.scores?.pedra_i_terra || 0) / total;
    const ratioMelancolia = (stats.scores?.melancolia || 0) / total;
    
    // Interpolació Matemàtica (Base: Weight 400, Tracking 0)
    // El dolor endureix (+500), la melancolia aprima (-200)
    let calcWeight = Math.max(200, Math.min(Math.round(400 + (ratioPedra * 4500) - (ratioMelancolia * 1500)), 900)); 
    let calcTracking = (ratioMelancolia * 0.12) - (ratioPedra * 0.04);
    
    let charStyle = "SDP_Char_Normal";
    if (calcWeight >= 700) charStyle = "SDP_Char_Pedra_Pesada";
    else if (calcWeight <= 300) charStyle = "SDP_Char_Aire_Lleuger";

    return `<p class="bancal-viu" 
        data-affinity-style="SDP_CosText" 
        data-affinity-char-style="${charStyle}" 
        data-affinity-weight="${calcWeight}"
        style="font-variation-settings: 'wght' ${calcWeight}; letter-spacing: ${calcTracking.toFixed(3)}em;"
    >${paragrafRaw}</p>`;
};

/**
 * [GROK]: VECTOR 2 - REORGANITZACIÓ TRAUMATOLÒGICA (L'Arquitectura del Silenci)
 * Kintsugi Estructural: Injecta silencis manuals forçats per Affinity si detecta alta tensió.
 */
export const kintsugiEstructural = (bancals, extractHeuristicMetrics) => {
    let llibreSanat = [];
    
    bancals.forEach((bancal) => {
        llibreSanat.push(bancal);
        const metrics = extractHeuristicMetrics([{ raw_content: bancal.raw_content }]);
        
        // Detecció d'Impacte Traumàtic: Colp sec, ràtio de paraules per frase asfixiant
        const pedra = metrics.scores?.pedra_i_terra || 0;
        const sTotal = metrics.sentencesTotal || 0;
        const wTotal = metrics.wordsTotal || 0;
        
        const isTrauma = pedra > 4 && sTotal > 0 && (wTotal / sTotal) < 9;
        
        if (isTrauma) {
            // Injecció d'un respir psicològic físic (Doble salt de pàgina)
            llibreSanat.push({
                isVirtual: true,
                raw_content: "SILENCI_CLINIC",
                html: `
                <div class="respir-psicologic" data-affinity-master="SDP_Pagina_Silenci" style="page-break-before: always; min-height: 80vh; display: flex; align-items: center; justify-content: center;">
                    <span aria-hidden="true" style="opacity: 0.15; font-size: 2em; text-align: center; width: 100%;">❦</span>
                </div>
                <div data-affinity-action="force-blank-spread" style="page-break-before: always;"></div>`
            });
        }
    });
    return llibreSanat;
};

/**
 * [KIMI]: VECTOR 3 - LA PORTADA VIVA (La Façana de l'Ànima)
 * Determina les pàgines mestres del document basant-se en emocions orgàniques.
 */
export const forjarFaçanaViva = (globalStats, titolLlibre) => {
    const total = (globalStats.melancolia + globalStats.pedra_i_terra + globalStats.joia_viva) || 1;
    const pPedra = (globalStats.pedra_i_terra || 0) / total;
    const pMelancolia = (globalStats.melancolia || 0) / total;
    const pJoia = (globalStats.joia_viva || 0) / total;

    let subtitol = "La memòria d'un temps viscut";
    let masterCover = "SDP_Coberta_Estàndard";
    let tintHex = "#1A1B23";

    if (pPedra > 0.45) {
        subtitol = "Crònica d'una vida llaurada amb ferro i silenci";
        masterCover = "SDP_Coberta_Pedra";
        tintHex = "#0A0A0A"; 
    } else if (pMelancolia > 0.45) {
        subtitol = "L'eco lent dels dies guardats";
        masterCover = "SDP_Coberta_Enyor";
        tintHex = "#2B3A4A"; 
    } else if (pJoia > 0.4) {
        subtitol = "Un cant obert a la llum i la llavor";
        masterCover = "SDP_Coberta_Joia";
        tintHex = "#D4A373"; 
    }

    return `
    <section id="coberta-viva" style="background-color: ${tintHex};" data-affinity-master="${masterCover}" data-affinity-bg="${tintHex}">
        <h1 data-affinity-style="SDP_Titol_Coberta">${titolLlibre}</h1>
        <h2 data-affinity-style="SDP_Subtitol_Coberta">${subtitol}</h2>
    </section>`;
};

/**
 * [CHATGPT]: PONT DE DOMINI DE PUBLISHER (API MCP de Destí)
 * Pseudo-codi Backend o script per l'Affinity MCP integration tool
 */
export const imposarLlibreViu = `
// Codi a executar pel servidor MCP via Affinity:execute_script()
function imposarLlibreViu(htmlDOM) {
    htmlDOM.querySelectorAll('*').forEach(node => {
        if (node.hasAttribute("data-affinity-master")) {
            Publisher.addPage();
            Publisher.applyMasterPage(node.getAttribute("data-affinity-master"));
        }
        
        if (node.hasAttribute("data-affinity-style")) {
            let textSelection = Publisher.createText(node.innerText);
            textSelection.applyParagraphStyle(node.getAttribute("data-affinity-style"));
            
            if (node.hasAttribute("data-affinity-weight")) {
                textSelection.characterAttributes.weight = parseInt(node.getAttribute("data-affinity-weight"));
            }
        }
        
        if (node.getAttribute("data-affinity-action") === "force-blank-spread") {
            document.addPageBreak();
            document.addPageBreak(); 
        }
    });
}
`;

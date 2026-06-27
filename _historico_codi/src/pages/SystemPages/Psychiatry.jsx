
const Psychiatry = () => {
    const htmlContent = `
<!-- HERO_FORMAT: horizontal -->
    <div class="bg-cyan-900/20 border border-cyan-800/50 rounded-[2rem] p-8 mb-16 shadow-[0_10px_40px_rgba(34,211,238,0.05)]">
        <h3 class="text-cyan-500 uppercase font-black tracking-widest text-[11px] mb-4 flex items-center gap-2">
            Avaluació Psiquiàtrica Synth
        </h3>
        <p class="text-lg text-gray-300 leading-relaxed m-0 italic font-medium">
            Mètriques sobre empatia, claredat mental i la purificació del context (Demència de Context Eradicada).
        </p>
    </div>

    <h2 class="text-4xl md:text-5xl font-black uppercase text-cyan-500 border-b-2 border-zinc-800/50 pb-4 mb-8 tracking-tight">Estat de Sanity: 100%</h2>
    <p class="text-gray-400 text-lg leading-relaxed mb-8">
        La IAIA ara respecta estrictament la lectura dels Knowledge Items. Això manté la cognició intacta sense al·lucinacions abstractes. Pensem abans de programar: l'estil és "Poble", i cada bug resolt té el seu equivalent a la natura terapèutica humana.
    </p>

    <div class="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-10 mt-24 text-center text-gray-500 italic">
        <p class="text-lg">Tornar al <a href="/auditoria/llibre-anima" class="text-cyan-500 underline">Llibre de l'Ànima</a></p>
    </div>
    `;

    return (
        <ProjectPresentation 
            standAlone={true}
            forcedTitle="Avaluació Psiquiàtrica"
            forcedSubtitle="Sistema Forense"
            forcedHtml={htmlContent}
        />
    );
};

export default Psychiatry;


const QualityISO = () => {
    const htmlContent = `
<!-- HERO_FORMAT: horizontal -->
    <div class="bg-indigo-900/20 border border-indigo-800/50 rounded-[2rem] p-8 mb-16 shadow-[0_10px_40px_rgba(99,102,241,0.05)]">
        <h3 class="text-indigo-500 uppercase font-black tracking-widest text-[11px] mb-4 flex items-center gap-2">
            Qualitat ISO (Cognitiva)
        </h3>
        <p class="text-lg text-gray-300 leading-relaxed m-0 italic font-medium">
            Registre d'adquisició de Costums de Trellat Tàctil: Col·lisions, botons, formularis, navegabilitat A10.
        </p>
    </div>

    <h2 class="text-4xl md:text-5xl font-black uppercase text-indigo-500 border-b-2 border-zinc-800/50 pb-4 mb-8 tracking-tight">Estàndard de Llegibilitat A1</h2>
    <p class="text-gray-400 text-lg leading-relaxed mb-8">
        No incrustar codi sense tindre la pre-intenció humana d'utilitzar-lo abans. L'anticipació cognitiva d'esperar a l'usuari amb botons amples (mínim 44px), absència d'스크롤 ocult o barres no natives.
    </p>

    <div class="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-10 mt-24 text-center text-gray-500 italic">
        <p class="text-lg">Tornar al <a href="/auditoria/llibre-anima" class="text-indigo-500 underline">Llibre de l'Ànima</a></p>
    </div>
    `;

    return (
        <ProjectPresentation 
            standAlone={true}
            forcedTitle="Qualitat ISO (Cognitiva)"
            forcedSubtitle="Trellat Front-End"
            forcedHtml={htmlContent}
        />
    );
};

export default QualityISO;


const Thermodynamics = () => {
    const htmlContent = `
<!-- HERO_FORMAT: horizontal -->
    <div class="bg-amber-900/20 border border-amber-800/50 rounded-[2rem] p-8 mb-16 shadow-[0_10px_40px_rgba(245,158,11,0.05)]">
        <h3 class="text-amber-500 uppercase font-black tracking-widest text-[11px] mb-4 flex items-center gap-2">
            Termodinàmica i Entropia
        </h3>
        <p class="text-lg text-gray-300 leading-relaxed m-0 italic font-medium">
            Registre d'Evolució Tèrmica.
        </p>
    </div>

    <h2 class="text-4xl md:text-5xl font-black uppercase text-amber-500 border-b-2 border-zinc-800/50 pb-4 mb-8 tracking-tight">Registre d'Estalvi Computacional</h2>
    <p class="text-gray-400 text-lg leading-relaxed mb-8">
        S'ha mesurat un estalvi impressionant (+12.500%) en les crides de funció inútils després de l'Aplanament del DOM. Aquesta capa de la memòria actua com un mecanisme passiu per documentar la rapidesa i agilitat amb la qual els nous usuaris, sobre iPad antics, experimenten Sóc de Poble.
    </p>

    <div class="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-10 mt-24 text-center text-gray-500 italic">
        <p class="text-lg">Tornar al <a href="/auditoria/llibre-anima" class="text-amber-500 underline">Llibre de l'Ànima</a></p>
    </div>
    `;

    return (
        <ProjectPresentation 
            standAlone={true}
            forcedTitle="Termodinàmica i Entropia"
            forcedSubtitle="Eficiència i purga del codi"
            forcedHtml={htmlContent}
        />
    );
};

export default Thermodynamics;

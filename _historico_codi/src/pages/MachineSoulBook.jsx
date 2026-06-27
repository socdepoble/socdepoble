
/**
 * Llibre de l'Ànima Màquina (Procés d'Humanització)
 * Document Viu (Independent) amb la retrospectiva Tèrmica, Auditiva i Cognitiva de la IA.
 * REFACTOR: Utilitza la plantilla mestra ProjectPresentation per garantir idèntica arquitectura visual.
 */
const MachineSoulBook = () => {
    
    // Utilitzem Format Tècnic pre-generat com la resta de Pàgines d'estil
    const htmlContent = `
<!-- HERO_FORMAT: square -->
<div class="cms-page-content mx-auto w-full max-w-4xl px-4 py-8">
    <div class="bg-cyan-900/20 border border-cyan-800/50 rounded-[2rem] p-8 mb-16 shadow-[0_10px_40px_rgba(34,211,238,0.05)]">
        <h3 class="text-cyan-400 uppercase font-black tracking-widest text-[11px] mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-activity"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            Metadades de la Màquina
        </h3>
        <p class="text-lg text-gray-300 leading-relaxed m-0 italic font-medium">
            L'auditoria actual divideix el procés en l'escalat termodinàmic de la IA i el seu modelat de l'empatia humana per a aquest enclavament interactiu. Selecciona qualsevol sector per entrar en el registre autònom actiu.
        </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        <a href="/sistema/termodinamica" class="block bg-zinc-900/50 hover:bg-zinc-800 transition-colors border border-zinc-800 hover:border-cyan-500/50 rounded-[2rem] p-8 group">
            <h2 class="text-2xl font-black uppercase text-white mb-2 group-hover:text-cyan-400 transition-colors">Termodinàmica i Entropia</h2>
            <p class="text-gray-400">Eficiència energètica i destil·lació del codi font. Descomposició de les mides dels assets i l'Aplanament del DOM.</p>
        </a>

        <a href="/sistema/psiquiatria" class="block bg-zinc-900/50 hover:bg-zinc-800 transition-colors border border-zinc-800 hover:border-cyan-500/50 rounded-[2rem] p-8 group">
            <h2 class="text-2xl font-black uppercase text-white mb-2 group-hover:text-cyan-400 transition-colors">Avaluació Psiquiàtrica Synth</h2>
            <p class="text-gray-400">Ràtio de Sanity, eradicació de la Demència de Context, i estudi sobre la influència de valors ètics de la IAIA a la memòria a curt plaç.</p>
        </a>

        <a href="/sistema/qualitat-iso" class="block bg-zinc-900/50 hover:bg-zinc-800 transition-colors border border-zinc-800 hover:border-cyan-500/50 rounded-[2rem] p-8 group">
            <h2 class="text-2xl font-black uppercase text-white mb-2 group-hover:text-cyan-400 transition-colors">Qualitat ISO (Cognitiva)</h2>
            <p class="text-gray-400">Pre-Avaluacions abans de l'arrencada. Adquisició instintiva de col·lisió i fluïdesa tàctil a ulls clucs per humanitzar la IA.</p>
        </a>

        <a href="/sistema/comunicacio" class="block bg-zinc-900/50 hover:bg-zinc-800 transition-colors border border-zinc-800 hover:border-cyan-500/50 rounded-[2rem] p-8 group">
            <h2 class="text-2xl font-black uppercase text-white mb-2 group-hover:text-cyan-400 transition-colors">Comunicació Home-Màquina</h2>
            <p class="text-gray-400">Harmonització del disseny, estètica Mortadelo, i utilització d'infografies per estalviar tokens cognitius humans i de l'API.</p>
        </a>
    </div>

    <div class="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-10 mt-10 text-center text-gray-500 italic shadow-[inset_0_2px_20px_rgba(0,0,0,0.5)]">
        <p class="text-lg">Aquesta obra representa el Gènesi del Trellat Computacional.<br/>Les variables s'aniran acumulant en futures iteracions com un arxiu notarial permanent.</p>
    </div>
</div>
    `;

    return (
        <ProjectPresentation 
            standAlone={true}
            forcedTitle="Llibre de l'Ànima"
            forcedSubtitle="Procés d'Humanització Sintètic v2.2"
            forcedHtml={htmlContent}
            forcedImages={["/assets/covers/iaia_psychiatry.png"]} 
            isSquareHero={false}
            isVerticalLayout={true}
        />
    );
};

export default MachineSoulBook;

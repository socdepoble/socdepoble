
const Communication = () => {
    const htmlContent = `
<!-- HERO_FORMAT: horizontal -->
    <div class="bg-emerald-900/20 border border-emerald-800/50 rounded-[2rem] p-8 mb-16 shadow-[0_10px_40px_rgba(16,185,129,0.05)]">
        <h3 class="text-emerald-500 uppercase font-black tracking-widest text-[11px] mb-4 flex items-center gap-2">
            Comunicació Home-Màquina
        </h3>
        <p class="text-lg text-gray-300 leading-relaxed m-0 italic font-medium">
            Mètriques de Síntesi i Estalvi de Tokens Cognitius.
        </p>
    </div>

    <h2 class="text-4xl md:text-5xl font-black uppercase text-emerald-500 border-b-2 border-zinc-800/50 pb-4 mb-8 tracking-tight">Menys Text, Més Impacte</h2>
    <p class="text-gray-400 text-lg leading-relaxed mb-8">
        La comunicació eficient no només estalvia "tokens" de l'API de la IA, sinó també els "tokens" d'energia i temps del cervell humà. Implementar infografies, carrusels didàctics (amb l'estètica absurda i propera d'humor europeu) converteix en mil·lisegons explicacions que abans requerien minuts de lectura tediosa. 
    </p>

    <h2 class="text-3xl md:text-4xl font-black uppercase text-emerald-600 pb-2 mb-6 tracking-tight mt-12">Ràtio d'Eficiència Comunicativa</h2>
    <ul class="list-disc pl-8 space-y-6 text-gray-400 mt-6 mb-20 text-lg">
        <li class="pl-2">
            <strong class="text-white font-black tracking-wide">Reducció Vernacular:</strong> Les paràfrasis denses han estat substituïdes per l'enfocament "Trellat". Màxima informació, mínima massa textual.
        </li>
        <li class="pl-2">
            <strong class="text-white font-black tracking-wide">Infografies Còmiques:</strong> Utilització d'estils inspirats en Ibañez estructurats en diapositives ràpides. Permetem que un xaval de huit anys o una IAIA centenària comprenguen l'arquitectura d'un cop d'ull.
        </li>
    </ul>

    <div class="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-10 mt-24 text-center text-gray-500 italic">
        <p class="text-lg">Tornar al <a href="/auditoria/llibre-anima" class="text-emerald-500 underline">Llibre de l'Ànima</a></p>
    </div>
    `;

    return (
        <ProjectPresentation 
            standAlone={true}
            forcedTitle="Comunicació Home-Màquina"
            forcedSubtitle="Eficiència Expressiva"
            forcedHtml={htmlContent}
        />
    );
};

export default Communication;

import { useParams } from 'react-router-dom';
import { roadmapData } from '../data/roadmapData';
import { roadmapAudits } from '../data/roadmapAudits';

const RoadmapSeedView = () => {
    const { slug } = useParams();

    // Buscar l'id de la llavor
    const allSeeds = [
        ...roadmapData.production, 
        ...roadmapData.done, 
        ...roadmapData.dev, 
        ...roadmapData.backlog
    ];
    
    const seed = allSeeds.find(s => s.slug === slug);
    const auditData = roadmapAudits[slug];

    if (!seed || !auditData) {
        return <Navigate to="/ruta" replace />;
    }

    const htmlContent = `
        <div class="cms-page-content mx-auto w-full max-w-4xl px-4 py-8">
            <div class="bg-cyan-900/10 border border-cyan-800/30 rounded-[2rem] p-6 mb-12 shadow-[0_5px_30px_rgba(34,211,238,0.05)]">
                <h3 class="text-cyan-400 uppercase font-black tracking-widest text-[11px] mb-3 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-fingerprint"><path d="M12 12h.01"/><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12"/><path d="M18 12c0-3.314-2.686-6-6-6S6 8.686 6 12"/><path d="M15 12c0-1.657-1.343-3-3-3s-3 1.343-3 3"/><path d="M12 22a10 10 0 0 0 10-10"/><path d="M22 22a10 10 0 0 1-10-10"/></svg>
                    Dades Tècniques
                </h3>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-bold text-gray-400">
                    <div>
                        <div class="text-[9px] uppercase tracking-wider opacity-60">Categoría</div>
                        <div class="text-white">${seed.category}</div>
                    </div>
                    <div>
                         <div class="text-[9px] uppercase tracking-wider opacity-60">Data</div>
                        <div class="text-white">${seed.date}</div>
                    </div>
                    <div class="col-span-2">
                         <div class="text-[9px] uppercase tracking-wider opacity-60">Etiquetes Flex</div>
                        <div class="text-[var(--theme-accent-primary)]">${seed.tags.join(' • ')}</div>
                    </div>
                </div>
                <p class="text-[14px] mt-4 text-gray-300 italic p-3 bg-black/40 rounded-lg">
                    "${seed.desc}"
                </p>
            </div>

            <h2 class="text-2xl font-black text-white mb-6 uppercase tracking-widest border-b border-gray-800 pb-2 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search text-[var(--theme-accent-primary)]"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                Auditoria Trellat
            </h2>
            
            ${auditData.html}
        </div>
    `;

    return (
        <ProjectPresentation 
            standAlone={true}
            forcedTitle={seed.title}
            forcedSubtitle="Registre de Construcció P2P"
            forcedHtml={htmlContent}
            isSquareHero={false}
            // Forcem a ocultar els views inferiors per centrar només el focus documental
            viewModes={['document']}
            defaultViewMode="document"
        />
    );
};

export default RoadmapSeedView;

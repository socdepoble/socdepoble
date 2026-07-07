import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { UniversalHeader } from '../../components/ui/Header/UniversalHeader';
import ForceGraph3D from 'react-force-graph-3d';
import { Brain, Eye, EyeOff, Maximize2, X, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { marked } from 'marked';

// Llegim els fitxers markdown dinàmicament (requereix Vite)
const mdFiles = import.meta.glob('../../../_wiki_de_poble/**/*.md', { eager: true, query: '?raw', import: 'default' });

const LiveClock = () => {
    const [time, setTime] = useState(new Date());
    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);
    return (
        <div className="bg-black/10 px-3 py-1.5 rounded-full text-sm font-medium text-white/90 backdrop-blur-md flex gap-1.5">
            <span className="opacity-75">{time.toLocaleDateString('ca-ES', { day: '2-digit', month: 'short' })}</span>
            <span>{time.toLocaleTimeString('ca-ES', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
    );
};

const generateGraphData = () => {
    const nodes = [];
    const links = [];
    const nodeMap = new Map();

    Object.entries(mdFiles).forEach(([path, content]) => {
        const cleanPath = path.replace('../../../_wiki_de_poble/', '');
        const filenameWithExt = cleanPath.split('/').pop();
        const basename = filenameWithExt.replace(/\.md$/, '');
        
        const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
        const match = content.match(frontmatterRegex);
        
        let name = basename;
        let category = 'Sense Categoria';
        let tier = 3;
        
        if (match) {
            const fm = match[1];
            const nameMatch = fm.match(/^name:\s*(.+)$/m);
            if (nameMatch) name = nameMatch[1].replace(/['"]/g, '').trim();
            
            const catMatch = fm.match(/^category:\s*(.+)$/m);
            if (catMatch) category = catMatch[1].replace(/['"]/g, '').trim();
            
            const tierMatch = fm.match(/^tier:\s*(\d+)/m);
            if (tierMatch) tier = parseInt(tierMatch[1], 10);
        }

        const node = { 
            id: cleanPath, 
            name: name, 
            path: cleanPath, 
            group: category, 
            val: tier === 1 ? 12 : tier === 2 ? 8 : 4,
            isIAIA: true,
            content: content
        };
        
        nodes.push(node);
        nodeMap.set(basename, cleanPath);
    });

    nodes.forEach(node => {
        const wikilinkRegex = /\[\[(.*?)\]\]/g;
        let match;
        const content = mdFiles[`../../../_wiki_de_poble/${node.path}`];
        while ((match = wikilinkRegex.exec(content)) !== null) {
            let linkTarget = match[1];
            if (linkTarget.includes('|')) linkTarget = linkTarget.split('|')[0];
            const targetBasename = linkTarget.split('/').pop().replace(/\.md$/, '');
            
            if (nodeMap.has(targetBasename)) {
                links.push({ source: node.id, target: nodeMap.get(targetBasename), isCross: false });
            }
        }
    });

    return { nodes, links };
};

const generateSocialData = () => {
    const nodes = [];
    const links = [];
    for(let i=0; i<80; i++) {
        nodes.push({
            id: `social_${i}`,
            name: `Activitat Orgànica ${i}`,
            group: 'xarxa_social',
            val: Math.random() > 0.8 ? 6 : 2,
            isSocial: true
        });
    }
    for(let i=0; i<100; i++) {
        links.push({
            source: `social_${Math.floor(Math.random() * 80)}`,
            target: `social_${Math.floor(Math.random() * 80)}`,
            isCross: false
        });
    }
    return { nodes, links };
};

const graphDataIAIA = generateGraphData();
const graphDataSocial = generateSocialData();

const graphDataSymbiotic = (() => {
    const links = [];
    for (let i = 0; i < 40; i++) {
        const sourceNode = graphDataIAIA.nodes[Math.floor(Math.random() * graphDataIAIA.nodes.length)];
        const targetNode = graphDataSocial.nodes[Math.floor(Math.random() * graphDataSocial.nodes.length)];
        if (sourceNode && targetNode) {
            links.push({ source: sourceNode.id, target: targetNode.id, isCross: true });
        }
    }
    return links;
})();

const BrainView = () => {
  const navigate = useNavigate();
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight - 56 });
  const [selectedNode, setSelectedNode] = useState(null);
  
  const [layers, setLayers] = useState({
    logic: true,
    organic: true,
    symbiotic: true
  });
  
  const [isReading, setIsReading] = useState(false);
  const [isLegendOpen, setIsLegendOpen] = useState(true);
  
  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight - 56 });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const activeData = useMemo(() => {
    const clone = (obj) => JSON.parse(JSON.stringify(obj));
    let combinedNodes = [];
    let combinedLinks = [];

    if (layers.logic) {
      combinedNodes = combinedNodes.concat(clone(graphDataIAIA.nodes));
      combinedLinks = combinedLinks.concat(clone(graphDataIAIA.links));
    }
    if (layers.organic) {
      combinedNodes = combinedNodes.concat(clone(graphDataSocial.nodes));
      combinedLinks = combinedLinks.concat(clone(graphDataSocial.links));
    }
    if (layers.logic && layers.organic && layers.symbiotic) {
      combinedLinks = combinedLinks.concat(clone(graphDataSymbiotic));
    }
    
    return { nodes: combinedNodes, links: combinedLinks };
  }, [layers]);

  const getNodeColor = (node) => {
      if (node.isSocial) return '#3b82f6'; // Blau
      if (node.group === 'identitat') return '#f97316'; // Taronja IAIA
      if (node.group === 'arquitectura') return '#8b5cf6'; // Morat
      if (node.group === 'filosofia') return '#10b981'; // Verd
      
      const colors = ['#f59e0b', '#ec4899', '#f43f5e', '#06b6d4', '#64748b'];
      let hash = 0;
      for (let i = 0; i < node.group.length; i++) hash = node.group.charCodeAt(i) + ((hash << 5) - hash);
      return colors[Math.abs(hash) % colors.length];
  };

  const getLinkColor = (link) => {
      if (link.isCross) return '#ffffff'; // Blanc brillant per la simbiosi
      return 'rgba(255, 255, 255, 0.2)';
  };

  return (
    <div className="flex flex-col w-full h-screen bg-black overflow-hidden relative">
      {/* Ocultem el UniversalHeader si estem incrustats en un iframe */}
      {window.self === window.top && (
          <UniversalHeader 
            title="Cervell Simbiòtic" 
            glass={false}
            className="bg-black border-b border-neutral-800 !text-white"
            leftSlot={
              <button className="sp-btn-primary" style={{ height: '32px', fontSize: '12px', backgroundColor: '#333', color: 'white', borderColor: '#444' }} onClick={() => navigate(-1)}>
                Tornar
              </button>
            } 
          />
      )}

      <div className="flex-1 w-full relative">
        <ForceGraph3D
          width={dimensions.width}
          height={window.self === window.top ? dimensions.height : window.innerHeight}
          graphData={activeData}
          nodeResolution={32}
          nodeColor={getNodeColor}
          nodeRelSize={6}
          onNodeClick={setSelectedNode}
          linkWidth={link => link.isCross ? 1.5 : 1}
          linkColor={getLinkColor}
          linkOpacity={0.4}
          backgroundColor="#000000"
          enableNodeDrag={false}
        />
        
        {/* Panell Únic: Llegendes i Controls (Universal Card format, right side) */}
        <div className="absolute top-6 right-6 pointer-events-none flex flex-col w-[350px] z-10 drop-shadow-2xl">
           <div className="sp-card bg-white !p-0 border-0 pointer-events-auto overflow-hidden shadow-2xl rounded-[16px]">
               {/* Capçalera a l'estil Universal Card (Caputxa Blava) */}
               <div 
                   className="bg-blue-600 text-white p-3 flex items-center justify-between cursor-pointer hover:bg-blue-700 transition-colors" 
                   onClick={() => setIsLegendOpen(!isLegendOpen)}
               >
                   <div className="flex items-center gap-2">
                       <div className="w-11 h-11 flex items-center justify-center shrink-0 bg-white/10 rounded-full">
                           <Brain size={22} className="text-white" />
                       </div>
                       <div className="flex flex-col min-w-0">
                          <span className="font-bold text-[15px] leading-tight text-white truncate">Cervell de la IAIA</span>
                          <span className="text-[13px] text-blue-200 block truncate">{activeData.nodes.length} Nòduls Visibles</span>
                       </div>
                   </div>
                   <div className="w-10 h-10 flex items-center justify-center hover:bg-blue-500 rounded-full transition-colors shrink-0">
                       {isLegendOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                   </div>
               </div>

               {/* Contingut Llegenda i Controls (Estil Universal Card Body) */}
               {isLegendOpen && (
                 <div className="animate-in fade-in slide-in-from-top-2 overflow-y-auto max-h-[75vh] custom-scrollbar" style={{ padding: '18px' }}>
                     
                     <div className="flex flex-col gap-6">
                        
                        {/* Capa Lògica */}
                        <div className="flex flex-col gap-2">
                            <button 
                                onClick={() => setLayers(l => ({...l, logic: !l.logic}))} 
                                className={`sp-btn !justify-start py-3 !px-4 !gap-3 ${layers.logic ? 'sp-btn--primary shadow-md shadow-orange-500/20' : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200 hover:text-neutral-800'}`}
                            >
                                {layers.logic ? <Eye size={18} className="shrink-0" /> : <EyeOff size={18} className="shrink-0" />}
                                <span className="truncate flex-1 text-left">Memòria Màquina</span>
                            </button>
                            <p className="text-neutral-600 m-0 text-sm leading-relaxed">
                                Tots els arxius, regles i skills emmagatzemats a la Wiki de Poble (on s'allotja realment la memòria de la IAIA).
                            </p>
                        </div>

                        {/* Capa Orgànica */}
                        <div className="flex flex-col gap-2">
                            <button 
                                onClick={() => setLayers(l => ({...l, organic: !l.organic}))} 
                                className={`sp-btn !justify-start py-3 !px-4 !gap-3 ${layers.organic ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200 hover:text-neutral-800'}`}
                            >
                                {layers.organic ? <Eye size={18} className="shrink-0" /> : <EyeOff size={18} className="shrink-0" />}
                                <span className="truncate flex-1 text-left">Activitat Humana</span>
                            </button>
                            <p className="text-neutral-600 m-0 text-sm leading-relaxed">
                                Les publicacions, comentaris i interaccions al Mur de Sóc de Poble.
                            </p>
                        </div>

                        {/* Capa Simbiòtica */}
                        <div className="flex flex-col gap-2">
                            <button 
                                onClick={() => setLayers(l => ({...l, symbiotic: !l.symbiotic}))} 
                                disabled={!(layers.logic && layers.organic)}
                                className={`sp-btn !justify-start py-3 !px-4 !gap-3 ${layers.symbiotic && layers.logic && layers.organic ? 'bg-neutral-900 text-white shadow-md shadow-black/20' : 'bg-neutral-100 text-neutral-400 hover:bg-neutral-200 hover:text-neutral-800'}`}
                                style={{ opacity: (layers.logic && layers.organic) ? 1 : 0.5 }}
                            >
                                {(layers.symbiotic && layers.logic && layers.organic) ? <Eye size={18} className="shrink-0" /> : <EyeOff size={18} className="shrink-0" />}
                                <span className="truncate flex-1 text-left">Simbiosi (Connexions)</span>
                            </button>
                            <p className="text-neutral-600 m-0 text-sm leading-relaxed">
                                Enllaços directes on la intel·ligència artificial (memòria màquina) atén, processa o reacciona davant l'activitat humana del Mur (per exemple, la IAIA responent a un comentari).
                            </p>
                        </div>

                     </div>
                 </div>
               )}
           </div>
        </div>

        {selectedNode && !isReading && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-lg bg-black/90 backdrop-blur-xl border border-neutral-700 p-6 rounded-[24px] shadow-2xl animate-in slide-in-from-bottom-8">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-white font-bold text-lg m-0 truncate pr-4">{selectedNode.name}</h3>
                    <button onClick={() => setSelectedNode(null)} className="text-neutral-500 hover:text-white shrink-0"><X size={20} /></button>
                </div>
                <p className="text-neutral-400 text-sm font-mono mb-4 m-0">{selectedNode.path || 'Activitat de la Xarxa Social'}</p>
                
                {!selectedNode.isSocial ? (
                    <button onClick={() => setIsReading(true)} className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold tracking-wider text-sm transition-colors flex items-center justify-center gap-2">
                        <Sparkles size={16} /> Llegir Memòria
                    </button>
                ) : (
                    <button className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold tracking-wider text-sm transition-colors flex items-center justify-center gap-2">
                        <Network size={16} /> Veure Interacció
                    </button>
                )}
            </div>
        )}

        {/* Modal de Lectura de Markdown */}
        {isReading && selectedNode && !selectedNode.isSocial && (
            <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
               <div className="sp-card bg-neutral-900 border border-neutral-700 w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl rounded-2xl overflow-hidden animate-in zoom-in-95">
                  <div className="flex items-center justify-between p-4 border-b border-neutral-800 bg-black/50">
                     <div>
                        <h3 className="text-white font-bold text-lg m-0">{selectedNode.name}</h3>
                        <p className="text-neutral-500 text-xs font-mono m-0">{selectedNode.path}</p>
                     </div>
                     <button onClick={() => setIsReading(false)} className="text-neutral-500 hover:text-white bg-neutral-800 hover:bg-neutral-700 p-2 rounded-full transition-colors">
                        <X size={20} />
                     </button>
                  </div>
                  <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-neutral-900">
                     <div 
                        className="prose prose-invert prose-orange max-w-none"
                        dangerouslySetInnerHTML={{ __html: marked.parse(selectedNode.content || '*Cap contingut trobat*') }}
                     />
                  </div>
               </div>
            </div>
        )}
      </div>
    </div>
  );
};
export default BrainView;

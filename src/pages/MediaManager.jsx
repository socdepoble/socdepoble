import React, { useState, useMemo } from 'react';
import { Image, Folder, HelpCircle, HardDrive, Filter, X, Cloud, Info } from 'lucide-react';
import SEO from '../components/SEO';
import { MEDIA_REGISTRY } from '../data/media_registry';

const MediaManager = () => {
    const [selectedFolder, setSelectedFolder] = useState('all');
    const [selectedImage, setSelectedImage] = useState(null);

    const folders = useMemo(() => {
        const unique = new Set(MEDIA_REGISTRY.media.map(m => m.folder));
        return ['all', ...Array.from(unique)].sort();
    }, []);

    const filteredMedia = useMemo(() => {
        if (selectedFolder === 'all') return MEDIA_REGISTRY.media;
        return MEDIA_REGISTRY.media.filter(m => m.folder === selectedFolder);
    }, [selectedFolder]);

    return (
        <div className="flex flex-col h-full bg-[#050505] overflow-y-auto custom-scrollbar w-full relative pb-20 md:pb-0">
            <SEO title="Banc d'Imatges (Local Photos)" description="Directori Multimèdia del sistema Sóc de Poble." url="/media" />

            {/* HEADER */}
            <div className="w-full shrink-0 flex items-center justify-between px-4 md:px-8 py-6 bg-[#0a0a0c] border-b border-[#222] sticky top-0 z-30">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center font-black text-white shadow-lg shadow-red-600/20">
                        <Image size={20} />
                    </div>
                    <div>
                        <h1 className="text-xl md:text-2xl font-black uppercase tracking-widest text-white">Multimèdia</h1>
                        <p className="text-xs text-white/50 tracking-widen flex items-center gap-2">
                            < हार्ड /> Base Local {MEDIA_REGISTRY.media.length} items
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button className="hidden md:flex items-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white/80 px-4 py-2 rounded-xl text-sm font-bold transition-all" onClick={() => alert("Simulació: Sincronització amb Google Drive / Photos. Aquesta funció permetrà pujar contingut al núvol si s'ha autoritzat la facturació.")}>
                        <Cloud size={18} /> Respatller Núvol (Google)
                    </button>
                </div>
            </div>

            {/* BODY */}
            <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-6 flex flex-col gap-6">
                
                {/* FILTERS */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar w-full">
                    {folders.map(folder => (
                        <button 
                            key={folder}
                            onClick={() => setSelectedFolder(folder)}
                            className={`flex whitespace-nowrap items-center gap-2 px-4 py-2 border rounded-full text-xs font-bold uppercase tracking-widest transition-all ${selectedFolder === folder ? 'bg-red-500/10 border-red-500/50 text-red-500' : 'bg-transparent border-[#333] text-white/60 hover:bg-white/5'}`}
                        >
                            {folder === 'all' ? <Filter size={14} /> : <Folder size={14}/>}
                            {folder === 'all' ? 'Tots' : folder}
                            <span className="opacity-50 ml-1">
                                ({folder === 'all' ? MEDIA_REGISTRY.media.length : MEDIA_REGISTRY.media.filter(m => m.folder === folder).length})
                            </span>
                        </button>
                    ))}
                </div>

                {/* INFO PANEL */}
                <div className="bg-red-900/10 border border-red-500/20 rounded-2xl p-4 flex gap-4 text-red-100">
                    <Info className="text-red-400 shrink-0" size={24} />
                    <div className="text-sm">
                        <strong className="text-red-400 block mb-1">Indexació Inteligente Local-First</strong>
                        El sistema ha detectat i previngut <strong>{MEDIA_REGISTRY.duplicates.length} duplicats</strong> utilitzant signatures hash MD5. Tots els arxius multimèdia futurs pujats passaran per aquest registre per mantenir l'estabilitat i estalviar espai.
                    </div>
                </div>

                {/* GRID */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {filteredMedia.map(item => (
                        <div 
                            key={item.id} 
                            onClick={() => setSelectedImage(item)}
                            className="aspect-square bg-[#111] border border-[#222] rounded-xl overflow-hidden group cursor-pointer relative hover:border-red-500/50 transition-all hover:shadow-[0_0_20px_rgba(220,38,38,0.2)] hover:-translate-y-1"
                        >
                            <img 
                                src={item.path} 
                                alt={item.filename} 
                                className="w-full h-full object-cover transition-opacity" 
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-2 transition-all p-4 text-center">
                                <span className="text-[10px] uppercase tracking-widest text-[#888] bg-black px-2 py-1 rounded border border-[#333]">{item.folder}</span>
                                <span className="text-xs font-bold text-white max-w-full truncate">{item.filename}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* MODAL DETALL */}
            {selectedImage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm" onClick={() => setSelectedImage(null)}>
                    <div className="w-full max-w-4xl bg-[#0a0a0c] border border-[#333] rounded-2xl overflow-hidden flex flex-col md:flex-row relative" onClick={e => e.stopPropagation()}>
                        <button className="absolute top-4 right-4 z-10 w-8 h-8 bg-black/50 hover:bg-red-600 rounded-full flex items-center justify-center text-white transition-all backdrop-blur" onClick={() => setSelectedImage(null)}>
                            <X size={18} />
                        </button>
                        <div className="w-full md:w-2/3 bg-black flex items-center justify-center p-4 relative !min-h-[300px]">
                            <img src={selectedImage.path} alt={selectedImage.filename} className="max-w-full max-h-[70vh] object-contain rounded-lg" />
                        </div>
                        <div className="w-full md:w-1/3 border-l border-[#222] flex flex-col p-6 overflow-y-auto max-h-[80vh] custom-scrollbar">
                           <h2 className="text-xl font-bold text-white mb-6 word-break hyphens-auto">{selectedImage.filename}</h2>
                           
                           <div className="space-y-4 text-sm text-[#888]">
                               <div>
                                   <label className="text-[10px] uppercase tracking-widest font-bold mb-1 block">Hash Únic (MD5 ID)</label>
                                   <div className="font-mono text-white/90 bg-[#111] border border-[#222] rounded p-2 text-xs truncate">
                                       {selectedImage.id}
                                   </div>
                               </div>
                               <div>
                                   <label className="text-[10px] uppercase tracking-widest font-bold mb-1 block">Ruta Interna</label>
                                   <div className="text-white/80 bg-[#111] border border-[#222] rounded p-2 text-xs break-all">
                                       {selectedImage.path}
                                   </div>
                               </div>
                               <div>
                                   <label className="text-[10px] uppercase tracking-widest font-bold mb-1 block">Categoría (Carpeta)</label>
                                   <div className="inline-flex text-white border border-[#444] rounded-full px-3 py-1 text-xs">
                                       <Folder size={12} className="inline mr-1" /> {selectedImage.folder}
                                   </div>
                               </div>
                           </div>

                           <div className="mt-8 pt-6 border-t border-[#222] flex flex-col gap-3">
                               <button className="w-full bg-red-600 hover:bg-red-500 text-white rounded-xl py-3 font-bold text-sm tracking-wide transition-all uppercase">
                                   Utilitzar al Text
                               </button>
                           </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MediaManager;

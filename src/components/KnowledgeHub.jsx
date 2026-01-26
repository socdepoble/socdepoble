import React, { useState } from 'react';
import { Book, Share2, Image as ImageIcon, FileText, Database, Plus, Search, ExternalLink, MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const KnowledgeHub = () => {
    const { user, profile } = useAuth();
    const [activeSource, setActiveSource] = useState(null);

    // Mock data for sources
    const sources = [
        {
            id: 'family-history',
            title: "Història de la Família Ferris",
            type: 'notebook',
            provider: 'NotebookLM',
            status: 'Synced',
            lastUpdate: 'Hace 2 horas',
            description: "Crònica oral i documents digitalitzats de l'horta de la Torre.",
            url: "https://notebooklm.google.com/example- Ferris"
        },
        {
            id: 'water-management',
            title: "Gestió d'Aigua Compartida",
            type: 'slides',
            provider: 'Google Slides',
            status: 'Interactive',
            lastUpdate: 'Ayer',
            description: "Infografia dinàmica sobre el repartiment del pou de la munya.",
            url: "https://docs.google.com/presentation/d/e/2PACX-1vT.../embed"
        }
    ];

    return (
        <div className="knowledge-hub-container p-6 animate-fadeIn">
            <header className="mb-8">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-2">
                            CENTRE DE CONEIXEMENT
                        </h1>
                        <p className="text-gray-400">Hermanament familiar amb IAIA & NotebookLM</p>
                    </div>
                    <button className="bg-cyan-500/10 border border-cyan-500/50 text-cyan-400 px-4 py-2 rounded-full flex items-center gap-2 hover:bg-cyan-500/20 transition-all font-bold">
                        <Plus size={18} /> CONNECTAR FONT
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sources.map(source => (
                    <div key={source.id} className="source-card bg-gray-900/40 backdrop-blur-md border border-gray-800 rounded-2xl p-5 hover:border-cyan-500/30 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-400">
                                {source.type === 'notebook' ? <Database size={24} /> : <ImageIcon size={24} />}
                            </div>
                            <span className="text-[10px] font-bold px-2 py-1 rounded bg-green-500/20 text-green-400 uppercase tracking-widest">
                                {source.status}
                            </span>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">{source.title}</h3>
                        <p className="text-sm text-gray-400 mb-4 line-clamp-2">{source.description}</p>

                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-6">
                            <span className="flex items-center gap-1"><Book size={12} /> {source.provider}</span>
                            <span className="flex items-center gap-1"><Share2 size={12} /> Compartit</span>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setActiveSource(source)}
                                className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white p-2 rounded-lg text-sm transition-all"
                            >
                                <Eye className="inline mr-2" size={14} /> Explorar
                            </button>
                            <a
                                href={source.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg transition-all"
                            >
                                <ExternalLink size={14} />
                            </a>
                        </div>
                    </div>
                ))}
            </div>

            {/* Viewer Overlay */}
            {activeSource && (
                <div className="fixed inset-0 z-[20000] bg-black/90 backdrop-blur-xl flex flex-col p-4 md:p-8 animate-fadeIn">
                    <header className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-white uppercase">{activeSource.title}</h2>
                            <p className="text-cyan-400 text-sm">Visualitzador Integrat • {activeSource.provider}</p>
                        </div>
                        <button
                            onClick={() => setActiveSource(null)}
                            className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all"
                        >
                            <X size={24} />
                        </button>
                    </header>

                    <div className="flex-1 bg-gray-900 rounded-3xl overflow-hidden border border-gray-700 relative shadow-2xl">
                        {activeSource.type === 'slides' ? (
                            <iframe
                                src={activeSource.url}
                                frameBorder="0"
                                width="100%"
                                height="100%"
                                allowFullScreen={true}
                                title={activeSource.title}
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center p-12">
                                <Database size={64} className="text-cyan-500 mb-6 animate-pulse" />
                                <h3 className="text-2xl font-bold mb-4">Sincronitzant amb NotebookLM...</h3>
                                <p className="text-gray-400 max-w-md mb-8">
                                    Aquesta font requereix autenticació externa de Google.
                                    Connectant la IAIA amb la xarxa neuronal de la teua família.
                                </p>
                                <a
                                    href={activeSource.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-8 py-3 rounded-full transition-all flex items-center gap-2"
                                >
                                    OBRIR AL NÚVOL <ExternalLink size={18} />
                                </a>
                            </div>
                        )}

                        <div className="absolute bottom-6 left-6 p-4 bg-black/60 backdrop-blur-md rounded-2xl border border-white/10 flex items-center gap-4 max-w-sm">
                            <div className="p-2 bg-cyan-500 rounded-lg">
                                <MessageCircle size={20} className="text-black" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-white">CONVERSA AMB LA IAIA</p>
                                <p className="text-[10px] text-gray-300 italic">"He llegit aquest document. Vols que t'explique la història de la Torre?"</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .animate-fadeIn {
                    animation: fadeIn 0.4s ease-out;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.98); }
                    to { opacity: 1; transform: scale(1); }
                }
                .source-card {
                    transition: transform 0.2s ease, border-color 0.2s ease;
                }
                .source-card:hover {
                    transform: translateY(-4px);
                }
            `}</style>
        </div>
    );
};

const X = ({ size, onClick, className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        onClick={onClick}
    >
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

const Eye = ({ size, className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
    </svg>
);

export default KnowledgeHub;

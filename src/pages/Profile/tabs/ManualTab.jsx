import React from 'react';
import {
    BookOpen as BookIcon,
    Info as InfoIcon,
    Activity as ActivityIcon,
    HelpCircle as HelpIcon
} from 'lucide-react';
import { manualData } from '../../../data/manualData';

const ManualTab = () => {
    // Safety check for manualData and version
    const data = manualData || { version: "1.2", sections: [] };

    return (
        <div className="manual-tab-container p-4 animate-fadeIn">
            <header className="mb-8 border-b border-gray-800 pb-6">
                <h2 className="text-3xl font-extrabold flex items-center gap-3 text-cyan-400 tracking-tight">
                    <BookIcon size={32} />
                    <span>GUIA DEL VEÍ</span>
                    <span className="text-xs bg-cyan-500/10 px-2 py-1 rounded text-cyan-500/70 font-mono ml-auto">v{data.version}</span>
                </h2>
                <p className="text-gray-400 text-sm mt-2 max-w-xl">
                    Sintetitzant l'organització d'Arrels: Una crònica viva sobre com habitar el poble digital.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {data.sections.map(section => (
                    <div key={section.id} className="manual-section-card bg-gray-900/40 backdrop-blur-md border border-gray-800 rounded-2xl p-6 hover:border-cyan-500/30 transition-all flex flex-col group">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-white group-hover:text-cyan-400 transition-colors">
                            {section.title}
                        </h3>

                        {section.image && (
                            <div className="manual-image-container mb-4 overflow-hidden rounded-xl border border-gray-800">
                                <img
                                    src={section.image}
                                    alt={section.caption || section.title}
                                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                />
                                {section.caption && (
                                    <div className="bg-black/60 p-3 text-[11px] text-gray-400 italic border-t border-gray-800 backdrop-blur-sm">
                                        {section.caption}
                                    </div>
                                )}
                            </div>
                        )}

                        {section.content && (
                            <p className="text-gray-300 leading-relaxed mb-6 text-sm flex-1">
                                {section.content}
                            </p>
                        )}

                        {section.items && (
                            <ul className="space-y-4 mb-4">
                                {section.items.map((item, idx) => (
                                    <li key={idx} className="flex gap-4 text-sm text-gray-400">
                                        <div className="mt-1 w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)] shrink-0" />
                                        <div
                                            className="leading-snug"
                                            dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong class="text-cyan-200">$1</strong>') }}
                                        />
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-12 p-6 bg-gradient-to-br from-cyan-950/30 to-blue-950/30 border border-cyan-500/20 rounded-2xl flex flex-col md:flex-row items-center gap-6">
                <div className="p-4 bg-cyan-500/10 rounded-2xl text-cyan-400">
                    <ActivityIcon size={32} />
                </div>
                <div>
                    <h4 className="text-white font-bold mb-2">Editorial Arrels: Organització del Coneixement</h4>
                    <p className="text-xs text-cyan-200/60 leading-relaxed">
                        Hem heretat la taxonomia de la "Revista Arrels" per a organitzar el nostre món:
                        **L'Arrel** (Visió), **Sabers** (Practical DIY), **Actualitat** i **Mercat**.
                        Contingut periodístic de qualitat al servei del veïnat.
                    </p>
                </div>
            </div>

            <style>{`
                .animate-fadeIn {
                    animation: fadeIn 0.6s ease-out;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default ManualTab;

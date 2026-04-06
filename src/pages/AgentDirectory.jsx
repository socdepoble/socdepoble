import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AGENTS_MAP } from '../config/agentsMap';
import { ArrowLeft, Bot, MapPin } from 'lucide-react';

const AgentDirectory = () => {
    const navigate = useNavigate();

    const agents = Object.values(AGENTS_MAP);

    return (
        <div className="min-h-screen bg-theme-base overflow-y-auto pb-32 pb-safe">
            <header className="sticky top-0 z-30 bg-theme-base/90 backdrop-blur-md border-b border-theme-border p-4 flex items-center gap-3">
                <button 
                    onClick={() => window.history.back()}
                    className="p-2 rounded-full hover:bg-theme-border transition-colors text-theme-text outline-none"
                    aria-label="Tornar arrere"
                >
                    <ArrowLeft size={24} />
                </button>
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                        <Bot className="text-blue-500" size={24} />
                    </div>
                    <h1 className="text-[22px] font-black tracking-tight text-theme-text">L'Equip d'Agents</h1>
                </div>
            </header>

            <main className="p-4 md:p-6 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-8">
                    <p className="text-[17px] leading-relaxed text-theme-text/80 max-w-2xl">
                        Coneix les ments digitals que donen vida a la plataforma. Tria un agent per llegir la seua biografia, descobrir-ne l'especialitat i interactuar amb ell en el seu perfil.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {agents.map((agent, index) => (
                        <div 
                            key={agent.id}
                            onClick={() => navigate(`/perfil/${agent.id}`)}
                            className="bg-theme-panel border border-theme-border rounded-[28px] p-6 shadow-sm hover:shadow-xl hover:border-blue-500/30 transition-all cursor-pointer group hover:-translate-y-1 touch-manipulation"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <div className="flex items-start gap-4 mb-4">
                                <img 
                                    src={agent.avatar_url} 
                                    alt={agent.name} 
                                    className="w-16 h-16 rounded-[20px] object-cover bg-theme-border/50 group-hover:scale-105 transition-transform shadow-sm"
                                    onError={(e) => { e.target.src = '/assets/avatars/default.png'; }}
                                />
                                <div>
                                    <h3 className="text-[19px] font-bold text-theme-text leading-tight group-hover:text-blue-500 transition-colors">{agent.name}</h3>
                                    <p className="text-[15px] font-medium text-theme-text/60 mt-0.5">{agent.role}</p>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-4">
                                {agent.town_name && (
                                    <span className="flex items-center gap-1.5 text-[13px] font-medium bg-theme-border/40 text-theme-text/80 px-3 py-1 rounded-[16px]">
                                        <MapPin size={14} className="opacity-70" /> {agent.town_name}
                                    </span>
                                )}
                                {agent.tag && (
                                    <span className={`text-[13px] font-bold px-3 py-1 rounded-[16px] opacity-90 ${agent.color || 'bg-blue-100 text-blue-700'}`}>
                                        {agent.tag}
                                    </span>
                                )}
                            </div>

                            <p className="text-[15px] leading-relaxed text-theme-text/80 line-clamp-3">
                                {agent.short_bio || (agent.systemPrompt && agent.systemPrompt.slice(0, 110) + '...')}
                            </p>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default AgentDirectory;

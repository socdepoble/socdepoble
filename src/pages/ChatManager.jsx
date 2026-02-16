import React, { useState } from 'react';
import { 
    Settings, Users, Shield, MessageSquare, 
    Plus, Activity, Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Avatar from '../components/Avatar';

/**
 * [CHAT MANAGER v1.0 - CENTRE DE CONTROL BATEGAT]
 * Pàgina mestre per a la gestió de l'enginy de xat, agents i regles de connexió.
 */
const ChatManager = () => {
    const { isSuperAdmin } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');

    if (!isSuperAdmin) {
        return (
            <div className="flex-1 flex items-center justify-center bg-black text-gray-500">
                <Shield className="w-12 h-12 mb-4 opacity-20" />
                <p className="uppercase font-black tracking-widest">Accés Protegit per la IAIA</p>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col bg-black text-white h-full overflow-hidden">
            {/* CABECERA GESTIÓ */}
            <header className="p-6 border-b border-white/10 flex items-center justify-between bg-black/50 backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#FF6B00] flex items-center justify-center shadow-[0_0_20px_rgba(255,107,0,0.3)]">
                        <MessageSquare className="text-white" size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black uppercase tracking-tighter">Chat Manager</h1>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Motor de Missatgeria v12.5</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all text-xs font-bold uppercase">Reset</button>
                    <button className="px-6 py-2 rounded-xl bg-[#FF6B00] text-white hover:bg-[#FF8533] transition-all text-xs font-bold uppercase shadow-lg">Save Config</button>
                </div>
            </header>

            {/* TABS DE GESTIÓ */}
            <nav className="flex px-6 border-b border-white/5 gap-8">
                {[
                    { id: 'overview', label: 'Monitoratge', icon: Activity },
                    { id: 'agents', label: 'Agents IAIA', icon: Users },
                    { id: 'rules', label: 'Regles Bategat', icon: Zap },
                    { id: 'settings', label: 'Ajustos', icon: Settings }
                ].map(tab => (
                    <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`py-4 flex items-center gap-2 border-b-2 transition-all text-[11px] font-black uppercase tracking-widest
                            ${activeTab === tab.id ? 'border-[#FF6B00] text-[#FF6B00]' : 'border-transparent text-gray-500 hover:text-white'}`}
                    >
                        <tab.icon size={14} />
                        {tab.label}
                    </button>
                ))}
            </nav>

            {/* CONTINGUT DINÀMIC */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard label="Converses Actives" value="1.248" trend="+12%" icon={MessageSquare} color="blue" />
                        <StatCard label="Missatges / Hora" value="450" trend="+5%" icon={Zap} color="orange" />
                        <StatCard label="Agents Ocupats" value="13 / 13" trend="Full" icon={Users} color="green" />
                        <StatCard label="Latència Rhizome" value="24ms" trend="Optimal" icon={Activity} color="emerald" />
                    </div>
                )}

                {activeTab === 'agents' && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold">Agents Especialitzats</h2>
                            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold uppercase">
                                <Plus size={14} /> Nou Agent
                            </button>
                        </div>
                        <AgentRow name="IAIA MarIA" role="Governança" status="Online" active={true} />
                        <AgentRow name="Vicent Ferris" role="Agricultura" status="Online" active={true} />
                        <AgentRow name="Pepica la Vall" role="Cultura" status="Idle" active={true} />
                        <AgentRow name="Nano Banana" role="Estètica" status="Testing" active={true} />
                    </div>
                )}
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #333; border-radius: 99px; }
            `}</style>
        </div>
    );
};

const StatCard = ({ label, value, trend, icon: Icon, color }) => (
    <div className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-[#FF6B00]/30 transition-all group">
        <div className={`w-12 h-12 rounded-2xl bg-${color}-500/20 flex items-center justify-center mb-4 text-${color}-400 group-hover:scale-110 transition-transform`}>
            {Icon && <Icon size={24} />}
        </div>
        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">{label}</p>
        <h3 className="text-2xl font-black">{value}</h3>
        <p className="text-[10px] text-emerald-500 font-black mt-2 uppercase">{trend}</p>
    </div>
);

const AgentRow = ({ name, role, status, active }) => (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all">
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gray-800 border border-white/10"></div>
            <div>
                <h4 className="font-bold text-sm">{name}</h4>
                <p className="text-[10px] text-gray-500 uppercase font-black">{role}</p>
            </div>
        </div>
        <div className="flex items-center gap-4">
            <span className={`px-2 py-1 rounded text-[9px] font-black uppercase ${status === 'Online' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-gray-500/20 text-gray-500'}`}>
                {status}
            </span>
            <div className="w-12 h-6 rounded-full bg-white/10 relative cursor-pointer">
                <div className={`absolute top-1 left-1 w-4 h-4 rounded-full transition-all ${active ? 'translate-x-6 bg-[#FF6B00]' : 'bg-gray-500'}`}></div>
            </div>
            <button className="p-2 text-gray-500 hover:text-white"><Settings size={16} /></button>
        </div>
    </div>
);

export default ChatManager;

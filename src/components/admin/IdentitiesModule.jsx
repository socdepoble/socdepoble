import React, { useState, useEffect } from 'react';
import {
    Users, Search, Shield, ShieldOff, AlertCircle,
    MoreHorizontal, Check, X, Filter, UserMinus,
    MessageSquareOff, Heart, EyeOff, Loader2
} from 'lucide-react';
import { supabaseService } from '../../services/supabaseService';
import { logger } from '../../utils/logger';

const IdentitiesModule = () => {
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterMode, setFilterMode] = useState('all'); // all, noise, silenced, bots

    // UI Local state for immediate feedback
    const [updatingId, setUpdatingId] = useState(null);

    useEffect(() => {
        loadProfiles();
    }, []);

    const loadProfiles = async () => {
        setLoading(true);
        try {
            const data = await supabaseService.getAllPersonas(true); // Include all for admin
            setProfiles(data);
        } catch (e) {
            logger.error('Error carregant perfils:', e);
        } finally {
            setLoading(false);
        }
    };

    const handleModerationToggle = async (userId, field, currentValue) => {
        setUpdatingId(`${userId}_${field}`);
        try {
            const updates = { [field]: !currentValue };
            await supabaseService.updateUserModeration(userId, updates);

            // Update local state
            setProfiles(prev => prev.map(p => p.id === userId ? { ...p, ...updates } : p));
        } catch (e) {
            alert('Error en el protocol de moderació.');
        } finally {
            setUpdatingId(null);
        }
    };

    const filteredProfiles = profiles.filter(p => {
        const matchesSearch = p.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.username?.toLowerCase().includes(searchTerm.toLowerCase());

        const isBot = p.id?.startsWith('11111111-');

        if (filterMode === 'noise') return matchesSearch && p.is_noise;
        if (filterMode === 'silenced') return matchesSearch && p.is_silenced;
        if (filterMode === 'bots') return matchesSearch && isBot;
        if (filterMode === 'real') return matchesSearch && !isBot;

        return matchesSearch;
    });

    return (
        <div className="identities-module animate-fadeIn">
            <header className="flex justify-between items-end mb-6 gap-4 flex-wrap">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Users className="text-cyan-400" /> CENS I MODERACIÓ <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded ml-2">GOD MODE</span>
                    </h2>
                    <p className="text-gray-400 text-xs">Gestió de visibilitat i filtrat de soroll social.</p>
                </div>

                <div className="flex gap-2 flex-wrap">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors" size={16} />
                        <input
                            type="text"
                            placeholder="Cerca veí..."
                            className="bg-gray-900/60 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 w-full"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </header>

            <nav className="flex gap-2 mb-6 border-b border-gray-800 pb-4 overflow-x-auto no-scrollbar">
                {[
                    { id: 'all', label: 'Tots', count: profiles.length },
                    { id: 'real', label: 'Reals', count: profiles.filter(p => !p.id?.startsWith('11111111-')).length },
                    { id: 'noise', label: 'Molestos (Soroll)', count: profiles.filter(p => p.is_noise).length },
                    { id: 'silenced', label: 'Silenciats', count: profiles.filter(p => p.is_silenced).length },
                    { id: 'bots', label: 'Personatges IA', count: profiles.filter(p => p.id?.startsWith('11111111-')).length }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setFilterMode(tab.id)}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${filterMode === tab.id
                                ? 'bg-cyan-500 text-black'
                                : 'bg-gray-900/40 text-gray-400 border border-gray-800 hover:border-gray-600'
                            }`}
                    >
                        {tab.label} <span className="ml-1 opacity-60 font-mono">({tab.count})</span>
                    </button>
                ))}
            </nav>

            <div className="bg-gray-900/20 border border-gray-800 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-900/40 text-[10px] uppercase tracking-wider text-gray-500 border-b border-gray-800">
                        <tr>
                            <th className="px-6 py-4">Usuari</th>
                            <th className="px-6 py-4">Reputació</th>
                            <th className="px-6 py-4">Filtre Soroll</th>
                            <th className="px-6 py-4">Estat Xat</th>
                            <th className="px-6 py-4 text-right">Accions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {loading && (
                            <tr>
                                <td colSpan="5" className="py-20 text-center text-gray-500">
                                    <Loader2 className="spin inline mr-2" /> Sincronitzant amb el Cens...
                                </td>
                            </tr>
                        )}
                        {!loading && filteredProfiles.map(p => (
                            <tr key={p.id} className="hover:bg-white/5 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-8 h-8 rounded-full bg-cover bg-center border border-gray-700"
                                            style={{ backgroundImage: `url(${p.avatar_url || '/images/demo/avatar_man_1.png'})` }}
                                        />
                                        <div>
                                            <p className="font-bold text-white leading-none">{p.full_name}</p>
                                            <p className="text-[10px] text-gray-500 mt-1">@{p.username}</p>
                                        </div>
                                        {p.is_demo && <span className="text-[9px] bg-purple-500/20 text-purple-400 px-1 rounded">DEMO</span>}
                                        {p.id?.startsWith('11111111-') && <span className="text-[9px] bg-cyan-500/20 text-cyan-400 px-1 rounded">BOT</span>}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-12 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full transition-all ${p.reputation_score > 70 ? 'bg-green-500' : p.reputation_score > 30 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                                style={{ width: `${p.reputation_score || 50}%` }}
                                            />
                                        </div>
                                        <span className="text-[10px] font-mono text-gray-500">{p.reputation_score || 50}%</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => handleModerationToggle(p.id, 'is_noise', p.is_noise)}
                                        disabled={updatingId === `${p.id}_is_noise`}
                                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all ${p.is_noise
                                                ? 'bg-yellow-500/10 border-yellow-500/50 text-yellow-500'
                                                : 'bg-transparent border-gray-700 text-gray-500 hover:border-gray-500'
                                            }`}
                                    >
                                        {updatingId === `${p.id}_is_noise` ? <Loader2 size={12} className="spin" /> : p.is_noise ? <EyeOff size={12} /> : <Filter size={12} />}
                                        <span className="text-[10px] font-bold">{p.is_noise ? 'SOROLL' : 'LLEST'}</span>
                                    </button>
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => handleModerationToggle(p.id, 'is_silenced', p.is_silenced)}
                                        disabled={updatingId === `${p.id}_is_silenced`}
                                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all ${p.is_silenced
                                                ? 'bg-red-500/10 border-red-500/50 text-red-500'
                                                : 'bg-transparent border-gray-700 text-gray-500 hover:border-gray-500'
                                            }`}
                                    >
                                        {updatingId === `${p.id}_is_silenced` ? <Loader2 size={12} className="spin" /> : p.is_silenced ? <MessageSquareOff size={12} /> : <Heart size={12} />}
                                        <span className="text-[10px] font-bold">{p.is_silenced ? 'MUT' : 'ACTIU'}</span>
                                    </button>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="p-2 text-gray-500 hover:text-white transition-colors">
                                        <MoreHorizontal size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {!loading && filteredProfiles.length === 0 && (
                    <div className="py-20 text-center flex flex-col items-center gap-4 text-gray-500">
                        <AlertCircle size={40} className="text-gray-700" />
                        <p>No s'han trobat veïns amb aquest filtre.</p>
                    </div>
                )}
            </div>

            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .identities-module { animation: fadeIn 0.4s ease-out; }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default IdentitiesModule;

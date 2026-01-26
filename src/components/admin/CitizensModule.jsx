import React, { useState, useEffect } from 'react';
import {
    Users, Search, Shield, ShieldCheck, ShieldAlert,
    UserPlus, UserCheck, Star, Trash2, Loader2, AlertCircle,
    ChevronDown, ArrowRight
} from 'lucide-react';
import { supabaseService } from '../../services/supabaseService';
import { USER_ROLES, ROLE_LABELS } from '../../constants';
import { logger } from '../../utils/logger';

const CitizensModule = () => {
    const [citizens, setCitizens] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [updatingId, setUpdatingId] = useState(null);
    const [filterRole, setFilterRole] = useState('all');

    useEffect(() => {
        loadCitizens();
    }, []);

    const loadCitizens = async () => {
        setLoading(true);
        try {
            const data = await supabaseService.getAllCitizens();
            setCitizens(data);
        } catch (e) {
            logger.error('Error carregant ciutadans:', e);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        if (!window.confirm(`Vols canviar el rol d'aquest ciutadà a ${ROLE_LABELS[newRole]?.va}?`)) return;

        setUpdatingId(userId);
        try {
            const updated = await supabaseService.updateUserRole(userId, newRole);
            setCitizens(prev => prev.map(c => c.id === userId ? { ...c, role: newRole } : c));
            if (window.addHudLog) window.addHudLog('success', [`Rol actualitzat: ${updated.full_name} -> ${newRole}`]);
        } catch (e) {
            alert('Error al canviar el llinatge de poder.');
        } finally {
            setUpdatingId(null);
        }
    };

    const filteredCitizens = citizens.filter(c => {
        const nameMatch = (c.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (c.username || '').toLowerCase().includes(searchTerm.toLowerCase());
        const roleMatch = filterRole === 'all' || c.role === filterRole;
        return nameMatch && roleMatch;
    });

    const getRoleIcon = (role) => {
        switch (role) {
            case USER_ROLES.SUPER_ADMIN: return <ShieldCheck className="text-purple-400" size={16} />;
            case USER_ROLES.ADMIN: return <Shield className="text-red-400" size={16} />;
            case USER_ROLES.EDITOR: return <ShieldAlert className="text-cyan-400" size={16} />;
            case USER_ROLES.AUTHOR: return <Star className="text-yellow-400" size={16} />;
            default: return <Users className="text-gray-400" size={16} />;
        }
    };

    return (
        <div className="citizens-module animate-fadeIn">
            <header className="flex justify-between items-end mb-6 gap-4 flex-wrap">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Users className="text-cyan-400" /> GESTIÓ DE CIUTADANS <span className="text-[10px] bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded ml-2">ARCHITECT MODE</span>
                    </h2>
                    <p className="text-gray-400 text-xs">Assignació de poders i jerarquia de la MasIA.</p>
                </div>

                <div className="flex gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                        <input
                            type="text"
                            placeholder="Cerca per nom o @usuari..."
                            className="bg-gray-900/60 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </header>

            <div className="bg-gray-900/20 border border-gray-800 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-900/40 text-[10px] uppercase tracking-wider text-gray-500 border-b border-gray-800">
                        <tr>
                            <th className="px-6 py-4">Ciutadà</th>
                            <th className="px-6 py-4">Llinatge / Rol</th>
                            <th className="px-6 py-4">Accions de Poder</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {loading ? (
                            <tr>
                                <td colSpan="3" className="py-20 text-center text-gray-500">
                                    <Loader2 className="spin inline mr-2" /> Sincronitzant llinatges...
                                </td>
                            </tr>
                        ) : filteredCitizens.map(c => (
                            <tr key={c.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-10 h-10 rounded-full bg-cover bg-center border border-gray-700"
                                            style={{ backgroundImage: `url(${c.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + c.id})` }}
                                        />
                                        <div>
                                            <p className="font-bold text-white leading-none">{c.full_name}</p>
                                            <p className="text-[10px] text-gray-500 mt-1">@{c.username || 'sense_usuari'}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        {getRoleIcon(c.role)}
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter ${c.role === USER_ROLES.SUPER_ADMIN ? 'bg-purple-500/20 text-purple-400' :
                                                c.role === USER_ROLES.ADMIN ? 'bg-red-500/20 text-red-400' :
                                                    c.role === USER_ROLES.EDITOR ? 'bg-cyan-500/20 text-cyan-400' :
                                                        'bg-gray-700/50 text-gray-400'
                                            }`}>
                                            {ROLE_LABELS[c.role]?.va || 'Veí'}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-2">
                                        {updatingId === c.id ? (
                                            <Loader2 className="spin text-cyan-400" size={20} />
                                        ) : (
                                            <>
                                                <select
                                                    className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs text-white outline-none focus:border-cyan-500"
                                                    value={c.role || USER_ROLES.NEIGHBOR}
                                                    onChange={(e) => handleRoleChange(c.id, e.target.value)}
                                                >
                                                    {Object.entries(USER_ROLES).map(([key, value]) => (
                                                        <option key={value} value={value}>
                                                            {ROLE_LABELS[value]?.va}
                                                        </option>
                                                    ))}
                                                </select>
                                                <button
                                                    className="p-1.5 hover:bg-red-500/20 hover:text-red-400 rounded transition-colors text-gray-500"
                                                    title="Eliminar poders (Reset a Veí)"
                                                    onClick={() => handleRoleChange(c.id, USER_ROLES.NEIGHBOR)}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {!loading && filteredCitizens.length === 0 && (
                    <div className="py-20 text-center text-gray-500">
                        <AlertCircle className="mx-auto mb-2 opacity-20" size={48} />
                        <p>No s'ha trobat cap ciutadà amb el criteri de cerca.</p>
                    </div>
                )}
            </div>

            <style>{`
                .citizens-module { animation: fadeIn 0.4s ease-out; }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default CitizensModule;

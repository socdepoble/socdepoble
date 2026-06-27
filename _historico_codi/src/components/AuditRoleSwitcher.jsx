import { useAuth } from '../app/context/AuthContext';
import { USER_ROLES, ROLE_LABELS } from '../constants';

const AuditRoleSwitcher = () => {
    const { simulatedRole, setSimulatedRole, realProfile } = useAuth();

    // Només el Super Admin real pot veure aquesta eina
    if (realProfile?.role !== USER_ROLES.SUPER_ADMIN) return null;

    const roles = [
        { id: null, label: 'Real (Mestre)', icon: <ShieldAlert size={14} />, color: 'text-orange-500' },
        { id: USER_ROLES.GUEST, label: 'Foraster', icon: <Eye size={14} />, color: 'text-gray-400' },
        { id: USER_ROLES.NEIGHBOR, label: 'Sóc de Poble', icon: <User size={14} />, color: 'text-green-500' },
        { id: USER_ROLES.GROUP_COORDINATOR, label: 'Coord. Grup', icon: <Users size={14} />, color: 'text-blue-400' },
        { id: USER_ROLES.TOWN_COORDINATOR, label: 'Coord. Poble', icon: <Users size={14} />, color: 'text-indigo-400' },
        { id: USER_ROLES.REGION_COORDINATOR, label: 'Coord. Comarca', icon: <Users size={14} />, color: 'text-purple-400' },
        { id: USER_ROLES.ADMIN, label: 'Admin', icon: <ShieldCheck size={14} />, color: 'text-red-500' },
    ];

    return (
        <div className="mt-4 p-3 bg-white/5 genesis-radius border border-white/10 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex items-center gap-2 mb-3 px-1">
                <Users size={12} className="text-orange-500" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Audiència Simulada</span>
            </div>
            
            <div className="grid grid-cols-1 gap-1.5">
                {roles.map((role) => (
                    <button
                        key={role.id || 'real'}
                        onClick={() => setSimulatedRole(role.id)}
                        className={`
                            flex items-center justify-between px-3 h-10 genesis-radius transition-all text-left
                            ${simulatedRole === role.id 
                                ? 'bg-white/10 text-white border border-white/20 shadow-lg' 
                                : 'bg-transparent text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'}
                        `}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`${simulatedRole === role.id ? role.color : 'text-gray-500'}`}>
                                {role.icon}
                            </div>
                            <span className={`text-[11px] font-black uppercase tracking-wider ${simulatedRole === role.id ? 'opacity-100' : 'opacity-70'}`}>
                                {role.label}
                            </span>
                        </div>
                        {simulatedRole === role.id && simulatedRole !== null && (
                            <XCircle 
                                size={12} 
                                className="text-gray-500 hover:text-white cursor-pointer" 
                                onClick={(e) => { e.stopPropagation(); setSimulatedRole(null); }}
                            />
                        )}
                    </button>
                ))}
            </div>
            
            {simulatedRole && (
                <div className="mt-3 p-2 bg-orange-500/10 border border-orange-500/20 rounded-[20px] text-[9px] font-medium text-orange-200 leading-tight italic">
                    🏺 "Estàs mirant el Mas com un {ROLE_LABELS[simulatedRole]?.va || simulatedRole}. El teu poder real roman ocult."
                </div>
            )}
        </div>
    );
};

export default AuditRoleSwitcher;

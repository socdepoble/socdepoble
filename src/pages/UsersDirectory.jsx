import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, ArrowLeft } from 'lucide-react';

import { useViewMode } from '../hooks/useViewMode';
import UniversalCard from '../components/UniversalCard';
import { UniversalGridWrapper, UniversalGridRow } from '../components/UniversalGrid';
import { supabaseService } from '../services/supabaseService';
import StatusLoader from '../components/StatusLoader';
import { logger } from '../utils/logger';
import { useDesign } from '../context/DesignContext';
import { useAuth } from '../context/AuthContext';
import { USER_ROLES } from '../constants';

const UsersDirectory = () => {
    const navigate = useNavigate();
    const { isSuperAdmin } = useAuth();
    const { visionMode } = useDesign();
    const { viewMode, columnCount, containerRef } = useViewMode('users_directory_view_mode', 'grid');
    const [people, setPeople] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setIsLoading(true);
            const data = await supabaseService.getPublicDirectory();
            setPeople(data.people || []);
        } catch (error) {
            logger.error('Error loading users directoy:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <StatusLoader type="loading" />;
    
    const filteredItems = people.filter(item => {
        // [PRIVACY FILTER] Amagar usuaris privats si no eres súper admin
        const isPublic = item.iaia_settings?.is_public !== false;
        // Els membres oficials (is_ai, etc) no tenen iaia_settings habitualment i se suposa que són públics.
        if (!isPublic && !isSuperAdmin) {
            return false;
        }

        // [VISION MODE FILTER] Purga de fantasmes IAIA si s'escau
        if (visionMode === 'humana' && !isSuperAdmin) {
            const role = String(item.role || item.type || '').toLowerCase();
            const name = String(item.full_name || item.name || '').toUpperCase();
            
            const isAI = role.includes(USER_ROLES.AMBASSADOR) || 
                         role.includes(USER_ROLES.OFFICIAL) ||
                         item.is_ai || 
                         item.id?.startsWith('11111111-') ||
                         name.includes('IAIA') ||
                         name.includes('FLASH') ||
                         name.includes('GALL') ||
                         name.includes('VIATJANT');
            if (isAI) return false;
        }
        return true;
    });

    return (
        <div className="directory-page bg-black min-h-screen pb-20">
            {/* Header Master Blindat v9.4.0 */}
            <header className="h-16 flex items-center px-4 bg-black border-b border-[var(--border-master)] sticky top-0 z-30">
                <button className="text-[var(--theme-text)] mr-4 hover:text-[var(--theme-accent-primary)] transition-colors" onClick={() => navigate(-1)}>
                    <ArrowLeft size={24} />
                </button>
                <div className="flex-1">
                    <h1 className="text-lg font-black text-[var(--theme-accent-primary)] uppercase tracking-widest m-0">Veïnatge</h1>
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter m-0">Persones que fan poble</p>
                </div>
            </header>

            <div className="px-4 py-4 bg-black border-b border-gray-800">
                <div className="flex items-center gap-2 p-3 bg-white/5 border border-white/10 rounded-2xl">
                    <Users size={16} className="text-[var(--theme-accent-primary)]" />
                    <span className="font-bold text-xs uppercase tracking-widest text-[var(--theme-text)]">
                        {filteredItems.length} Veïns Registrats {isSuperAdmin ? '(Mode Déu)' : ''}
                    </span>
                </div>
            </div>

            <div ref={containerRef} className="flex-1 w-full pt-6">
                <UniversalGridWrapper viewMode={viewMode}>
                    {filteredItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-12 opacity-50 bg-theme-panel/30 rounded-2xl border border-white/5 mx-auto max-w-sm mt-8">
                            <Users size={48} className="mb-4 text-theme-text opacity-30" />
                            <p className="font-sans text-xs font-bold tracking-[0.2em] uppercase text-center text-theme-text opacity-60">No hi ha veïns visibles.</p>
                        </div>
                    ) : (
                        <UniversalGridRow viewMode={viewMode} columnCount={columnCount}>
                            {filteredItems.map(item => (
                                <UniversalCard
                                    key={item.id}
                                    item={item}
                                    title={item.full_name || item.name || 'Anònim'}
                                    subtitle={`${item.ofici || item.role || item.type || 'Veí'} • ${item.town_name || item.primary_town || 'Senzillament rural'}`}
                                    avatarSrc={item.avatar_url}
                                    avatarName={item.full_name || item.name}
                                    avatarRole={item.role || 'user'}
                                    excerpt={item.bio || item.description || 'Viu la vida al poble.'}
                                    viewMode={viewMode}
                                    variant="post"
                                    onClick={() => navigate(`/perfil/${item.id}`)}
                                />
                            ))}
                        </UniversalGridRow>
                    )}
                </UniversalGridWrapper>
            </div>
        </div>
    );
};

export default UsersDirectory;

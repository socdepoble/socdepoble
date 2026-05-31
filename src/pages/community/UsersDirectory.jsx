import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { useViewMode } from '../../hooks/useViewMode';
import { supabaseService } from '../../core/services/supabaseService';
import { logger } from '../../utils/logger';
import { useDesign } from '../../app/context/DesignContext';
import { useAuth } from '../../app/context/AuthContext';
import StatusLoader from '../../components/ui/StatusLoader';
import { UniversalGridWrapper, UniversalGridRow } from '../../components/ui/UniversalGrid';
import UniversalCard from '../../components/ui/universal-card';
import SEO from '../../components/core/SEO';
import { ArrowLeft, Users } from 'lucide-react';

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

    const filteredItems = useMemo(() => {
        return people.filter(item => {
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
                
                const isAI = item.type === 'entity' ||
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
    }, [people, isSuperAdmin, visionMode]);

    if (isLoading) return <StatusLoader type="loading" />;

    return (
        <div className="directory-page bg-theme-base min-h-screen pb-20">
            <SEO 
                title="Veïnatge | Sóc de Poble" 
                description="Persones que fan poble. Directori oficial de veïns de la comunitat Sóc de Poble." 
                url="/users" 
            />
            {/* Header Master Blindat v9.4.0 */}
            <div role="region" aria-label="Capçalera de Secció" className="h-16 flex items-center px-4 bg-theme-base border-b border-[var(--border-master)] sticky top-0 z-30">
                <button className="text-[var(--theme-text)] mr-4 hover:text-[var(--theme-accent-primary)] transition-colors" onClick={() => navigate(-1)}>
                    <ArrowLeft size={24} />
                </button>
                <div className="flex-1">
                    <h1 className="text-lg font-black text-[var(--theme-accent-primary)] uppercase tracking-widest m-0">Veïnatge</h1>
                    <p className="text-[10px] text-theme-muted uppercase font-bold tracking-tighter m-0">Persones que fan poble</p>
                </div>
            </div>

            <div className="px-4 py-4 bg-theme-base border-b border-theme-border">
                <div className="flex items-center gap-2 p-3 bg-surface-var border border-theme-border/50 rounded-2xl">
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
                                    onClick={() => navigate(`/gent/${item.id}`)}
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

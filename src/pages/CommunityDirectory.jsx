import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Building2, ArrowLeft, Loader2, UserPlus, ChevronRight, User } from 'lucide-react';

import ContextualHeader from '../components/ContextualHeader';
import Avatar from '../components/Avatar';
import { useViewMode } from '../hooks/useViewMode';
import UniversalCard from '../components/UniversalCard';
import { UniversalGridWrapper, UniversalGridRow } from '../components/UniversalGrid';
import { supabaseService } from '../services/supabaseService';
import StatusLoader from '../components/StatusLoader';
import { logger } from '../utils/logger';
import { useDesign } from '../context/DesignContext';
import { useAuth } from '../context/AuthContext';
import { USER_ROLES } from '../constants';

const CommunityDirectory = () => {
    const navigate = useNavigate();
    const { isSuperAdmin } = useAuth();
    const { visionMode } = useDesign();
    const { viewMode, columnCount, containerRef } = useViewMode('directory_view_mode', 'grid');
    const [directory, setDirectory] = useState({ people: [], entities: [] });
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('gent'); // gent, entitats

    useEffect(() => {
        loadDirectory();
    }, []);

    const loadDirectory = async () => {
        try {
            setIsLoading(true);
            const data = await supabaseService.getPublicDirectory();
            setDirectory(data);
        } catch (error) {
            logger.error('Error loading directory:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <StatusLoader type="loading" />;

    const items = activeTab === 'gent' ? directory.people : directory.entities;
    
    // [VISION MODE FILTER] Purga de fantasmes IAIA
    const filteredItems = items.filter(item => {
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
        <div className="directory-page bg-black min-h-screen">
            {/* Header Master Blindat v9.4.0 */}
            <header className="h-16 flex items-center px-4 bg-black border-b border-gray-800 sticky top-0 z-30">
                <button className="text-white mr-4" onClick={() => navigate(-1)}>
                    <ArrowLeft size={24} />
                </button>
                <div className="flex-1">
                    <h1 className="text-lg font-black text-white uppercase tracking-widest m-0">Comunitat</h1>
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter m-0">Connexions que fan poble</p>
                </div>
            </header>

            <div className="px-4 py-4 bg-black border-b border-gray-800">
                <div className="flex gap-2">
                    <button
                        className={`flex-1 flex items-center justify-center gap-2 py-3 font-black text-xs uppercase tracking-widest transition-all
                            ${activeTab === 'gent' ? 'bg-white text-black' : 'bg-gray-900 text-gray-500 border border-gray-800'}`}
                        onClick={() => setActiveTab('gent')}
                    >
                        <Users size={16} />
                        Gent ({filteredItems.length})
                    </button>
                    <button
                        className={`flex-1 flex items-center justify-center gap-2 py-3 font-black text-xs uppercase tracking-widest transition-all
                            ${activeTab === 'entitats' ? 'bg-white text-black' : 'bg-gray-900 text-gray-500 border border-gray-800'}`}
                        onClick={() => setActiveTab('entitats')}
                    >
                        <Building2 size={16} />
                        Entitats ({activeTab === 'entitats' ? filteredItems.length : directory.entities.length})
                    </button>
                </div>
            </div>

            <div ref={containerRef} className="flex-1 w-full pt-6">
                <UniversalGridWrapper viewMode={viewMode}>
                    {filteredItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-12 opacity-50 bg-theme-panel/30 rounded-2xl border border-white/5 mx-auto max-w-sm mt-8">
                            <Users size={48} className="mb-4 text-theme-text opacity-30" />
                            <p className="font-sans text-xs font-bold tracking-[0.2em] uppercase text-center text-theme-text opacity-60">No s'han trobat resultats en aquesta categoria.</p>
                        </div>
                    ) : (
                        <UniversalGridRow viewMode={viewMode} columnCount={columnCount}>
                            {filteredItems.map(item => (
                                <UniversalCard
                                    key={item.id}
                                    item={item}
                                    title={item.full_name || item.name}
                                    subtitle={`${item.role || item.type} • ${item.town_name || item.primary_town}`}
                                    avatarSrc={item.avatar_url}
                                    avatarName={item.full_name || item.name}
                                    avatarRole={activeTab === 'gent' ? (item.role || 'user') : item.type}
                                    excerpt={item.bio || item.description || 'Sense descripció'}
                                    viewMode={viewMode}
                                    variant={activeTab === 'gent' ? 'post' : 'official'}
                                    onClick={() => navigate(activeTab === 'gent' ? `/perfil/${item.id}` : `/entitat/${item.id}`)}
                                />
                            ))}
                        </UniversalGridRow>
                    )}
                </UniversalGridWrapper>
            </div>
        </div>
    );
};

export default CommunityDirectory;

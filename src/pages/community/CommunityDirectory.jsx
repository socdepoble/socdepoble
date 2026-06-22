import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useViewMode } from '../../hooks/useViewMode';
import { supabaseService } from '../../core/services/supabaseService';
import { logger } from '../../utils/logger';
import { useDesign } from '../../app/context/DesignContext';
import { useAuth } from '../../app/context/AuthContext';
import { ArrowLeft, Users, Building2 } from 'lucide-react';
import ConnectButton from '../../components/ui/ConnectButton';
import StatusLoader from '../../components/ui/StatusLoader';
import { UniversalGridWrapper, UniversalGridRow } from '../../components/ui/UniversalGrid';
import UniversalCard from '../../components/ui/universal-card';
import SEO from '../../components/core/SEO';

const CommunityDirectory = () => {
  const navigate = useNavigate();
  const { isSuperAdmin } = useAuth();
  const { visionMode } = useDesign();
  const { viewMode, columnCount, containerRef } = useViewMode('directory_view_mode', 'grid');
  const [directory, setDirectory] = useState({ people: [], entities: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('gent');

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

  const filteredItems = useMemo(() => {
    const items = activeTab === 'gent' ? directory.people : directory.entities;
    return items.filter(item => {
      if (visionMode === 'humana' && !isSuperAdmin) {
        const name = String(item.full_name || item.name || '').toUpperCase();
        const isAI = item.type === 'entity' || item.is_ai || item.id?.startsWith('11111111-') || name.includes('IAIA') || name.includes('FLASH') || name.includes('GALL') || name.includes('VIATJANT');
        if (isAI) return false;
      }
      return true;
    });
  }, [activeTab, directory, visionMode, isSuperAdmin]);

  if (isLoading) return <StatusLoader type="loading" />;

  return (
    <div className="bg-white min-h-screen">
        <SEO title="Comunitat | Sóc de Poble" description="Connexions que fan poble. Directori oficial de persones i entitats de la comunitat Sóc de Poble." url="/comunitat" />
        
        <div role="region" aria-label="Capçalera de Secció" className="h-16 flex items-center px-4 bg-white border-b border-gray-200 sticky top-0 z-30 gap-4">
            <button className="text-gray-900 hover:text-orange-500 transition-colors" onClick={() => navigate(-1)} aria-label="Tornar">
                <ArrowLeft size={24} />
            </button>
            <ConnectButton />
            <div className="flex-1 border-l border-gray-200 pl-4">
                <h1 className="text-lg font-black text-gray-900 uppercase tracking-widest m-0 leading-tight">Comunitat</h1>
                <p className='text-xs text-orange-500 uppercase font-bold tracking-widest m-0 mt-0.5'>Connexions que fan poble</p>
            </div>
        </div>

        <div className="px-4 py-4 bg-white border-b border-gray-200">
            <div className="flex gap-2">
                <button className={`flex-1 flex items-center justify-center gap-2 py-3 font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'gent' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-500 border border-gray-200'}`} onClick={() => setActiveTab('gent')}>
                    <Users size={16} />
                    Gent ({filteredItems.length})
                </button>
                <button className={`flex-1 flex items-center justify-center gap-2 py-3 font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'entitats' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-500 border border-gray-200'}`} onClick={() => setActiveTab('entitats')}>
                    <Building2 size={16} />
                    Entitats ({activeTab === 'entitats' ? filteredItems.length : directory.entities.length})
                </button>
            </div>
        </div>

        <div ref={containerRef} className="flex-1 w-full pt-6">
            <UniversalGridWrapper viewMode={viewMode}>
                {filteredItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-12 bg-gray-50 rounded-2xl border border-gray-200 mx-auto max-w-sm mt-8">
                      <Users size={48} className="mb-4 text-gray-400" />
                      <p className="font-sans text-xs font-bold tracking-[0.2em] uppercase text-center text-gray-500 m-0">No s'han trobat resultats en aquesta categoria.</p>
                  </div>
                ) : (
                  <UniversalGridRow viewMode={viewMode} columnCount={columnCount}>
                      {filteredItems.map(item => (
                        <UniversalCard key={item.id} item={item} title={item.full_name || item.name} subtitle={`${item.role || item.type} • ${item.town_name || item.primary_town}`} avatarSrc={item.avatar_url} avatarName={item.full_name || item.name} avatarRole={activeTab === 'gent' ? item.role || 'user' : item.type} excerpt={item.bio || item.description || 'Sense descripció'} viewMode={viewMode} variant={activeTab === 'gent' ? 'post' : 'official'} onClick={() => navigate(activeTab === 'gent' ? `/gent/${item.id}` : `/empresa/${item.id}`)} />
                      ))}
                  </UniversalGridRow>
                )}
            </UniversalGridWrapper>
        </div>
    </div>
  );
};
export default CommunityDirectory;
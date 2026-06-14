import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AGENTS_MAP } from '../../app/config/agentsMap';
import SearchNavBar from '../../components/patterns/SearchNavBar';
import { useViewMode } from '../../hooks/useViewMode';
import { UniversalGridWrapper, UniversalGridRow } from '../../components/ui/UniversalGrid';
import UniversalCard from '../../components/ui/universal-card';
import SEO from '../../components/core/SEO';
import { Bot } from 'lucide-react';
const AgentDirectory = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const {
    viewMode,
    columnCount,
    containerRef
  } = useViewMode('agents_directory_view_mode', 'grid');
  const agents = useMemo(() => {
    const allAgents = Object.values(AGENTS_MAP);
    if (!query) return allAgents;
    const lowercaseQuery = query.toLowerCase();
    return allAgents.filter(agent => agent.name && agent.name.toLowerCase().includes(lowercaseQuery) || agent.role && agent.role.toLowerCase().includes(lowercaseQuery) || agent.town_name && agent.town_name.toLowerCase().includes(lowercaseQuery) || agent.tag && agent.tag.toLowerCase().includes(lowercaseQuery));
  }, [query]);
  return <div className="search-discover-page min-h-screen bg-theme-base overflow-y-auto">
            <SEO title="Agents IA | Sóc de Poble" description="Directori oficial dels Agents Intel·ligents de Sóc de Poble." url="/agents" />
            <SearchNavBar query={query} setQuery={setQuery} placeholder="BUSCA UN AGENT..." customIcon={<Bot size={20} />} />

            <div ref={containerRef} className="flex-1 w-full pt-4 pb-32 pb-safe animate-in fade-in slide-in-from-bottom-4 duration-500">
                <UniversalGridWrapper viewMode={viewMode}>
                    {agents.length === 0 ? <div className="flex flex-col items-center justify-center py-12 text-center text-theme-muted font-bold text-lg">
                            NO S'HA TROBAT CAP AGENT
                        </div> : <UniversalGridRow viewMode={viewMode} columnCount={columnCount}>
                            {agents.map((agent, index) => <UniversalCard key={agent.id} item={agent} title={agent.name} subtitle={agent.tag || agent.role || 'Agent IA'} avatarSrc={agent.avatar_url} avatarName={agent.name} avatarRole="agent" excerpt={agent.short_bio || agent.systemPrompt && agent.systemPrompt.slice(0, 110) + '...'} viewMode={viewMode} variant="post" onClick={() => navigate(`/gent/${agent.id}`)} />)}
                        </UniversalGridRow>}
                </UniversalGridWrapper>
            </div>
        </div>;
};
export default AgentDirectory;
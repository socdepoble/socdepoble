import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AGENTS_MAP } from '../config/agentsMap';
import ProfileCard from '../components/patterns/ProfileCard';
import SearchNavBar from '../components/patterns/SearchNavBar';
import { Bot } from 'lucide-react';

const AgentDirectory = () => {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');

    const agents = useMemo(() => {
        const allAgents = Object.values(AGENTS_MAP);
        if (!query) return allAgents;
        
        const lowercaseQuery = query.toLowerCase();
        return allAgents.filter(agent => 
            (agent.name && agent.name.toLowerCase().includes(lowercaseQuery)) ||
            (agent.role && agent.role.toLowerCase().includes(lowercaseQuery)) ||
            (agent.town_name && agent.town_name.toLowerCase().includes(lowercaseQuery)) ||
            (agent.tag && agent.tag.toLowerCase().includes(lowercaseQuery))
        );
    }, [query]);

    return (
        <div className="search-discover-page min-h-screen bg-theme-base overflow-y-auto">
            <SearchNavBar 
                query={query}
                setQuery={setQuery}
                placeholder="BUSCA UN AGENT..."
                customIcon={<Bot size={20} />}
            />

            <div className="search-content pt-4 pb-32 pb-safe animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 max-w-7xl mx-auto w-full">
                    {agents.map((agent, index) => (
                        <div key={agent.id} className="h-full" style={{ animationDelay: `${index * 50}ms` }}>
                            <ProfileCard 
                                id={agent.id}
                                avatarUrl={agent.avatar_url}
                                name={agent.name}
                                role={agent.role}
                                townName={agent.town_name}
                                tag={agent.tag}
                                color={agent.color}
                                lema={agent.lema}
                                bio={agent.short_bio || (agent.systemPrompt && agent.systemPrompt.slice(0, 110) + '...')}
                                onNavigate={(id) => navigate(`/perfil/${id}`)}
                            />
                        </div>
                    ))}
                    {agents.length === 0 && (
                        <div className="col-span-full py-12 text-center text-theme-muted font-bold text-lg">
                            NO S'HA TROBAT CAP AGENT
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AgentDirectory;

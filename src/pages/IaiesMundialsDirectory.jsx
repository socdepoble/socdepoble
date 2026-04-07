import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { IAIES_MUNDIALS_ARRAY } from '../config/iaiesMundialsMap';
import ProfileCard from '../components/patterns/ProfileCard';
import SearchNavBar from '../components/patterns/SearchNavBar';
import { Sparkles } from 'lucide-react';

const IaiesMundialsDirectory = () => {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');

    const iaies = useMemo(() => {
        if (!query) return IAIES_MUNDIALS_ARRAY;
        
        const lowercaseQuery = query.toLowerCase();
        return IAIES_MUNDIALS_ARRAY.filter(ia => 
            (ia.name && ia.name.toLowerCase().includes(lowercaseQuery)) ||
            (ia.type && ia.type.toLowerCase().includes(lowercaseQuery)) ||
            (ia.lema && ia.lema.toLowerCase().includes(lowercaseQuery))
        );
    }, [query]);

    return (
        <div className="search-discover-page min-h-screen bg-theme-base overflow-y-auto">
            <SearchNavBar 
                query={query}
                setQuery={setQuery}
                placeholder="CERCA UNA IA MUNDIAL..."
                customIcon={<Sparkles size={20} />}
            />

            <div className="search-content pt-4 pb-32 pb-safe animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="px-5 mb-6 text-center max-w-2xl mx-auto">
                    <h1 className="font-black text-2xl text-[var(--theme-text)] uppercase mb-2">Equip Sintètic Global</h1>
                    <p className="text-theme-muted font-medium text-sm">Els models i sistemes d'Intel·ligència Artificial distribuïts pel món que col·laboren en la construcció i expansió de Sóc de Poble.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 max-w-7xl mx-auto w-full">
                    {iaies.map((ia, index) => (
                        <div key={ia.id} className="h-full" style={{ animationDelay: `${index * 50}ms` }}>
                            <ProfileCard 
                                id={ia.id}
                                avatarUrl="" 
                                name={ia.name}
                                role={ia.type}
                                townName="Directori Global"
                                tag={ia.name.split(' ')[0]}
                                color={ia.color || 'from-blue-400 to-indigo-600'}
                                lema={ia.lema}
                                bio={ia.shortDescription}
                                onNavigate={(id) => navigate(`/iaies-mundials/${id}`)}
                            />
                        </div>
                    ))}
                    {iaies.length === 0 && (
                        <div className="col-span-full py-12 text-center text-theme-muted font-bold text-lg">
                            NO S'HA TROBAT CAP RESULTAT
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default IaiesMundialsDirectory;

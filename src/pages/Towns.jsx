import React, { useState, useEffect } from 'react';
import { supabaseService } from '../services/supabaseService';
import { useTranslation } from 'react-i18next';
import { Search, MapPin, Users } from 'lucide-react';
import './Towns.css';

const Towns = () => {
    const { t } = useTranslation();
    const [towns, setTowns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchTowns = async () => {
            try {
                const data = await supabaseService.getTowns();
                setTowns(data);
            } catch (error) {
                console.error('Error loading towns:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchTowns();
    }, []);

    const filteredTowns = towns.filter(town =>
        town.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="loading-container">{t('common.loading')}</div>;

    return (
        <div className="towns-container">
            <header className="towns-header">
                <h1>{t('nav.towns')}</h1>
                <div className="search-bar">
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder={t('common.search')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </header>

            <div className="towns-grid">
                {filteredTowns.map(town => (
                    <div key={town.id} className="town-card">
                        <div className="town-logo-wrapper">
                            {town.logo_url ? (
                                <img src={town.logo_url} alt={town.name} className="town-logo" />
                            ) : (
                                <MapPin size={40} color="#666" />
                            )}
                        </div>
                        <div className="town-info">
                            <h3>{town.name}</h3>
                            <p className="town-description">{town.description}</p>
                            <div className="town-meta">
                                <span className="population">
                                    <Users size={16} />
                                    {town.population?.toLocaleString()}
                                </span>
                                <button className="view-more-btn">Ver Mur</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredTowns.length === 0 && (
                <div className="empty-state">
                    <p>No s'han trobat pobles amb aquest nom.</p>
                </div>
            )}
        </div>
    );
};

export default Towns;

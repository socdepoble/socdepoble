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
                    <div key={town.id} className="town-card" onClick={() => console.log('Ir a detalle de', town.name)}>
                        {/* Imagen de fondo (si existe, sino placeholder) */}
                        <img
                            src={town.image_url || 'https://images.unsplash.com/photo-1541890289-b86df5b6fea1?auto=format&fit=crop&q=80'}
                            alt={town.name}
                            className="town-image-bg"
                        />

                        {/* Overlay oscuro para legibilidad */}
                        <div className="town-overlay"></div>

                        {/* Contenido sobreimpreso */}
                        <div className="town-info">
                            <div className="town-header">
                                {town.logo_url && (
                                    <img src={town.logo_url} alt="Escut" className="town-logo-mini" />
                                )}
                                <h3 className="town-name">{town.name}</h3>
                            </div>

                            <p className="town-desc">{town.description}</p>

                            <div className="town-stats">
                                <span className="stat-item">
                                    <Users size={14} />
                                    {town.population?.toLocaleString()} hab.
                                </span>
                                {/* Aquí podríamos poner más stats como temperatura o noticias */}
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

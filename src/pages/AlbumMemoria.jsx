import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Tag, Image as ImageIcon, Camera } from 'lucide-react';
import { memoriaVivaService } from '../services/MemoriaVivaService';
import { MOCK_FEED, NANO_BANANA_LEGACY_ALBUM } from '../data';
import './AlbumMemoria.css';

const AlbumMemoria = () => {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [filter, setFilter] = useState('');
    const [selectedTag, setSelectedTag] = useState(null);
    const [theme, setTheme] = useState('pedra-seca');

    useEffect(() => {
        // Consolidem tot el bategat visual per a l'àlbum
        const allItems = [
            ...NANO_BANANA_LEGACY_ALBUM.map(img => ({
                ...img,
                type: 'legacy',
                tags: img.tags || (img.tag ? [img.tag] : ['#Llegat'])
            })),
            ...MOCK_FEED.filter(p => p.image_url || p.image).map(p => ({
                url: Array.isArray(p.image_url) ? p.image_url[0] : (p.image_url || p.image),
                title: p.metadata?.title || p.author,
                tags: p.tags || ['#Batec'],
                type: 'post'
            }))
        ];
        setItems(allItems);
    }, []);

    const allTags = [...new Set(items.flatMap(item => item.tags))];

    const filteredItems = items.filter(item => {
        const matchesSearch = item.title?.toLowerCase().includes(filter.toLowerCase());
        const matchesTag = selectedTag ? item.tags.includes(selectedTag) : true;
        return matchesSearch && matchesTag;
    });

    return (
        <div className="album-container solar-compatible">
            <header className="album-header">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ArrowLeft size={24} />
                </button>
                <h1>Àlbum de la Memòria Viva</h1>
                <p className="subtitle">Tot el bategat del Mas, arxivat per Nano Banana</p>
            </header>

            <div className={`album-controls ${theme === 'oli-suau' ? 'm3-styled' : ''}`}>
                <div className="theme-selector">
                    <button
                        className={`theme-btn ${theme === 'pedra-seca' ? 'active' : ''}`}
                        onClick={() => setTheme('pedra-seca')}
                    >
                        Pedra Seca
                    </button>
                    <button
                        className={`theme-btn ${theme === 'oli-suau' ? 'active' : ''}`}
                        onClick={() => setTheme('oli-suau')}
                    >
                        Oli Suau
                    </button>
                </div>

                <div className="search-box">
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder="Cerca en la memòria..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                </div>
                <div className="tags-scroll">
                    <button
                        className={`tag-pill ${!selectedTag ? 'active' : ''}`}
                        onClick={() => setSelectedTag(null)}
                    >
                        Tots
                    </button>
                    {allTags.map(tag => (
                        <button
                            key={tag}
                            className={`tag-pill ${selectedTag === tag ? 'active' : ''}`}
                            onClick={() => setSelectedTag(tag)}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            </div>

            <div className={`album-grid bento-style theme-${theme}`}>
                {filteredItems.map((item, idx) => (
                    <div key={idx} className="album-item-card">
                        <img src={item.url} alt={item.title} loading="lazy" />
                        <div className="item-overlay">
                            <span className="item-title">{item.title}</span>
                            <div className="item-tags">
                                {item.tags.map(t => <span key={t} className="tag-micro">{t}</span>)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredItems.length === 0 && (
                <div className="empty-state">
                    <Camera size={48} />
                    <p>No hem trobat cap record amb eixos criteris, Mestre.</p>
                </div>
            )}
        </div>
    );
};

export default AlbumMemoria;

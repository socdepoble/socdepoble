import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Camera } from 'lucide-react';
import { useUI } from '../context/UIContext';
import { MOCK_FEED, NANO_BANANA_LEGACY_ALBUM } from '../data';
import './AlbumMemoria.css';
 
 const AlbumMemoria = () => {
     const { visualDemocracy, setVisualDemocracy } = useUI();
     const navigate = useNavigate();
     const [items] = useState(() => [
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
     ]);
     const [filter, setFilter] = useState('');
     const [activeTag, setActiveTag] = useState('Tot');
 
     const allTags = [...new Set(items.flatMap(item => item.tags))];
 
     const filteredItems = items.filter(item => {
         const matchesSearch = item.title?.toLowerCase().includes(filter.toLowerCase());
         const matchesTag = activeTag && activeTag !== 'Tot' ? item.tags.includes(activeTag) : true;
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
 
             <div className={`album-controls ${visualDemocracy === 'oli-suau' ? 'm3-styled' : ''}`}>
                 <div className="theme-switcher">
                     <button
                         className={`theme-btn ${visualDemocracy === 'pedra-seca' ? 'active' : ''}`}
                         onClick={() => setVisualDemocracy('pedra-seca')}
                     >
                         Pedra Seca
                     </button>
                     <button
                         className={`theme-btn ${visualDemocracy === 'oli-suau' ? 'active' : ''}`}
                         onClick={() => setVisualDemocracy('oli-suau')}
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
                         className={`tag-pill ${activeTag === 'Tot' ? 'active' : ''}`}
                         onClick={() => setActiveTag('Tot')}
                     >
                         Tots
                     </button>
                     {allTags.map(tag => (
                         <button
                             key={tag}
                             className={`tag-pill ${activeTag === tag ? 'active' : ''}`}
                             onClick={() => setActiveTag(tag)}
                         >
                             {tag}
                         </button>
                     ))}
                 </div>
             </div>
 
             <div className={`album-grid bento-style theme-${visualDemocracy}`}>
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

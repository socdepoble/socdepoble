import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    List, Database, Plus, Search,
    FileText, Store, Box, LayoutGrid,
    History, ArrowLeft, Library, ShieldCheck, Zap, Sparkles, Landmark, MoreVertical
} from 'lucide-react';
import StatusLoader from '../components/StatusLoader';
import { useTheme } from '../context/ThemeContext';
import { logger } from '../utils/logger';
import { MOCK_FEED, MOCK_MARKET_ITEMS } from '../data';
import { supabaseService } from '../services/supabaseService';
import './Archive.css';
 
 const ArxiuOr = () => {
     const navigate = useNavigate();
     const { theme } = useTheme();
     const [viewMode, setViewMode] = useState('masonry');
     const [objects, setObjects] = useState([]);
     const [loading, setLoading] = useState(true);
     const [activeCollection, setActiveCollection] = useState('tots');
     const [searchQuery, setSearchQuery] = useState('');
 
     // PRESETS DE COLECCIONS (SACS) - Edició Arxiu d'Or v9.4.0
     const collections = [
         { id: 'tots', name: 'Tots els recursos', icon: <Library size={18} /> },
         { id: 'historia', name: 'Història Viva', icon: <History size={18} />, color: '#CC5500' },
         { id: 'rentonar', name: 'El Rentonar', icon: <Landmark size={18} />, color: '#10B981' },
         { id: 'fadrins', name: 'Comissió Fadrins', icon: <Zap size={18} />, color: '#00F2FF' },
         { id: 'mercat', name: 'Arxiu Mercat', icon: <Store size={18} />, color: '#F97316' },
         { id: 'master', name: 'Llegat Master', icon: <Sparkles size={18} />, color: '#8B5CF6' },
     ];
 
     useEffect(() => {
         const loadObjects = async () => {
             setLoading(true);
             try {
                 // 1. Fetch from Supabase
                 const [postsResponse, itemsResponse] = await Promise.all([
                     supabaseService.getPosts('tot', null, 0, 100),
                     supabaseService.getMarketItems('tot', null, 0, 100)
                 ]);
 
                 const dbPosts = postsResponse?.data || [];
                 const dbItems = itemsResponse?.data || [];
 
                 // 2. Integrate MOCK_FEED (Lore/Legacy)
                 const historicalPosts = MOCK_FEED.filter(p => 
                     p.id.toString().includes('rentonar') || 
                     p.author?.includes('Rentonar') || 
                     p.author?.includes('Javi Llinares') ||
                     p.type === 'didactic_presentation'
                 );
 
                 // 3. Integrate Legacy Market Items
                 const legacyItems = MOCK_MARKET_ITEMS.filter(i => i.type === 'memory' || i.is_pinned);
 
                 const unified = [
                     ...dbPosts.map(p => ({
                         id: p.uuid || p.id,
                         type: 'post',
                         title: p.content?.substring(0, 80).replace(/[#*]/g, '') + (p.content?.length > 80 ? '...' : ''),
                         description: "Crònica bategada al mur del poble.",
                         icon: <FileText size={18} />,
                         author: p.profiles?.username || p.author || 'Veí',
                         date: p.created_at,
                         tags: p.tags || ['#comunitat'],
                         image: (Array.isArray(p.image_url) ? p.image_url[0] : p.image_url) || '/assets/master/town_placeholder.png',
                         collection: p.author?.includes('Rentonar') ? 'rentonar' : 'historia'
                     })),
                     ...historicalPosts.map(p => ({
                         id: p.id,
                         type: 'legacy_post',
                         title: p.content?.split('\n')[0].replace(/[#*]/g, '') || 'Senses títol',
                         description: p.content?.substring(0, 120).replace(/[#*]/g, '') + '...',
                         icon: <History size={18} />,
                         author: p.author,
                         date: p.created_at || '2024-01-01',
                         tags: p.tags || ['#llegat', '#arxiu'],
                         image: (Array.isArray(p.image_url) ? p.image_url[0] : p.image_url) || '/assets/master/brand_cinematic_1.png',
                         collection: p.author?.includes('Rentonar') ? 'rentonar' : 'master'
                     })),
                     ...dbItems.map(i => ({
                         id: i.uuid || i.id,
                         type: 'product',
                         title: i.title,
                         description: i.description,
                         icon: <Store size={18} />,
                         author: i.profiles?.username || i.seller || 'Comerç',
                         date: i.created_at,
                         tags: ['#mercat'],
                         image: (Array.isArray(i.images) ? i.images[0] : i.image_url) || '/assets/master/market_placeholder.png',
                         collection: 'mercat'
                     })),
                     ...legacyItems.map(i => ({
                         id: i.id,
                         type: 'legacy_item',
                         title: i.title,
                         description: i.description,
                         icon: <Box size={18} />,
                         author: i.seller || 'Sóc de Poble',
                         date: i.created_at || '2023-01-01',
                         tags: ['#llegat', '#memoria'],
                         image: (Array.isArray(i.images) ? i.images[0] : (i.cover || i.image_url)) || '/assets/master/logo_socdepoble_green_square.png',
                         collection: 'master'
                     }))
                 ].sort((a, b) => new Date(b.date) - new Date(a.date));
 
                 setObjects(unified);
             } catch (err) {
                 logger.error("Error carregant l'Arxiu d'Or:", err);
             } finally {
                 setLoading(false);
             }
         };
 
         loadObjects();
     }, []);
 
     const filteredObjects = useMemo(() => {
         return objects.filter(obj => {
             const matchesCollection = activeCollection === 'tots' || obj.collection === activeCollection;
             const matchesSearch = 
                 obj.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                 obj.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                 (obj.description && obj.description.toLowerCase().includes(searchQuery.toLowerCase()));
             return matchesCollection && matchesSearch;
         });
     }, [objects, activeCollection, searchQuery]);
 
     if (loading) return <StatusLoader message="Exhumant l'Arxiu d'Or..." />;
 
     return (
         <div className={`archive-page min-h-screen text-white flex flex-col md:flex-row theme-${theme}`}>
             {/* SIDEBAR D'ORGANITZACIÓ - Blindat v9.4.0 */}
             <aside className="w-full md:w-72 bg-black border-r border-gray-900 flex flex-col sticky top-0 md:h-screen overflow-y-auto">
                 <header className="p-6 border-b border-gray-900">
                     <div className="flex items-center gap-3 mb-4">
                         <button className="text-gray-400 hover:text-white transition-colors" onClick={() => navigate(-1)}>
                             <ArrowLeft size={20} />
                         </button>
                         <h1 className="text-xl font-black uppercase tracking-tighter">Arxiu d'Or</h1>
                     </div>
                     <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest flex items-center gap-2">
                         <ShieldCheck size={12} className="text-green-500" />
                         Protocol Tabula Rasa Actiu
                     </div>
                 </header>
 
                 <div className="flex-1 p-4 space-y-6">
                     <div>
                         <h3 className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-4 px-2">Col·leccions</h3>
                         <nav className="space-y-1">
                             {collections.map(col => (
                                 <button
                                     key={col.id}
                                     className={`w-full flex items-center justify-between px-3 py-2.5 rounded-none transition-all duration-200 group
                                         ${activeCollection === col.id ? 'bg-white text-black' : 'text-gray-400 hover:bg-gray-900'}`}
                                     onClick={() => setActiveCollection(col.id)}
                                 >
                                     <div className="flex items-center gap-3">
                                         <span className={`transition-colors ${activeCollection === col.id ? 'text-black' : ''}`} style={{ color: activeCollection === col.id ? '' : col.color }}>
                                             {col.icon}
                                         </span>
                                         <span className="text-xs font-bold uppercase tracking-tight">{col.name}</span>
                                     </div>
                                     <span className={`text-[10px] font-black px-1.5 py-0.5 border ${activeCollection === col.id ? 'bg-black text-white border-black' : 'bg-gray-900 text-gray-500 border-gray-800'}`}>
                                         {objects.filter(o => o.collection === col.id || col.id === 'tots').length}
                                     </span>
                                 </button>
                             ))}
                         </nav>
                     </div>
 
                     <div>
                         <h3 className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-4 px-2">Etiquetes Master</h3>
                         <div className="flex flex-wrap gap-2 px-2">
                             {['#rentonar', '#llegat', '#mel', '#poma', '#iaia', '#master'].map(tag => (
                                 <button key={tag} className="text-[10px] font-black uppercase bg-gray-900 text-gray-400 border border-gray-800 px-2 py-1 hover:text-white hover:border-gray-600 transition-all">
                                     {tag}
                                 </button>
                             ))}
                         </div>
                     </div>
                 </div>
 
                 <footer className="p-6 border-t border-gray-900 bg-black/50 backdrop-blur">
                     <div className="flex items-center gap-3 text-gray-500">
                         <Database size={16} />
                         <div className="text-[10px] font-bold uppercase leading-none">
                             Memòria Inmutable<br/>
                             <span className="text-gray-700">Digital Mas v3.0</span>
                         </div>
                     </div>
                 </footer>
             </aside>
 
             {/* CONTINGUT PRINCIPAL */}
             <main className="flex-1 flex flex-col bg-black">
                 <header className="h-20 flex items-center justify-between px-6 border-b border-gray-900 bg-black/80 backdrop-blur sticky top-0 z-30">
                     <div className="flex-1 max-w-2xl relative">
                         <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                         <input
                             type="text"
                             placeholder="Cerca a l'arxiu sobirà..."
                             className="w-full bg-gray-900 border-none text-white text-sm font-bold pl-12 pr-4 py-3 focus:ring-1 focus:ring-white transition-all rounded-none"
                             value={searchQuery}
                             onChange={(e) => setSearchQuery(e.target.value)}
                         />
                     </div>
                     
                     <div className="flex items-center gap-2 ml-4">
                         <button 
                             className={`p-2.5 bg-gray-900 text-gray-500 border border-gray-800 hover:text-white transition-all ${viewMode === 'masonry' ? 'bg-white text-black border-white' : ''}`}
                             onClick={() => setViewMode('masonry')}
                         >
                             <LayoutGrid size={20} />
                         </button>
                         <button 
                             className={`p-2.5 bg-gray-900 text-gray-500 border border-gray-800 hover:text-white transition-all ${viewMode === 'list' ? 'bg-white text-black border-white' : ''}`}
                             onClick={() => setViewMode('list')}
                         >
                             <List size={20} />
                         </button>
                         <button className="ml-4 bg-white text-black px-4 py-2.5 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-white hover:bg-transparent hover:text-white transition-all">
                             <Plus size={16} />
                             Afegir
                         </button>
                     </div>
                 </header>
 
                 <div className={`p-6 md:p-8 flex-1 overflow-y-auto ${viewMode === 'masonry' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}`}>
                     {filteredObjects.length > 0 ? (
                         filteredObjects.map(obj => (
                             <article 
                                 key={obj.id} 
                                 className={`resource-card bg-gray-900 border border-gray-800 group hover:border-gray-500 transition-all duration-300 relative
                                     ${viewMode === 'list' ? 'flex items-center gap-6 p-4' : 'flex flex-col'}`}
                                 onClick={() => {
                                     if (obj.type.includes('post')) navigate(`/post/${obj.id}`);
                                     if (obj.type === 'product') navigate(`/mercat`);
                                 }}
                             >
                                 <div className={`relative overflow-hidden bg-black
                                     ${viewMode === 'list' ? 'w-24 h-24 shrink-0' : 'aspect-square w-full'}`}>
                                     <img 
                                         src={obj.image} 
                                         alt={obj.title} 
                                         className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                                         loading="lazy" 
                                     />
                                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60"></div>
                                     <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/60 backdrop-blur text-[8px] font-black uppercase tracking-tighter text-white border border-white/20">
                                         {obj.type}
                                     </div>
                                 </div>
                                 
                                 <div className={`flex-1 ${viewMode === 'list' ? '' : 'p-5'}`}>
                                     <div className="flex items-center justify-between mb-2">
                                         <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500">
                                             {obj.icon}
                                             <span className="truncate max-w-[120px]">{obj.author}</span>
                                         </div>
                                         <div className="text-[9px] font-bold text-gray-600 tracking-tighter">
                                             {new Date(obj.date).toLocaleDateString()}
                                         </div>
                                     </div>
                                     
                                     <h4 className="text-sm font-black uppercase tracking-tight text-white mb-2 leading-snug group-hover:text-primary transition-colors">
                                         {obj.title}
                                     </h4>
                                     
                                     {viewMode === 'list' && (
                                         <p className="text-xs text-gray-400 line-clamp-2 mb-3 font-medium">
                                             {obj.description}
                                         </p>
                                     )}
                                     
                                     <div className="flex flex-wrap gap-1.5 mt-auto">
                                         {obj.tags.slice(0, 3).map(t => (
                                             <span key={t} className="text-[9px] font-bold bg-black text-gray-500 px-1.5 py-0.5 border border-gray-800">
                                                 {t}
                                             </span>
                                         ))}
                                     </div>
                                 </div>
 
                                 <button className="absolute top-4 right-4 p-1.5 bg-black/40 text-gray-500 opacity-0 group-hover:opacity-100 transition-all hover:text-white">
                                     <MoreVertical size={16} />
                                 </button>
                             </article>
                         ))
                     ) : (
                         <div className="col-span-full h-96 flex flex-col items-center justify-center text-gray-700 bg-gray-900/20 border-2 border-dashed border-gray-900">
                             <Box size={48} strokeWidth={1} className="mb-4 opacity-20" />
                             <p className="text-xs font-black uppercase tracking-widest opacity-40">No hi ha solatge en aquesta col·lecció</p>
                         </div>
                     )}
                 </div>
             </main>
         </div>
     );
 };
 
 export default ArxiuOr;

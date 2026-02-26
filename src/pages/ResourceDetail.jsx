import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, MapPin, User, Share2, Bookmark, ShieldCheck, History, BookOpen, Quote } from 'lucide-react';
import { supabaseService } from '../services/supabaseService';
import { MOCK_FEED, MOCK_MARKET_ITEMS } from '../data';
import { logger } from '../utils/logger';
import Avatar from '../components/Avatar';
import SEO from '../components/SEO';
import ShareHub from '../components/ShareHub';
import NanoLoader from '../components/NanoLoader';
import './Archive.css'; // Reusing base styles but adding local ones

const ResourceDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [resource, setResource] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResource = async () => {
            setLoading(true);
            try {
                // 1. Check Mock Data first (Legacy/Lore)
                let found = MOCK_FEED.find(p => p.id?.toString() === id) || 
                            MOCK_MARKET_ITEMS.find(i => i.id?.toString() === id);

                if (found) {
                    setResource({
                        ...found,
                        is_legacy: true,
                        display_title: found.title || found.content?.substring(0, 50),
                        display_content: found.content || found.description,
                        display_author: found.author || found.seller || 'Llegat Master'
                    });
                } else {
                    // 2. Check Supabase (Posts or Items)
                    const postResponse = await supabaseService.getPostById(id);
                    if (postResponse) {
                        setResource({
                            ...postResponse,
                            type: 'post',
                            display_title: postResponse.content?.substring(0, 50),
                            display_content: postResponse.content,
                            display_author: postResponse.profiles?.username || postResponse.author_name || 'Foraster'
                        });
                    } else {
                        // Check Market Items too
                        const items = await supabaseService.getMarketItems('tot');
                        const item = items?.data?.find(i => i.uuid === id || i.id === id);
                        if (item) {
                            setResource({
                                ...item,
                                type: 'product',
                                display_title: item.title,
                                display_content: item.description,
                                display_author: item.profiles?.username || item.seller || 'Comerç'
                            });
                        }
                    }
                }
            } catch (error) {
                logger.error('[ResourceDetail] Error fetching resource:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchResource();
    }, [id]);

    if (loading) return <StatusLoader message="Consultant La Bíblia de l'Arxiu..." />;
    if (!resource) return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
            <ShieldCheck size={48} className="text-red-500 mb-4 opacity-50" />
            <h1 className="text-xl font-black uppercase text-white mb-2">Recurs no trobat</h1>
            <p className="text-gray-500 text-sm mb-6">Aquesta pàgina de La Bíblia encara s'està escrivint.</p>
            <button onClick={() => navigate('/arxiu')} className="bg-white text-black px-6 py-3 font-black text-xs uppercase tracking-widest border border-white hover:bg-transparent hover:text-white transition-all">
                Tornar a l'Arxiu
            </button>
        </div>
    );

    return (
        <div className="resource-detail-page min-h-screen bg-black text-white selection:bg-primary selection:text-black">
            <SEO 
                title={`${resource.display_title} | Arxiu d'Or`}
                description={resource.display_content?.substring(0, 160)}
            />

            {/* HEADER STICKY GEM MODERN */}
            <header className="h-16 flex items-center justify-between px-6 border-b border-white/5 bg-black/90 backdrop-blur sticky top-0 z-[100] w-full">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-all text-gray-400 hover:text-white"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div className="h-4 w-px bg-white/10 hidden md:block"></div>
                    <div className="hidden md:flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-[3px] text-gray-600">La Bíblia del Territori</span>
                        <span className="text-xs font-bold text-white truncate max-w-[200px]">{resource.display_title || 'Detall del Recurs'}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button className="p-2.5 text-gray-500 hover:text-white transition-colors">
                        <Bookmark size={20} />
                    </button>
                    <ShareHub 
                        title={resource.display_title}
                        text={resource.display_content}
                        url={window.location.href}
                    />
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-12 md:py-20 lg:py-24">
                {/* INTRO: Títol i Context Històric */}
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="px-3 py-1 bg-white/10 border border-white/20 text-[10px] font-black uppercase tracking-widest text-[#00F2FF]">
                            {resource.is_legacy ? 'Llegat Master' : resource.type}
                        </span>
                        <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                            Ref: {String(id).substring(0, 8)}
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.9] mb-8 animate-slide-up">
                        {resource.display_title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 py-6 border-y border-white/5 text-xs font-bold text-gray-400 uppercase tracking-widest">
                        <div className="flex items-center gap-2">
                            <Avatar src={resource.profiles?.avatar_url} name={resource.display_author} size={32} />
                            <span>{resource.display_author}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock size={16} />
                            <span>{new Date(resource.created_at || '2024-01-01').toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin size={16} />
                            <span>{resource.towns?.name || 'La Torre'}</span>
                        </div>
                    </div>
                </div>

                {/* VISUAL: Imatge Immersiva */}
                {(resource.image_url || resource.image || resource.cover) && (
                    <div className="mb-16 -mx-6 md:mx-0 rounded-none md:rounded-3xl overflow-hidden border border-white/10 bg-gray-900 group">
                        <img 
                            src={resource.image_url || resource.image || resource.cover} 
                            alt="Visual de l'Arxiu"
                            className="w-full aspect-video object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-700"
                        />
                    </div>
                )}

                {/* CONTINGUT: La Bíblia (Rich Text) */}
                <div className="prose prose-invert max-w-none mb-20 animate-fade-in delay-200">
                    <div className="resource-biblia-content text-lg md:text-xl leading-relaxed font-medium text-gray-300 space-y-6" 
                         dangerouslySetInnerHTML={{ __html: resource.display_content?.replace(/\n/g, '<br/>') }} />
                </div>

                {/* FOOTER: Sigil i Verificació */}
                <footer className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-start gap-8 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center p-2">
                            <img src="/assets/master/logo_socdepoble_white_full.png" className="w-full object-contain" alt="Sigil" />
                        </div>
                        <div className="text-[10px] font-black uppercase tracking-[2px]">
                            Registre Inmutable<br/>
                            Protocol Tabula Rasa v3.0
                        </div>
                    </div>

                    <div className="flex gap-4">
                         <div className="flex flex-col items-end">
                            <span className="text-[10px] font-black uppercase mb-1">Còpia Digital de Seguretat</span>
                            <div className="flex gap-2">
                                <span className="w-6 h-1 bg-white/20"></span>
                                <span className="w-12 h-1 bg-white/20"></span>
                                <span className="w-4 h-1 bg-[#00F2FF]"></span>
                            </div>
                         </div>
                    </div>
                </footer>
            </main>

            <style>{`
                .resource-biblia-content h1 { font-size: 2.5rem; font-weight: 900; text-transform: uppercase; margin-bottom: 2rem; color: #fff; line-height: 1; }
                .resource-biblia-content h2 { font-size: 1.5rem; font-weight: 900; text-transform: uppercase; margin-top: 3rem; margin-bottom: 1.5rem; color: var(--theme-accent-primary); }
                .resource-biblia-content blockquote { border-left: 4px solid var(--theme-accent-primary); padding-left: 1.5rem; font-style: italic; color: #gray-400; margin: 2rem 0; }
                
                @keyframes slide-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-slide-up { animation: slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                .animate-fade-in { animation: opacity 1s ease forwards; opacity: 0; }
                @keyframes opacity { to { opacity: 1; } }
            `}</style>
        </div>
    );
};

// Internal status loader for this page
const StatusLoader = ({ message }) => (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 bg-[radial-gradient(circle_at_center,_#111_0%,_#000_100%)]">
        <div className="relative mb-8">
            <div className="w-16 h-16 border-4 border-white/5 border-t-white rounded-full animate-spin"></div>
            <BookOpen className="absolute inset-0 m-auto text-white/20" size={24} />
        </div>
        <p className="text-[10px] font-black uppercase tracking-[5px] text-white animate-pulse">{message}</p>
    </div>
);

export default ResourceDetail;

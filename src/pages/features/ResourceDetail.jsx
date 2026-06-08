import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabaseService } from '../../core/services/supabaseService';
import { MOCK_FEED, MOCK_MARKET_ITEMS } from '../../data';
import { logger } from '../../utils/logger';

// Internal status loader for this page
const StatusLoader = ({ message }) => (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 bg-[radial-gradient(circle_at_center,_#111_0%,_#000_100%)]">
        <div className="relative mb-8">
            <div className="w-16 h-16 border-4 border-white/5 border-t-white rounded-[28px] animate-spin"></div>
            <BookOpen className="absolute inset-0 m-auto text-white/20" size={24} />
        </div>
        <p className="text-[10px] font-black uppercase tracking-[5px] text-white animate-pulse">{message}</p>
    </div>
);

const determineColor = (source, tags = []) => {
    if (source?.includes('Rentonar') || tags.includes('rentonar')) return '#10B981'; // Green
    if (source?.includes('Sóc de Poble') || tags.includes('socdepoble')) return '#F97316'; // Orange
    if (source?.includes('Master')) return '#8B5CF6'; // Purple
    return '#CC5500'; // Default Terra
};

const formatContentToHtml = (content) => {
    if (!content) return '';
    // Basic text cleaner if it comes unformatted, but allow HTML
    if (!content.includes('<p>') && !content.includes('<br')) {
        return content.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br/>');
    }
    return content;
};

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
                        display_title: found.title || found.content?.split('\n')[0].replace(/[#*]/g, '') || "Sense títol",
                        display_content: found.content || found.description,
                        display_author: found.author || found.seller || 'Llegat Master',
                        source_domain: found.author?.includes('Rentonar') ? 'El Rentonar' : 'Sóc de Poble',
                        cover_image: Array.isArray(found.image_url) ? found.image_url[0] : (found.image_url || found.image || '/system/master/brand_cinematic_1.png')
                    });
                } else {
                    // 2. Check Supabase (Posts or Items)
                    const postResponse = await supabaseService.getPostById(id);
                    if (postResponse) {
                        setResource({
                            ...postResponse,
                            type: 'post',
                            display_title: postResponse.content?.split('\n')[0].substring(0, 50).replace(/[#*]/g, '') || "Publicació",
                            display_content: postResponse.content,
                            display_author: postResponse.profiles?.username || postResponse.author_name || 'Foraster',
                            source_domain: 'Comunitat',
                            cover_image: Array.isArray(postResponse.image_url) ? postResponse.image_url[0] : (postResponse.image_url || '/system/master/town_placeholder.png')
                        });
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

    if (loading) return <StatusLoader message="Obrint Portes de l'Arxiu..." />;
    if (!resource) return (
        <div className="min-w-full min-h-[100dvh] bg-black flex flex-col items-center justify-center p-6 text-center">
            <ShieldCheck size={48} className="text-red-500 mb-4 opacity-50" />
            <h1 className="text-xl font-black uppercase text-white mb-2">Recurs no trobat</h1>
            <p className="text-gray-500 text-sm mb-6">Aquest pergamí s'ha perdut en la memòria del poble.</p>
            <button onClick={() => navigate('/arxiu')} className="bg-white text-black px-6 py-3 font-black text-xs uppercase tracking-widest hover:bg-transparent hover:text-white border border-white transition-all">
                Tornar a l'Arxiu
            </button>
        </div>
    );

    const brandColor = determineColor(resource.source_domain, resource.tags);

    return (
        <div className="w-full min-h-[100dvh] bg-black text-white relative font-sans overflow-x-hidden selection:bg-white selection:text-black">
            <SEO 
                title={`${resource.display_title} | Arxiu Sóc de Poble`}
                description={resource.display_content?.substring(0, 160)}
                image={resource.cover_image}
            />

            {/* SUPER HERO HEADER - 80vh */}
            <div role="region" aria-label="Capçalera de Secció" className="relative w-full h-[65vh] md:h-[80vh] flex flex-col justify-end p-6 md:p-16 overflow-hidden rounded-b-3xl">
                {/* Immersive Background */}
                <div 
                    className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-1000 scale-105"
                    style={{ backgroundImage: `url(${resource.cover_image})`, filter: 'brightness(0.5) contrast(1.1)' }}
                />
                <div className="absolute inset-0 z-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                {/* Back & Actions - Safe Area */}
                <div className="absolute top-6 left-6 right-6 z-20 flex items-center justify-between">
                    <button 
                        onClick={() => navigate(-1)}
                        className="flex items-center justify-center w-12 h-12 rounded-full bg-black/30 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>

                    <div className="flex gap-3">
                        <button className="flex items-center justify-center w-12 h-12 rounded-full bg-black/30 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors">
                            <Bookmark size={20} />
                        </button>
                        <ShareHub 
                            title={resource.display_title}
                            text={resource.display_content}
                            url={window.location.href}
                        />
                    </div>
                </div>

                {/* Hero Content */}
                <div className="relative z-10 max-w-4xl animate-slide-up">
                    <div className="flex flex-wrap items-center gap-3 mb-6">
                        {resource.source_domain && (
                            <span 
                                className="px-4 py-1.5 text-[10px] font-black uppercase tracking-[3px] rounded-full border border-white/20 backdrop-blur-sm"
                                style={{ backgroundColor: `${brandColor}20`, color: brandColor, borderColor: `${brandColor}40` }}
                            >
                                {resource.source_domain}
                            </span>
                        )}
                        <span className="px-4 py-1.5 bg-black/30 backdrop-blur-sm border border-white/10 rounded-full text-[10px] font-bold text-white/70 uppercase tracking-widest flex items-center gap-2">
                            <History size={12} /> {resource.is_legacy ? 'Arxiu Històric' : 'Registre Vigent'}
                        </span>
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] mb-6 text-white drop-shadow-2xl" style={{ fontFamily: 'Noto Sans, sans-serif' }}>
                        {resource.display_title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 py-6 border-y border-white/10 text-xs font-bold text-gray-300 uppercase tracking-widest mt-6">
                        <div className="flex items-center gap-3">
                            <Avatar src={resource.profiles?.avatar_url} name={resource.display_author} size={36} />
                            <span className="text-white">{resource.display_author}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock size={16} style={{ color: brandColor }} />
                            <span>{new Date(resource.created_at || '2024-01-01').toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin size={16} />
                            <span>{resource.towns?.name || 'La Torre de les Maçanes'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* BIBLIA CONTENT */}
            <div role="region" aria-label="Contingut Principal" className="w-full bg-black relative z-20 -mt-10 px-4 md:px-0">
                <div className="max-w-3xl mx-auto py-16 md:py-24">
                    {/* Floating Meta Box if Tags exist */}
                    {resource.tags && resource.tags.length > 0 && (
                        <div className="hidden md:flex flex-wrap gap-2 mb-12">
                            {resource.tags.map((tag, idx) => (
                                <span key={idx} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold text-gray-400 capitalize">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    <article 
                        className="resource-biblia-content text-xl md:text-2xl leading-relaxed font-light text-white/90 space-y-8"
                        dangerouslySetInnerHTML={{ __html: `<p>${formatContentToHtml(resource.display_content)}</p>` }}
                    />
                </div>
            </div>

            {/* FOOTER SIGIL STRICT Pedra Seca */}
            <footer className="w-full border-t border-white/10 bg-black py-16 px-6">
                <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 opacity-50 hover:opacity-100 transition-opacity duration-500">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-[28px] border border-white/20 flex items-center justify-center p-3 bg-white/5">
                            <img src="/system/master/logo-socdepoble-rect-blanc.svg" className="w-full object-contain filter grayscale" alt="Sigil Documental" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-black uppercase tracking-[3px] text-white">Registre Inmutable</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#00F2FF]">Protocol Tabula Rasa v3.0</span>
                            <span className="text-[10px] font-mono text-gray-500 mt-1">ID: {String(id).toUpperCase()}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                         <div className="flex flex-col items-end">
                            <span className="text-[10px] font-black uppercase mb-2 text-white">Genotip Autenticat</span>
                            <div className="flex gap-2">
                                <span className="w-8 h-1 bg-white/20"></span>
                                <span className="w-16 h-1 bg-white/20"></span>
                                <span className="w-8 h-1" style={{ backgroundColor: brandColor }}></span>
                            </div>
                         </div>
                    </div>
                </div>
            </footer>

            <style>{`
                .resource-biblia-content p { margin-bottom: 1.5em; opacity: 0.9; }
                .resource-biblia-content img { border-radius: 1.5rem; width: 100%; margin: 3rem 0; border: 1px solid rgba(255,255,255,0.1); }
                .resource-biblia-content a { color: ${brandColor}; text-decoration: underline; text-underline-offset: 4px; }
                .resource-biblia-content h2, 
                .resource-biblia-content h3 { font-size: 1.5em; font-weight: 900; text-transform: uppercase; margin-top: 2.5em; margin-bottom: 1em; color: ${brandColor}; letter-spacing: -0.02em; }
                .resource-biblia-content blockquote { border-left: 4px solid ${brandColor}; padding-left: 2rem; padding-top: 0.5rem; padding-bottom: 0.5rem; font-style: italic; color: #aaa; margin: 3rem 0; font-size: 1.1em; background: linear-gradient(to right, rgba(255,255,255,0.05), transparent); }
                .resource-biblia-content strong { font-weight: 900; color: white; }
                
                @keyframes slide-up {
                    from { opacity: 0; transform: translateY(40px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-slide-up { animation: slide-up 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
            `}</style>
        </div>
    );
};

export default ResourceDetail;

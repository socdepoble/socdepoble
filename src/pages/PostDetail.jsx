import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Tag, Share2 } from 'lucide-react';
import { supabaseService } from '../services/supabaseService';
import { logger } from '../utils/logger';
import SEO from '../components/SEO';
import ShareHub from '../components/ShareHub';
import NanoLoader from '../components/NanoLoader';
import UniversalCard from '../components/UniversalCard';
import { MOCK_FEED, MOCK_MARKET_ITEMS } from '../data';
import { parseSimpleMarkdown } from '../utils/markdownParser';

const PostDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                // First check Local Mocks for the ID
                const mockPost = MOCK_FEED.find(p => p.id === id || p.id === Number(id)) || 
                                 MOCK_MARKET_ITEMS.find(m => m.id === id || m.id === Number(id));
                if (mockPost) {
                    setPost(mockPost);
                    setLoading(false);
                    return;
                }
                
                // If it's not a real ID or missing, simulating for robustness
                const data = await supabaseService.getPostById(id);
                setPost(data);
            } catch (error) {
                logger.error('[PostDetail] Error fetching post:', error);
                // Fallback dummy for development testing if ID is not found
                setPost(null);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    if(loading) return <div className="min-h-[100dvh] flex items-center justify-center bg-theme-base"><NanoLoader message="Carregant Detalls..." /></div>;
    if(!post) return <div className="min-h-[100dvh] flex items-center justify-center bg-theme-base text-theme-text font-black text-xl uppercase tracking-widest">Aquest document no batega (404)</div>;

    // Derived props for Universal Components
    const displayAuthor = post.author_name || post?.author?.name || 'Habitant Desconegut';
    const displayTown = post.towns?.name || post.town || 'Comunitat';
    const avatarSrc = post.profiles?.avatar_url || post.author_avatar;
    const isOfficial = post.author_role === 'official' || post.type === 'ajuntament' || post.is_official;
    const mediaList = post.images || (post.image_url ? [post.image_url] : []);
    
    // Formatting date/time locally
    const postDate = post.created_at ? new Date(post.created_at) : new Date();
    const displayDate = postDate.toLocaleDateString('ca-ES', { day: '2-digit', month: 'short' });
    const displayTime = postDate.toLocaleTimeString('ca-ES', { hour: '2-digit', minute: '2-digit' });

    return (
        <div className="flex-1 flex flex-col min-h-0 w-full bg-theme-base relative overflow-x-hidden font-sans pb-24 animate-in fade-in duration-500">
            <SEO
                title={post.title || displayAuthor}
                description={(post.content || '').substring(0, 160)}
                image={mediaList[0]}
                url={`/post/${id}`}
            />

            {/* STICKY NAV BAR */}
            <div className="sticky top-0 z-dropdown flex items-center justify-between p-4 bg-theme-base/80 backdrop-blur-3xl border-b border-theme-border">
                <button 
                    className="w-12 h-12 flex items-center justify-center bg-theme-panel rounded-full hover:bg-white/10 transition-all border border-theme-border shadow-sm active:scale-95" 
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft size={24} className="text-theme-text" />
                </button>
                <ShareHub
                    title={post.title || displayAuthor}
                    text={(post.content || '').substring(0, 100)}
                    url={window.location.href}
                    customTrigger={
                        <button className="w-12 h-12 flex items-center justify-center bg-theme-panel rounded-full hover:bg-white/10 transition-all border border-theme-border shadow-sm active:scale-95">
                            <Share2 size={24} className="text-theme-text" />
                        </button>
                    }
                />
            </div>

            <article className="max-w-xl mx-auto w-full flex flex-col pt-4">
                {/* 1. HEADER + MEDIA UNIFICAT (CAPUCHA) */}
                <div className="px-4 mb-6">
                    <div className="bg-theme-panel border border-theme-border rounded-[28px] overflow-hidden shadow-xl">
                        <UniversalCard.Header 
                            item={post} 
                            cardVariant={post.type || 'mur'} 
                            displayTown={displayTown}
                            displayAuthor={displayAuthor}
                            avatarSrc={avatarSrc}
                            avatarRole={post.author_role}
                            isOfficial={isOfficial}
                            displayDate={displayDate}
                            displayTime={displayTime}
                        />
                        {mediaList.length > 0 && (
                            <UniversalCard.Media 
                                item={post}
                                cardVariant={post.type || 'mur'}
                                mediaList={mediaList}
                                displayImage={mediaList[0]}
                                displayTitle={post.title || displayAuthor}
                                openViewer={() => {}}
                                navigate={navigate}
                            />
                        )}
                    </div>
                </div>

                {/* 3. TÍTOL, SUBTÍTOL i TEXT AMB FORMAT MARCKDOWN (Mini bloc de notes) */}
                <div className="px-5 sm:px-6 flex flex-col gap-2">
                    {post.title && !post.content?.includes(`# ${post.title}`) && (
                        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-theme-text leading-none mb-2">{post.title}</h1>
                    )}
                    
                    {post.subtitle && (
                        <h2 className="text-xl sm:text-2xl font-bold text-[var(--theme-accent-primary)] mb-4 leading-tight">{post.subtitle}</h2>
                    )}
                    
                    {post.content && (
                        <div className="html-article-prose" dangerouslySetInnerHTML={{ __html: parseSimpleMarkdown(post.content) }} />
                    )}
                </div>
                
                {/* ETIQUETAR (Tagging System) */}
                <div className="mt-4 mx-4 p-6 bg-theme-panel border border-theme-border shadow-lg rounded-[32px] overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--sdp-terracotta)]/10 blur-3xl -mr-16 -mt-16 pointer-events-none" />
                    <div className="flex items-center gap-3 mb-6 relative z-10">
                        <div className="w-10 h-10 rounded-full bg-[var(--sdp-terracotta)]/20 flex items-center justify-center">
                            <Tag className="text-[var(--sdp-terracotta)]" size={20} />
                        </div>
                        <span className="font-black uppercase tracking-widest text-sm text-theme-text">Classificació del Poble</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-8 relative z-10">
                        {post.tags && post.tags.length > 0 ? (
                            post.tags.map(tag => (
                                <span key={tag} className="px-4 py-2 bg-theme-base border border-theme-border rounded-full text-xs font-black uppercase tracking-wider text-theme-text shadow-sm">{tag}</span>
                            ))
                        ) : (
                            <span className="text-sm font-bold text-theme-text/40 italic">La comunitat encara no ha afegit etiquetes a este arxiu.</span>
                        )}
                    </div>
                    
                    <button 
                        className="w-full h-16 bg-theme-base border border-theme-border hover:border-[var(--sdp-terracotta)]/50 hover:bg-white/5 shadow-sm rounded-[24px] font-black tracking-widest uppercase transition-all flex items-center justify-center gap-2 text-theme-text active:scale-[0.98] relative z-10" 
                        onClick={() => {
                            // Offline Queue Hook or LocalFirst DB will catch this action
                            alert('Funció "Etiquetar" activada per a propers Bategats!');
                        }}
                    >
                        <Tag size={20} />
                        Afegir Etiqueta
                    </button>
                </div>
            </article>
        </div>
    );
};

export default PostDetail;

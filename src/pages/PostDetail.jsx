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
        <div className="flex-1 flex flex-col min-h-0 w-full bg-theme-base relative overflow-x-hidden pt-safe pb-24">
            <SEO
                title={post.title || displayAuthor}
                description={(post.content || '').substring(0, 160)}
                image={mediaList[0]}
                url={`/post/${id}`}
            />

            {/* STICKY NAV BAR - Transparent Glassmorphism */}
            <div className="sticky top-0 z-dropdown flex items-center justify-between p-4 bg-theme-base/80 backdrop-blur-3xl border-b border-theme-border">
                <button 
                    className="w-12 h-12 flex items-center justify-center bg-theme-panel rounded-full hover:bg-white/10 transition-all border border-theme-border shadow-sm active:scale-95" 
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft size={24} className="text-theme-text" />
                </button>
                <div className="flex items-center gap-3 bg-[var(--theme-accent-primary)]/10 px-4 py-2 rounded-full border border-[var(--theme-accent-primary)]/30">
                     {post.type === 'bancal' ? '🌱' : post.type === 'ajuntament' ? '🏢' : '📜'}
                     <span className="font-black text-[var(--theme-accent-primary)] uppercase tracking-wider text-xs sm:text-sm">
                         Publicació de {displayTown}
                     </span>
                </div>
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

            <main className="max-w-4xl mx-auto w-full flex flex-col pt-8 pb-32 px-4 sm:px-8 relative z-10 selection:bg-[var(--theme-accent-primary)] selection:text-white">
                
                {/* 1. PORTADA DEL LLIBRE / HERO */}
                <div className="relative mb-12 sm:mb-16 group">
                    <div className="absolute inset-0 bg-gradient-to-tr from-[var(--theme-accent-primary)] to-transparent opacity-10 rounded-[2rem] blur-3xl transition-opacity duration-700 group-hover:opacity-20" />
                    
                    <div className="bg-theme-panel border border-theme-border rounded-[2rem] overflow-hidden shadow-2xl relative z-10 transition-transform duration-500 hover:-translate-y-2">
                        {/* Protocol Capucha Integrat */}
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
                        
                        {mediaList.length > 0 ? (
                            <UniversalCard.Media 
                                item={post}
                                cardVariant={post.type || 'mur'}
                                mediaList={mediaList}
                                displayImage={mediaList[0]}
                                displayTitle={post.title || displayAuthor}
                                openViewer={() => {}}
                                navigate={navigate}
                            />
                        ) : (
                            <div className="w-full h-48 sm:h-64 bg-theme-base/50 flex flex-col items-center justify-center border-t border-[var(--border-master)]">
                                <span className="text-[var(--sdp-terracotta)]/40 font-black tracking-widest text-lg md:text-xl uppercase flex flex-col items-center gap-2">
                                     <Tag size={32} />
                                     Sense Contingut Visual
                                </span>
                            </div>
                        )}
                        
                    </div>
                </div>

                {/* 2. CONTINGUT DOCTRINAL / ARTICLE */}
                <article className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-p:font-medium prose-p:leading-relaxed prose-a:text-[var(--theme-link-color)] prose-a:underline prose-a:decoration-2 prose-a:underline-offset-4 prose-a:decoration-[var(--theme-link-decoration)] hover:prose-a:text-[var(--theme-link-hover)] hover:prose-a:decoration-[var(--theme-link-hover)] transition-all prose-li:marker:text-[var(--theme-accent-primary)] html-article-prose bg-theme-panel p-6 sm:p-12 rounded-[2rem] border border-[var(--border-master)] shadow-xl relative z-10">
                    <div className="absolute -top-6 -right-6 text-[10rem] opacity-5 select-none pointer-events-none font-black text-[var(--theme-accent-primary)]">
                        ”
                    </div>
                    
                    {post.title && !post.content?.includes(`# ${post.title}`) && (
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-theme-text mb-4 lg:mb-6 uppercase leading-[0.95] drop-shadow-sm w-full">
                            {post.title}
                        </h1>
                    )}
                    
                    {post.subtitle && (
                        <div className="flex items-center gap-4 mb-8 sm:mb-10 w-full pl-6 border-l-4 border-[var(--theme-accent-primary)] opacity-90 hover:opacity-100 transition-opacity">
                            <h2 className="text-xl sm:text-2xl font-bold text-theme-text opacity-80 leading-snug tracking-tight m-0">
                                {post.subtitle}
                            </h2>
                        </div>
                    )}
                    
                    {post.content ? (
                        <div className="relative z-10 editor-content-display font-medium text-lg lg:text-xl text-theme-text animate-in fade-in duration-700 delay-200" dangerouslySetInnerHTML={{ __html: parseSimpleMarkdown(post.content) }} />
                    ) : (
                        <div className="text-theme-text/50 font-bold italic py-10 text-center animate-pulse">
                            Aquest document només conte memòria visual.
                        </div>
                    )}
                </article>

                {/* 3. SISTEMA D'ETIQUETES - Estil Documental */}
                <div className="mt-12 bg-theme-panel border border-[var(--border-master)] rounded-[2rem] p-8 sm:p-12 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] relative overflow-hidden group">
                     {/* Decorative background flare */}
                     <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[var(--theme-accent-primary)]/5 blur-[100px] rounded-full pointer-events-none transition-transform duration-[2s] group-hover:scale-150" />
                     
                     <div className="flex items-center gap-4 mb-8 relative z-10 pl-6 border-l-4 border-theme-border">
                         <div className="w-12 h-12 rounded-2xl bg-theme-base flex items-center justify-center shadow-inner border border-theme-border/50">
                             <Tag className="text-[var(--theme-accent-primary)]" size={24} />
                         </div>
                         <h3 className="font-black text-2xl tracking-tighter text-theme-text m-0 uppercase">Arxiu de Coneixement</h3>
                     </div>
                     
                     <div className="flex flex-wrap gap-3 mb-10 relative z-10 pl-6">
                         {post.tags && post.tags.length > 0 ? (
                             post.tags.map((tag, idx) => (
                                 <span key={`${tag}-${idx}`} className="px-5 py-2.5 bg-theme-base border border-theme-border hover:border-[var(--theme-accent-primary)]/50 rounded-xl text-sm font-black uppercase tracking-wider text-theme-text shadow-sm transition-colors cursor-default">
                                     {tag}
                                 </span>
                             ))
                         ) : (
                             <span className="text-base font-bold text-theme-text/40 italic">Document pendent de classificació a l'Arxiu.</span>
                         )}
                     </div>
                </div>

            </main>
        </div>
    );
};

export default PostDetail;

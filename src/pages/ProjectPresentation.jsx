import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Edit2, ShieldAlert, Share2 } from 'lucide-react';
import SEO from '../components/SEO';
import GlobalFooter from '../components/GlobalFooter';
import RichTextEditor from '../components/RichTextEditor';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import MediaViewerModal from '../components/MediaViewerModal';

// Es carregarà de forma dinàmica per externalitzar pes de l'arrel
let CachedBookContent = null;

const fetchDefaultBookContent = async () => {
    if (CachedBookContent) return CachedBookContent;
    try {
        const res = await fetch('/assets/llibre-sencer.html');
        if (res.ok) {
            CachedBookContent = await res.text();
            return CachedBookContent;
        }
    } catch (e) {
        console.error("Error fetching default book:", e);
    }
    return "<h1>SÓC DE POBLE (Versió Reduïda)</h1><p>No s'ha pogut carregar el llibre sencer.</p>";
};

const ProjectPresentation = ({ standAlone = true, forcedSlug = null }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isSuperAdmin } = useAuth();

    const [htmlContent, setHtmlContent] = useState('');
    const [pageId, setPageId] = useState(null);
    const [routeSlug, setRouteSlug] = useState('');
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');

    const [isLoadingPage, setIsLoadingPage] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [mediaViewerSrc, setMediaViewerSrc] = useState(null);
    const [mediaViewerImages, setMediaViewerImages] = useState([]);

    const loadFallbackContent = async (fallbackTitle) => {
        const content = await fetchDefaultBookContent();
        setHtmlContent(content);
        setTitle(fallbackTitle);
    };

    const fetchPageContent = useCallback(async (slug) => {
        setIsLoadingPage(true);
        try {
            const { data, error } = await supabase
                .from('cms_pages')
                .select('*')
                .eq('slug', slug)
                .single();

            if (error) {
                if (error.code === 'PGRST116' || error.message?.includes('JSON object requested')) {
                    if (!isSuperAdmin) {
                        if (slug !== '/projecte') {
                            navigate('/mur', { replace: true });
                            return;
                        } else {
                            await loadFallbackContent("Sóc de Poble: El Projecte");
                        }
                    } else {
                        await loadFallbackContent("Nova Pàgina");
                    }
                } else {
                    console.error('Error fetching page (Not 116):', error);
                    await loadFallbackContent("Sóc de Poble: El Projecte");
                }
            } else if (data) {
                setPageId(data.id);
                setHtmlContent(data.html_content || '');
                setTitle(data.title || '');
                setSubtitle(data.subtitle || '');
            }
        } catch (error) {
            console.error('Critical error fetching page:', error);
            await loadFallbackContent("Sóc de Poble: El Projecte");
        } finally {
            setIsLoadingPage(false);
        }
    }, [navigate, isSuperAdmin]);
    useEffect(() => {
        let currentSlug = forcedSlug || location.pathname;
        if (!standAlone && !forcedSlug) {
            currentSlug = '/projecte';
        } else if (currentSlug === '/projecte' || currentSlug === '/manifest') {
            currentSlug = '/projecte';
        }
        setRouteSlug(currentSlug);
        fetchPageContent(currentSlug);
    }, [location.pathname, standAlone, forcedSlug, fetchPageContent]);

    const handleSave = async (updatedHtml) => {
        if (!isSuperAdmin) return;
        setIsSaving(true);
        try {
            const payload = {
                slug: routeSlug,
                title: title || 'Pàgina Sense Títol',
                subtitle: subtitle || '',
                html_content: updatedHtml,
                published_at: new Date().toISOString()
            };

            if (pageId) {
                await supabase.from('cms_pages').update(payload).eq('id', pageId);
            } else {
                const { data } = await supabase.from('cms_pages').insert([payload]).select().single();
                if (data) setPageId(data.id);
            }
            setHtmlContent(updatedHtml);
            setIsEditing(false);
        } catch (err) {
            console.error("Error saving CMS page", err);
            alert("Error al guardar: " + err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const HeroBanner = (
        <div className="relative w-full aspect-video z-0 bg-black min-h-[300px] border-b-4 border-[var(--theme-accent-primary)] shadow-[0_10px_30px_rgba(255,107,0,0.1)] group flex flex-col items-center justify-center">
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes bategant {
                    0%, 100% { color: #f97316; text-shadow: 0 0 15px rgba(249,115,22,0.6); opacity: 1; transform: scale(1); }
                    50% { color: #ffffff; text-shadow: 0 0 5px rgba(255,255,255,0.2); opacity: 0.7; transform: scale(0.98); }
                }
                .animate-bategant {
                    animation: bategant 1.5s ease-in-out infinite;
                }
            `}} />
            
            <img 
                src="/assets/banners/hero_nano_final.png" 
                alt="Sóc de Poble Banner" 
                className="absolute inset-0 w-full h-full object-cover opacity-60"
                onClick={() => {
                    const bannerSrc = "/assets/banners/hero_nano_final.png";
                    const allImagesArray = Array.from(document.querySelectorAll('.app-cms-content img')).map(img => img.src);
                    setMediaViewerImages([bannerSrc, ...allImagesArray]);
                    setMediaViewerSrc(bannerSrc);
                }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none" />
            
            <div className="absolute top-4 right-4 flex gap-2 z-50">
                {isSuperAdmin && (
                    <button 
                        onClick={() => setIsEditing(!isEditing)} 
                        className="bg-black/50 backdrop-blur-md text-white p-3 rounded-xl border border-white/10 shadow-lg hover:bg-[var(--theme-accent-primary)] hover:border-transparent transition-all"
                        title={isEditing ? "Tancar edició" : "Editar Pàgina (SuperAdmin)"}
                    >
                        {isEditing ? <ArrowLeft size={20} /> : <Edit2 size={20} />}
                    </button>
                )}
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center pt-10">
                <img 
                    src="/assets/master/logo_socdepoble_white_clean.png" 
                    alt="Logo Sóc de Poble" 
                    className="h-16 sm:h-20 w-auto mb-6 opacity-90 drop-shadow-[0_0_15px_rgba(249,115,22,0.5)] object-contain" 
                />
                
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-black text-white text-center tracking-tight leading-none mb-3 drop-shadow-2xl">
                    {title || "SÓC DE POBLE"}
                </h1>
                
                <p className="text-lg sm:text-xl text-gray-300 font-medium tracking-wide mb-8 drop-shadow-md pb-4">
                    {subtitle || "Portal de Pobles Connectats"}
                </p>

                <div className="flex flex-col items-center gap-6">
                    <button 
                        onClick={() => navigate('/chats')}
                        className="font-['Inter_Tight',sans-serif] text-[13px] font-black uppercase tracking-[0.2em] animate-bategant select-none hover:scale-105 active:scale-95 transition-transform"
                    >
                        CONNECTAR
                    </button>
                    
                    <button 
                        className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white uppercase tracking-widest transition-colors opacity-70 hover:opacity-100"
                        title="Compartir aquesta pàgina"
                        onClick={() => {
                            if (navigator.share) {
                                navigator.share({ title: 'Sóc de Poble', text: 'Descobreix la Xarxa Rural de Pobles Connectats', url: window.location.href });
                            }
                        }}
                    >
                        Compartir <Share2 size={14} />
                    </button>
                </div>
            </div>
        </div>
    );

    let ActualContent;
    if (isLoadingPage) {
        ActualContent = (
            <div className="w-full flex-1 flex flex-col items-center justify-center p-10 min-h-[50vh]">
                <div className="animate-pulse flex flex-col items-center gap-4 w-full max-w-2xl">
                    <div className="h-8 bg-black/10 dark:bg-white/10 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-black/10 dark:bg-white/10 rounded w-full"></div>
                    <div className="h-4 bg-black/10 dark:bg-white/10 rounded w-full"></div>
                    <div className="h-4 bg-black/10 dark:bg-white/10 rounded w-5/6"></div>
                    <div className="h-4 bg-black/10 dark:bg-white/10 rounded w-full mt-4"></div>
                    <div className="h-4 bg-black/10 dark:bg-white/10 rounded w-4/5"></div>
                </div>
            </div>
        );
    } else {
        ActualContent = (
            <div className="w-full flex-1 flex flex-col items-center z-10 -mt-2 sm:mt-0 sm:px-4 pb-10">
                {(isSuperAdmin && isEditing) ? (
                    <RichTextEditor 
                        content={htmlContent} 
                        onChange={setHtmlContent} 
                        onSave={handleSave} 
                        isSaving={isSaving}
                        editable={true}
                    />
                ) : (
                    <div className="flex-1 w-full max-w-4xl mx-auto custom-scrollbar">
                        <div 
                            className="app-cms-content bg-transparent text-[var(--text-main)] focus:outline-none min-h-[60vh] p-6 lg:p-10 w-full
                                [&>h1]:text-3xl [&>h1]:md:text-4xl [&>h1]:font-black [&>h1]:uppercase [&>h1]:tracking-tight [&>h1]:text-center [&>h1]:mb-6
                                [&>h2]:text-xl [&>h2]:md:text-2xl [&>h2]:font-bold [&>h2]:text-[var(--theme-accent-secondary)] [&>h2]:uppercase [&>h2]:mb-4 [&>h2]:mt-8
                                [&>h3]:text-lg [&>h3]:font-bold [&>h3]:mb-2 [&>h3]:mt-6
                                [&>h4]:text-base [&>h4]:font-bold [&>h4]:uppercase [&>h4]:mb-2 [&>h4]:mt-4 [&>h4]:text-[var(--text-muted)]
                                [&>p]:text-lg [&>p]:md:text-xl [&>p]:leading-relaxed [&>p]:mb-6 text-justify
                                [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-6 [&>ol]:text-lg [&>ol]:md:text-xl
                                [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-6 [&>ul]:text-lg [&>ul]:md:text-xl
                                [&_li]:mb-1 [&_li>p]:m-0
                                [&_blockquote]:border-l-4 [&_blockquote]:border-[var(--theme-accent-primary)] [&_blockquote]:pl-6 [&_blockquote]:py-4 [&_blockquote]:pr-4 [&_blockquote]:my-8 [&_blockquote]:mx-0 [&_blockquote]:bg-[var(--bg-panel)] [&_blockquote]:rounded-r-2xl
                                [&_blockquote_p]:text-xl [&_blockquote_p]:md:text-2xl [&_blockquote_p]:italic [&_blockquote_p]:font-medium [&_blockquote_p]:text-[var(--text-main)] [&_blockquote_p]:mb-0
                                [&_img]:rounded-2xl [&_img]:border [&_img]:border-[var(--border-master)] [&_img]:my-6 [&_img]:w-full [&_img]:shadow-[0_4px_20px_rgba(0,0,0,0.5)]
                                [&_a]:text-[var(--theme-accent-primary)] [&_a]:underline hover:[&_a]:text-[var(--theme-accent-secondary)]
                                selection:bg-[var(--theme-accent-primary)] selection:text-white"
                            dangerouslySetInnerHTML={{ __html: htmlContent }}
                            onClick={(e) => {
                                if (e.target.tagName === 'IMG') {
                                    const bannerSrc = "/assets/banners/hero_nano_final.png";
                                    const allImagesArray = Array.from(document.querySelectorAll('.app-cms-content img')).map(img => img.src);
                                    const combinedImages = [bannerSrc, ...allImagesArray];
                                    
                                    setMediaViewerImages(combinedImages);
                                    setMediaViewerSrc(e.target.src);
                                }
                            }}
                        />
                    </div>
                )}
            </div>
        );
    }

    if (!standAlone) {
        return (
            <>
                {HeroBanner}
                {ActualContent}
            </>
        );
    }

    return (
        <div className="h-[100dvh] bg-[var(--bg-app)] text-[var(--text-main)] flex flex-col w-full overflow-hidden">
            <SEO
                title={title || "Sóc de Poble: El Llibre"}
                description="Connectant l'Espanya Buidada amb tecnologia d'avantguarda."
                url={routeSlug}
            />
            
            <div className="sticky top-0 w-full bg-[var(--bg-panel)]/90 backdrop-blur-md border-b border-[var(--border-master)] p-4 flex items-center gap-4 z-50">
                <button 
                    onClick={() => navigate(-1)} 
                    className="p-2 border border-[var(--border-master)] rounded-xl hover:bg-[var(--theme-accent-primary)] hover:text-white transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>
                <h3 className="text-xl font-bold uppercase tracking-tight m-0 text-ellipsis overflow-hidden whitespace-nowrap">
                    {title || "DOCUMENTACIÓ OFICIAL"}
                </h3>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {HeroBanner}
                {ActualContent}
                {standAlone && <GlobalFooter />}
            </div>
            
            <MediaViewerModal 
                isOpen={!!mediaViewerSrc} 
                onClose={() => {
                    setMediaViewerSrc(null);
                    setMediaViewerImages([]);
                }} 
                src={mediaViewerSrc} 
                images={mediaViewerImages}
                onNavigate={(newSrc) => setMediaViewerSrc(newSrc)}
                title={title || "Sóc de Poble Visuals"} 
            />
        </div>
    );
};

export default ProjectPresentation;

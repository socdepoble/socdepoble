import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Edit2, ShieldAlert } from 'lucide-react';
import SEO from '../components/SEO';
import GlobalFooter from '../components/GlobalFooter';
import RichTextEditor from '../components/RichTextEditor';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import MediaViewerModal from '../components/MediaViewerModal';

// El contingut per defecte per a la presentació del projecte
const DefaultBookContent = `
    <h1 class="uppercase text-[var(--theme-accent-primary)] font-black text-center w-full block">SÓC DE POBLE</h1>
    <h2 class="italic opacity-90 text-center w-full block mt-0" style="margin-top:0">Portal de Pobles Connectats</h2>
    <p class="font-bold text-center">Una XARXA SOCIAL DESCENTRALITZADA de PROGRAMARI LLIURE, per CONNECTAR i GEOLOCALITZAR recursos d'utilitat social, compartint informació, experiències i idees que faciliten el desenvolupament sostenible i tecnològic en entorns rurals, per posar en valor els recursos locals i mostrar l'atractiu dels pobles com a llocs on viure i treballar.</p>
    
    <h2 class="text-[var(--theme-accent-primary)] mt-12">SOBIRANIA DIGITAL</h2>
    <img src="/assets/infographies/art_sobirania_v2.png" alt="Sobirania Digital" class="w-full rounded-2xl border border-[var(--border-master)] my-6" />
    <p>La dada com a arrel, no com a mercaderia. En el Mas Digital, tu eres el propietari de la teua informació. Apostem per connexions horitzontals peer-to-peer, eliminant intermediaris extractius i garantint que el bategat del teu poble romanga privat i sobirà.</p>
    
    <h2 class="text-[var(--theme-accent-primary)] mt-12">DADES AMB TRELLAT</h2>
    <img src="/assets/infographies/art_trellat_v3.png" alt="Dades amb Trellat" class="w-full rounded-2xl border border-[var(--border-master)] my-6" />
    <p>Privacitat KM 0. Sols recollim allò que és essencial per a la convivència i el comerç local. Les teues dades no viatgen a servidors desconeguts, sinó que s'arrelen en el territori per generar utilitat real i protegir el futur rural.</p>

    <h2 class="text-[var(--theme-accent-primary)] mt-12">MEMÒRIA VIVA</h2>
    <img src="/assets/infographies/art_codig_v3.png" alt="Memòria Viva" class="w-full rounded-2xl border border-[var(--border-master)] my-6" />
    <p>Un bategat que uneix generacions a través del codi i la saviesa popular. Garanteix que la intel·ligència artificial no oblide d'on venim. Implementem protocols que dignifiquen el passat mentre construïm el futur digital.</p>
    
    <h2 class="text-[var(--theme-accent-primary)] mt-12">LLICÈNCIA OBERTA</h2>
    <blockquote>
        <p>Aquest sistema és de codi obert per a ús comunitari i educatiu. L'ús comercial està subjecte a llicència del Mestre.</p>
    </blockquote>

    <h2 class="text-[var(--theme-accent-primary)] mt-12">IDENTITATS DEL MAS</h2>
    <h3>SÓC DE POBLE</h3>
    <p>Plataforma bategant per a la memòria viva i la governança d'un territori sobirà.</p>
    <h3>EL RENTONAR</h3>
    <p>Entitat que promou i empara aquest projecte des de la resistència cultural.</p>
    <h3>JAVI LLINARES</h3>
    <p>Responsable de la realització, disseny i coordinació. Mestre darrere del Mas Digital.</p>

    <h1 class="text-[var(--theme-accent-primary)] mt-12">LA IAIA MARIA</h1>
    <img src="/assets/infographies/art_iaia_v4.png" alt="La Iaia Maria" class="w-full rounded-2xl border border-[var(--border-master)] my-6" />
    <blockquote>
        <p>La intel·ligència central del Mas. No és una IA freda de Silicon Valley, sinó la "saviesa de l'àvia" arrelada a la terra. Un sistema multi-agent dissenyat per a protegir, educar i preservar la identitat rural.</p>
    </blockquote>
    <h3>LA TIA MARIA</h3>
    <p>Agent de proximitat. Ofereix receptes locals, consells vitals i conversa arrelada.</p>
    <h3>EL CRONISTA</h3>
    <p>Documentalista del Mur. Genera resums de l'activitat del poble i preserva l'hemeroteca.</p>
    <h3>L'ULL DEL MESTRE</h3>
    <p>Visió multimodal. Identifica eines agrícoles, plantes, plagues i patrimoni cultural.</p>
    <h3>NANO BANANA</h3>
    <p>Generació multimèdia automàtica i protocols de simbiosi artística a la comunitat.</p>

    <h2 class="text-[var(--theme-accent-primary)] mt-12">ARQUITECTURA REVOLUCIONÀRIA</h2>
    <h3>Eg-walker CRDT</h3>
    <p>Sincronització de graf d'esdeveniments. Convergència determinista en local que elimina la necessitat de base de dades central.</p>
    <h3>Xarxa Rhizome</h3>
    <p>Protocol gossip. Els telèfons dels veïns formen la malla de comunicació.</p>

    <h2 class="text-[var(--theme-accent-primary)] mt-12">AVÍS LEGAL I DRETS DIGITALS</h2>
    <p><strong>1. Identitat Bategant</strong><br>LSSI-CE: Responsable Sobirà F. Javier Llinares García (21476359V). El Mas Central es troba registrat a la Calle Sant Isidre Llaurador, 16. Connecta via socdepoble@socdepoble.org.</p>
    <p><strong>2. Sobirania de l'Usuari</strong><br>Sols recollim el necessari per al bategat del node. Pots descarregar tota la teua memòria digital o fulminar el teu node de forma autònoma enviant un missatge al Mestre.</p>
`;

const ProjectPresentation = ({ standAlone = true }) => {
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

    const fetchPageContent = useCallback(async (slug) => {
        setIsLoadingPage(true);
        try {
            const { data, error } = await supabase
                .from('cms_pages')
                .select('*')
                .eq('slug', slug)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    // Not found
                    if (!isSuperAdmin) {
                        if (slug !== '/projecte') {
                            navigate('/mur', { replace: true });
                            return;
                        } else {
                            // Fallback al DefaultBookContent public per sempre a /projecte
                            setHtmlContent(DefaultBookContent);
                            setTitle("Sóc de Poble: El Projecte");
                        }
                    } else {
                        // Super Admin
                        setHtmlContent(DefaultBookContent);
                        setTitle("Nova Pàgina");
                    }
                } else {
                    console.error('Error fetching page:', error);
                }
            } else if (data) {
                setPageId(data.id);
                setHtmlContent(data.html_content || '');
                setTitle(data.title || '');
                setSubtitle(data.subtitle || '');
            }
        } catch (error) {
            console.error('Critical error fetching page:', error);
        } finally {
            setIsLoadingPage(false);
        }
    }, [navigate, isSuperAdmin]);

    useEffect(() => {
        let currentSlug = location.pathname;
        if (currentSlug === '/projecte' || currentSlug === '/manifest') {
            currentSlug = '/projecte';
        }
        setRouteSlug(currentSlug);
        fetchPageContent(currentSlug);
    }, [location.pathname, fetchPageContent]);

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
        <div className="relative w-full aspect-video z-0 bg-black min-h-[300px] border-b-4 border-[var(--theme-accent-primary)] shadow-[0_10px_30px_rgba(255,107,0,0.1)] group">
            <img 
                src="/assets/banners/hero_nano_final.png" 
                alt="Sóc de Poble Banner" 
                className="w-full h-full object-cover opacity-80"
                onClick={() => {
                    const bannerSrc = "/assets/banners/hero_nano_final.png";
                    const allImagesArray = Array.from(document.querySelectorAll('.app-cms-content img')).map(img => img.src);
                    setMediaViewerImages([bannerSrc, ...allImagesArray]);
                    setMediaViewerSrc(bannerSrc);
                }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
            
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

            <div className="absolute bottom-0 inset-x-0 p-8 flex flex-col items-center justify-end z-10">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white text-center tracking-tight leading-none mb-4 drop-shadow-2xl">
                    {title || "SÓC DE POBLE"}
                </h1>
                {(subtitle || routeSlug === '/projecte') && (
                    <p className="text-xl sm:text-2xl text-[var(--theme-accent-primary)] font-bold italic text-center drop-shadow-lg">
                        {subtitle || "Portal de Pobles Connectats"}
                    </p>
                )}
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

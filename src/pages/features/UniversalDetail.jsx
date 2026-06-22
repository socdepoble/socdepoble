import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NanoLoader from '../../components/ui/NanoLoader';
import ErrorBoundary from '../../components/core/ErrorBoundary';
import UniversalCardHeader from '../../components/ui/universal-card/UniversalCard.Header';
import UniversalCardMedia from '../../components/ui/universal-card/UniversalCard.Media';
import MediaViewerModal from '../../components/modals/MediaViewerModal';
import { ArrowLeft, Share2, Plus, Globe, MessageCircle, Book, Minimize, Maximize, AlertTriangle } from 'lucide-react';
import SEO from '../../components/core/SEO';
import { useTranslation } from 'react-i18next';
import { useModal } from '../../app/context/ModalContext';
import { MOCK_MARKET_ITEMS, MOCK_TOWNS, MOCK_FEED } from '../../data';
import ContentWithShortcodes from '../../components/core/ContentWithShortcodes';

const UniversalDetail = ({ type: propType, slug: propSlug }) => {
  const params = useParams();
  const initialType = propType || params.type;
  const slug = propSlug || params.slug || params.id;
  const [effectiveType, setEffectiveType] = useState(initialType === 'auto' ? 'post' : initialType);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { openTranslationModal } = useModal();
  
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isTocOpen, setIsTocOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mediaViewerSrc, setMediaViewerSrc] = useState(null);
  const [mediaViewerImages, setMediaViewerImages] = useState([]);
  const [translating] = useState(false);
  const totalPages = 1;

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.warn("Fullscreen API Error");
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);
      try {
        let itemData = null;
        let newType = initialType;

        if (initialType === 'auto') {
          itemData = MOCK_FEED.find(i => String(i.id) === String(slug) || i.slug === slug || String(i.id) === `post-${slug}`);
          if (itemData) newType = itemData.type || 'post';
          if (!itemData) {
            itemData = MOCK_MARKET_ITEMS.find(i => String(i.id) === String(slug) || i.slug === slug);
            if (itemData) newType = 'mercat';
          }
          if (!itemData) {
            itemData = MOCK_TOWNS.find(i => String(i.id) === String(slug) || i.slug === slug);
            if (itemData) newType = 'pobles';
          }
        } else if (initialType === 'mercat' || initialType === 'market') {
          itemData = MOCK_MARKET_ITEMS.find(i => String(i.id) === String(slug));
        } else if (initialType === 'pobles') {
          itemData = MOCK_TOWNS.find(i => String(i.id) === String(slug));
        } else if (initialType === 'entitat' || initialType === 'empreses' || initialType === 'gent' || initialType === 'grup') {
          itemData = MOCK_FEED.find(i => String(i.id) === String(slug) || i.author_id === slug);
        } else {
          itemData = MOCK_FEED.find(i => String(i.id) === String(slug));
        }
        
        if (itemData) {
          setItem(itemData);
          setEffectiveType(newType);
          setLoading(false);
          return;
        }

        throw new Error("Item not found in mock data.");
      } catch (err) {
        console.error("Error loading detail:", err);
        setItem(null);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [initialType, slug]);

  const type = effectiveType;

  if (loading) {
    return <NanoLoader message="Carregant detalls..." />;
  }

  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center min-h-[50vh]">
          <AlertTriangle size={64} className="text-gray-900 opacity-50 mb-6" />
          <h2 className="text-2xl font-bold mb-4 m-0">No S'ha Trobat</h2>
          <p className="text-gray-900 opacity-70 max-w-md mb-8 font-medium m-0">No hem pogut trobar la informació de l'article que busques o ja no està disponible.</p>
          <button onClick={() => navigate(-1)} aria-label="Tornar arrere" className="py-4 px-8 rounded-full border border-gray-200 text-gray-900 font-bold uppercase tracking-widest text-xs hover:bg-gray-50 active:scale-95 transition-all">
              TORNAR ARRERE
          </button>
      </div>
    );
  }

  const buildSchema = () => {
    if (!item) return null;
    let schema = { "@context": "https://schema.org" };
    const currentUrl = window.location.href;
    const itemName = item.title || item.name || 'Sóc de Poble Item';
    const itemDesc = item.description || item.subtitle || 'Detalls a Sóc de Poble';
    const images = item.images || item.image_url || item.media || item.image;
    let itemImage = '';
    
    if (Array.isArray(images) && images.length > 0) {
      itemImage = images[0].url || images[0];
    } else if (typeof images === 'string') {
      itemImage = images;
    }

    if (type === 'mercat' || type === 'market') {
      schema = {
        ...schema,
        "@type": "Product",
        "name": itemName,
        "description": itemDesc,
        "image": itemImage,
        "offers": {
          "@type": "Offer",
          "price": item.price || "0.00",
          "priceCurrency": "EUR",
          "availability": item.stock_status === 'instock' ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          "url": currentUrl
        }
      };
    } else if (type === 'pobles') {
      schema = { ...schema, "@type": "City", "name": itemName, "description": itemDesc, "image": itemImage, "url": currentUrl };
    } else if (type === 'entitat' || type === 'empreses') {
      schema = { ...schema, "@type": "LocalBusiness", "name": itemName, "description": itemDesc, "image": itemImage, "url": currentUrl };
    } else {
      schema = { ...schema, "@type": "Article", "headline": itemName, "description": itemDesc, "image": itemImage, "datePublished": item.created_at, "dateModified": item.updated_at || item.created_at, "url": currentUrl };
    }
    return schema;
  };

  const itemName = item?.title || item?.name || 'Sóc de Poble Item';
  const itemDesc = item?.content || item?.description || item?.subtitle || item?.short_bio || 'Visita aquest detall a Sóc de Poble';

  let extractedImages = [];
  if (item?.images && Array.isArray(item.images)) extractedImages = item.images;
  else if (item?.image_url) extractedImages = Array.isArray(item.image_url) ? item.image_url : [item.image_url];
  else if (item?.avatar_url) extractedImages = [item.avatar_url];
  else if (item?.image) extractedImages = [item.image];
  
  const imagesList = extractedImages;
  let resolvedImages = [];
  if (Array.isArray(imagesList)) {
    resolvedImages = imagesList.map(img => {
      const src = img.url || img;
      if (typeof src === 'string' && !src.startsWith('/')) {
        return `/assets/uploads/empresa/soc-de-poble/mercat/samarreta-soc-de-poble/${src}`;
      }
      return src;
    });
  }
  
  const itemImage = resolvedImages.length > 0 ? resolvedImages[0] : '';
  const logoSrc = item?.logo_url || item?.avatar_url || '/assets/system/ui/logo-socdepoble-rect-negre.svg';
  const schemaData = buildSchema();

  const rawDesc = itemDesc || '';
  const extractedTags = (rawDesc.match(/#[a-zA-Z0-9_À-ÿ]+/g) || []).map(t => t.replace(/^#+/, ''));
  const allTags = [...new Set([...(item?.tags || []).map(t => t.replace(/^#+/, '')), ...extractedTags])];
  const cleanedExcerpt = rawDesc.replace(/#[a-zA-Z0-9_À-ÿ]+/g, '').replace(/[\r\n]{3,}/g, '\n\n').trim();

  return (
    <div className="flex flex-col h-full w-full bg-white animate-in fade-in relative">
        <SEO title={`${itemName} - Sóc de Poble`} description={cleanedExcerpt} image={itemImage} structuredData={schemaData} type={type === 'mercat' || type === 'market' ? 'product' : 'article'} />
  
        <div role="region" aria-label="Capçalera de Secció" className="z-sticky w-full max-w-full overflow-hidden shadow-lg bg-[#4F46E5] text-white transition-all shrink-0 touch-manipulation border-b border-black/10">
            <div className="flex items-center justify-between min-h-[56px] px-2 sm:px-4 w-full max-w-7xl mx-auto overflow-hidden">
                
                <div className="flex items-center justify-start gap-1 shrink-0">
                    <button onClick={() => navigate(-1)} className="flex items-center justify-center min-h-[44px] w-[44px] rounded-xl hover:bg-white/20 active:scale-95 transition-colors touch-manipulation shrink-0" aria-label="Tornar arrere">
                        <ArrowLeft size={20} strokeWidth={2.5} />
                    </button>
                    
                    <button className={`flex items-center justify-center gap-1.5 min-h-[44px] px-3 sm:px-4 rounded-xl hover:bg-white/20 active:scale-95 transition-colors touch-manipulation font-bold uppercase text-sm ${isTocOpen ? 'bg-white/20 opacity-100 shadow-inner' : ''}`} aria-label={t('project.open_index', "Obrir Índex i Pàgines")} title={t('project.open_index', "Obrir Índex i Pàgines")} onClick={() => setIsTocOpen(!isTocOpen)}>
                        <Book size={20} strokeWidth={2.5} />
                        <span className="tabular-nums font-black tracking-widest whitespace-nowrap opacity-90">
                            1/{totalPages}
                        </span>
                    </button>

                    <button className="hidden md:flex items-center justify-center min-h-[44px] w-[44px] hover:bg-white/20 rounded-xl active:scale-95 touch-manipulation shrink-0" title={isFullscreen ? "Surt de Pantalla Completa" : "Llegit a Pantalla Completa"} onClick={toggleFullscreen}>
                        {isFullscreen ? <Minimize size={20} strokeWidth={2.5} /> : <Maximize size={20} strokeWidth={2.5} />}
                    </button>
                </div>

                <div className="flex items-center justify-center shrink-0 mx-2">
                </div>

                <div className="flex items-center justify-end gap-1 sm:gap-2 flex-1 min-w-0 overflow-x-auto no-scrollbar scroll-smooth">
                    <button className={`flex items-center justify-center gap-1.5 min-h-[44px] px-2 sm:px-3 rounded-xl hover:bg-white/20 active:scale-95 transition-colors touch-manipulation font-bold uppercase text-sm shrink-0 ${translating ? "text-amber-300 animate-pulse" : ""}`} aria-label="Traduir Pàgina" disabled={translating} onClick={() => openTranslationModal({ postId: item?.id || slug, title: itemName })}>
                        {translating ? <Globe size={20} strokeWidth={2.5} className="animate-spin" /> : <img src="https://upload.wikimedia.org/wikipedia/commons/d/d7/Google_Translate_logo.svg" alt="Google Translate" className="w-[20px] h-[20px] object-contain drop-shadow-sm brightness-110" />}
                        <span className="hidden xl:inline tracking-wider">{t('project.translate', 'Traduir')}</span>
                    </button>

                    <button className="flex items-center justify-center gap-2 min-h-[44px] px-2 sm:px-3 hover:bg-white/20 rounded-xl active:scale-95 touch-manipulation font-bold uppercase text-sm shrink-0" onClick={() => navigate('/chats/socdepoble')}>
                        <MessageCircle size={20} /><span className="hidden xl:inline tracking-wider">{t('project.comment', 'Comentar')}</span>
                    </button>

                    <button className="flex items-center justify-center gap-2 min-h-[44px] px-2 sm:px-3 hover:bg-white/20 rounded-xl active:scale-95 touch-manipulation font-bold uppercase text-sm shrink-0" onClick={() => {
        if (navigator.share) navigator.share({ title: 'Sóc de Poble', url: window.location.href });
      }}>
                        <Share2 size={20} /><span className="hidden xl:inline tracking-wider">{t('project.share', 'Compartir')}</span>
                    </button>

                    <button className="btn-action-primary" aria-label={t('common.add', 'Connectar')} onClick={() => navigate('/connectar')}>
                        <Plus size={20} strokeWidth={3} />
                        <span className="hidden sm:inline tracking-wider">{t('common.add', 'Connectar')}</span>
                    </button>
                </div>

            </div>
        </div>

        <div role="region" aria-label="Contingut Principal" className="flex-1 min-h-0 w-full relative flex flex-col overflow-y-auto overflow-x-hidden custom-scrollbar pb-[max(env(safe-area-inset-bottom),5rem)]">
            {(resolvedImages.length > 0 || item?.video_url || item?.videoUrl) && (
              <div className='w-full relative z-0 bg-white overflow-hidden flex items-center justify-center shrink-0'>
                <UniversalCardMedia cardVariant={type} mediaList={resolvedImages} displayImage={itemImage} displayTitle={itemName} videoUrl={item?.video_url || item?.videoUrl} openViewer={config => {
                  setMediaViewerImages(config.images || resolvedImages);
                  setMediaViewerSrc(config.src || resolvedImages[0]);
                }} aspectMode="auto" />
              </div>
            )}

            <div className="sticky top-0 z-[190] w-full shrink-0 shadow-sm">
                <UniversalCardHeader item={item} cardVariant={type} displayTown={item?.town_name || item?.town || (item?.seller === 'Sóc de Poble' || item?.author_name === 'Sóc de Poble' ? 'La Torre de les Maçanes' : '')} displayAuthor={item?.seller || item?.author_name || 'Sóc de Poble'} avatarSrc={logoSrc} avatarRole={item?.author_role} isOfficial={item?.official || item?.is_official} displayDate={item?.created_at ? new Date(item.created_at).toLocaleDateString('ca-ES') : ''} displayTime={item?.time || (item?.created_at ? new Date(item.created_at).toLocaleTimeString('ca-ES', { hour: '2-digit', minute: '2-digit' }) : '')} isPageHeader={true} />
            </div>

            <section className='w-full flex flex-col items-center justify-center pb-5 pt-8 bg-white rounded-b-[2.5rem] shadow-sm mb-0 relative z-10 shrink-0'>
                <div className="w-full flex flex-col items-center justify-center px-6 relative group">
                    <img src="/assets/system/ui/logo-socdepoble-rect-negre.svg" alt="Logo Sóc de Poble" className="h-24 sm:h-32 w-auto mb-6 object-contain transition-all" />
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-center tracking-tight leading-none uppercase mb-0 mt-2 max-w-4xl w-full break-words">
                        {itemName}
                    </h1>
                </div>
            </section>

            <div className="max-w-4xl mx-auto px-6 md:px-12 w-full shrink-0 flex-1">
                {(item?.post_subtitle || item?.subtitle) && (
                  <h2 className="text-2xl md:text-3xl font-bold uppercase my-[30px] text-center w-full break-words m-0">
                      {item.post_subtitle || item.subtitle}
                  </h2>
                )}
                <ErrorBoundary>
                    <div className="w-full">
                        <ContentWithShortcodes content={cleanedExcerpt} />

                        {allTags.length > 0 && (
                          <div className="w-full flex justify-center md:justify-start items-center gap-2 mb-12 flex-wrap">
                              {allTags.map((tag, index) => {
                                const cleanTagStr = tag.replace(/^#+/, '');
                                const bgClasses = ['bg-sky-100 text-sky-700', 'bg-orange-100 text-orange-600', 'bg-gray-100 text-gray-900'];
                                const colorClass = bgClasses[index % bgClasses.length];
                                return (
                                  <div key={cleanTagStr} className={`text-[13px] md:text-[14px] font-black tracking-wide px-4 py-2 rounded-full ${colorClass}`}>
                                      {cleanTagStr}
                                  </div>
                                );
                              })}
                          </div>
                        )}

                        {(type === 'mercat' || type === 'market') && (
                          <div className="mt-16 flex flex-col gap-6">
                              {item.variations && item.variations.length > 0 ? item.variations.map((variation, idx) => {
                                const resolvedThumb = variation.image ? variation.image.startsWith('/') ? variation.image : `/assets/uploads/empresa/soc-de-poble/mercat/samarreta-soc-de-poble/${variation.image}` : null;
                                const isVariationOut = variation.stock_status && (variation.stock_status.toLowerCase() === 'esgotat' || variation.stock_status.toLowerCase() === 'agotado');
                                return (
                                  <div key={idx} className='flex flex-col md:flex-row items-center justify-between p-6 sm:p-8 bg-white rounded-3xl border border-gray-200 shadow-sm gap-6 hover:border-orange-500 transition-colors'>
                                      <div className="flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-left gap-4 md:gap-6 w-full md:w-auto">
                                          {resolvedThumb && (
                                            <div className='w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-2xl overflow-hidden border border-gray-200 shadow-md bg-gray-50 flex items-center justify-center'>
                                                <img src={resolvedThumb} alt={variation.name} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                                            </div>
                                          )}
                                          <div className="flex flex-col">
                                              <h2 className="text-xl sm:text-2xl font-bold mb-1 uppercase tracking-tight leading-tight m-0">{variation.name}</h2>
                                              {variation.description && <p className="text-sm opacity-80 mb-3 max-w-sm m-0">{variation.description}</p>}
                                              <span className="text-xs sm:text-xs uppercase tracking-widest font-bold opacity-50 bg-gray-50 px-3 py-1 rounded-full w-max mx-auto sm:mx-0 mt-3 block">
                                                  Venedor: {item.seller || item.author_name || 'Desconegut'}
                                              </span>
                                          </div>
                                      </div>
                                      <div className="flex flex-col items-center md:items-end shrink-0 w-full md:w-auto mt-4 md:mt-0">
                                          <span className='text-3xl sm:text-4xl font-black text-orange-500 mb-3'>
                                              {variation.price}
                                          </span>
                                          {isVariationOut ? (
                                            <button disabled className="w-full md:w-auto px-8 py-4 sm:py-3 bg-red-500 text-white font-black uppercase tracking-widest rounded-xl cursor-not-allowed opacity-50 whitespace-nowrap">
                                                Esgotat
                                            </button>
                                          ) : (
                                            <button className="w-full md:w-auto px-8 py-4 sm:py-3 bg-orange-500 text-white font-black uppercase tracking-widest rounded-xl hover:scale-105 active:scale-95 transition-all shadow-sm whitespace-nowrap">
                                                Afegeix al Cabàs
                                            </button>
                                          )}
                                      </div>
                                  </div>
                                );
                              }) : (
                                <div className='flex flex-col items-center justify-center p-8 bg-white rounded-3xl border border-gray-200 shadow-sm'>
                                    <span className='text-4xl font-black text-orange-500 mb-2'>
                                        {item.price ? typeof item.price === 'number' ? `${item.price.toFixed(2)}€` : item.price : 'Consultar'}
                                    </span>
                                    <span className="text-xs uppercase tracking-widest font-bold opacity-50 mb-6 block">
                                        Venedor: {item.seller || item.author_name || 'Desconegut'}
                                    </span>
                                    {item.stock_status && (item.stock_status.toLowerCase() === 'esgotat' || item.stock_status.toLowerCase() === 'agotado') ? (
                                      <button disabled className="w-full sm:w-auto px-10 py-4 bg-red-500 text-white font-black uppercase tracking-widest rounded-xl cursor-not-allowed opacity-50 shadow-sm">
                                          Esgotat
                                      </button>
                                    ) : (
                                      <button className="w-full sm:w-auto px-10 py-4 bg-orange-500 text-white font-black uppercase tracking-widest rounded-xl hover:scale-105 active:scale-95 transition-all shadow-sm">
                                          Afegeix al Cabàs
                                      </button>
                                    )}
                                </div>
                              )}
                          </div>
                        )}
                    </div>
                </ErrorBoundary>
            </div>
        </div>

        {!!mediaViewerSrc && (
          <MediaViewerModal isOpen={true} onClose={() => {
            setMediaViewerSrc(null);
            setMediaViewerImages([]);
          }} src={mediaViewerSrc} images={mediaViewerImages} imageDescriptions={item?.image_descriptions || []} onNavigate={newSrc => setMediaViewerSrc(newSrc)} title={itemName || "Sóc de Poble Visuals"} />
        )}
    </div>
  );
};
export default UniversalDetail;
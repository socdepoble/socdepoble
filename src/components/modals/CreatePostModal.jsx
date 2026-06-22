import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../app/context/AuthContext';
import { supabaseService } from '../../core/services/supabaseService';
import { hapticService } from '../../core/services/hapticService';
import { iaiaService } from '../../core/services/iaiaService';
import { logger } from '../../utils/logger';
import { ArrowLeft, BookOpen, Minimize2, Maximize2, X, Sparkles, Loader2 } from 'lucide-react';
const RichTextEditor = lazy(() => import('../ui/RichTextEditor'));
import { useMountTransition } from '../../hooks/useMountTransition';
import './CreatePostModal.css';

// Placeholder or mock for CaptureStudio if it's missing in imports but used
import CaptureStudio from './CaptureStudio'; // Assuming it might be here or global

const PREDEFINED_TAGS = ['Esdeveniment', 'Avís', 'Consulta', 'Proposta'];

const CreatePostModal = ({
  isOpen,
  onClose,
  initialPobles = [],
  editMode = false,
  postData = null,
  initialFile = null
}) => {
  const { t } = useTranslation();
  const { user, profile, isAdmin } = useAuth();
  
  const [content, setContent] = useState(editMode && postData ? postData.content : '');
  const [selectedTowns, setSelectedTowns] = useState(editMode && postData ? postData.town_ids || [postData.town_id] : initialPobles);
  const [loading, setLoading] = useState(false);
  const [postType, setPostType] = useState(editMode && postData ? postData.type || 'post' : 'post');
  const [bookTitle, setBookTitle] = useState(editMode && postData ? postData.book_title || '' : '');
  const [chapterNumber, setChapterNumber] = useState(editMode && postData ? postData.chapter_number || '' : '');
  const [multimediaPreview, setMultimediaPreview] = useState(editMode && postData ? postData.image_url : null);
  const [multimediaFile, setMultimediaFile] = useState(null);
  const [iaiaAnalyzing, setIaiaAnalyzing] = useState(false);
  const [isCaptureOpen, setIsCaptureOpen] = useState(false);
  const fileReaderRef = useRef(null);

  const isArticleMode = postType === 'page';

  useEffect(() => {
    return () => {
      if (fileReaderRef.current) {
        fileReaderRef.current.abort();
      }
    };
  }, []);

  useEffect(() => {
    if (isOpen && user) {
      hapticService.bategat();
      if (profile && selectedTowns.length === 0 && !editMode) {
        const id = profile.town_uuid || profile.town_id;
        if (id) setSelectedTowns([id]);
      }
      if (editMode && postData) {
        setContent(postData.content);
        setPostType(postData.type || 'post');
        setBookTitle(postData.book_title || '');
        setChapterNumber(postData.chapter_number || '');
        setMultimediaPreview(postData.image_url);
      }
      if (!editMode && initialFile && !multimediaFile) {
        setMultimediaFile(initialFile);
        if (fileReaderRef.current) fileReaderRef.current.abort();
        const reader = new FileReader();
        fileReaderRef.current = reader;
        reader.onloadend = () => {
          if (reader.readyState === FileReader.DONE) {
            setMultimediaPreview(reader.result);
          }
        };
        reader.readAsDataURL(initialFile);
      }
    }
  }, [isOpen, user, profile, editMode, postData, selectedTowns.length, initialFile, multimediaFile]);

  const handleSubmit = async () => {
    const hasContent = content.trim() || bookTitle.trim() || multimediaPreview;
    if (!hasContent || loading) return;
    setLoading(true);
    try {
      hapticService.notifySuccess();
      const postPayload = {
        content: content,
        author_id: user.id,
        author_name: profile.full_name,
        author_avatar_url: profile.avatar_url,
        author_role: profile.role,
        entity_id: null,
        town_uuid: selectedTowns[0] || null,
        town_id: selectedTowns[0] || null,
        town_ids: selectedTowns,
        type: postType,
        tags: [],
        ai_percentage: editMode && postData ? postData.ai_percentage : 0,
        human_percentage: editMode && postData ? postData.human_percentage : 100,
        is_playground: false,
        book_title: postType === 'book' || postType === 'page' ? bookTitle : null,
        chapter_number: postType === 'book' ? parseInt(chapterNumber) || null : null
      };
      if (editMode && postData) {
        await supabaseService.updatePost(postData.id || postData.uuid, postPayload, false);
        logger.info('[CreatePostModal] Post actualitzat amb èxit.');
      } else {
        await supabaseService.createPost(postPayload, false);
        logger.info('[CreatePostModal] Post creat amb èxit.');
      }
      hapticService.bategat();
      onClose();
      if (!editMode) {
        setContent('');
        setMultimediaPreview(null);
        setMultimediaFile(null);
      }
    } catch (error) {
      logger.error('[CreatePostModal] Error:', error);
      alert(editMode ? 'Error al actualitzar. Revisa el teu bategat.' : 'Error al publicar. Revisa el teu bategat territorial.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = e => {
    const file = e.target.files[0];
    if (file) {
      setMultimediaFile(file);
      if (fileReaderRef.current) fileReaderRef.current.abort();
      const reader = new FileReader();
      fileReaderRef.current = reader;
      reader.onloadend = () => {
        if (reader.readyState === FileReader.DONE) {
          setMultimediaPreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeWithIAIA = async () => {
    if (!multimediaFile) return;
    setIaiaAnalyzing(true);
    try {
      const context = await iaiaService.studyMultimediaContext(multimediaFile, multimediaFile.name);
      const result = await iaiaService.generateMultimediaPublication(context, content);
      setContent(result.content);
    } catch (error) {
      logger.error('[IAIA] Error analyzing:', error);
    } finally {
      setIaiaAnalyzing(false);
    }
  };

  const { shouldRender, hasTransitionedIn } = useMountTransition(isOpen, 300);
  if (!shouldRender) return null;

  return (
    <div className={`fixed inset-0 z-modal flex items-center justify-center p-4 transition-opacity duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${hasTransitionedIn ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose}></div>
        
        <div className={`relative isolate z-50 w-full flex flex-col rounded-[24px] shadow-sm bg-white text-gray-900 overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${isArticleMode ? 'max-w-4xl h-[95vh]' : 'max-w-[420px] h-[85vh] md:h-[90vh]'} ${hasTransitionedIn ? 'scale-100 translate-y-0' : 'scale-[0.97] translate-y-4'}`}>
            
            <div className='flex items-center justify-between p-5 border-b border-gray-200 bg-white'>
                <div className="flex items-center gap-3">
                    <button onClick={onClose} className='p-2 -ml-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors hover:text-gray-900'>
                        <ArrowLeft size={24} />
                    </button>
                    <h2 className='text-xl font-bold tracking-tight text-gray-900 flex items-center gap-2 m-0'>
                        {isArticleMode ? <BookOpen size={20} className='text-orange-500' /> : null}
                        {isArticleMode ? 'Article Genesis' : t('common.publish')}
                    </h2>
                </div>
                <div className="flex items-center gap-2">
                    {isAdmin && (
                        <button onClick={() => {
                            hapticService.bategat();
                            setPostType(isArticleMode ? 'post' : 'page');
                        }} className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-2 transition-all border ${isArticleMode ? 'bg-orange-500 text-white shadow-sm border-orange-500' : 'bg-gray-50 text-gray-500 hover:text-gray-900 hover:bg-gray-100 border-gray-200'}`} title="Lògica d'expansió: Convertir a Article">
                            {isArticleMode ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                            <span className="text-sm hidden sm:inline">{isArticleMode ? 'Mode Mur' : 'Mode Article'}</span>
                        </button>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar pb-24 bg-gray-50">
                {(isArticleMode || bookTitle) && (
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-600 m-0">Títol {isArticleMode && '*'}</label>
                        <input type="text" placeholder={isArticleMode ? "Títol de l'article o projecte..." : t('market.title_placeholder')} className="w-full bg-white border border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl px-4 py-3.5 focus:border-orange-500 outline-none transition-all font-bold text-lg" value={bookTitle} onChange={e => setBookTitle(e.target.value)} />
                    </div>
                )}

                <div className="space-y-1.5">
                    <div className="flex justify-between items-center mb-1">
                        <label className="text-sm font-medium text-gray-600 m-0">{isArticleMode ? 'Contingut Ric' : t('groups.group_description')}</label>
                        {!isArticleMode && !bookTitle && (
                            <button className='text-[11px] font-bold text-orange-500 hover:underline m-0' onClick={() => setBookTitle('Títol Opcional')}>
                                + Afegir Títol
                            </button>
                        )}
                    </div>
                    <div className={`transition-all bg-white rounded-xl border border-gray-200 ${isArticleMode ? '-mx-2 sm:mx-0' : ''}`}>
                        <Suspense fallback={<div className="h-40 w-full animate-pulse bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 font-mono text-xs">Carregant l'editor màgic...</div>}>
                            <RichTextEditor content={content} onChange={setContent} minimal={!isArticleMode} editable={true} />
                        </Suspense>
                    </div>
                </div>

                {!isArticleMode && (
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-600 m-0">{t('market.price_optional')}</label>
                            <div className="relative">
                                <input type="text" placeholder="250" className="w-full bg-white border border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl pl-4 pr-10 py-3.5 focus:border-orange-500 outline-none transition-all" />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">€</span>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-600 m-0">{t('market.category')}</label>
                            <div className="relative">
                                <select className="w-full bg-white border border-gray-200 text-gray-900 rounded-xl px-4 py-3.5 appearance-none focus:border-orange-500 outline-none transition-all cursor-pointer">
                                    <option>{t('market.select')}</option>
                                    <option>{t('market.farm_products')}</option>
                                    <option>{t('market.services')}</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="space-y-3 pt-2">
                    <label className="text-base font-bold text-gray-900 m-0">{t('market.add_media')}</label>
                    
                    {multimediaPreview ? (
                        <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-100 border border-gray-200 group">
                            <img src={multimediaPreview} alt="Preview" className="w-full h-full object-cover" />
                            <button onClick={() => {
                                setMultimediaPreview(null);
                                setMultimediaFile(null);
                            }} className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full text-gray-900 hover:bg-red-50 hover:text-red-500 transition-colors">
                                <X size={16} />
                            </button>
                            <button className="absolute bottom-3 right-3 px-3 py-1.5 bg-[#4F46E5] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-sm" onClick={analyzeWithIAIA} disabled={iaiaAnalyzing}>
                                <Sparkles size={14} />
                                {iaiaAnalyzing ? t('common.analyzing') : t('common.iaia')}
                            </button>
                        </div>
                    ) : (
                        <label className="w-full aspect-[4/3] max-h-56 bg-white border-2 border-dashed border-gray-300 hover:border-orange-500 hover:bg-orange-50 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all group">
                            <div className="text-gray-400 mb-3 group-hover:scale-110 group-hover:text-orange-500 transition-all">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                    <circle cx="8.5" cy="8.5" r="1.5" />
                                    <path d="m21 15-5-5L5 21" />
                                    <path d="M12 12v6" />
                                    <path d="M9 15h6" />
                                </svg>
                            </div>
                            <span className="text-[15px] font-bold text-gray-900 mb-1 m-0">{t('market.drag_files')}</span>
                            <span className="text-xs text-gray-500 mb-4 m-0">{t('market.max_files')}</span>
                            <div className="px-5 py-2.5 bg-gray-100 text-gray-600 font-bold rounded-full text-sm group-hover:bg-orange-500 group-hover:text-white transition-colors m-0">
                                {t('market.select_files')}
                            </div>
                            <input type="file" className="hidden" accept="image/*,video/*" onChange={handleFileChange} />
                        </label>
                    )}
                </div>

                <button className={`w-full py-4 mt-6 rounded-[20px] font-bold text-[18px] transition-all flex items-center justify-center ${content.trim() || bookTitle.trim() || multimediaPreview ? 'bg-orange-500 text-white shadow-sm hover:bg-orange-600 active:scale-[0.98]' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`} onClick={handleSubmit} disabled={loading || !content.trim() && !bookTitle.trim() && !multimediaPreview}>
                    {loading ? <Loader2 className="animate-spin w-6 h-6" /> : t('common.publish')}
                </button>
            </div>
        </div>

        {CaptureStudio && isCaptureOpen && (
            <CaptureStudio isOpen={isCaptureOpen} onClose={() => setIsCaptureOpen(false)} onCapture={media => {
                setMultimediaPreview(media.url);
                if (media.blob) setMultimediaFile(new File([media.blob], 'capture.jpg', {
                    type: 'image/jpeg'
                }));
            }} mode="photo" />
        )}
    </div>
  );
};
export default CreatePostModal;
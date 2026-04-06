import React, { useRef, useState, lazy, Suspense, useEffect } from 'react';
import { ShieldCheck, Smile, Mic, X, Send, Image, Camera, MapPin, User, FileText, BarChart2, CalendarDays, Paperclip, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAttachmentManager } from '../../hooks/useAttachmentManager';

// EXTREME AUDIT V2 FIX: Lazy Loading per EmojiPicker i VoiceRecorder (Evita bloquejos del Fil Principal de UI en Androids).
const VoiceRecorder = lazy(() => import('../VoiceRecorder'));
const EmojiPicker = lazy(() => import('emoji-picker-react'));

const FallbackLoader = () => (
    <div className="h-12 flex items-center justify-center">
        <Loader2 className="animate-spin text-[var(--theme-accent-primary)] w-6 h-6" />
    </div>
);

const ChatInputArea = React.memo(({
    id, otherInfo, user, setIsGuestInteractionModalOpen,
    handleSendMessage, isSending
}) => {
    const { t } = useTranslation();
    const [newMessage, setNewMessage] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
    const [isAttachmentMenuOpen, setIsAttachmentMenuOpen] = useState(false);
    
    // EXTREME AUDIT FIX: Atraiem els estats d'adjunts al component fill per evitar re-renders del pare (ChatDetail) i destrossar Virtuoso.
    const { attachedFile, attachedFilePreview, handleFileSelect, clearAttachment } = useAttachmentManager();

    const inputRef = useRef(null);

    // EXTREME AUDIT FIX: Maneig intel·ligent del VisualViewport (teclat virtual iOS)
    useEffect(() => {
        if (!window.visualViewport) return;
        const setViewportHeight = () => {
            document.documentElement.style.setProperty('--vv-height', `${window.visualViewport.height}px`);
        };
        window.visualViewport.addEventListener('resize', setViewportHeight);
        window.visualViewport.addEventListener('scroll', setViewportHeight);
        setViewportHeight();
        
        return () => {
            window.visualViewport.removeEventListener('resize', setViewportHeight);
            window.visualViewport.removeEventListener('scroll', setViewportHeight);
            document.documentElement.style.removeProperty('--vv-height');
        };
    }, []);

    const onInternalSubmit = (e) => {
        if (e && e.preventDefault) e.preventDefault();
        setIsEmojiPickerOpen(false);
        setIsAttachmentMenuOpen(false);
        
        handleSendMessage({
            text: newMessage,
            attachedFile,
            onSuccess: () => {
                setNewMessage('');
                clearAttachment();
                if (inputRef.current) {
                    inputRef.current.style.height = 'auto'; // Reseteja alçada després d'enviar
                }
            }
        });
    };

    const showGuestBanner = user?.isAnonymous && !id?.startsWith('11111111-');
    const isIAIA = otherInfo?.id?.startsWith('11111111-') || otherInfo?.id === 'iaia-maria';

    return (
        <div 
            className={`chat-input-master-wrapper relative w-full px-2 sm:px-4 md:px-6 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur-2xl backdrop-saturate-150 z-50 flex-shrink-0 isolate contain-layout ${isIAIA ? 'text-gray-900 dark:text-white' : 'bg-theme-bg/70'}`}
            style={isIAIA ? { backgroundColor: 'var(--theme-iaia-brand)' } : undefined}
        >
            {/* Top Highlight for Glass */}
            {isIAIA && <div className="absolute inset-x-0 top-0 h-[1px] bg-black/10 dark:bg-white/10 pointer-events-none"></div>}

            <div className="max-w-5xl mx-auto relative flex flex-col gap-3 w-full">
                
                {isRecording ? (
                    <div className="voice-recorder-overlay bg-theme-surface overflow-hidden rounded-full shadow-2xl flex items-center min-h-[56px] px-2 animate-in slide-in-from-bottom-5 duration-300 pointer-events-auto ring-1 ring-border-master/30">
                        <Suspense fallback={<FallbackLoader />}>
                            <VoiceRecorder 
                                onSend={async (blob, duration, transcript) => {
                                    setIsRecording(false);
                                    if (!blob) return;
                                    handleSendMessage({
                                        voiceData: { blob, transcript, duration },
                                        onSuccess: () => setIsRecording(false) 
                                    });
                                }}
                                onCancel={() => setIsRecording(false)}
                            />
                        </Suspense>
                    </div>
                ) : showGuestBanner ? (
                    <div className="w-full relative">
                        <button onClick={(e) => { e.preventDefault(); setIsGuestInteractionModalOpen(true); }} className="w-full h-[56px] rounded-full bg-theme-surface hover:bg-theme-surface-hover text-theme-accent-primary font-['Noto_Sans'] font-bold text-sm tracking-wide shadow-lg flex items-center justify-center gap-2 btn-tactile transition-colors border border-border-master/50">
                            <ShieldCheck size={20} />
                            <span>{t('chat.attachments.ephemeral_warning')}</span>
                        </button>
                    </div>
                ) : (
                    <>
                        {attachedFile && (
                            <div className="flex w-full overflow-x-auto custom-scrollbar pb-2 pt-1 px-1">
                                <div className="relative inline-flex flex-col animate-in fade-in slide-in-from-bottom-2 bg-theme-surface rounded-[24px] p-2 shadow-2xl max-w-xs shrink-0 ring-1 ring-border-master/30">
                                    <button onClick={clearAttachment} className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center z-10 btn-tactile"><X size={16} strokeWidth={3} /></button>
                                    {attachedFilePreview ? <img src={attachedFilePreview} alt="preview" className="w-full h-32 object-cover rounded-[16px]" /> : <div className="w-full h-32 bg-theme-bg rounded-[16px] flex items-center justify-center"><FileText size={48} className="text-theme-text/20" /></div>}
                                    <div className="mt-2 mb-1 text-xs font-['Noto_Sans'] font-semibold text-center truncate px-2 text-theme-text w-full">{attachedFile.name}</div>
                                </div>
                            </div>
                        )}

                        <form className="flex items-end gap-3 m-0 p-0 w-full" onSubmit={onInternalSubmit}>
                            <div className="flex-1 relative flex items-end min-w-0 bg-theme-base rounded-[28px] shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-all duration-300">
                                
                                {/* BOTÓ EMOJI */}
                                <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsEmojiPickerOpen(!isEmojiPickerOpen); setIsAttachmentMenuOpen(false); if (!isEmojiPickerOpen && inputRef.current) inputRef.current.blur(); }} className={`w-[48px] h-[48px] flex items-center justify-center shrink-0 self-end mb-1 transition-colors btn-tactile ${isEmojiPickerOpen ? 'text-theme-accent-primary' : 'text-theme-text/40 hover:text-theme-text/80'}`}>
                                    <Smile className="w-[24px] h-[24px]" strokeWidth={2.5} />
                                </button>
                                
                                {/* CAMP DE TEXT */}
                                <textarea 
                                    id="chat-message-input" name="chat_message"
                                    ref={inputRef} rows={1} spellCheck="true" value={newMessage} 
                                    onChange={(e) => { setNewMessage(e.target.value); e.target.style.height = 'auto'; e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`; }}
                                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onInternalSubmit(e); } }}
                                    placeholder={otherInfo?.name ? t('chat.talk_with', { name: otherInfo.name }) : t('common.write_message')}
                                    className="flex-1 min-h-[48px] max-h-[130px] bg-transparent border-none py-[14px] px-2 text-theme-text placeholder:text-theme-text/40 focus:outline-none font-['Noto_Sans'] font-medium text-[16px] md:text-[17px] align-middle box-border m-0 min-w-0 resize-none overflow-y-auto custom-scrollbar leading-relaxed"
                                    style={{ height: 'auto' }}
                                    onPaste={(e) => {
                                        const items = e.clipboardData?.items;
                                        if (!items) return;
                                        requestAnimationFrame(() => {
                                            const imageItems = Array.from(items).filter(item => item.type.indexOf('image') !== -1);
                                            if (imageItems.length === 0) return;
                                            const processNext = (index = 0) => {
                                                if (index >= imageItems.length || index >= 3) return;
                                                requestAnimationFrame(() => {
                                                    const file = imageItems[index].getAsFile();
                                                    if (file) handleFileSelect({ target: { files: [file] } });
                                                    processNext(index + 1);
                                                });
                                            };
                                            processNext();
                                        });
                                    }}
                                />

                                {/* BOTONS ADJUNT I CÀMERA */}
                                <div className="flex items-center shrink-0 self-end h-[48px] pr-2 gap-1 pb-1">
                                    <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsAttachmentMenuOpen(!isAttachmentMenuOpen); setIsEmojiPickerOpen(false); }} className={`w-[40px] h-[40px] flex items-center justify-center rounded-full transition-colors btn-tactile ${isAttachmentMenuOpen ? 'bg-theme-surface text-theme-text' : 'text-theme-text/40 hover:bg-theme-surface hover:text-theme-text/80'}`}>
                                        <Paperclip className="w-[20px] h-[20px] transform -rotate-45" strokeWidth={2.2} />
                                    </button>
                                    {!newMessage.trim() && (
                                        <button type="button" onClick={() => document.getElementById('attach-camera')?.click()} className="w-[40px] h-[40px] flex items-center justify-center rounded-full text-theme-text/40 hover:bg-theme-surface hover:text-theme-text/80 transition-colors btn-tactile">
                                            <Camera className="w-[20px] h-[20px]" strokeWidth={2.2} />
                                        </button>
                                    )}
                                </div>

                                {/* POPUPS */}
                                {isEmojiPickerOpen && (
                                    <>
                                        <div className="fixed inset-0 z-dropdown" onClick={(e) => {e.stopPropagation(); setIsEmojiPickerOpen(false);}}></div>
                                        <div className="absolute left-1/2 -translate-x-1/2 md:-translate-x-0 md:left-auto md:right-0 bottom-[70px] z-dropdown animate-in slide-in-from-bottom-4 zoom-in-95 origin-bottom md:origin-bottom-right shadow-2xl flex justify-center w-[calc(100vw-32px)] md:w-auto overflow-hidden rounded-[32px] bg-theme-surface ring-1 ring-border-master/30">
                                            <Suspense fallback={<FallbackLoader />}>
                                                <EmojiPicker 
                                                    theme="dark" 
                                                    onEmojiClick={(e) => setNewMessage(prev => prev + e.emoji)} 
                                                    width={window.innerWidth < 768 ? '100%' : 420} 
                                                    height={window.innerHeight < 768 ? Math.max(380, window.innerHeight * 0.6) : 480}
                                                    suggestedEmojisMode="recent"
                                                    searchPlaceHolder={t('emoji.search')}
                                                    previewConfig={{ showPreview: false }}
                                                    categories={[
                                                        { category: 'suggested', name: t('emoji.suggested') },
                                                        { category: 'smileys_people', name: t('emoji.smileys_people') },
                                                        { category: 'animals_nature', name: t('emoji.animals_nature') },
                                                        { category: 'food_drink', name: t('emoji.food_drink') },
                                                        { category: 'travel_places', name: t('emoji.travel_places') },
                                                        { category: 'activities', name: t('emoji.activities') },
                                                        { category: 'objects', name: t('emoji.objects') },
                                                        { category: 'symbols', name: t('emoji.symbols') },
                                                        { category: 'flags', name: t('emoji.flags') }
                                                    ]}
                                                />
                                            </Suspense>
                                        </div>
                                    </>
                                )}

                                {isAttachmentMenuOpen && (
                                    <>
                                        <div className="fixed inset-0 z-dropdown" onClick={(e) => {e.stopPropagation(); setIsAttachmentMenuOpen(false);}}></div>
                                        <div className="absolute bottom-[70px] left-2 right-2 sm:left-auto sm:w-[350px] md:right-8 md:w-[360px] bg-theme-surface/90 backdrop-blur-2xl text-theme-text ring-1 ring-border-master/30 rounded-[32px] shadow-2xl p-6 z-dropdown animate-in slide-in-from-bottom-4 zoom-in-95 origin-bottom sm:origin-bottom-right">
                                            <div className="grid grid-cols-4 gap-y-7 gap-x-2">
                                                <input type="file" id="attach-gallery" hidden accept="image/*" onChange={(e) => { setIsAttachmentMenuOpen(false); handleFileSelect(e); }} />
                                                <input type="file" id="attach-camera" hidden accept="image/*" capture="environment" onChange={(e) => { setIsAttachmentMenuOpen(false); handleFileSelect(e); }} />
                                                <input type="file" id="attach-document" hidden accept=".pdf,.doc,.docx,.txt,.xls,.xlsx" onChange={(e) => { setIsAttachmentMenuOpen(false); handleFileSelect(e); }} />
                                                
                                                {/* 1. Galeria */}
                                                <label htmlFor="attach-gallery" className="flex flex-col items-center gap-[8px] group cursor-pointer">
                                                    <div className="w-[56px] h-[56px] rounded-full bg-theme-base group-hover:bg-[#FFB690] group-hover:text-[#341100] text-theme-text/80 flex items-center justify-center shadow-lg transition-all btn-tactile border border-border-master/50"><Image size={24} strokeWidth={2} /></div>
                                                    <span className="text-[12px] text-theme-text/60 group-hover:text-theme-text font-['Noto_Sans'] font-semibold tracking-tight">{t('chat.attachments.gallery')}</span>
                                                </label>
                                                
                                                {/* 2. Càmera */}
                                                <label htmlFor="attach-camera" className="flex flex-col items-center gap-[8px] group cursor-pointer">
                                                    <div className="w-[56px] h-[56px] rounded-full bg-theme-base group-hover:bg-[#FFB690] group-hover:text-[#341100] text-theme-text/80 flex items-center justify-center shadow-lg transition-all btn-tactile border border-border-master/50"><Camera size={24} strokeWidth={2} /></div>
                                                    <span className="text-[12px] text-theme-text/60 group-hover:text-theme-text font-['Noto_Sans'] font-semibold tracking-tight">{t('chat.attachments.camera')}</span>
                                                </label>

                                                {/* 3. Ubicació */}
                                                <button type="button" onClick={() => { setIsAttachmentMenuOpen(false); import('../../utils/toast').then(m => m.default.success(t('chat.attachments.location_soon'))); }} className="flex flex-col items-center gap-[8px] group cursor-pointer">
                                                    <div className="w-[56px] h-[56px] rounded-full bg-theme-base group-hover:bg-[#FFB690] group-hover:text-[#341100] text-theme-text/80 flex items-center justify-center shadow-lg transition-all btn-tactile border border-border-master/50"><MapPin size={24} strokeWidth={2} /></div>
                                                    <span className="text-[12px] text-theme-text/60 group-hover:text-theme-text font-['Noto_Sans'] font-semibold tracking-tight">{t('chat.attachments.location')}</span>
                                                </button>

                                                {/* 4. Contacte */}
                                                <button type="button" onClick={() => { setIsAttachmentMenuOpen(false); import('../../utils/toast').then(m => m.default.success(t('chat.attachments.contact_soon'))); }} className="flex flex-col items-center gap-[8px] group cursor-pointer">
                                                    <div className="w-[56px] h-[56px] rounded-full bg-theme-base group-hover:bg-[#FFB690] group-hover:text-[#341100] text-theme-text/80 flex items-center justify-center shadow-lg transition-all btn-tactile border border-border-master/50"><User size={24} strokeWidth={2} /></div>
                                                    <span className="text-[12px] text-theme-text/60 group-hover:text-theme-text font-['Noto_Sans'] font-semibold tracking-tight">{t('chat.attachments.contact')}</span>
                                                </button>
                                                
                                                {/* 5. Document */}
                                                <label htmlFor="attach-document" className="flex flex-col items-center gap-[8px] group cursor-pointer">
                                                    <div className="w-[56px] h-[56px] rounded-full bg-theme-base group-hover:bg-[#FFB690] group-hover:text-[#341100] text-theme-text/80 flex items-center justify-center shadow-lg transition-all btn-tactile border border-border-master/50"><FileText size={24} strokeWidth={2} /></div>
                                                    <span className="text-[12px] text-theme-text/60 group-hover:text-theme-text font-['Noto_Sans'] font-semibold tracking-tight">{t('chat.attachments.document')}</span>
                                                </label>

                                                {/* 6. Àudio */}
                                                <button type="button" onClick={() => { setIsAttachmentMenuOpen(false); setIsRecording(true); }} className="flex flex-col items-center gap-[8px] group cursor-pointer">
                                                    <div className="w-[56px] h-[56px] rounded-full bg-theme-base group-hover:bg-[#FFB690] group-hover:text-[#341100] text-theme-text/80 flex items-center justify-center shadow-lg transition-all btn-tactile border border-border-master/50"><Mic size={24} strokeWidth={2} /></div>
                                                    <span className="text-[12px] text-theme-text/60 group-hover:text-theme-text font-['Noto_Sans'] font-semibold tracking-tight">{t('chat.attachments.audio')}</span>
                                                </button>

                                                {/* 7. Enquesta */}
                                                <button type="button" onClick={() => { setIsAttachmentMenuOpen(false); import('../../utils/toast').then(m => m.default.success(t('chat.attachments.poll_soon'))); }} className="flex flex-col items-center gap-[8px] group cursor-pointer">
                                                    <div className="w-[56px] h-[56px] rounded-full bg-theme-base group-hover:bg-[#FFB690] group-hover:text-[#341100] text-theme-text/80 flex items-center justify-center shadow-lg transition-all btn-tactile border border-border-master/50"><BarChart2 size={24} strokeWidth={2} /></div>
                                                    <span className="text-[12px] text-theme-text/60 group-hover:text-theme-text font-['Noto_Sans'] font-semibold tracking-tight">{t('chat.attachments.poll')}</span>
                                                </button>

                                                {/* 8. Esdeveniment */}
                                                <button type="button" onClick={() => { setIsAttachmentMenuOpen(false); import('../../utils/toast').then(m => m.default.success(t('chat.attachments.event_soon'))); }} className="flex flex-col items-center gap-[8px] group cursor-pointer">
                                                    <div className="w-[56px] h-[56px] rounded-full bg-theme-base group-hover:bg-[#FFB690] group-hover:text-[#341100] text-theme-text/80 flex items-center justify-center shadow-lg transition-all btn-tactile border border-border-master/50"><CalendarDays size={24} strokeWidth={2} /></div>
                                                    <span className="text-[12px] text-theme-text/60 group-hover:text-theme-text font-['Noto_Sans'] font-semibold tracking-tight">{t('chat.attachments.event')}</span>
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="flex items-end flex-none shrink-0">
                                {newMessage.trim() || attachedFile ? (
                                    <button type="submit" disabled={isSending} onPointerDown={(e) => { e.preventDefault(); if (!isSending) onInternalSubmit(e); }} className="w-[52px] h-[52px] shrink-0 bg-gradient-to-br from-[#FFB690] to-[#F97316] text-[#341100] disabled:opacity-50 rounded-full shadow-lg flex items-center justify-center btn-tactile z-10 transition-transform relative">
                                        <Send strokeWidth={2.5} className="w-[20px] h-[20px] ml-1" />
                                    </button>
                                ) : (
                                    <button type="button" onClick={() => setIsRecording(true)} className={`w-[52px] h-[52px] shrink-0 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.15)] flex items-center justify-center btn-tactile z-10 transition-colors border border-black/5 dark:border-white/5 relative ${isIAIA ? "bg-[#169CF9] dark:bg-[#F97316] hover:brightness-95 text-white dark:text-[#341100]" : "bg-theme-accent-primary hover:brightness-95 text-[#341100]"}`}>
                                        <Mic strokeWidth={2.5} className="w-[22px] h-[22px]" />
                                    </button>
                                )}
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
});

export default ChatInputArea;

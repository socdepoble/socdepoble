import React, { useRef, useState, lazy, Suspense } from 'react';
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

    return (
        <div className={`chat-input-master-wrapper relative w-full px-2 sm:px-4 md:px-6 py-[8px] md:py-[12px] bg-[var(--theme-accent-primary)] dark:bg-[var(--theme-accent-secondary)] border-t border-transparent z-[50] flex-shrink-0 transition-colors shadow-[0_-10px_20px_rgba(0,0,0,0.05)] md:pb-[12px]`}>
            <div className="max-w-5xl mx-auto relative">
                
                {isRecording ? (
                    <div className="voice-recorder-overlay animate-in slide-in-from-bottom-5 duration-300">
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
                        <button onClick={(e) => { e.preventDefault(); setIsGuestInteractionModalOpen(true); }} className="w-full h-[48px] genesis-radius bg-theme-panel border border-orange-500/50 hover:bg-orange-500/10 text-orange-400 font-bold text-sm tracking-wide shadow-lg flex items-center justify-center gap-2">
                            <ShieldCheck size={18} />
                            <span>Atenció: Conversació Efímera. Toca per Registrar-te.</span>
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2 w-full">
                        {attachedFile && (
                            <div className="flex w-full overflow-x-auto custom-scrollbar pb-2 pt-1 px-1">
                                <div className="relative inline-flex flex-col animate-in fade-in slide-in-from-bottom-2 bg-white dark:bg-[#1f1f1f] rounded-2xl p-2 shadow-sm max-w-xs shrink-0 border border-[var(--border-master)]">
                                    <button onClick={clearAttachment} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center z-10"><X size={14} strokeWidth={3} /></button>
                                    {attachedFilePreview ? <img src={attachedFilePreview} alt="preview" className="w-full h-32 object-cover rounded-xl" /> : <div className="w-full h-32 bg-[var(--bg-master)] rounded-xl flex items-center justify-center"><FileText size={48} opacity={0.5} /></div>}
                                    <div className="mt-2 text-xs font-semibold text-center truncate px-2 text-[var(--text-main)] w-full">{attachedFile.name}</div>
                                </div>
                            </div>
                        )}

                        <form className="flex items-end gap-2 m-0 p-0 w-full" onSubmit={onInternalSubmit}>
                            <div className="flex-1 relative flex items-end min-w-0 bg-white dark:bg-[#1f1f1f] rounded-[24px] shadow-sm">
                                
                                {/* BOTÓ EMOJI */}
                                <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsEmojiPickerOpen(!isEmojiPickerOpen); setIsAttachmentMenuOpen(false); if (!isEmojiPickerOpen && inputRef.current) inputRef.current.blur(); }} className={`w-[40px] h-[40px] md:w-[48px] md:h-[48px] flex items-center justify-center shrink-0 self-end mb-0 md:mb-0 pb-[2px] md:pb-[4px] ${isEmojiPickerOpen ? 'text-[var(--theme-accent-primary)] drop-shadow-md' : 'text-gray-500 hover:text-gray-600'}`}>
                                    <Smile className="w-[22px] h-[22px] md:w-[24px] md:h-[24px] mt-[2px] md:mt-[4px]" strokeWidth={2.5} />
                                </button>
                                
                                {/* CAMP DE TEXT */}
                                <textarea 
                                    ref={inputRef} rows={1} spellCheck="true" value={newMessage} 
                                    onChange={(e) => { setNewMessage(e.target.value); e.target.style.height = 'auto'; e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`; }}
                                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onInternalSubmit(e); } }}
                                    placeholder={otherInfo?.name ? `Parla amb ${otherInfo.name}...` : t('common.write_message')}
                                    className="flex-1 min-h-[40px] md:min-h-[48px] max-h-[130px] bg-transparent border-none py-[10px] md:py-[12px] px-1 text-black dark:text-white focus:outline-none font-medium text-[17px] md:text-[18px] align-middle box-border m-0 min-w-0 resize-none overflow-y-auto custom-scrollbar leading-relaxed"
                                    style={{ height: 'auto' }}
                                    onPaste={(e) => {
                                        const items = e.clipboardData?.items;
                                        if (!items) return;
                                        // EXTREME AUDIT V4 FIX: Prevé Mobile UI Freeze si es peguen múltiples Imatges d'alta qualitat evitant el Main Thread Lock. Ús de rAF per evitar delay hardcoded.
                                        requestAnimationFrame(() => {
                                            for (let i = 0; i < items.length; i++) {
                                                if (items[i].type.indexOf('image') !== -1) {
                                                    const file = items[i].getAsFile();
                                                    handleFileSelect({ target: { files: [file] } });
                                                    break;
                                                }
                                            }
                                        });
                                    }}
                                />

                                {/* BOTONS ADJUNT I CÀMERA */}
                                <div className="flex items-center shrink-0 self-end h-[40px] md:h-[48px] pr-1 md:pr-2 gap-1">
                                    <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsAttachmentMenuOpen(!isAttachmentMenuOpen); setIsEmojiPickerOpen(false); }} className="w-[36px] h-[36px] flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                        <Paperclip className="w-[20px] h-[20px] transform -rotate-45" strokeWidth={2.2} />
                                    </button>
                                    {!newMessage.trim() && (
                                        <button type="button" onClick={() => document.getElementById('attach-camera')?.click()} className="w-[36px] h-[36px] flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                            <Camera className="w-[20px] h-[20px]" strokeWidth={2.2} />
                                        </button>
                                    )}
                                </div>

                                {/* POPUPS */}
                                {isEmojiPickerOpen && (
                                    <>
                                        <div className="fixed inset-0 z-[100]" onClick={(e) => {e.stopPropagation(); setIsEmojiPickerOpen(false);}}></div>
                                        <div className="absolute left-1/2 -translate-x-1/2 md:-translate-x-0 md:left-auto md:right-0 bottom-[60px] z-[110] animate-in slide-in-from-bottom-2 zoom-in-95 origin-bottom md:origin-bottom-right drop-shadow-2xl flex justify-center w-[calc(100vw-32px)] md:w-auto overflow-hidden rounded-2xl bg-theme-panel">
                                            <Suspense fallback={<FallbackLoader />}>
                                                <EmojiPicker 
                                                    theme="auto" 
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
                                        <div className="fixed inset-0 z-[100]" onClick={(e) => {e.stopPropagation(); setIsAttachmentMenuOpen(false);}}></div>
                                        <div className="absolute bottom-[60px] left-2 right-2 sm:left-auto sm:w-[350px] md:right-8 md:w-[360px] bg-theme-panel text-[var(--text-main)] border border-[var(--border-master)] rounded-[28px] shadow-[0_8px_40px_rgba(0,0,0,0.15)] p-6 z-[110] animate-in slide-in-from-bottom-2 zoom-in-95 origin-bottom sm:origin-bottom-right">
                                            <div className="grid grid-cols-4 gap-y-7 gap-x-2">
                                                <input type="file" id="attach-gallery" hidden accept="image/*" onChange={(e) => { setIsAttachmentMenuOpen(false); handleFileSelect(e); }} />
                                                <input type="file" id="attach-camera" hidden accept="image/*" capture="environment" onChange={(e) => { setIsAttachmentMenuOpen(false); handleFileSelect(e); }} />
                                                <input type="file" id="attach-document" hidden accept=".pdf,.doc,.docx,.txt,.xls,.xlsx" onChange={(e) => { setIsAttachmentMenuOpen(false); handleFileSelect(e); }} />
                                                
                                                {/* 1. Galeria */}
                                                <label htmlFor="attach-gallery" className="flex flex-col items-center gap-[6px] group cursor-pointer">
                                                    <div className="w-[52px] h-[52px] rounded-full bg-purple-500 text-white flex items-center justify-center shadow-sm active:scale-95 transition-transform"><Image size={24} strokeWidth={2} /></div>
                                                    <span className="text-[12px] opacity-80 font-medium tracking-tight">Galeria</span>
                                                </label>
                                                
                                                {/* 2. Càmera */}
                                                <label htmlFor="attach-camera" className="flex flex-col items-center gap-[6px] group cursor-pointer">
                                                    <div className="w-[52px] h-[52px] rounded-full bg-pink-500 text-white flex items-center justify-center shadow-sm active:scale-95 transition-transform"><Camera size={24} strokeWidth={2} /></div>
                                                    <span className="text-[12px] opacity-80 font-medium tracking-tight">Càmera</span>
                                                </label>

                                                {/* 3. Ubicació */}
                                                <button type="button" onClick={() => { setIsAttachmentMenuOpen(false); import('../../utils/toast').then(m => m.default.success("🗺️ Ubicació pròximament")); }} className="flex flex-col items-center gap-[6px] group cursor-pointer">
                                                    <div className="w-[52px] h-[52px] rounded-full bg-green-500 text-white flex items-center justify-center shadow-sm active:scale-95 transition-transform"><MapPin size={24} strokeWidth={2} /></div>
                                                    <span className="text-[12px] opacity-80 font-medium tracking-tight">Ubicació</span>
                                                </button>

                                                {/* 4. Contacte */}
                                                <button type="button" onClick={() => { setIsAttachmentMenuOpen(false); import('../../utils/toast').then(m => m.default.success("👤 Contacte pròximament")); }} className="flex flex-col items-center gap-[6px] group cursor-pointer">
                                                    <div className="w-[52px] h-[52px] rounded-full bg-blue-400 text-white flex items-center justify-center shadow-sm active:scale-95 transition-transform"><User size={24} strokeWidth={2} /></div>
                                                    <span className="text-[12px] opacity-80 font-medium tracking-tight">Contacte</span>
                                                </button>
                                                
                                                {/* 5. Document */}
                                                <label htmlFor="attach-document" className="flex flex-col items-center gap-[6px] group cursor-pointer">
                                                    <div className="w-[52px] h-[52px] rounded-full bg-indigo-500 text-white flex items-center justify-center shadow-sm active:scale-95 transition-transform"><FileText size={24} strokeWidth={2} /></div>
                                                    <span className="text-[12px] opacity-80 font-medium tracking-tight">Document</span>
                                                </label>

                                                {/* 6. Àudio */}
                                                <button type="button" onClick={() => { setIsAttachmentMenuOpen(false); setIsRecording(true); }} className="flex flex-col items-center gap-[6px] group cursor-pointer">
                                                    <div className="w-[52px] h-[52px] rounded-full bg-orange-500 text-white flex items-center justify-center shadow-sm active:scale-95 transition-transform"><Mic size={24} strokeWidth={2} /></div>
                                                    <span className="text-[12px] opacity-80 font-medium tracking-tight">Àudio</span>
                                                </button>

                                                {/* 7. Enquesta */}
                                                <button type="button" onClick={() => { setIsAttachmentMenuOpen(false); import('../../utils/toast').then(m => m.default.success("📊 Enquesta pròximament")); }} className="flex flex-col items-center gap-[6px] group cursor-pointer">
                                                    <div className="w-[52px] h-[52px] rounded-full bg-yellow-500 text-white flex items-center justify-center shadow-sm active:scale-95 transition-transform"><BarChart2 size={24} strokeWidth={2} /></div>
                                                    <span className="text-[12px] opacity-80 font-medium tracking-tight">Enquesta</span>
                                                </button>

                                                {/* 8. Esdeveniment */}
                                                <button type="button" onClick={() => { setIsAttachmentMenuOpen(false); import('../../utils/toast').then(m => m.default.success("📅 Esdeveniment pròximament")); }} className="flex flex-col items-center gap-[6px] group cursor-pointer">
                                                    <div className="w-[52px] h-[52px] rounded-full bg-teal-500 text-white flex items-center justify-center shadow-sm active:scale-95 transition-transform"><CalendarDays size={24} strokeWidth={2} /></div>
                                                    <span className="text-[12px] opacity-80 font-medium tracking-tight">Esdeveniment</span>
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="flex items-end pb-[0px] md:pb-[2px]">
                                {newMessage.trim() || attachedFile ? (
                                    <button type="submit" disabled={isSending} onPointerDown={(e) => { e.preventDefault(); if (!isSending) onInternalSubmit(e); }} className="w-[42px] h-[42px] md:w-[48px] md:h-[48px] shrink-0 bg-[#00a884] hover:bg-[#008f6f] text-white disabled:opacity-50 rounded-full shadow-md flex items-center justify-center transition-transform active:scale-95 z-10">
                                        <Send strokeWidth={2.5} className="w-[18px] h-[18px] ml-1" />
                                    </button>
                                ) : (
                                    <button type="button" onClick={() => setIsRecording(true)} className="w-[42px] h-[42px] md:w-[48px] md:h-[48px] shrink-0 bg-[#00a884] hover:bg-[#008f6f] text-white rounded-full shadow-md flex items-center justify-center transition-transform active:scale-95 z-10">
                                        <Mic strokeWidth={2.5} className="w-[20px] h-[20px]" />
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
});

export default ChatInputArea;

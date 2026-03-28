import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FolderInput, Mic, Check, CheckCheck, Pause, Play, Download, Settings, Trash2, Reply, Smile, Star, Pin, Forward, Copy, Info, Eye, DownloadCloud, CheckCircle2, Paperclip } from 'lucide-react';
import { logger } from '../../utils/logger';

const MessageBubble = React.memo(({
    msg,
    isMe,
    isSameSenderAsNext,
    otherInfo,
    isActiveMenu,
    contextMenuPosition,
    setContextMenuPosition,
    setContextMenuId,
    onMoveMessageToAgent,
    onRequestMove
}) => {
    const { t } = useTranslation();
    
    const marginClass = isSameSenderAsNext ? 'mb-[3px]' : 'mb-2';
    
    // EXTREME AUDIT V4.2 FIX: position TORNADA AL PARE per evitar l'apocalipsi de reciclatge
    // quan un ítem is actiu, se fa scroll up (S'AMAGA I DEL MOUNT) i després tornes baix -> l'estat local
    // es perdrà perquè Virtuoso desmunta/munta components constants. Així doncs, usem global param.
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const isMounted = useRef(true);

    // EXTREME AUDIT V4 FIX + DEEPSEEK V5: Neteja d'instàncies d'Audio i prevenció Stale
    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.src = "";
                audioRef.current = null;
            }
        };
    }, []);
    
    // helper per renderitzar mencions a l'estil WhatsApp
    const renderContent = (text) => {
        if (!text) return null;
        return text.split(/(@[a-z0-9_]+)/g).map((part, index) => {
            if (part.startsWith('@')) {
                const username = part.substring(1).toLowerCase();
                const KNOWN_MENTIONS = {
                    marcgall: '11111111-0000-0000-0000-000000000004',
                    vferris: '11111111-1111-4111-a111-000000000003',
                    cuinera: '11111111-1111-4111-a111-000000000009',
                    joanbat: '11111111-1111-4111-a111-000000000008',
                    beatriz_ortega: '11111111-1a1a-0001-0000-000000000002',
                    nanob: '11111111-1111-4111-a111-000000000007',
                    andreu_soler: '11111111-1a1a-0001-0000-000000000001',
                    carla_soriano: '11111111-1a1a-0001-0000-000000000003',
                    viatjant: '11111111-1111-4111-a111-000000000004',
                    elenap: '11111111-1111-4111-a111-000000000005',
                    rato: '11111111-0000-0000-0000-000000000001',
                    mixa: '11111111-1a1a-0001-0000-000000000011',
                    flash: '11111111-1a1a-0001-0000-000000000010',
                    sultan: '11111111-1111-4111-a111-000000000006'
                };
                if (KNOWN_MENTIONS[username]) {
                    return (
                        <button 
                            key={index}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (onMoveMessageToAgent) {
                                    onMoveMessageToAgent(KNOWN_MENTIONS[username], msg?.id);
                                }
                            }}
                            className="inline-flex items-center gap-1 text-[var(--theme-accent-primary)] font-black cursor-pointer hover:underline bg-[var(--theme-accent-primary)]/10 dark:bg-white/10 px-1.5 pt-[1px] pb-[2px] rounded-md mx-0.5 transition-colors active:scale-95"
                            title="Desplaçar a l'expert"
                        >
                            {part}
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ml-0.5"><path d="m15 10 5 5-5 5"/><path d="M4 4v7a4 4 0 0 0 4 4h12"/></svg>
                        </button>
                    );
                }
            }
            return <span key={index}>{part}</span>;
        });
    };

    return (
        <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} ${marginClass} animate-in fade-in slide-in-from-bottom-2 duration-300 ${isActiveMenu ? 'z-60 relative' : ''} px-4 md:px-6`}>
            <div className={`group max-w-[85%] md:max-w-[65%] !rounded-[8px] px-2.5 pt-1.5 pb-[3px] md:px-3 md:pt-2 md:pb-1 relative shadow-sm
                ${isMe ? 'bg-[#d9fdd3] text-[#000] dark:bg-[#005c4b] dark:text-[#e9edef] !rounded-tr-[2px]' : 'bg-theme-panel text-theme-text !rounded-tl-[2px] border border-[var(--border-master)]'}`}>

                {/* Autor Name */}
                {(!isMe && (msg.author_name || otherInfo?.name)) && (
                    <div className={`text-[13px] font-bold tracking-wide mb-0.5 text-[var(--theme-accent-primary)] truncate pr-6`}>
                        {msg.author_name || otherInfo?.name}
                    </div>
                )}

                <div className="text-[19px] leading-[1.45] break-words font-medium">
                    {msg.attachment_type === 'voice' ? (
                        <div className="flex items-center gap-3 py-1 min-w-[200px]">
                            <button
                                onClick={() => {
                                    if (!audioRef.current) {
                                        audioRef.current = new Audio(msg.attachment_url);
                                        audioRef.current.onended = () => {
                                            if (isMounted.current) setIsPlaying(false);
                                        };
                                    }
                                    if (audioRef.current.paused) {
                                        audioRef.current.play().then(() => {
                                            if (isMounted.current) setIsPlaying(true);
                                        }).catch(err => logger.error('[Voice] Play error:', err));
                                    } else {
                                        audioRef.current.pause();
                                        setIsPlaying(false);
                                    }
                                }}
                                className="w-10 h-10 rounded-[28px] bg-black/10 dark:bg-white/10 flex items-center justify-center shrink-0 hover:bg-black/20 dark:hover:bg-white/20 transition-colors active:scale-95 cursor-pointer"
                                aria-label="Reproduir missatge de veu"
                            >
                                {isPlaying ? <Pause size={20} className="text-current opacity-80" /> : <Mic size={20} className="text-current opacity-80" />}
                            </button>
                            <div className="flex-1 space-y-1 pr-6">
                                <div className="h-1 bg-black/20 dark:bg-white/20 rounded-full w-full overflow-hidden">
                                    <div className="h-full bg-current opacity-50 w-1/3 rounded-[28px]" />
                                </div>
                                <div className="text-[10px] opacity-70 flex justify-between">
                                    <span>{msg.voice_meta?.duration ? `${msg.voice_meta.duration}s` : '—'}</span>
                                    <span className="uppercase tracking-tighter">Bategat</span>
                                </div>
                            </div>
                        </div>
                    ) : msg.attachment_url ? (
                        <div className={`flex flex-col ${msg.content ? 'pb-1' : ''}`}>
                            {msg.attachment_type === 'image' ? (
                                <img 
                                    src={msg.attachment_url} 
                                    alt={msg.attachment_name || 'Imatge adjunta'} 
                                    className={`max-h-[280px] w-auto object-cover -mx-2.5 md:-mx-3 relative z-0
                                        ${(!isMe && (msg.author_name || otherInfo?.name)) ? 'mt-1 !rounded-[6px]' : '-mt-1.5 md:-mt-2'}
                                        ${msg.content ? 'mb-1 !rounded-t-[8px]' : '-mb-[3px] md:-mb-1 ' + ((!isMe && (msg.author_name || otherInfo?.name)) ? '!rounded-b-[8px]' : '!rounded-[8px]')}
                                        ${!(!isMe && (msg.author_name || otherInfo?.name)) && isMe ? '!rounded-tr-[2px]' : ''}
                                        ${!(!isMe && (msg.author_name || otherInfo?.name)) && !isMe ? '!rounded-tl-[2px]' : ''}
                                    `} 
                                />
                            ) : (
                                <div className="flex items-center gap-2 p-2 bg-black/5 dark:bg-white/5 rounded-xl border border-[var(--border-master)] mt-1 mb-1">
                                    <Paperclip size={16} />
                                    <span className="text-xs truncate max-w-[150px]">{msg.attachment_name || 'Arxiu'}</span>
                                </div>
                            )}
                            {msg.content && <div className="whitespace-pre-wrap mt-1 block pr-7">{renderContent(msg.content)}</div>}
                        </div>
                    ) : (
                         <div className="whitespace-pre-wrap pr-7">{renderContent(msg.content)}</div>
                    )}
                    
                    {/* WhatsApp Magic Spacer */}
                    <span className="inline-block w-[95px] h-[1em]" />
                </div>

                {/* WhatsApp Floating Timestamp */}
                <div 
                    onClick={(e) => { 
                        e.stopPropagation(); 
                        if (isActiveMenu) {
                            setContextMenuId(null);
                        } else {
                            const yPosition = e.clientY;
                            const windowHeight = window.innerHeight;
                            setContextMenuPosition(yPosition < windowHeight / 2 ? 'down' : 'up');
                            setContextMenuId(msg.id);
                        }
                    }}
                    className="absolute right-2 bottom-[3px] flex items-center justify-end gap-1.5 opacity-60 hover:opacity-100 transition-opacity cursor-pointer group/meta"
                >
                    <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-medium text-current opacity-75 pt-[1px] relative top-[1px]">
                            {msg.created_at ? new Date(msg.created_at).toLocaleDateString([], { day: '2-digit', month: '2-digit', year: '2-digit' }) : ''}
                        </span>
                        <span className="text-[12px] font-medium text-current opacity-90 pt-[1px] relative top-[1px] leading-none">
                            {msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : t('chat.now')}
                        </span>
                    </div>
                    {isMe && (
                        <div className="flex items-center -ml-[2px]">
                            {msg.read_at ? (
                                <CheckCheck size={14} className="text-[#53bdeb] animate-in zoom-in duration-300" title={t('chat.read')} />
                            ) : msg.status === 'delivered' ? (
                                <CheckCheck size={14} className="text-current opacity-60" title={t('chat.delivered')} />
                            ) : (
                                <Check size={14} className="text-current opacity-60" title={t('chat.sent')} />
                            )}
                        </div>
                    )}
                </div>

                {/* Top-Right Absolute Settings Gear */}
                <button 
                    onClick={(e) => { 
                        e.stopPropagation(); 
                        if (isActiveMenu) {
                            setContextMenuId(null);
                        } else {
                            const yPosition = e.clientY;
                            const windowHeight = window.innerHeight;
                            setContextMenuPosition(yPosition < windowHeight / 2 ? 'down' : 'up');
                            setContextMenuId(msg.id);
                        }
                    }}
                    className="absolute top-1.5 right-1.5 p-1 rounded-full bg-white/40 dark:bg-black/40 backdrop-blur-md opacity-30 hover:opacity-100 group-hover:opacity-100 transition-all duration-300 shadow-sm z-20 hover:rotate-90"
                >
                    <Settings size={14} className="text-current dark:text-gray-300" />
                </button>

                {/* WhatsApp Context Menu Dropdown */}
                {isActiveMenu && (
                    <div className={`absolute right-2 w-64 bg-white dark:bg-[#233138] border border-gray-200 dark:border-[#111b21]/10 shadow-[0_4px_12px_rgba(0,0,0,0.15)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.5)] rounded-lg py-1.5 z-dropdown animate-in fade-in zoom-in-95 duration-150 text-gray-800 dark:text-[#d1d7db]
                        ${contextMenuPosition === 'up' ? 'bottom-6 origin-bottom-right' : 'top-full -mt-2 origin-top-right'}
                    `}>
                        <button className="w-full flex items-center justify-between px-5 py-2.5 text-[15px] hover:bg-gray-100 dark:hover:bg-[#182229] transition-colors" onClick={() => setContextMenuId(null)}>{t('chat.reply')} <Reply size={16} className="opacity-70" /></button>
                        <button className="w-full flex items-center justify-between px-5 py-2.5 text-[15px] hover:bg-gray-100 dark:hover:bg-[#182229] transition-colors" onClick={() => setContextMenuId(null)}>{t('chat.react')} <Smile size={16} className="opacity-70" /></button>
                        <button className="w-full flex items-center justify-between px-5 py-2.5 text-[15px] hover:bg-gray-100 dark:hover:bg-[#182229] transition-colors" onClick={() => setContextMenuId(null)}>{t('chat.star')} <Star size={16} className="opacity-70" /></button>
                        <button className="w-full flex items-center justify-between px-5 py-2.5 text-[15px] hover:bg-gray-100 dark:hover:bg-[#182229] transition-colors" onClick={() => setContextMenuId(null)}>{t('chat.pin')} <Pin size={16} className="opacity-70" /></button>
                        <button className="w-full flex items-center justify-between px-5 py-2.5 text-[15px] hover:bg-gray-100 dark:hover:bg-[#182229] transition-colors" onClick={() => setContextMenuId(null)}>{t('chat.forward')} <Forward size={16} className="opacity-70" /></button>
                        <button className="w-full flex items-center justify-between px-5 py-2.5 text-[15px] hover:bg-[var(--theme-accent-primary)]/10 dark:hover:bg-[var(--theme-accent-primary)]/20 text-[var(--theme-accent-primary)] font-bold transition-colors" onClick={() => { setContextMenuId(null); if (onRequestMove) onRequestMove(msg); }}>{t('chat.move_to_expert')} <FolderInput size={16} className="opacity-90" /></button>
                        <button className="w-full flex items-center justify-between px-5 py-2.5 text-[15px] hover:bg-gray-100 dark:hover:bg-[#182229] transition-colors" onClick={() => { if(msg.content) navigator.clipboard.writeText(msg.content); setContextMenuId(null); }}>{t('chat.copy')} <Copy size={16} className="opacity-70" /></button>
                        <button className="w-full flex items-center justify-between px-5 py-[10px] text-[15px] hover:bg-gray-100 dark:hover:bg-[#182229] transition-colors border-b border-gray-100 dark:border-[#304049]" onClick={() => setContextMenuId(null)}>{t('chat.info')} <Info size={16} className="opacity-70" /></button>
                        
                        {msg.attachment_url && (
                            <>
                                <button className="w-full flex items-center justify-between px-5 py-2.5 text-[15px] hover:bg-gray-100 dark:hover:bg-[#182229] transition-colors mt-1" onClick={() => setContextMenuId(null)}>{t('chat.view')} <Eye size={16} className="opacity-70" /></button>
                                <button className="w-full flex items-center justify-between px-5 py-2.5 text-[15px] hover:bg-gray-100 dark:hover:bg-[#182229] transition-colors" onClick={() => setContextMenuId(null)}>{t('chat.save_downloads')} <Download size={16} className="opacity-70" /></button>
                                <button className="w-full flex items-center justify-between px-5 py-[10px] text-[15px] hover:bg-gray-100 dark:hover:bg-[#182229] transition-colors border-b border-gray-100 dark:border-[#304049]" onClick={() => setContextMenuId(null)}>{t('chat.save_as')} <DownloadCloud size={16} className="opacity-70" /></button>
                            </>
                        )}
                        
                        <button className="w-full flex items-center justify-between px-5 py-[10px] text-[15px] hover:bg-gray-100 dark:hover:bg-[#182229] transition-colors border-b border-gray-100 dark:border-[#304049] mt-1 text-red-500" onClick={() => setContextMenuId(null)}>{t('common.delete')} <Trash2 size={16} className="opacity-70" /></button>
                        <button className="w-full flex items-center justify-between px-5 py-[10px] text-[15px] hover:bg-gray-100 dark:hover:bg-[#182229] transition-colors mt-1" onClick={() => setContextMenuId(null)}>{t('chat.select_messages')} <CheckCircle2 size={16} className="opacity-70" /></button>
                    </div>
                )}
            </div>
        </div>
    );
});

export default MessageBubble;

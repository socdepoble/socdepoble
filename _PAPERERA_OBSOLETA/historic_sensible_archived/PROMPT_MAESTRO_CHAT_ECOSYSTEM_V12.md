> 📂 **Arxiu/Ruta:** `./_PAPERERA_OBSOLETA/historic_sensible_archived/PROMPT_MAESTRO_CHAT_ECOSYSTEM_V12.md`

# 🍊 MANIFIESTO V12: EL ECOSISTEMA DE MENSAJES (CHAT) "TECH-HUERTA"

**De:** Javi & Antigravity
**Para:** Equipo de IAs (DeepSeek, Qwen, Codex, ChatGPT)
**Misión:** Refactorizar `ChatMessageList.jsx` y `MessageBubble.jsx` al estándar Tech-Huerta V12.

**⚠️ IMPORTANTE PARA LA IA QUE LEE ESTO:**
El equipo ya ha refactorizado `ChatDetail.jsx` y `ChatHeader.jsx`. Ahora necesitamos que refactorices la lista de mensajes (`ChatMessageList.jsx`) y la burbuja de mensajes (`MessageBubble.jsx`) respetando TODA la lógica actual de Supabase, Virtuoso y Audios, pero cambiando toda su interfaz gráfica para que sea 100% "Tech-Huerta V12".

## 📚 1. REGLAS SAGRADAS "TECH-HUERTA V12" (M3 + BRUTALISMO RURAL)

1. **NO-LINE RULE (Cero Bordes):** Prohibidos los `border`, se usan contrastes de fondo (Tonal Background Shifts). El fondo abisal general es `#0e0e0e`.
2. **GEOMETRÍA M3 (Base 4):**
   - Spacing: Solo múltiplos de 4 (4, 8, 12, 16, 24, 32...).
   - Touch Targets: Botones y áreas clickables mínimo `48px` x `48px` (o padding sustancial de M3).
   - Border Radius: Usa `rounded-[16px]` o superior para contenedores, y botones totalmente redondos (`rounded-full`) o consistentes.
3. **PALETA TECH-HUERTA:**
   - **Naranja Huerta:** `#F97316` (para llamadas a la acción o mensajes "Propios / Sent").
   - **Azul Brillo:** `#169CF9` (contrastes secundarios o iconos activos).
   - **Negro Abisal:** `#0e0e0e` (fondos profundos).
   - **Surface / Cartas:** `#1A1A1A` o `#222222` para elevación.
   - **Blanco:** `#FFFFFF` o `#E5E2E1` para textos.
4. **ESTÉTICA DE LOS MENSAJES (COMO EL WHATSAPP OSCURO QUE DISEÑAMOS):**
   - **Mensajes Recibidos ("Ellos"):** Burbuja color Surface (`#1A1A1A`), texto `#E5E2E1`.
   - **Mensajes Enviados ("Míos"):** Burbuja color Naranja Puro (`#F97316`), texto Negro Puro (`#0e0e0e`). ¡Queremos un contraste brutal y premium!
   - Todo debe llevar transiciones suaves y respuestas hápticas (`active:scale-95`).

---

## 💻 2. ARCHIVOS ACTUALES PARA REFACTORIZAR

A continuación te paso el código exacto que tenemos ahora mismo. Manten la lógica intacta pero cambia el Tailwind para adaptarse.

### 📄 Archivo 1: `ChatMessageList.jsx`

```jsx
import React, { useMemo, useRef, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Virtuoso } from 'react-virtuoso';
import { MessageSquare, Briefcase, Globe, TrendingUp, Handshake } from 'lucide-react';
import MessageBubble from './MessageBubble';
import { supabaseService } from '../../services/supabaseService';

const ChatMessageList = React.memo(({
    realChatId,
    messages, 
    searchQuery, 
    humanId, 
    otherInfo, 
    contextMenuId, 
    setContextMenuId, 
    contextMenuPosition,
    setContextMenuPosition,
    setMessages,
    onMoveMessageToAgent,
    onRequestMove
}) => {
    const { t } = useTranslation();
    const virtuosoRef = useRef(null);
    
    // EXTREMA AUDIT: Padding index realista.
    const [firstItemIndex, setFirstItemIndex] = useState(10000); 
    const isLoadingOlderRef = useRef(false); // DEEPSEEK V5 FIX: Anti-duplication lock 

    const filteredMessages = useMemo(() => {
        return messages.filter(msg => !searchQuery || msg.content?.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [messages, searchQuery]);

    const loadOlder = useCallback(async () => {
        if (!messages.length || !realChatId || isLoadingOlderRef.current) return;
        
        isLoadingOlderRef.current = true; // DeepSeek Guard
        try {
            const oldestId = messages[0].id;
            const older = await supabaseService.getOlderMessages?.(realChatId, oldestId, 30);
            if (older && older.length > 0) {
                // Batch update recommended by react-virtuoso for prepend to prevent remounts
                React.startTransition(() => {
                    setFirstItemIndex(prev => prev - older.length);
                    setMessages(prev => [...older, ...prev]);
                });
            }
        } catch {
            // Failed silently for now on older unsupported
        } finally {
            isLoadingOlderRef.current = false;
        }
    }, [messages, realChatId, setMessages]);

    return (
        <div className="messages-container chat-messages-list flex-1 flex flex-col min-h-0 relative bg-theme-base isolate contain-layout">
            {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-4 h-full opacity-20">
                    <MessageSquare size={56} className="text-gray-600 mb-4" />
                    <p className="text-xs font-black text-gray-500 uppercase tracking-[0.3em] text-center">
                        {otherInfo?.name ? `PARLA AMB ${otherInfo.name.toUpperCase()}` : t('common.write_message')}
                    </p>
                </div>
            ) : (
                <Virtuoso
                    ref={virtuosoRef}
                    className="custom-scrollbar stable-scroll gpu-accelerate contain-layout"
                    style={{ height: '100%', overflowY: 'auto' }}
                    data={filteredMessages}
                    firstItemIndex={firstItemIndex}
                    initialTopMostItemIndex={filteredMessages.length - 1} 
                    
                    // EXTREMA AUDIT FIX: computeItemKey prevé el salt inasumible quan es fa un prepend d'històric
                    computeItemKey={(index, msg) => msg.id || index}
                    
                    increaseViewportBy={400} 
                    overscan={8} 
                    startReached={loadOlder}
                    followOutput={(isAtBottom) => isAtBottom ? 'smooth' : false}

                    components={{
                        Footer: () => (
                            <div className="py-2">
                                {otherInfo?.id?.startsWith('11111111-') && messages.length > 0 && messages[messages.length-1].sender_id === humanId && (
                                    <div className="flex items-center gap-2 text-[10px] font-black text-[var(--theme-accent-primary)] animate-pulse px-4">
                                        <span>BATEGANT...</span>
                                    </div>
                                )}
                            </div>
                        )
                    }}
                    itemContent={(index, msg) => {
                        const listIndex = index - firstItemIndex;
                        const nextMsg = filteredMessages[listIndex + 1];
                        const isSameSenderAsNext = nextMsg && nextMsg.sender_id === msg.sender_id;
                        
                        const isActiveMenu = contextMenuId === msg.id;
                        
                        return (
                            <MessageBubble
                                key={msg.id}
                                msg={msg}
                                isMe={msg.sender_id === humanId}
                                isSameSenderAsNext={isSameSenderAsNext}
                                otherInfo={otherInfo}
                                isActiveMenu={isActiveMenu}
                                contextMenuPosition={contextMenuPosition}
                                setContextMenuId={setContextMenuId}
                                setContextMenuPosition={setContextMenuPosition}
                                onMoveMessageToAgent={onMoveMessageToAgent}
                                onRequestMove={onRequestMove}
                            />
                        );
                    }}
                />
            )}
        </div>
    );
});

export default ChatMessageList;
```

---

### 📄 Archivo 2: `MessageBubble.jsx` (Base V12)

```jsx
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
    
    // EXTREME AUDIT V4.2 FIX: position
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
                            className="inline-flex items-center gap-1 text-[#169CF9] font-black cursor-pointer bg-[#169CF9]/10 px-1.5 pt-[1px] pb-[2px] rounded-md mx-0.5 transition-colors active:scale-95"
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
        <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} ${marginClass} animate-in fade-in slide-in-from-bottom-2 duration-300 ${isActiveMenu ? 'relative z-60' : ''} px-2 md:px-6`}>
            <div className={`group relative max-w-[85%] shadow-sm transition-all md:max-w-[70%] 
                ${isMe 
                    ? 'rounded-[16px] rounded-tr-[4px] bg-[#F97316] text-[#0e0e0e]' 
                    : 'rounded-[16px] rounded-tl-[4px] bg-[#1A1A1A] text-[#E5E2E1]'}
                ${isMe && 'ml-8'} ${!isMe && 'mr-8'} px-3 pb-[8px] pt-2 md:px-4 md:pt-[10px]`}>

                {/* Autor Name */}
                {(!isMe && (msg.author_name || otherInfo?.name)) && (
                    <div className="mb-0.5 truncate pr-6 font-['Epilogue'] text-[13px] font-bold tracking-wide text-[#F97316]">
                        {msg.author_name || otherInfo?.name}
                    </div>
                )}

                <div className="break-words font-['Noto_Sans'] text-[16px] font-medium leading-[1.45]">
                    {msg.attachment_type === 'voice' ? (
                        <div className="flex min-w-[200px] items-center gap-3 py-1">
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
                                className={`btn-tactile flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors ${isMe ? 'bg-[#0e0e0e]/10 hover:bg-[#0e0e0e]/20 text-[#0e0e0e]' : 'bg-white/10 hover:bg-white/20 text-[#169CF9]'}`}
                                aria-label="Reproduir missatge de veu"
                            >
                                {isPlaying ? <Pause size={24} className="fill-current" /> : <Play size={24} className="ml-1 fill-current" />}
                            </button>
                            <div className="flex-1 space-y-1.5 pr-6">
                                <div className={`h-[6px] w-full overflow-hidden rounded-full ${isMe ? 'bg-[#0e0e0e]/20' : 'bg-white/20'}`}>
                                    <div className={`h-full w-1/3 rounded-full ${isMe ? 'bg-[#0e0e0e]/60' : 'bg-[#169CF9]'}`} />
                                </div>
                                <div className="flex justify-between text-[11px] font-bold opacity-70">
                                    <span>{msg.voice_meta?.duration ? `${msg.voice_meta.duration}s` : '—'}</span>
                                    <span className="tracking-widest uppercase font-['Epilogue']">{t('chat.beaten', 'BATEGAT')}</span>
                                </div>
                            </div>
                        </div>
                    ) : msg.attachment_url ? (
                        <div className={`flex flex-col ${msg.content ? 'pb-1' : ''}`}>
                            {msg.attachment_type === 'image' ? (
                                <img 
                                    src={msg.attachment_url} 
                                    alt={msg.attachment_name || 'Imatge adjunta'} 
                                    className={`relative z-0 max-h-[280px] w-auto object-cover -mx-3 md:-mx-4
                                        ${(!isMe && (msg.author_name || otherInfo?.name)) ? 'mt-1 !rounded-[12px]' : '-mt-2 md:-mt-2.5'}
                                        ${msg.content ? 'mb-2 !rounded-t-[12px]' : '-mb-2 ' + ((!isMe && (msg.author_name || otherInfo?.name)) ? '!rounded-b-[12px]' : '!rounded-[12px]')}
                                        ${!(!isMe && (msg.author_name || otherInfo?.name)) && isMe ? '!rounded-tr-[4px]' : ''}
                                        ${!(!isMe && (msg.author_name || otherInfo?.name)) && !isMe ? '!rounded-tl-[4px]' : ''}
                                    `} 
                                />
                            ) : (
                                <div className={`mb-2 mt-1 flex items-center gap-3 rounded-[12px] p-3 ${isMe ? 'bg-[#0e0e0e]/10' : 'bg-white/5'}`}>
                                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${isMe ? 'bg-[#0e0e0e]/20' : 'bg-white/10'}`}>
                                        <Paperclip size={20} />
                                    </div>
                                    <span className="max-w-[150px] truncate text-sm font-semibold">{msg.attachment_name || 'Arxiu'}</span>
                                </div>
                            )}
                            {msg.content && <div className="mt-1 block whitespace-pre-wrap pr-7">{renderContent(msg.content)}</div>}
                        </div>
                    ) : (
                         <div className="whitespace-pre-wrap pr-7 leading-[1.6] tracking-wide">{renderContent(msg.content)}</div>
                    )}
                    
                    {/* WhatsApp Magic Spacer */}
                    <span className="inline-block h-[1em] w-[80px]" />
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
                    className="group/meta absolute bottom-[4px] right-3 flex cursor-pointer items-center justify-end gap-1 opacity-70 transition-opacity hover:opacity-100"
                >
                    <div className="flex items-center gap-1 font-['Noto_Sans']">
                        <span className="relative top-[1px] pt-[1px] text-[10px] font-bold opacity-80">
                            {msg.created_at ? new Date(msg.created_at).toLocaleDateString([], { day: '2-digit', month: '2-digit', year: '2-digit' }) : ''}
                        </span>
                        <span className="relative top-[1px] pt-[1px] text-[11px] font-bold leading-none opacity-100">
                            {msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : t('chat.now', 'Ara')}
                        </span>
                    </div>
                    {isMe && (
                        <div className="-ml-[2px] flex items-center">
                            {msg.read_at ? (
                                <CheckCheck size={16} strokeWidth={3} className="animate-in zoom-in text-[#169CF9] duration-300" title={t('chat.read')} />
                            ) : msg.status === 'delivered' ? (
                                <CheckCheck size={16} strokeWidth={2.5} className="opacity-60" title={t('chat.delivered')} />
                            ) : (
                                <Check size={16} strokeWidth={2.5} className="opacity-60" title={t('chat.sent')} />
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
                    className={`btn-tactile absolute right-2 top-2 z-20 rounded-full p-2 opacity-0 shadow-sm backdrop-blur-md transition-all duration-300 group-hover:opacity-100 hover:rotate-90 md:right-[-40px] md:top-1/2 md:-translate-y-1/2 md:bg-transparent md:shadow-none ${isMe ? 'bg-[#0e0e0e]/20 text-[#0e0e0e] md:text-[#E5E2E1]' : 'bg-white/20 text-[#E5E2E1] md:left-[-40px] md:right-auto'}`}
                >
                    <Settings size={18} strokeWidth={2.5} className="md:opacity-50" />
                </button>

                {/* Context Menu Dropdown - Glass Rural */}
                {isActiveMenu && (
                    <div className={`absolute right-0 z-50 w-64 origin-top-right animate-in fade-in zoom-in-95 rounded-[28px] bg-[#222222]/95 py-2 text-[15px] font-medium text-[#E5E2E1] shadow-[0_8px_30px_rgb(0,0,0,0.6)] backdrop-blur-xl duration-150
                        ${contextMenuPosition === 'up' ? 'bottom-8 origin-bottom-right' : 'top-full mt-2'}
                    `}>
                        <button className="flex w-full items-center justify-between px-5 py-3 transition-colors hover:bg-[#F97316]/10 hover:text-[#F97316]" onClick={() => setContextMenuId(null)}>{t('chat.reply', 'Respondre')} <Reply size={18} strokeWidth={2} /></button>
                        <button className="flex w-full items-center justify-between px-5 py-3 transition-colors hover:bg-[#F97316]/10 hover:text-[#F97316]" onClick={() => setContextMenuId(null)}>{t('chat.react', 'Reaccionar')} <Smile size={18} strokeWidth={2} /></button>
                        <button className="flex w-full items-center justify-between px-5 py-3 transition-colors hover:bg-[#F97316]/10 hover:text-[#F97316]" onClick={() => setContextMenuId(null)}>{t('chat.copy', 'Copiar')} <Copy size={18} strokeWidth={2} /></button>
                        <button className="flex w-full items-center justify-between px-5 py-3 font-bold text-[#169CF9] transition-colors hover:bg-[#169CF9]/10" onClick={() => { setContextMenuId(null); if (onRequestMove) onRequestMove(msg); }}>{t('chat.move_to_expert', "Moure a l'expert")} <FolderInput size={18} strokeWidth={2.5} /></button>
                        <button className="mt-1 flex w-full items-center justify-between px-5 py-3 text-[#EF4444] transition-colors hover:bg-[#EF4444]/10" onClick={() => setContextMenuId(null)}>{t('common.delete', 'Esborrar')} <Trash2 size={18} strokeWidth={2} /></button>
                    </div>
                )}
            </div>
        </div>
    );
});

export default MessageBubble;
```

---

## 🔥 QUÉ TIENES QUE HACER 🔥
1. Lee detenidamente el nuevo paradigma de Tech-Huerta.
2. Analiza el código adjunto, especialmente `ChatMessageList`. Verifica que el `bg-theme-base` heredadado o el empty-state se limpien y usen `<div className="... bg-[#0e0e0e]">` en lugar de variables antiguas, adaptándolo al estilo.
3. Asegúrate de que `MessageBubble` está optimizado visualmente tal y como requiere el estilo. Ya incluye base de cambios, pero refínalo si lo ves conveniente.
4. Devuelve los **bloques de código completos y refactorizados** en JSX listos para producción para ambos componentes. ¡Sin recortes!

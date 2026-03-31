# 🚀 PROMPT MAESTRO "RESETEO TECH-HUERTA" (V12)
*Copia absolutamente todo el contenido de este documento y envíaselo a la IA (Codex, Qwen o DeepSeek) en un solo mensaje para arrancar.*

---

**¡ATENCIÓN, EQUIPO (DeepSeek / Qwen / Codex)! Cambio de Rumbo Arquitectónico Nivel DIOS.** 🚨

Soy Javi (con Antigravity operando en la implementación local). Tras blindar la arquitectura del backend, hemos tomado una decisión estructural radical para el frontend: **Se acabó parchear CSS heredado.**

Vamos a reconstruir el diseño de la app componente a componente **EMPEZANDO DESDE CERO**. Nuestra meta es lograr la estructura más increíble, ligera, estable y bella jamás creada para una plataforma rural/descentralizada. 

La fórmula es innegociable:
**[Arquitectura Matemática Perfecta (M3 / iOS)] + [Identidad "Tech-Huerta" / Rural Brutalism] = Súper Componente.**

Vuestro rol como mis **Arquitectos de Design System** es el siguiente:
1. **Desnudad el código al máximo:** Eliminad todo el CSS fantasma, utilidades Tailwind redundantes o contenedores flex/grid innecesarios del componente víctima que os envío abajo.
2. **Aplicad Arquitectura de Élite:** Reconstruid el esqueleto estructural basándoos en las proporciones y matemáticas de las mejores apps del mundo (touch targets de 48px, padding rítmico base-4, jerarquías visuales limpias).
3. **Inyectad la Identidad Tech-Huerta** siguiendo los principios sagrados de nuestro Manifiesto Visual.

---

## 🍊 EL MANIFIESTO VISUAL OBLIGATORIO (Tech-Huerta)

Mientras que la estructura y el DOM subyacente se van a rehacer estandarizados, **el aspecto, la identidad y el "alma" deben seguir estrictamente estas reglas.** 

### 1. Filosofía: "El Brutalismo Rural"
Queremos alejarnos de la frialdad corporativa. Buscamos una app premium y tecnológica, pero con el calor y la textura de un pueblo.
- **Táctil antes que Digital:** Todo debe parecer que tiene peso e inercia física (framer-motion).
- **Sin Líneas (No-Line Rule):** Cero bordes sólidos (`border-gray-etc`) de 1px para separar cosas. Se separa mediante opacidades, sombras suaves, desenfoques o contrastes de color tonal.

### 2. Paleta de Colores (Dark Mode First)
La app vive en un dark mode cálido y profundo, contrastado por Naranja.
- **Fondos (Capas por elevación):** Base `#131313`, Containers `#1C1B1B`, Overlays `#2A2A2A`.
- **Acento (Terra Vibrant):** `#F97316` (Orange-500) para botones CTA, activos y elementos cruciales.
- **Textos:** Principal `#E5E2E1` (Gris roto elegante), Secundario `#A1A1AA` (Zinc-400), nunca blanco puro absoluto para párrafos largos para no fatigar la vista.

### 3. Tipografía Rebelde
- **Display/Titulares: `Epilogue`** (Últilízala en `font-bold italic uppercase` para grandes titulares o headers masivos).
- **Cuerpo/UI: `Plus Jakarta Sans`** (Limpio y legible para chats y descripciones).

### 4. Pilares Visuales Específicos
- **El "Glass-Rural":** Elementos flotantes o sticky llevan fondo semi-transparente negro (`bg-black/60`) + un brutal efecto borroso y saturado (`backdrop-blur-xl backdrop-saturate-150`).
- **Botones Táctiles:** Curvatura extrema (`rounded-full` para botones, `rounded-3xl` o `rounded-[32px]` para tarjetas gordas). Implementar inercia al toque con framer-motion (`whileTap={{ scale: 0.95 }}`).

---

## 🔪 LA PRIMERA VÍCTIMA

Habéis asimilado las reglas. Es hora de demostrarlo. 
Aquí abajo tenéis el código crudo y heredado de **`ChatDetail.jsx`**. 
Rediseñad toda su estructura visual. Limpiad los espaguetis de Tailwind, aplicad la matemática de M3 y fundidlo todo con nuestro estilo **Tech-Huerta**.

Devolvedme el componente ensamblado, perfecto y listo para producción.

### CÓDIGO FUENTE DE ChatDetail.jsx:

```jsx
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '../context/NavigationContext';
import { useModalDispatch } from '../context/ModalContext';
import { iaiaService } from '../services/iaiaService';
import { supabaseService } from '../services/supabaseService';
import { speechService } from '../services/speechService';
import { supabase } from '../supabaseClient';
import { logger } from '../utils/logger';
import toast from '../utils/toast';

import ChatMessageList from './chat/ChatMessageList';
import ChatInputArea from './chat/ChatInputArea';
import ChatHeader from './chat/ChatHeader';
import { useChatState } from '../hooks/useChatState';
import ChatMoveSelectorModal from './chat/ChatMoveSelectorModal';

const ChatDetail = () => {
    const { chatSettings } = useNavigation();
    const { id } = useParams();
    const { t } = useTranslation();
    const { user, impersonatedProfile, activeEntityId, isSuperAdmin, isGuest } = useAuth();
    const { setIsGuestInteractionModalOpen } = useModalDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    // 1. Correcció de l'ID Aleatori Zombie (Grok Audit)
    const guestIdRef = useRef(`anon-${Math.random().toString(36).substr(2, 9)}`);
    const humanId = isSuperAdmin && impersonatedProfile ? impersonatedProfile.id : user?.id;
    const currentUserId = useMemo(() => user?.id || (user?.isAnonymous ? guestIdRef.current : 'guest'), [user?.id, user?.isAnonymous]);

    // 2. Extracció Total de l'Estat de Supabase 
    const { chat, realChatId, messages, setMessages, addMessage, loading } = useChatState({
        id, currentUserId, userIsAnonymous: user?.isAnonymous, readReceipts: chatSettings.readReceipts
    });

    // 3. Estat Local de la UI
    const [isHeaderSearchOpen, setIsHeaderSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);
    const [contextMenuId, setContextMenuId] = useState(null);
    const [contextMenuPosition, setContextMenuPosition] = useState('up');
    const [isSending, setIsSending] = useState(false);
    
    // Nou estat pel Routing Visual de qualsevol missatge
    const [msgToMove, setMsgToMove] = useState(null);
    
    // Refs
    const isSendingRef = useRef(false);
    const isComponentMounted = useRef(true);

    const activeChatRef = useRef(realChatId);
    
    useEffect(() => {
        isComponentMounted.current = true;
        return () => { 
            isComponentMounted.current = false; 
        };
    }, []);

    useEffect(() => {
        activeChatRef.current = realChatId;
    }, [realChatId]);

    const isP1Current = chat?.participant_1_id === currentUserId;
    const otherInfo = useMemo(() => chat?.other_info || (isP1Current ? chat?.p2_info : chat?.p1_info), [chat, isP1Current]);

    const isIAIA = id.startsWith('11111111-') || otherInfo?.id?.startsWith('11111111-');
    const isNPC = !isIAIA && id && id.length < 32;

    const handleSendMessage = useCallback(async ({ text, attachedFile, voiceData, onSuccess, onError }) => {
        if (user?.isAnonymous && !isIAIA) {
            setIsGuestInteractionModalOpen(true);
            return;
        }

        const isVoiceMessage = !!voiceData;
        let finalContent = text?.trim() || '';
        
        if (!finalContent && isVoiceMessage && voiceData?.transcript) {
             finalContent = voiceData.transcript.trim();
        }

        if (isSendingRef.current || (!finalContent && !attachedFile && !isVoiceMessage)) return;
        
        isSendingRef.current = true;
        setIsSending(true);

        if (isNPC) {
            toast.custom(() => (
                <div className="bg-theme-panel text-theme-text px-4 py-3 flex gap-4 items-center w-full max-w-sm border border-[var(--border-master)] shadow-xl pointer-events-auto rounded z-toast">
                    <span className="text-sm font-medium opacity-90">{t('chat.iaia_forwarding_toast')}</span>
                </div>
            ), { duration: 3000 });

            setTimeout(() => {
                if (isComponentMounted.current) {
                    navigate('/chats/11111111-1a1a-0000-0000-000000000000', { 
                        state: { 
                            autoForwardParams: {
                                text: t('chat.forward_entity_query', { name: otherInfo?.name || 'Local', content: finalContent }),
                                attachedFile: attachedFile,
                                voiceData: voiceData
                            }
                        }
                    });
                }
            }, 1000);
            return;
        }

        if (finalContent === '/solatge interact' && !isVoiceMessage) {
            iaiaService.simulateAgentDebate().catch(err => logger.error('[Solatge Interact]', err));
            addMessage({ id: `cmd-req-${Date.now()}`, sender_id: humanId, content: finalContent, created_at: new Date().toISOString() });
            addMessage({ id: `cmd-res-${Date.now()}`, sender_id: 'system', content: t('chat.remote_beat_debate'), created_at: new Date().toISOString() });
            setIsSending(false);
            isSendingRef.current = false;
            if (onSuccess) onSuccess();
            return;
        }
        
        let timerId;
        try {
            let fileUrl = null;
            if (isVoiceMessage && voiceData.blob) {
                const MimeType = voiceData.blob.type || 'audio/webm';
                const extension = MimeType.includes('mp4') ? 'mp4' : (MimeType.includes('ogg') ? 'ogg' : 'webm');
                const fileName = `voice-${Date.now()}-${humanId}.${extension}`;
                
                let uploadResult = await supabase.storage.from('voice-messages').upload(fileName, voiceData.blob, { contentType: MimeType });
                
                if (uploadResult.error && (uploadResult.error.statusCode === '400' || uploadResult.error.statusCode === '404')) {
                    uploadResult = await supabase.storage.from('documents').upload(fileName, voiceData.blob, { contentType: MimeType });
                    if (!uploadResult.error) {
                        const { data } = supabase.storage.from('documents').getPublicUrl(fileName);
                        fileUrl = data.publicUrl;
                    }
                } else if (!uploadResult.error) {
                    const { data } = supabase.storage.from('voice-messages').getPublicUrl(fileName);
                    fileUrl = data.publicUrl;
                }
                
                if (!fileUrl) throw uploadResult.error || new Error('Failed to upload audio');
            } else if (attachedFile) {
                const extension = attachedFile.name.split('.').pop() || 'unknown';
                const fileName = `attach-${Date.now()}-${humanId}.${extension}`;
                const bucketName = attachedFile.type.startsWith('image/') ? 'images' : 'documents';
                const { error: uploadError } = await supabase.storage.from(bucketName).upload(fileName, attachedFile, { contentType: attachedFile.type });
                if (uploadError) throw uploadError;
                const { data } = supabase.storage.from(bucketName).getPublicUrl(fileName);
                fileUrl = data.publicUrl;
            }

            const controller = new AbortController();
            timerId = setTimeout(() => controller.abort('NETWORK_TIMEOUT'), 12000);
            
            const payload = {
                conversationId: realChatId,
                senderId: currentUserId,
                senderEntityId: activeEntityId,
                content: finalContent || (isVoiceMessage ? t('chat.voice_message') : ''),
                isGuest: user?.isAnonymous,
                attachmentUrl: fileUrl,
                attachmentType: isVoiceMessage ? 'voice' : (attachedFile ? (attachedFile.type.startsWith('image/') ? 'image' : 'file') : null),
                attachment_name: isVoiceMessage ? t('chat.voice_note') : (attachedFile ? attachedFile.name : null),
                voice_meta: isVoiceMessage && voiceData.duration ? { duration: voiceData.duration } : null
            };

            const result = await supabaseService.sendSecureMessage(payload, controller.signal);
            
            if (timerId) clearTimeout(timerId);
            if (!result?.id) throw new Error(t('chat.network_timeout'));
            if (!isComponentMounted.current) return; 

            addMessage(result);
            if (onSuccess) onSuccess(); 

            if (isIAIA) {
                let audioData = null;
                if (isVoiceMessage && voiceData?.blob) {
                    audioData = await new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                           const b = reader.result;
                           const [meta, data] = b.split(',');
                           resolve({ mimeType: meta.split(':')[1].split(';')[0], data });
                        };
                        reader.readAsDataURL(voiceData.blob);
                    });
                }
                const textFinal = finalContent || (attachedFile ? t('chat.attachment_sent') : (isVoiceMessage ? t('chat.voice_message_received') : ''));
                const capturedChatId = realChatId; 
                iaiaService.generateAIAResponse(realChatId, textFinal, otherInfo?.id || id, {
                    attachmentUrl: fileUrl,
                    attachmentType: isVoiceMessage ? 'voice' : (attachedFile ? (attachedFile.type.startsWith('image/') ? 'image' : 'file') : null),
                    audioData: audioData,
                    onFinish: (finalMsg) => {
                        if (!isComponentMounted.current || activeChatRef.current !== capturedChatId) return;
                        if (finalMsg && typeof finalMsg === 'object') {
                            setMessages(prev => {
                                const withoutFiller = prev.filter(m => !m.metadata?.is_iaia_filler);
                                return [...withoutFiller, {
                                    ...finalMsg,
                                    id: finalMsg.id || `final-resp-${Date.now()}`,
                                    created_at: finalMsg.created_at || new Date().toISOString()
                                }];
                            });
                            if (isVoiceMessage && finalMsg.content) {
                                speechService.speak(finalMsg.content, 'va');
                            }
                        }
                    }
                }).then(filler => {
                    if (!isComponentMounted.current || activeChatRef.current !== capturedChatId) return;
                    if (filler && typeof filler === 'object') addMessage(filler);
                }).catch(err => logger.error('[ChatDetail] Bug:', err));
            }

        } catch (err) {
            if (timerId) clearTimeout(timerId);
            if (!isComponentMounted.current) return;
            logger.error('Error enviant:', err);
            if (onError) onError();
        } finally {
            if (isComponentMounted.current) {
                setIsSending(false);
            }
            isSendingRef.current = false;
        }
    }, [id, otherInfo?.id, otherInfo?.name, isIAIA, isNPC, navigate, user?.isAnonymous, realChatId, humanId, currentUserId, activeEntityId, addMessage, setIsGuestInteractionModalOpen, setMessages, t]);

    useEffect(() => {
        if (location.state?.autoForwardParams && id === '11111111-1a1a-0000-0000-000000000000') {
            const params = location.state.autoForwardParams;
            window.history.replaceState({}, document.title); 
            
            setTimeout(() => {
                if (isComponentMounted.current && !isSendingRef.current) {
                    handleSendMessage({
                        text: params.text,
                        attachedFile: params.attachedFile,
                        voiceData: params.voiceData
                    });
                }
            }, 800);
        }
    }, [location.state, id, handleSendMessage]);

    const handleMoveMessageToAgent = useCallback(async (targetAgentId, messageId) => {
        const msgIndex = messages.findIndex(m => m.id === messageId);
        if (msgIndex === -1) return;
        const aiMsg = messages[msgIndex];

        let userMsg = null;
        for (let i = msgIndex - 1; i >= 0; i--) {
            if (!messages[i].is_ai && !messages[i].metadata?.is_iaia_filler) {
                userMsg = messages[i];
                break;
            }
        }

        const originalMessages = [...messages];
        const msgsToMove = userMsg ? [userMsg, aiMsg] : [aiMsg];
        setMessages(prev => prev.filter(m => !msgsToMove.find(mov => mov.id === m.id)));

        let undoTimeout;

        const performMove = async () => {
            try {
                if (user?.isAnonymous) {
                    const sourceKey = `sdp_guest_chat_${otherInfo?.id || id}`;
                    const targetKey = `sdp_guest_chat_${targetAgentId}`;
                    const currentStorage = JSON.parse(sessionStorage.getItem(sourceKey) || '[]');
                    const filteredSource = currentStorage.filter(m => !msgsToMove.find(mov => mov.id === m.id));
                    sessionStorage.setItem(sourceKey, JSON.stringify(filteredSource));

                    const targetStorage = JSON.parse(sessionStorage.getItem(targetKey) || '[]');
                    const newTargetMsgs = msgsToMove.map(m => ({...m, conversation_id: targetAgentId }));
                    sessionStorage.setItem(targetKey, JSON.stringify([...targetStorage, ...newTargetMsgs]));
                } else {
                    const targetConv = await supabaseService.getOrCreateConversation(currentUserId, 'user', targetAgentId, 'entity');
                    if (targetConv?.id) {
                        for (const m of msgsToMove) {
                            await supabase.from('messages').update({ conversation_id: targetConv.id }).eq('id', m.id);
                        }
                        window.dispatchEvent(new Event('chat_updated'));
                    }
                }
            } catch (err) {
                logger.error('[Move] Failure moving messages:', err);
                if (isComponentMounted.current) setMessages(originalMessages);
            }
        };

        const undoAction = () => {
            clearTimeout(undoTimeout);
            if (isComponentMounted.current) setMessages(originalMessages);
            navigate(`/chats/${otherInfo?.id || id}`, { replace: true });
        };

        toast.custom((toastData) => (
            <div className="bg-[#1C1B1B] text-[#E5E2E1] px-4 py-3 flex gap-4 items-center w-full max-w-sm border border-white/5 shadow-2xl rounded-2xl z-toast">
                <span className="text-sm font-medium opacity-90">{t('chat.moved_to_local_expert')}</span>
                <button 
                    onClick={() => { undoAction(); toast.dismiss(toastData.id); }} 
                    className="text-[#F97316] text-sm font-black btn-tactile hover:text-[#ff8a38]"
                >
                    {t('chat.undo')}
                </button>
            </div>
        ), { duration: 4000 });

        undoTimeout = setTimeout(() => { performMove(); }, 4000);
        navigate(`/chats/${targetAgentId}`, { state: { optimisticMessages: msgsToMove } });
    }, [messages, setMessages, user, id, otherInfo, currentUserId, navigate, t]);

    if (loading) return <div className="flex-1 bg-[#131313] flex items-center justify-center"><Loader2 className="animate-spin text-[#F97316]" size={40} /></div>;

    return (
        <div className="chat-detail-container flex-1 flex flex-col min-h-0 min-w-0 relative isolate" onClick={() => setContextMenuId(null)}>
            <ChatHeader 
                otherInfo={otherInfo}
                realChatId={realChatId}
                isHeaderSearchOpen={isHeaderSearchOpen}
                setIsHeaderSearchOpen={setIsHeaderSearchOpen}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                isSettingsMenuOpen={isSettingsMenuOpen}
                setIsSettingsMenuOpen={setIsSettingsMenuOpen}
            />

            <div className="chat-split-view-container flex-1 flex flex-col min-h-0 min-w-0 bg-[#131313] isolate">
                <div className="chat-messages-panel flex-1 flex flex-col min-h-0 min-w-0 relative isolate">
                    
                    {isNPC && (
                        <div className="bg-[#1C1B1B] text-[#F97316] text-[13px] px-4 py-3 text-center z-10 shrink-0">
                            <span className="font-bold">{t('chat.npc_delegate_title')}</span> {t('chat.npc_delegate_desc')}<strong className="underline">IAIA MarIA</strong>{t('chat.npc_delegate_desc_2')}
                        </div>
                    )}

                    {isGuest && otherInfo?.id?.startsWith('11111111-') && (
                        <div className="bg-[#2A2A2A] text-[#F97316] text-[15px] px-4 py-3 text-center shadow-lg z-10 shrink-0">
                            <span className="font-bold">{t('common.warning', 'Avís')}:</span> {t('chat.guest_warning_text')} {' '}
                            <a href="/registre" className="font-bold underline cursor-pointer">{t('chat.guest_warning_link', "Registra't per a guardar las converses.")}</a>
                        </div>
                    )}

                    <ChatMessageList 
                        realChatId={realChatId}
                        messages={messages} 
                        setMessages={setMessages}
                        searchQuery={searchQuery} 
                        humanId={humanId} 
                        otherInfo={otherInfo} 
                        contextMenuId={contextMenuId} 
                        setContextMenuId={setContextMenuId} 
                        contextMenuPosition={contextMenuPosition} 
                        setContextMenuPosition={setContextMenuPosition} 
                        onMoveMessageToAgent={handleMoveMessageToAgent}
                        onRequestMove={setMsgToMove}
                    />

                    <ChatInputArea 
                        humanId={humanId}
                        id={id}
                        otherInfo={otherInfo}
                        activeEntityId={activeEntityId}
                        user={user}
                        isGuestInteractionModalOpen={isGuest}
                        setIsGuestInteractionModalOpen={setIsGuestInteractionModalOpen}
                        handleSendMessage={handleSendMessage}
                        isSending={isSending}
                    />

                </div>
            </div>
            
            {msgToMove && (
                <ChatMoveSelectorModal 
                    msg={msgToMove}
                    onClose={() => setMsgToMove(null)}
                    onSelect={(targetId) => {
                        setMsgToMove(null);
                        handleMoveMessageToAgent(targetId, msgToMove.id);
                    }}
                />
            )}
        </div>
    );
};

export default ChatDetail;
```

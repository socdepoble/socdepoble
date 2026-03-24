import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '../context/NavigationContext';
import { useModal } from '../context/ModalContext';
import { iaiaService } from '../services/iaiaService';
import { supabaseService } from '../services/supabaseService';
import { supabase } from '../supabaseClient';
import { logger } from '../utils/logger';

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
    const { setIsGuestInteractionModalOpen } = useModal();
    // [Removed useLocation state to prevent unneeded re-renders]
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
        return () => { isComponentMounted.current = false; };
    }, []);

    useEffect(() => {
        activeChatRef.current = realChatId;
    }, [realChatId]);

    const isP1Current = chat?.participant_1_id === currentUserId;
    const otherInfo = useMemo(() => chat?.other_info || (isP1Current ? chat?.p2_info : chat?.p1_info), [chat, isP1Current]);

    // EXTREME AUDIT V4 FIX: handleSendMessage sense includes d'isSending per no rebentar ChatInputArea React.memo
    const handleSendMessage = useCallback(async ({ text, attachedFile, voiceData, onSuccess, onError }) => {
        const isIAIA = id.startsWith('11111111-') || otherInfo?.id?.startsWith('11111111-');
        if (user?.isAnonymous && !isIAIA) {
            setIsGuestInteractionModalOpen(true);
            return;
        }

        const isVoiceMessage = !!voiceData;
        const finalContent = text?.trim() || '';
        
        if (isSendingRef.current || (!finalContent && !attachedFile && !isVoiceMessage)) return;
        
        // Optimistic UI lock
        isSendingRef.current = true;
        setIsSending(true);

        // Els commands del solatge no processen imatges ni veu de moment.
        if (finalContent === '/solatge interact' && !isVoiceMessage) {
            iaiaService.simulateAgentDebate().catch(err => logger.error('[Solatge Interact]', err));
            addMessage({ id: `cmd-req-${Date.now()}`, sender_id: humanId, content: finalContent, created_at: new Date().toISOString() });
            addMessage({ id: `cmd-res-${Date.now()}`, sender_id: 'system', content: '⚙️ Bategat remot: Iniciant debat entre IAIAs...', created_at: new Date().toISOString() });
            setIsSending(false);
            isSendingRef.current = false;
            if (onSuccess) onSuccess();
            return;
        }
        
        let timerId;
        try {
            let fileUrl = null;
            if (isVoiceMessage && voiceData.blob) {
                const fileName = `voice-${Date.now()}-${humanId}.webm`;
                const { error: uploadError } = await supabase.storage.from('voice-messages').upload(fileName, voiceData.blob, { contentType: 'audio/webm' });
                if (uploadError) throw uploadError;
                const { data } = supabase.storage.from('voice-messages').getPublicUrl(fileName);
                fileUrl = data.publicUrl;
            } else if (attachedFile) {
                const extension = attachedFile.name.split('.').pop() || 'unknown';
                const fileName = `attach-${Date.now()}-${humanId}.${extension}`;
                const bucketName = attachedFile.type.startsWith('image/') ? 'images' : 'documents';
                const { error: uploadError } = await supabase.storage.from(bucketName).upload(fileName, attachedFile, { contentType: attachedFile.type });
                if (uploadError) throw uploadError;
                const { data } = supabase.storage.from(bucketName).getPublicUrl(fileName);
                fileUrl = data.publicUrl;
            }

            // AbortController exigit per l'auditoria Zombi
            const controller = new AbortController();
            timerId = setTimeout(() => controller.abort('NETWORK_TIMEOUT'), 12000);
            
            const payload = {
                conversationId: realChatId,
                senderId: humanId,
                senderEntityId: activeEntityId,
                content: finalContent || (isVoiceMessage ? '🎤 Missatge de veu' : ''),
                isGuest: user?.isAnonymous,
                attachmentUrl: fileUrl,
                attachmentType: isVoiceMessage ? 'voice' : (attachedFile ? (attachedFile.type.startsWith('image/') ? 'image' : 'file') : null),
                attachment_name: isVoiceMessage ? 'Nota de veu' : (attachedFile ? attachedFile.name : null),
                voice_meta: isVoiceMessage && voiceData.duration ? { duration: voiceData.duration } : null
            };

            const result = await supabaseService.sendSecureMessage(payload, controller.signal);
            
            if (timerId) clearTimeout(timerId);
            if (!result?.id) throw new Error('Fallada forçada per xarxa o timeout');

            if (!isComponentMounted.current) return; // DEEPSEEK V5.1 FINAL FIX

            addMessage(result);
            if (onSuccess) onSuccess(); // Netegem estat volatile del fill.

            if (isIAIA) {
                const textFinal = finalContent || (attachedFile ? '[L\'usuari t\' acaba d\'enviar un document o fotografia]' : '');
                const capturedChatId = realChatId; // EXTREM AUDIT V4: Race Condition Shield
                iaiaService.generateAIAResponse(realChatId, textFinal, otherInfo?.id || id, {
                    attachmentUrl: fileUrl,
                    attachmentType: isVoiceMessage ? 'voice' : (attachedFile ? (attachedFile.type.startsWith('image/') ? 'image' : 'file') : null),
                    onFinish: (finalMsg) => {
                        if (!isComponentMounted.current || activeChatRef.current !== capturedChatId) return;
                        if (finalMsg && typeof finalMsg === 'object') {
                            setMessages(prev => {
                                // Remove the filler
                                const withoutFiller = prev.filter(m => !m.metadata?.is_iaia_filler);
                                return [...withoutFiller, {
                                    ...finalMsg,
                                    id: finalMsg.id || `final-resp-${Date.now()}`,
                                    created_at: finalMsg.created_at || new Date().toISOString()
                                }];
                            });
                        }
                    }
                }).then(filler => {
                    if (!isComponentMounted.current || activeChatRef.current !== capturedChatId) return;
                    if (filler && typeof filler === 'object') addMessage(filler);
                }).catch(err => logger.error('[ChatDetail] Bug al motor d\'IAIA:', err));
            }

        } catch (err) {
            if (timerId) clearTimeout(timerId);
            if (!isComponentMounted.current) return; // DEEPSEEK V5 FIX: Zombie component state guard
            logger.error('Error enviant el missatge:', err);
            if (onError) onError();
        } finally {
            if (isComponentMounted.current) {
                setIsSending(false);
            }
            isSendingRef.current = false;
        }
    }, [id, otherInfo?.id, user?.isAnonymous, realChatId, humanId, activeEntityId, addMessage, setIsGuestInteractionModalOpen, setMessages]);

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
                setMessages(originalMessages);
            }
        };

        const undoAction = () => {
            clearTimeout(undoTimeout);
            if (isComponentMounted.current) {
                setMessages(originalMessages);
            }
            if (user?.isAnonymous) {
                const sourceKey = `sdp_guest_chat_${otherInfo?.id || id}`;
                const targetKey = `sdp_guest_chat_${targetAgentId}`;
                const targetStorage = JSON.parse(sessionStorage.getItem(targetKey) || '[]');
                const revertedTarget = targetStorage.filter(m => !msgsToMove.find(mov => mov.id === m.id));
                sessionStorage.setItem(targetKey, JSON.stringify(revertedTarget));
                
                const sourceStorage = JSON.parse(sessionStorage.getItem(sourceKey) || '[]');
                sessionStorage.setItem(sourceKey, JSON.stringify([...sourceStorage, ...msgsToMove.map(m => ({...m, conversation_id: otherInfo?.id || id}))]));
            }
            navigate(`/chats/${otherInfo?.id || id}`, { replace: true });
        };

        import('../utils/toast').then(({ default: toastModule }) => {
            toastModule.custom((t) => (
                <div className="bg-theme-panel text-theme-text px-4 py-3 flex gap-4 items-center w-full max-w-sm border border-[var(--border-master)] shadow-xl pointer-events-auto rounded z-[999]">
                    <span className="text-sm font-medium opacity-90">📁 Mogut a l'expert local.</span>
                    <button 
                        onClick={() => { undoAction(); toastModule.dismiss(t.id); }} 
                        className="text-orange-500 text-sm font-black hover:underline px-2 py-1 bg-black/5 dark:bg-white/5 rounded transition-transform active:scale-95"
                    >
                        DESFER
                    </button>
                </div>
            ), { duration: 4000 });
        });

        undoTimeout = setTimeout(() => { performMove(); }, 4000);
        
        // Immediate visual relocation WOW effect
        navigate(`/chats/${targetAgentId}`, { state: { optimisticMessages: msgsToMove } });
    }, [messages, setMessages, user, id, otherInfo, currentUserId, navigate]);

    if (loading) return <div className="flex-1 bg-theme-base flex items-center justify-center"><Loader2 className="animate-spin text-[var(--theme-accent-primary)]" size={40} /></div>;

    return (
        <div className="chat-detail-container flex-1 flex flex-col min-h-0 relative" onClick={() => setContextMenuId(null)}>
            <div className="chat-list-scanlines" />
            
            {/* HEADER COMPACTE */}
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

            {/* CONTENIDOR VIRTUALITZAT + BATECS */}
            <div className="chat-split-view-container flex-1 flex min-h-0 bg-theme-base">
                <div className="chat-messages-panel flex-1 flex flex-col min-h-0 bg-theme-base relative">
                    
                    {/* BÀNNER PER FORASTERS */}
                    {isGuest && otherInfo?.id?.startsWith('11111111-') && (
                        <div className="bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 text-[15px] px-4 py-2.5 border-b border-orange-200 dark:border-orange-800/50 text-center shadow-sm z-10 shrink-0">
                            <span className="font-bold">{t('common.warning', 'Avís')}:</span> {t('chat.guest_warning_text')} {' '}
                            <a href="/registre" className="font-bold underline cursor-pointer">{t('chat.guest_warning_link', "Registra't per a guardar les converses.")}</a>
                        </div>
                    )}

                    {/* LLISTA DE MISSATGES (ARA VIRTUALITZADA AMB VIRTUOSO) */}
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

                    {/* AREA D'INPUT AMB COMPARTIMENTALITZACIÓ EXTREMA */}
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
            {/* SELECTOR D'EXPERT MODAL */}
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

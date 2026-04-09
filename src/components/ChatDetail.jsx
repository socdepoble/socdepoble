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
import ChatMoveSelectorModal from './chat/ChatMoveSelectorModal';
import { useChatState } from '../hooks/useChatState';

/**
 * ChatDetail — Tech-Huerta reset (estructura limpia + visual premium rural)
 * Rebuild visual/estructural manteniendo lógica funcional original.
 */
const ChatDetail = ({ embeddedId }) => {
  const isEmbedded = !!embeddedId;
  const { chatSettings, globalDroppedFile, setGlobalDroppedFile } = useNavigation();
  const params = useParams();
  const id = embeddedId || params.id;
  const { t } = useTranslation();
  const { user, impersonatedProfile, activeEntityId, isSuperAdmin, isGuest } = useAuth();
  const { setIsGuestInteractionModalOpen } = useModalDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const guestIdRef = useRef(`anon-${Math.random().toString(36).slice(2, 11)}`);
  const humanId = isSuperAdmin && impersonatedProfile ? impersonatedProfile.id : user?.id;
  const currentUserId = useMemo(
    () => user?.id || (user?.isAnonymous ? guestIdRef.current : 'guest'),
    [user?.id, user?.isAnonymous]
  );

  const { chat, realChatId, messages, setMessages, addMessage, loading } = useChatState({
    id,
    currentUserId,
    userIsAnonymous: user?.isAnonymous,
    readReceipts: chatSettings.readReceipts,
  });

  const [isHeaderSearchOpen, setIsHeaderSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);
  const [contextMenuId, setContextMenuId] = useState(null);
  const [contextMenuPosition, setContextMenuPosition] = useState('up');
  const [isSending, setIsSending] = useState(false);
  const [msgToMove, setMsgToMove] = useState(null);
  const [replyingToItem, setReplyingToItem] = useState(null);

  const isSendingRef = useRef(false);
  const isComponentMounted = useRef(true);
  const activeChatRef = useRef(realChatId);
  const timersRef = useRef(new Set());

  const safeSetTimeout = useCallback((callback, delay) => {
    const timerId = setTimeout(() => {
      timersRef.current.delete(timerId);
      if (isComponentMounted.current) callback();
    }, delay);
    timersRef.current.add(timerId);
    return timerId;
  }, []);

  useEffect(() => {
    isComponentMounted.current = true;
    return () => {
      isComponentMounted.current = false;
      timersRef.current.forEach(timerId => clearTimeout(timerId));
      timersRef.current.clear();
    };
  }, []);

  useEffect(() => {
    activeChatRef.current = realChatId;
  }, [realChatId]);

  const isP1Current = chat?.participant_1_id === currentUserId;
  const otherInfo = useMemo(
    () => chat?.other_info || (isP1Current ? chat?.p2_info : chat?.p1_info),
    [chat, isP1Current]
  );

  const isIAIA = id.startsWith('11111111-') || otherInfo?.id?.startsWith('11111111-');
  const isNPC = !isIAIA && id && id.length < 32;

  const showToast = useCallback(
    (label, action) =>
      toast.custom(
        (toastData) => (
          <div className="glass-rural w-full max-w-sm rounded-3xl px-4 py-3 shadow-2xl text-[#E5E2E1]">
            <div className="flex items-center justify-between gap-3">
              <p className="font-medium text-sm text-[#E5E2E1]/90">{label}</p>
              {action ? (
                <button
                  onClick={() => {
                    action();
                    toast.dismiss(toastData.id);
                  }}
                  className="btn-tactile rounded-full bg-[#F97316]/20 px-3 py-1.5 text-xs font-semibold text-[#F97316]"
                >
                  {t('chat.undo')}
                </button>
              ) : null}
            </div>
          </div>
        ),
        { duration: 4000 }
      ),
    [t]
  );

  const handleSendMessage = useCallback(
    async ({ text, attachedFile, voiceData, onSuccess, onError }) => {
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
        showToast(t('chat.iaia_forwarding_toast'));

        safeSetTimeout(() => {
          navigate('/chats/11111111-1a1a-0000-0000-000000000000', {
            state: {
              autoForwardParams: {
                text: t('chat.forward_entity_query', {
                  name: otherInfo?.name || 'Local',
                  content: finalContent,
                }),
                attachedFile,
                voiceData,
              },
            },
          });
        }, 1000);
        return;
      }

      if (finalContent === '/solatge interact' && !isVoiceMessage) {
        iaiaService.simulateAgentDebate().catch((err) => logger.error('[Solatge Interact]', err));
        addMessage({
          id: `cmd-req-${Date.now()}`,
          sender_id: humanId,
          content: finalContent,
          created_at: new Date().toISOString(),
        });
        addMessage({
          id: `cmd-res-${Date.now()}`,
          sender_id: 'system',
          content: t('chat.remote_beat_debate'),
          created_at: new Date().toISOString(),
        });
        setIsSending(false);
        isSendingRef.current = false;
        if (onSuccess) onSuccess();
        return;
      }

      let timerId;
      try {
        let fileUrl = null;

        if (isVoiceMessage && voiceData.blob) {
          const mimeType = voiceData.blob.type || 'audio/webm';
          const extension = mimeType.includes('mp4') ? 'mp4' : mimeType.includes('ogg') ? 'ogg' : 'webm';
          const fileName = `voice-${Date.now()}-${humanId}.${extension}`;

          let uploadResult = await supabase.storage
            .from('voice-messages')
            .upload(fileName, voiceData.blob, { contentType: mimeType });

          if (uploadResult.error && (uploadResult.error.statusCode === '400' || uploadResult.error.statusCode === '404')) {
            uploadResult = await supabase.storage.from('documents').upload(fileName, voiceData.blob, {
              contentType: mimeType,
            });
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
          const { error: uploadError } = await supabase.storage
            .from(bucketName)
            .upload(fileName, attachedFile, { contentType: attachedFile.type });
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
          attachmentType: isVoiceMessage
            ? 'voice'
            : attachedFile
              ? attachedFile.type.startsWith('image/')
                ? 'image'
                : 'file'
              : null,
          attachment_name: isVoiceMessage ? t('chat.voice_note') : attachedFile ? attachedFile.name : null,
          voice_meta: isVoiceMessage && voiceData.duration ? { duration: voiceData.duration } : null,
          reply_to_id: replyingToItem ? replyingToItem.id : null,
        };

        const result = await supabaseService.sendSecureMessage(payload, controller.signal);

        if (timerId) clearTimeout(timerId);
        if (!result?.id) throw new Error(t('chat.network_timeout'));
        if (!isComponentMounted.current) return;

        addMessage(result);
        if (onSuccess) onSuccess();

        if (isIAIA) {
          let audioData = null;
          let imageData = null;

          if (isVoiceMessage && voiceData?.blob) {
            try {
              audioData = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                  try {
                    const [meta, data] = reader.result.split(',');
                    resolve({ mimeType: meta.split(':')[1].split(';')[0], data });
                  } catch (e) {
                    reject(e);
                  }
                };
                reader.onerror = () => reject(reader.error);
                reader.readAsDataURL(voiceData.blob);
              });
            } catch (err) {
              console.error("[ChatDetail] Error parsing voiceData.blob to Base64:", err);
            }
          }

          if (attachedFile && attachedFile.type.startsWith('image/')) {
            try {
              imageData = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                  try {
                    const [meta, data] = reader.result.split(',');
                    resolve({ mimeType: meta.split(':')[1].split(';')[0], data });
                  } catch (e) {
                    reject(e);
                  }
                };
                reader.onerror = () => reject(reader.error);
                reader.readAsDataURL(attachedFile);
              });
            } catch (err) {
              console.error("[ChatDetail] Error parsing attachedFile to Base64:", err);
            }
          }

          const textFinal =
            finalContent ||
            (attachedFile ? t('chat.attachment_sent') : isVoiceMessage ? t('chat.voice_message_received') : '');
          const capturedChatId = realChatId;

          iaiaService
            .generateAIAResponse(realChatId, textFinal, otherInfo?.id || id, {
              attachmentUrl: fileUrl,
              attachmentType: isVoiceMessage
                ? 'voice'
                : attachedFile
                  ? attachedFile.type.startsWith('image/')
                    ? 'image'
                    : 'file'
                  : null,
              audioData,
              imageData,
              onFinish: (finalMsg) => {
                if (!isComponentMounted.current || activeChatRef.current !== capturedChatId) return;

                if (imageData) {
                  showToast(t('chat.vision_success') || "L'IAIA ha acabat de processar la teua imatge! 👁️✨");
                }

                if (finalMsg && typeof finalMsg === 'object') {
                  setMessages((prev) => {
                    const withoutFiller = prev.filter((m) => !m.metadata?.is_iaia_filler);
                    return [
                      ...withoutFiller,
                      {
                        ...finalMsg,
                        id: finalMsg.id || `final-resp-${Date.now()}`,
                        created_at: finalMsg.created_at || new Date().toISOString(),
                      },
                    ];
                  });
                  if (isVoiceMessage && finalMsg.content) speechService.speak(finalMsg.content, 'va');
                }
              },
            })
            .then((filler) => {
              if (!isComponentMounted.current || activeChatRef.current !== capturedChatId) return;
              if (filler && typeof filler === 'object') addMessage(filler);
            })
            .catch((err) => logger.error('[ChatDetail] Bug:', err));
        }
      } catch (err) {
        if (timerId) clearTimeout(timerId);
        if (!isComponentMounted.current) return;
        logger.error('Error enviant:', err);
        if (onError) onError();
      } finally {
        if (isComponentMounted.current) setIsSending(false);
        isSendingRef.current = false;
      }
    },
    [
      id,
      otherInfo?.id,
      otherInfo?.name,
      isIAIA,
      isNPC,
      navigate,
      user?.isAnonymous,
      realChatId,
      humanId,
      currentUserId,
      activeEntityId,
      addMessage,
      setIsGuestInteractionModalOpen,
      setMessages,
      t,
      showToast,
    ]
  );

  const handleDeleteMessage = useCallback(async (messageId) => {
    try {
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
      if (!user?.isAnonymous) {
        await supabase.from('messages').delete().eq('id', messageId);
      }
      showToast(t('common.deleted', 'Missatge esborrat'));
    } catch (err) {
      logger.error('Error deleting message:', err);
    }
  }, [setMessages, user, t, showToast]);

  useEffect(() => {
    if (location.state?.autoForwardParams && id === '11111111-1a1a-0000-0000-000000000000') {
      const params = location.state.autoForwardParams;
      window.history.replaceState({}, document.title);
      safeSetTimeout(() => {
        if (!isSendingRef.current) {
          handleSendMessage({ text: params.text, attachedFile: params.attachedFile, voiceData: params.voiceData });
        }
      }, 800);
    }
  }, [location.state, id, handleSendMessage]);

  const handleMoveMessageToAgent = useCallback(
    async (targetAgentId, messageId) => {
      const msgIndex = messages.findIndex((m) => m.id === messageId);
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
      setMessages((prev) => prev.filter((m) => !msgsToMove.find((mov) => mov.id === m.id)));

      let undoTimeout;

      const performMove = async () => {
        try {
          if (user?.isAnonymous) {
            const sourceKey = `sdp_guest_chat_${otherInfo?.id || id}`;
            const targetKey = `sdp_guest_chat_${targetAgentId}`;
            const currentStorage = JSON.parse(sessionStorage.getItem(sourceKey) || '[]');
            const filteredSource = currentStorage.filter((m) => !msgsToMove.find((mov) => mov.id === m.id));
            sessionStorage.setItem(sourceKey, JSON.stringify(filteredSource));

            const targetStorage = JSON.parse(sessionStorage.getItem(targetKey) || '[]');
            const newTargetMsgs = msgsToMove.map((m) => ({ ...m, conversation_id: targetAgentId }));
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

      showToast(t('chat.moved_to_local_expert'), undoAction);
      undoTimeout = safeSetTimeout(() => {
        performMove();
      }, 4000);
      navigate(`/chats/${targetAgentId}`, { state: { optimisticMessages: msgsToMove } });
    },
    [messages, setMessages, user, id, otherInfo, currentUserId, navigate, t, showToast, safeSetTimeout]
  );

  if (loading) {
    return (
      <div className="flex min-h-full flex-1 items-center justify-center bg-[#131313]">
        <Loader2 className="animate-spin text-[#F97316]" size={40} />
      </div>
    );
  }

  return (
    <section
      className="relative isolate flex min-h-0 min-w-0 flex-1 flex-col bg-theme-bg text-theme-text"
      onClick={() => setContextMenuId(null)}
    >
      <ChatHeader
        otherInfo={otherInfo}
        realChatId={realChatId}
        isHeaderSearchOpen={isHeaderSearchOpen}
        setIsHeaderSearchOpen={setIsHeaderSearchOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isSettingsMenuOpen={isSettingsMenuOpen}
        setIsSettingsMenuOpen={setIsSettingsMenuOpen}
        isEmbedded={isEmbedded}
      />

      <main className="flex min-h-0 flex-1 flex-col bg-theme-bg">
        {isNPC && (
          <div className="mx-3 mt-2 rounded-3xl bg-theme-surface px-4 py-3 text-center text-[13px] text-theme-accent-primary shadow-lg">
            <span className="font-bold">{t('chat.npc_delegate_title')}</span> {t('chat.npc_delegate_desc')}
            <strong className="underline">IAIA MarIA</strong>
            {t('chat.npc_delegate_desc_2')}
          </div>
        )}

        {isGuest && otherInfo?.id?.startsWith('11111111-') && (
          <div className="mx-3 mt-2 rounded-3xl bg-theme-accent-primary/10 px-4 py-3 text-center text-[15px] text-theme-accent-primary shadow-xl">
            <span className="font-bold">{t('common.warning', 'Avís')}:</span> {t('chat.guest_warning_text')}{' '}
            <a href="/registre" className="font-bold underline">
              {t('chat.guest_warning_link', "Registra't per a guardar las converses.")}
            </a>
          </div>
        )}

        <div className="relative flex min-h-0 flex-1 flex-col">
          <div className="relative min-h-0 flex-1 overflow-hidden">
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
              onDeleteMessage={handleDeleteMessage}
              onReply={setReplyingToItem}
            />
          </div>

          <div className="shrink-0">
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
              globalDroppedFile={globalDroppedFile}
              setGlobalDroppedFile={setGlobalDroppedFile}
              replyingToItem={replyingToItem}
              setReplyingToItem={setReplyingToItem}
            />
          </div>
        </div>
      </main>

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
    </section>
  );
};

export default ChatDetail;

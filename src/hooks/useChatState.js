import { useState, useEffect, useRef, useCallback } from 'react';
import { supabaseService } from '../core/services/supabaseService';
import { logger } from '../utils/logger';
import { AGENTS } from '../constants';
import { chatService } from '../core/services/chatService';

// GROK V3 EXTREME AUDIT FIX:
// - Eliminat isMounted flag en favor d'AbortController.
// - Resolts stale closures en subscription per visibilitychange.
// - useCallback absolut en totes les funcions a exportar.
export const useChatState = ({
  id,
  currentUserId,
  userIsAnonymous,
  state,
  readReceipts
}) => {
  const [chat, setChat] = useState(null);
  const [realChatId, setRealChatId] = useState(id);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const isRealChatIdResolved = useRef(false);
  const readReceiptsRef = useRef(readReceipts);

  // EXTREME AUDIT V4.1: Refs estables per evitar dependències de cicle de vida
  const realChatIdRef = useRef(id);
  const currentUserIdRef = useRef(currentUserId);
  useEffect(() => {
    currentUserIdRef.current = currentUserId;
  }, [currentUserId]);
  useEffect(() => {
    readReceiptsRef.current = readReceipts;
  }, [readReceipts]);
  useEffect(() => {
    setRealChatId(id);
    realChatIdRef.current = id;
    isRealChatIdResolved.current = false;
  }, [id]);
  useEffect(() => {
    if (!currentUserId) return;
    const controller = new AbortController();
    const fetchChatData = async () => {
      try {
        const chats = await chatService.getConversations(currentUserId);
        if (controller.signal.aborted) return;
        let currentChat = chats.find(c => c.id === id);
        if (!currentChat && state?.chatInfo && !id.startsWith('11111111-')) {
          currentChat = state.chatInfo;
        }
        if (currentChat && !id.startsWith('11111111-')) {
          setRealChatId(currentChat.id);
          realChatIdRef.current = currentChat.id;
          isRealChatIdResolved.current = true;
          setChat(currentChat);
          const msgs = await supabaseService.getConversationMessages(currentChat.id, controller.signal);
          if (controller.signal.aborted) return;
          setMessages(msgs);
          if (state?.optimisticMessages) {
            setMessages(prev => {
              const mapIds = new Set(prev.map(m => m.id));
              const missing = state.optimisticMessages.filter(m => !mapIds.has(m.id)).map(m => ({
                ...m,
                conversation_id: currentChat.id
              }));
              if (missing.length === 0) return prev;
              const combined = [...prev, ...missing].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
              return combined;
            });
          }
          if (readReceiptsRef.current) {
            await chatService.markMessagesAsRead(currentChat.id, currentUserId);
          }
        } else if (id.startsWith('11111111-')) {
          const agent = AGENTS.find(a => a.id === id);
          let realConv = null;
          if (!userIsAnonymous) {
            try {
              realConv = await supabaseService.getOrCreateConversation(currentUserId, 'user', id, 'entity');
            } catch {
              logger.warn('[ChatDetail] Continuant localment...');
            }
          }
          if (controller.signal.aborted) return;
          setChat({
            id: realConv?.id || id,
            other_info: {
              id,
              name: agent?.name || 'Agent Especialista',
              avatar_url: agent?.avatar_url,
              role: agent?.role
            }
          });
          if (realConv && realConv.id) {
            setRealChatId(realConv.id);
            realChatIdRef.current = realConv.id;
            isRealChatIdResolved.current = true;
            const msgs = await supabaseService.getConversationMessages(realConv.id, controller.signal);
            if (controller.signal.aborted) return;
            let combinedMsgs = msgs;
            if (state?.optimisticMessages) {
              const mapIds = new Set(msgs.map(m => m.id));
              const missing = state.optimisticMessages.filter(m => !mapIds.has(m.id)).map(m => ({
                ...m,
                conversation_id: realConv.id
              }));
              if (missing.length > 0) {
                combinedMsgs = [...msgs, ...missing].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
              }
            }
            setMessages(combinedMsgs);
          } else if (userIsAnonymous) {
            const saved = sessionStorage.getItem(`sdp_guest_chat_${id}`);
            if (saved) {
              try {
                setMessages(JSON.parse(saved));
              } catch {/* silencia excepció de parsing local */}
            }
          }
        }
      } catch (error) {
        if (controller.signal.aborted) return;
        logger.error('Error fetching chat data:', error);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    fetchChatData();
    return () => controller.abort();
  }, [id, currentUserId, userIsAnonymous, state]);

  // EFECTE DE SUBSCRIPCIÓ LLIURE DE ZOMBIES I STALE CLOSURES
  useEffect(() => {
    if (!currentUserId || !realChatId) return;
    if (realChatId === id && !isRealChatIdResolved.current) return;
    let supabaseChannel = null;
    const connectRealtime = () => {
      if (supabaseChannel) supabaseService.unsubscribe(supabaseChannel);
      supabaseChannel = supabaseService.subscribeToMessages(realChatId, async payload => {
        if (payload.new) {
          // Asignació asíncrona segura (DeepSeek V5.1)
          const capturedId = realChatId;
          setMessages(prev => {
            if (prev.find(m => m.id === payload.new.id)) return prev;
            return [...prev, payload.new];
          });
          if (payload.new.sender_id !== currentUserId && readReceiptsRef.current) {
            if (realChatIdRef.current === capturedId) {
              chatService.markMessagesAsRead(capturedId, currentUserId).catch(() => {});
            }
          }
        }
      });
    };
    connectRealtime();
    return () => {
      if (supabaseChannel) supabaseService.unsubscribe(supabaseChannel);
    };
  }, [realChatId, currentUserId, id]);

  // EXTREME AUDIT V4.1 FIX: Efecte de visibilitat aïllat! Es lliga EXACTAMENT 1 vegada al document.
  // Lliguem amb els Refs mutables per no tancar mai valors obsolets sense re-renderitzar.
  useEffect(() => {
    let visibilityController = null; // QWEN V10.33 AUDIT FIX

    // [CRITICAL FIX] Bandwidth Leak (5.5GB Egress): 
    // We completely disable the visibilitychange HTTP fetch loop. PowerSync/Realtime will handle sync.
    // document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      if (visibilityController) visibilityController.abort();
      // document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  // Persistència de memòria a curt termini per a Forasters (Guest Session)
  useEffect(() => {
    if (userIsAnonymous && realChatIdRef.current) {
      if (messages.length > 0) {
        sessionStorage.setItem(`sdp_guest_chat_${realChatIdRef.current}`, JSON.stringify(messages));
      }
    }
  }, [messages, userIsAnonymous]);

  // SETTERS ESTABLES (Eviten re-renders en components memoitzats)
  const addMessage = useCallback(newMessage => {
    setMessages(prev => {
      if (prev.find(m => m.id === newMessage.id)) return prev;
      return [...prev, newMessage];
    });
  }, []);
  const addMultipleMessages = useCallback(newMessagesArray => {
    setMessages(prev => [...prev, ...newMessagesArray]);
  }, []);
  const updateMessagesArray = useCallback(newMessagesArray => {
    setMessages(newMessagesArray);
  }, []);
  return {
    chat,
    setChat,
    realChatId,
    messages,
    setMessages: updateMessagesArray,
    addMessage,
    addMultipleMessages,
    loading
  };
};
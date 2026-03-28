import { supabase } from '../supabaseClient';
import { MessageSchema, ConversationSchema } from './schemas';
import { logger } from '../utils/logger';
import {
    columnCache,
    setColumnCache,
    isRealDBUUID,
    activeChecks,
    getTimeAwareGreeting,
    adjustGender,
    LORE_PERSONAS,
    ENABLE_MOCKS,
    DEMO_USER_ID,
    checkThrottling
} from './supabaseService';

export const chatService = {
    async getConversations(userIdOrEntityId) {
        const isGuest = !userIdOrEntityId || userIdOrEntityId === DEMO_USER_ID;

        if (isGuest || (userIdOrEntityId && !isRealDBUUID(userIdOrEntityId))) {
            return [];
        }

        let query = supabase.from('view_conversations_enriched').select(`
            id, 
            participant_1_id, 
            participant_2_id, 
            participant_1_type, 
            participant_2_type, 
            last_message_content, 
            last_message_at,
            is_playground,
            p1_name, 
            p1_avatar_url, 
            p1_role,
            p1_is_ai,
            p2_name, 
            p2_avatar_url,
            p2_role,
            p2_is_ai
        `);

        query = query.or(`participant_1_id.eq.${userIdOrEntityId},participant_2_id.eq.${userIdOrEntityId}`);
        const { data: convs, error } = await query.order('last_message_at', { ascending: false });

        if (error) {
            logger.error('[SupabaseService] Error in getConversations:', error);
            if (ENABLE_MOCKS) {
                const { MOCK_CHATS } = await import('../data');
                const currentParticipantId = userIdOrEntityId || 'me';
                return MOCK_CHATS.map(m => ({
                    id: `mock-${m.id}`,
                    last_message_content: m.message,
                    last_message_at: new Date().toISOString(),
                    p1_info: { id: currentParticipantId, name: 'Jo' },
                    p2_info: { id: `m${m.id}`, name: m.name, avatar_url: m.avatar_url || null },
                    participant_1_id: currentParticipantId,
                    participant_2_id: `m${m.id}`,
                    participant_1_type: 'user',
                    participant_2_type: m.type === 'shop' || m.type === 'gov' ? 'entity' : 'user'
                }));
            }
            return [];
        }

        const dbConvs = (convs || []).map(c => ({
            ...c,
            p1_info: { id: c.participant_1_id, name: c.p1_name, avatar_url: c.p1_avatar_url },
            p2_info: { id: c.participant_2_id, name: c.p2_name, avatar_url: c.p2_avatar_url }
        }));

        return dbConvs;
    },

    async getConversationMessages(conversationId) {
        if (!isRealDBUUID(conversationId) || conversationId?.startsWith('mock-')) {
            try {
                const mockIdx = conversationId.split('-')[1];
                const { MOCK_MESSAGES } = await import('../data');
                const messages = MOCK_MESSAGES[mockIdx] || [];
                return messages.map(m => ({
                    id: `msg-mock-${m.id}`,
                    conversation_id: conversationId,
                    sender_id: m.sender === 'me' ? 'me' : 'other',
                    content: m.text,
                    created_at: new Date().toISOString(),
                    is_ai: false
                }));
            } catch (err) {
                logger.error('Error loading mock messages:', err);
                return [];
            }
        }

        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', conversationId)
            .order('created_at', { ascending: true });
        if (error) throw error;

        if (data && data.length > 0) {
            const voiceMessageIds = data.filter(m => m.attachment_type === 'voice').map(m => m.id);
            if (voiceMessageIds.length > 0) {
                const { data: voiceMeta } = await supabase
                    .from('voice_messages')
                    .select('message_id, duration_seconds, waveform_data')
                    .in('message_id', voiceMessageIds);

                if (voiceMeta) {
                    const metaMap = new Map(voiceMeta.map(v => [v.message_id, v]));
                    return data.map(m => {
                        if (m.attachment_type === 'voice') {
                            const meta = metaMap.get(m.id);
                            return {
                                ...m,
                                voice_meta: meta ? {
                                    duration: meta.duration_seconds,
                                    waveform: meta.waveform_data
                                } : null
                            };
                        }
                        return m;
                    });
                }
            }
        }
        return data || [];
    },

    async getLatestMessages(conversationIds) {
        if (!conversationIds || conversationIds.length === 0) return { data: [] };
        return supabase
            .from('messages')
            .select('conversation_id, content, created_at')
            .in('conversation_id', conversationIds)
            .order('created_at', { ascending: false });
    },

    async sendSecureMessage(messageData, abortSignal = null) {
        if (messageData.senderId && !messageData.isGuest) {
            await checkThrottling(messageData.senderId, 'send_message', 1000).catch(e => logger.warn('Throttling warn', e));
        }
        if (messageData.conversationId?.startsWith('mock-') || 
            messageData.conversationId?.startsWith('local-conv-') || 
            messageData.conversationId?.startsWith('11111111-')) {
            logger.log('[SupabaseService] Simulated send to mock conversation or unhydrated IAIA agent');
            return {
                id: crypto.randomUUID(), 
                conversation_id: messageData.conversationId,
                sender_id: messageData.senderId,
                content: messageData.content,
                attachment_url: messageData.attachmentUrl || null,
                attachment_type: messageData.attachmentType || null,
                attachment_name: messageData.attachmentName || null,
                created_at: new Date().toISOString(),
                is_ai: false
            };
        }

        if (messageData.isGuest || !messageData.senderId || messageData.senderId === 'guest' || String(messageData.senderId).startsWith('anonymous')) {
            logger.warn('[supabaseService] Intent de sendSecureMessage per usuari anònim. Guardant en local (efímer).');
            const guestMessage = { 
                id: `guest-msg-${Date.now()}`, 
                conversation_id: messageData.conversationId, 
                sender_id: messageData.senderId || 'guest', 
                content: messageData.content, 
                created_at: new Date().toISOString(),
                is_ai: false
            };
            
            if (messageData.conversationId && messageData.conversationId.startsWith('c1111000')) {
                 const personaInfo = LORE_PERSONAS.find(p => p.id === '11111111-1a1a-0000-0000-000000000000'); 
                 const responderId = messageData.conversationId.replace('c', ''); 
                 this.triggerSimulatedReply({ ...messageData, responderId, responderType: 'bot', persona: personaInfo || LORE_PERSONAS[0] });
            }
            return guestMessage;
        }

        const isPlayground = localStorage.getItem('isPlaygroundMode') === 'true' ||
            messageData.senderId?.startsWith('11111111-') ||
            messageData.conversationId?.startsWith('c1111000');

        if (isPlayground && columnCache.messages_is_playground === null) {
            if (!activeChecks.messages) {
                activeChecks.messages = (async () => {
                    try {
                        const { data } = await supabase.from('messages').select('*').limit(1);
                        if (data && data.length > 0) {
                            setColumnCache('messages_is_playground', 'is_playground' in data[0]);
                        }
                    } catch (e) {
                        logger.error('[SupabaseService] Error checking playground column:', e);
                    } finally { activeChecks.messages = null; }
                })();
            }
            await activeChecks.messages;
        }

        const msgPayload = {
            id: crypto.randomUUID(),
            conversation_id: messageData.conversationId,
            sender_id: messageData.senderId,

            content: messageData.content || null,
            attachment_url: messageData.attachmentUrl || null,
            attachment_type: messageData.attachmentType || null,
            attachment_name: messageData.attachmentName || null,
            post_uuid: messageData.postUuid || null
        };

        if (columnCache.messages_post_uuid === false) {
            delete msgPayload.post_uuid;
        }

        if (isPlayground && columnCache.messages_is_playground !== false) {
            msgPayload.is_playground = true;
        }

        const validated = MessageSchema.parse(msgPayload);

        let safeColumns = 'id, conversation_id, sender_id, content, attachment_url, attachment_type, attachment_name, created_at, is_ai, is_read';
        if (columnCache.messages_is_playground !== false) safeColumns += ', is_playground';
        const selectStr = columnCache.messages_post_uuid !== false ? `${safeColumns}, post_uuid` : safeColumns;

        let query = supabase.from('messages').insert(validated).select(selectStr);
            
        if (abortSignal) query = query.abortSignal(abortSignal);

        const { data, error } = await query;

        if (error) {
            const isMissingPostUuid = (error.code === '42703' || error.code === 'PGRST204') && msgPayload.post_uuid;
            const isMissingPlayground = error.code === 'PGRST204' && isPlayground && columnCache.messages_is_playground !== false;

            if (isMissingPlayground) {
                setColumnCache('messages_is_playground', false);
                return this.sendSecureMessage(messageData, abortSignal);
            }
            if (isMissingPostUuid) {
                setColumnCache('messages_post_uuid', false);
                return this.sendSecureMessage(messageData, abortSignal);
            }
            if (error.code === '42501') {
                logger.error('[SupabaseService] RLS Permission Denied on messages table.');
                return { ...msgPayload, id: `failed-rls-${Date.now()}`, status: 'simulated', created_at: new Date().toISOString() };
            }
            throw error;
        }

        if (msgPayload.post_uuid && columnCache.messages_post_uuid === null) {
            setColumnCache('messages_post_uuid', true);
        }

        const message = data[0];

        await supabase
            .from('conversations')
            .update({
                last_message_content: messageData.attachmentUrl ? `[${messageData.attachmentType || 'Arxiu'}]` : messageData.content,
                last_message_at: new Date().toISOString()
            })
            .eq('id', messageData.conversationId);

        return message;
    },

    async triggerSimulatedReply(originalMessage) {
        try {
            const { conversationId, responderId, persona } = originalMessage;
            if (!responderId) return;

            let reply = "";
            const randomVal = Math.random();

            if (persona) {
                const greeting = getTimeAwareGreeting();
                if (persona.username === 'vferris') {
                    const vReplies = [`${greeting} Gràcies pel missatge. Ara estic amb la garlopa, t'ho mire en un ratet.`, `${greeting} Recorda que la fusta vol paciència. T'ho conteste després!`, `${greeting} Això està fet. Si és per a la Torre, compte amb mi.`, `${greeting} Passa't pel taller quan vullgues i ho mirem.`];
                    reply = vReplies[Math.floor(randomVal * vReplies.length)];
                } else if (persona.username === 'mariamel') {
                    const mReplies = [`${greeting} Les meues abelles estan ara a tope amb el romer. Después parlem.`, `${greeting} Dolç com la mèl! Gràcies pel missatge.`, `${greeting} Xe, que bona idea. El poble necessita més gent així!`, `${greeting} Estic per la serra sense cobertura, quan baixe t'ho mire.`];
                    reply = mReplies[Math.floor(randomVal * mReplies.length)];
                } else if (persona.username === 'elenap') {
                    const eReplies = [`${greeting} Ja saps que qualsevol cosa em pots preguntar.`, `${greeting} Sí, d'acord. Jo ajudaré en tot el que pugui al poble.`, `${greeting} Com va tot per allí? Estic ací per a ajudar-te.`, `${greeting} Tinc molta feina ara, però t'ho agraeixo molt!`];
                    reply = eReplies[Math.floor(randomVal * eReplies.length)];
                } else if (persona.username === 'joanb') {
                    const jReplies = [`${greeting} Estic dalt l'Aitana amb el ramat. No se sent res por aquí.`, `${greeting} Si vols parlar de veres, vine a Benifallim!`, `${greeting} Les meues cabres i jo estem d'acord. Bona proposta!`, `${greeting} Buff, millor parlem a la fresca un altre ratet.`];
                    reply = jReplies[Math.floor(randomVal * jReplies.length)];
                } else {
                    const genericReplies = [`${greeting} Xe, que bona idea! Gràcies por compartir-ho.`, `${greeting} Ara estic un poc liat, però m'ho apunte!`, `${greeting} Sóc de Poble som tots, compte amb mi.`, `${greeting} Perfecte, ja m'ho dius quan sàpigues algo.`];
                    reply = adjustGender(genericReplies[Math.floor(randomVal * genericReplies.length)], persona.gender);
                }
            } else {
                reply = "D'acord! Ho tindré en compte. Gràcies pel missatge.";
            }

            const payload = {
                id: crypto.randomUUID(),
                conversation_id: conversationId,
                sender_id: responderId,

                content: reply
            };

            if (columnCache.messages_is_ai !== false) payload.is_ai = true;

            const { error: insError } = await supabase.from('messages').insert(payload);

            if (insError && insError.code === '42703') {
                columnCache.messages_is_ai = false;
                delete payload.is_ai;
                await supabase.from('messages').insert(payload);
            } else if (!insError) {
                columnCache.messages_is_ai = true;
            }

            await supabase
                .from('conversations')
                .update({ last_message_content: reply, last_message_at: new Date().toISOString() })
                .eq('id', conversationId);

        } catch (err) {
            logger.error('[NPC Simulation] Error:', err);
        }
    },

    async getOrCreateConversation(p1Id, p1Type, p2Id, p2Type) {
        const { data: existing } = await supabase
            .from('conversations')
            .select('*')
            .or(`and(participant_1_id.eq.${p1Id},participant_2_id.eq.${p2Id}),and(participant_1_id.eq.${p2Id},participant_2_id.eq.${p1Id})`)
            .maybeSingle();

        if (existing) return existing;

        const isPlayground = localStorage.getItem('isPlaygroundMode') === 'true' || p1Id?.startsWith('11111111-') || p2Id?.startsWith('11111111-');

        if (isPlayground && columnCache.conversations_is_playground === null) {
            if (!activeChecks.conversations) {
                activeChecks.conversations = (async () => {
                    try {
                        const { data } = await supabase.from('conversations').select('*').limit(1);
                        if (data && data.length > 0) setColumnCache('conversations_is_playground', 'is_playground' in data[0]);
                    } catch (e) {
                        logger.error('[SupabaseService] Error checking definitions for conversations:', e);
                    } finally { activeChecks.conversations = null; }
                })();
            }
            await activeChecks.conversations;
        }

        const convPayload = { participant_1_id: p1Id, participant_1_type: p1Type, participant_2_id: p2Id, participant_2_type: p2Type };
        const validated = ConversationSchema.parse(convPayload);
        const selectStr = 'id, participant_1_id, participant_2_id, created_at';

        const { data, error } = await supabase.from('conversations').insert(validated).select(selectStr);

        if (error) {
            if (error.code === '23505') {
                logger.warn('[SupabaseService] 💥 Condició de cursa detectada creant conversació. Aplicant lectura recursiva salvadora.');
                return await chatService.getOrCreateConversation(p1Id, p1Type, p2Id, p2Type);
            }
            if (isPlayground && (error.code === '42501' || error.code === '23503' || error.code === '23514' || error.status === 401 || error.status === 403)) {
                return {
                    id: `local-conv-${p1Id.substring(0, 4)}-${p2Id.substring(0, 4)}`,
                    participant_1_id: p1Id, participant_1_type: p1Type, participant_2_id: p2Id, participant_2_type: p2Type,
                    is_playground: true, created_at: new Date().toISOString()
                };
            }
            throw error;
        }
        return data[0];
    },

    async markMessagesAsRead(conversationId, userId) {
        if (!conversationId || conversationId.startsWith('mock-') || !isRealDBUUID(conversationId)) return;
        if (!userId || !isRealDBUUID(userId)) return;

        const { error } = await supabase.rpc('mark_messages_as_read', { conv_id: conversationId, user_id: userId });
        if (error && error.code !== '22P02') throw error;
    },


    subscribeToConversation(conversationId, options = {}) {
        if (!isRealDBUUID(conversationId) || conversationId?.startsWith('mock-')) return { unsubscribe: () => { } };
        const { onNewMessage, onMessageUpdate } = options;
        const channel = supabase.channel(`conversation:${conversationId}`).on('postgres_changes', { event: '*', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversationId}` }, (payload) => {
            if (payload.eventType === 'INSERT' && onNewMessage) onNewMessage(payload.new);
            if (payload.eventType === 'UPDATE' && onMessageUpdate) onMessageUpdate(payload.new);
        });
        return channel.subscribe();
    },

    subscribeToPresence(conversationId, userId, onSync) {
        if (!isRealDBUUID(conversationId) || conversationId?.startsWith('mock-')) return { unsubscribe: () => { } };
        const channel = supabase.channel(`presence:${conversationId}`, { config: { presence: { key: userId } } });
        channel.on('presence', { event: 'sync' }, () => onSync(channel.presenceState()));
        return channel.subscribe(async (status) => { if (status === 'SUBSCRIBED') await channel.track({ online_at: new Date().toISOString() }); });
    }
};

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
        <div className="messages-container chat-messages-list flex-1 flex flex-col min-h-0 relative bg-theme-base">
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
                    className="custom-scrollbar"
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
                        // EXTREME AUDIT V4.1 FIX: Confiança cega en Virtuoso math (Zero O(N))
                        const listIndex = index - firstItemIndex;
                        const nextMsg = filteredMessages[listIndex + 1];
                        const isSameSenderAsNext = nextMsg && nextMsg.sender_id === msg.sender_id;
                        
                        // EXTREME AUDIT V4 FIX: Avaluació local del boolean. Destroya el bug "el menu no obri".
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

import React, { useMemo, useRef, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Virtuoso } from 'react-virtuoso';
import { MessageSquare } from 'lucide-react';

import MessageBubble from './MessageBubble';
import { supabaseService } from '../../services/supabaseService';

const ChatMessageList = React.memo(
  ({
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
    onRequestMove,
    onDeleteMessage,
    onReply,
  }) => {
    const { t } = useTranslation();
    const virtuosoRef = useRef(null);

    const [firstItemIndex, setFirstItemIndex] = useState(10000);
    const isLoadingOlderRef = useRef(false);

    const filteredMessages = useMemo(
      () => messages.filter((msg) => !searchQuery || msg.content?.toLowerCase().includes(searchQuery.toLowerCase())),
      [messages, searchQuery]
    );

    const loadOlder = useCallback(async () => {
      if (!messages.length || !realChatId || isLoadingOlderRef.current) return;

      isLoadingOlderRef.current = true;
      try {
        const oldestId = messages[0].id;
        const older = await supabaseService.getOlderMessages?.(realChatId, oldestId, 30);
        if (older && older.length > 0) {
          React.startTransition(() => {
            setFirstItemIndex((prev) => prev - older.length);
            setMessages((prev) => [...older, ...prev]);
          });
        }
      } catch {
        // noop: historial no soportado o error temporal
      } finally {
        isLoadingOlderRef.current = false;
      }
    }, [messages, realChatId, setMessages]);

    if (messages.length === 0) {
      return (
        <div className="flex h-full min-h-0 flex-1 items-center justify-center bg-theme-bg px-6">
          <div className="flex max-w-sm flex-col items-center rounded-[24px] bg-theme-surface px-6 py-8 text-center shadow-md">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-theme-bg text-theme-accent-primary">
              <MessageSquare size={28} />
            </div>
            <p className="font-['Noto_Sans'] text-[13px] font-bold uppercase tracking-widest text-theme-text/80">
              {otherInfo?.name ? `Parla amb ${otherInfo.name}` : t('common.write_message')}
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex min-h-0 flex-1 flex-col bg-theme-bg">
        <Virtuoso
          ref={virtuosoRef}
          className="custom-scrollbar gpu-accelerate"
          style={{ height: '100%', overflowY: 'auto' }}
          data={filteredMessages}
          firstItemIndex={firstItemIndex}
          initialTopMostItemIndex={Math.max(filteredMessages.length - 1, 0)}
          computeItemKey={(index, msg) => msg.id || index}
          increaseViewportBy={420}
          overscan={10}
          startReached={loadOlder}
          followOutput={(isAtBottom) => (isAtBottom ? 'smooth' : false)}
          components={{
            Footer: () => (
              <div className="pb-3 pt-2">
                {otherInfo?.id?.startsWith('11111111-') &&
                  messages.length > 0 &&
                  messages[messages.length - 1].sender_id === humanId && (
                    <div className="px-4">
                      <div className="inline-flex items-center rounded-full bg-theme-surface px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-theme-accent-primary animate-pulse shadow-sm">
                        Activa...
                      </div>
                    </div>
                  )}
              </div>
            ),
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
                repliedToMsg={msg.reply_to_id ? messages.find(m => m.id === msg.reply_to_id) || msg.metadata?.reply_to_id ? messages.find(m => m.id === msg.metadata.reply_to_id) : null : null}
                contextMenuPosition={contextMenuPosition}
                setContextMenuId={setContextMenuId}
                setContextMenuPosition={setContextMenuPosition}
                onMoveMessageToAgent={onMoveMessageToAgent}
                onRequestMove={onRequestMove}
                onDeleteMessage={onDeleteMessage}
                onReply={onReply}
              />
            );
          }}
        />
      </div>
    );
  }
);

export default ChatMessageList;

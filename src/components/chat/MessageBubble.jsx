import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FolderInput,
  Pause,
  Play,
  Settings,
  Trash2,
  Reply,
  Smile,
  Copy,
  Check,
  CheckCheck,
  Paperclip,
} from 'lucide-react';

import { logger } from '../../utils/logger';

const MessageBubble = React.memo(
  ({
    msg,
    isMe,
    isSameSenderAsNext,
    otherInfo,
    isActiveMenu,
    contextMenuPosition,
    setContextMenuPosition,
    setContextMenuId,
    onMoveMessageToAgent,
    onRequestMove,
  }) => {
    const { t } = useTranslation();
    const audioRef = useRef(null);
    const isMounted = useRef(true);

    const [isPlaying, setIsPlaying] = useState(false);

    const marginClass = isSameSenderAsNext ? 'mb-1' : 'mb-3';

    useEffect(() => {
      isMounted.current = true;
      return () => {
        isMounted.current = false;
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.src = '';
          audioRef.current = null;
        }
      };
    }, []);

    const KNOWN_MENTIONS = useMemo(
      () => ({
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
        sultan: '11111111-1111-4111-a111-000000000006',
      }),
      []
    );

    const renderContent = (text) => {
      if (!text) return null;

      return text.split(/(@[a-z0-9_]+)/g).map((part, index) => {
        if (part.startsWith('@')) {
          const username = part.slice(1).toLowerCase();
          if (KNOWN_MENTIONS[username]) {
            return (
              <button
                key={`${part}-${index}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onMoveMessageToAgent?.(KNOWN_MENTIONS[username], msg?.id);
                }}
                className="inline-flex items-center gap-1 rounded-full bg-[#169CF9]/20 px-2 py-1 text-[13px] font-semibold text-[#169CF9] active:scale-95"
                title="Desplaçar a l'expert"
              >
                {part}
              </button>
            );
          }
        }
        return <span key={`${part}-${index}`}>{part}</span>;
      });
    };

    const bubbleBase =
      'group relative max-w-[86%] px-3 py-2.5 md:max-w-[72%] md:px-4 md:py-3 transition-transform duration-150 active:scale-[0.995] shadow-lg';

    const bubbleTone = isMe
      ? 'rounded-2xl rounded-br-sm bg-[#F97316] text-[#0e0e0e] ml-10'
      : 'rounded-2xl rounded-bl-sm bg-[#1A1A1A] text-[#E5E2E1] mr-10';

    const toggleMenu = (e) => {
      e.stopPropagation();
      if (isActiveMenu) {
        setContextMenuId(null);
        return;
      }
      const yPosition = e.clientY;
      const windowHeight = window.innerHeight;
      setContextMenuPosition(yPosition < windowHeight / 2 ? 'down' : 'up');
      setContextMenuId(msg.id);
    };

    return (
      <div
        className={`px-2 md:px-6 ${marginClass} flex ${isMe ? 'justify-end' : 'justify-start'} ${
          isActiveMenu ? 'relative z-50' : ''
        }`}
      >
        <article className={`${bubbleBase} ${bubbleTone}`}>
          {!isMe && (msg.author_name || otherInfo?.name) && (
            <div className="mb-1 truncate font-['Epilogue'] text-[12px] font-bold italic uppercase tracking-[0.12em] text-[#F97316]">
              {msg.author_name || otherInfo?.name}
            </div>
          )}

          <div className="whitespace-pre-wrap break-words font-['Plus_Jakarta_Sans'] text-[15px] font-medium leading-[1.55]">
            {msg.attachment_type === 'voice' ? (
              <div className="flex min-w-[208px] items-center gap-3 py-1">
                <button
                  onClick={() => {
                    if (!audioRef.current) {
                      audioRef.current = new Audio(msg.attachment_url);
                      audioRef.current.onended = () => {
                        if (isMounted.current) setIsPlaying(false);
                      };
                    }
                    if (audioRef.current.paused) {
                      audioRef.current
                        .play()
                        .then(() => {
                          if (isMounted.current) setIsPlaying(true);
                        })
                        .catch((err) => logger.error('[Voice] Play error:', err));
                    } else {
                      audioRef.current.pause();
                      setIsPlaying(false);
                    }
                  }}
                  className={`btn-tactile flex h-12 w-12 items-center justify-center rounded-full active:scale-95 ${
                    isMe ? 'bg-[#0e0e0e]/20 text-[#0e0e0e]' : 'bg-[#222222] text-[#169CF9]'
                  }`}
                  aria-label="Reproduir missatge de veu"
                >
                  {isPlaying ? <Pause size={22} className="fill-current" /> : <Play size={22} className="ml-0.5 fill-current" />}
                </button>

                <div className="flex-1 space-y-1.5 pr-6">
                  <div className={`h-1.5 w-full rounded-full ${isMe ? 'bg-[#0e0e0e]/25' : 'bg-[#E5E2E1]/20'}`}>
                    <div className={`h-full w-1/3 rounded-full ${isMe ? 'bg-[#0e0e0e]/65' : 'bg-[#169CF9]'}`} />
                  </div>
                  <div className="flex justify-between text-[11px] font-semibold opacity-75">
                    <span>{msg.voice_meta?.duration ? `${msg.voice_meta.duration}s` : '—'}</span>
                    <span className="font-['Epilogue'] text-[10px] font-bold italic uppercase tracking-[0.2em]">
                      {t('chat.beaten', 'Bategat')}
                    </span>
                  </div>
                </div>
              </div>
            ) : msg.attachment_url ? (
              <div className={`flex flex-col ${msg.content ? 'pb-1' : ''}`}>
                {msg.attachment_type === 'image' ? (
                  <img
                    src={msg.attachment_url}
                    alt={msg.attachment_name || 'Imatge adjunta'}
                    className="-mx-1 mb-2 max-h-[300px] w-auto rounded-[16px] object-cover"
                  />
                ) : (
                  <div className={`mb-2 mt-1 flex items-center gap-3 rounded-[16px] p-3 ${isMe ? 'bg-[#0e0e0e]/15' : 'bg-[#222222]'}`}>
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${isMe ? 'bg-[#0e0e0e]/20' : 'bg-[#0e0e0e]/60'}`}>
                      <Paperclip size={18} />
                    </div>
                    <span className="max-w-[170px] truncate text-sm font-semibold">{msg.attachment_name || 'Arxiu'}</span>
                  </div>
                )}
                {msg.content && <div className="pr-9">{renderContent(msg.content)}</div>}
              </div>
            ) : (
              <div className="pr-9">{renderContent(msg.content)}</div>
            )}
            <span className="inline-block h-4 w-20" />
          </div>

          <button
            onClick={toggleMenu}
            className="absolute bottom-1.5 right-2 inline-flex items-center gap-1 rounded-full px-1.5 py-1 text-[10px] font-semibold opacity-75 transition-opacity hover:opacity-100"
          >
            <span>{msg.created_at ? new Date(msg.created_at).toLocaleDateString([], { day: '2-digit', month: '2-digit' }) : ''}</span>
            <span>{msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : t('chat.now', 'Ara')}</span>
            {isMe && (
              <span className="-ml-0.5">
                {msg.read_at ? (
                  <CheckCheck size={14} strokeWidth={2.5} className="text-[#169CF9]" title={t('chat.read')} />
                ) : msg.status === 'delivered' ? (
                  <CheckCheck size={14} strokeWidth={2.2} className="opacity-60" title={t('chat.delivered')} />
                ) : (
                  <Check size={14} strokeWidth={2.2} className="opacity-60" title={t('chat.sent')} />
                )}
              </span>
            )}
          </button>

          <button
            onClick={toggleMenu}
            className={`btn-tactile absolute top-2 z-20 hidden rounded-full p-2 opacity-0 transition-all group-hover:opacity-100 md:block ${
              isMe ? 'right-[-42px] bg-[#1A1A1A] text-[#E5E2E1]' : 'left-[-42px] bg-[#1A1A1A] text-[#E5E2E1]'
            }`}
            aria-label={t('common.options', 'Opcions')}
          >
            <Settings size={16} strokeWidth={2.4} />
          </button>

          {isActiveMenu && (
            <div
              className={`glass-rural absolute right-0 z-[60] w-64 rounded-[24px] py-2 text-[14px] font-medium text-[#E5E2E1] shadow-2xl ${
                contextMenuPosition === 'up' ? 'bottom-9 origin-bottom-right' : 'top-full mt-2 origin-top-right'
              }`}
            >
              <button className="flex min-h-12 w-full items-center justify-between px-4 py-2 hover:bg-[#F97316]/10" onClick={() => setContextMenuId(null)}>
                {t('chat.reply', 'Respondre')} <Reply size={16} />
              </button>
              <button className="flex min-h-12 w-full items-center justify-between px-4 py-2 hover:bg-[#F97316]/10" onClick={() => setContextMenuId(null)}>
                {t('chat.react', 'Reaccionar')} <Smile size={16} />
              </button>
              <button className="flex min-h-12 w-full items-center justify-between px-4 py-2 hover:bg-[#F97316]/10" onClick={() => setContextMenuId(null)}>
                {t('chat.copy', 'Copiar')} <Copy size={16} />
              </button>
              <button
                className="flex min-h-12 w-full items-center justify-between px-4 py-2 font-semibold text-[#169CF9] hover:bg-[#169CF9]/10"
                onClick={() => {
                  setContextMenuId(null);
                  onRequestMove?.(msg);
                }}
              >
                {t('chat.move_to_expert', "Moure a l'expert")} <FolderInput size={16} />
              </button>
              <button className="flex min-h-12 w-full items-center justify-between px-4 py-2 text-[#EF4444] hover:bg-[#EF4444]/10" onClick={() => setContextMenuId(null)}>
                {t('common.delete', 'Esborrar')} <Trash2 size={16} />
              </button>
            </div>
          )}
        </article>
      </div>
    );
  }
);

export default MessageBubble;

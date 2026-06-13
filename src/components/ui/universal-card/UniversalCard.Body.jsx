// src/components/ui/universal-card/UniversalCard.Body.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { getCardRoute } from '../../../services/routeService';

// Component Ripple reutilitzable
const RippleButton = ({ children, onClick, className, ...props }) => {
  const [ripple, setRipple] = useState(null);

  const handleClick = (e) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    setRipple({ x, y, size });

    if (onClick) {
      setTimeout(() => onClick(e), 300);
    }
  };

  useEffect(() => {
    if (ripple) {
      const timer = setTimeout(() => setRipple(null), 600);
      return () => clearTimeout(timer);
    }
  }, [ripple]);

  return (
    <button
      onClick={handleClick}
      className={`relative overflow-hidden ${className}`}
      {...props}
    >
      {ripple && (
        <span
          className="absolute bg-white/30 dark:bg-black/30 rounded-full animate-ripple"
          style={{
            width: ripple.size,
            height: ripple.size,
            left: ripple.x,
            top: ripple.y,
          }}
        />
      )}
      {children}
    </button>
  );
};

// Neteja i sanititza el text
const cleanExcerpt = (text) => {
  if (!text) return '';
  return text
    .replace(/#[a-zA-Z0-9_À-ÿ]+/g, '')
    .replace(/[\r\n]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

// Humanitza les etiquetes
const humanizeTag = (tag) => {
  let str = tag.replace(/^#+/, '');
  str = str.replace(/([a-z\xE0-\xFF])([A-Z\xC0-\xDF])/g, '$1 $2');
  str = str.replace(/[_-]/g, ' ');
  str = str.replace(/\s+/g, ' ').trim();
  if (str.length > 0) {
    str = str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }
  return str;
};

const UniversalCardBody = ({
  displayTitle,
  displayExcerpt,
  item,
  children,
  cardVariant,
  displayPrice,
  viewMode = 'grid'
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isWikipedia = cardVariant === 'pobles';
  const watermarkText = isWikipedia
    ? "© WIKIPEDIA / WIKIMEDIA COMMONS (CC BY-SA)"
    : "© SÓC DE POBLE / FET PER LA IAIA I NANO BANANA";

  const extractedTags = displayExcerpt ? (displayExcerpt.match(/#[a-zA-Z0-9_À-ÿ]+/g) || []).map(t => t.replace(/^#+/, '')) : [];
  const allTags = [...new Set([...(item?.tags || []), ...extractedTags])];
  const hasTags = allTags.length > 0;

  const subtitleText = item?.post_subtitle || item?.subtitle || item?.seller || item?.author_name || item?.author ||
    (cardVariant === 'pobles' && item?.comarca ? item.comarca : '');

  const titleLines = (displayTitle && displayTitle.length > 28) ? 2 : 1;
  const subtitleLines = subtitleText ? (subtitleText.length > 38 ? 2 : 1) : 0;
  const headerLines = titleLines + subtitleLines;

  const maxTotalSlots = hasTags ? 8 : 9;
  const allowedParagraphLines = maxTotalSlots - headerLines;
  const clampedLines = Math.max(3, Math.min(allowedParagraphLines, 7));

  const cleanedExcerpt = cleanExcerpt(displayExcerpt);
  const safeExcerpt = DOMPurify.sanitize(cleanedExcerpt.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'));

  const computedUrl = getCardRoute(item, cardVariant);

  const handleCardClick = useCallback((e) => {
    e?.stopPropagation();
    const article = e?.currentTarget?.closest('article');
    if (article) {
      article.classList.add('animate-click');
      setTimeout(() => {
        article.classList.remove('animate-click');
      }, 300);
    }
  }, []);

  return (
    <div className={`flex flex-col flex-auto ${isMounted ? 'animate-fade-in' : 'opacity-0'}`}>
      <Link
        to={computedUrl}
        className="flex flex-col flex-auto cursor-pointer group no-underline hover:no-underline after:absolute after:inset-0 after:z-0"
        onClick={handleCardClick}
      >
        <div className="flex flex-col items-start pb-1 px-4 pt-4 shrink-0 group-hover:opacity-80 transition-opacity duration-300">
          <div className="flex justify-between items-start gap-4 w-full">
            <div className="flex-1 min-w-0">
              <h2 className="genesis-title text-theme-text transition-colors duration-200 group-hover:text-brand-blue"
                  itemProp="name headline">
                {displayTitle}
              </h2>
            </div>
            {(cardVariant === 'mercat' || cardVariant === 'market' || displayPrice) && !item?.is_store_disabled && (
              <div className="flex flex-col items-end shrink-0 gap-1 mt-1 z-10 relative">
                {displayPrice && (
                  <span className="text-brand-blue dark:text-brand-orange font-black text-2xl md:text-3xl tracking-tight">
                    {displayPrice}
                  </span>
                )}
                {item?.stock_status && (
                  <div className={`text-xs font-bold uppercase px-2 py-0.5 rounded-full leading-none transition-all duration-200
                    ${item.stock_status.toLowerCase() === 'esgotat' || item.stock_status.toLowerCase() === 'outofstock'
                      ? 'bg-red-500/20 text-red-500'
                      : 'bg-green-500/20 text-green-500'}`}>
                    <span>{item.stock_status.toLowerCase() === 'outofstock' ? 'Esgotat' : item.stock_status}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {subtitleText && (
            <div className="flex flex-col w-full mt-1.5">
              <h3 className="genesis-subtitle text-brand-blue line-clamp-2 w-full transition-colors duration-200 group-hover:brightness-110"
                  itemProp="description">
                <span>{subtitleText}</span>
              </h3>
            </div>
          )}

          <div className="flex-shrink-0 relative overflow-hidden group-hover:opacity-80 transition-opacity duration-300 mt-2.5">
            {safeExcerpt && (
              <div
                className={`genesis-body text-theme-muted [&_strong]:font-bold [&_strong]:text-theme-text [&_b]:font-bold [&_b]:text-theme-text
                            line-clamp-${clampedLines} transition-colors duration-200 group-hover:text-theme-text`}
                dangerouslySetInnerHTML={{ __html: safeExcerpt }}
              />
            )}
          </div>
        </div>
      </Link>

      <div className="w-full flex flex-col shrink-0 z-20 mt-auto">
        {children && (
          <div className="z-20 relative px-4 mt-2 mb-2 w-full flex justify-center">
            {React.Children.map(children, child => (
              React.cloneElement(child, {
                className: `${child.props.className || ''} transition-all duration-200 hover:scale-105`,
              })
            ))}
          </div>
        )}

        {viewMode === 'list' ? (
          <div className="w-full flex items-center justify-between gap-2 px-4 pb-1 pt-1 flex-wrap">
            {hasTags && (
              <div className="flex items-center gap-1.5 flex-wrap flex-1">
                {allTags.slice(0, 3).map((tag, index) => {
                  const displayTagStr = humanizeTag(tag);
                  const bgClasses = [
                    'bg-brand-blue/10 text-brand-blue',
                    'bg-brand-orange/10 text-brand-orange',
                    'bg-brand-blue/10 text-brand-blue',
                    'bg-brand-orange/10 text-brand-orange'
                  ];
                  const colorClass = bgClasses[index % bgClasses.length];
                  return (
                    <RippleButton
                      key={tag}
                      className={`text-xs font-bold tracking-wide px-3 py-1 rounded-full shadow-sm hover:shadow transition-all duration-200 hover:-translate-y-0.5 ${colorClass}`}
                    >
                      <span>{displayTagStr}</span>
                    </RippleButton>
                  );
                })}
                {allTags.length > 3 && (
                  <div
                    title={allTags.slice(3).join(', ')}
                    className="text-xs font-bold tracking-wide bg-theme-panel text-theme-muted px-3 py-1 rounded-full border border-border-master cursor-default shadow-sm"
                  >
                    <span>+{allTags.length - 3}</span>
                  </div>
                )}
              </div>
            )}
            {cleanedExcerpt && (
              <RippleButton
                className="flex items-center gap-1 font-black tracking-widest uppercase text-brand-orange
                          group-hover:opacity-80 transition-opacity duration-200 whitespace-nowrap ml-auto text-sm"
                aria-label={`Llegir més sobre ${item?.title || "aquest post"}`}
              >
                Llegir més
              </RippleButton>
            )}
          </div>
        ) : (
          <>
            {cleanedExcerpt && (
              <div className="w-full flex justify-center py-1 mb-0">
                <RippleButton
                  className="flex items-center gap-1 font-black tracking-widest uppercase text-brand-orange
                            group-hover:opacity-80 transition-opacity duration-200"
                  aria-label={`Llegir més sobre ${item?.title || "aquest post"}`}
                >
                  Llegir més
                </RippleButton>
              </div>
            )}

            {hasTags && (
              <div className="w-full flex justify-center items-center gap-2.5 px-4 pb-4 flex-wrap">
                {allTags.slice(0, 3).map((tag, index) => {
                  const displayTagStr = humanizeTag(tag);
                  const bgClasses = [
                    'bg-brand-blue/10 text-brand-blue',
                    'bg-brand-orange/10 text-brand-orange',
                    'bg-brand-blue/10 text-brand-blue',
                    'bg-brand-orange/10 text-brand-orange'
                  ];
                  const colorClass = bgClasses[index % bgClasses.length];
                  return (
                    <RippleButton
                      key={tag}
                      className={`text-sm font-bold tracking-wide px-3.5 py-1.5 rounded-full shadow-sm hover:shadow transition-all duration-200 hover:-translate-y-0.5 ${colorClass}`}
                    >
                      <span>{displayTagStr}</span>
                    </RippleButton>
                  );
                })}
                {allTags.length > 3 && (
                  <div
                    title={allTags.slice(3).join(', ')}
                    className="text-sm font-bold tracking-wide bg-theme-panel text-theme-muted px-3 py-1.5 rounded-full border border-border-master cursor-default shadow-sm"
                  >
                    <span>+{allTags.length - 3}</span>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        <div className="w-full px-4 pt-1 pb-1.5 flex justify-center mt-auto">
          <p className="text-xs font-black tracking-widest text-theme-muted/40 uppercase select-none text-center m-0 p-0 leading-none">
            {watermarkText}
          </p>
        </div>
      </div>
    </div>
  );
};

export default React.memo(UniversalCardBody);

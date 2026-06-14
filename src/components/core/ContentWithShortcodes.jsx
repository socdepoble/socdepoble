import React, { useState, useMemo, useCallback, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { useVirtualizer } from '@tanstack/react-virtual';
import UniversalCard from '../ui/universal-card';
import { MOCK_FEED, MOCK_MARKET_ITEMS, MOCK_TOWNS } from '../../data';
import { IAIES_MUNDIALS_ARRAY } from '../../app/config/iaiesMundialsMap';
import { getLogoUrl } from '../../data/mockIaiesPages';
import ErrorBoundary from './ErrorBoundary';
import { LayoutGrid, List, Square } from 'lucide-react';

const TABS_SPLIT = '[TABS_START]';

// 🛡️ BARRERA: Targeta Virtual amb Containment
const VirtualCard = React.memo(({ cardType, cardId, index, viewMode, onNavigate, itemData }) => {
  const { ref, inView } = useInView({ triggerOnce: true, rootMargin: '400px' });

  if (!inView) {
    return <div ref={ref} className="w-full h-48 bg-black/5 dark:bg-white/5 rounded-2xl animate-pulse" style={{ contain: 'layout paint size' }} />;
  }

  return (
    <div ref={ref} className="w-full h-full" style={{ contain: 'layout paint', contentVisibility: 'auto', containIntrinsicSize: 'auto 300px' }}>
      <ErrorBoundary key={`card-error-${index}`}>
        <Suspense fallback={<div className="h-48 rounded-2xl bg-black/5 dark:bg-white/5 animate-pulse w-full h-full" />}>
          {itemData}
        </Suspense>
      </ErrorBoundary>
    </div>
  );
});
VirtualCard.displayName = 'VirtualCard';

const ContentWithShortcodes = ({ content, hideTabs = false }) => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('grid');

  // MAPS Globals O(1)
  const iaiesMap = useMemo(() => new Map(IAIES_MUNDIALS_ARRAY.map(i => [i.id, i])), []);
  const feedMap = useMemo(() => {
    const map = new Map();
    MOCK_FEED.forEach(f => { map.set(f.id, f); map.set(f.slug, f); });
    return map;
  }, []);
  const townsMap = useMemo(() => {
    const map = new Map();
    MOCK_TOWNS.forEach(t => { 
      map.set(t.id, t); 
      const townName = t.title || t.name;
      if (townName) {
        map.set(townName.toLowerCase(), t); 
      }
    });
    return map;
  }, []);
  const marketMap = useMemo(() => new Map(MOCK_MARKET_ITEMS.map(m => [String(m.id), m])), []);

  // PARSEIG MEMOITZAT PUR
  const { introContent, parts } = useMemo(() => {
    if (!content || typeof content !== 'string') return { introContent: null, parts: [] };

    const splitParts = content.split(TABS_SPLIT);
    const intro = splitParts.length > 1 ? splitParts[0].trim() : null;
    const mainContent = splitParts.length > 1 ? splitParts[1].trim() : splitParts[0].trim();

    const parsedParts = [];
    let lastIndex = 0; let match;
    
    // 🛡️ Regex aïllada per evitar col·lisions d'estat concurrent en React 18
    const localRegex = /\[CARD:(.+?):(.+?)\]/g; 

    while ((match = localRegex.exec(mainContent)) !== null) {
      if (match.index > lastIndex) parsedParts.push({ type: 'text', content: mainContent.slice(lastIndex, match.index) });
      parsedParts.push({ type: 'card', cardType: match[1], cardId: match[2] });
      lastIndex = localRegex.lastIndex;
    }
    
    if (lastIndex < mainContent.length) parsedParts.push({ type: 'text', content: mainContent.slice(lastIndex) });

    return { introContent: intro, parts: parsedParts };
  }, [content]);

  // Filtrar parts
  const cards = useMemo(() => parts.filter(p => p.type === 'card'), [parts]);
  const textParts = useMemo(() => parts.filter(p => p.type === 'text'), [parts]);

  // PREPARAR DADES DE TARGETA O(1)
  const prepareCardData = useCallback((cardType, cardId) => {
    let item = null;
    let element = null;

    if (cardType === 'ia' || cardType === 'agent') {
      item = iaiesMap.get(cardId);
      if (item) {
        element = <UniversalCard
            item={{...item, title: item.name, subtitle: item.type, excerpt: item.shortDescription, author_name: item.name, author_avatar: item.logo_url || item.avatar_url || getLogoUrl(item.id), image: getLogoUrl(item.id), type: 'agent'}}
            title={item.name} subtitle={item.type} avatarSrc={item.logo_url || item.avatar_url || getLogoUrl(item.id)} avatarName={item.name} excerpt={item.shortDescription} image={getLogoUrl(item.id)} viewMode={viewMode === 'single' ? 'grid' : viewMode} variant="post" color={item.color} className="w-full h-full transition-none" onNavigate={() => navigate(`/post/ia-${item.id}`)}
          />;
      }
    } else if (cardType === 'post' || cardType === 'page') {
      item = feedMap.get(cardId);
      if (item) {
        element = <UniversalCard item={item} title={item.title} subtitle={item.post_subtitle || item.author} avatarSrc={item.author_avatar} avatarName={item.author} excerpt={item.content || item.excerpt} image={item.image_url?.[0]} viewMode={viewMode === 'single' ? 'grid' : viewMode} variant="post" className="w-full h-full transition-none" onNavigate={() => navigate(`/${item.type === 'page' ? 'post' : 'post'}/${item.slug || item.id}`)} />;
      }
    } else if (cardType === 'town') {
      item = townsMap.get(cardId) || townsMap.get(cardId.toLowerCase());
      if (item) {
        element = <UniversalCard item={item} title={item.name} subtitle={item.comarca} avatarSrc={item.avatar_url || item.escudo_url} avatarName={item.name} excerpt={item.description} image={item.image_url || item.escudo_url} viewMode={viewMode === 'single' ? 'grid' : viewMode} variant="town" className="w-full h-full transition-none" onNavigate={() => navigate(`/pobles/${item.id}`)} />;
      }
    } else if (cardType === 'market') {
      item = marketMap.get(String(cardId));
      if (item) {
        element = <UniversalCard item={item} title={item.name} subtitle={item.seller} avatarSrc={item.seller_avatar} avatarName={item.seller} excerpt={item.description} image={item.images?.[0]} viewMode={viewMode === 'single' ? 'grid' : viewMode} variant="market" className="w-full h-full transition-none" onNavigate={() => navigate(`/mercat/${item.id}`)} />;
      }
    }

    if (!element) {
      element = <div className="my-4 p-4 border border-dashed border-red-500/50 rounded-xl bg-red-500/10 text-red-500 text-xs font-mono text-center">[Card {cardType}:{cardId} no trobat]</div>;
    }

    return element;
  }, [viewMode, navigate, iaiesMap, feedMap, townsMap, marketMap]);

  // VIRTUALITZACIÓ REAL (@tanstack/react-virtual)
  const parentRef = React.useRef(null);
  // eslint-disable-next-line react-hooks/incompatible-library
  const rowVirtualizer = useVirtualizer({
    count: cards.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => viewMode === 'list' ? 150 : 350,
    overscan: 5,
  });

  if (!content || typeof content !== 'string') return null;

  return (
    <ErrorBoundary>
      <div className="content-with-shortcodes w-full" style={{ contain: 'layout paint' }}>
        
        {introContent && (
          <div className='w-full text-left mb-6 app-cms-content prose prose-lg dark:prose-invert max-w-none text-sdp-text-primary' style={{ contain: 'layout paint' }}>
            {introContent.split('\n\n').map((paragraph, idx) => (
              <p key={`intro-${idx}`} className="whitespace-pre-line last:mb-0" dangerouslySetInnerHTML={{
                __html: paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>')
              }} />
            ))}
          </div>
        )}
        
        <div className="flex items-center justify-end mb-[30px] overflow-x-auto no-scrollbar scroll-smooth w-full mt-[30px]">
          <div className="flex gap-1 pr-2 pb-2 shrink-0">
            <button onClick={() => setViewMode('single')} className={`p-2 rounded-xl transition-all flex items-center justify-center ${viewMode === 'single' ? 'bg-[#F97316] text-white shadow-sm' : 'text-black/50 dark:text-white/50 hover:bg-black/5 dark:hover:bg-white/5'}`}>
              <Square size={18} strokeWidth={2.5} />
            </button>
            <button onClick={() => setViewMode('grid')} className={`p-2 rounded-xl transition-all flex items-center justify-center ${viewMode === 'grid' ? 'bg-[#F97316] text-white shadow-sm' : 'text-black/50 dark:text-white/50 hover:bg-black/5 dark:hover:bg-white/5'}`}>
              <LayoutGrid size={18} strokeWidth={2.5} />
            </button>
            <button onClick={() => setViewMode('list')} className={`p-2 rounded-xl transition-all flex items-center justify-center ${viewMode === 'list' ? 'bg-[#F97316] text-white shadow-sm' : 'text-black/50 dark:text-white/50 hover:bg-black/5 dark:hover:bg-white/5'}`}>
              <List size={18} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        <div className="w-full flex flex-col gap-4" style={{ contain: 'layout paint' }}>
          {/* Textos Estàtics */}
          {textParts.map((part, index) => {
             if (part.content.trim() === '') return null;
             const paragraphs = part.content.split('\n\n').filter(p => p.trim() !== '');
             return (
               <div key={`text-wrapper-${index}`} className='w-full text-left block app-cms-content prose prose-lg dark:prose-invert max-w-none text-sdp-text-primary' style={{ contain: 'layout paint' }}>
                 {paragraphs.map((paragraph, pIdx) => (
                   <p key={`text-${index}-${pIdx}`} className="whitespace-pre-line last:mb-0" dangerouslySetInnerHTML={{
                     __html: paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>')
                   }} />
                 ))}
               </div>
             );
          })}
        </div>

        {/* CONTENIDOR VIRTUALITZAT DE TARGETES */}
        {cards.length > 0 && (
          <div ref={parentRef} className="w-full mt-6" style={{ height: `800px`, overflow: 'auto', contain: 'strict' }}>
            <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, width: '100%', position: 'relative' }}>
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const card = cards[virtualRow.index];
                return (
                  <div
                    key={`vcard-${virtualRow.index}`}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    <VirtualCard
                      cardType={card.cardType}
                      cardId={card.cardId}
                      index={virtualRow.index}
                      viewMode={viewMode}
                      onNavigate={navigate}
                      itemData={prepareCardData(card.cardType, card.cardId)}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </ErrorBoundary>
  );
};

export default React.memo(ContentWithShortcodes);
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UniversalCard from '../ui/universal-card';
import { MOCK_FEED, MOCK_MARKET_ITEMS, MOCK_TOWNS } from '../../data';
import { IAIES_MUNDIALS_ARRAY } from '../../app/config/iaiesMundialsMap';
import { getLogoUrl } from '../../data/mockIaiesPages';
import ErrorBoundary from './ErrorBoundary';
import { UniversalGridRow } from '../ui/UniversalGrid';
import { LayoutGrid, List, Square, Users, FileText } from 'lucide-react';

const TabButton = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-3 font-bold text-sm tracking-wide transition-all rounded-t-2xl whitespace-nowrap flex-1 lg:flex-none
      ${active ? 'text-theme-accent-primary bg-[var(--theme-accent-primary)]/10 shadow-[inset_0_-3px_0_var(--theme-accent-primary)]' : 'text-[var(--text-muted)] hover:text-theme-text hover:bg-black/5 dark:hover:bg-white/5'}`}
  >
    {icon} <span className="hidden lg:inline-block">{label}</span>
  </button>
);

const ConnectionsTab = () => {
  return (
    <div className="glass-rural p-6 rounded-3xl mx-auto shadow-sm border border-black/5 dark:border-white/5 mb-6 text-left w-full max-w-2xl animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center gap-3 mb-6 border-b border-black/10 dark:border-white/10 pb-4">
        <h3 className="font-bold text-theme-text text-lg flex items-center gap-2 leading-none">
          <Users size={20} className="text-theme-accent-primary" />
          Xarxa de Connexions
        </h3>
      </div>
      <div className="bg-[#FF6D23]/10 border border-[#FF6D23]/20 dark:border-[#FF6D23]/30 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-32 h-32 bg-[#FF6D23] opacity-5 rounded-full blur-2xl transform translate-x-10 -translate-y-10 pointer-events-none"></div>
        <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#FF6D23] shrink-0 shadow-sm relative z-10 bg-white p-1">
          <img src="/assets/system/ui/logo-socdepoble-rect-negre.svg" alt="Sóc de Poble" className="w-full h-full object-contain" />
        </div>
        <div className="text-center sm:text-left flex-1 relative z-10">
          <h4 className="font-black text-theme-text text-[17px] mb-0.5">Sóc de Poble Central</h4>
          <p className="text-[11px] sm:text-xs text-[var(--text-muted)] font-black uppercase tracking-wider">Connectat · Enrutador Principal</p>
        </div>
        <div className="shrink-0 mt-2 sm:mt-0 relative z-10">
          <span className="bg-[#FF6D23] text-white text-[10px] uppercase font-black px-3 py-1.5 rounded-full tracking-wider shadow-md">
            Arrel
          </span>
        </div>
      </div>
    </div>
  );
};

const ContentWithShortcodes = ({ content, hideTabs = false }) => {
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState('grid');
    const [activeTab, setActiveTab] = useState('content');

    if (!content || typeof content !== 'string') return null;

    const splitParts = content.split('[TABS_START]');
    const introContent = splitParts.length > 1 ? splitParts[0].trim() : null;
    const mainContent = splitParts.length > 1 ? splitParts[1].trim() : splitParts[0].trim();

    const shortcodeRegex = /\[CARD:(.+?):(.+?)\]/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = shortcodeRegex.exec(mainContent)) !== null) {
        if (match.index > lastIndex) {
            parts.push({ type: 'text', content: mainContent.slice(lastIndex, match.index) });
        }
        parts.push({ type: 'card', cardType: match[1], cardId: match[2] });
        lastIndex = shortcodeRegex.lastIndex;
    }

    if (lastIndex < mainContent.length) {
        parts.push({ type: 'text', content: mainContent.slice(lastIndex) });
    }

    const cardsCount = parts.filter(p => p.type === 'card').length;

    const renderCard = (cardType, cardId, index) => {
        let item = null;
        // Ja no forcem l'ample sencer quan estem al grid estandarditzat, UniversalGrid s'encarrega.
        const wrapperClass = `transition-all duration-300 w-full h-full`;

        if (cardType === 'ia' || cardType === 'agent') {
            item = IAIES_MUNDIALS_ARRAY.find(ia => ia.id === cardId);
            if (item) {
                const mappedItem = {
                    ...item,
                    title: item.name,
                    subtitle: item.type,
                    excerpt: item.shortDescription,
                    author_name: item.name,
                    author_avatar: item.logo_url || item.avatar_url || getLogoUrl(item.id),
                    image: getLogoUrl(item.id),
                    type: 'agent'
                };
                return (
                    <ErrorBoundary key={`card-${index}`}>
                        <React.Suspense fallback={<div className="h-48 rounded-2xl bg-black/5 dark:bg-white/5 animate-pulse w-full h-full" />}>
                            <UniversalCard
                                item={mappedItem}
                                title={mappedItem.title}
                                subtitle={mappedItem.subtitle}
                                avatarSrc={mappedItem.author_avatar}
                                avatarName={mappedItem.title}
                                excerpt={mappedItem.excerpt}
                                image={mappedItem.image}
                                viewMode={viewMode === 'single' ? 'grid' : viewMode}
                                variant="post"
                                color={item.color}
                                className="w-full h-full"
                                onNavigate={() => navigate(`/post/ia-${item.id}`)}
                            />
                        </React.Suspense>
                    </ErrorBoundary>
                );
            }
        } else if (cardType === 'post' || cardType === 'page') {
            item = MOCK_FEED.find(p => p.id === cardId || p.slug === cardId);
            if (item) {
                return (
                    <ErrorBoundary key={`card-${index}`}>
                        <React.Suspense fallback={<div className="h-48 rounded-2xl bg-black/5 dark:bg-white/5 animate-pulse w-full h-full" />}>
                            <UniversalCard
                                item={item}
                                title={item.title}
                                subtitle={item.post_subtitle || item.author}
                                avatarSrc={item.author_avatar}
                                avatarName={item.author}
                                excerpt={item.content || item.excerpt}
                                image={item.image_url?.[0]}
                                viewMode={viewMode === 'single' ? 'grid' : viewMode}
                                variant="post"
                                className="w-full h-full"
                                onNavigate={() => navigate(`/${item.type === 'page' ? 'post' : 'post'}/${item.slug || item.id}`)}
                            />
                        </React.Suspense>
                    </ErrorBoundary>
                );
            }
        } else if (cardType === 'town') {
            item = MOCK_TOWNS.find(t => t.id === cardId || t.name.toLowerCase() === cardId.toLowerCase());
            if (item) {
                return (
                    <ErrorBoundary key={`card-${index}`}>
                        <React.Suspense fallback={<div className="h-48 rounded-2xl bg-black/5 dark:bg-white/5 animate-pulse w-full h-full" />}>
                            <UniversalCard
                                item={item}
                                title={item.name}
                                subtitle={item.comarca}
                                avatarSrc={item.avatar_url || item.escudo_url}
                                avatarName={item.name}
                                excerpt={item.description}
                                image={item.image_url || item.escudo_url}
                                viewMode={viewMode === 'single' ? 'grid' : viewMode}
                                variant="town"
                                className="w-full h-full"
                                onNavigate={() => navigate(`/pobles/${item.id}`)}
                            />
                        </React.Suspense>
                    </ErrorBoundary>
                );
            }
        } else if (cardType === 'market') {
            item = MOCK_MARKET_ITEMS.find(m => String(m.id) === String(cardId));
            if (item) {
                return (
                    <ErrorBoundary key={`card-${index}`}>
                        <React.Suspense fallback={<div className="h-48 rounded-2xl bg-black/5 dark:bg-white/5 animate-pulse w-full h-full" />}>
                            <UniversalCard
                                item={item}
                                title={item.name}
                                subtitle={item.seller}
                                avatarSrc={item.seller_avatar}
                                avatarName={item.seller}
                                excerpt={item.description}
                                image={item.images?.[0]}
                                viewMode={viewMode === 'single' ? 'grid' : viewMode}
                                variant="market"
                                className="w-full h-full"
                                onNavigate={() => navigate(`/mercat/${item.id}`)}
                            />
                        </React.Suspense>
                    </ErrorBoundary>
                );
            }
        }

        return (
            <div key={`card-error-${index}`} className="my-4 p-4 border border-dashed border-red-500/50 rounded-xl bg-red-500/10 text-red-500 text-xs font-mono text-center">
                [Error renderitzant Card: {cardType}:{cardId} no trobat]
            </div>
        );
    };

    return (
        <ErrorBoundary>
            <div className="content-with-shortcodes w-full">
                
                {introContent && (
                    <div className="w-full text-left mb-6 app-cms-content prose prose-lg dark:prose-invert max-w-none text-[var(--text-primary)]">
                        {introContent.split('\n\n').map((paragraph, idx) => (
                            <p 
                                key={`intro-${idx}`} 
                                className="whitespace-pre-line last:mb-0"
                                dangerouslySetInnerHTML={{ 
                                    __html: paragraph
                                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                        .replace(/\*(.*?)\*/g, '<em>$1</em>')
                                }}
                            />
                        ))}
                    </div>
                )}
                
                {!hideTabs && (
                    <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 mb-[30px] overflow-x-auto no-scrollbar scroll-smooth w-full mt-[30px]">
                        <div className="flex gap-1 sm:gap-2">
                            <TabButton active={activeTab === 'content'} onClick={() => setActiveTab('content')} icon={<FileText size={18} />} label="Document" />
                            <TabButton active={activeTab === 'connections'} onClick={() => setActiveTab('connections')} icon={<Users size={18} />} label="Connexions" />
                        </div>
                        
                        <div className="flex gap-1 pr-2 pb-2 shrink-0">
                            <button 
                                onClick={() => setViewMode('single')}
                                className={`p-2 rounded-xl transition-all flex items-center justify-center ${viewMode === 'single' ? 'bg-[#F97316] text-white shadow-sm' : 'text-black/50 dark:text-white/50 hover:bg-black/5 dark:hover:bg-white/5'}`}
                                aria-label="Visualització única"
                            >
                                <Square size={18} strokeWidth={2.5} />
                            </button>
                            <button 
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-xl transition-all flex items-center justify-center ${viewMode === 'grid' ? 'bg-[#F97316] text-white shadow-sm' : 'text-black/50 dark:text-white/50 hover:bg-black/5 dark:hover:bg-white/5'}`}
                                aria-label="Visualització en graella"
                            >
                                <LayoutGrid size={18} strokeWidth={2.5} />
                            </button>
                            <button 
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-xl transition-all flex items-center justify-center ${viewMode === 'list' ? 'bg-[#F97316] text-white shadow-sm' : 'text-black/50 dark:text-white/50 hover:bg-black/5 dark:hover:bg-white/5'}`}
                                aria-label="Visualització en llista"
                            >
                                <List size={18} strokeWidth={2.5} />
                            </button>
                        </div>
                    </div>
                )}

                {!hideTabs && activeTab === 'connections' && <ConnectionsTab />}

                {activeTab === 'content' && (
                    <div className="w-full flex flex-col gap-4">
                        {(() => {
                            const elements = [];
                            let currentCardGroup = [];

                            const flushCardGroup = () => {
                                if (currentCardGroup.length > 0) {
                                    elements.push(
                                        <UniversalGridRow key={`group-${elements.length}`} viewMode={viewMode} columnCount={2} className="my-6 w-full">
                                            {currentCardGroup.map((card, i) => renderCard(card.cardType, card.cardId, `card-${elements.length}-${i}`))}
                                        </UniversalGridRow>
                                    );
                                    currentCardGroup = [];
                                }
                            };

                            parts.forEach((part, index) => {
                                if (part.type === 'text') {
                                    if (part.content.trim() === '') return;
                                    flushCardGroup();
                                    const paragraphs = part.content.split('\n\n').filter(p => p.trim() !== '');
                                    
                                    elements.push(
                                        <div key={`text-wrapper-${index}`} className="w-full text-left block app-cms-content prose prose-lg dark:prose-invert max-w-none text-[var(--text-primary)]">
                                            {paragraphs.map((paragraph, pIdx) => (
                                                <p 
                                                    key={`text-${index}-${pIdx}`} 
                                                    className="whitespace-pre-line last:mb-0"
                                                    dangerouslySetInnerHTML={{ 
                                                        __html: paragraph
                                                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                                            .replace(/\*(.*?)\*/g, '<em>$1</em>')
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    );
                                } else if (part.type === 'card') {
                                    currentCardGroup.push(part);
                                }
                            });

                            flushCardGroup();

                            return elements;
                        })()}
                    </div>
                )}
            </div>
        </ErrorBoundary>
    );
};

export default ContentWithShortcodes;

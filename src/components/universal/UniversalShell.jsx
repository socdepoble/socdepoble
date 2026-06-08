import React, { memo, Suspense } from 'react';

import SEO from '../core/SEO';

import UniversalHeader from './UniversalHeader';
import UniversalHero from './UniversalHero';

import UniversalCardHeader from '../ui/universal-card/UniversalCard.Header';

import FloatingIndex from '../ui/FloatingIndex';

const HistoryModal = React.lazy(
    () => import('../modals/HistoryModal')
);

const MediaViewerModal = React.lazy(
    () => import('../modals/MediaViewerModal')
);

const UniversalShell = memo(({
    viewModel,
    handlers,
    children
}) => {

    const {
        seo = {},
        page = {},
        presentation = {},
        hero = {},
        media = {}
    } = viewModel || {};

    const {
        isIndexOpen = false,
        isIndexPinned = false,
        toggleIndex = () => {},
        togglePin = () => {}
    } = handlers?.ui || {};

    const mediaHandlers = handlers?.media || {};
    const refsHandlers = handlers?.refs || {};
    const historyHandlers = handlers?.history || {};

    return (
        <div className="flex flex-col h-full min-h-0">

            {seo.enabled && (
                <SEO
                    title={seo.title}
                    description={seo.description}
                    image={seo.image}
                    url={seo.url}
                />
            )}

            <UniversalHeader
                routeSlug={page.slug}
                title={presentation.title}
                isIndexOpen={isIndexOpen}
                onToggleIndex={toggleIndex}
            />

            <main
                ref={refsHandlers.scrollContainerRef}
                className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar"
            >
                <UniversalHero
                    images={hero.images}
                    format={hero.format}
                    position={hero.position}
                    onImageClick={mediaHandlers.openViewer}
                />

                <div className="sticky top-0 z-[190]">
                    <UniversalCardHeader
                        item={page.item}
                        cardVariant="project"
                        displayTown={page.item?.town_name || page.item?.town || page.town || ''}
                        displayAuthor={page.item?.author_name || page.item?.author || page.author || 'Sóc de Poble'}
                        avatarSrc={page.item?.author_avatar || page.item?.logo_url || page.logo || ''}
                        avatarRole={page.item?.author_role || page.role}
                        isOfficial={page.item?.is_official || page.item?.official || true}
                        displayDate={page.item?.created_at ? new Date(page.item.created_at).toLocaleDateString('ca-ES') : ''}
                        displayTime={page.item?.time || ''}
                        isPageHeader
                    />
                </div>

                {children}
            </main>

            <FloatingIndex
                scrollRef={refsHandlers.scrollContainerRef}
                isOpen={isIndexOpen}
                isPinned={isIndexPinned}
                onToggle={toggleIndex}
                onPinToggle={togglePin}
            />

            {!!media.current && (
                <Suspense fallback={null}>
                    <MediaViewerModal
                        isOpen
                        src={media.current}
                        images={media.images}
                        onClose={mediaHandlers.closeViewer}
                        onNavigate={mediaHandlers.navigate}
                    />
                </Suspense>
            )}

            {historyHandlers?.isOpen && (
                <Suspense fallback={null}>
                    <HistoryModal
                        isOpen
                        pageId={page.id}
                        onClose={historyHandlers.close}
                        onRestore={historyHandlers.restore}
                    />
                </Suspense>
            )}

        </div>
    );
});

UniversalShell.displayName = 'UniversalShell';

export default UniversalShell;

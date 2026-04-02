import { useMemo } from 'react';

import UniversalCard from './UniversalCard';

/**
 * Renderització fluida i natural per al feed històric.
 * S'ha suprimit la virtualització (react-window) que empresonava els components
 * en divs fantasmes de 280px d'altura, permetent el scroll natiu del navegador.
 */
export default function VirtualizedEventFeed({ effectiveViewMode, events }) {
    // Sort una sola vez + memo, y copia el array para no mutar el padre
    const sortedEvents = useMemo(() => {
        if (!events) return [];
        return [...events].sort((a, b) => {
            const dateA = new Date(a.date || a.start || a.created_at || 0).getTime();
            const dateB = new Date(b.date || b.start || b.created_at || 0).getTime();
            return (isNaN(dateB) ? Number.MAX_SAFE_INTEGER : dateB) - 
                   (isNaN(dateA) ? Number.MAX_SAFE_INTEGER : dateA);
        });
    }, [events]);



    if (!sortedEvents.length) {
        return <div className="p-8 text-center text-theme-text/60">Encara no hi ha esdeveniments a la plaça...</div>;
    }

    return (
        <div className="w-full pb-16">
            <div className={`px-4 w-full ${
                effectiveViewMode === 'grid' 
                    ? 'grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                    : 'flex flex-col gap-4'
            }`}>
                {sortedEvents.map((event, index) => {
                    const mappedItem = {
                        ...event,
                        id: event.id || index.toString(),
                        title: event.title || 'Sense Títol',
                        content: event.description || '',
                        image_url: event.image_url || event.extendedProps?.image_url,
                        created_at: event.date || event.start || event.created_at,
                        author_name: event.author_name || 'Poble'
                    };
                    return (
                        <UniversalCard
                            key={mappedItem.id}
                            item={mappedItem}
                            id={mappedItem.id}
                            type={mappedItem.type || 'village'}
                            title={mappedItem.title}
                            excerpt={mappedItem.content}
                            image={mappedItem.image_url}
                            metadata={{
                                tag: mappedItem.created_at,
                                avatar: mappedItem.author_avatar,
                                subTag: `ID: ${String(mappedItem.id).slice(0, 8)}`,
                                author: mappedItem.author_name
                            }}
                            viewMode={effectiveViewMode}
                            url={!String(mappedItem.id).startsWith('MOCK') ? `/sessio/${String(mappedItem.id).replace('gcal-', '')}` : '#'}
                        />
                    );
                })}
            </div>
        </div>
    );
}

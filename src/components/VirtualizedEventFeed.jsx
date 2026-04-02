import { useRef, useCallback } from 'react';
import { FixedSizeList as List } from 'react-window';
import UniversalCard from './UniversalCard';
import { useRhizomeEvents } from '../hooks/useRhizomeEvents';

/**
 * Renderització virtualitzada pura per al feed històric.
 * Només renderitza les cartes visibles + 5 de buffer.
 * Funciona en mòbils de 1 GB RAM amb 10.000+ esdeveniments.
 */
export default function VirtualizedEventFeed({ effectiveViewMode, events: propEvents }) {
    const { events: rhizomeEvents } = useRhizomeEvents();
    const events = propEvents || rhizomeEvents;
    const listRef = useRef(null);

    const Row = useCallback(({ index, style }) => {
        const event = events[index];
        // Ensure event exists (safety check)
        if (!event) return null;
        
        return (
            <div style={style} className="px-4 py-3">
                <UniversalCard
                    key={event.id || index}
                    id={event.id || index.toString()}
                    type={event.type || 'village'}
                    title={event.title || 'Sense Títol'}
                    description={event.description || ''}
                    imageUrl={event.image_url}
                    metadata={{
                        tag: event.date,
                        avatar: event.author_avatar,
                        subTag: `ID: ${String(event.id || 'N/A').slice(0, 8)}`,
                        author: event.author_name || 'Poble'
                    }}
                    viewMode={effectiveViewMode}
                    url={`/sessio/${event.id}`}
                />
            </div>
        );
    }, [events, effectiveViewMode]);

    if (!events.length) {
        return <div className="p-8 text-center text-theme-text/60">Encara no hi ha esdeveniments a la plaça...</div>;
    }

    // Sort events safely (newest first, by date)
    events.sort((a, b) => {
        const dateA = new Date(a.date || 0).getTime();
        const dateB = new Date(b.date || 0).getTime();
        return (isNaN(dateB) ? Number.MAX_SAFE_INTEGER : dateB) - 
               (isNaN(dateA) ? Number.MAX_SAFE_INTEGER : dateA);
    });

    return (
        <List
            ref={listRef}
            height={Math.max(window.innerHeight - 300, 400)} // s'adapta al viewport limitat a un minim de 400
            itemCount={events.length}
            itemSize={280} // altura fixa de UniversalCard (ajusta segons el teu disseny)
            width="100%"
            overscanCount={5} // buffer perfecte per a scroll suau
            className="scrollbar-none"
        >
            {Row}
        </List>
    );
}

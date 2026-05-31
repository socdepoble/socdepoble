import { useState, useEffect, useMemo, useCallback } from 'react';
import { rhizomeManager } from '../core/services/rhizomeManager';

/**
 * Hook màgic que connecta el CRDT (Yjs) amb React.
 * Subscriu-se als canvis de l'array 'events' i actualitza l'estat local
 * sense double-renders ni race conditions.
 * Perfecte per alimentar MasterCalendar en temps real (WebRTC + IPFS).
 */
export function useRhizomeEvents() {
    const [events, setEvents] = useState(() => {
        // Estat inicial des del CRDT (evita flash en mount)
        return rhizomeManager.yDoc.getArray('events').toArray();
    });

    const handleYjsUpdate = useCallback(() => {
        // Només actualitzem quan realment canvia l'array 'events'
        const currentEvents = rhizomeManager.yDoc.getArray('events').toArray();
        setEvents(currentEvents);
    }, []);

    useEffect(() => {
        const eventsArray = rhizomeManager.yDoc.getArray('events');

        // Observador profund (Yjs natiu) – només es dispara quan canvia l'array
        eventsArray.observeDeep(handleYjsUpdate);

        // També escoltem updates generals del document (WebRTC/IPFS)
        rhizomeManager.yDoc.on('update', handleYjsUpdate);

        // Cleanup perfecte (evita memory leaks)
        return () => {
            eventsArray.unobserveDeep(handleYjsUpdate);
            rhizomeManager.yDoc.off('update', handleYjsUpdate);
        };
    }, [handleYjsUpdate]);

    // Memoitzem per evitar renders innecessaris al MasterCalendar
    const memoizedEvents = useMemo(() => events, [events]);

    return {
        events: memoizedEvents,
        // Mètode per afegir manualment (usat des del CreateEventModal)
        addEvent: useCallback((newEvent) => {
            rhizomeManager.yDoc.getArray('events').push([newEvent]);
        }, [])
    };
}

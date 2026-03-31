import { useState, useEffect, useCallback } from 'react';
import { calendarService } from '../services/calendarService';
import { useAuth } from '../context/AuthContext';

export const useInternalCalendar = (currentDate) => {
    const { user, isAdmin } = useAuth();
    const [internalCalendars, setInternalCalendars] = useState([]);
    const [selectedInternalCalIds, setSelectedInternalCalIds] = useState(() => {
        try { return JSON.parse(localStorage.getItem('sdb_selected_internal_calendars') || '[]'); } 
        catch { return []; }
    });
    const [internalEvents, setInternalEvents] = useState([]);
    const [loadingInternal, setLoading] = useState(false);

    // Filter by role (basic logic: Master sees all, others see authenticated ones)
    const isMaster = isAdmin || user?.app_metadata?.role === 'master';

    useEffect(() => {
        const fetchCals = async () => {
            const data = await calendarService.fetchInternalCalendars();
            // Mostrar els formals depenent del rol:
            const filtered = data.filter(cal => {
                if (cal.role_required === 'master') return isMaster;
                return true;
            });
            setInternalCalendars(filtered);
            
            // Auto checkear per defecte el de la comunitat la primera vegada
            if (!localStorage.getItem('sdb_selected_internal_calendars') && filtered.length > 0) {
                const defaultSelections = filtered.map(f => f.id);
                setSelectedInternalCalIds(defaultSelections);
                localStorage.setItem('sdb_selected_internal_calendars', JSON.stringify(defaultSelections));
            }
        };
        fetchCals();
    }, [isMaster]);

    const toggleInternalCalendar = useCallback((id) => {
        const newer = selectedInternalCalIds.includes(id) 
           ? selectedInternalCalIds.filter(v => v !== id)
           : [...selectedInternalCalIds, id];
        setSelectedInternalCalIds(newer);
        localStorage.setItem('sdb_selected_internal_calendars', JSON.stringify(newer));
    }, [selectedInternalCalIds]);

    useEffect(() => {
        let isActive = true;

        const fetchEvents = async () => {
            if (selectedInternalCalIds.length === 0) {
                if (isActive) setInternalEvents([]);
                return;
            }

            if (isActive) setLoading(true);
            const startRange = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1).toISOString();
            const endRange = new Date(currentDate.getFullYear(), currentDate.getMonth() + 2, 0, 23, 59, 59).toISOString();
            
            const fetched = await calendarService.fetchInternalEvents(selectedInternalCalIds, startRange, endRange);
            if (isActive) {
                setInternalEvents(fetched);
                setLoading(false);
            }
        };

        fetchEvents();

        return () => {
            isActive = false;
        };
    }, [selectedInternalCalIds, currentDate]);

    // Realtime changes!
    useEffect(() => {
        const unsub = calendarService.subscribeToCalendarChanges(() => {
            // Re-fetch para evitar logic compleja al borrar/actualizar
            if (selectedInternalCalIds.length > 0) {
                const startRange = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1).toISOString();
                const endRange = new Date(currentDate.getFullYear(), currentDate.getMonth() + 2, 0, 23, 59, 59).toISOString();
                calendarService.fetchInternalEvents(selectedInternalCalIds, startRange, endRange).then(setInternalEvents);
            }
        });
        return () => unsub();
    }, [selectedInternalCalIds, currentDate]);

    const fetchInternalEventsRange = async (startStr, endStr) => {
        if (selectedInternalCalIds.length === 0) return [];
        return await calendarService.fetchInternalEvents(selectedInternalCalIds, startStr, endStr);
    };

    return {
        internalCalendars,
        selectedInternalCalIds,
        toggleInternalCalendar,
        internalEvents,
        loadingInternal,
        fetchInternalEventsRange
    };
};

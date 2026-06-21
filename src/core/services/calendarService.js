import { supabase } from '../../supabaseClient';
import { logger } from '../../utils/logger';

/**
 * Servicio encargado de gestionar los calendarios internos de Sóc de Poble.
 * - Sincroniza calendarios base (Súperadmins, Tú y Yo, Betatesters)
 * - Agrega visibilidad a los Agentes ("interacciones agendadas")
 */
export const calendarService = {
    // 1. OBTENER GRUPOS DE CALENDARIO DISPONIBLES (Sóc de Poble)
    async fetchInternalCalendars() {
        // TODO: Restore Supabase fetch when sdb_internal_calendars table is configured
        return [];
    },

    // 2. OBTENER EVENTOS DE LOS GRUPOS SELECCIONADOS
    async fetchInternalEvents(calendarIds, startDate, endDate) {
        if (!calendarIds || calendarIds.length === 0) return [];
        
        try {
            const { data, error } = await supabase
                .from('sdb_internal_calendar_events')
                .select(`
                    id, 
                    title, 
                    description, 
                    date,
                    time_start,
                    agent_id,
                    calendar_id,
                    sdb_internal_calendars (color_id, name)
                `)
                .in('calendar_id', calendarIds)
                .gte('date', startDate)
                .lte('date', endDate)
                .order('time_start', { ascending: true });
            
            if (error) throw error;

            // Formatear al estándar asimétrico / híbrido para nuestra grilla
            return (data || []).map(item => ({
                id: `sdb-${item.id}`,
                uuid: item.id,
                date: item.date,
                title: item.title,
                description: item.description || '',
                type: 'internal', // flag de render
                agentId: item.agent_id,
                calendarId: item.calendar_id,
                calendarName: item.sdb_internal_calendars?.name,
                colorId: item.sdb_internal_calendars?.color_id,
                timeStart: item.time_start
            }));

        } catch (error) {
            logger.error("[CalendarService] Error fetching events:", error.message);
            return [];
        }
    },

    // 3. AÑADIR NUEVO EVENTO COMPARTIDO
    async createInternalEvent(eventData) {
        try {
            const { data, error } = await supabase
                .from('sdb_internal_calendar_events')
                .insert([{
                    calendar_id: eventData.calendar_id,
                    title: eventData.title,
                    description: eventData.description,
                    date: eventData.date,
                    time_start: eventData.time_start || null,
                    agent_id: eventData.agent_id || null
                }])
                .select()
                .single();
            
            if (error) throw error;
            return data;
        } catch (error) {
            logger.error("[CalendarService] Error creating event:", error.message);
            throw error;
        }
    },

    // 4. SUSCRIBIR A CAMBIOS EN TIEMPO REAL (Interacciones en directo)
    subscribeToCalendarChanges(callback) {
        const channel = supabase.channel('realtime_calendar_events')
            .on('postgres_changes', 
                { event: '*', schema: 'public', table: 'sdb_internal_calendar_events' },
                (payload) => {
                    callback(payload);
                }
            )
            .subscribe();

        return () => {
            try { 
                supabase.removeChannel(channel).catch(() => {}); 
            } catch {
                // Silenciamos posibles errores de desconexión prematura
            }
        };
    }
};

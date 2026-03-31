import { useState, useEffect } from 'react';

/**
 * Hook autònom per llegir esdeveniments d'un Google Calendar públic
 * 
 * Requereix al fitxer .env:
 * VITE_GOOGLE_CALENDAR_API_KEY=la_teua_clau
 * VITE_GOOGLE_CALENDAR_ID=el_teu_id_de_calendari@gmail.com
 */
export const useGoogleCalendar = (currentDate) => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const API_KEY = import.meta.env.VITE_GOOGLE_CALENDAR_API_KEY;
    const CALENDAR_ID = import.meta.env.VITE_GOOGLE_CALENDAR_ID;

    useEffect(() => {
        if (!API_KEY || !CALENDAR_ID) {
            // Silenciosament desactivat si no hi ha claus
            return;
        }

        const fetchEvents = async () => {
            setLoading(true);
            setError(null);

            try {
                // Calculem l'inici i final del mes actual per no descarregar-ho tot
                const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString();
                const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59).toISOString();

                const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events?key=${API_KEY}&timeMin=${startOfMonth}&timeMax=${endOfMonth}&singleEvents=true&orderBy=startTime`;

                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Error al sincronitzar Google Calendar');
                }

                const data = await response.json();
                
                // Formategem a la semàntica del MasterCalendar (GEM Modern)
                const formattedEvents = (data.items || []).map(item => {
                    // Google retorna dateTime per events amb hora o date per events de tot el dia
                    const eventDate = item.start.dateTime || item.start.date;
                    // Extraiem només YYYY-MM-DD per facilitar la ubicació a la graella
                    const dateTag = eventDate.split('T')[0];

                    return {
                        id: `gcal-${item.id}`,
                        date: dateTag,
                        title: item.summary || 'Esdeveniment',
                        description: item.description || '',
                        type: 'personal', // Per defecte ho pintem verd
                        // Assignem al Súper Rató l'atribut per defecte d'esdeveniments externs
                        agentId: '11111111-1a1a-0001-0000-000000000004' 
                    };
                });

                setEvents(formattedEvents);
            } catch (err) {
                console.error("Google Calendar Error:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [currentDate, API_KEY, CALENDAR_ID]);

    return { events, loading, error };
};

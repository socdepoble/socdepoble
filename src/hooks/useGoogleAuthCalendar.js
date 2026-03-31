import { useState, useEffect, useCallback } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { secureTokenStorage } from '../services/secureTokenStorage';

/**
 * Mòdul mestre de connexió bidireccional amb Google Calendar a través d'OAuth2
 * Funciona de manera aïllada i llegeix/modifica calendaris privats de l'usuari.
 */
export const useGoogleAuthCalendar = (currentDate) => {
    const [token, setToken] = useState(null);
    const [isTokenLoaded, setIsTokenLoaded] = useState(false);
    const [calendars, setCalendars] = useState([]);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Carregar el token segur en muntar
    useEffect(() => {
        secureTokenStorage.getToken().then(savedToken => {
            setToken(savedToken);
            setIsTokenLoaded(true);
        }).catch(() => {
            setIsTokenLoaded(true);
        });
    }, []);

    // Registre local de configuracions
    const [selectedCalIds, setSelectedCalIds] = useState(() => {
        try { return JSON.parse(localStorage.getItem('gcal_selected_calendars') || '[]'); } 
        catch { return []; }
    });
    
    const [hostCalId, setHostCalId] = useState(() => localStorage.getItem('gcal_host_calendar') || null);

    // Trigger de Popup de Google Oauth
    const login = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setToken(tokenResponse.access_token);
            await secureTokenStorage.setToken(tokenResponse.access_token);
            setError(null);
        },
        onError: (err) => setError(err.message || 'OAuth Pop-up Blocked'),
        scope: 'https://www.googleapis.com/auth/calendar'
    });

    const logout = useCallback(async () => {
        setToken(null);
        setCalendars([]);
        setEvents([]);
        await secureTokenStorage.removeToken();
    }, []);

    const toggleCalendar = (id) => {
        const newer = selectedCalIds.includes(id) 
           ? selectedCalIds.filter(v => v !== id)
           : [...selectedCalIds, id];
        setSelectedCalIds(newer);
        localStorage.setItem('gcal_selected_calendars', JSON.stringify(newer));
    };

    const toggleHost = (id) => {
        // Només pots seleccionar un o cap
        const newVal = hostCalId === id ? null : id;
        setHostCalId(newVal);
        if (newVal) {
            localStorage.setItem('gcal_host_calendar', newVal);
        } else {
            localStorage.removeItem('gcal_host_calendar');
        }
    };

    // Efecte 1: Obtenir la llista de Calendaris si tenim token
    useEffect(() => {
        if (!token) return;
        const fetchCalendars = async () => {
            try {
                const res = await fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.status === 401) { logout(); return; } // Token ha mort, forçem desconnexió cívica
                const data = await res.json();
                setCalendars(data.items || []);
            } catch { 
                setError("No s'han pogut llegir els teus calendaris.");
            }
        };
        fetchCalendars();
    }, [token, logout]);

    // Efecte 2: Descarregar esdeveniments dels calendaris activats 
    useEffect(() => {
        if (!token || selectedCalIds.length === 0) {
            setEvents([]);
            return;
        }

        const fetchAllEvents = async () => {
            setLoading(true);
            try {
                // Generem un radi de descàrrega asimètric temporal (1 mes avant, 1 enrere) 
                // Segons el currentDate seleccionat al MasterCalendar per a tindre reixa fluida.
                const startRange = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1).toISOString();
                const endRange = new Date(currentDate.getFullYear(), currentDate.getMonth() + 2, 0, 23, 59, 59).toISOString();
                
                let combinedEvents = [];
                for (let calId of selectedCalIds) {
                    const res = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calId)}/events?timeMin=${startRange}&timeMax=${endRange}&singleEvents=true&orderBy=startTime`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (!res.ok) continue; // Si un dóna error, passem al següent transparentment
                    const data = await res.json();
                    
                    const formatted = (data.items || []).map(item => {
                        const eventDate = item.start.dateTime || item.start.date;
                        return {
                            id: `gcal-${item.id}`,
                            date: eventDate ? eventDate.split('T')[0] : null,
                            title: item.summary || 'Esdeveniment',
                            description: item.description || '',
                            type: 'personal',
                            agentId: '11111111-1a1a-0001-0000-000000000004', // Súper Rató / Sistema Adherit
                            sourceCalendarId: calId,
                            colorId: item.colorId || null,
                            timeStart: item.start.dateTime || null
                        };
                    }).filter(ev => ev.date); // Ignorem si per alguna rao corrupte de google no tinguera data
                    combinedEvents.push(...formatted);
                }
                setEvents(combinedEvents);
            } catch (e) { 
                setError(e.message); 
            } finally { 
                setLoading(false); 
            }
        };
        fetchAllEvents();
    }, [token, selectedCalIds, currentDate]);

    // Action 3: Crear (Pushear) esdeveniments de SOC cap a GOOGLE
    const createEvent = async (summary, date, description = '') => {
        if (!token || !hostCalId) throw new Error("Has de connectar i seleccionar el 'Host' primer.");
        
        // Estructura agnòstica M3 Sóc de Poble a -> Google Protocol
        // Assignem TOT EL DIA ('date') en compte de 'dateTime' per a major flexibilitat
        const ev = { 
            summary, 
            description: `${description}\n\n[Bategat des de Sóc de Poble 🌐]`, 
            start: { date }, 
            end: { date } 
        };

        const res = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(hostCalId)}/events`, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${token}`, 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(ev)
        });
        
        if(!res.ok) throw new Error("A google no li ha agradat aquest fitxer.");
        const newData = await res.json();
        
        // Ho afegim al local state per a auto-refresh màgic visual sense petició de xarxa!
        setEvents(prev => [...prev, {
            id: `gcal-${newData.id}`,
            date: date,
            title: summary,
            description: description,
            type: 'personal',
            agentId: '11111111-1a1a-0001-0000-000000000004',
            sourceCalendarId: hostCalId
        }]);

        return newData;
    }

    const fetchGoogleEventsRange = async (startStr, endStr) => {
        if (!token || selectedCalIds.length === 0) return [];
        
        const fetchCalendarEvents = async (calId) => {
            let events = [];
            let pageToken = null;
            try {
                do {
                    const url = new URL(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calId)}/events`);
                    url.searchParams.append('timeMin', startStr);
                    url.searchParams.append('timeMax', endStr);
                    url.searchParams.append('singleEvents', 'true');
                    url.searchParams.append('orderBy', 'startTime');
                    url.searchParams.append('maxResults', '2500'); // Optimize batch size
                    if (pageToken) url.searchParams.append('pageToken', pageToken);

                    const res = await fetch(url.toString(), {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    
                    if (!res.ok) {
                         const errorBody = await res.text();
                         console.error(`Google API Error for ${calId}:`, res.status, errorBody);
                         break;
                    }
                    
                    const data = await res.json();
                    
                    const formatted = (data.items || []).map(item => {
                        const eventDate = item.start?.dateTime || item.start?.date;
                        return {
                            id: `gcal-${item.id}`,
                            date: eventDate ? eventDate.split('T')[0] : null,
                            title: item.summary || 'Esdeveniment',
                            description: item.description || '',
                            type: 'personal',
                            agentId: '11111111-1a1a-0001-0000-000000000004', 
                            sourceCalendarId: calId,
                            colorId: item.colorId || null,
                            timeStart: item.start?.dateTime || null
                        };
                    }).filter(ev => ev.date);
                    
                    events.push(...formatted);
                    pageToken = data.nextPageToken;
                } while (pageToken);
                return events;
            } catch (error) {
                console.error(`Error fetching events for google calendar ${calId}:`, error);
                return [];
            }
        };

        const results = await Promise.all(selectedCalIds.map(fetchCalendarEvents));
        return results.flat();
    };
    // Action 4: CREAR UN CALENDARI EN GOOGLE DIRECTAMENT (Simbiosi Absoluta)
    const createCalendarAsUser = async (name) => {
        if (!token) throw new Error("Has de connectar amb Google primer.");
        
        const res = await fetch(`https://www.googleapis.com/calendar/v3/calendars`, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${token}`, 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ summary: name })
        });
        
        if(!res.ok) throw new Error("Error en crear el calendari a Google.");
        const newCal = await res.json();
        
        setCalendars(prev => [...prev, newCal]);
        return newCal;
    };

    // Action 5: COMPARTIR CALENDARI VIA GOOGLE ACL
    const shareCalendar = async (calId, email, role = 'reader') => {
        if (!token) throw new Error("Has de connectar amb Google primer.");
        
        const res = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calId)}/acl`, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${token}`, 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({
                role: role,
                scope: {
                    type: "user",
                    value: email
                }
            })
        });
        
        if(!res.ok) throw new Error("No s'ha pogut enviar l'accés a Google.");
        return await res.json();
    };

    return { 
        token, 
        isTokenLoaded,
        login, 
        logout, 
        calendars, 
        selectedCalIds, 
        toggleCalendar, 
        hostCalId, 
        toggleHost, 
        events, 
        loading, 
        error, 
        createEvent,
        createCalendarAsUser,
        shareCalendar,
        fetchGoogleEventsRange
    };
};

import { useNavigate } from 'react-router-dom';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Sparkles, Brain, ArrowLeft } from 'lucide-react';
import { CALENDAR_EVENTS } from '../data/calendarData';
import { MOCK_EVENTS } from '../data';
import './MasterCalendar.css';

const MasterCalendar = () => {
    const navigate = useNavigate();
    const today = new Date();

    // Ancoratges de Memòria des de la xarxa Rhizome
    const events = [...CALENDAR_EVENTS, ...MOCK_EVENTS];

    return (
        <div className="calendar-master-page animate-in">
            <header className="calendar-header">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors border border-white/10 shrink-0"
                        title="Tornar"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div className="title-group">
                        <CalendarIcon size={24} color="var(--hud-accent)" />
                        <h1>CALENDARI MASTER [SIMBIOSI]</h1>
                    </div>
                </div>
                <div className="calendar-controls">
                    <button className="btn-calendar-nav" onClick={() => alert('Funció de navegació de mesos en procés de bategat [GENESIS]')}>
                        <ChevronLeft />
                    </button>
                    <span className="current-month">FEBRER 2026</span>
                    <button className="btn-calendar-nav" onClick={() => alert('Funció de navegació de mesos en procés de bategat [GENESIS]')}>
                        <ChevronRight />
                    </button>
                </div>
            </header>

            <div className="calendar-grid">
                {/* Cabecera de días */}
                {['dl', 'dt', 'dc', 'dj', 'dv', 'ds', 'dg'].map(d => (
                    <div key={d} className="day-name">{d.toUpperCase()}</div>
                ))}

                {/* Días vacíos hasta el 1 de Febrero (2026 empieza en un domingo) */}
                {[...Array(0)].map((_, i) => <div key={`empty-${i}`} className="calendar-day empty" />)}

                {/* Días del mes */}
                {[...Array(28)].map((_, i) => {
                    const day = i + 1;
                    const dateStr = `2026-02-${day.toString().padStart(2, '0')}`;
                    const dayEvents = events.filter(e => e.date === dateStr);

                    return (
                        <div key={day} className={`calendar-day ${day === today.getDate() && today.getMonth() === 1 ? 'today' : ''}`}>
                            <span className="day-number">{day}</span>
                            <div className="day-events">
                                {dayEvents.map(event => (
                                    <div
                                        key={event.id}
                                        className={`event-tag ${event.type}`}
                                        onClick={() => window.location.href = `/sessio/${event.id}`}
                                    >
                                        <Sparkles size={10} />
                                        <span>{event.title}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            <section className="memory-anchors-list">
                <div className="section-header">
                    <Brain size={18} color="var(--hud-accent)" />
                    <h2>ÀNCORAS DE MEMÒRIA RECENT</h2>
                </div>
                <div className="anchors-grid">
                    {events.map(event => (
                        <div key={event.id} className="anchor-card" onClick={() => window.location.href = `/sessio/${event.id}`}>
                            <div className="anchor-date">{event.date}</div>
                            <h3>{event.title}</h3>
                            <p>{event.description}</p>
                            <div className="anchor-id">ID: {event.id}</div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default MasterCalendar;

import './CalendarMaster.css';

const CalendarMaster = ({ selectedDate = new Date() }) => {
    // Timeline de 08:00 a 19:00
    const timelineHours = Array.from({ length: 12 }, (_, i) => i + 8);

    // Dades de mostra per a visualitzar el component (AgriSync, Simbiosi, etc.)
    const events = [
        {
            id: 1,
            title: 'Simbiosi - Revisió Arquitectura',
            type: 'cyan', // Neon Cyan
            startHour: 9,
            duration: 2, // Hores
            description: 'Auditoria de capes i components core.'
        },
        {
            id: 2,
            title: 'AgriSync - Sincronització de Dades',
            type: 'cyan', // Neon Cyan
            startHour: 11.5,
            duration: 1.5,
            description: 'Verificació offline P2P.'
        },
        {
            id: 3,
            title: 'Design Sync - Nova UI M3',
            type: 'orange', // Neon Orange
            startHour: 14,
            duration: 2,
            description: 'Alineació Trellat.'
        },
        {
            id: 4,
            title: 'Pet Project - L\'Hort Electrònic',
            type: 'orange', // Neon Orange
            startHour: 16.5,
            duration: 2.5,
            description: 'Desplegament V13.'
        }
    ];

    return (
        <div className="calendar-master-container">
            <header className="calendar-master-header">
                <div className="calendar-header-left">
                    <h1 className="calendar-title">CALENDARI MESTRE</h1>
                    <span className="calendar-subtitle">[Simbiosi]</span>
                </div>
                <div className="calendar-header-right">
                    <div className="calendar-date-badge">
                        <span className="calendar-day">{selectedDate.getDate()}</span>
                        <span className="calendar-month">
                            {selectedDate.toLocaleString('ca-ES', { month: 'short' }).toUpperCase()}
                        </span>
                    </div>
                </div>
            </header>

            <div className="calendar-master-body">
                <div className="calendar-timeline-column">
                    {timelineHours.map(hour => (
                        <div key={hour} className="timeline-hour-marker">
                            <span className="timeline-hour-text">{`${hour.toString().padStart(2, '0')}:00`}</span>
                        </div>
                    ))}
                </div>

                <div className="calendar-events-grid">
                    {/* Background Grid Lines */}
                    <div className="calendar-grid-lines">
                        {timelineHours.map(hour => (
                            <div key={`line-${hour}`} className="grid-line-horizontal" />
                        ))}
                    </div>

                    {/* Events */}
                    {events.map(event => {
                        const topPosition = (event.startHour - 8) * 60; // 60px per hora
                        const height = event.duration * 60;
                        
                        return (
                            <div 
                                key={event.id}
                                className={`calendar-event-block event-${event.type}`}
                                style={{
                                    top: `${topPosition}px`,
                                    height: `${height}px`
                                }}
                            >
                                <div className="event-content">
                                    <h3 className="event-title">{event.title}</h3>
                                    <p className="event-description">{event.description}</p>
                                    <span className="event-time">
                                        {`${Math.floor(event.startHour).toString().padStart(2, '0')}:${(event.startHour % 1 * 60).toString().padStart(2, '0')}`} - 
                                        {`${Math.floor(event.startHour + event.duration).toString().padStart(2, '0')}:${((event.startHour + event.duration) % 1 * 60).toString().padStart(2, '0')}`}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default CalendarMaster;

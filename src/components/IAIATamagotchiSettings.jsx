import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles, BellRing, Calendar, Clock, Smile, Trash2, Save, Power } from 'lucide-react';
import { supabaseService } from '../services/supabaseService';
import { pushService } from '../services/pushService';
import pushNotifications from '../services/pushNotifications';
import { logger } from '../utils/logger';
import Avatar from './Avatar';
import './IAIATamagotchiSettings.css';

const IAIATamagotchiSettings = ({ userId, profile, onUpdate }) => {
    const { t } = useTranslation();
    const [settings, setSettings] = useState(profile?.iaia_settings || {
        enabled: false,
        avatar_id: null,
        schedule: {
            days: [1, 2, 3, 4, 5, 6, 7],
            morning_alert: "08:00",
            night_alert: "22:00"
        },
        roleplay_level: 1
    });
    const [isSaving, setIsSaving] = useState(false);
    const [personas, setPersonas] = useState([]);
    const [isPushEnabled, setIsPushEnabled] = useState(false);

    useEffect(() => {
        supabaseService.getAllPersonas().then(setPersonas);

        // Check real push status
        const checkPush = async () => {
            const subscribed = await pushService.isSubscribed();
            setIsPushEnabled(subscribed);

            // Sync UI if mismatch (e.g. user cleared browser data)
            if (settings.enabled && !subscribed) {
                // We don't auto-disable here to avoid flickering, but we know state is inconsistent
                logger.warn('[IAIA] Settings enabled but push not subscribed');
            }
        };
        checkPush();
    }, []);

    const toggleDay = (day) => {
        const currentDays = settings.schedule.days;
        const newDays = currentDays.includes(day)
            ? currentDays.filter(d => d !== day)
            : [...currentDays, day].sort();

        setSettings({
            ...settings,
            schedule: { ...settings.schedule, days: newDays }
        });
    };

    const handleToggleGame = async () => {
        const newValue = !settings.enabled;

        if (newValue) {
            // Enabling: Require Push Subscription
            try {
                const vapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
                if (!vapidKey) {
                    alert("Error de configuració: Falta VAPID Key");
                    return;
                }

                setIsSaving(true);
                const sub = await pushService.subscribe(vapidKey);

                if (sub) {
                    await pushNotifications.saveSubscription(userId, sub);
                    setIsPushEnabled(true);

                    // Stratospheric Welcome
                    await pushService.showLocalNotification('👵 La IAIA ja està ací!', {
                        body: 'Notes això? És el batec del poble. Ja estem connectats!',
                        icon: '/images/demo/avatar_woman_old.png',
                        vibrate: [100, 50, 100, 400, 100, 50, 100], // Double heartbeat
                        data: { isIAIA: true, type: 'iaia' }
                    });
                } else {
                    // User denied or error
                    return;
                }
            } catch (error) {
                logger.error('[IAIA] Failed to subscribe:', error);
                alert("Necessitem permís de notificacions per a jugar amb la IAIA.");
                setIsSaving(false);
                return;
            }
        } else {
            // Disabling
            // Optional: Unsubscribe? Maybe keep it for other notifications?
            // For now, we keep subscription but disable game logic in backend
        }

        setSettings({ ...settings, enabled: newValue });
        setIsSaving(false);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const updated = await supabaseService.updateProfile(userId, {
                iaia_settings: settings
            });
            onUpdate(updated);
            logger.log('[IAIA] Settings saved:', settings);

            if (settings.enabled) {
                await pushService.showLocalNotification('Canvis Guardats', {
                    body: 'La IAIA ha pres nota dels nous horaris.',
                    vibrate: [50, 50]
                });
            }
        } catch (error) {
            logger.error('[IAIA] Error saving settings:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const dayLabels = ['dl', 'dt', 'dm', 'dj', 'dv', 'ds', 'dg'];

    return (
        <div className="iaia-tamagotchi-container">
            <div className="iaia-settings-header">
                <div className="header-info">
                    <h3><Sparkles size={20} className="glow-icon" /> Joc de Rol: La teua IAIA</h3>
                    <p>Cuida del teu personatge digital i viu el poble amb ell.</p>
                </div>
                <button
                    className={`btn-toggle-iaia ${settings.enabled ? 'enabled' : ''}`}
                    onClick={handleToggleGame}
                    disabled={isSaving}
                >
                    <Power size={18} />
                    {settings.enabled ? 'ACTIU' : 'INACTIU'}
                </button>
            </div>

            {settings.enabled && (
                <div className="iaia-settings-body">
                    <section className="settings-block">
                        <label><Smile size={18} /> Tria el teu Ambaixador</label>
                        <div className="persona-selector">
                            {personas.map(p => (
                                <div
                                    key={p.id}
                                    className={`persona-card-mini ${settings.avatar_id === p.id ? 'selected' : ''}`}
                                    onClick={() => setSettings({ ...settings, avatar_id: p.id })}
                                >
                                    <Avatar src={p.avatar_url} size={48} name={p.full_name} />
                                    <span>{p.full_name.split(' ')[0]}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="settings-block">
                        <label id="days-label"><Calendar size={18} /> Quins dies vols jugar?</label>
                        <div className="days-selector" role="group" aria-labelledby="days-label">
                            {dayLabels.map((label, idx) => (
                                <button
                                    key={idx}
                                    className={`day-btn ${settings.schedule.days.includes(idx + 1) ? 'active' : ''}`}
                                    onClick={() => toggleDay(idx + 1)}
                                    aria-pressed={settings.schedule.days.includes(idx + 1)}
                                    aria-label={`Jugar els ${label === 'dg' ? 'diumenges' : label === 'ds' ? 'dissabtes' : label + 's'}`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </section>

                    <section className="settings-block dual-row">
                        <div className="input-group">
                            <label htmlFor="morning-alert"><Clock size={18} /> Bon dia!</label>
                            <input
                                id="morning-alert"
                                type="time"
                                value={settings.schedule.morning_alert}
                                onChange={(e) => setSettings({
                                    ...settings,
                                    schedule: { ...settings.schedule, morning_alert: e.target.value }
                                })}
                                aria-label="Hora del missatge de bon dia"
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="night-alert"><BellRing size={18} /> Bona nit!</label>
                            <input
                                id="night-alert"
                                type="time"
                                value={settings.schedule.night_alert}
                                onChange={(e) => setSettings({
                                    ...settings,
                                    schedule: { ...settings.schedule, night_alert: e.target.value }
                                })}
                                aria-label="Hora del missatge de bona nit"
                            />
                        </div>
                    </section>

                    <button
                        className="btn-save-iaia full-width"
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        {isSaving ? <Loader2 className="spinner" size={20} /> : <Save size={20} />}
                        Guardar Preferències del Joc
                    </button>
                </div>
            )}
        </div>
    );
};

export default IAIATamagotchiSettings;

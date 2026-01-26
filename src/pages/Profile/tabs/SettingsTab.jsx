import React from 'react';
import { Moon, Sun, Bell, ChevronRight, ShieldCheck, LogOut, HelpCircle, User, Globe, Download, FileText } from 'lucide-react';
import IAIATamagotchiSettings from '../../../components/IAIATamagotchiSettings';
import { exportService } from '../../../services/exportService';
import { supabaseService } from '../../../services/supabaseService';
import { useAuth } from '../../../context/AuthContext';
import './PremiumSettings.css';

const SettingsTab = ({
    theme,
    toggleTheme,
    navigate,
    displayProfile,
    handleSocialPreferenceChange,
    user,
    profile,
    setProfile
}) => {
    const { logout } = useAuth();

    return (
        <div className="tab-pane-fade-in settings-pane">
            {/* APP PREFERENCES */}
            <section className="settings-section-premium">
                <h3 className="settings-group-title">
                    <Globe size={16} /> Preferències de l'App
                </h3>

                <div className="premium-setting-item" onClick={toggleTheme}>
                    <div className="setting-content-left">
                        <div className="setting-icon-wrapper">
                            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                        </div>
                        <div className="setting-text-bundle">
                            <span>Mode Visual</span>
                            <small>{theme === 'light' ? 'Mode Nit' : 'Mode Dia'}</small>
                        </div>
                    </div>
                    <div className={`premium-toggle-track ${theme === 'dark' ? 'active' : ''}`}>
                        <div className="premium-toggle-thumb" />
                    </div>
                </div>

                <div className="premium-setting-item" onClick={() => navigate('/notificacions')}>
                    <div className="setting-content-left">
                        <div className="setting-icon-wrapper">
                            <Bell size={20} />
                        </div>
                        <div className="setting-text-bundle">
                            <span>Notificacions</span>
                            <small>Gestiona les teues alertes</small>
                        </div>
                    </div>
                    <ChevronRight size={20} className="text-muted" />
                </div>
            </section>

            {/* PRIVACY & SECURITY */}
            <section className="settings-section-premium">
                <h3 className="settings-group-title">
                    <ShieldCheck size={16} /> Privadesa i Seguretat
                </h3>

                <div className="premium-setting-item no-hover" style={{ cursor: 'default', flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
                    <div className="setting-content-left">
                        <div className="setting-icon-wrapper">
                            <User size={20} />
                        </div>
                        <div className="setting-text-bundle">
                            <span>Identitat Social</span>
                            <small>Com et veuen els altres en compartir</small>
                        </div>
                    </div>

                    <div className="social-selector-premium w-full">
                        <button
                            className={displayProfile?.social_image_preference === 'avatar' ? 'active' : ''}
                            onClick={() => handleSocialPreferenceChange('avatar')}
                        >Avatar</button>
                        <button
                            className={displayProfile?.social_image_preference === 'cover' ? 'active' : ''}
                            onClick={() => handleSocialPreferenceChange('cover')}
                        >Portada</button>
                        <button
                            className={(!displayProfile?.social_image_preference || displayProfile?.social_image_preference === 'none') ? 'active' : ''}
                            onClick={() => handleSocialPreferenceChange('none')}
                        >Logo SP</button>
                    </div>
                </div>

                <div className="premium-setting-item" onClick={async () => {
                    const currentSettings = displayProfile?.privacy_settings || { show_read_receipts: true };
                    const startValue = currentSettings.show_read_receipts !== false;
                    const newSettings = { ...currentSettings, show_read_receipts: !startValue };

                    try {
                        const updated = await supabaseService.updateProfile(user.id, { privacy_settings: newSettings });
                        setProfile(updated);
                    } catch (err) {
                        console.error('Error updating privacy:', err);
                    }
                }}>
                    <div className="setting-content-left">
                        <div className="setting-icon-wrapper">
                            <ShieldCheck size={20} />
                        </div>
                        <div className="setting-text-bundle">
                            <span>Confirmació de Lectura</span>
                            <small>Privadesa en el xat</small>
                        </div>
                    </div>
                    <div className={`premium-toggle-track ${(displayProfile?.privacy_settings?.show_read_receipts !== false) ? 'active' : ''}`}>
                        <div className="premium-toggle-thumb" />
                    </div>
                </div>

                <div className="premium-setting-item no-hover" style={{ cursor: 'default', flexDirection: 'column', alignItems: 'flex-start', gap: '12px' }}>
                    <div className="setting-content-left">
                        <div className="setting-icon-wrapper">
                            <Download size={20} />
                        </div>
                        <div className="setting-text-bundle">
                            <span>Sobirania de Dades (GDPR)</span>
                            <small>Descarrega la teua vida al poble</small>
                        </div>
                    </div>
                    <div className="flex gap-2 w-full">
                        <button
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gray-100 dark:bg-gray-800 rounded-xl font-bold text-xs"
                            onClick={() => exportService.downloadAsTXT(user?.id, displayProfile?.full_name)}
                        >
                            <FileText size={14} /> TXT
                        </button>
                        <button
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gray-100 dark:bg-gray-800 rounded-xl font-bold text-xs"
                            onClick={() => exportService.downloadAsPDF(user?.id, displayProfile?.full_name)}
                        >
                            <FileText size={14} /> PDF
                        </button>
                    </div>
                </div>
            </section>

            {/* TAMAGOTCHI */}
            <section className="settings-section-premium">
                <IAIATamagotchiSettings
                    userId={user?.id}
                    profile={profile}
                    onUpdate={(updated) => setProfile(updated)}
                />
            </section>

            {/* LOGOUT */}
            <div className="logout-box">
                <button
                    className="btn-logout-premium"
                    onClick={async () => {
                        if (window.confirm('Segur que vols tancar la sessió?')) {
                            await logout();
                            window.location.href = '/login';
                        }
                    }}
                >
                    <LogOut size={22} />
                    TANCAR SESSIÓ
                </button>
            </div>

            <div className="premium-footer">
                <div className="premium-footer-line" />
                <span>v1.5.1-Genius • Sóc de Poble</span>
                <HelpCircle size={14} />
            </div>
        </div>
    );
};

export default SettingsTab;

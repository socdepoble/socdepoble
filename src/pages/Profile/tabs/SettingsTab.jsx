import { Moon, Sun, Bell, ChevronRight, ShieldCheck, LogOut, HelpCircle, User, Globe, Download, FileText, Info, Sparkles, Palette, Zap, Database, RefreshCw, Wind, BookOpen, Terminal } from 'lucide-react';
import { useUI } from '../../../context/UIContext';
import IAIATamagotchiSettings from '../../../components/IAIATamagotchiSettings';
import ThemeCustomizer from '../../../components/ThemeCustomizer';
import { exportService } from '../../../services/exportService';
import { supabaseService } from '../../../services/supabaseService';
import { raindropService } from '../../../services/raindropService';
import { logger } from '../../../utils/logger';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import './PremiumSettings.css';

const SettingsTab = ({
    theme: legacyTheme,
    toggleTheme,
    navigate,
    displayProfile,
    handleSocialPreferenceChange,
    user,
    profile,
    setProfile
}) => {
    const { logout } = useAuth();
    const { theme, setTheme, availableThemes } = useTheme();
    const { gloveMode, setGloveMode, toggleGloveMode, landingPage, setLandingPage, resetToNaturalOrder } = useUI();

    return (
        <div className="tab-pane-fade-in settings-pane">
            {/* THEME TOKENS ENGINE [NEXUS v6.0 DUAL MODE] */}
            <section className="settings-section-premium">
                <h3 className="settings-group-title">
                    <Palette size={16} /> Mode Visual (Dual Mode)
                </h3>
                <div className="dual-mode-selector">
                    <button
                        className={`mode-btn ${theme === 'light' ? 'active' : ''}`}
                        onClick={() => theme !== 'light' && toggleTheme()}
                    >
                        <Sun size={20} />
                        <span>Llum de Dia</span>
                    </button>
                    <button
                        className={`mode-btn ${theme === 'dark' ? 'active' : ''}`}
                        onClick={() => theme !== 'dark' && toggleTheme()}
                    >
                        <Moon size={20} />
                        <span>Nit Digital</span>
                    </button>
                </div>
            </section>

            {/* APP PREFERENCES */}
            <section className="settings-section-premium">
                <h3 className="settings-group-title">
                    <Globe size={16} /> Preferències de l'App
                </h3>

                <div className="premium-setting-item no-hover" style={{ cursor: 'default', display: 'block', padding: '0' }}>
                    <ThemeCustomizer />
                </div>

                <div className="premium-setting-item" onClick={toggleGloveMode}>
                    <div className="setting-content-left">
                        <div className="setting-icon-wrapper" style={{
                            background: gloveMode ? 'var(--color-primary)' : 'rgba(0,0,0,0.05)',
                            color: gloveMode ? 'white' : 'var(--text-muted)'
                        }}>
                            <Wind size={20} />
                        </div>
                        <div className="setting-text-bundle">
                            <span className="setting-title">Mode Guants (Hivern)</span>
                            <span className="setting-desc">Icones més grans i vibració forta per a ús amb guants.</span>
                        </div>
                    </div>
                    <div className={`sp-toggle ${gloveMode ? 'active' : ''}`}>
                        <div className="sp-toggle-inner"></div>
                    </div>
                </div>

                <div className="premium-setting-item no-hover" style={{ cursor: 'default', display: 'block' }}>
                    <div className="setting-content-left" style={{ marginBottom: '12px' }}>
                        <div className="setting-icon-wrapper" style={{ background: 'var(--color-terracotta, #E2725B)', color: 'white' }}>
                            <Wind size={20} />
                        </div>
                        <div className="setting-text-bundle">
                            <span className="setting-title">On vols despertar-te?</span>
                            <span className="setting-desc">Tria la teua porta oficial d'entrada.</span>
                        </div>
                    </div>
                    <select
                        id="landing-page-selector"
                        name="landing-page-selector"
                        className="premium-input-glass w-full"
                        value={landingPage}
                        onChange={(e) => setLandingPage(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '12px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '0px',
                            color: 'var(--text-main)',
                            fontSize: '14px',
                            outline: 'none'
                        }}
                    >
                        <option value="mur">📰 Mur (Notícies)</option>
                        <option value="chats">💬 Xat (La Plaça)</option>
                        <option value="mercat">🛒 Mercat (Producte)</option>
                        <option value="pobles">📍 Pobles (Territori)</option>
                    </select>
                </div>

                <div className="premium-setting-item" onClick={() => navigate('/solatge')}>
                    <div className="setting-content-left">
                        <div className="setting-icon-wrapper" style={{ background: 'var(--bg-deep, #050505)', color: 'var(--color-accent, #00F2FF)' }}>
                            <Terminal size={20} />
                        </div>
                        <div className="setting-text-bundle">
                            <span className="setting-title">Consola Solatge (v1.6)</span>
                            <span className="setting-desc">Panel de comandament Tier GOD by Nano Banana.</span>
                        </div>
                    </div>
                    <ChevronRight size={20} className="setting-chevron" />
                </div>

                <div className="premium-setting-item" onClick={() => navigate('/tutorial-didactica')}>
                    <div className="setting-content-left">
                        <div className="setting-icon-wrapper" style={{ background: 'var(--color-primary)', color: 'white' }}>
                            <BookOpen size={20} />
                        </div>
                        <div className="setting-text-bundle">
                            <span className="setting-title">Manual Didàctic</span>
                            <span className="setting-desc">Consulta l'estat de les funcionalitats i la guia tècnica.</span>
                        </div>
                    </div>
                    <ChevronRight size={20} className="setting-chevron" />
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
                        logger.error('Error updating privacy:', err);
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

                {/* GEMINI SOVEREIGNTY [FLASH PROTOCOL] */}
                <div className="premium-setting-item no-hover" style={{ cursor: 'default', flexDirection: 'column', alignItems: 'flex-start', gap: '12px', padding: '16px' }}>
                    <div className="setting-content-left">
                        <div className="setting-icon-wrapper" style={{ background: 'var(--color-accent)', color: 'black' }}>
                            <Sparkles size={20} className="llumeta" />
                        </div>
                        <div className="setting-text-bundle">
                            <span>Clau de l'Expert (Gemini API)</span>
                            <small>Sovereign AI: La teua clau, les teues dades.</small>
                        </div>
                    </div>
                    <div className="w-full flex flex-col gap-2">
                        <input
                            id="gemini-api-key"
                            name="gemini-api-key"
                            type="password"
                            placeholder="Introduïx la teua clau API..."
                            defaultValue={localStorage.getItem('sp_gemini_api_key') || ""}
                            onBlur={(e) => {
                                localStorage.setItem('sp_gemini_api_key', e.target.value);
                                window.dispatchEvent(new CustomEvent('gemini-key-updated'));
                            }}
                            className="premium-input-glass"
                            style={{
                                width: '100%',
                                padding: '12px',
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid var(--border-subtle)',
                                borderRadius: '0px',
                                color: 'var(--text-main)',
                                fontSize: '14px'
                            }}
                        />
                        <a
                            href="https://aistudio.google.com/app/apikey"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ fontSize: '10px', color: 'var(--color-accent)', textDecoration: 'underline' }}
                        >
                            Obtenir clau gratuïta a Google AI Studio
                        </a>
                    </div>
                </div>

                <div className="premium-setting-item" onClick={async () => {
                    if (window.confirm('Vols importar les teues col·leccions de Raindrop?')) {
                        const mockResources = raindropService.getMockData();
                        logger.log('[Raindrop] Integrant dades sobiranes:', mockResources);

                        // Simulem l'entrada al feed injectant un event de refresh o guardant en local
                        const existing = JSON.parse(localStorage.getItem('lc_posts_global_0_10') || '{"data":[]}');
                        const updated = { data: [...mockResources, ...existing.data] };
                        localStorage.setItem('lc_posts_global_0_10', JSON.stringify(updated));

                        window.dispatchEvent(new CustomEvent('data-refresh', { detail: { type: 'post' } }));
                        alert('Col·leccions SDP, SOS i PER importades amb èxit! Revisa el Mur.');
                    }
                }}>
                    <div className="setting-content-left">
                        <div className="setting-icon-wrapper" style={{ background: 'var(--color-primary-soft)', color: 'var(--color-primary)' }}>
                            <RefreshCw size={20} />
                        </div>
                        <div className="setting-text-bundle">
                            <span>Sincronitzar Raindrop</span>
                            <small>Importa col·leccions SDP, SOS, PER i GEO</small>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="premium-badge-vibrant">CONECTAR</span>
                        <ChevronRight size={20} className="text-muted" />
                    </div>
                </div>

                <div className="premium-setting-item" onClick={() => navigate('/arxiu')}>
                    <div className="setting-content-left">
                        <div className="setting-icon-wrapper" style={{ background: 'var(--color-primary-soft)', color: 'var(--color-primary)' }}>
                            <Database size={20} />
                        </div>
                        <div className="setting-text-bundle">
                            <span>El Rebost Digital</span>
                            <small>Arxiu sobirà estil Raindrop/NotebookLM</small>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="premium-badge-vibrant">NOU</span>
                        <ChevronRight size={20} className="text-muted" />
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

            {/* TRANSPARENCY & LEGAL */}
            <section className="settings-section-premium">
                <h3 className="settings-group-title">
                    <Info size={16} /> Transparència i Legalitat
                </h3>

                <div className="premium-setting-item" onClick={() => navigate('/iaia')}>
                    <div className="setting-content-left">
                        <div className="setting-icon-wrapper">
                            <Sparkles size={20} />
                        </div>
                        <div className="setting-text-bundle">
                            <span>Crèdits i Equip</span>
                            <small>Qui batea darrere de Sóc de Poble</small>
                        </div>
                    </div>
                    <ChevronRight size={20} className="text-muted" />
                </div>

                <div className="premium-setting-item" onClick={() => navigate('/legal')}>
                    <div className="setting-content-left">
                        <div className="setting-icon-wrapper">
                            <FileText size={20} />
                        </div>
                        <div className="setting-text-bundle">
                            <span>Avisos Legals</span>
                            <small>Protecció de dades i condicions</small>
                        </div>
                    </div>
                    <ChevronRight size={20} className="text-muted" />
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
            <div className="logout-box" style={{ gap: '16px' }}>
                <button
                    className="btn-restore-natural-order"
                    style={{
                        width: '100%',
                        padding: '14px',
                        background: 'transparent',
                        border: '2px dashed #D946EF',
                        color: '#D946EF',
                        fontFamily: 'var(--font-heading)',
                        fontWeight: '900',
                        borderRadius: '0px',
                        fontSize: '12px',
                        letterSpacing: '0.05em',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        marginBottom: '16px'
                    }}
                    onClick={() => {
                        if (window.confirm('Vols restaurar l\'Ordre Natural? Això netejarà totes les teues preferències locals.')) {
                            resetToNaturalOrder();
                        }
                    }}
                >
                    ↺ RESTAURAR L'ORDRE NATURAL
                </button>
                <button
                    className="btn-logout-premium"
                    onClick={async () => {
                        if (window.confirm('Segur que vols tancar la sessió?')) {
                            await logout();
                            navigate('/login');
                        }
                    }}
                >
                    <LogOut size={22} />
                    TANCAR SESSIÓ
                </button>
            </div>

            {/* ADMIN TRACKING (DUNS) */}
            <div className="duns-tracking-note" style={{
                margin: '20px 0',
                padding: '12px',
                background: 'rgba(0,0,0,0.05)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '0px',
                fontSize: '10px',
                opacity: 0.6,
                textAlign: 'center',
                fontFamily: 'monospace'
            }}>
                ID SOLVÈNCIA (DUNS): CA-00704568 <br />
                ESTAT: SOL·LICITUD REBUDA - PENDENT PROCESSAMENT
            </div>

            <div className="premium-footer">
                <div className="premium-footer-line" />
                <span>v1.5.6-BATEGA</span>
                <HelpCircle size={14} />
            </div>
        </div>
    );
};

export default SettingsTab;

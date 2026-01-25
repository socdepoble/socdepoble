import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download } from 'lucide-react';

const Header = () => {
    const { t } = useTranslation();
    const { user, profile } = useAuth();
    const { language, toggleLanguage } = useI18n();
    const { visionMode, setVisionMode } = useUI();
    const navigate = useNavigate();
    const location = useLocation();
    const { isInstallable, promptInstall } = usePWAInstall(); // Custom Hook

    const handleProfileClick = (e) => {
        if (location.pathname === '/perfil') {
            e.preventDefault();
            navigate(-1);
        }
    };

    const logoSrc = '/logo_dark.png';

    return (
        <header className="main-header">
            <div className="header-content">
                <Link to="/" className="logo-container">
                    <img src={logoSrc} alt="Sóc de Poble" className="header-logo" />
                </Link>

                <div className="header-actions">
                    {/* Botó d'Instal·lació PWA (Visible només si available) */}
                    {isInstallable && (
                        <button
                            className="header-install-btn"
                            onClick={promptInstall}
                            aria-label="Instal·lar Aplicació"
                            title="Instal·lar Sóc de Poble al dispositiu"
                            style={{
                                background: '#FF6B35',
                                border: 'none',
                                borderRadius: '50%',
                                width: '36px',
                                height: '36px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: '8px',
                                cursor: 'pointer',
                                boxShadow: '0 2px 8px rgba(255, 107, 53, 0.4)'
                            }}
                        >
                            <Download size={20} color="white" />
                        </button>
                    )}

                    <button
                        className="header-search-btn"
                        onClick={() => navigate('/cerca')}
                        aria-label={t('common.search') || 'Buscar'}
                    >
                        <Search size={22} color="white" />
                    </button>


                    <button
                        onClick={toggleLanguage}
                        className="header-lang-switcher"
                        aria-label={t('common.change_language') || 'Canviar idioma'}
                        title={t('common.change_language') || 'Canviar idioma'}
                    >
                        <span aria-hidden="true">{language.toUpperCase()}</span>
                    </button>

                    <button
                        className={`header-vision-toggle ${visionMode}`}
                        onClick={async () => {
                            const nextMode = visionMode === 'hibrida' ? 'humana' : 'hibrida';
                            setVisionMode(nextMode);

                            if (nextMode === 'humana' && user) {
                                try {
                                    const subscription = await pushService.getSubscription();
                                    if (subscription) {
                                        await pushNotifications.removeSubscription(user.id, subscription.endpoint);
                                        await pushService.unsubscribe();
                                        logger.info('[Header] Push subscription cleaned up after disabling IAIA');
                                    }
                                } catch (err) {
                                    logger.error('[Header] Error cleaning up push:', err);
                                }
                            }
                        }}
                        aria-label="Canviar mode de visió"
                        title={visionMode === 'hibrida' ? 'Mode Híbrid actiu' : 'Mode Humà actiu'}
                    >
                        {visionMode === 'hibrida' ? <Sparkles size={20} color="var(--color-primary)" /> : <UserCheck size={20} color="#888" />}
                    </button>

                    <Link
                        to={user ? "/notificacions" : "/login"}
                        className="header-notif-btn"
                        aria-label={t('nav.notifications') || 'Notificacions'}
                        title={t('nav.notifications') || 'Notificacions'}
                    >
                        <Bell size={22} color="white" aria-hidden="true" />
                        {user && <span className="notif-badge" aria-label="3 notificacions pendents">3</span>}
                    </Link>

                    {user && (
                        <Link
                            to="/perfil"
                            className="profile-link"
                            aria-label={t('nav.profile') || 'El meu perfil'}
                            title={t('nav.profile') || 'El meu perfil'}
                        >
                            <div className="user-avatar-small">
                                {profile?.avatar_url ? (
                                    <img src={profile.avatar_url} alt={profile.full_name || 'Usuari'} />
                                ) : (
                                    <User size={20} color="white" aria-hidden="true" />
                                )}
                            </div>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;

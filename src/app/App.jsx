import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { Navigate, NavLink, Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Accessibility, Eye, Globe, LogIn, MoonStar, Plus, Search, UserRound, Settings } from 'lucide-react';
import BrandMark from '../components/BrandMark';
import SectionChrome from '../components/SectionChrome';
import { useAppData } from './AppDataContext';
import { APP_DESCRIPTION, APP_NAME, APP_TAGLINE } from '../config/app';
import { DEFAULT_SECTION_PATH, SECTIONS, SECTION_ORDER } from '../config/sections';
import { getSectionLabels, SUPPORTED_LANGUAGES } from '../config/i18n';

const XatSection = lazy(() => import('../sections/xat/XatSection'));
const MurSection = lazy(() => import('../sections/mur/MurSection'));
const MercatSection = lazy(() => import('../sections/mercat/MercatSection'));
const PoblesSection = lazy(() => import('../sections/pobles/PoblesSection'));
const EventsSection = lazy(() => import('../sections/events/EventsSection'));
const MapaSection = lazy(() => import('../sections/mapa/MapaSection'));
const MultimediaSection = lazy(() => import('../sections/multimedia/MultimediaSection'));
const NotesSection = lazy(() => import('../sections/notes/NotesSection'));
const DevicesSection = lazy(() => import('../sections/dispositius/DevicesSection'));
const ConnectarSection = lazy(() => import('../sections/connectar/ConnectarSection'));
const ControlSection = lazy(() => import('../sections/control/ControlSection'));
const LoginSection = lazy(() => import('../sections/login/LoginSection'));
const IaSection = lazy(() => import('../sections/ia/IaSection'));
const DesignSection = lazy(() => import('../sections/disseny/DesignSection'));
const TranslationsSection = lazy(() => import('../sections/translations/TranslationsSection'));
const TextSection = lazy(() => import('../sections/text/TextSection'));
const SearchSection = lazy(() => import('../sections/search/SearchSection'));
const ProfileSection = lazy(() => import('../sections/profile/ProfileSection'));
const ItemDetailSection = lazy(() => import('../sections/detail/ItemDetailSection'));
const PageDetailSection = lazy(() => import('../sections/detail/PageDetailSection'));
const FinestretaSection = lazy(() => import('../sections/finestreta/FinestretaSection'));

const NAV_SECTIONS = SECTIONS.filter((section) => SECTION_ORDER.includes(section.id));
const MOBILE_NAV_LEADING = NAV_SECTIONS.slice(0, 2);
const MOBILE_NAV_TRAILING = NAV_SECTIONS.slice(2, 4);

function RouteFallback() {
  const { t } = useAppData();
  return (
    <div className="route-loading-screen" role="status" aria-live="polite" aria-label="Carregant secció">
      <div className="route-loading-screen__glow route-loading-screen__glow--left" />
      <div className="route-loading-screen__glow route-loading-screen__glow--right" />
      <div className="route-loading-screen__panel">
        <BrandMark variant="light" className="route-loading-screen__logo" />
        <strong className="route-loading-screen__title">{APP_NAME}</strong>
        <span className="route-loading-screen__subtitle">{t('loading.content', 'Carregant contingut del poble...')}</span>
        <div className="route-loading-screen__dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}

function AppShell({ children }) {
  const navigate = useNavigate();
  const { language, t } = useAppData();

  return (
    <div className="app-shell">
      <aside className="app-nav">
        <Link to="/chat" className="app-brand" aria-label="Sóc de Poble - Portal de pobles connectats">
          <BrandMark className="app-brand__mark" />
        </Link>

        <button
          type="button"
          className="nav-cta"
          onClick={() => navigate('/control')}
        >
          <Settings size={22} strokeWidth={2.8} />
          <span>CENTRE DE CONTROL</span>
        </button>

        <nav className="nav-stack" aria-label="Seccions">
          {NAV_SECTIONS.map((section) => {
            const Icon = section.icon;
            const labels = getSectionLabels(section.id, language);
            return (
              <NavLink key={section.id} to={section.path} className="nav-item">
                <Icon className="nav-item__icon" strokeWidth={2.1} />
                <span className="nav-item__text">
                  <strong>{labels.label}</strong>
                </span>
              </NavLink>
            );
          })}
        </nav>
      </aside>

      <main className="app-main">
        <div className="app-main__inner">
          {children}
        </div>
      </main>
    </div>
  );
}

function TopBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { language, setLanguage, t } = useAppData();
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem('socdepoble-theme-mode') === 'dark';
  });
  const [seniorMode, setSeniorMode] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const activeSection = useMemo(
    () =>
      ['/login', '/accedir', '/registre', '/crear-compte'].some((path) => location.pathname.startsWith(path))
        ? { label: t('nav.login', 'Login') }
        : location.pathname.startsWith('/traduccions')
        ? { label: t('nav.idioma', 'Idioma') }
        : (() => {
            const section = SECTIONS.find((entry) => location.pathname.startsWith(entry.path)) || SECTIONS[0];
            const labels = getSectionLabels(section.id, language);
            return { ...section, label: labels.label, shortLabel: labels.shortLabel };
          })(),
    [language, location.pathname, t]
  );

  useEffect(() => {
    document.body.dataset.themeMode = darkMode ? 'dark' : 'light';
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('socdepoble-theme-mode', darkMode ? 'dark' : 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    document.body.dataset.seniorMode = seniorMode ? '1' : '0';
  }, [seniorMode]);

  useEffect(() => {
    window.__NANO_DEBUG__ = debugMode;
  }, [debugMode]);

  return (
    <header className="topbar">
      <div className="topbar__title">
        <strong>{activeSection?.label || APP_NAME}</strong>
        <span>{t('app.description', APP_DESCRIPTION)}</span>
      </div>
      <div className="topbar__actions">
        <button type="button" className="pill pill--primary" onClick={() => navigate('/connectar')} aria-label={t('nav.connectar', 'Connectar')} title={t('nav.connectar', 'Connectar')}>
          <Plus size={16} /> {t('nav.connectar', 'Connectar')}
        </button>
        <button type="button" className="pill" onClick={() => navigate('/traduccions')} aria-label={t('nav.idioma', 'Idioma')} title={t('nav.idioma', 'Idioma')}>
          <Globe size={16} /> {SUPPORTED_LANGUAGES.find((item) => item.code === language)?.name || t('nav.idioma', 'Idioma')}
        </button>
        <button type="button" className="pill" onClick={() => setSeniorMode((value) => !value)} aria-label={t('nav.acces', 'Accés')} title={t('nav.acces', 'Accés')}>
          <Accessibility size={16} /> {t('nav.acces', 'Accés')}
        </button>
        <button type="button" className="pill" onClick={() => navigate('/cerca')} aria-label={t('nav.cerca', 'Cerca')} title={t('nav.cerca', 'Cerca')}>
          <Search size={16} /> {t('nav.cerca', 'Cerca')}
        </button>
        <button type="button" className="pill" onClick={() => setDarkMode((value) => !value)} aria-label={t('nav.tema', 'Tema')} title={t('nav.tema', 'Tema')}>
          <MoonStar size={16} /> {t('nav.tema', 'Tema')}
        </button>
        <button type="button" className="pill" onClick={() => navigate('/login')} aria-label={t('nav.login', 'Login')} title={t('nav.login', 'Login')}>
          <LogIn size={16} /> {t('nav.login', 'Login')}
        </button>
        <button type="button" className="pill" onClick={() => navigate('/perfil')} aria-label={t('nav.perfil', 'Perfil')} title={t('nav.perfil', 'Perfil')}>
          <UserRound size={16} /> {t('nav.perfil', 'Perfil')}
        </button>
        <button type="button" className="pill" onClick={() => setDebugMode((value) => !value)} aria-label={t('nav.visor', 'Visor')} title={t('nav.visor', 'Visor')}>
          <Eye size={16} /> {t('nav.visor', 'Visor')}
        </button>
      </div>
    </header>
  );
}

function TextRoute({ pageKey }) {
  const { pageCopy } = useAppData();
  const page = pageCopy?.[pageKey];
  if (!page) {
    return <Navigate to={DEFAULT_SECTION_PATH} replace />;
  }
  return (
    <Suspense fallback={<RouteFallback />}>
      <TextSection page={page} pageKey={pageKey} />
    </Suspense>
  );
}

function LegacyChatDetailRedirect() {
  const parts = window.location.pathname.split('/');
  const threadId = parts[parts.length - 1];
  return <Navigate to={`/chats/${threadId}`} replace />;
}

function LegacySectionDetailRedirect({ sectionId }) {
  const parts = window.location.pathname.split('/');
  const itemId = parts[parts.length - 1];
  return <Navigate to={`/${sectionId}/${itemId}`} replace />;
}

export default function App() {
  const { agents = [], status, error, hasSupabaseConfig, dataMode, t, language } = useAppData();
  const navigate = useNavigate();
  const location = useLocation();

  const isIsolatedRoute = location.pathname.startsWith('/finestreta');

  if (status === 'loading') {
    return <RouteFallback />;
  }

  if (status === 'error') {
      return (
        <SectionChrome
          kicker="Base de dades"
          title={t('error.loadPortal', "No s'ha pogut carregar el portal")}
          subtitle={error?.message || (hasSupabaseConfig ? 'Error desconegut.' : 'Falta configurar Supabase.')}
          meta={['Error', hasSupabaseConfig ? 'Supabase' : dataMode || 'seed']}
        />
      );
  }

  if (isIsolatedRoute) {
    return (
      <main className="app-main" style={{ marginLeft: 0, width: '100vw', paddingBottom: 0 }}>
        <div className="app-main__inner">
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/finestreta" element={<FinestretaSection />} />
            </Routes>
          </Suspense>
        </div>
      </main>
    );
  }

  return (
    <AppShell>
      <TopBar />

      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<Navigate to={DEFAULT_SECTION_PATH} replace />} />
          <Route path="/chat" element={<XatSection />} />
          <Route path="/chat/:threadId" element={<XatSection />} />
          <Route path="/xat" element={<Navigate to="/chat" replace />} />
          <Route path="/xat/:threadId" element={<LegacyChatDetailRedirect />} />
          <Route path="/chats" element={<Navigate to="/chat" replace />} />
          <Route path="/chats/:threadId" element={<LegacyChatDetailRedirect />} />
          <Route path="/mur" element={<MurSection />} />
          <Route path="/post/:itemId" element={<LegacySectionDetailRedirect sectionId="mur" />} />
          <Route path="/mercat" element={<MercatSection />} />
          <Route path="/multimedia" element={<MultimediaSection />} />
          <Route path="/pobles" element={<PoblesSection />} />
          <Route path="/events" element={<EventsSection />} />
          <Route path="/calendar" element={<Navigate to="/events" replace />} />
          <Route path="/calendari" element={<Navigate to="/events" replace />} />
          <Route path="/mapa" element={<MapaSection />} />
          <Route path="/notes" element={<NotesSection />} />
          <Route path="/dispositius" element={<DevicesSection />} />
          <Route path="/connectivitat" element={<Navigate to="/dispositius" replace />} />
          <Route path="/cerca" element={<SearchSection />} />
          <Route path="/login" element={<LoginSection />} />
          <Route path="/accedir" element={<LoginSection />} />
          <Route path="/registre" element={<LoginSection />} />
          <Route path="/crear-compte" element={<LoginSection />} />
          <Route path="/perfil" element={<ProfileSection agents={agents} />} />
          <Route path="/perfil/:agentId" element={<ProfileSection agents={agents} />} />
          <Route path="/gent/:agentId" element={<ProfileSection agents={agents} />} />
          <Route path="/empresa/:agentId" element={<ProfileSection agents={agents} />} />
          <Route path="/ajuntament/:agentId" element={<ProfileSection agents={agents} />} />
          <Route path="/grup/:agentId" element={<ProfileSection agents={agents} />} />
          <Route path="/control" element={<ControlSection />} />
          <Route path="/connectar" element={<ConnectarSection agents={agents} />} />
          <Route path="/projecte" element={<TextRoute pageKey="projecte" />} />
          <Route path="/page/:slug" element={<PageDetailSection />} />
          <Route path="/el-projecte" element={<Navigate to="/projecte" replace />} />
          <Route path="/skills" element={<TextRoute pageKey="skills" />} />
          <Route path="/constitucio" element={<TextRoute pageKey="constitucio" />} />
          <Route path="/disseny" element={<DesignSection />} />
          <Route path="/legal" element={<TextRoute pageKey="legal" />} />
          <Route path="/roadmap" element={<TextRoute pageKey="roadmap" />} />
          <Route path="/ruta" element={<Navigate to="/roadmap" replace />} />
          <Route path="/traduccions" element={<TranslationsSection />} />
          <Route path="/ia" element={<IaSection agents={agents} />} />
          <Route path="/anima" element={<Navigate to="/ia" replace />} />
          <Route path="/iaia" element={<Navigate to="/chats/iaia-maria" replace />} />
          <Route path="/:sectionId/:itemId" element={<ItemDetailSection />} />
          <Route path="*" element={<Navigate to={DEFAULT_SECTION_PATH} replace />} />
        </Routes>
      </Suspense>

      <nav className="mobile-nav" aria-label="Navegació mòbil">
        {MOBILE_NAV_LEADING.map((section) => {
          const Icon = section.icon;
          const labels = getSectionLabels(section.id, language);
          return (
            <NavLink key={section.id} to={section.path} className="nav-item">
              <Icon className="nav-item__icon" strokeWidth={2.1} />
              <span className="nav-item__text">
                <strong>{labels.shortLabel}</strong>
              </span>
            </NavLink>
          );
        })}
        <button type="button" className="mobile-nav__cta" onClick={() => navigate('/connectar')} aria-label={t('nav.connectar', 'Connectar')}>
          <Plus size={20} strokeWidth={2.8} />
        </button>
        {MOBILE_NAV_TRAILING.map((section) => {
          const Icon = section.icon;
          const labels = getSectionLabels(section.id, language);
          return (
            <NavLink key={section.id} to={section.path} className="nav-item">
              <Icon className="nav-item__icon" strokeWidth={2.1} />
              <span className="nav-item__text">
                <strong>{labels.shortLabel}</strong>
              </span>
            </NavLink>
          );
        })}
      </nav>
    </AppShell>
  );
}

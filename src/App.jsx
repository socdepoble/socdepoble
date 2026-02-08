import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
// VERSION: v1.15.1-GEM-MODERN (Llum i Vida | Gem Design)
import Header from './components/Header';
import Layout from './components/Layout';
import './styles/Consola.css';

// Lazy loaded components
const ChatList = lazy(() => import('./components/ChatList'));
const ChatDetail = lazy(() => import('./components/ChatDetail'));
const Feed = lazy(() => import('./components/Feed'));
const Market = lazy(() => import('./components/Marketplace'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Profile = lazy(() => import('./pages/Profile'));
const Towns = lazy(() => import('./pages/Towns'));
const Map = lazy(() => import('./pages/Map'));
const Notifications = lazy(() => import('./pages/Notifications'));
const TownDetail = lazy(() => import('./pages/TownDetail'));
const PublicProfile = lazy(() => import('./pages/PublicProfile'));
const PublicEntity = lazy(() => import('./pages/PublicEntity'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));
const PlaygroundPortal = lazy(() => import('./pages/PlaygroundPortal'));
const MediaAlbum = lazy(() => import('./pages/MediaAlbum'));
const EntityManagement = lazy(() => import('./pages/EntityManagement'));
const SearchDiscover = lazy(() => import('./pages/SearchDiscover'));
const CommunityDirectory = lazy(() => import('./pages/CommunityDirectory'));
const IAIAPage = lazy(() => import('./pages/IAIAPage'));
const AlbumMemoria = lazy(() => import('./pages/AlbumMemoria'));
const ProjectPresentation = lazy(() => import('./pages/ProjectPresentation'));
const DesignCanon = lazy(() => import('./pages/DesignCanon'));
const GenesisViewer = lazy(() => import('./pages/GenesisViewer'));
const MakingOf = lazy(() => import('./pages/MakingOf'));
const LegalNotice = lazy(() => import('./pages/LegalNotice'));
const ResetPage = lazy(() => import('./pages/ResetPage'));
const ManualPage = lazy(() => import('./pages/ManualPage'));
const SessionChronicle = lazy(() => import('./pages/SessionChronicle'));
const PostDetail = lazy(() => import('./pages/PostDetail'));
const MasterCalendar = lazy(() => import('./pages/MasterCalendar'));
const DAFOPage = lazy(() => import('./pages/DAFOPage'));
const DidacticPage = lazy(() => import('./pages/DidacticPage'));
const Archive = lazy(() => import('./pages/Archive'));
const SellSurplus = lazy(() => import('./pages/SellSurplus'));
const AulaRural = lazy(() => import('./pages/AulaRural'));
const RuralIntelligence = lazy(() => import('./components/RuralIntelligence'));
const DidacticManual = lazy(() => import('./pages/DidacticManual'));
const SolatgeConsole = lazy(() => import('./pages/SolatgeConsole'));
const HabitantsDelMas = lazy(() => import('./components/HabitantsDelMas'));
const AyuntamientoPage = lazy(() => import('./pages/AyuntamientoPage'));
const TiaMariaChat = lazy(() => import('./components/TiaMariaChat'));
const NexusFlash = lazy(() => import('./pages/NexusFlash'));
const GlobalAssetAlbum = lazy(() => import('./pages/GlobalAssetAlbum'));
import { RescueTool } from './components/RescueTool';
import AmphoraFAB from './components/AmphoraFAB';

import { supabase } from './supabaseClient';
import { MOCK_CHATS, MOCK_FEED, MOCK_MARKET_ITEMS } from './data';
import { useAuth } from './context/AuthContext';
import { useUI } from './context/UIContext';
import { supabaseService } from './services/supabaseService';
import { APP_VERSION } from './constants';
import ErrorBoundary from './components/ErrorBoundary';
import { usePushNotifications } from './hooks/usePushNotifications'; // Import hook
import DiagnosticConsole from './components/DiagnosticConsole';
import NanoLoader from './components/NanoLoader';
import { cloudErrorReporting } from './services/cloudErrorReporting';

const NavigateWithParams = ({ to, replace }) => {
  const searchParams = new URLSearchParams(window.location.search);
  const target = `${to}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
  return <Navigate to={target} replace={replace} />;
};

// Exponer para depuración en consola solo en desarrollo
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  window.supabase = supabase;
  window.supabaseService = supabaseService;
}

// Componente para proteger rutas
const ProtectedRoute = ({ children }) => {
  const { user, loading, logout } = useAuth();
  const [showRescue, setShowRescue] = React.useState(false);

  React.useEffect(() => {
    let timer;
    if (loading) {
      timer = setTimeout(() => setShowRescue(true), 5000);
    }
    return () => clearTimeout(timer);
  }, [loading]);

  if (loading) {
    return (
      <div style={{ position: 'relative', height: '100vh' }}>
        <NanoLoader message={showRescue ? "Està costant més del previst..." : "Carregant sessió..."} />
        {showRescue && (
          <div className="emergency-rescue-overlay animate-in">
            <div className="rescue-card">
              <h3>🚨 Protocol de Rescat</h3>
              <p>Està costant més del previst. Vols forçar el reinici?</p>
              <div className="rescue-actions">
                <button
                  onClick={() => {
                    logout();
                    window.location.href = '/login?rescue=true';
                  }}
                  className="btn-rescue-nuclear"
                >
                  Reiniciar Sessió (Neteja Total)
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="btn-rescue-soft"
                >
                  Recarregar Pàgina
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // [CRYPTO GENESIS] Els usuaris sobirans (Forasters) entren si l'AuthContext els ha validat
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  const { asoMode } = useUI();
  usePushNotifications(); // Activate Push System

  useEffect(() => {
    // [VERSION SYNC: REASSURANCE]
    localStorage.setItem('sp_app_version', APP_VERSION);

    // [CLOUD SYNC] Notificar el bategat al núvol si està configurat
    cloudErrorReporting.report(`App Boot v${APP_VERSION}`, { type: 'BOOT_SEQUENCE' });

    // [PILLAR 1] Rhizome Pruning (Eg-walker)
    import('./services/rhizomeManager').then(({ rhizomeManager }) => {
      rhizomeManager.pruneHistory();
    });

    // [CAPACITOR NATIVE] Inicialització de la Barra d'Estat i Splash Screen
    const initNative = async () => {
      try {
        const { StatusBar, Style } = await import('@capacitor/status-bar');
        const { SplashScreen } = await import('@capacitor/splash-screen');

        await StatusBar.setStyle({ style: Style.Light });
        await StatusBar.setBackgroundColor({ color: '#FDF5E6' });

        await SplashScreen.hide();
      } catch (e) {
        // Silent failure for non-native environments
      }
    };
    initNative();
  }, []);

  return (
    <BrowserRouter>
      <DiagnosticConsole />
      <Suspense fallback={<NanoLoader message="Preparant Sóc de Poble..." />}>
        <ErrorBoundary fallbackMessage="Error crític de l'aplicació">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/playground" element={<PlaygroundPortal />} />

            {/* SEARCH COMPATIBILITY REDIRECTS */}
            <Route path="/Admin/Broadcast" element={<Navigate to="/admin?tab=broadcast" replace />} />
            <Route path="/admin/broadcast" element={<Navigate to="/admin?tab=broadcast" replace />} />

            <Route
              path="/"
              element={
                <ErrorBoundary>
                  <Layout />
                </ErrorBoundary>
              }
            >
              <Route index element={<NavigateWithParams to="/chats" replace />} />
              <Route
                path="chats"
                element={
                  <ProtectedRoute>
                    <ChatList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="chats/:id"
                element={
                  <ProtectedRoute>
                    <ChatDetail />
                  </ProtectedRoute>
                }
              />
              <Route path="mur" element={<Feed />} />
              <Route path="mercat" element={<Market />} />
              <Route
                path="perfil"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route path="/@:username" element={<PublicProfile />} />
              <Route path="perfil/:id" element={<PublicProfile />} />
              <Route path="entitat/:id" element={<PublicEntity />} />
              <Route path="vendre-excedent" element={<SellSurplus />} />
              <Route path="post/:id" element={<PostDetail />} />
              <Route
                path="notificacions"
                element={
                  <ProtectedRoute>
                    <Notifications />
                  </ProtectedRoute>
                }
              />
              <Route
                path="fotos"
                element={
                  <ProtectedRoute>
                    <MediaAlbum />
                  </ProtectedRoute>
                }
              />
              <Route
                path="fotos/global"
                element={
                  <ProtectedRoute>
                    <GlobalAssetAlbum />
                  </ProtectedRoute>
                }
              />
              <Route
                path="gestio-entitats"
                element={
                  <ProtectedRoute>
                    <EntityManagement />
                  </ProtectedRoute>
                }
              />
              <Route path="cerca" element={<SearchDiscover />} />
              <Route path="arxiu" element={<Archive />} />
              <Route path="comunitat" element={<CommunityDirectory />} />
              <Route path="aula-rural" element={<AulaRural />} />
              <Route path="pobles" element={<Towns />} />
              <Route path="pobles/:id" element={<TownDetail />} />
              <Route path="ajuntament/:id" element={<AyuntamientoPage />} />
              <Route
                path="mapa"
                element={
                  <ProtectedRoute>
                    <Map />
                  </ProtectedRoute>
                }
              />
              <Route
                path="admin"
                element={
                  <ProtectedRoute>
                    <AdminPanel />
                  </ProtectedRoute>
                }
              />
              <Route path="iaia" element={<IAIAPage />} />
              <Route path="album" element={<AlbumMemoria />} />
              <Route path="projecte" element={<ProjectPresentation />} />
              <Route path="disseny" element={<DesignCanon />} />
              <Route path="visor" element={<GenesisViewer />} />
              <Route path="elemental" element={<MakingOf />} />
              <Route path="legal" element={<LegalNotice />} />
              <Route path="reset" element={<ResetPage />} />
              <Route path="manual" element={<ManualPage />} />
              <Route path="sessio/:id" element={<SessionChronicle />} />
              <Route path="calendari" element={<MasterCalendar />} />
              <Route path="dafo/:id" element={<DAFOPage />} />
              <Route path="didactica/:id" element={<DidacticPage />} />
              <Route path="/ia" element={<RuralIntelligence />} />
              <Route path="/ia/habitants" element={<HabitantsDelMas />} />
              <Route path="tutorial-didactica" element={<DidacticManual />} />
              <Route path="solatge" element={<SolatgeConsole />} />
              <Route path="nexus" element={<NexusFlash />} />

              {/* EMERGENCY RESCUE ROUTES (Escaped from SW) */}
              <Route path="rescat.html" element={<RescueTool />} />
              <Route path="rescue.html" element={<RescueTool />} />
              <Route path="_nuke.html" element={<RescueTool />} />
            </Route>

            {/* Direct access for no-layout rescue */}
            <Route path="/rescat" element={<RescueTool />} />
            <Route path="/nuke" element={<RescueTool />} />

            {/* [MASTER] AUTO-HEALING: Captura de rutes de documentació mal formades */}
            <Route path="/docs/*" element={<Navigate to="/projecte" replace />} />
            <Route path="/artifacts/*" element={<Navigate to="/admin" replace />} />

            {/* Fallback 404 compatible amb l'estètica Master */}
            {/* PEDAGOGICAL FALLBACK: Orphan links lead to Aula Rural */}
            <Route path="*" element={<Navigate to="/aula-rural" replace />} />
          </Routes>
        </ErrorBoundary>
      </Suspense>
      {asoMode && (
        <div className="aso-study-overlay">
          <div className="aso-frame">
            <div className="aso-narrative">
              <h2>BATEGA SENSE WIFI</h2>
              <p>El teu poble, la teua veu.</p>
            </div>
          </div>
          <div className="aso-badge">MODO ESTUDI ASO</div>
        </div>
      )}
    </BrowserRouter>
  );
}

export default App;


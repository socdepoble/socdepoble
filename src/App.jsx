import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// VERSION: v1.5.8-GENESIS-MASTER-NUKE (Batec Territorial & Sobirania Visual)
import Header from './components/Header';
import Layout from './components/Layout';

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
const ProjectPresentation = lazy(() => import('./pages/ProjectPresentation'));
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
const RuralIntelligence = lazy(() => import('./components/RuralIntelligence'));
const DidacticManual = lazy(() => import('./pages/DidacticManual'));
const SolatgeConsole = lazy(() => import('./pages/SolatgeConsole'));
const HabitantsDelMas = lazy(() => import('./components/HabitantsDelMas'));
const AyuntamientoPage = lazy(() => import('./pages/AyuntamientoPage'));
import { RescueTool } from './components/RescueTool';

import { supabase } from './supabaseClient';
import { MOCK_CHATS, MOCK_FEED, MOCK_MARKET_ITEMS } from './data';
import { useAuth } from './context/AuthContext';
import { useUI } from './context/UIContext';
import { supabaseService } from './services/supabaseService';

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

  // [CRYPTO GENESIS] Els usuaris sobirans (Forasters) entren directament
  if (!user && !localStorage.getItem('sp_sovereign_identity')) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

import ErrorBoundary from './components/ErrorBoundary';
import { usePushNotifications } from './hooks/usePushNotifications'; // Import hook
import DiagnosticConsole from './components/DiagnosticConsole';
import NanoLoader from './components/NanoLoader';

function App() {
  usePushNotifications(); // Activate Push System

  useEffect(() => {
    // [VERSION CHECK: PROTOCOLO FLASH]
    const APP_VERSION = "v1.5.6-BATEGA";
    const lastVersion = localStorage.getItem('sp_app_version');

    if (lastVersion && lastVersion !== APP_VERSION) {
      console.log('[FLASH] Nova versió detectada. Executant Hard Reload...');
      localStorage.setItem('sp_app_version', APP_VERSION);
      window.location.reload(true);
    } else {
      localStorage.setItem('sp_app_version', APP_VERSION);
    }

    // [PILLAR 1] Rhizome Pruning (Eg-walker)
    // Activat per a resiliència de memòria i velocitat extrema [MASTER]
    import('./services/rhizomeManager').then(({ rhizomeManager }) => {
      rhizomeManager.pruneHistory();
    });

    // [CAPACITOR NATIVE] Inicialització de la Barra d'Estat i Splash Screen
    const initNative = async () => {
      try {
        const { StatusBar, Style } = await import('@capacitor/status-bar');
        const { SplashScreen } = await import('@capacitor/splash-screen');

        // Adaptem la barra d'estat a l'estètica MD3 (Surface color)
        await StatusBar.setStyle({ style: Style.Light });
        await StatusBar.setBackgroundColor({ color: '#fdfbff' }); // md-sys-color-surface aprox

        // Amaguem la splash screen quan el bategat web estiga llest
        await SplashScreen.hide();
      } catch (e) {
        console.log('[Capacitor] No native environment detected or plugins missing.');
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
              <Route index element={<Navigate to="/chats" replace />} />
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
              <Route path="projecte" element={<ProjectPresentation />} />
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
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ErrorBoundary>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;


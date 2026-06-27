import { memo } from "react";
import { useAuth } from "../app/context/AuthContext";
// import NanoLoader from "./NanoLoader";
// import ErrorBoundary from "./ErrorBoundary";

/**
 * STRATEGY: StableRoutes (Píndola d'Or de Qwen)
 * 
 * Aquest component aïlla totalment la capa de Rutes del AppLayout.
 * Evita que els canvis d'alçada del teclat on-screen al mòbil provoquin 
 * on resize event als Contexts que acaben desmuntant i re-muntant les rutes
 * (el que causa "phantom refetches" de TanStack Query).
 */

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Connectant...</div>; // Substituir per NanoLoader
  if (!user || user.isAnonymous) return <Navigate to="/registre" replace />;
  return children;
};

// Lazy Imports Exemple:
// const ChatLayout = lazy(() => import("../components/ChatLayout"));
// const Mur = lazy(() => import("../pages/Mur"));

const StableRoutes = memo(() => {
  return (
    // <ErrorBoundary>
    //   <Suspense fallback={<NanoLoader message="Carregant vista..." />}>
        <Routes>
          <Route path="/" element={<Navigate to="/chats" replace />} />
          
          {/* Exemple provisional, ací van totes les rutes de Sóc de Poble: */}
          {/* <Route path="/chats/*" element={<ChatLayout />} /> */}
          {/* <Route path="/mur" element={<Mur />} /> */}
          
          <Route path="*" element={<Navigate to="/mur" replace />} />
        </Routes>
    //   </Suspense>
    // </ErrorBoundary>
  );
});

export default StableRoutes;

import { lazy } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../app/context/AuthContext';

const AdminPanel = lazy(() => import('../../pages/admin/AdminPanel'));
const SolatgeConsole = lazy(() => import('../../pages/admin/SolatgeConsole'));

const MenuManagementView = lazy(() => import('../../pages/admin/MenuManagementView'));
const CategoryManager = lazy(() => import('../features/CategoryManager'));
const ChatManager = lazy(() => import('../../pages/admin/ChatManager'));
const Utilitats = lazy(() => import('../../pages/admin/Utilitats'));
const IAIASandbox = lazy(() => import('../../pages/admin/IAIASandbox'));
const ProtectedSystemRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <NanoLoader />;
  if (!user || user.isAnonymous) return <Navigate to="/registre" state={{ from: location }} replace />;
  return children;
};

const SystemRoutes = () => {
    return (
        <SystemLayout>
            <Suspense fallback={<NanoLoader />}>
                <Routes>
                    <Route path="/admin" element={<ProtectedSystemRoute><AdminPanel /></ProtectedSystemRoute>} />
                    <Route path="/solatge" element={<ProtectedSystemRoute><SolatgeConsole /></ProtectedSystemRoute>} />

                    <Route path="/ofici/menu" element={<ProtectedSystemRoute><MenuManagementView /></ProtectedSystemRoute>} />
                    <Route path="/ofici/categories" element={<ProtectedSystemRoute><CategoryManager /></ProtectedSystemRoute>} />
                    <Route path="/ofici/xats/*" element={<ChatManager />} />
                    <Route path="/utilitats" element={<ProtectedSystemRoute><Utilitats /></ProtectedSystemRoute>} />
                    <Route path="/iaia-sandbox" element={<ProtectedSystemRoute><IAIASandbox /></ProtectedSystemRoute>} />
                </Routes>
            </Suspense>
        </SystemLayout>
    );
};

export default SystemRoutes;

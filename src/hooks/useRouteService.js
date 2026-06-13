import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useWebNavigationAdapter } from '../adapters/NavigationAdapter';
import { getActionConfig } from '../services/routeService';

export const useRouteService = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const adapter = useWebNavigationAdapter();

  // Es pot ampliar per a interceptar canvis de ruta
  useEffect(() => {
    // Inicialitzacions si calen
  }, [navigate]);

  return {
    navigate: adapter,
    currentPath: location.pathname,
    // Podeu afegir el getPageContext ací si voleu
  };
};

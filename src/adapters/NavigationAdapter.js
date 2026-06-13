import { useNavigate } from 'react-router-dom';
import { ROUTE_INTENTS } from '../services/routeService';

export const useWebNavigationAdapter = () => {
  const navigate = useNavigate();

  return (intent, payload = {}) => {
    switch (intent) {
      case ROUTE_INTENTS.CONNECT:
        // Ex: Obre el drawer o navega
        break;
      case ROUTE_INTENTS.VIEW_PROFILE:
        navigate(payload.userId ? `/perfil/${payload.userId}` : '/perfil');
        break;
      case ROUTE_INTENTS.SEARCH:
        navigate('/cerca');
        break;
      case ROUTE_INTENTS.OPEN_VISION:
        navigate('/visio');
        break;
      case ROUTE_INTENTS.GO_BACK:
        navigate(-1);
        break;
      case ROUTE_INTENTS.TOGGLE_THEME:
        window.dispatchEvent(new CustomEvent('sosp:toggle-theme'));
        break;
      default:
        console.warn(`[NavigationAdapter] Intenció no reconeguda: ${intent}`);
    }
  };
};

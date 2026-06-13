export const routeService = {
  // Funció principal que injectarem des de l'App o Context
  navigate: (to, options = {}) => {
    console.info(`[RouteService] Navegant → ${to}`, options);
    
    if (typeof window === 'undefined') return;

    if (options.replace) {
      window.history.replaceState(options.state || {}, '', to);
    } else {
      window.history.pushState(options.state || {}, '', to);
    }
    
    window.dispatchEvent(new PopStateEvent('popstate'));
  },

  goBack: () => {
    if (typeof window !== 'undefined') window.history.back();
  },

  goToHome: () => routeService.navigate('/'),

  isActive: (path, exact = true) => {
    if (typeof window === 'undefined') return false;
    if (exact) return window.location.pathname === path;
    return window.location.pathname.startsWith(path);
  },

  // Adaptador per React Router (o qualsevol altre)
  createRouterAdapter: (routerNavigate) => ({
    navigate: (to, options = {}) => {
      routerNavigate(to, { replace: options.replace, state: options.state });
    },
    goBack: () => {
      if (typeof window !== 'undefined') window.history.back();
    },
  }),
};

// Hook per utilitzar-lo còmodament dins de React
export const useRouteService = () => {
  return routeService;
};

export const getAuthorRoute = (item) => {
  if (!item) return '/';
  const targetId = item.author_id || item.user_id || item.id;
  return targetId ? `/perfil/${targetId}` : '/perfil';
};

export const getCardRoute = (item, variant) => {
  if (!item) return '/';

  // Si és una pàgina, tractar-ho igual que a UniversalCardInner
  if (item?.type === 'page' && item?.slug) {
    if (['el-projecte', 'manual', 'arxiu', 'projecte', 'manifest', 'skills', 'anima', 'disseny', 'ruta', 'constitucio'].includes(item.slug)) {
      return `/${item.slug}`;
    } else {
      return `/page/${item.slug}`;
    }
  }

  if (variant === 'pobles') return `/pobles/${item.id || item.uuid}`;
  if (variant === 'event' || item?.type === 'agenda') return `/agenda/${item.id || item.uuid}`;
  if (variant === 'mercat' || variant === 'market') return `/mercat/${item.id || item.uuid}`;
  
  return `/post/${item.id || item.uuid}`;
};

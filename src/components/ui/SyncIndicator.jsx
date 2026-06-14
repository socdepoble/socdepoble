import { useWorkerOrchestrator } from '../../hooks/useWorkerOrchestrator';

// Estats possibles: 'online' (invisible/verd), 'offline' (invisible, gestionat pel DegradedBanner), 'syncing' (blau animat), 'error' (vermell)
export const SyncIndicator = () => {
  const {
    syncState: status,
    pendingCount = 0
  } = useWorkerOrchestrator();

  // Ocultar si tot bé, o si estem offline (DegradedBanner té la responsabilitat)
  if (status === 'online' && pendingCount === 0 || status === 'offline' || status === 'connecting') return null;
  const config = {
    syncing: {
      color: 'bg-blue-500',
      text: `Sincronitzant ${pendingCount} canvis...`,
      ping: true
    },
    error: {
      color: 'bg-red-500',
      text: 'Error de connexió',
      ping: false
    }
  };
  const current = config[status];
  if (!current) return null;
  return <div className="fixed bottom-[85px] right-4 flex items-center gap-2 bg-gray-900 border border-gray-700/50 text-white px-3 py-2 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.4)] text-xs font-bold z-[100] transition-all duration-300 pointer-events-none">
      <div className="relative flex h-2.5 w-2.5">
        {current.ping && <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${current.color}`}></span>}
        <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${current.color}`}></span>
      </div>
      {current.text}
    </div>;
};
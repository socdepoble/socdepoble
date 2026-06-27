import { useRealm } from '../../app/context/RealmContext';
import { useTranslation } from 'react-i18next';

export default function RealmSwitcher() {
  const { myRealms, activeRealm, switchRealm } = useRealm();
  const { t } = useTranslation();

  const getIconForType = (type, isActive) => {
    const size = isActive ? 22 : 20;
    const props = { size, strokeWidth: isActive ? 3 : 2 };
    switch (type) {
      case 'poble': return <Building {...props} />;
      case 'universitat': return <GraduationCap {...props} />;
      case 'empresa': return <Briefcase {...props} />;
      case 'associacio': return <Users {...props} />;
      case 'global': return <Globe {...props} />;
      default: return <span className="font-bold text-lg">{type[0]?.toUpperCase()}</span>;
    }
  };

  return (
    <div className="w-full bg-[#111111] overflow-x-auto custom-scrollbar flex items-center pr-4 py-2 space-x-2 border-b border-white/10 shrink-0">
      
      {/* GLOBAL VIEW HUB */}
      <button
        onClick={() => switchRealm('GLOBAL')}
        className={`shrink-0 flex items-center justify-center w-12 h-12 ml-4 rounded-[16px] transition-all relative group
          ${activeRealm === 'GLOBAL' 
            ? 'bg-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.4)] scale-105' 
            : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}`}
        title={t('admin.global_view', 'El Aleph (Vista Global)')}
      >
        {activeRealm === 'GLOBAL' && (
          <div className="absolute -left-1 w-1.5 h-6 bg-white rounded-r-full shadow-[0_0_10px_white]" />
        )}
        {getIconForType('global', activeRealm === 'GLOBAL')}
      </button>

      {/* SEPARATOR */}
      <div className="w-[2px] h-8 bg-white/10 shrink-0 mx-1 rounded-full" />

      {/* INDIVIDUAL REALMS */}
      {myRealms.map((realm) => {
        const isActive = activeRealm === realm.id;
        return (
          <button
            key={realm.id}
            onClick={() => switchRealm(realm.id)}
            className={`shrink-0 flex items-center justify-center w-12 h-12 rounded-[16px] transition-all relative bg-cover bg-center group
              ${isActive 
                ? 'shadow-[0_0_15px_rgba(255,255,255,0.2)] scale-105 ring-2 ring-white ring-offset-2 ring-offset-[#111]' 
                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white hover:rounded-[12px]'}`}
            style={realm.image_url ? { backgroundImage: `url(${realm.image_url})` } : {}}
            title={realm.name}
          >
            {isActive && (
              <div className="absolute -left-1 w-1 h-8 bg-white rounded-r-full shadow-[0_0_5px_white]" />
            )}
            
            {!realm.image_url && (
              <div className="absolute inset-0 flex items-center justify-center">
                {getIconForType(realm.type, isActive)}
              </div>
            )}

            {/* TOOLTIP ON HOVER (Tailwind peer/group) */}
            <div className="absolute left-1/2 -bottom-8 -translate-x-1/2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
              {realm.name}
            </div>
          </button>
        );
      })}
    </div>
  );
}

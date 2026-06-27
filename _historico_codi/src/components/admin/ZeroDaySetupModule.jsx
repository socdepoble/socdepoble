import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Building, GraduationCap, Briefcase, Users } from 'lucide-react';
// Import de supabase oprimit (guardat per al futur RPC)
// import { supabase } from '../../core/services/supabaseService';

const ZeroDaySetupModule = () => {
  const { t } = useTranslation();
  const [selectedType, setSelectedType] = useState('poble');
  const [isInjecting, setIsInjecting] = useState(false);
  const [injectionStatus, setInjectionStatus] = useState(null);

  const instanceTypes = [
    {
      id: 'poble',
      icon: Building,
      title: 'Poble Obert (Canon)',
      description: 'Configuració nativa per a municipis i comunitats comarcals.',
      lore: [
        { label: 'Matriarca AI', value: 'La IAIA (Llei de la Botifarra)' },
        { label: 'Estructura', value: 'Ajuntament, Places, Veïns' },
        { label: 'Rol', value: 'Preservació cultural i xafarderia sana' }
      ],
      color: 'bg-orange-500/20 text-orange-500 border-orange-500/50'
    },
    {
      id: 'universitat',
      icon: GraduationCap,
      title: 'Campus (Universitat)',
      description: 'Entorn acadèmic, ideal per a facultats o instituts.',
      lore: [
        { label: 'Matriarca AI', value: 'La Conserge / El Degà' },
        { label: 'Estructura', value: 'Rectorat, Facultats, Estudiants' },
        { label: 'Rol', value: 'Dinamització de campus i anuncis' }
      ],
      color: 'bg-blue-500/20 text-blue-500 border-blue-500/50'
    },
    {
      id: 'empresa',
      icon: Briefcase,
      title: 'Xarxa Corporativa',
      description: 'Intranet corporativa per a equips dinàmics.',
      lore: [
        { label: 'Matriarca AI', value: 'Office Manager / HR' },
        { label: 'Estructura', value: 'Direcció, Departaments, Empleats' },
        { label: 'Rol', value: 'Teambuilding i comunicació interna' }
      ],
      color: 'bg-emerald-500/20 text-emerald-500 border-emerald-500/50'
    },
    {
      id: 'associacio',
      icon: Users,
      title: 'Falla / Associació',
      description: 'Grups culturals, falles o fogueres amb forta jerarquia d\'esdeveniments.',
      lore: [
        { label: 'Matriarca AI', value: 'La Presidenta / Delegada' },
        { label: 'Estructura', value: 'Junta, Casal, Fallers/Socis' },
        { label: 'Rol', value: 'Organització de festes i debats de casal' }
      ],
      color: 'bg-purple-500/20 text-purple-500 border-purple-500/50'
    }
  ];

  const handleInjectLore = async () => {
    setIsInjecting(true);
    setInjectionStatus(null);
    try {
      // Simulem injecció a DB, o podríem fer una mutació real
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Ací aniria la crida al RPC o modificació de la config global
      // ex: await supabase.rpc('setup_zero_day', { instance_type: selectedType });
      
      setInjectionStatus('success');
    } catch (error) {
      console.error(error);
      setInjectionStatus('error');
    } finally {
      setIsInjecting(false);
    }
  };

  const selectedData = instanceTypes.find(t => t.id === selectedType);

  return (
    <div className="p-4 md:p-6 space-y-8 animate-in fade-in zoom-in-95 duration-300">
      
      {/* Header Epic */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-theme-divider pb-6">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tight flex items-center gap-3">
            <Settings2 size={32} className="text-[#0ea5e9]" />
            {t('admin.zero_day_setup', 'SETUP ZERO-DAY')}
          </h2>
          <p className="opacity-80 mt-1 max-w-2xl font-medium">
            Assimilació Cultural del Motor Agnostic. Defineix quin serà l'esperit d'aquesta instància abans de començar la simulació. Aquesta acció mutarà l'ADN dels agents i l'arquitectura de permisos.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Llista d'opcions (Esquerra) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <h3 className="font-bold text-lg uppercase mb-2">Escull l'Essència</h3>
          {instanceTypes.map((type) => {
            const Icon = type.icon;
            const isSelected = selectedType === type.id;
            return (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-start gap-4 ${
                  isSelected 
                    ? type.color + ' shadow-lg scale-[1.02]' 
                    : 'border-theme-divider hover:border-[#0ea5e9]/50 opacity-70 hover:opacity-100 bg-theme-base'
                }`}
              >
                <div className={`p-3 rounded-full ${isSelected ? 'bg-current/10' : 'bg-theme-divider/50'}`}>
                  <Icon size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-xl">{type.title}</h4>
                  <p className="text-sm opacity-80 leading-snug mt-1">{type.description}</p>
                </div>
              </button>
            )
          })}
        </div>

        {/* Panel de Detall i Injecció (Dreta) */}
        <div className="lg:col-span-7">
          <div className="bg-theme-sidebar border border-theme-divider rounded-2xl p-6 md:p-8 flex flex-col h-full relative overflow-hidden">
            
            {/* Decal */}
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
              <Zap size={200} />
            </div>

            <div className="relative z-10 flex-1">
              <h3 className="text-2xl font-black uppercase mb-6 flex items-center gap-2">
                <ShieldAlert className="text-[#0ea5e9]" />
                Perfil d'Assimilació: <span className="text-[#0ea5e9]">{selectedData.title}</span>
              </h3>

              <div className="bg-black/20 dark:bg-black/40 rounded-xl p-6 space-y-6 mb-8 border border-theme-divider/50">
                <p className="font-mono text-sm opacity-70 uppercase tracking-widest border-b border-theme-divider/50 pb-2">
                  Variables d'Entorn de Simulació
                </p>
                <div className="space-y-4">
                  {selectedData.lore.map((item, idx) => (
                    <div key={idx} className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                      <span className="font-bold opacity-70">{item.label}</span>
                      <span className="bg-theme-base px-3 py-1 rounded-md text-sm font-mono border border-theme-divider">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status or Warnings */}
              <div className="bg-yellow-500/10 border-l-4 border-yellow-500 p-4 rounded-r-xl mb-8">
                <div className="flex gap-3">
                  <AlertTriangle className="text-yellow-500 shrink-0" />
                  <p className="text-sm text-yellow-700 dark:text-yellow-400 font-medium">
                    Atenció: Injectar un nou perfil reescriurà les entitats base existents (IAIAS, Ajuntament) i els rols per defecte a la base de dades (Protocol OMEGA). Aquesta acció impacta en tota la instància.
                  </p>
                </div>
              </div>
            </div>

            {/* Acció Principal */}
            <div className="relative z-10 mt-auto pt-6 border-t border-theme-divider">
              <button
                onClick={handleInjectLore}
                disabled={isInjecting}
                className="w-full bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-black uppercase text-lg p-5 rounded-xl shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_30px_rgba(14,165,233,0.5)] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isInjecting ? (
                  <>
                    <Zap size={24} className="animate-pulse" />
                    Forjant Identitat del Motor...
                  </>
                ) : (
                  <>
                    <Zap size={24} />
                    Mutar Engine cap a {selectedData.title}
                  </>
                )}
              </button>

              {injectionStatus === 'success' && (
                <div className="mt-4 flex items-center justify-center gap-2 text-emerald-500 font-bold animate-in slide-in-from-bottom-2">
                  <CheckCircle2 size={20} />
                  <span>Assimilació completada amb èxit! El sistema ha transmutat.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZeroDaySetupModule;

import { useLocation } from "react-router-dom";
import { Code, Settings, Menu, Blocks, Fingerprint, Activity } from "lucide-react";
import { useTranslation } from "react-i18next";

const SystemLayoutMenuItems = [
  { path: "/admin", label: "Panell Admin", icon: Settings },
  { path: "/solatge", label: "Consola Solatge", icon: Code },
  { path: "/ofici/menu", label: "Gestió Menú", icon: Menu },
  { path: "/ofici/categories", label: "Categories", icon: Blocks },
  { path: "/ofici/xats", label: "Auditoria Xats", icon: Activity },
  { path: "/visio", label: "Visió Artificial", icon: Fingerprint },
];

const SystemLayout = ({ children }) => {
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <div 
      className="system-layout grid grid-cols-1 md:grid-cols-[260px_1fr] h-[100dvh] w-full bg-[#0a0a0a] text-gray-200 font-sans overflow-hidden"
      style={{ contain: 'layout style paint size' }} // ⚡ AISLAMIENTO TOTAL DE REPAINTS
    >
      {/* SYSTEM SIDEBAR */}
      <aside className="hidden md:flex flex-col bg-[#0a0a0c] border-r border-[#222] h-full p-4 relative z-20">
        <div className="flex items-center gap-3 mb-8 px-2">
           {/* LOGO SIMPLIFICAT */}
          <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center font-black text-white text-lg shadow-[0_0_20px_rgba(220,38,38,0.4)]">
            A
          </div>
          <div>
            <h1 className="text-sm font-black tracking-[0.2em] text-red-500 uppercase">Sóc de Poble</h1>
            <p className="text-[10px] text-white/50 tracking-widest uppercase">System Core M3</p>
          </div>
        </div>
        
        <nav className="flex-1 space-y-1.5 overflow-y-auto custom-scrollbar pr-2">
          <div className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-3 mb-3 mt-2">Nucli Administratiu</div>
          {SystemLayoutMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-all duration-200 outline-none ${
                  isActive ? "bg-red-500/10 text-red-400 border border-red-500/20" : "text-white/60 hover:bg-white/5 hover:text-white border border-transparent"
                }`}
              >
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="pt-6 border-t border-[#222] mt-auto shrink-0">
          <Link
             to="/mur"
             className="flex items-center gap-3 w-full px-4 py-3 bg-white/5 hover:bg-white/10 outline-none rounded-xl text-sm font-bold text-white transition-colors"
          >
            <ArrowLeft size={18} />
            {t('common.back', 'Tornar al Poble')}
          </Link>
        </div>
      </aside>

      {/* MOBILE HEADER FOR SYSTEM */}
      <header className="md:hidden flex items-center justify-between bg-[#0a0a0c] border-b border-[#222] h-16 px-4 shrink-0 relative z-20">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center font-bold text-white">
            A
            </div>
            <span className="font-black text-xs uppercase tracking-widest text-[#888]">Core</span>
        </div>
         <Link
            to="/mur"
            className="flex items-center gap-2 text-xs font-bold text-white/80 bg-white/10 active:bg-white/20 px-4 py-2 rounded-lg"
          >
            <ArrowLeft size={14} /> Tornar
          </Link>
      </header>

      {/* MAIN VIEWPORT MINIMALISTA: NO GHOSTS, NO OVERLAPS */}
      <main className="relative flex flex-col h-full overflow-y-auto overscroll-none bg-[#050505] custom-scrollbar main-system-viewport">
          <ErrorBoundary fallbackMessage="Error crític en la matriu del sistema.">
             <Suspense fallback={<div className="h-full w-full flex items-center justify-center"><NanoLoader message="Carregant Nucli..." /></div>}>
                 {/* RENDERING BLOCK - Isolated and pure */}
                 <div className="flex-1 w-full max-w-7xl mx-auto flex flex-col h-full">
                    {children}
                 </div>
             </Suspense>
          </ErrorBoundary>
      </main>
    </div>
  );
};

export default SystemLayout;

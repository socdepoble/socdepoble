import { FileText } from 'lucide-react';

const TramitBaseTemplate = ({ 
    title, 
    description, 
    icon: Icon = FileText, 
    status = 'pending', // 'pending' | 'completed' | 'draft'
    onBack, 
    children, 
    predefinedUser,
    tabs = [],
    activeTab = null,
    onTabChange = null
}) => {
    
    const getStatusStyle = () => {
        switch(status) {
            case 'completed': return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'pending': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
            case 'draft': return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
            default: return 'bg-theme-panel text-theme-text border-theme-border';
        }
    };

    return (
        <div className="min-h-screen bg-[var(--theme-bg)] text-[var(--theme-text)] pb-24">
            {/* Header Mestre (Estil Visor) */}
            <header className="sticky top-0 z-50 bg-[var(--theme-bg)]/90 backdrop-blur-md border-b border-[var(--border-master)] shadow-sm">
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={onBack}
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-theme-panel border border-theme-border text-theme-text hover:bg-[var(--theme-accent-primary)] hover:text-white transition-colors shadow-sm"
                            aria-label="Tornar arrere"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div className="hidden sm:block">
                            <BrandLogo variant="rectangular" height={32} />
                        </div>
                    </div>

                    {/* Meta info del tràmit */}
                    <div className="flex items-center gap-3">
                        <div className={`px-3 py-1.5 rounded-full text-xs font-bold border flex items-center gap-2 ${getStatusStyle()}`}>
                            {status === 'completed' && <CheckCircle size={14} />}
                            {status === 'pending' && <Clock size={14} />}
                            {status === 'draft' && <FileText size={14} />}
                            <span className="uppercase tracking-wider">
                                {status === 'completed' ? 'Completat' : status === 'pending' ? 'En Procés' : 'Esborrany'}
                            </span>
                        </div>
                        {predefinedUser && (
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-theme-panel border border-theme-border text-xs font-medium">
                                <Shield size={14} className="text-green-500" />
                                <span className="hidden sm:inline">Autenticat:</span>
                                <span className="font-bold">{predefinedUser.nom || 'Usuari'}</span>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto p-4 md:p-8 mt-4">
                {/* Capçalera del Tràmit */}
                <div className="bg-theme-panel border border-theme-border rounded-[32px] p-6 md:p-10 mb-8 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--theme-accent-primary)] opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
                    
                    <div className="flex items-start gap-6 relative z-10">
                        <div className="w-16 h-16 rounded-[20px] bg-[var(--theme-accent-primary)]/10 text-[var(--theme-accent-primary)] flex items-center justify-center shrink-0 border border-[var(--theme-accent-primary)]/20 shadow-inner">
                            <Icon size={32} />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-4xl font-black text-theme-text mb-2 tracking-tight">{title}</h1>
                            <p className="text-theme-text opacity-70 text-lg leading-relaxed max-w-2xl">{description}</p>
                        </div>
                    </div>
                </div>

                {/* Historial / Tabs Estandarditzats */}
                {tabs && tabs.length > 0 && (
                    <div 
                        className="flex items-center gap-2 mb-8 bg-theme-panel p-1.5 rounded-[20px] border border-theme-border w-full md:w-fit shadow-sm overflow-x-auto custom-scrollbar" 
                        role="tablist"
                        aria-label="Opcions del tràmit"
                    >
                        {tabs.map(tab => {
                            const TabIcon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    role="tab"
                                    aria-selected={isActive}
                                    onClick={() => onTabChange && onTabChange(tab.id)}
                                    className={`flex items-center justify-center whitespace-nowrap gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all flex-1 md:flex-none ${
                                        isActive 
                                            ? 'bg-[var(--theme-accent-primary)] text-white shadow-md' 
                                            : 'text-theme-text opacity-70 hover:opacity-100 hover:bg-[var(--theme-accent-primary)]/10'
                                    }`}
                                >
                                    {TabIcon && <TabIcon size={18} />}
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* Contingut Injectat */}
                <div className="space-y-6">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default TramitBaseTemplate;

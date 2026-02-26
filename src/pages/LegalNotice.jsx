import { useNavigation } from '../context/NavigationContext';
import React, { useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { ArrowLeft, Scale, Shield, CheckCircle2, ChevronRight, Fingerprint, Globe, Lock, Cpu, Database, Award, Sun, Moon, Menu } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useDesign } from '../context/DesignContext';
const LegalNotice = () => {
    const navigate = useNavigate();
    const { theme } = useDesign();
    const { toggleTheme } = useTheme();
    const { toggleDrawer } = useNavigation();
    const isDayMode = theme === 'light';
    const [currentSlide, setCurrentSlide] = React.useState(0);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [touchStart, setTouchStart] = React.useState(null);
    const [touchEnd, setTouchEnd] = React.useState(null);

    const infographies = [
        {
            title: "SOBIRANIA DIGITAL",
            desc: "La dada com a arrel, no com a mercaderia. En el Mas Digital, tu eres el propietari de la teua informació. Apostem per connexions horitzontals peer-to-peer, eliminant intermediaris extractius i garantint que el bategat del teu poble romanga privat i sobirà. No més algoritmes que decideixen per tu, sinó una infraestructura al servei de la comunitat rural.",
            image: "/assets/infographies/art_sobirania_v1036.png"
        },
        {
            title: "DADES AMB TRELLAT",
            desc: "Privacitat KM 0. Apliquem el sentit comú a la gestió digital. Protecció suprema de la identitat rural sota el bategat del Mas. Sols recollim allò que és essencial per a la convivència i el comerç local. Les teues dades no viatgen a servidors desconeguts, sinó que s'arrelen en el territori per generar utilitat real i protegir el futur dels nostres pobles.",
            image: "/assets/infographies/art_trellat_v1036.png"
        },
        {
            title: "LA IAIA I EL GRUP DE TREBALL",
            desc: "Memòria Viva i Tecnologia Ancestral. Un bategat que uneix generacions a través del codi i la saviesa popular. El Grup de Treball de la IAIA garanteix que la intel·ligència artificial no oblide d'on venim. Implementem protocols que dignifiquen el passat mentre construïm el futur digital més humà i connectat de les nostres comarques.",
            image: "/assets/infographies/art_memoria_v1036.png"
        }
    ];

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % infographies.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + infographies.length) % infographies.length);

    const handleTouchStart = (e) => {
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;

        if (isLeftSwipe) nextSlide();
        if (isRightSwipe) prevSlide();

        setTouchEnd(null);
        setTouchStart(null);
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Theme Variables
    const bgColor = isDayMode ? 'bg-white' : 'bg-black';
    const textColor = isDayMode ? 'text-black' : 'text-white';
    const subTextColor = isDayMode ? 'text-black/60' : 'text-white/60';
    const mutedTextColor = isDayMode ? 'text-black/30' : 'text-white/30';
    const cardBg = isDayMode ? 'bg-black/5' : 'bg-white/[0.03]';
    const primaryColor = isDayMode ? 'text-blue-600' : 'text-primary';
    const primaryBg = isDayMode ? 'bg-blue-600' : 'bg-primary';
    const primaryBorder = isDayMode ? 'border-blue-600/40' : 'border-primary/40';

    return (
        <div className={`min-h-screen ${bgColor} ${textColor} flex flex-col font-sans pb-40 selection:bg-primary/30 selection:text-white overflow-x-hidden lg:pl-[120px] transition-colors duration-700`}>
            {/* BACKGROUND ATMOSPHERE - ULTRA EXPANSIVE & BATEGANT */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className={`absolute top-[-20%] left-[-10%] w-[80%] h-[80%] ${isDayMode ? 'bg-secondary/5' : 'bg-secondary/10'} blur-[180px] rounded-full animate-pulse duration-[12s]`} />
                <div className={`absolute bottom-[-20%] right-[-10%] w-[80%] h-[80%] ${isDayMode ? 'bg-primary/5' : 'bg-primary/10'} blur-[180px] rounded-full animate-pulse duration-[10s]`} />
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full ${isDayMode ? 'bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.03)_0%,transparent_70%)]' : 'bg-[radial-gradient(circle_at_center,rgba(255,107,0,0.05)_0%,transparent_70%)]'}`} />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]" />
            </div>

            {/* FLOATING HEADER - CINEMATIC GLASS */}
            <header className={`fixed top-0 left-0 right-0 h-20 md:h-24 flex items-center justify-between px-6 md:px-16 z-50 backdrop-blur-2xl ${isDayMode ? 'bg-white/40 border-black/5' : 'bg-black/40 border-white/5'} border-b transition-all`}>
                <div className="flex items-center gap-2">
                    {/* BOTO MENU MÒBIL */}
                    <button 
                        onClick={toggleDrawer}
                        className={`lg:hidden p-3 rounded-xl border ${isDayMode ? 'border-black/10 text-black/60' : 'border-white/10 text-white/40'} hover:${primaryBorder} transition-all active:scale-95`}
                        title="Obrir Menú"
                    >
                        <Menu size={24} strokeWidth={2.5} />
                    </button>

                    <button 
                        onClick={() => navigate(-1)} 
                        className={`flex items-center gap-4 ${isDayMode ? 'text-black/40 hover:text-black' : 'text-white/40 hover:text-white'} transition-all group`}
                    >
                        <div className={`p-3 rounded-full border ${isDayMode ? 'border-black/10' : 'border-white/10'} group-hover:${primaryBorder} group-hover:bg-primary/10 transition-all shadow-inner`}>
                            <ArrowLeft size={22} strokeWidth={2.5} />
                        </div>
                        <div className="hidden sm:flex flex-col items-start translate-y-0.5">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] leading-none mb-1">TORNAR AL MAS</span>
                            <span className={`text-[8px] font-bold ${isDayMode ? 'text-black/20' : 'text-white/20'} uppercase tracking-[0.2em] group-hover:${primaryColor}/60 transition-colors`}>SORTIDA SEGURA</span>
                        </div>
                    </button>
                </div>
                
                <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <div className="flex items-center gap-3">
                        <div className={`w-1 h-3 ${primaryBg} rounded-full animate-pulse`} />
                        <span className={`text-[12px] font-black uppercase tracking-[0.6em] ${isDayMode ? 'text-black/90' : 'text-white/90'}`}>SOBIRANIA LEGAL</span>
                        <div className={`w-1 h-3 ${primaryBg} rounded-full animate-pulse`} />
                    </div>
                    <div className={`w-24 h-px bg-gradient-to-r from-transparent via-${isDayMode ? 'blue-600' : 'primary'}/40 to-transparent mt-2`} />
                </div>

                <div className="flex items-center gap-6">
                      <button 
                         onClick={toggleTheme}
                         className={`p-3 ${cardBg} rounded-xl border ${isDayMode ? 'border-black/10' : 'border-white/10'} hover:${primaryBorder} transition-all relative group shadow-lg`}
                         title={isDayMode ? "Activar Nit Digital" : "Activar Llum de Dia"}
                      >
                         {isDayMode ? <Sun size={20} className="text-blue-600" /> : <Moon size={20} className="text-primary" />}
                         <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-[10px] font-black uppercase tracking-widest px-4 py-2 bg-black text-white rounded shadow-2xl z-50">
                             {isDayMode ? 'NIT DIGITAL' : 'LLUM DE DIA'}
                         </div>
                      </button>
                     <div className={`hidden lg:flex items-center gap-3 px-5 py-2 ${cardBg} rounded-full border ${isDayMode ? 'border-black/10' : 'border-white/10'} shadow-2xl`}>
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                        <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${isDayMode ? 'text-black/60' : 'text-white/60'}`}>NODE: CANÒNIC-V10</span>
                    </div>
                </div>
            </header>

            <main className="relative z-10 pt-24 md:pt-64 flex flex-col items-center px-4 md:px-0 w-full mb-40">
                
                {/* 1. HERO SECTION - BOLD & CINEMATIC */}
                <div className="w-full text-center space-y-8 md:space-y-12 mb-20 md:mb-40 animate-in fade-in slide-in-from-bottom-12 duration-1000 px-6">
                    <div className="relative inline-block group">
                         <div className="absolute -inset-8 bg-primary/20 blur-3xl opacity-20 group-hover:opacity-40 rounded-full animate-pulse transition-opacity" />
                         <h1 className={`relative text-5xl sm:text-7xl md:text-[140px] lg:text-[160px] font-black italic tracking-tighter leading-[0.8] md:leading-[0.75] uppercase flex flex-col`}>
                            <span className={`${isDayMode ? 'text-black' : 'text-white'} drop-shadow-[0_10px_30px_rgba(255,255,255,0.1)] transition-transform hover:-translate-y-2 duration-500`}>SÓC DE POBLE</span>
                            <span className={`${primaryColor} italic transform -translate-y-2 md:-translate-y-4 md:-translate-x-4 mix-blend-screen drop-shadow-[0_0_20px_rgba(255,107,0,0.5)]`}>PER A WEB</span>
                        </h1>
                         <div className={`absolute -right-4 md:-right-8 -bottom-2 md:-bottom-4 ${isDayMode ? 'bg-black text-white' : 'bg-white text-black'} px-3 md:px-4 py-0.5 md:py-1 font-black text-[10px] md:text-xs skew-x-[-12deg] shadow-2xl`}>
                            VERSIÓ BATEGA 2026
                         </div>
                    </div>
                    
                    <div className="max-w-4xl mx-auto space-y-10">
                        <p className={`text-2xl md:text-5xl font-black ${textColor} leading-tight italic tracking-tighter`}>
                             "Connecta amb la teua comunitat. <br className="hidden md:block" />
                            El bategat de la terra en <span className="text-secondary italic">format digital</span>."
                        </p>

                        <div className={`h-0.5 w-40 bg-gradient-to-r from-transparent via-${isDayMode ? 'blue-600' : 'primary'}/60 to-transparent mx-auto`} />

                        <p className={`text-sm md:text-xl font-bold ${mutedTextColor} max-w-3xl mx-auto leading-relaxed uppercase tracking-[0.2em] px-4 font-sans`}>
                            Sóc de Poble és un Sistema Operatiu Rural Sobirà. Una eina per a la gent, ajuntaments i negocis KM 0 per a protegir la memòria, dinamitzar l'economia local i bategar amb utilitat social.
                        </p>
                    </div>
                </div>

                {/* 2. INFOGRAPHIC CAROUSEL - FILOSOFIA DEL RHIZOME */}
                <div className="w-full mb-40 relative group px-4 md:px-20 max-w-[1400px] mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-secondary/10 rounded-2xl border border-secondary/20">
                                <Fingerprint size={24} className="text-secondary animate-pulse" />
                            </div>
                            <h3 className="text-secondary font-black uppercase tracking-[0.5em] text-sm md:text-base">FILOSOFIA DEL RHIZOME</h3>
                        </div>
                        <div className="hidden md:flex items-center gap-3">
                            <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">GLOSSARI DE SOBIRANIA</span>
                            <div className="w-12 h-px bg-white/10" />
                        </div>
                    </div>

                    <div className="relative flex items-center justify-center w-full max-w-[950px] mx-auto overflow-visible">
                        <button 
                            onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                            className="absolute left-[5%] sm:left-[-20px] lg:left-[-140px] z-30 p-4 md:p-10 bg-black/80 backdrop-blur-3xl border-2 border-white/10 rounded-full text-white hover:bg-primary hover:border-primary transition-all shadow-[0_0_60px_rgba(0,0,0,0.9)] active:scale-75 group"
                            aria-label="Anterior"
                        >
                            <ChevronRight size={32} mdSize={48} strokeWidth={4} className="rotate-180 group-hover:scale-125 transition-transform" />
                        </button>

                        {/* Slide Container (Square 1:1) - RESPONSIVE WIDTH - NO BORDERS */}
                        <div 
                            className={`relative aspect-square w-full ${isDayMode ? 'bg-white' : 'bg-black'} rounded-[48px] overflow-hidden shadow-[0_80px_120px_rgba(0,0,0,0.4)] cursor-zoom-in group/main flex-shrink-0`} 
                            onClick={() => setIsModalOpen(true)}
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                        >
                            {/* Slide Content (NanoBanana Art) */}
                            <div className="absolute inset-0 flex items-center justify-center transition-all duration-1000 transform group-hover/main:scale-105">
                                <img 
                                    src={infographies[currentSlide].image} 
                                    alt={infographies[currentSlide].title}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* OFFICIAL BRANDING OVERLAY */}
                            <div className="absolute top-12 left-0 right-0 flex justify-center z-30 pointer-events-none group-hover/main:-translate-y-2 transition-transform duration-700">
                                <div className="flex flex-col items-center gap-4">
                                    <img 
                                        src={isDayMode ? "/assets/master/logo_socdepoble_white_full.png" : "/assets/master/logo_socdepoble_white_full.png"} 
                                        alt="Sóc de Poble Logo" 
                                        className={`h-14 md:h-20 w-auto drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)] ${isDayMode ? 'invert' : ''}`} 
                                    />
                                    <div className={`text-[10px] md:text-[12px] font-black ${isDayMode ? 'text-blue-600' : 'text-primary'} uppercase tracking-[0.6em] drop-shadow-[0_0_20px_rgba(0,0,0,0.4)]`}>
                                        {infographies[currentSlide].title}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                            className={`absolute right-[5%] sm:right-[-20px] lg:right-[-140px] z-30 p-4 md:p-10 ${isDayMode ? 'bg-white/80' : 'bg-black/80'} backdrop-blur-3xl border-2 ${isDayMode ? 'border-black/5' : 'border-white/10'} rounded-full ${isDayMode ? 'text-black' : 'text-white'} hover:bg-primary transition-all shadow-2xl active:scale-75 group`}
                            aria-label="Següent"
                        >
                            <ChevronRight size={32} mdSize={48} strokeWidth={4} className="group-hover:scale-125 transition-transform" />
                        </button>
                    </div>

                    {/* Fixed Descriptions Area (Restructured) */}
                    <div className={`mt-12 w-full max-w-[950px] mx-auto p-10 md:p-16 ${cardBg} rounded-[48px] border ${isDayMode ? 'border-black/5' : 'border-white/5'} backdrop-blur-3xl transition-all hover:border-primary/20`}>
                         <div className="flex items-center gap-6 mb-8 group/title">
                            <div className={`w-2 h-12 ${primaryBg} rounded-full group-hover/title:h-16 transition-all`} />
                            <h4 className={`text-3xl md:text-5xl font-black italic tracking-tighter uppercase ${textColor}`}>
                                {infographies[currentSlide].title}
                            </h4>
                         </div>
                         <p className={`text-lg md:text-2xl font-bold leading-relaxed ${subTextColor} selection:bg-primary/20`}>
                            {infographies[currentSlide].desc}
                         </p>
                         <div className="mt-10 flex items-center justify-between opacity-40">
                             <span className="text-[10px] font-black uppercase tracking-widest italic">NanoBanana | Art</span>
                             <div className="flex gap-2">
                                {infographies.map((_, i) => (
                                    <div key={i} className={`w-2 h-2 rounded-full ${i === currentSlide ? (isDayMode ? 'bg-blue-600' : 'bg-primary') : 'bg-white/10'}`} />
                                ))}
                             </div>
                         </div>
                    </div>

                    {/* Navigation Dots */}
                    <div className="flex justify-center gap-4 mt-12">
                        {infographies.map((_, idx) => (
                            <button 
                                key={idx}
                                onClick={() => setCurrentSlide(idx)}
                                className={`h-2 md:h-3 transition-all duration-500 rounded-full ${idx === currentSlide ? 'w-12 md:w-20 bg-primary shadow-[0_0_15px_rgba(255,107,0,1)]' : 'w-2 md:w-3 bg-white/10 hover:bg-white/30'}`}
                            />
                        ))}
                    </div>
                </div>

                {/* MODAL VIEW - FULLSCREEN */}
                {isModalOpen && (
                    <div 
                        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 md:p-20 overflow-hidden animate-in fade-in duration-300"
                        onClick={() => setIsModalOpen(false)}
                    >
                        <button className="absolute top-10 right-10 p-4 text-white/40 hover:text-white transition-colors">
                            <Scale size={48} className="rotate-45" />
                        </button>
                        
                        <div className="relative w-full max-w-[1200px] aspect-square flex items-center justify-center" onClick={e => e.stopPropagation()}>
                             <img 
                                src={infographies[currentSlide].image} 
                                alt={infographies[currentSlide].title}
                                className="w-full h-full object-contain rounded-[40px] md:rounded-[60px] shadow-[0_0_100px_rgba(255,107,0,0.2)]"
                            />
                            
                            {/* Navigation inside modal */}
                             <button 
                                onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                                className="absolute left-[-20px] md:left-[-80px] p-6 text-white/40 hover:text-primary transition-all"
                            >
                                <ChevronRight size={64} strokeWidth={3} className="rotate-180" />
                            </button>
                             <button 
                                onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                                className="absolute right-[-20px] md:right-[-80px] p-6 text-white/40 hover:text-primary transition-all"
                            >
                                <ChevronRight size={64} strokeWidth={3} />
                            </button>
                        </div>
                    </div>
                )}

                {/* 3. LICÈNCIA OBERTA SECTOR - ULTRA BOLD GRID */}
                <div className="w-full max-w-[1400px] mx-auto mb-40 px-6">
                    <div className="relative group perspective-2000">
                        <div className="absolute -inset-4 bg-primary/10 blur-[80px] opacity-20 rounded-[60px]" />
                        <div className={`relative ${isDayMode ? 'bg-white' : 'bg-gradient-to-br from-[#0a0a0a] to-black'} border-[4px] ${primaryBorder} rounded-[50px] p-12 md:p-24 shadow-[0_40px_120px_rgba(0,0,0,0.2)] overflow-hidden transition-all hover:border-primary/60 group-hover:scale-[1.01] duration-700`}>
                            
                            {/* Decorative Background Icon */}
                            <div className={`absolute -right-32 -bottom-32 ${isDayMode ? 'text-blue-600/10' : 'text-primary/10'} rotate-12 transition-transform group-hover:rotate-0 duration-1000`}>
                                <Award size={600} strokeWidth={1} />
                            </div>

                            <div className="flex flex-col lg:flex-row items-center lg:items-center gap-20 relative z-10">
                                <div className={`p-10 ${isDayMode ? 'bg-blue-600/10' : 'bg-primary/10'} rounded-[40px] border-2 ${primaryBorder} ${primaryColor} shadow-2xl scale-125 md:scale-[1.5] relative group-hover:rotate-6 transition-transform`}>
                                    <div className={`absolute inset-0 ${isDayMode ? 'bg-blue-600/10' : 'bg-primary/10'} blur-xl rounded-full`} />
                                    <CheckCircle2 size={96} strokeWidth={2.5} className="relative z-10" />
                                </div>
                                
                                <div className="space-y-12 flex-1 text-center lg:text-left">
                                    <div className="space-y-6">
                                        <h2 className={`text-4xl sm:text-6xl md:text-[90px] font-black italic tracking-tighter uppercase ${primaryColor} leading-none`}>
                                            LLICÈNCIA OBERTA
                                        </h2>
                                        <div className={`w-32 h-2 ${primaryBg} rounded-full mx-auto lg:mx-0 shadow-[0_0_20px_rgba(255,107,0,1)]`} />
                                        <p className={`text-xl md:text-4xl font-black ${textColor}/90 leading-tight tracking-tight`}>
                                            Aquest sistema és de codi obert per a ús comunitari i educatiu. L'ús comercial està subjecte a llicència del Mestre. Consulta l'Arquitectura per a més detalls tècnics.
                                        </p>
                                    </div>
                                    
                                    <div className="flex flex-wrap gap-6 justify-center lg:justify-start">
                                        <button 
                                            onClick={() => navigate('/genesis')}
                                            className={`flex items-center gap-4 px-12 h-20 ${primaryBg} ${isDayMode ? 'text-white' : 'text-black'} hover:bg-white hover:text-black transition-all transform hover:scale-105 active:scale-95 group/btn rounded-[30px] shadow-[0_25px_60px_rgba(255,107,0,0.4)]`}
                                        >
                                            <span className="text-lg font-black uppercase tracking-[0.2em]">Condicions i arquitectura</span>
                                            <ChevronRight size={24} strokeWidth={3} className="group-hover:translate-x-2 transition-all" />
                                        </button>
                                        
                                        <NavLink to="/ofici" className={`flex items-center gap-4 px-10 h-20 ${cardBg} border-2 border-white/10 ${textColor} rounded-[30px] hover:bg-white transition-all transform hover:scale-105 active:scale-95 group/node active:bg-white active:text-black hover:text-black`}>
                                             <Database size={24} className={`${primaryColor} group-hover:text-black`} />
                                             <span className="text-sm font-black uppercase tracking-widest">Protocol de dades</span>
                                        </NavLink>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. ENTITY NAVIGATION - THE TRIAD OF SOVEREIGNTY */}
                <div className="w-full max-w-[1600px] mx-auto mb-40 space-y-20 px-6">
                    <div className="flex items-center gap-8">
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-white/10" />
                        <span className="text-[14px] font-black text-white/40 tracking-[0.8em] uppercase px-4">IDENTITATS DEL MAS</span>
                        <div className="flex-1 h-px bg-gradient-to-l from-transparent via-white/10 to-white/10" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full">
                        {/* Sóc de Poble Card */}
                         <NavLink 
                            to="/perfil/sdp-oficial-1"
                            className={`group relative ${isDayMode ? 'bg-white' : 'bg-black'} border-[3px] ${isDayMode ? 'border-black/5 shadow-2xl' : 'border-white/5 shadow-[0_40px_80px_rgba(0,0,0,0.5)]'} rounded-[48px] p-8 md:p-12 text-center space-y-10 hover:${primaryBorder} hover:bg-white/5 transition-all duration-700 overflow-hidden transform hover:-translate-y-4 flex flex-col items-center justify-between min-h-[480px] md:min-h-[540px]`}
                        >
                             <div className={`absolute inset-0 bg-gradient-to-br from-${isDayMode ? 'blue-600' : 'primary'}/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
                             <div className="relative z-10 space-y-8 flex flex-col items-center w-full">
                                <div className={`w-28 h-28 ${cardBg} rounded-[32px] flex items-center justify-center border-2 ${isDayMode ? 'border-black/10' : 'border-white/10'} group-hover:${primaryBorder} transition-all shadow-2xl group-hover:scale-110 flex-shrink-0`}>
                                    <img 
                                        src="/assets/master/logo_socdepoble_white_full.png" 
                                        alt="SDP" 
                                        className={`w-16 h-auto ${isDayMode ? 'invert opacity-80' : 'opacity-40'} group-hover:opacity-100 group-hover:scale-110 transition-all duration-500`} 
                                    />
                                </div>
                                <div className="space-y-6 flex flex-col items-center w-full">
                                    <h2 className={`text-3xl font-black italic tracking-tighter ${textColor} uppercase group-hover:${primaryColor} transition-colors leading-none text-center`}>SÓC DE POBLE</h2>
                                    <p className={`text-[11px] font-black ${mutedTextColor} tracking-[0.4em] uppercase group-hover:${primaryColor}/60 transition-colors`}>PROJECTE SOCIAL</p>
                                    <p className={`text-sm font-bold ${mutedTextColor} leading-relaxed max-w-[280px] group-hover:${textColor} transition-colors text-center`}>
                                        Plataforma bategant per a la memòria viva, el comerç KM 0 i la governança d'un territori sobirà i connectat.
                                    </p>
                                </div>
                            </div>
                            <div className="relative z-10 pt-4 opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0">
                                <span className={`text-[10px] font-black tracking-[0.3em] ${primaryColor} uppercase ${isDayMode ? 'bg-blue-600/10' : 'bg-primary/10'} px-8 py-3 rounded-full border ${primaryBorder} whitespace-nowrap`}>SOBRE EL PROJECTE</span>
                            </div>
                        </NavLink>

                        {/* Associació El Rentonar Card */}
                         <NavLink 
                            to="/perfil/rentonar-1"
                            className={`group relative ${isDayMode ? 'bg-white' : 'bg-black'} border-[3px] ${isDayMode ? 'border-black/5 shadow-2xl' : 'border-white/5 shadow-[0_40px_80px_rgba(0,0,0,0.5)]'} rounded-[48px] p-8 md:p-12 text-center space-y-10 hover:border-secondary/50 hover:bg-white/5 transition-all duration-700 overflow-hidden transform hover:-translate-y-4 flex flex-col items-center justify-between min-h-[480px] md:min-h-[540px]`}
                        >
                             <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                             <div className="relative z-10 space-y-8 flex flex-col items-center w-full">
                                <div className={`w-28 h-28 ${cardBg} rounded-[32px] flex items-center justify-center border-2 ${isDayMode ? 'border-black/10' : 'border-white/10'} group-hover:border-secondary/50 transition-all shadow-2xl group-hover:scale-110 flex-shrink-0`}>
                                    <Scale size={48} className={`text-white/40 group-hover:text-secondary transition-all group-hover:scale-110 ${isDayMode ? 'invert' : ''}`} />
                                </div>
                                <div className="space-y-6 flex flex-col items-center w-full">
                                    <h2 className={`text-3xl font-black italic tracking-tighter ${textColor} uppercase group-hover:text-secondary transition-colors leading-none text-center`}>EL RENTONAR</h2>
                                    <p className={`text-[11px] font-black ${mutedTextColor} tracking-[0.4em] uppercase group-hover:text-secondary/60 transition-colors text-center`}>AGRUPACIÓ ECOLOGISTA</p>
                                    <p className={`text-sm font-bold ${mutedTextColor} leading-relaxed max-w-[280px] group-hover:${textColor} transition-colors text-center`}>
                                        Entitat que promou i empara aquest projecte des de la resistència cultural i el respecte absolut al territori i la terra.
                                    </p>
                                </div>
                            </div>
                            <div className="relative z-10 pt-4 opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0">
                                <span className="text-[10px] font-black tracking-[0.3em] text-secondary uppercase bg-secondary/10 px-8 py-3 rounded-full border border-secondary/20 whitespace-nowrap">VISITAR ENTITAT</span>
                            </div>
                        </NavLink>

                        {/* Javi Llinares Card */}
                         <NavLink 
                            to="/perfil/javi-sa-1"
                            className={`group relative ${isDayMode ? 'bg-white' : 'bg-black'} border-[3px] ${isDayMode ? 'border-black/5 shadow-2xl' : 'border-white/5 shadow-[0_40px_80px_rgba(0,0,0,0.5)]'} rounded-[48px] p-8 md:p-12 text-center space-y-10 hover:${primaryBorder} hover:bg-white/5 transition-all duration-700 overflow-hidden transform hover:-translate-y-4 flex flex-col items-center justify-between min-h-[480px] md:min-h-[540px]`}
                        >
                             <div className={`absolute inset-0 bg-gradient-to-br from-${isDayMode ? 'blue-600' : 'primary'}/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
                             <div className="relative z-10 space-y-8 flex flex-col items-center w-full">
                                <div className={`w-28 h-28 ${cardBg} rounded-[32px] overflow-hidden border-2 ${isDayMode ? 'border-black/10' : 'border-white/10'} group-hover:${primaryBorder} transition-all shadow-2xl group-hover:scale-110 flex-shrink-0`}>
                                    <img src="/assets/master/Javi_Llinares-Foto_perfil-1.jpg" alt="Javi" className={`w-full h-full object-cover ${isDayMode ? 'opacity-90' : 'opacity-60'} group-hover:opacity-100 transition-all duration-1000`} />
                                </div>
                                <div className="space-y-6 flex flex-col items-center w-full">
                                    <h2 className={`text-3xl font-black italic tracking-tighter ${textColor} uppercase group-hover:${primaryColor} transition-colors leading-none text-center`}>JAVI LLINARES</h2>
                                    <p className={`text-[11px] font-black ${mutedTextColor} tracking-[0.4em] uppercase group-hover:${textColor}/60 transition-colors`}>DIRECCIÓ I DISSENY</p>
                                    <p className={`text-sm font-bold ${mutedTextColor} leading-relaxed max-w-[280px] group-hover:${textColor} transition-colors text-center`}>
                                        Responsable de la seua realització, disseny i coordinació. El mestre darrere de la visió i l'execució del Mas Digital.
                                    </p>
                                </div>
                            </div>
                            <div className="relative z-10 pt-4 opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0">
                                <span className={`text-[10px] font-black tracking-[0.3em] ${primaryColor} uppercase ${isDayMode ? 'bg-blue-600/10' : 'bg-primary/10'} px-8 py-3 rounded-full border ${primaryBorder} whitespace-nowrap`}>MISSATGE AL MESTRE</span>
                            </div>
                        </NavLink>
                    </div>
                </div>

                {/* 5. SECTIONS DIVIDER - THE BALÍSTIC RAY */}
                <div className="w-full flex items-center justify-center gap-12 mb-40 opacity-20">
                    <div className="h-px w-full max-w-sm bg-gradient-to-r from-transparent to-white shadow-[0_0_10px_white]" />
                    <Scale size={64} className="shrink-0 text-white animate-pulse" />
                    <div className="h-px w-full max-w-sm bg-gradient-to-l from-transparent to-white shadow-[0_0_10px_white]" />
                </div>

                {/* 6. LSSI / RGPD SECTIONS - THE GRID OF TRUTH */}
                <div id="avis-legal" className="w-full max-w-[1600px] mx-auto space-y-40 text-white/60 pb-40 px-6">
                    
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
                         {/* Side Column: Sticky Navigation & Info */}
                        <div className="lg:col-span-4 space-y-12">
                            <div className="sticky top-32 space-y-12">
                                <div className="p-12 bg-white/[0.03] rounded-[60px] border border-white/10 space-y-8 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 blur-[80px] group-hover:bg-primary/10 transition-colors" />
                                    <div className="p-6 bg-primary/10 rounded-3xl text-primary border-2 border-primary/20 w-fit shadow-2xl shrink-0 group-hover:rotate-12 transition-transform">
                                        <Shield size={56} strokeWidth={2.5} />
                                    </div>
                                    <div className="space-y-3">
                                        <h2 className="text-6xl font-black italic tracking-tighter text-white uppercase leading-none">ESTATUT <br/>DEL MAS</h2>
                                        <p className="text-[12px] font-black text-primary uppercase tracking-[0.5em] opacity-80">ACTUALITZAT 2026</p>
                                    </div>
                                    <div className="pt-10 space-y-8">
                                        <a href="#avis-legal" className="flex items-center gap-4 text-lg font-black text-white hover:text-primary transition-all tracking-widest uppercase group/link">
                                            <div className="w-8 h-1 bg-primary rounded-full transform group-hover/link:scale-x-150 transition-transform origin-left" />
                                            1. AVÍS LEGAL
                                        </a>
                                        <a href="#cookies" className="flex items-center gap-4 text-lg font-black text-white/30 hover:text-primary transition-all tracking-widest uppercase group/link">
                                            <div className="w-4 h-1 bg-white/10 rounded-full transform group-hover/link:bg-primary group-hover/link:scale-x-150 transition-all origin-left" />
                                            2. COOKIES
                                        </a>
                                    </div>
                                </div>

                                <div className="p-10 border-2 border-white/5 rounded-[40px] bg-black/50 text-center space-y-4 italic">
                                     <p className="text-xl font-bold opacity-80 leading-relaxed">
                                        "La llei del poble es basa en la confiança. No demanem permisos per treballar, demanem respecte per bategar."
                                     </p>
                                     <span className="block text-[10px] uppercase tracking-widest text-primary font-black">SÒCRATES DEL COMTAT</span>
                                </div>
                            </div>
                        </div>

                        {/* Main Content Column: The Law of the Land */}
                        <div className="lg:col-span-8 space-y-32">
                            
                            {/* Section 1: Identitat */}
                            <section className="space-y-12 group">
                                <div className="flex items-center gap-6 transition-all group-hover:translate-x-4 duration-500">
                                    <div className="w-16 h-1.5 bg-primary rounded-full shadow-[0_0_15px_rgba(255,107,0,0.4)]" />
                                    <h3 className="text-5xl md:text-7xl font-black italic tracking-tighter text-white uppercase italic drop-shadow-lg">1. Identitat Bategant</h3>
                                </div>
                                
                                <div className="space-y-10 text-2xl md:text-3xl leading-snug font-medium text-white/80">
                                    <p>
                                        En compliment amb l'LSSI-CE es faciliten les dades d'informació general del bategat.
                                    </p>
                                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                                        <div className={`p-10 ${cardBg} rounded-[40px] border ${isDayMode ? 'border-black/10' : 'border-white/10'} hover:bg-white/5 hover:${primaryBorder} transition-all shadow-xl group/card`}>
                                            <span className={`block text-[11px] font-black ${mutedTextColor} tracking-[0.4em] uppercase mb-6 group-hover:${primaryColor} transition-colors`}>RESPONSABLE SOBAIRÀ</span>
                                            <span className={`text-3xl md:text-4xl font-black italic ${textColor} leading-none`}>F. JAVIER LLINARES <br/> GARCÍA</span>
                                        </div>
                                         <div className={`p-10 ${cardBg} rounded-[40px] border ${isDayMode ? 'border-black/10' : 'border-white/10'} hover:bg-white/5 hover:${primaryBorder} transition-all shadow-xl group/card`}>
                                            <span className={`block text-[11px] font-black ${mutedTextColor} tracking-[0.4em] uppercase mb-6 group-hover:${primaryColor} transition-colors`}>CIF/DNI MESTRE</span>
                                            <span className={`text-3xl md:text-4xl font-black italic ${textColor} leading-none`}>21476359V</span>
                                        </div>
                                    </div>
                                    <p className="opacity-60 text-xl leading-relaxed">
                                        El Mas Central es troba registrat a la Calle Sant Isidre Llaurador, 16. <br className="hidden md:block" />
                                        Connecta via <span className="text-primary font-black underline decoration-primary/40 underline-offset-8 decoration-2 cursor-pointer hover:text-white transition-colors select-all">socdepoble@socdepoble.org</span>.
                                    </p>
                                </div>
                            </section>

                            {/* Section 2: Rhizome Data */}
                            <section className="space-y-12 group">
                                <div className="flex items-center gap-6 transition-all group-hover:translate-x-4 duration-500">
                                    <div className="w-16 h-1.5 bg-secondary rounded-full shadow-[0_0_15px_rgba(6,182,212,0.4)]" />
                                    <h3 className="text-5xl md:text-7xl font-black italic tracking-tighter text-white uppercase italic drop-shadow-lg">2. SOBIRANIA DE L'USUARI</h3>
                                </div>
                                
                                <div className="space-y-12 text-2xl md:text-3xl leading-snug font-medium text-white/80">
                                    <p>
                                        Complim amb el RGPD de forma transparent. No som una xarxa extractiva; som una infraestructura col·lectiva bategant que garanteix la sobirania de la dada.
                                    </p>
                                    <ul className="space-y-12">
                                        <li className="flex items-start gap-8 group/item">
                                            <div className="mt-4 w-4 h-4 rounded-full bg-secondary shadow-[0_0_10px_rgba(6,182,212,0.8)] shrink-0 group-hover:scale-150 transition-transform" />
                                            <div className="space-y-2">
                                                <span className="font-black text-white uppercase italic tracking-tight block text-3xl md:text-4xl group-hover:text-secondary transition-colors">DADES MÍNIMES D'ARREL</span>
                                                <span className="opacity-60 text-xl md:text-2xl block leading-relaxed">Sols recollim el necessari per al bategat del node: perfil, localització voluntària i memòria social KM 0. Mantenim el rebost net de dades supèrflues.</span>
                                            </div>
                                        </li>
                                        <li className="flex flex-col gap-6 group/item">
                                            <div className="flex items-start gap-8">
                                                <div className="mt-4 w-4 h-4 rounded-full bg-secondary shadow-[0_0_10px_rgba(6,182,212,0.8)] shrink-0 group-hover:scale-150 transition-transform" />
                                                <div className="space-y-2">
                                                    <span className="font-black text-white uppercase italic tracking-tight block text-3xl md:text-4xl group-hover:text-secondary transition-colors text-left uppercase leading-none">FULMINAR O DESCARREGAR EL RHIZOME</span>
                                                    <span className="opacity-60 text-xl md:text-2xl block leading-relaxed text-left">Pots descarregar tota la teua memòria digital o fulminar el teu node del Mas en qualsevol moment de forma autònoma enviant un missatge al Mestre.</span>
                                                </div>
                                            </div>
                                            
                                            <div className="pl-12 flex justify-start">
                                                <NavLink 
                                                    to="/chats/javi-sa-1" 
                                                    className="flex items-center gap-6 px-10 h-20 bg-secondary/10 border-2 border-secondary/30 text-secondary hover:bg-secondary hover:text-black transition-all rounded-[32px] group/sub shadow-2xl shadow-secondary/10 active:scale-95"
                                                >
                                                    <span className="text-sm font-black uppercase tracking-[0.3em]">MISSATGE AL MESTRE D'ADRECES</span>
                                                    <ChevronRight size={24} strokeWidth={4} className="group-hover/sub:translate-x-2 transition-transform" />
                                                </NavLink>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </section>

                            {/* Section 3: Cookies */}
                            <section id="cookies" className="space-y-12 group bg-gradient-to-br from-[#080808] to-black p-12 md:p-24 rounded-[60px] border-2 border-white/5 transition-all hover:border-white/20 shadow-[-20px_40px_100px_rgba(0,0,0,0.5)]">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-1.5 bg-white/20 rounded-full" />
                                    <h3 className="text-5xl md:text-7xl font-black italic tracking-tighter text-white uppercase leading-none">3. Cookies</h3>
                                </div>
                                <div className="space-y-10 text-2xl md:text-3xl leading-relaxed">
                                    <p className="italic font-bold text-white leading-tight">
                                        "Ací al poble no ens agrada que ningú ens diga què hem d'anar a comprar. Per això, Sóc de Poble no utilitza gats vells de Google ni píxels extractius."
                                    </p>
                                    <p className="opacity-50 text-xl leading-relaxed">
                                        Utilitzem cookies lliures i anònimes d'auto-hostalatge per saber si cada bategat del sistema bategua bé. Mai venem la teua atenció. Mai traicionem el trellat del Mas.
                                    </p>
                                    <div className="pt-8 flex flex-wrap gap-4">
                                        <button className="px-8 py-4 bg-white/5 border border-white/10 rounded-full text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">GESTIONAR COOKIES ANÒNIMES</button>
                                    </div>
                                </div>
                            </section>

                             <section className="pt-32 text-center space-y-8 opacity-20 hover:opacity-100 transition-opacity">
                                <div className={`text-[12px] font-black uppercase tracking-[0.8em] ${textColor}`}>FI DEL COMUNICAT SOBIRÀ</div>
                                <div className={`text-7xl md:text-9xl font-black italic tracking-[0.05em] ${textColor}`}>2026</div>
                                <div className={`text-xl font-black tracking-widest ${primaryColor}`}>V10.33.16-CANÒNIC</div>
                            </section>
                        </div>
                    </div>
                </div>
            </main>

            {/* CINEMATIC FOOTER - FULLY EXPANDED */}
             <footer className={`fixed bottom-0 left-0 right-0 h-20 flex items-center justify-between px-10 md:px-20 z-50 backdrop-blur-xl ${isDayMode ? 'bg-white/40 border-black/5' : 'bg-black/40 border-white/5'} border-t`}>
                <div className={`flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.5em] ${mutedTextColor}`}>
                    <span>© 2026</span>
                    <div className={`w-1 h-1 rounded-full ${primaryBg}`} />
                    <span className="hidden md:inline">SÓC DE POBLE OFFICIAL</span>
                </div>

                <div className="flex items-center gap-8 md:gap-12">
                    <NavLink to="/legal" className={`text-[11px] font-black uppercase tracking-[0.3em] ${primaryColor} hover:${textColor} transition-colors`}>Avís Legal</NavLink>
                    <NavLink to="/legal#cookies" className={`text-[11px] font-black uppercase tracking-[0.3em] ${mutedTextColor} hover:${primaryColor} transition-colors`}>Cookies</NavLink>
                    <button 
                        onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} 
                        className={`hidden md:flex items-center gap-2 group p-2 hover:${isDayMode ? 'bg-black/5' : 'bg-white/5'} rounded-full transition-all`}
                    >
                        <span className={`text-[10px] font-black uppercase tracking-[0.4em] ${mutedTextColor} group-hover:${textColor} transition-colors`}>ADALT</span>
                        <ChevronRight className={`-rotate-90 ${isDayMode ? 'text-black/10' : 'text-white/10'} group-hover:${primaryColor} transition-colors`} size={16} />
                    </button>
                </div>

                <div className={`flex items-center gap-4 opacity-40 ${textColor}`}>
                    <Scale size={20} />
                </div>
            </footer>
        </div>
    );
};

export default LegalNotice;

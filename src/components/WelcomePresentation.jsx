import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { Scale, Shield, CheckCircle2, ChevronRight, Fingerprint, Database, Award, UserPlus, Share2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const WelcomePresentation = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);

    const infographies = [
        {
            title: "SOBIRANIA DIGITAL",
            desc: "La dada com a arrel, no com a mercaderia. En el Mas Digital, tu eres el propietari de la teua informació. Apostem per connexions horitzontals peer-to-peer, eliminant intermediaris extractius i garantint que el bategat del teu poble romanga privat i sobirà.",
            image: "/assets/infographies/art_sobirania_v1036.png"
        },
        {
            title: "DADES AMB TRELLAT",
            desc: "Privacitat KM 0. Sols recollim allò que és essencial per a la convivència i el comerç local. Les teues dades no viatgen a servidors desconeguts, sinó que s'arrelen en el territori per generar utilitat real i protegir el futur rural.",
            image: "/assets/infographies/art_trellat_v1036.png"
        },
        {
            title: "MEMÒRIA VIVA",
            desc: "Un bategat que uneix generacions a través del codi i la saviesa popular. Garanteix que la intel·ligència artificial no oblide d'on venim. Implementem protocols que dignifiquen el passat mentre construïm el futur digital.",
            image: "/assets/infographies/art_memoria_v1036.png"
        }
    ];

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % infographies.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + infographies.length) % infographies.length);

    const handleTouchStart = (e) => setTouchStart(e.targetTouches[0].clientX);
    const handleTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        if (distance > 50) nextSlide();
        if (distance < -50) prevSlide();
        setTouchEnd(null);
        setTouchStart(null);
    };

    return (
        <div className="relative w-full max-w-[1600px] mx-auto px-4 md:px-8 py-12 md:py-24 animate-in fade-in duration-1000 overflow-x-hidden">
            
            {/* ATMOSPHERIC GLOW - ADAPTED FOR COMPONENT */}
            <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-0 right-0 w-[60%] h-[500px] bg-secondary/10 blur-[120px] rounded-full mix-blend-screen dark:mix-blend-lighten" />
                <div className="absolute bottom-0 left-0 w-[60%] h-[500px] bg-primary/10 blur-[120px] rounded-full mix-blend-screen dark:mix-blend-lighten" />
            </div>

            {/* 1. HERO SECTION */}
            <div className="text-center mb-24 md:mb-40 px-2">
                <h1 className="text-5xl md:text-[90px] lg:text-[120px] font-black italic tracking-tighter uppercase text-gray-900 dark:text-white leading-[0.85] mb-6 drop-shadow-xl md:drop-shadow-[0_10px_30px_rgba(255,255,255,0.1)] relative inline-block">
                    SÓC DE POBLE
                </h1>
                
                <h2 className="text-2xl md:text-5xl text-blue-600 dark:text-primary font-black italic mb-8 md:mb-12 tracking-tight">
                    Portal de Pobles Connectats
                </h2>

                <p className="text-sm md:text-xl font-bold text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed mb-12 md:mb-16">
                    Una <span className="text-blue-600 dark:text-primary font-black uppercase">XARXA SOCIAL DESCENTRALITZADA</span> de PROGRAMARI LLIURE, per CONNECTAR i GEOLOCALITZAR recursos d’utilitat social, compartint informació, experiències i idees que faciliten el desenvolupament sostenible i tecnològic en entorns rurals, per posar en valor els recursos locals i mostrar l’atractiu dels pobles com a llocs on viure i treballar.
                </p>

                <div className="flex flex-col items-center gap-4 md:gap-6 max-w-lg mx-auto">
                    <button
                        className="relative flex items-center justify-center px-6 md:px-12 py-4 md:py-6 bg-blue-600 dark:bg-primary text-white rounded-full md:rounded-[24px] font-black uppercase text-sm md:text-xl tracking-widest shadow-xl dark:shadow-[0_20px_40px_rgba(255,107,0,0.3)] hover:scale-105 active:scale-95 transition-all w-full"
                        onClick={() => navigate("/registre")}
                    >
                        <UserPlus size={24} className="absolute left-6 hidden sm:block" />
                        <span className="text-center w-full">Connecta amb el teu Poble!</span>
                    </button>
                    
                    <button
                        className="relative flex items-center justify-center px-6 md:px-12 py-4 md:py-6 bg-primary dark:bg-secondary text-white rounded-full md:rounded-[24px] font-black uppercase text-sm md:text-xl tracking-widest shadow-lg hover:scale-105 active:scale-95 transition-all w-full"
                        onClick={() => {
                            if (navigator.share) {
                                navigator.share({ title: "Sóc de Poble", text: "Connecta amb la teua comunitat.", url: window.location.origin });
                            } else alert("Enllaç copiat!");
                        }}
                    >
                        <Share2 size={24} className="absolute left-6 hidden sm:block" />
                        <span className="text-center w-full">{t("common.share_soc", "Compartir Sóc de Poble")}</span>
                    </button>
                </div>
            </div>

            {/* 2. INFOGRAPHIC CAROUSEL - RESPONSIVE FIXES */}
            <div className="mb-32 md:mb-40 relative px-2">
                <div className="flex items-center justify-between mb-8 max-w-[950px] mx-auto">
                    <div className="flex items-center gap-3 md:gap-4">
                        <div className="p-2 bg-blue-50 dark:bg-secondary/10 rounded-xl border border-blue-100 dark:border-secondary/20">
                            <Fingerprint size={20} className="text-blue-600 dark:text-secondary animate-pulse" />
                        </div>
                        <h3 className="text-blue-600 dark:text-secondary font-black uppercase tracking-[0.3em] md:tracking-[0.5em] text-[10px] md:text-sm">FILOSOFIA DEL RHIZOME</h3>
                    </div>
                    <div className="hidden md:flex items-center gap-3">
                        <span className="text-[10px] font-black text-gray-400 dark:text-white/30 uppercase tracking-[0.3em]">GLOSSARI DE SOBIRANIA</span>
                        <div className="w-12 h-px bg-gray-300 dark:bg-white/10" />
                    </div>
                </div>

                <div className="relative flex items-center justify-center w-full max-w-[950px] mx-auto">
                    {/* Fixed Mobile Buttons: Inside or Overlaid Instead of Overflowing */}
                    <button 
                        onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                        className="absolute left-0 md:-left-20 z-30 p-2 md:p-6 bg-white/90 dark:bg-black/90 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-full text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-primary transition-all shadow-xl active:scale-90"
                    >
                        <ChevronRight size={28} strokeWidth={3} className="rotate-180" />
                    </button>

                    <div 
                        className="relative aspect-square w-full bg-gray-50 dark:bg-black rounded-[32px] md:rounded-[48px] overflow-hidden shadow-2xl md:shadow-[0_80px_120px_rgba(0,0,0,0.3)] cursor-pointer group/main border border-gray-100 dark:border-white/5"
                        onClick={() => setIsModalOpen(true)}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        <div className="absolute inset-0 flex items-center justify-center transition-transform duration-1000 group-hover/main:scale-105">
                            <img 
                                src={infographies[currentSlide].image} 
                                alt={infographies[currentSlide].title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        
                        {/* Overlay with Dark/Light Support */}
                        <div className="absolute top-6 md:top-12 inset-x-0 flex justify-center z-20 pointer-events-none group-hover/main:-translate-y-2 transition-transform duration-500">
                            <div className="flex flex-col items-center gap-2">
                                <img src="/assets/master/logo-socdepoble-rect.svg" alt="SDP" className="h-10 md:h-16 drop-shadow-xl dark:invert" />
                                <div className="text-[10px] sm:text-xs font-black text-blue-600 dark:text-primary uppercase tracking-[0.4em] md:tracking-[0.6em] drop-shadow-md bg-white/50 dark:bg-black/50 px-4 py-1 rounded-full backdrop-blur-sm">
                                    {infographies[currentSlide].title}
                                </div>
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                        className="absolute right-0 md:-right-20 z-30 p-2 md:p-6 bg-white/90 dark:bg-black/90 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-full text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-primary transition-all shadow-xl active:scale-90"
                    >
                        <ChevronRight size={28} strokeWidth={3} />
                    </button>
                </div>

                <div className="mt-8 md:mt-12 w-full max-w-[950px] mx-auto p-6 md:p-12 bg-gray-50 dark:bg-white/[0.03] rounded-[32px] md:rounded-[40px] border border-gray-200 dark:border-white/5 backdrop-blur-md transition-all hover:border-blue-200 dark:hover:border-primary/20">
                    <h4 className="text-2xl md:text-4xl font-black italic tracking-tighter uppercase text-gray-900 dark:text-white mb-4">
                        {infographies[currentSlide].title}
                    </h4>
                    <p className="text-sm md:text-xl font-bold leading-relaxed text-gray-600 dark:text-white/70">
                        {infographies[currentSlide].desc}
                    </p>
                    <div className="mt-6 md:mt-8 flex justify-center gap-3">
                        {infographies.map((_, idx) => (
                            <button key={idx} onClick={() => setCurrentSlide(idx)} className={`h-1.5 md:h-2 transition-all duration-300 rounded-full ${idx === currentSlide ? 'w-8 md:w-12 bg-blue-600 dark:bg-primary shadow-md' : 'w-2 bg-gray-300 dark:bg-white/20'}`} />
                        ))}
                    </div>
                </div>
            </div>

            {/* 3. LLICÈNCIA OBERTA SECTOR */}
            <div className="w-full max-w-[1200px] mx-auto mb-24 md:mb-40 px-2 lg:px-0">
                <div className="relative group perspective-1000">
                    <div className="absolute -inset-4 bg-blue-600/10 dark:bg-primary/20 blur-[60px] opacity-0 md:opacity-50 rounded-[40px]" />
                    <div className="relative bg-white dark:bg-[#0a0a0a] border-4 border-blue-600/20 dark:border-primary/30 rounded-[32px] md:rounded-[50px] p-8 md:p-16 shadow-2xl overflow-hidden group-hover:border-blue-600/50 dark:group-hover:border-primary/60 transition-all">
                        
                        <div className="absolute -right-20 -bottom-20 text-blue-600/5 dark:text-primary/10 rotate-12 pointer-events-none group-hover:rotate-0 transition-transform duration-1000">
                            <Award size={400} strokeWidth={1} />
                        </div>

                        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 relative z-10">
                            <div className="p-6 md:p-10 bg-blue-50 dark:bg-primary/10 rounded-[32px] border-2 border-blue-200 dark:border-primary/40 text-blue-600 dark:text-primary shrink-0 group-hover:scale-110 transition-transform">
                                <CheckCircle2 size={64} className="md:w-[80px] md:h-[80px]" strokeWidth={2.5} />
                            </div>
                            
                            <div className="space-y-6 text-center md:text-left flex-1">
                                <h2 className="text-4xl md:text-7xl font-black italic tracking-tighter uppercase text-blue-600 dark:text-primary leading-none">
                                    LLICÈNCIA OBERTA
                                </h2>
                                <p className="text-lg md:text-2xl font-bold text-gray-700 dark:text-white/90 leading-tight">
                                    Aquest sistema és de codi obert per a ús comunitari i educatiu. L'ús comercial està subjecte a llicència del Mestre.
                                </p>
                                
                                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
                                    <button onClick={() => navigate('/genesis')} className="px-8 py-4 bg-blue-600 dark:bg-primary text-white rounded-full font-black uppercase text-xs md:text-sm tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl">
                                        Condicions i arquitectura
                                    </button>
                                    <NavLink to="/ofici" className="flex items-center justify-center gap-2 px-8 py-4 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-all font-black uppercase text-xs md:text-sm tracking-widest">
                                        <Database size={18} className="text-blue-600 dark:text-primary" /> Protocol de dades
                                    </NavLink>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. IDENTITATS DEL MAS (Triad) */}
            <div className="w-full max-w-[1400px] mx-auto mb-24 md:mb-40 space-y-12 md:space-y-16 px-2">
                <div className="flex items-center gap-4 md:gap-8 opacity-40">
                    <div className="flex-1 h-px bg-gray-400 dark:bg-white/20" />
                    <span className="text-[10px] md:text-[12px] font-black text-gray-900 dark:text-white tracking-[0.4em] md:tracking-[0.8em] uppercase">IDENTITATS DEL MAS</span>
                    <div className="flex-1 h-px bg-gray-400 dark:bg-white/20" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                    {[
                        { title: "SÓC DE POBLE", entity: "PROJECTE SOCIAL", desc: "Plataforma bategant per a la memòria viva i la governança d'un territori sobirà.", path: "/perfil/sdp-oficial-1", logo: true },
                        { title: "EL RENTONAR", entity: "AGRUPACIÓ ECOLOGISTA", desc: "Entitat que promou i empara aquest projecte des de la resistència cultural.", path: "/perfil/rentonar-1", icon: <Scale size={40} className="dark:text-white/40" /> },
                        { title: "JAVI LLINARES", entity: "DIRECCIÓ I DISSENY", desc: "Responsable de la realització, disseny i coordinació. Mestre darrere del Mas Digital.", path: "/perfil/javi-sa-1", img: "/assets/master/Javi_Llinares-Foto_perfil-1.jpg" }
                    ].map((card, i) => (
                        <NavLink key={i} to={card.path} className="group flex flex-col items-center justify-between p-8 md:p-12 bg-white dark:bg-black border-2 border-gray-100 dark:border-white/5 rounded-[40px] shadow-lg hover:-translate-y-2 transition-all">
                            <div className="w-24 h-24 md:w-28 md:h-28 mb-8 bg-gray-50 dark:bg-white/5 rounded-[32px] flex items-center justify-center border border-gray-200 dark:border-white/10 overflow-hidden group-hover:scale-110 transition-transform">
                                {card.logo && <img src="/assets/master/logo-socdepoble-rect.svg" alt="SDP" className="w-16 h-auto dark:invert opacity-60 group-hover:opacity-100 transition-opacity" />}
                                {card.icon}
                                {card.img && <img src={card.img} alt={card.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />}
                            </div>
                            <div className="text-center space-y-4">
                                <h3 className="text-2xl font-black italic tracking-tighter text-gray-900 dark:text-white uppercase">{card.title}</h3>
                                <p className="text-[10px] font-black text-gray-500 dark:text-white/40 tracking-[0.3em] uppercase">{card.entity}</p>
                                <p className="text-xs md:text-sm font-medium text-gray-600 dark:text-white/60 leading-relaxed">{card.desc}</p>
                            </div>
                        </NavLink>
                    ))}
                </div>
            </div>

            {/* 5. LEGAL TEXT & COOKIES */}
            <div id="avis-legal" className="w-full max-w-[1200px] mx-auto text-gray-700 dark:text-white/70 space-y-24 px-4 pb-20">
                <section className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-1.5 bg-blue-600 dark:bg-primary rounded-full" />
                        <h3 className="text-3xl md:text-5xl font-black italic tracking-tighter text-gray-900 dark:text-white uppercase">1. Identitat Bategant</h3>
                    </div>
                    <p className="text-lg md:text-xl font-medium">LSSI-CE: Responsable Sobirà F. Javier Llinares García (21476359V). El Mas Central es troba registrat a la Calle Sant Isidre Llaurador, 16. Connecta via socdepoble@socdepoble.org.</p>
                </section>
                <section className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-1.5 bg-secondary rounded-full" />
                        <h3 className="text-3xl md:text-5xl font-black italic tracking-tighter text-gray-900 dark:text-white uppercase">2. Sobirania de l'Usuari</h3>
                    </div>
                    <p className="text-lg md:text-xl font-medium">Sols recollim el necessari per al bategat del node: perfil, localització voluntària i memòria social KM 0. Pots descarregar tota la teua memòria digital o fulminar el teu node de forma autònoma enviant un missatge al Mestre. Especialment per als Forasters (Guest Mode), l'experiència és completament efímera: les teues dades desapareixen en eixir del navegador, garantint l'exploració anònima sense raca cap.</p>
                </section>
                <section id="cookies" className="p-8 md:p-12 bg-gray-50 dark:bg-gradient-to-br from-[#080808] to-black rounded-[40px] border border-gray-200 dark:border-white/5 shadow-xl">
                    <h3 className="text-2xl md:text-4xl font-black italic tracking-tighter text-gray-900 dark:text-white uppercase mb-4">3. Política de Cookies</h3>
                    <p className="text-lg md:text-xl font-medium mb-6">"Ací al poble no ens agrada que ningú ens diga què hem d'anar a comprar. Sóc de Poble no utilitza gats vells de Google ni píxels extractius." Utilitzem cookies lliures i anònimes d'auto-hostalatge.</p>
                    <button className="px-6 py-3 bg-gray-200 dark:bg-white/10 text-gray-900 dark:text-white rounded-full text-xs font-black uppercase tracking-widest hover:bg-blue-600 dark:hover:bg-primary hover:text-white transition-all">Gestionar Cookies Anònimes</button>
                </section>
                
                <div className="text-center opacity-40 pt-10">
                    <div className="text-[10px] font-black uppercase tracking-[0.8em]">FI DEL COMUNICAT SOBIRÀ</div>
                    <div className="text-5xl font-black italic tracking-widest mt-2">{new Date().getFullYear()}</div>
                </div>
            </div>

            {/* MODAL FULLSCREEN */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] bg-white/95 dark:bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 md:p-20" onClick={() => setIsModalOpen(false)}>
                    <div className="relative w-full max-w-[800px] aspect-square flex items-center justify-center" onClick={e => e.stopPropagation()}>
                        <img src={infographies[currentSlide].image} alt="Art" className="w-full h-full object-contain rounded-[20px] md:rounded-[40px] shadow-2xl" />
                        <button onClick={prevSlide} className="absolute left-[-20px] md:left-[-60px] p-4 text-gray-400 hover:text-blue-600 dark:hover:text-primary"><ChevronRight size={48} className="rotate-180" /></button>
                        <button onClick={nextSlide} className="absolute right-[-20px] md:right-[-60px] p-4 text-gray-400 hover:text-blue-600 dark:hover:text-primary"><ChevronRight size={48} /></button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WelcomePresentation;

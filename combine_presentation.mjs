/* eslint-disable */
import fs from 'fs';

const projectPresentationPath = './src/pages/ProjectPresentation.jsx';
const welcomePresentationPath = './src/components/WelcomePresentation.jsx';
const iaiaManifestoPath = './src/components/IaiaManifesto.jsx';
const dossierSocisPath = './src/pages/DossierSocis.jsx';

const wpContent = fs.readFileSync(welcomePresentationPath, 'utf8');
const imContent = fs.readFileSync(iaiaManifestoPath, 'utf8');
const dsContent = fs.readFileSync(dossierSocisPath, 'utf8');
const ppContent = fs.readFileSync(projectPresentationPath, 'utf8');

// I will now construct the ultimate monolithic file.
// I will just use the code to read the text and then I'll print it out so I can see what I need to do.
// Actually, it's easier to just write the new file directly.

const newContent = `import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import { 
    ArrowLeft, Rocket, Cpu, Users, Globe, Database, ShieldCheck, 
    TrendingUp, Mail, Briefcase, MessageCircle, Newspaper, BookOpen, 
    Smartphone, UserCheck, Sparkles, Volume2, Headphones, Palette, Zap,
    Share2, UserPlus, Fingerprint, ChevronRight, Award, CheckCircle2,
    Heart, Target, Landmark, Shield, BrainCircuit, Eye, Flame, Search, ShieldAlert, Network, Layers, Server, CheckCircle
} from 'lucide-react';
import { speechService } from '../services/speechService';
import { notebookService } from '../services/notebookService';
import ShareHub from '../components/ShareHub';
import SEO from '../components/SEO';
import NanoSplashScreen from '../components/NanoSplashScreen';
import { logger } from '../utils/logger';
import './ProjectPresentation.css';

const ProjectPresentation = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const jumpToPage = location.state?.jumpToPage;
    const [showIntro, setShowIntro] = useState(true);
    const [techReport, setTechReport] = useState(null);
    const [reportLang, setReportLang] = useState(i18n.language === 'es' ? 'es' : 'ca');
    const shareUrl = \`\${window.location.origin}/projecte\`;

    const [isPlayingAudio, setIsPlayingAudio] = useState(false);
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

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const suffix = reportLang === 'es' ? '_ES' : '';
                const response = await fetch(\`/TECHNICAL_REPORT_VIVO\${suffix}.md\`);
                const text = await response.text();
                setTechReport(text);
            } catch (error) {
                logger.error('Error fetching tech report:', error);
            }
        };
        fetchReport();
    }, [reportLang]);

    const handleAudioOverview = async () => {
        if (isPlayingAudio) {
            window.speechSynthesis.cancel();
            setIsPlayingAudio(false);
            return;
        }

        setIsPlayingAudio(true);
        const script = await notebookService.generateAudioOverview("Sóc de Poble");
        speechService.speak(script, i18n.language === 'es' ? 'es' : 'va');
        setTimeout(() => setIsPlayingAudio(false), 20000);
    };

    if (showIntro) {
        return <NanoSplashScreen onComplete={() => setShowIntro(false)} />;
    }

    return (
        <div className="project-pitch-container">
            <SEO
                title="Sóc de Poble: El Projecte"
                description="Connectant l'Espanya Buidada amb tecnologia d'avantguarda. Visió, Tecnologia i Futur."
                image="/og-project.png"
                url="/projecte"
            />

            <nav className="pitch-nav compact-nav">
                <button className="nav-btn-large primary" onClick={() => navigate('/chats')}>
                    <MessageCircle size={24} />
                    <span>Anar al Xat</span>
                </button>
                <div className="pitch-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                    <img src="/logo.png" alt="Sóc de Poble" style={{ height: '32px', filter: 'drop-shadow(0 0 10px rgba(0, 242, 255, 0.4))' }} />
                </div>
                <div className="nav-actions-right">
                    <ShareHub
                        title="Sóc de Poble: El Projecte"
                        text="Descobreix com estem connectant l'essència rural amb el futur digital. 🚀"
                        url={shareUrl}
                    />
                    <button className="nav-btn-large secondary" onClick={() => navigate(-1)}>
                        <ArrowLeft size={24} />
                        <span>Tornar</span>
                    </button>
                </div>
            </nav>

            <header className="pitch-hero cinematic-hero" style={{ backgroundImage: \`linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.9)), url('/rural_tech_future_valencia.png')\`, backgroundSize: 'cover', backgroundPosition: 'center', marginTop: '60px' }}>
                <div className="hero-content">
                    <div className="hero-badge-premium">
                        <Rocket size={16} />
                        <span>SOBIRANIA DIGITAL & MEMÒRIA VIVA</span>
                    </div>
                    <h1>Connectant l'Essència Rural<br />amb el Futur Digital</h1>
                    <p className="hero-subtitle">
                        La plataforma que revitalitza el teixit social i econòmic dels nostres pobles mitjançant el control sobirà de les dades.
                    </p>
                    <div className="hero-stats premium-stats">
                        <div className="stat-item-glass"><span className="stat-number">Local-First</span><span className="stat-label">Arquitectura</span></div>
                        <div className="stat-item-glass"><span className="stat-number">Byzantine</span><span className="stat-label">Resiliència</span></div>
                        <div className="stat-item-glass"><span className="stat-number">Atum</span><span className="stat-label">Protocol</span></div>
                    </div>
                    <div className="hero-actions-sovereign">
                        <button className={\`btn-audio-overview \${isPlayingAudio ? 'playing' : ''}\`} onClick={handleAudioOverview}>
                            {isPlayingAudio ? <Headphones size={20} /> : <Volume2 size={20} />}
                            <span>{isPlayingAudio ? "Escoltant Resum..." : "Audio Overview (IAIA & Avi)"}</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* WELCOME CONTENT MONOLITH */}
            <div className="relative w-full max-w-none mx-auto px-4 md:px-8 py-12 md:py-24 animate-in fade-in duration-1000 overflow-x-hidden" style={{ background: 'var(--bg-panel)' }}>
                <div className="text-center mb-12 md:mb-16 px-2">
                    <h1 className="text-5xl md:text-[90px] lg:text-[120px] font-black italic tracking-tighter uppercase leading-[0.85] mb-6 drop-shadow-xl relative inline-block">
                        SÓC DE POBLE
                    </h1>
                    <h2 className="text-2xl md:text-5xl font-black italic mb-8 md:mb-12 tracking-tight" style={{ color: 'var(--color-primary)' }}>
                        Portal de Pobles Connectats
                    </h2>
                    <p className="text-sm md:text-xl font-bold max-w-3xl mx-auto leading-relaxed mb-12 md:mb-16">
                        Una <span className="font-black uppercase" style={{ color: 'var(--color-primary)' }}>XARXA SOCIAL DESCENTRALITZADA</span> de PROGRAMARI LLIURE, per CONNECTAR i GEOLOCALITZAR recursos d’utilitat social, compartint informació, experiències i idees que faciliten el desenvolupament sostenible i tecnològic en entorns rurals, per posar en valor els recursos locals i mostrar l’atractiu dels pobles com a llocs on viure i treballar.
                    </p>
                </div>

                {/* INFOGRAPHIC CAROUSEL */}
                <div className="mb-20 md:mb-24 relative px-2">
                    <div className="relative flex items-center justify-center w-full max-w-[950px] mx-auto">
                        <button onClick={(e) => { e.stopPropagation(); prevSlide(); }} className="absolute left-0 z-30 p-2 md:p-6 bg-black/90 backdrop-blur-md border border-white/10 rounded-full text-white hover:text-primary transition-all shadow-xl active:scale-90">
                            <ChevronRight size={28} strokeWidth={3} className="rotate-180" />
                        </button>
                        <div className="relative aspect-square w-full bg-black rounded-[32px] md:rounded-[48px] overflow-hidden shadow-2xl md:shadow-[0_80px_120px_rgba(0,0,0,0.3)] cursor-pointer group/main border border-white/5" onClick={() => setIsModalOpen(true)} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
                            <div className="absolute inset-0 flex items-center justify-center transition-transform duration-1000 group-hover/main:scale-105">
                                <img src={infographies[currentSlide].image} alt={infographies[currentSlide].title} className="w-full h-full object-cover" />
                            </div>
                            <div className="absolute top-6 md:top-12 inset-x-0 flex justify-center z-20 pointer-events-none group-hover/main:-translate-y-2 transition-transform duration-500">
                                <div className="text-[10px] sm:text-xs font-black text-primary uppercase tracking-[0.4em] md:tracking-[0.6em] drop-shadow-md bg-black/50 px-4 py-1 rounded-full backdrop-blur-sm">
                                    {infographies[currentSlide].title}
                                </div>
                            </div>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); nextSlide(); }} className="absolute right-0 z-30 p-2 md:p-6 bg-black/90 backdrop-blur-md border border-white/10 rounded-full text-white hover:text-primary transition-all shadow-xl active:scale-90">
                            <ChevronRight size={28} strokeWidth={3} />
                        </button>
                    </div>
                    <div className="mt-8 md:mt-12 w-full max-w-[950px] mx-auto p-6 md:p-12 bg-white/[0.03] rounded-[32px] md:rounded-[40px] border border-white/5 backdrop-blur-md transition-all hover:border-primary/20">
                        <h4 className="text-2xl md:text-4xl font-black italic tracking-tighter uppercase mb-4">{infographies[currentSlide].title}</h4>
                        <p className="text-sm md:text-xl font-bold leading-relaxed">{infographies[currentSlide].desc}</p>
                    </div>
                </div>

                {/* LLICÈNCIA OBERTA */}
                <div className="w-full max-w-[1200px] mx-auto mb-20 md:mb-24 px-2 lg:px-0">
                    <div className="relative group perspective-1000">
                        <div className="relative bg-[#0a0a0a] border-4 border-primary/30 rounded-[32px] md:rounded-[50px] p-8 md:p-16 shadow-2xl overflow-hidden transition-all">
                            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 relative z-10">
                                <div className="p-6 md:p-10 bg-primary/10 rounded-[32px] border-2 border-primary/40 text-primary shrink-0 transition-transform">
                                    <CheckCircle2 size={64} className="md:w-[80px] md:h-[80px]" strokeWidth={2.5} />
                                </div>
                                <div className="space-y-6 text-center md:text-left flex-1">
                                    <h2 className="text-4xl md:text-7xl font-black italic tracking-tighter uppercase text-primary leading-none">LLICÈNCIA OBERTA</h2>
                                    <p className="text-lg md:text-2xl font-bold leading-tight">Aquest sistema és de codi obert per a ús comunitari i educatiu. L'ús comercial està subjecte a llicència del Mestre.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* IDENTITATS DEL MAS */}
                <div className="w-full max-w-[1400px] mx-auto mb-24 md:mb-40 space-y-12 md:space-y-16 px-2">
                    <div className="flex items-center gap-4 md:gap-8 opacity-40">
                        <div className="flex-1 h-px bg-white/20" />
                        <span className="text-[10px] md:text-[12px] font-black tracking-[0.4em] md:tracking-[0.8em] uppercase">IDENTITATS DEL MAS</span>
                        <div className="flex-1 h-px bg-white/20" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                        {[
                            { title: "SÓC DE POBLE", entity: "PROJECTE SOCIAL", desc: "Plataforma bategant per a la memòria viva i la governança d'un territori sobirà." },
                            { title: "EL RENTONAR", entity: "AGRUPACIÓ ECOLOGISTA", desc: "Entitat que promou i empara aquest projecte des de la resistència cultural." },
                            { title: "JAVI LLINARES", entity: "DIRECCIÓ I DISSENY", desc: "Responsable de la realització, disseny i coordinació. Mestre darrere del Mas Digital." }
                        ].map((card, i) => (
                            <div key={i} className="group flex flex-col items-center justify-between p-8 md:p-12 bg-black border-2 border-white/5 rounded-[40px] shadow-lg transition-all">
                                <div className="text-center space-y-4">
                                    <h3 className="text-2xl font-black italic tracking-tighter uppercase">{card.title}</h3>
                                    <p className="text-[10px] font-black tracking-[0.3em] uppercase opacity-70">{card.entity}</p>
                                    <p className="text-xs md:text-sm font-medium leading-relaxed opacity-90">{card.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* IAIA MANIFESTO */}
                <div className="text-center mb-20 space-y-6 pt-16 border-t border-white/10">
                    <div className="inline-flex items-center justify-center p-4 bg-white/5 rounded-full border border-white/10 mb-6 shadow-xl">
                        <BrainCircuit size={48} className="text-primary animate-pulse" />
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase">LA IAIA <span className="text-primary">MARIA</span></h2>
                    <p className="text-lg md:text-2xl font-bold opacity-70 max-w-3xl mx-auto">La intel·ligència central del Mas. No és una IA freda de Silicon Valley, sinó la "saviesa de l'àvia" arrelada a la terra. Un sistema multi-agent dissenyat per a protegir, educar i preservar la identitat rural.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24 max-w-[1200px] mx-auto">
                    {[
                        { title: "LA TIA MARIA", icon: <Flame size={32}/>, desc: "Agent de proximitat. Ofereix receptes locals, consells vitals i conversa arrelada." },
                        { title: "EL CRONISTA", icon: <BookOpen size={32}/>, desc: "Documentalista del Mur. Genera resums de l'activitat del poble i preserva l'hemeroteca." },
                        { title: "L'ULL DEL MESTRE", icon: <Eye size={32}/>, desc: "Visió multimodal. Identifica eines agrícoles, plantes, plagues i patrimoni cultural." },
                        { title: "NANO BANANA", icon: <Globe size={32}/>, desc: "Generació multimèdia automàtica i protocols de simbiosi artística a la comunitat." },
                        { title: "RÚPER RATÓN", icon: <Search size={32}/>, desc: "Motor de super-cerca semàntica. Analitza PDF, bans municipals i actes històriques." },
                        { title: "FILTRE TRELLAT", icon: <ShieldAlert size={32}/>, desc: "Triple nucli que regula la presència de la IA per garantir el sentit comú local." }
                    ].map((agent, i) => (
                        <div key={i} className="group p-8 bg-[#0a0a0a] border border-white/5 rounded-[32px] shadow-lg">
                            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">{agent.icon}</div>
                            <h3 className="text-xl font-black italic uppercase tracking-widest mb-3">{agent.title}</h3>
                            <p className="text-sm font-medium opacity-70 leading-relaxed">{agent.desc}</p>
                        </div>
                    ))}
                </div>

                {/* DOSSIER SOCIS ARQUITECTURA */}
                <div className="pt-16 border-t border-white/10 max-w-[1200px] mx-auto">
                    <h2 className="text-4xl font-black uppercase tracking-tighter italic mb-8"><Database size={32} className="inline mr-4"/> Arquitectura Revolucionària</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                        <div className="p-8 bg-[#0a0a0a] rounded-[24px]">
                            <Layers className="text-primary mb-4" size={32}/>
                            <h3 className="text-2xl font-black mb-2">Eg-walker CRDT</h3>
                            <p className="opacity-80">Sincronització de graf d'esdeveniments. Convergència determinista en local que elimina la necessitat de base de dades central.</p>
                        </div>
                        <div className="p-8 bg-[#0a0a0a] rounded-[24px]">
                            <Zap className="text-primary mb-4" size={32}/>
                            <h3 className="text-2xl font-black mb-2">Xarxa Rhizome</h3>
                            <p className="opacity-80">Protocol gossip. Els telèfons dels veïns formen la malla de comunicació, reduint la dependència del núvol al mínim.</p>
                        </div>
                        <div className="p-8 bg-[#0a0a0a] rounded-[24px]">
                            <Smartphone className="text-primary mb-4" size={32}/>
                            <h3 className="text-2xl font-black mb-2">Local-First</h3>
                            <p className="opacity-80">L'usuari és el propietari de les seues dades. Càrrega instantània des de IndexedDB. Funciona sense cobertura.</p>
                        </div>
                    </div>

                    <h2 className="text-4xl font-black uppercase tracking-tighter italic mb-8"><TrendingUp size={32} className="inline mr-4"/> Model de Negoci Híbrid</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                        <div className="p-8 bg-[#0a0a0a] border border-blue-500/20 rounded-[24px]">
                            <h3 className="text-2xl font-black mb-4">"El Secretari" (Model B2G)</h3>
                            <p className="opacity-80 mb-4">Subscripció mestre per a Ajuntaments que automatitza la gestió pública rural.</p>
                            <ul className="space-y-2 opacity-90">
                                <li><CheckCircle size={16} className="inline text-blue-400 mr-2"/> Automatització de Bàndols</li>
                                <li><CheckCircle size={16} className="inline text-blue-400 mr-2"/> Digitalització de Patrimoni</li>
                                <li><CheckCircle size={16} className="inline text-blue-400 mr-2"/> Canal Blindat</li>
                            </ul>
                        </div>
                        <div className="p-8 bg-[#0a0a0a] border border-orange-500/20 rounded-[24px]">
                            <h3 className="text-2xl font-black mb-4">"Essències" (Model B2B)</h3>
                            <p className="opacity-80 mb-4">Monetització de l'economia local sense intermediaris (Km 0).</p>
                            <ul className="space-y-2 opacity-90">
                                <li><CheckCircle size={16} className="inline text-orange-400 mr-2"/> Subscripció Premium (productors)</li>
                                <li><CheckCircle size={16} className="inline text-orange-400 mr-2"/> Turisme Experiencial</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* FINANÇAMENT SECTOR */}
                <div id="financament" className="w-full max-w-[1400px] mx-auto mb-20 md:mb-24 px-2 pt-16 border-t border-white/10">
                    <section className="max-w-4xl mx-auto text-center mb-16 px-4">
                        <h2 className="text-4xl lg:text-5xl font-black mb-6 leading-tight uppercase tracking-tighter italic">
                            Un projecte lliure necessita un model de negoci <span className="text-primary">transparent i arrelat</span>.
                        </h2>
                        <p className="text-xl md:text-2xl opacity-80 leading-relaxed font-bold mb-12">
                            "Sóc de Poble" no ven dades. No bateguem per a grans corporacions. 
                            Bateguem perquè el territori tinga la seua pròpia veu, finançada per la comunitat.
                        </p>
                    </section>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[1200px] mx-auto mb-16 px-4">
                        {[
                            { title: "Clients PRO & Sobirania", icon: <Shield size={40} className="text-orange-500" />, bg: "bg-orange-500/20", desc: "Subscripcions per a pobles, ajuntaments i entitats que volen governar.", feat: ["Domini propi", "Suport prioritari", "Eines de gestió"] },
                            { title: "Patrocini Km 0", icon: <Heart size={40} className="text-rose-500" />, bg: "bg-rose-500/20", desc: "Empreses del territori que bateguen amb nosaltres. Publicitat ètica.", feat: ["Presència al Mercat", "Confiança Rural", "Col·laboracions"] },
                            { title: "Anunciants Ètics", icon: <Target size={40} className="text-indigo-500" />, bg: "bg-indigo-500/20", desc: "Espais reservats per a marques que aporten valor real al món rural.", feat: ["Audiència", "Integració al Feed", "Sense trackers"] }
                        ].map((sec, idx) => (
                            <div key={idx} className="bg-white/[0.02] border border-white/10 p-8 md:p-10 rounded-[40px] shadow-xl">
                                <div className={\`w-20 h-20 \${sec.bg} rounded-[32px] flex items-center justify-center mb-8\`}>{sec.icon}</div>
                                <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter italic mb-4">{sec.title}</h3>
                                <p className="text-lg opacity-70 mb-8 font-bold">{sec.desc}</p>
                                <ul className="space-y-4 mb-8">
                                    {sec.feat.map((f, i) => (
                                        <li key={i} className="flex items-start gap-3 text-xs font-black uppercase tracking-[0.2em] text-primary">
                                            <span>{f}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* LEGAL TEXT & COOKIES */}
                <div id="avis-legal" className="w-full max-w-[1200px] mx-auto space-y-24 px-4 pb-20 pt-16 border-t border-white/10">
                    <section className="space-y-6">
                        <div className="flex items-center gap-4">
                            <h3 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase">1. Identitat Bategant</h3>
                        </div>
                        <p className="text-lg md:text-xl font-medium">LSSI-CE: Responsable Sobirà F. Javier Llinares García (21476359V). El Mas Central es troba registrat a la Calle Sant Isidre Llaurador, 16. Connecta via socdepoble@socdepoble.org.</p>
                    </section>
                    <section className="space-y-6">
                        <div className="flex items-center gap-4">
                            <h3 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase">2. Sobirania de l'Usuari</h3>
                        </div>
                        <p className="text-lg md:text-xl font-medium">Sols recollim el necessari per al bategat del node: perfil, localització voluntària i memòria social KM 0. Pots descarregar tota la teua memòria digital o fulminar el teu node de forma autònoma enviant un missatge al Mestre. Especialment per als Forasters (Guest Mode), l'experiència és completament efímera: les teues dades desapareixen en eixir del navegador, garantint l'exploració anònima sense rastre cap.</p>
                    </section>
                    <section id="cookies" className="p-8 md:p-12 bg-gradient-to-br from-[#080808] to-black rounded-[40px] border border-white/5 shadow-xl">
                        <h3 className="text-2xl md:text-4xl font-black italic tracking-tighter uppercase mb-4">3. Política de Cookies</h3>
                        <p className="text-lg md:text-xl font-medium mb-6">"Ací al poble no ens agrada que ningú ens diga què hem d'anar a comprar. Sóc de Poble no utilitza gats vells de Google ni píxels extractius." Utilitzem cookies lliures i anònimes d'auto-hostalatge.</p>
                    </section>
                </div>

            </div>

            <section className="pitch-footer compact-footer">
                <h2>Uneix-te a la Revolució</h2>
                <button className="btn-primary-large" onClick={() => navigate('/registre')}>
                    Bategar Ara
                </button>
            </section>
            
            {/* Modal Infografies */}
            {isModalOpen && (
                <div className="fixed inset-0 z-dropdown bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 md:p-20" onClick={() => setIsModalOpen(false)}>
                    <div className="relative w-full max-w-[800px] aspect-square flex items-center justify-center" onClick={e => e.stopPropagation()}>
                        <img src={infographies[currentSlide].image} alt="Art" className="w-full h-full object-contain rounded-[20px] md:rounded-[40px] shadow-2xl" />
                        <button onClick={prevSlide} className="absolute left-[-20px] md:left-[-60px] p-4 text-gray-400 hover:text-primary"><ChevronRight size={48} className="rotate-180" /></button>
                        <button onClick={nextSlide} className="absolute right-[-20px] md:right-[-60px] p-4 text-gray-400 hover:text-primary"><ChevronRight size={48} /></button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectPresentation;
\`;

fs.writeFileSync(projectPresentationPath, newContent);
console.log('Successfully constructed ProjectPresentation.jsx the requested way!');

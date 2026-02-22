import React from 'react';
import { 
    Heart, Target, Users, Zap, 
    TrendingUp, Shield, Globe, 
    ArrowLeft, ExternalLink, Mail,
    CreditCard, BadgeCheck, Sparkles,
    Handshake, Wallet, Landmark
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './HubView.css'; // Reutilitzem els estils bategats del Hub per a coherència

const Financament = () => {
    const navigate = useNavigate();

    const sections = [
        {
            title: "Clients PRO & Sobirania",
            icon: Shield,
            color: "text-orange-500",
            bg: "bg-orange-500/10",
            description: "Subscripcions per a pobles, ajuntaments i entitats que volen governar la seua pròpia xarxa sense algoritmes externs.",
            features: ["Domini propi", "Suport prioritari de l'IAIA", "Eines de gestió avançada"]
        },
        {
            title: "Patrocini Km 0",
            icon: Heart,
            color: "text-rose-500",
            bg: "bg-rose-500/10",
            description: "Empreses del territori que bateguen amb nosaltres. Publicitat no invasiva, ètica i centrada en la proximitat.",
            features: ["Presència al Mercat", "Segell de Confiança Rural", "Col·laboracions bategades"]
        },
        {
            title: "Anunciants Ètics",
            icon: Target,
            color: "text-indigo-500",
            bg: "bg-indigo-500/10",
            description: "Espais reservats per a marques que aporten valor real al món rural, defugint el soroll i el 'clickbait'.",
            features: ["Audiència segmentada", "Integració orgànica al Feed", "Sense trackers brossa"]
        }
    ];

    return (
        <div className="hub-view-container min-h-screen bg-black text-white p-6 lg:p-12 animate-in fade-in duration-700">
            {/* HEADER */}
            <header className="hub-header flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
                <div className="flex items-center gap-6">
                    <button 
                        onClick={() => navigate('/hub')} 
                        className="w-14 h-14 flex items-center justify-center bg-white/5 rounded-full hover:bg-white/10 transition-all active:scale-95 border border-white/10"
                    >
                        <ArrowLeft size={28} />
                    </button>
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-sm font-black uppercase tracking-[0.4em] text-orange-500">Sostenibilitat</span>
                            <div className="h-[2px] w-12 bg-orange-500/50"></div>
                        </div>
                        <h1 className="text-4xl lg:text-6xl font-black uppercase tracking-tighter leading-none italic">
                            Finançament <span className="text-orange-500">Sobirà</span>
                        </h1>
                    </div>
                </div>
            </header>

            {/* HERO PHILOSOPHY */}
            <section className="max-w-4xl mx-auto text-center mb-24">
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500/20 border border-orange-500/40 rounded-full text-orange-400 text-xs font-black uppercase tracking-widest mb-10">
                    <Sparkles size={16} /> El Trellat de la Independència
                </div>
                <h2 className="text-5xl lg:text-7xl font-black mb-10 leading-tight uppercase tracking-tighter italic">
                    Un projecte lliure necessita un model de negoci <span className="text-indigo-400">transparent i arrelat</span>.
                </h2>
                <p className="text-3xl text-white leading-relaxed font-black mb-12">
                    "Sóc de Poble" no ven dades. No bateguem per a grans corporacions. 
                    Bateguem perquè el territori tinga la seua pròpia veu, finançada per la comunitat i per aquells que creuen en el km 0 digital.
                </p>
            </section>

            {/* OPTIONS GRID - [ROBUSTESA v1.0] Stacks earlier to avoid narrow frames */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-screen-2xl mx-auto mb-24 px-4">
                {sections.map((section, idx) => (
                    <div key={idx} className="bg-white/[0.03] border border-white/10 p-10 rounded-[48px] hover:bg-white/[0.07] transition-all group flex flex-col min-h-[500px] shadow-2xl relative overflow-hidden">
                        {/* Background subtle decoration to fill space */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl -mr-16 -mt-16 pointer-events-none group-hover:bg-indigo-500/10 transition-colors" />
                        
                        <div className={`w-20 h-20 ${section.bg} ${section.color} rounded-[32px] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-inner`}>
                            <section.icon size={40} />
                        </div>
                        <h3 className="text-4xl font-black uppercase tracking-tighter italic mb-6 leading-none">{section.title}</h3>
                        <p className="text-2xl text-white mb-10 flex-1 leading-relaxed font-bold break-words">{section.description}</p>
                        <ul className="space-y-6 mb-12">
                            {section.features.map((f, i) => (
                                <li key={i} className="flex items-start gap-4 text-sm font-black uppercase tracking-[0.25em] text-indigo-300">
                                    <div className="w-3 h-3 bg-indigo-500 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.7)] mt-1 shrink-0" />
                                    <span className="leading-tight">{f}</span>
                                </li>
                            ))}
                        </ul>
                        <button className="w-full h-20 bg-white/10 border-2 border-white/20 hover:bg-white hover:text-black rounded-[28px] font-black uppercase text-xl tracking-widest transition-all shadow-2xl active:scale-95">
                            Saber-ne més
                        </button>
                    </div>
                ))}
            </div>

            {/* INSTITUTIONAL / MASTER AREA */}
            <section className="max-w-7xl mx-auto mb-24">
                <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-[40px] p-8 md:p-12 flex flex-col md:flex-row items-center gap-12 border-dashed">
                    <div className="w-24 h-24 bg-indigo-500 text-white rounded-[28px] flex items-center justify-center shadow-[0_0_30px_rgba(79,70,229,0.5)] shrink-0">
                        <Landmark size={48} />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-6xl font-black uppercase tracking-tighter italic mb-8">Inversió i <span className="text-indigo-400">Patrimoni Rural</span></h2>
                        <p className="text-3xl text-white leading-relaxed font-black">
                            Busquem aliats institucionals i inversors que no busquen només rendibilitat financera, sinó impacte social i resiliència territorial. 
                            Participa en la construcció de la infraestructura digital més important del Mas.
                        </p>
                    </div>
                    <a href="mailto:hola@socdepoble.org" className="bg-white text-black px-12 py-6 rounded-[32px] font-black uppercase tracking-widest text-2xl transition-all active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.2)] flex items-center gap-4">
                        <Mail size={32} /> Contactar amb el Mas
                    </a>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="hub-footer flex flex-col items-center pt-16 border-t border-white/10 gap-8 text-center pb-24">
                <p className="text-gray-400 font-black text-sm tracking-widest uppercase max-w-xl leading-relaxed">
                    Tot el finançament es reinverteix directament en mantenir la matriu lliure i el sistema operatiu rural en creixement constant.
                </p>
            </footer>
        </div>
    );
};

export default Financament;

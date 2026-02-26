import React, { useState, useEffect } from 'react';
import { 
    X, MessageCircle, Gamepad2, BrainCircuit, Sparkles, ChevronRight, Zap, 
    CloudSun, BookText, Quote, Users, History, Mic, Search, Sun, Moon
} from 'lucide-react';
import './RoleSelectorModal.css';

const RoleSelectorModal = ({ isOpen, onClose, onSelect }) => {
    const [generating, setGenerating] = useState(null);

    const [greeting, setGreeting] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    // Lògica de Cerca Màgica (Smart Search) v8.0
    const handleSearch = (q) => {
        setSearchQuery(q);
        // Aquí es podria afegir lògica de filtrat o routing automàtic
    };
    useEffect(() => {
        if (isOpen) {
            const greetingsList = [
                "Bon dia, bategat. Com t'ajude hui?",
                "Benvingut al cor del poble. Què busques?",
                "Escolta el batec... tria el teu camí.",
                "La memòria està activa. Com interactuem?",
                "Pura saviesa de l'arca. Digues ràpid!",
                "Vols raonar una estona a la fresca?"
            ];
            const randomMsg = greetingsList[Math.floor(Math.random() * greetingsList.length)];
            const timer = setTimeout(() => {
                setGreeting(randomMsg);
            }, 100);
            return () => clearTimeout(timer);
        } else {
            const timer = setTimeout(() => {
                setGreeting("");
            }, 10);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const roles = [
        { 
            id: 'iaia_master', 
            title: 'IAIA MarIA', 
            desc: 'Matriarca Digital. Saviesa i sentit comú per al dia a dia.', 
            avatar: '/assets/avatars/comic/iaia_comic_matriarch.png', 
            color: '#ff9800', 
            route: '/chats', 
            benefit: 'Guia Suprema' 
        },
        { 
            id: 'agronom', 
            title: 'VICENT FERRIS', 
            desc: 'Agrònom. El tacte de la terra i el saber de l\'olivera.', 
            avatar: '/images/demo/avatar_antoni.png', 
            color: '#4CAF50', 
            route: '/chats', 
            benefit: 'Saviesa de la Terra' 
        },
        { 
            id: 'cuinera', 
            title: 'PEPICA LA VALL', 
            desc: 'Cuinera. Guardiana de receptes i l\'escalfor del xup-xup.', 
            avatar: '/images/demo/avatar_carmen.png', 
            color: '#EF4444', 
            route: '/chats', 
            benefit: 'Gastronomia i Vida' 
        },
        { 
            id: 'capatas', 
            title: 'ANDREU DEL CAMP', 
            desc: 'Capatàs. El rellotge i la llei del camp amb trellat.', 
            avatar: '/images/demo/avatar_vicent.png', 
            color: '#8E8E93', 
            route: '/chats', 
            benefit: 'Eficiència Rural' 
        },
        { 
            id: 'arxiver', 
            title: 'JOAN DEL POBLE', 
            desc: 'Arxiver. Memòria de papers i traducció del carrer.', 
            avatar: '/images/demo/avatar_joanet.png', 
            color: '#5D5FEF', 
            route: '/chats', 
            benefit: 'Memòria Viva' 
        },
        { 
            id: 'ratoli', 
            title: 'SUPER RATOLÍ', 
            desc: 'Dades i SQLite. ¡Vitaminar-se i superar-se!', 
            avatar: '/assets/avatars/super_ratoli.png', 
            color: '#FFEB3B', 
            route: '/chats', 
            benefit: 'Heroi Digital' 
        },
        { 
            id: 'nanob', 
            title: 'NANO BANANA', 
            desc: 'Aventura i Art. Agent de felicitat i abundància bategant.', 
            avatar: '/assets/avatars/nano_banana.png', 
            color: '#00d2ff', 
            route: '/chats', 
            benefit: 'RPG Narratiu' 
        },
        { 
            id: 'sultan', 
            title: 'SULTAN', 
            desc: 'Seguretat Rural. El guardià que mai dorm.', 
            avatar: '/images/demo/avatar_samir.png', 
            color: '#795548', 
            route: '/chats', 
            benefit: 'Seguretat de Node' 
        },
        { 
            id: 'mixa', 
            title: 'LA MIXA', 
            desc: 'Gata de Xarxa. Missatgera P2P entre les teulades.', 
            avatar: '/images/demo/avatar_maria.png', 
            color: '#E91E63', 
            route: '/chats', 
            benefit: 'Connexion Invisible' 
        },
        { 
            id: 'gall', 
            title: 'EL GALL', 
            desc: 'Alertes. El bategat de l\'emergència i l\'inici del dia.', 
            avatar: '/assets/avatars/comic/avatar_marc_comic.png', 
            color: '#FF5722', 
            route: '/chats', 
            benefit: 'Vigilant d\'Emergència' 
        },
        { 
            id: 'flash', 
            title: 'FLASH', 
            desc: 'Executor. Orquestrador de processos a tot bategat.', 
            avatar: '/assets/avatars/iaia_secretary.png', 
            color: '#06B6D4', 
            route: '/chats', 
            benefit: 'Velocitat Pura' 
        },
        { 
            id: 'viatjant', 
            title: 'EL VIATJANT', 
            desc: 'Ambaixador. El Tio de la Bota connectant pobles.', 
            avatar: '/assets/avatars/iaia_memory.png', 
            color: '#9C27B0', 
            route: '/chats', 
            benefit: 'Històries de Node' 
        }
    ];


    const handleSelect = (role) => {
        setGenerating(role.id);
        setTimeout(() => {
            onSelect(role);
            setGenerating(null);
        }, 1200);
    };

    return (
        <div className="role-modal-overlay" onClick={onClose}>
            <div className="role-modal-content command-center" onClick={(event) => { 
                                    event.stopPropagation();
                                }}
>
                <header className="role-modal-header v8-header">
                    <div className="v8-header-left">
                        <img src="https://raw.githubusercontent.com/iaia-maria/socdepoble-assets/main/logo-soc-de-poble-white.png" alt="Logo" className="v8-modal-logo" />
                    </div>
                    
                    <div className="v8-header-right">
                        <button className="theme-toggle-v8" onClick={() => document.body.classList.toggle('light-mode')}>
                            <Sun size={18} className="sun-icon" />
                            <Moon size={18} className="moon-icon" />
                        </button>
                        <button className="role-modal-close-v8" onClick={onClose}><X size={24} /></button>
                    </div>
                </header>

                <div className="role-modal-body">
                    {/* SMART SEARCH v8.0 */}
                    <div className="magic-search-container">
                        <div className="magic-search-wrapper">
                            <Search className="magic-search-icon" size={20} />
                            <label htmlFor="magic-search-input" className="sr-only">Cercar a la IAIA...</label>
                            <input 
                                id="magic-search-input"
                                name="magic_search_input"
                                type="text" 
                                placeholder="Diu-li a la IAIA... (Ex: 'Tinc fam', 'Què vol dir bategar?')" 
                                className="magic-search-input"
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                            <div className={`magic-sparkle ${searchQuery ? 'active' : ''}`}>✨</div>
                        </div>
                    </div>

                    <div className="iaia-contextual-greeting">
                        <div className="iaia-avatar-mini">
                            <img src="/assets/avatars/comic/iaia_comic_matriarch.png" alt="IAIA" />
                            <div className="online-indicator"></div>
                        </div>
                        <p className="greeting-text">"{greeting}"</p>
                    </div>
                    
                    <div className="role-options-list">
                        {roles.map(role => (
                            <button 
                                key={role.id}
                                className={`role-option-card-v5 ${generating === role.id ? 'generating' : ''}`}
                                onClick={() => handleSelect(role)}
                                disabled={!!generating}
                            >
                                <div className="role-card-inner">
                                    <div className="role-icon-box-v5" style={{ background: role.color + '15', color: role.color, padding: 0, overflow: 'hidden' }}>
                                        {generating === role.id ? (
                                            <div className="spinner-v5" />
                                        ) : (
                                            <img 
                                                src={role.avatar} 
                                                alt={role.title} 
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                            />
                                        )}
                                    </div>
                                    <div className="role-info">
                                        <h3>{role.title}</h3>
                                        <p>{role.desc}</p>
                                        <div className="role-benefit-tag">
                                            <Zap size={10} /> {role.benefit}
                                        </div>
                                    </div>
                                    {generating !== role.id && <ChevronRight size={24} className="role-arrow-v5" />}
                                </div>
                                {generating === role.id && (
                                    <div className="generating-overlay">
                                        <span>Generant pròleg narratiu...</span>
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="role-modal-footer v6-footer">
                    <div className="v6-stats-pills">
                        <span className="v6-pill">12 AGENTS</span>
                        <span className="v6-pill">IA ACTIVA</span>
                        <span className="v6-pill">DIA/NIT OK</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoleSelectorModal;

import React, { useState, useEffect } from 'react';
import { 
    X, MessageCircle, Gamepad2, BrainCircuit, Sparkles, ChevronRight, Zap, 
    CloudSun, BookText, Quote, Users, History, Mic
} from 'lucide-react';
import './RoleSelectorModal.css';

const RoleSelectorModal = ({ isOpen, onClose, onSelect }) => {
    const [generating, setGenerating] = useState(null);

    const [greeting, setGreeting] = useState("");

    // Initialize greeting when opening
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
            setGreeting(randomMsg);
        } else {
            setGreeting("");
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const roles = [
        {
            id: 'iaia_memoria',
            title: 'AGENT DE MEMÒRIA',
            desc: 'La IAIA et recorda el rellevant: des del reg fins a la pastilla.',
            icon: <Sparkles size={24} />,
            color: '#ff9800',
            route: '/chats',
            benefit: 'Assistència Proactiva: "No oblides regar!"'
        },
        {
            id: 'iaia_aventura',
            title: 'AVENTURA RURAL (RPG)',
            desc: 'Viu la mitologia rural. Genera un pròleg narratiu únic al teu poble.',
            icon: <Gamepad2 size={24} />,
            color: '#00d2ff',
            route: '/chats',
            benefit: 'Seeds Narratives Úniques'
        },
        {
            id: 'iaia_oracle',
            title: 'L\'ORACLE DE L\'OLLA',
            desc: 'La mística del destí. Rep una dita o sentència mística a l\'instant.',
            icon: <Quote size={24} />,
            color: '#D441E5',
            route: '/tools/oracle',
            benefit: 'La dita del dia sense preguntes'
        },
        {
            id: 'iaia_diccionari',
            title: 'EL DICCIONARI RURAL',
            desc: 'Traductor de conceptes moderns (Bitcoin, AI) a llenguatge de garrofes.',
            icon: <BookText size={24} />,
            color: '#FF6D23',
            route: '/tools/diccionari',
            benefit: 'Traductor de sentit comú'
        },
        {
            id: 'iaia_fresca',
            title: 'LA FRESCA (TERTÚLIA)',
            desc: 'Debat de plaça. La IAIA opina de tot amb fermesa i saviesa popular.',
            icon: <Users size={24} />,
            color: '#00BA88',
            route: '/chats',
            benefit: 'Debat social sobirà'
        },
        {
            id: 'iaia_glosadora',
            title: 'LA GLOSADORA (POETA)',
            desc: 'L\'art de la paraula. Crea rimes satíriques o versos per a qualsevol ocasió.',
            icon: <Mic size={24} />,
            color: '#EF4444',
            route: '/chats',
            benefit: 'Poesia i Sàtira instantània'
        },
        {
            id: 'iaia_meteo',
            title: 'METEO RURAL',
            desc: 'Previsió basada en observació i refranyer: "Si nùvol porta barret..."',
            icon: <CloudSun size={24} />,
            color: '#5D5FEF',
            route: '/chats',
            benefit: 'Predicció de camp expert'
        },
        {
            id: 'iaia_arxiu',
            title: 'ARXIU SECRET',
            desc: 'Història local i lore familiar. Descobreix el que va passar l\'any que triis.',
            icon: <History size={24} />,
            color: '#8E8E93',
            route: '/chats',
            benefit: 'Viatge al passat del poble'
        },
        {
            id: 'iaia_analisis',
            title: 'INTEL·LIGÈNCIA RURAL',
            desc: 'Dades massives amb saviesa de l\'arca. Utilitat social pura per decidir.',
            icon: <BrainCircuit size={24} />,
            color: '#4CAF50',
            route: '/ia',
            benefit: 'Sobirania territorial de dades'
        },
        {
            id: 'iaia_batec',
            title: 'BATEC DIRECTE',
            desc: 'Conversa càlida i contextual. La IAIA et rep com si estiguessis a casa.',
            icon: <MessageCircle size={24} />,
            color: '#FFFFFF',
            route: '/chats',
            benefit: 'Chat tradicional amb ànima'
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
            <div className="role-modal-content command-center" onClick={e => e.stopPropagation()}>
                <header className="role-modal-header">
                    <div className="role-modal-title">
                        <BrainCircuit size={20} />
                        <span>CENTRE DE COMANDAMENT IAIA V3.1</span>
                    </div>
                    <button className="role-modal-close" onClick={onClose}><X size={24} /></button>
                </header>

                <div className="role-modal-body">
                    <div className="iaia-contextual-greeting">
                        <div className="iaia-avatar-mini">
                            <img src="/iaia_digital_matriarch.png" alt="IAIA" />
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
                                    <div className="role-icon-box-v5" style={{ background: role.color + '15', color: role.color }}>
                                        {generating === role.id ? <div className="spinner-v5" /> : role.icon}
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
                        <span className="v6-pill">10 MODES</span>
                        <span className="v6-pill">IA ACTIVA</span>
                        <span className="v6-pill">DIA/NIT OK</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoleSelectorModal;

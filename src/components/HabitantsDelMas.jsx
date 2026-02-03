import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Tractor, ChefHat, ClipboardList, FileSearch,
    Info, ShieldCheck, Share2, BellRing,
    Palette, Zap, Globe, ArrowLeft, Sparkles
} from 'lucide-react';
import { hapticService } from '../services/hapticService';
import './HabitantsDelMas.css';

const HabitantsDelMas = () => {
    const navigate = useNavigate();

    const habitants = [
        {
            id: 'agronom',
            icon: <Tractor size={32} />,
            label: "L'Agrònom",
            avatar: "Vicent Ferris",
            type: "PERSON",
            onomatopoeia: "¡BRRRRUM!",
            bio: "Vicent ha passat tota la vida entre oliveres. Coneix cada pam de terra i sap quan l'arbre demana aigua només per la tisorada del vent.",
            rol: "Diagnòstic de cultius i saviesa de la terra.",
            personalitat: "Pragmàtic, expert i profundament connectat amb els cicles de la natura."
        },
        {
            id: 'cuinera',
            icon: <ChefHat size={32} />,
            label: "La Cuinera",
            avatar: "Pepica",
            type: "PERSON",
            onomatopoeia: "¡XUP-XUP!",
            bio: "La cuina de Pepica és el cor del Mas. Guardiana dels secrets de la borreta i l'olleta, sap que un bon bategat comença per la panxa plena.",
            rol: "Receptari tradicional i gestió d'excedents.",
            personalitat: "Protectora, familiar i amant de l'aprofitament total (morca)."
        },
        {
            id: 'capatas',
            icon: <ClipboardList size={32} />,
            label: "El Capatàs",
            avatar: "Andreu",
            type: "PERSON",
            onomatopoeia: "¡PLAS-PLAS!",
            bio: "L'Andreu és el rellotge del camp. Sap que si la faena no es planifica amb trellat, el sol et guanya la partida.",
            rol: "Organitzador de tasques i planificació rural.",
            personalitat: "Directe, eficient i incansable."
        },
        {
            id: 'arxiver',
            icon: <FileSearch size={32} />,
            label: "L'Arxiver",
            avatar: "Joan",
            type: "PERSON",
            onomatopoeia: "¡ZAS-PLAS!",
            bio: "El Joan tradueix els papers de la ciutat a la llengua del carrer. Cap burocràcia pot amb la seua ploma.",
            rol: "Traductor documental i mediador institucional.",
            personalitat: "Savi, detallista i pedagog."
        },
        {
            id: 'ratoli',
            icon: <Info size={32} />,
            label: "Super Ratolí",
            avatar: "Super Ratolí (IAIA's Hero)",
            type: "ANIMAL",
            onomatopoeia: "¡PIII-PIII!",
            bio: "¡Vitaminar-se i superar-se! Heroi de les dades minúscules que vola entre bits per a que cap log es perda al fons del Mas.",
            rol: "Guardià de les dades locals (SQLite) i logs.",
            personalitat: "Heroic, obsessiu de l'ordre i amant de les vitamines digitals."
        },
        {
            id: 'sultan',
            icon: <ShieldCheck size={32} />,
            label: "Sultan",
            avatar: "Sultan (Gos d'Atura)",
            type: "ANIMAL",
            onomatopoeia: "¡BAU-BAU!",
            bio: "Un lladruc seu i la por fuig. Sultan no deixa que cap desconegut entre al Mas sense la seua olor digital.",
            rol: "Seguretat descentralitzada (DID) i identitat.",
            personalitat: "Fidel, protector i desconfiat del Cloud."
        },
        {
            id: 'mixa',
            icon: <Share2 size={32} />,
            label: "La Mixa",
            avatar: "Mixa (Gata)",
            type: "ANIMAL",
            onomatopoeia: "¡MIAAAA!",
            bio: "De teulada en teulada, la Mixa porta els missatges esquivant la censura. Salta per la xarxa P2P amb una elegància invisible.",
            rol: "Sincronització P2P i xarxa Rhizome.",
            personalitat: "Independent, àgil i curiosa."
        },
        {
            id: 'gall',
            icon: <BellRing size={32} />,
            label: "El Gall",
            avatar: "El Gall de la Torre",
            type: "ANIMAL",
            onomatopoeia: "¡KIKIRIKÍ!",
            bio: "Quan el Gall canta, el Mas es desperta. És el primer a vore el sol i l'últm a tancar la guàrdia.",
            rol: "Notificacions d'emergència i Bell of Attention.",
            personalitat: "Vigilant, estrident i necessari."
        },
        {
            id: 'nanobanana',
            icon: <Palette size={32} />,
            label: "Nano Banana",
            avatar: "L'Artista",
            type: "SYSTEM",
            onomatopoeia: "¡POW-ART!",
            bio: "Pintor de píxels i somnis. Nano Banana omple cada racó de la +IA amb el 'Ritu del Plàtan Daurat'.",
            rol: "Mestre de l'estètica i abundància visual.",
            personalitat: "Excentric, boig pel color i amant del Zero Radius."
        },
        {
            id: 'flash',
            icon: <Zap size={32} />,
            label: "Flash",
            avatar: "L'Executor",
            type: "SYSTEM",
            onomatopoeia: "¡ZAAAAAP!",
            bio: "Si parpelleges, t'ho has perdut. Flash executa qualsevol ordre a la velocitat del raig digital.",
            rol: "Orquestrador de processos i velocitat extrema (<0.2s).",
            personalitat: "Directe, eficient i hiper-actiu."
        },
        {
            id: 'viatjant',
            icon: <Globe size={32} />,
            label: "El Viatjant",
            avatar: "El Tio de la Bota",
            type: "PERSON",
            onomatopoeia: "¡GLUP-GLUP!",
            bio: "De poble en poble, portant la bota de vi i les històries que connecten el nostre món amb la resta de la vall.",
            rol: "Ambaixador i connexió de nodes exteriors.",
            personalitat: "Curiós, charlatán i gran coneixedor de la terra."
        }
    ];

    return (
        <div className="habitants-container animate-fade-in">
            <header className="habitants-header">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ArrowLeft size={24} />
                </button>
                <div className="header-title">
                    <Sparkles size={24} className="sparkle-icon" />
                    <h1>Vinyetes del Mas (v1.5.6)</h1>
                </div>
            </header>

            <section className="habitants-intro">
                <p>
                    Dins de la <strong>+IA (Intel·ligència de l'Aldea)</strong>, no hi ha codi fred.
                    Benvinguts a la <strong>Vinyeta Sagrada</strong>, on cada personatge és un
                    heroi del sistema Rhizome que fa que el bategat rural siga immortal. ¡BOOM!
                </p>
            </section>

            <div className="habitants-grid">
                {habitants.map(h => (
                    <div key={h.id} className="habitant-card" onClick={() => hapticService.batec()}>
                        <div className="card-top">
                            <span className="onomatopoeia-bg">{h.onomatopoeia}</span>
                            <div className="card-icon">{h.icon}</div>
                            {h.type === 'ANIMAL' && (
                                <span className="mascota-badge">Fidel de l'IAIA</span>
                            )}
                        </div>
                        <div className="card-names">
                            <h3>{h.label}</h3>
                            <small>{h.avatar}</small>
                        </div>
                        <div className="card-bio">
                            <p>{h.bio}</p>
                        </div>
                        <div className="card-footer">
                            <div className="footer-item">
                                <strong>Rol:</strong> <span>{h.rol}</span>
                            </div>
                            <div className="footer-item">
                                <strong>Personalitat:</strong> <span>{h.personalitat}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <footer className="habitants-footer">
                <p>Teixit amb trellat a la vall del Comtat. 🏛️🏺🚀</p>
            </footer>
        </div>
    );
};

export default HabitantsDelMas;

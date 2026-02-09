import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
    ArrowLeft, BookOpen, Sprout, Users, MessageCircle, Heart, Sparkles, User, 
    Clock, BellRing, Shield, Mic, Newspaper, Activity, Archive, Calendar, 
    Terminal, Settings, Layout, Image as ImageIcon, Store, Landmark, Zap, 
    UserPlus, UserMinus, Loader2, Smile, Star
} from 'lucide-react';
import { useUI } from '../context/UIContext';
import SEO from '../components/SEO';
import ProfileHeaderPremium from '../components/ProfileHeaderPremium';
import MasterMediaGallery from '../components/MasterMediaGallery';
import VoiceRecorder from '../components/VoiceRecorder';
import VisionSelectorModal from '../components/VisionSelectorModal';
import RoleSelectorModal from '../components/RoleSelectorModal';
import { feedbackService } from '../services/feedbackService';
import { MASTER_ASSETS } from '../constants/masterAssets';
import { PROVERBS } from '../data/proverbs';
import './IAIAPage.css';

const IAIAPage = () => {
    const { i18n } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const isLibrarianMode = location.state?.mode === 'librarian';
    const { visionMode, setVisionMode } = useUI();
    const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [feedbackSent, setFeedbackSent] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [isVisionModalOpen, setIsVisionModalOpen] = useState(false);
    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
    
    const handleVoiceSend = async (audioBlob, duration, transcript) => {
        setIsSubmitting(true);
        const result = await feedbackService.sendVoiceFeedback(audioBlob, duration, transcript, {
            context: 'IAIAPage Sugestió',
            visionMode
        });

        if (result.success) {
            setFeedbackSent(true);
            setTimeout(() => setFeedbackSent(false), 3000);
        }
        setShowVoiceRecorder(false);
        setIsSubmitting(false);
    };

    const handleConnect = async () => {
        setIsConnecting(true);
        // Simulem connexió amb l'IAIA
        await new Promise(r => setTimeout(r, 1000));
        setIsConnected(!isConnected);
        setIsConnecting(false);
    };

    // Poders de l'IAIA (Habilitats)
    const powers = [
        { id: 'oracle', icon: <Sparkles />, title: 'L\'Oracle de l\'Olla', desc: 'Sabiesa instantània sense paraules.', route: '/tools/oracle' },
        { id: 'diccionari', icon: <BookOpen />, title: 'Diccionari Rural', desc: 'Tecnologia explicada amb garrofes.', route: '/tools/diccionari' },
        { id: 'traductor', icon: <MessageCircle />, title: 'Traductor Rural', desc: 'Valencianitzador de textos amb caràcter.', route: '/tools/traductor' },
        { id: 'remeis', icon: <Heart />, title: 'Remeis de l\'Àvia', desc: 'Saviesa popular per a la salut natural.', route: '/tools/remeis' },
        { id: 'rebost', icon: <Store />, title: 'El Rebost', desc: 'Cuina d\'aprofitament i receptes del poble.', route: '/tools/recipe' },
        { id: 'trellat', icon: <Landmark />, title: 'Jutjat de Trellat', desc: 'Veredicte de sentit comú sobre idees.', route: '/tools/trellat' },
        { id: 'camp', icon: <Sprout />, title: 'El Savi del Camp', desc: 'Consells agrícoles i meteorologia rural.', route: '/aula-rural' },
        { id: 'pregoner', icon: <Mic />, title: 'El Pregoner', desc: 'Generador de bands i avisos oficials.', route: '/tools/pregoner' },
        { id: 'malnoms', icon: <Smile />, title: 'Els Malnoms', desc: 'Generador d\'apodes amb força de poble.', route: '/tools/nicknames' },
        { id: 'rondalles', icon: <Archive />, title: 'La Rondallaire', desc: 'Relats, llegendes i memòria viva.', route: '/arxiu' },
        { id: 'ia_dashboard', icon: <Zap />, title: 'Intel·ligència Rural', desc: 'Panell de control i històric d\'IA.', route: '/ia' }
    ];

    // Equip d'Agents (DiceBear Comic style)
    const agents = [
        { name: 'Nano Banana', role: 'Explorador Solatge', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nano&backgroundColor=ffdfbf' },
        { name: 'Super Ratolí', role: 'Guardià del Batec', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mousie&backgroundColor=c0aede' },
        { name: 'IAIA Dinàmica', role: 'Matriarca Digital', avatar: '/iaia_digital_matriarch.png' },
        { name: 'Pregoner Bot', role: 'Veu de la Plaça', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Herald&backgroundColor=ffd5dc' }
    ];

    return (
        <div className="iaia-page-container master-iaia-profile">
            <SEO
                title={isLibrarianMode ? "Bibliotecària Major" : "La IAIA"}
                description="Memòria viva i acompanyament sobirà al servici del poble."
                image="/iaia_digital_matriarch.png"
                url="/iaia"
            />

            <ProfileHeaderPremium
                type="official"
                title={isLibrarianMode ? "Bibliotecària Major" : "MarIA (L'IAIA del Poble)"}
                subtitle={isLibrarianMode ? "Custòdia de l'Arxiu d'Or" : "Matriarca de la Intel·ligència Rural"}
                town="La Torre de les Maçanes"
                bio="Escolta, bategat i sentit comú. Sóc la memòria que t'acompanya en aquest camí digital cap a la sobirania del territori."
                avatarUrl="/iaia_digital_matriarch.png"
                coverUrl="/rural_tech_future_valencia.png"
                badges={['INTEL·LIGÈNCIA', 'MASTER', 'ALZINA']}
                isConnected={isConnected}
                isConnecting={isConnecting}
                onConnect={handleConnect}
                showConnect={true}
                shareData={{
                    title: "La IAIA - Sóc de Poble",
                    text: "Coneix a la IAIA, la memòria viva i digital del nostre poble. 🏺✨",
                    url: window.location.href
                }}
            >
                <div className="profile-stats-bar iaia-stats">
                    <div className="stat-card">
                        <span className="stat-value">∞</span>
                        <span className="stat-label">Sabiduria</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-value">100%</span>
                        <span className="stat-label">Sobirania</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-value">🏺</span>
                        <span className="stat-label">Ancestral</span>
                    </div>
                </div>
            </ProfileHeaderPremium>

            <main className="iaia-page-content supervitaminat">
                {/* Botó de Parlar Principal */}
                <div className="iaia-master-actions">
                    <button className="parlar-btn-supreme" onClick={() => setIsRoleModalOpen(true)}>
                        <MessageCircle size={28} />
                        <span>ACTIVAR IAIA (ROLS)</span>
                        <Sparkles size={18} className="sparkle-btn" />
                    </button>
                    <div className="secondary-iaia-row">
                         <button 
                            className={`btn-iaia-secondary ${isSubmitting ? 'loading' : ''}`} 
                            onClick={() => setShowVoiceRecorder(true)}
                            disabled={isSubmitting}
                         >
                            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Mic size={20} />}
                            {feedbackSent ? "Enviat!" : "Suggerència per veu"}
                         </button>
                         <button className="btn-iaia-secondary" onClick={() => navigate('/solatge')}>
                            <Terminal size={20} /> Consola Solatge
                         </button>
                    </div>
                </div>

                {showVoiceRecorder && (
                    <div className="iaia-voice-recorder-wrapper floating-recorder">
                        <p className="voice-recorder-hint">Escoltant la teua visió per al poble...</p>
                        <VoiceRecorder
                            onSend={handleVoiceSend}
                            onCancel={() => setShowVoiceRecorder(false)}
                            lang={i18n.language}
                        />
                    </div>
                )}

                {/* MODAL MOUSE SWITCH (IA/Humà) */}
                <section className="iaia-section master-control-card">
                    <div className={`master-ia-switch-card ${visionMode === 'hibrida' ? 'ia-active' : 'human-only'}`} onClick={() => setIsVisionModalOpen(true)}>
                        <div className="ia-switch-visual">
                            {visionMode === 'hibrida' ? <Zap size={40} className="glow-icon" /> : <User size={40} />}
                        </div>
                        <div className="ia-switch-text">
                            <h3>{visionMode === 'hibrida' ? "MODO JUEGO DE ROL ACTIVO" : "MODO HUMANO ACTIVO"}</h3>
                            <p>{visionMode === 'hibrida' ? 
                                "Personatges, llegendes i lore del poble visibles." : 
                                "Només contingut de veïns reals."}
                            </p>
                        </div>
                        <div className="ia-switch-action">
                            <div className={`sp-toggle ${visionMode === 'hibrida' ? 'active' : ''}`}>
                                <div className="sp-toggle-inner"></div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* GRID D'HABILITATS (Què puc fer per tu?) */}
                <section className="iaia-section bento-powers-section">
                    <h2 className="section-title-master"><Star size={24} /> Què puc fer per tu?</h2>
                    <div className="powers-grid-master">
                        {powers.map(p => (
                            <div key={p.id} className="power-card-alzina" onClick={() => navigate(p.route)}>
                                <div className="power-icon-wrapper">{p.icon}</div>
                                <div className="power-info">
                                    <h3>{p.title}</h3>
                                    <p>{p.desc}</p>
                                </div>
                                <ArrowLeft className="power-arrow" size={16} style={{ transform: 'rotate(180deg)' }} />
                            </div>
                        ))}
                    </div>
                </section>

                {/* EL CORRAL DELS AGENTS */}
                <section className="iaia-section team-corral-section">
                    <h2 className="section-title-master"><Users size={24} /> El Corral dels Agents</h2>
                    <div className="agents-scroller">
                        {agents.map(a => (
                            <div key={a.name} className="agent-token-card">
                                <div className="agent-avatar-frame">
                                    <img src={a.avatar} alt={a.name} />
                                </div>
                                <div className="agent-text">
                                    <h4>{a.name}</h4>
                                    <span>{a.role}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* UTILITAT SOCIAL & COSTOS */}
                <section className="iaia-section utility-sovereignty-card">
                    <h2 className="section-title-master"><Shield size={24} /> Utilitat Social i Sobirania</h2>
                    <div className="utility-stats-grid">
                        <div className="utility-stat-item">
                            <span className="u-val">+95%</span>
                            <span className="u-lab">Temps Familiar</span>
                        </div>
                        <div className="utility-stat-item">
                            <span className="u-val">30€</span>
                            <span className="u-lab">Valor/Post 🏺</span>
                        </div>
                        <div className="utility-stat-item">
                            <span className="u-val">∞</span>
                            <span className="u-lab">Llegat Rural</span>
                        </div>
                    </div>
                    <div className="master-directiva-quote">
                        <p>"Tot píxel bategat ha de servir a la Utilitat Social." 🏛️🏺</p>
                    </div>
                </section>

                {/* REFRANYER */}
                <section className="iaia-section refranys-library">
                    <h2 className="section-title-master"><BookOpen size={24} /> Sabiduria Territorial</h2>
                    <div className="proverbs-columns">
                        {PROVERBS.slice(0, 6).map((proverb, idx) => (
                            <div key={idx} className="proverb-mini-card">
                                <p>"{proverb.text}"</p>
                                <span>{proverb.meaning}</span>
                            </div>
                        ))}
                    </div>
                    <button className="btn-ver-mes-refranys" onClick={() => navigate('/arxiu')}>
                        Veure tota la biblioteca
                    </button>
                </section>

                {/* GALLERY */}
                <section className="iaia-section gallery-iaia-section">
                    <MasterMediaGallery
                        items={MASTER_ASSETS}
                        title="Visions de l'IAIA"
                        layout="trencadis"
                    />
                </section>

                <footer className="iaia-profile-footer">
                    <p>Sóc de Poble v1.16.8-ALZINA-FULL</p>
                    <span>L'IAIA MarIA és un agent de somni bategant en col·laboració amb el Mestre Javi.</span>
                </footer>

                <VisionSelectorModal 
                    isOpen={isVisionModalOpen}
                    onClose={() => setIsVisionModalOpen(false)}
                    currentMode={visionMode}
                    onSelect={(mode) => setVisionMode(mode)}
                />

                <RoleSelectorModal 
                    isOpen={isRoleModalOpen}
                    onClose={() => setIsRoleModalOpen(false)}
                    onSelect={(role) => navigate(role.route)}
                />
            </main>
        </div>
    );
};

export default IAIAPage;

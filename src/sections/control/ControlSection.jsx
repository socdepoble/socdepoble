import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Cpu, Network, Receipt, Languages, MessageCircle, Share2, Settings } from 'lucide-react';
import SectionChrome from '../../components/SectionChrome';
import { useAppData } from '../../app/AppDataContext';
import './ControlSection.css';

export default function ControlSection() {
  const navigate = useNavigate();
  const { t } = useAppData();

  const handleNavNotes = (e) => {
    e.stopPropagation();
    navigate('/notes');
  };
  const handleNavIA = (e) => {
    e.stopPropagation();
    navigate('/ia');
  };
  const handleNavTermo = (e) => {
    e.stopPropagation();
    window.location.href = '/soc_de_poble/consola_termodinamica.html';
  };
  const handleNavGestoria = (e) => {
    e.stopPropagation();
    navigate('/gestoria');
  };
  const handleNavConnectar = (e) => {
    e.stopPropagation();
    navigate('/connectar');
  };

  return (
    <SectionChrome
      kicker={t('section.control.kicker', 'Xarxa Neural')}
      title={t('section.control.title', 'Panell de Control')}
      subtitle={t('section.control.subtitle', 'Node principal i accés a les eines d\'administració i gestió.')}
      meta={[t('section.control.meta1', 'Admin'), t('section.control.meta2', 'Sistema')]}
    >
      <div className="control-grid">
        {/* Card Javi */}
        <div className="control-card" onClick={handleNavNotes}>
          <header className="cc-caputxa">
            <div className="cc-autor-zona">
              <div className="cc-avatar">
                <img src="/assets/uploads/gent/javi-llinares/avatars/javi-llinares-perfil-1200px.jpg" alt="Avatar Javi Llinares" />
              </div>
              <div className="cc-autor-text">
                <span className="cc-autor-nom">Javi Llinares</span>
                <span className="cc-autor-lloc">La Torre de les Maçanes</span>
              </div>
            </div>
          </header>
          <div className="cc-cos">
            <h1 className="cc-title">JAVI LLINARES</h1>
            <h2 className="cc-subtitle">EL TEU ESPAI PERSONAL</h2>
            <div className="cc-icon">
              <User size={64} strokeWidth={1.5} />
            </div>
          </div>
          <div className="cc-peu">
            <div className="cc-icones-centre">
              <span><Languages size={20} /></span>
              <span><MessageCircle size={20} /></span>
              <span><Share2 size={20} /></span>
            </div>
            <button className="cc-boto-accio" onClick={handleNavConnectar}>
              <span className="cc-boto-icon">+</span><span className="cc-boto-text"> CONNECTAR</span>
            </button>
          </div>
        </div>

        {/* Card IAIA */}
        <div className="control-card" onClick={handleNavIA}>
          <header className="cc-caputxa">
            <div className="cc-autor-zona">
              <div className="cc-avatar">
                <img src="/assets/images/nano_anima_mas_ibanez_v3_1781060081431.webp" alt="Avatar IAIA MarIA" />
              </div>
              <div className="cc-autor-text">
                <span className="cc-autor-nom">IAIA MarIA</span>
                <span className="cc-autor-lloc">La Torre de les Maçanes</span>
              </div>
            </div>
          </header>
          <div className="cc-cos">
            <h1 className="cc-title">IAIA MarIA</h1>
            <h2 className="cc-subtitle">ÀNIMA I CONSCIÈNCIA DEL SISTEMA</h2>
            <div className="cc-icon">
              <Cpu size={64} strokeWidth={1.5} />
            </div>
          </div>
          <div className="cc-peu">
            <div className="cc-icones-centre">
              <span><Languages size={20} /></span>
              <span><MessageCircle size={20} /></span>
              <span><Share2 size={20} /></span>
            </div>
            <button className="cc-boto-accio" onClick={handleNavConnectar}>
              <span className="cc-boto-icon">+</span><span className="cc-boto-text"> CONNECTAR</span>
            </button>
          </div>
        </div>

        {/* Card Termodinàmica */}
        <div className="control-card" onClick={handleNavTermo}>
          <header className="cc-caputxa">
            <div className="cc-autor-zona">
              <div className="cc-avatar">
                <img src="/assets/images/nano_porta_masia_roure_1774195469079.png" alt="Termodinàmica" />
              </div>
              <div className="cc-autor-text">
                <span className="cc-autor-nom">Sóc de Poble</span>
                <span className="cc-autor-lloc">La Torre de les Maçanes</span>
              </div>
            </div>
          </header>
          <div className="cc-cos">
            <h1 className="cc-title">TERMODINÀMICA</h1>
            <h2 className="cc-subtitle">MONITORATGE DE RECURSOS</h2>
            <div className="cc-icon">
              <Network size={64} strokeWidth={1.5} />
            </div>
          </div>
          <div className="cc-peu">
            <div className="cc-icones-centre">
              <span><Languages size={20} /></span>
              <span><MessageCircle size={20} /></span>
              <span><Share2 size={20} /></span>
            </div>
            <button className="cc-boto-accio" onClick={handleNavConnectar}>
              <span className="cc-boto-icon">+</span><span className="cc-boto-text"> CONNECTAR</span>
            </button>
          </div>
        </div>

        {/* Card Gestoria */}
        <div className="control-card control-card--gestoria" onClick={handleNavGestoria}>
          <header className="cc-caputxa">
            <div className="cc-autor-zona">
              <div className="cc-avatar">
                <img src="/assets/images/nano_porta_del_mas.png" alt="Gestoria" />
              </div>
              <div className="cc-autor-text">
                <span className="cc-autor-nom">Sóc de Poble</span>
                <span className="cc-autor-lloc">La Torre de les Maçanes</span>
              </div>
            </div>
          </header>
          <div className="cc-cos">
            <h1 className="cc-title">GESTORIA</h1>
            <h2 className="cc-subtitle">ADMINISTRACIÓ I FINANCES</h2>
            <div className="cc-icon">
              <Receipt size={64} strokeWidth={1.5} />
            </div>
          </div>
          <div className="cc-peu">
            <div className="cc-icones-centre">
              <span><Languages size={20} /></span>
              <span><MessageCircle size={20} /></span>
              <span><Share2 size={20} /></span>
            </div>
            <button className="cc-boto-accio" onClick={handleNavConnectar}>
              <span className="cc-boto-icon">+</span><span className="cc-boto-text"> CONNECTAR</span>
            </button>
          </div>
        </div>

      </div>
    </SectionChrome>
  );
}

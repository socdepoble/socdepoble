import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, Receipt, Users, FileText, Landmark, Calculator, BarChart3, ScanLine, Newspaper, ShoppingCart, CalendarDays, MapPinned, MessageCircle, NotebookPen, LogOut } from 'lucide-react';
import { useAppData } from '../../app/AppDataContext';
import { UniversalPage, UniversalCard, UniversalButton } from '../../components/universal/UniversalComponents';
import './GestoriaSection.css';

const SIDEBAR_ITEMS = [
  { id: 'inici', label: 'Tauler d\'Inici', icon: Home },
  { id: 'facturacio', label: 'Facturació', icon: Receipt },
  { id: 'contactes', label: 'Contactes', icon: Users },
  { id: 'burocracia', label: 'Burocràcia', icon: FileText },
  { id: 'bancs', label: 'Bancs', icon: Landmark },
  { id: 'impostos', label: 'Impostos', icon: Calculator },
  { id: 'informes', label: 'Informes', icon: BarChart3 },
  { id: 'escaner', label: 'Escàner Local', icon: ScanLine },
];

export default function GestoriaSection() {
  const navigate = useNavigate();
  const { t } = useAppData();
  const [activeTab, setActiveTab] = useState('inici');

  return (
    <div className="gestoria-layout">
      {/* Gestoria Sidebar */}
      <aside className="gestoria-sidebar">
        <button className="gestoria-back-btn" onClick={() => navigate('/control')}>
          <ArrowLeft size={20} />
          <span>CENTRE DE CONTROL</span>
        </button>
        
        <nav className="gestoria-nav">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`gestoria-nav-item ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                {Icon ? <Icon size={20} /> : <span className="fallback-icon" />}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Gestoria Main Content */}
      <main className="gestoria-main">
        <UniversalPage title={`Gestoria de Poble - ${SIDEBAR_ITEMS.find(i => i.id === activeTab)?.label}`}>
          {activeTab === 'inici' && (
            <div className="gestoria-grid-main">
              {/* Left Column (Accions Principals / Eines) */}
              <div className="gestoria-col-left">
                <UniversalCard title="ACCIONS PRINCIPALS" tone="accent">
                  <div className="gestoria-btn-grid">
                    <UniversalButton variant="outline" icon={<Newspaper size={20} />} fullWidth onClick={() => navigate('/connectar')}>
                      PUBLICAR AL MUR
                    </UniversalButton>
                    <UniversalButton variant="outline" icon={<ShoppingCart size={20} />} fullWidth onClick={() => navigate('/connectar')}>
                      VENDRE AL MERCAT
                    </UniversalButton>
                    <UniversalButton variant="outline" icon={<CalendarDays size={20} />} fullWidth onClick={() => navigate('/connectar')}>
                      CREAR ESDEVENIMENT
                    </UniversalButton>
                    <UniversalButton variant="outline" icon={<MapPinned size={20} />} fullWidth onClick={() => navigate('/mapa')}>
                      VEURE MAPES
                    </UniversalButton>
                  </div>
                </UniversalCard>

                <div style={{ marginTop: '24px' }}>
                  <UniversalCard title="LES TEUES EINES D'ÚS DIARI" tone="dark">
                    <div className="gestoria-btn-grid">
                      <UniversalButton variant="primary" icon={<MessageCircle size={20} />} fullWidth onClick={() => navigate('/chats/iaia-maria')}>
                        CANAL DIRECTE
                      </UniversalButton>
                      <UniversalButton variant="primary" icon={<NotebookPen size={20} />} fullWidth onClick={() => navigate('/notes')}>
                        BLOC DE NOTES
                      </UniversalButton>
                      <UniversalButton variant="primary" icon={<FileText size={20} />} fullWidth onClick={() => navigate('/projecte')}>
                        EL PROJECTE
                      </UniversalButton>
                      <UniversalButton variant="primary" icon={<LogOut size={20} />} fullWidth onClick={() => {}}>
                        EIXIR DEL POBLE
                      </UniversalButton>
                    </div>
                  </UniversalCard>
                </div>
              </div>

              {/* Right Column (Informes / Estat) */}
              <div className="gestoria-col-right">
                <UniversalCard title="ESTAT D'ADMINISTRACIÓ" tone="dark">
                  <div className="gestoria-list">
                    <div className="gestoria-list-item">
                      <strong>Rebut del Tio Pep</strong>
                      <span>Pendent</span>
                    </div>
                    <div className="gestoria-list-item">
                      <strong>Factura Llum Plaça</strong>
                      <span>Pagat</span>
                    </div>
                  </div>
                </UniversalCard>

                <div style={{ marginTop: '24px' }}>
                  <UniversalCard title="INFORMES MENSUALS" tone="dark">
                    <div className="gestoria-list">
                      <div className="gestoria-list-item">
                        <strong>Informe Juliol 2026</strong>
                        <span>Generat</span>
                      </div>
                    </div>
                  </UniversalCard>
                </div>
              </div>
            </div>
          )}
          
          {activeTab !== 'inici' && (
            <UniversalCard>
              <p>El mòdul <strong>{SIDEBAR_ITEMS.find(i => i.id === activeTab)?.label}</strong> està en desenvolupament.</p>
            </UniversalCard>
          )}
        </UniversalPage>
      </main>
    </div>
  );
}

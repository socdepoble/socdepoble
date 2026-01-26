import React from 'react';
import { ImageIcon, MessageCircle, Store, Settings, Plus, ChevronRight } from 'lucide-react';

const ActivityTab = ({ stats, navigate }) => {
    return (
        <div className="tab-pane-fade-in activity-pane">
            <div className="activity-grid">
                <div className="activity-card" onClick={() => navigate('/fotos')}>
                    <div className="card-header">
                        <div className="icon-box"><ImageIcon size={20} /></div>
                        <h4>El meu Àlbum</h4>
                    </div>
                    <p>Totes les fotos i vídeos que has pujat al portal.</p>
                    <div className="card-footer">Veure Fotos <ChevronRight size={14} /></div>
                </div>

                <div className="activity-card" onClick={() => navigate('/perfil?tab=posts')}>
                    <div className="card-header">
                        <div className="icon-box"><MessageCircle size={20} /></div>
                        <h4>Les meues Publicacions</h4>
                    </div>
                    <p>Historial de tot el que has compartit al mur.</p>
                    <div className="card-footer">Veure Mur <ChevronRight size={14} /></div>
                </div>

                <div className="activity-card" onClick={() => navigate('/perfil?tab=products')}>
                    <div className="card-header">
                        <div className="icon-box"><Store size={20} /></div>
                        <h4>Els meus Productes</h4>
                    </div>
                    <p>Gestiona els articles que tens a la venda al mercat.</p>
                    <div className="card-footer">Gestionar Mercat <ChevronRight size={14} /></div>
                </div>

                <div className="activity-card" onClick={() => navigate('/admin?tab=categories')}>
                    <div className="card-header">
                        <div className="icon-box"><Settings size={20} /></div>
                        <h4>Etiquetes i Categories</h4>
                    </div>
                    <p>Organitza les teues preferències i subscripcions.</p>
                    <div className="card-footer">Configurar <ChevronRight size={14} /></div>
                </div>
            </div>

            {(stats.posts === 0 || stats.items === 0) && (
                <div className="onboarding-suggestion mt-xl">
                    <h3>Encara no has compartit res?</h3>
                    <p>Fes que el teu poble conega les teues històries o productes!</p>
                    <div className="btn-group-center">
                        <button className="btn-primary-sm" onClick={() => navigate('/mur')}>
                            <Plus size={16} /> Publicar al Mur
                        </button>
                        <button className="btn-secondary-sm" onClick={() => navigate('/mercat')}>
                            <Plus size={16} /> Vendre al Mercat
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ActivityTab;

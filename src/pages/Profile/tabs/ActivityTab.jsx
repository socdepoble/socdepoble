import React from 'react';
import { ImageIcon, MessageCircle, Store, Settings, Plus, ChevronRight, Landmark } from 'lucide-react';
import { useUI } from '../../../context/UIContext';
import { useAuth } from '../../../context/AuthContext';

const ActivityTab = ({ stats, navigate, displayProfile }) => {
    const { openLegalModal } = useUI();
    const { realUser, user } = useAuth();
    const isCreator = ['javillinares@gmail.com', 'admin@socdepoble.net'].includes(realUser?.email || user?.email);

    return (
        <div className="tab-pane-fade-in activity-pane">
            <div className="activity-grid">
                {/* BOTÓ PROFESSIONAL (Unificat amb estil Àlbum) */}
                {(isCreator || displayProfile?.ofici) && (
                    <div className="activity-card professional-highlight" onClick={() => openLegalModal({
                        title: `Dossier Professional: ${displayProfile.full_name}`,
                        content: `# ${displayProfile.full_name}\n\n**Especialitat**: ${displayProfile.ofici || 'Dissenyador Gràfic i Estratègia Digital'}\n**Certificació**: Professional Verificat • Sóc de Poble\n\n---\n\n## Perfil Professional\nSóc un professional compromès amb el territori i la sobirania tecnològica. La meua activitat es centra en crear eines que empoderen la comunitat local a través del disseny, el codi i la memòria.\n\n## Serveis i Competències\n- **Disseny Gràfic i Comunicació**: Especialista en identitat visual i estratègia DirCom.\n- **Desenvolupament Web i Mòbil**: Frameworks moderns i arquitectures sobiranes.\n- **Consultoria Tecnològica**: Assessorament en la digitalització de col·lectius i petites produccions.\n\n---\n\n## El Compromís Sóc de Poble\nCom a autònom verificat, em comprometo a oferir serveis de proximitat, amb transparència total i respecte per la privacitat i les dades dels nostres veïns.\n\n---\n\n**Ubicació**: La Torre de les Maçanes 🏠\n**Validat per**: Administració Superior de Sóc de Poble. 🏛️🏺✨`,
                        type: 'professional',
                        authorName: displayProfile.full_name
                    })}>
                        <div className="card-header">
                            <div className="icon-box"><Landmark size={20} /></div>
                            <h4>Dossier Professional</h4>
                        </div>
                        <p>La teua carta de presentació verificada per Sóc de Poble.</p>
                        <div className="card-footer">Obriu Dossier <ChevronRight size={14} /></div>
                    </div>
                )}

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

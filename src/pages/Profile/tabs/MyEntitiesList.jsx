import { useNavigate } from 'react-router-dom';
import { Plus, Store, Building2, Settings } from 'lucide-react';
import { useProfileQueries } from '../hooks/useProfileQueries';

const MyEntitiesList = ({ userId }) => {
    const navigate = useNavigate();
    const { entities, isLoadingEntities: loading } = useProfileQueries(userId);

    if (loading) return <div>Carregant entitats...</div>;

    return (
        <div className="entities-scroll-container">
            <div className="entity-card-create" onClick={() => navigate('/gestio-entitats')}>
                <div className="create-icon-area">
                    <Plus size={24} />
                </div>
                <div className="entity-info">
                    <h4>Nova Entitat</h4>
                    <span className="entity-role">Empresa o Grup</span>
                </div>
            </div>

            {entities.map(ent => (
                <div key={ent.id} className="entity-card-modern" onClick={() => navigate(`/entitat/${ent.id}`)}>
                    <div className={`entity-avatar-modern ${ent.type}`}>
                        {ent.avatar_url ? (
                            <img src={ent.avatar_url} alt={ent.name} />
                        ) : (
                            ent.type === 'empresa' ? <Store size={22} /> : <Building2 size={22} />
                        )}
                        <span className="manage-badge"><Settings size={12} /></span>
                    </div>
                    <div className="entity-info">
                        <h4>{ent.name}</h4>
                        <span className="entity-role">
                            {ent.type === 'empresa' ? 'Negoci Local' : 'Associació'}
                        </span>
                        <div className="entity-meta">
                            <span className={`role-pill ${ent.member_role}`}>
                                {ent.member_role === 'admin' ? 'Administrador' : 'Membre'}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MyEntitiesList;

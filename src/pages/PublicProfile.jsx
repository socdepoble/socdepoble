import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { User, MapPin, Calendar, Layout, Settings, ChevronRight, Loader2, AlertCircle, Building2, Store, Users as UsersIcon } from 'lucide-react';
import { supabaseService } from '../services/supabaseService';
import { useAppContext } from '../context/AppContext';
import Feed from '../components/Feed';
import './Profile.css'; // Reuse profile base styles

const PublicProfile = () => {
    const { id } = useParams();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user: currentUser } = useAppContext();
    const [profile, setProfile] = useState(null);
    const [managedEntities, setManagedEntities] = useState([]);
    const [userPosts, setUserPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const isOwnProfile = currentUser?.id === id;

    useEffect(() => {
        const fetchProfileData = async () => {
            setLoading(true);
            try {
                const data = await supabaseService.getPublicProfile(id);
                setProfile(data);

                if (isOwnProfile) {
                    const entities = await supabaseService.getUserEntities(id);
                    setManagedEntities(entities);
                }

                const postsData = await supabaseService.getUserPosts(id);
                setUserPosts(postsData);
            } catch (err) {
                console.error('[PublicProfile] Error:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchProfileData();
    }, [id, isOwnProfile]);

    if (loading) return (
        <div className="profile-container loading">
            <Loader2 className="spinner" />
            <p>Carregant perfil...</p>
        </div>
    );

    if (error || !profile) return (
        <div className="profile-container error">
            <AlertCircle size={48} />
            <h3>No s'ha trobat el perfil</h3>
            <button className="primary-btn" onClick={() => navigate('/mur')}>Tornar al mur</button>
        </div>
    );

    return (
        <div className="profile-container">
            <div className="profile-header-premium">
                <div className="profile-avatar-wrapper">
                    {profile.avatar_url ? (
                        <img src={profile.avatar_url} alt={profile.full_name} className="profile-avatar-large" />
                    ) : (
                        <div className="avatar-placeholder-large"><User size={48} /></div>
                    )}
                </div>
                <div className="profile-info-main">
                    <h1 className="heading-xl">{profile.full_name}</h1>
                    <div className="profile-stats-row">
                        <div className="profile-stat-item">
                            <MapPin size={18} />
                            <span>{profile.town_name || 'La Torre de les Maçanes'}</span>
                        </div>
                        <div className="profile-stat-item">
                            <Calendar size={18} />
                            <span>Membre des de {new Date(profile.created_at).getFullYear()}</span>
                        </div>
                    </div>
                </div>
            </div>

            {isOwnProfile && managedEntities.length > 0 && (
                <section className="profile-section-premium">
                    <h2 className="section-header-premium">
                        <Layout size={20} />
                        Gestió de Pàgines
                    </h2>
                    <div className="entities-grid-mini">
                        {managedEntities.map(entity => (
                            <Link to={`/entitat/${entity.id}`} key={entity.id} className="entity-manage-card">
                                <div className="entity-icon-small">
                                    {entity.type === 'oficial' ? <Building2 size={24} /> :
                                        entity.type === 'negoci' ? <Store size={24} /> : <UsersIcon size={24} />}
                                </div>
                                <div className="entity-info-mini">
                                    <span className="entity-name-mini">{entity.name}</span>
                                    <span className="entity-role-mini">{entity.member_role}</span>
                                </div>
                                <ChevronRight size={20} />
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            <section className="profile-section-premium">
                <h2 className="section-header-premium">
                    <UsersIcon size={20} />
                    Activitat Recent
                </h2>
                <div className="profile-feed-wrapper">
                    {userPosts.length > 0 ? (
                        userPosts.slice(0, 5).map(post => (
                            <div key={post.uuid || post.id} className="mini-post-card">
                                <p>{post.content}</p>
                                <span className="post-date-small">
                                    <Calendar size={12} />
                                    {new Date(post.created_at).toLocaleDateString()}
                                </span>
                            </div>
                        ))
                    ) : (
                        <div className="empty-state-mini">
                            <p>Publicacions de {profile.full_name.split(' ')[0]}</p>
                            <span className="text-secondary">Pròximament: Historial de lligams i propostes</span>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default PublicProfile;

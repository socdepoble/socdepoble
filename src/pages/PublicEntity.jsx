import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Building2, Store, Users, MapPin, MessageSquare, Share2, Loader2, AlertCircle, Calendar, ArrowLeft, UserPlus, UserMinus, Settings, Landmark } from 'lucide-react';
import { supabaseService } from '../services/supabaseService';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import SEO from '../components/SEO';
import ProfileHeaderPremium from '../components/ProfileHeaderPremium';
import './Profile.css';
import { logger } from '../utils/logger';
import { ShieldCheck } from 'lucide-react';
import Avatar from '../components/Avatar';
import ArmariDigital from '../components/ArmariDigital';

const PublicEntity = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    const { openLegalModal } = useUI();
    const [entity, setEntity] = useState(null);
    const [members, setMembers] = useState([]);
    const [posts, setPosts] = useState([]);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [followersCount, setFollowersCount] = useState(0);
    const [activeTab, setActiveTab] = useState('feed'); // feed, market, admin

    useEffect(() => {
        const fetchEntityData = async () => {
            setLoading(true);
            try {
                const entityData = await supabaseService.getPublicEntity(id);
                setEntity(entityData);

                const [membersData, postsData, itemsData, followers] = await Promise.all([
                    supabaseService.getEntityMembers(id),
                    supabaseService.getEntityPosts(id),
                    supabaseService.getEntityMarketItems(id),
                    supabaseService.getFollowers(id)
                ]);

                setMembers(membersData || []);
                setPosts(postsData || []);
                setItems(itemsData || []);
                setFollowersCount(followers?.length || 0);
                if (entityData.type === 'oficial') {
                    setActiveTab('admin');
                }
            } catch (err) {
                logger.error('[PublicEntity] Error:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchEntityData();
            if (currentUser && id) {
                supabaseService.isFollowing(currentUser.id, id).then(setIsConnected);
            }
        }
    }, [id, currentUser]);

    const handleConnect = async () => {
        if (!currentUser) {
            navigate('/login');
            return;
        }

        setIsConnecting(true);
        try {
            if (isConnected) {
                const success = await supabaseService.disconnectFromProfile(currentUser.id, id);
                if (success) {
                    setIsConnected(false);
                    setFollowersCount(prev => Math.max(0, prev - 1));
                }
            } else {
                const success = await supabaseService.connectWithProfile(currentUser.id, id);
                if (success) {
                    setIsConnected(true);
                    setFollowersCount(prev => prev + 1);
                }
            }
        } catch (err) {
            logger.error('Error handling connection:', err);
        } finally {
            setIsConnecting(false);
        }
    };

    if (loading) return (
        <div className="profile-container loading">
            <Loader2 className="spinner" />
            <p>Carregant entitat...</p>
        </div>
    );

    if (error || !entity) return (
        <div className="profile-container error">
            <AlertCircle size={48} />
            <h3>No s'ha trobat l'entitat</h3>
            <button className="primary-btn" onClick={() => navigate('/mur')}>Tornar al mur</button>
        </div>
    );



    const handleHeaderClick = (item) => {
        const targetId = item.author_entity_id || item.author_user_id || item.author_id || item.entity_id || id;
        const type = (item.author_entity_id || item.entity_id) ? 'entitat' : 'perfil';

        if (item.author?.toLowerCase().includes('sóc de poble') ||
            item.name?.toLowerCase().includes('sóc de poble') ||
            targetId === 'sdp-core' ||
            targetId === 'sdp-oficial-1') {
            navigate('/entitat/sdp-oficial-1');
            return;
        }

        if (item.author_role === 'ambassador' || item.author_is_ai || item.is_ai) {
            navigate('/iaia');
            return;
        }

        if (targetId && targetId !== id) {
            navigate(`/${type}/${targetId}`);
        }
    };

    const getSocialImage = () => {
        switch (entity.social_image_preference) {
            case 'avatar': return entity.avatar_url;
            case 'cover': return entity.cover_url;
            default: return null;
        }
    };

    return (
        <div className="profile-container">
            <SEO
                title={entity.name}
                description={entity.description || `${entity.name} a Sóc de Poble. ${entity.type} de la Comunitat Valenciana.`}
                image={getSocialImage()}
                type="article"
            />
            <ProfileHeaderPremium
                type={entity.type === 'negoci' ? 'business' : (entity.type === 'oficial' ? 'official' : 'group')}
                title={entity.name}
                subtitle={entity.type === 'oficial' ? 'Canal Oficial' : (entity.type === 'negoci' ? 'Comerç Local' : 'Associació')}
                town={entity.town_name || 'La Torre de les Maçanes'}
                bio={entity.description}
                avatarUrl={entity.avatar_url}
                coverUrl={entity.cover_url}
                isLive={entity.type === 'negoci'}
                badges={entity.type === 'oficial' ? ['Oficial'] : (entity.is_ai ? ['IAIA'] : [])}
                onAction={members.some(m => m.user_id === currentUser?.id) ? () => navigate('/gestio-entitats', { state: { fromProfile: true } }) : null}
                actionIcon={<Settings size={24} />}
                shareData={{
                    title: entity.name,
                    text: entity.description || `Mira la pàgina de ${entity.name} a Sóc de Poble`,
                    url: window.location.href
                }}
            >
                <div className="profile-stats-row max-w-2xl mx-auto border-none py-0 mb-0">
                    <div className="stat-item group clickable" onClick={() => logger.info(entity.type === 'oficial' ? 'Historial de Bàndols en fase Beta' : 'Historial de Publicacions en fase Beta')}>
                        <span className="stat-value text-2xl">{posts.length}</span>
                        <span className="stat-label text-[10px]">{entity.type === 'oficial' ? 'Bàndols' : 'Publicacions'}</span>
                        <div className="beta-dot"></div>
                    </div>
                    <div className="stat-item group clickable" onClick={() => logger.info(entity.type === 'negoci' ? 'Botiga en fase de desplegament' : 'Llista de Membres en fase Beta')}>
                        <span className="stat-value text-2xl">{entity.type === 'negoci' ? (items?.length || 0) : members.length}</span>
                        <span className="stat-label text-[10px]">{entity.type === 'negoci' ? 'En Venda' : 'Membres'}</span>
                        <div className="beta-dot"></div>
                    </div>
                    <div className="stat-item group clickable" onClick={() => logger.info('Llista de Connexions en fase Beta')}>
                        <span className="stat-value text-2xl">{followersCount}</span>
                        <span className="stat-label text-[10px]">Connexions</span>
                        <div className="beta-dot"></div>
                    </div>
                </div>
            </ProfileHeaderPremium>

            <div className="profile-control-panel max-w-2xl mx-auto my-12 p-8">
                <button
                    className={`btn-mercat-buy w-full mb-6 ${isConnected ? 'bg-transparent text-[var(--sdp-terracotta)]' : 'bg-[var(--sdp-terracotta)] text-black border-none'}`}
                    onClick={handleConnect}
                    disabled={isConnecting}
                    style={{ height: '64px', fontSize: '18px', borderRadius: 'var(--sdp-radius-tactile)' }}
                >
                    {isConnecting ? (
                        <Loader2 className="spinner animate-spin" size={24} />
                    ) : isConnected ? (
                        <>
                            <UserMinus size={24} />
                            <span>DESCONNECTAR</span>
                        </>
                    ) : (
                        <>
                            <UserPlus size={24} />
                            <span>CONNECTAR AMB {entity.name.toUpperCase()}</span>
                        </>
                    )}
                </button>
                <div className="flex gap-4 mb-8">
                    <button
                        className="btn-config-toggle flex-1 flex items-center justify-center gap-3 h-16"
                        onClick={() => navigate(`/chats/${entity.id}`)}
                    >
                        <MessageSquare size={24} />
                        <span>MISSATGERIA</span>
                    </button>

                    {/* BOTÓ LEGAL (Dinàmic per a l'Associació) */}
                    {(entity.name?.toLowerCase().includes('rentonar') || entity.id === 'entitat-rentonar') && (
                        <button
                            className="btn-config-toggle flex-1 flex items-center justify-center gap-3 h-16 border-[var(--sdp-terracotta)] text-[var(--sdp-terracotta)]"
                            onClick={() => openLegalModal({
                                title: `Estatuts: ${entity.name}`,
                                content: `# Estatuts de l'Associació El Rentonar ⚖️📜\n\n**Denominació**: RENTONAR, GRUP PER LA CONSERVACIÓ DE LA NATURA I EL PATRIMONI\n**NIF**: G03967668\n**Inscripció**: Número 4444 de la Secció PRIMERA del Registre d'Associacions de la CV.\n**Adaptació**: Adaptats a la Llei Orgànica 1/2002 el 17 de novembre de 2006.\n\n---\n\n## Capítol I: Denominació i Fins\n\n### Art. 1º Denominació\nL'associació es constitueix per temps indefinit, sense ànim de lucre, sota la denominació actualitzada el 2006.\n\n### Art. 4º Fins de l'Associació\n- **Conservar i protegir** el nostre entorn natural i cultural.\n- **Fomentar la conscienciació ciutadana** per a protegir i conèixer l'entorn natural de La Torre de les Maçanes.\n- **Conèixer el nostre patrimoni** cultural i històric lligat al medi natural.\n- **Crear una consciència col·lectiva** de protecció, respecte i recuperació dels valors mediambientals del nostre terme.\n\n---\n\n## Capítol II: Activitats\n\n- Activitats adreçades a la població escolar i col·lectius del poble (xarrades, excursions).\n- Treballs de camp per a diagnosticar problemàtiques mediambientals.\n- Treballs de recuperació de determinades fonts degradades.\n- Accions puntuals per al millor coneixement del patrimoni.\n- Creació d'un planter d'espècies autòctones.\n\n---\n\n## Capítol III: L'Òrgan de Govern\n\nL'Assemblea General és l'òrgan suprem de govern, integrada pels associats per dret propi irrenunciable i en igualtat absoluta.\n\n## Capítol VI: Dissolució i Liquidació\n\nEn cas de dissolució, si existira sobrant líquid, es destinarà a fins que no desvirtuen el caràcter no lucratiu de l'entitat, concretament a **GREENPEACE ESPAÑA**.\n\n---\n\n**Certificació Final**: Document adaptat i visat a La Torre de les Maçanes el 8 de març de 2007 per la Direcció Territorial de Justícia.🏛️⚡️🏺`,
                                type: 'estatuts'
                            })}
                        >
                            <ShieldCheck size={20} /> ESTATUTS
                        </button>
                    )}
                </div>

                <div className="noise-filter-manager-wrapper">
                    <div className={`noise-filter-manager ${isConnected ? 'active' : ''}`}>
                        <div className="filter-info-stack">
                            <h4>Filtre de Soroll</h4>
                            <p>Oculta posts promocionals al mur.</p>
                        </div>
                        <button
                            className={`filter-action-btn ${isConnected ? 'active' : ''}`}
                            onClick={() => logger.info('Filtre de Soroll actiu per defecte en fase Beta')}
                        >
                            {isConnected ? 'ACTIU' : 'INACTIU'}
                        </button>
                    </div>
                </div>
            </div>



            <div className="profile-tabs-premium">
                {entity.type === 'oficial' && (
                    <button
                        className={`tab-btn ${activeTab === 'admin' ? 'active' : ''}`}
                        onClick={() => setActiveTab('admin')}
                    >
                        <Landmark size={18} /> Administració
                    </button>
                )}
                <button
                    className={`tab-btn ${activeTab === 'feed' ? 'active' : ''}`}
                    onClick={() => setActiveTab('feed')}
                >
                    <MessageSquare size={18} /> {entity.type === 'oficial' ? 'Bàndols' : 'Mur'}
                </button>
                {(entity.type === 'negoci' || items.length > 0) && (
                    <button
                        className={`tab-btn ${activeTab === 'market' ? 'active' : ''}`}
                        onClick={() => setActiveTab('market')}
                    >
                        <Store size={18} /> {entity.type === 'negoci' ? 'Botiga' : 'Mercat'}
                    </button>
                )}
            </div>

            <div className="profile-grid-custom-single">
                {activeTab === 'admin' && (
                    <section className="profile-section-premium animate-in">
                        <ArmariDigital townName={entity.town_name || 'La Torre'} />
                    </section>
                )}

                {activeTab === 'feed' && (
                    <section className="profile-section-premium animate-in">
                        <div className="entity-feed">
                            {posts.length > 0 ? (
                                posts.map(post => {
                                    const isOfficial = entity.type === 'oficial';
                                    return (
                                        <article key={post.uuid || post.id} className={`universal-card social-post ${isOfficial ? 'official-zero-radius' : ''}`}>
                                            <div className="card-header clickable" onClick={() => handleHeaderClick(post)}>
                                                <div className="header-left">
                                                    <Avatar
                                                        src={post.author_avatar || entity.avatar_url}
                                                        role={post.author_role || entity.type}
                                                        name={post.author || entity.name}
                                                        size={44}
                                                    />
                                                    <div className="post-meta">
                                                        <div className="post-author-row">
                                                            <span className="post-author">{post.author || entity.name}</span>
                                                            {isOfficial && <span className="identity-badge official">OFICIAL</span>}
                                                            {(post.author_role === 'ambassador' || post.author_is_ai || entity.is_ai) && (
                                                                <span className="identity-badge ai">IAIA</span>
                                                            )}
                                                        </div>
                                                        <div className="post-town">{entity.town_name || 'La Comunitat'}</div>
                                                    </div>
                                                </div>
                                                <div className="header-right">
                                                    <span className="post-time-right">{new Date(post.created_at).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                            <div className="card-body">
                                                <p>{post.content}</p>
                                            </div>
                                            {post.image_url && (
                                                <div className="card-image-wrapper" style={{ borderRadius: isOfficial ? '0' : 'inherit' }}>
                                                    <img src={post.image_url} alt="Post image" style={{ borderRadius: isOfficial ? '0' : 'inherit' }} />
                                                </div>
                                            )}
                                        </article>
                                    );
                                })
                            ) : (
                                <p className="text-secondary">No hi ha {entity.type === 'oficial' ? 'bàndols' : 'publicacions'} recents.</p>
                            )}
                        </div>
                    </section>
                )}

                {activeTab === 'market' && (
                    <section className="profile-section-premium animate-in">
                        <div className="entity-market">
                            {items.length > 0 ? (
                                items.map(item => (
                                    <article key={item.uuid || item.id} className="universal-card market-item-card">
                                        <div className="card-header clickable" onClick={() => handleHeaderClick(item)}>
                                            <div className="header-left">
                                                <Avatar
                                                    src={item.avatar_url || entity.avatar_url}
                                                    role={item.author_role || entity.type}
                                                    name={item.seller || entity.name}
                                                    size={44}
                                                />
                                                <div className="post-meta">
                                                    <div className="post-author-row">
                                                        <span className="post-author">{item.seller || entity.name}</span>
                                                        {entity.is_ai && <span className="identity-badge ai">IAIA</span>}
                                                    </div>
                                                    <div className="post-town">{entity.town_name || 'La Comunitat'}</div>
                                                </div>
                                            </div>
                                            <div className="header-right">
                                                <span className="post-time-right">{new Date(item.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <div className="card-body">
                                            <div className="market-price-row">
                                                <h3 className="item-title">{item.title}</h3>
                                                <span className="price-tag-vibrant">{item.price}</span>
                                            </div>
                                            {item.image_url && (
                                                <div className="card-image-wrapper">
                                                    <img src={item.image_url} alt={item.title} />
                                                </div>
                                            )}
                                        </div>
                                    </article>
                                ))
                            ) : (
                                <p className="text-secondary">No hi ha articles al mercat.</p>
                            )}
                        </div>
                    </section>
                )}
            </div>

            <div className="profile-grid-custom">

                <aside className="profile-sidebar">
                    <section className="profile-section-premium">
                        <h2 className="section-header-premium">Mantenidors</h2>
                        <div className="members-list">
                            {members.map(member => (
                                <div key={member.user_id} className="member-row-mini">
                                    <img
                                        src={member.profiles.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
                                        alt={member.profiles.full_name}
                                        className="member-avatar-mini"
                                    />
                                    <div className="member-meta-mini">
                                        <span className="member-name-mini">{member.profiles.full_name}</span>
                                        <span className="member-role-badge">{member.role}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </aside>
            </div>
        </div >
    );
};

export default PublicEntity;

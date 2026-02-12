import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { User, MapPin, Calendar, Settings, ChevronRight, Loader2, AlertCircle, Building2, Store, Users as UsersIcon, ArrowLeft, UserPlus, UserMinus, Plus, Layout, Activity, MessageCircle, Landmark, MessageSquare, Sparkles } from 'lucide-react';
import { supabaseService } from '../services/supabaseService';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import { logger } from '../utils/logger';
import { CREATOR_EMAILS } from '../constants';
import { hapticService } from '../services/hapticService';
import Feed from '../components/Feed';
import SEO from '../components/SEO';
import ProfileHeaderPremium from '../components/ProfileHeaderPremium';
import Avatar from '../components/Avatar';
import ShareHub from '../components/ShareHub';
import MasterMediaGallery from '../components/MasterMediaGallery';
import './Profile.css';

const PublicProfile = () => {
    const { id, username } = useParams();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    const { openLegalModal } = useUI();
    const [profile, setProfile] = useState(null);
    const [userPosts, setUserPosts] = useState([]);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [followersCount, setFollowersCount] = useState(0);

    const isOwnProfile = !!currentUser && (currentUser.id === id || currentUser.username === username);
    const isMaster = (id === '6325f44-7277-4d2...-f093' || CREATOR_EMAILS.includes(profile?.email) || profile?.full_name === 'Javi Llinares');

    useEffect(() => {
        const fetchProfileData = async () => {
            setLoading(true);
            try {
                // Determine if we have a username or ID
                let profileId = id;

                if (username) {
                    // Fetch by username
                    const profileData = await supabaseService.getUserByUsername(username);
                    if (!profileData) {
                        setError('Usuari no trobat');
                        setLoading(false);
                        return;
                    }
                    profileId = profileData.id;
                    setProfile(profileData);
                } else {
                    // Fetch by ID
                    const data = await supabaseService.getPublicProfile(profileId);
                    setProfile(data);
                }

                if (isOwnProfile) {
                    // Les entitats ja no es gestionen des d'aquí (Protocol OMEGA)
                }

                const [postsData, itemsData, followers] = await Promise.all([
                    supabaseService.getUserPosts(profileId),
                    supabaseService.getUserMarketItems(profileId),
                    supabaseService.getFollowers(profileId)
                ]);

                setUserPosts(postsData || []);
                setItems(itemsData || []);
                setFollowersCount(followers?.length || 0);
            } catch (err) {
                logger.error('[PublicProfile] Error:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (id || username) {
            fetchProfileData();
        }
    }, [id, username, isOwnProfile, currentUser]);

    // Separate effect for follow status that depends on profile being loaded
    useEffect(() => {
        if (currentUser && profile && profile.id !== currentUser.id) {
            supabaseService.isFollowing(currentUser.id, profile.id).then(setIsConnected);
        }
    }, [currentUser, profile]);

    const handleConnect = async (params = {}) => {
        if (!currentUser) {
            navigate('/login');
            return;
        }

        const { tag, disconnect } = params;

        setIsConnecting(true);
        try {
            if (disconnect || isConnected) {
                const success = await supabaseService.disconnectFromProfile(currentUser.id, profile.id);
                if (success) {
                    setIsConnected(false);
                    setFollowersCount(prev => Math.max(0, prev - 1));
                    hapticService.notifySuccess();
                }
            } else {
                const success = await supabaseService.connectWithProfile(currentUser.id, profile.id, tag ? [tag] : []);
                if (success) {
                    setIsConnected(true);
                    setFollowersCount(prev => prev + 1);
                    hapticService.notifySuccess();
                }
            }
        } catch (err) {
            logger.error('Error handling connection:', err);
        } finally {
            setIsConnecting(false);
        }
    };

    const handleHeaderClick = (item) => {
        const targetId = item.author_entity_id || item.author_user_id || item.author_id || id;
        const type = item.author_entity_id ? 'entitat' : 'perfil';


        if (item.seller?.toLowerCase().includes('sóc de poble') ||
            targetId === 'sdp-core' ||
            targetId === 'sdp-oficial-1') {
            navigate('/entitat/sdp-oficial-1');
            return;
        }

        if (targetId && targetId !== profile.id) {
            navigate(`/${type}/${targetId}`);
        }
    };

    const badges = [];
    if (profile?.id?.startsWith('11111111-1a1a')) badges.push('INTEL·LIGÈNCIA');
    if (profile?.role === 'ambassador') badges.push('IAIA');
    if (profile?.role === 'admin' || profile?.role === 'superadmin') badges.push('Padrí');

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

    const getSocialImage = () => {
        switch (profile.social_image_preference) {
            case 'avatar': return profile.avatar_url;
            case 'cover': return profile.cover_url;
            default: return null; 
        }
    };

    return (
        <div className="profile-container bg-black min-h-screen">
            <SEO
                title={`${profile.full_name} | Perfil`}
                description={`${profile.full_name}: ${profile.bio || profile.ofici || 'Veí de la Comunitat'}. Bategant a Sóc de Poble.`}
                image={getSocialImage()}
                url={profile.username ? `/@${profile.username}` : `/perfil/${profile.id}`}
                type="profile"
                structuredData={{
                    "@type": profile.role === 'admin' || profile.role === 'entitat' ? "Organization" : "Person",
                    "name": profile.full_name,
                    "description": profile.bio,
                    "image": getSocialImage() || profile.avatar_url,
                    "url": window.location.href,
                    "jobTitle": profile.ofici || profile.role,
                    "address": {
                        "@type": "PostalAddress",
                        "addressLocality": profile.town_name || "Comunitat Valenciana"
                    }
                }}
            />
            <ProfileHeaderPremium
                type={profile.role === 'entitat' || profile.role === 'admin' ? 'official' : (profile.role === 'business' ? 'business' : 'person')}
                title={isMaster ? 'Javi Llinares' : profile.full_name}
                subtitle={isMaster ? 'Fundador Sóc de Poble' : (profile.ofici ? (profile.ofici.charAt(0).toUpperCase() + profile.ofici.slice(1)) : (profile.role === 'ambassador' ? 'Ambaixador' : (profile.role && profile.role !== 'user' ? (profile.role.charAt(0).toUpperCase() + profile.role.slice(1)) : 'Veí')))}
                town={profile.town_name || 'La Torre de les Maçanes'}
                bio={isMaster ? "Arquitecte digital i amant de l'oli d'oliva. Buscant sempre la millor versió del nostre poble. #SócDePoble 🏺✨" : profile.bio}
                avatarUrl={isMaster ? '/Javi_Llinares-Foto_perfil-1.jpg' : profile.avatar_url}
                coverUrl={isMaster ? 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200' : profile.cover_url}
                badges={badges}
                isConnected={isConnected}
                isConnecting={isConnecting}
                onConnect={handleConnect}
                showConnect={!isOwnProfile}
                onAction={isOwnProfile ? () => navigate('/perfil') : null}
                actionIcon={<Settings size={24} />}
                shareData={{
                    title: profile.full_name,
                    text: profile.bio || `Mira el perfil de ${profile.full_name} a Sóc de Poble`,
                    url: window.location.href
                }}
            >
                <div className="profile-stats-bar">
                    <div className="stat-card clickable" onClick={() => logger.info('Funcionalitat de Mur en fase Beta')}>
                        <span className="stat-value">{userPosts.length}</span>
                        <span className="stat-label">{t('profile.publications')}</span>
                        <div className="beta-dot"></div>
                    </div>
                    <div className="stat-card clickable" onClick={() => logger.info('Mercat en fase de desplegament')}>
                        <span className="stat-value">{items.length}</span>
                        <span className="stat-label">{t('nav.stats_sales')}</span>
                        <div className="beta-dot"></div>
                    </div>
                    <div className="stat-card clickable" onClick={() => logger.info('Llista de Connexions en fase Beta')}>
                        <span className="stat-value">{followersCount}</span>
                        <span className="stat-label">Connexions</span>
                        <div className="beta-dot"></div>
                    </div>
                </div>
            </ProfileHeaderPremium>

            {
                (() => {
                    const masters = (typeof CREATOR_EMAILS !== 'undefined') ? CREATOR_EMAILS : (window.CREATOR_EMAILS || []);
                    const canSeeActions = !isOwnProfile || (currentUser && (masters.includes(currentUser.email) || currentUser.role === 'admin' || currentUser.role === 'superadmin'));

                    return canSeeActions && (
                        <div className="profile-actions-gem-fullwidth main-action-focus">
                            <button
                                className={`connect-btn-main supreme-action ${isConnected ? 'connected' : ''}`}
                                onClick={handleConnect}
                                disabled={isConnecting}
                            >
                                {isConnecting ? (
                                    <Loader2 size={24} className="animate-spin" />
                                ) : isConnected ? (
                                    <>
                                        <UserMinus size={24} />
                                        <span>DESCONNECTAR</span>
                                    </>
                                ) : (
                                    <>
                                        <UserPlus size={24} />
                                        <span>CONECTAR AMB {profile.full_name.toUpperCase()}</span>
                                    </>
                                )}
                            </button>
                            <div className="secondary-actions-row">
                                <button
                                    className="chat-btn-main"
                                    onClick={() => navigate(`/chats/${profile.id}`)}
                                >
                                    <MessageSquare size={24} />
                                    <span>MISSATGERIA</span>
                                </button>

                                {/* BOTÓ PROFESSIONAL (Discret) */}
                                {(masters.includes(profile.email) || profile.ofici) && (
                                    <button
                                        className="legal-doc-btn-compact professional"
                                        onClick={() => openLegalModal({
                                            title: `Dossier: ${profile.full_name}`,
                                            content: `# Dossier Professional: ${profile.full_name} 💼⚖️🏺\n\n**Especialitat**: ${profile.ofici || 'Dissenyador Gràfic i Estratègia Digital'}\n**Certificació**: Professional Verificat de Sóc de Poble.\n\n---\n\n## Perfil Professional\nSóc un professional compromès amb el territori i la sobirania tecnològica.\n\n---\n\n**Validat per**: Administració Superior de Sóc de Poble.🏛️🏺✨`,
                                            type: 'professional',
                                            authorName: profile.full_name
                                        })}
                                    >
                                        <Landmark size={20} /> DOSSIER
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })()
            }



            <section className="profile-section-premium">
                <h2 className="section-header-premium">
                    <UsersIcon size={20} />
                    {t('profile.publications')}
                </h2>
                <div className="profile-feed-wrapper">
                    {userPosts.length > 0 ? (
                        <Feed townId={null} hideHeader={true} customPosts={userPosts} />
                    ) : (
                        <div className="empty-state-premium">
                            <Activity size={40} className="empty-icon" />
                            <p>El mur de {profile.full_name.split(' ')[0]} encara està tranquil.</p>
                            <span className="empty-subtext">Torna prompte per a veure novetats!</span>
                        </div>
                    )}
                </div>
            </section>

            <section className="profile-section-premium">
                <h2 className="section-header-premium">
                    <Store size={20} />
                    {t('profile.market')}
                </h2>
                <div className="profile-feed-wrapper market-grid-profile">
                    {items.length > 0 ? (
                        <div className="market-grid">
                            {items.map(item => (
                                <article key={item.uuid || item.id} className="universal-card market-item-card">
                                    <div
                                        className="card-header clickable"
                                        onClick={() => handleHeaderClick(item)}
                                    >
                                        <div className="header-left">
                                            <Avatar
                                                src={item.avatar_url || profile.avatar_url}
                                                role={item.author_role || profile.role}
                                                name={item.seller || profile.full_name}
                                                size={44}
                                            />
                                            <div className="post-meta">
                                                <div className="post-author-row">
                                                    <span className="post-author">
                                                        {item.seller || item.author_name || profile.full_name || 'Venedor'}
                                                    </span>
                                                    {(item.author_role === 'ambassador' || item.author_is_ai || profile.role === 'ambassador') && (
                                                        <span className="identity-badge ai" title="Informació i Acció Artificial">IAIA</span>
                                                    )}
                                                </div>
                                                <div className="post-town">
                                                    {item.towns?.name || item.town_name || item.location || profile.town_name}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="header-right">
                                            <span className="post-time-right">
                                                {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Avui'}
                                            </span>
                                        </div>
                                    </div>

                                    {item.image_url && (
                                        <div className="card-image-wrapper">
                                            <img src={item.image_url} alt={item.title} />
                                        </div>
                                    )}

                                    <div className="card-body">
                                        <div className="market-price-row">
                                            <h3 className="item-title">{item.title}</h3>
                                            <span className="price-tag-vibrant">{item.price}</span>
                                        </div>
                                        <p className="item-desc-premium">{item.description || t('market.no_description')}</p>
                                    </div>

                                    <div className="card-footer-vibrant">
                                        <button
                                            className="add-btn-premium-vibrant"
                                            style={{ flex: 1 }}
                                            onClick={() => {
                                                if (!currentUser) navigate('/login');
                                                navigate(`/chats/${profile.id}`, {
                                                    state: { interestedIn: item }
                                                });
                                            }}
                                        >
                                            <Plus size={20} />
                                            <span>{t('market.interested')}</span>
                                        </button>
                                        <ShareHub
                                            title={`${item.title} - Sóc de Poble`}
                                            text={`Mira aquest producte de proximitat de ${profile.full_name}: ${item.title}`}
                                            url={`${window.location.origin}/mercat?id=${item.uuid || item.id}`}
                                        />
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state-premium">
                            <Store size={40} className="empty-icon" />
                            <p>{profile.full_name.split(' ')[0]} no té res a la venda ara mateix.</p>
                            <span className="empty-subtext">Descobreix més joies en el Mercat general.</span>
                        </div>
                    )}
                </div>
            </section>

            {/* GALERIA TRENCADÍS [NANO BANANA] */}
            {(() => {
                const galleryItems = [
                    ...userPosts.filter(p => p.image_url).map(p => ({
                        id: p.id,
                        asset: { url: p.image_url, mime_type: 'image/jpeg' },
                        context: p.content?.substring(0, 30) + (p.content?.length > 30 ? '...' : '') || 'Publicació',
                        description: p.location || profile.town_name,
                        permissions: 'public'
                    })),
                    ...items.filter(i => i.image_url).map(i => ({
                        id: i.uuid || i.id,
                        asset: { url: i.image_url, mime_type: 'image/jpeg' },
                        context: i.title,
                        description: i.price,
                        permissions: 'public'
                    }))
                ];

                return galleryItems.length > 0 && (
                    <section className="profile-section-premium" style={{ marginTop: '0', paddingTop: '0' }}>
                        <h2 className="section-header-premium">
                            <Sparkles size={20} />
                            Mode Trencadís
                        </h2>
                        <div className="profile-gallery-wrapper" style={{ padding: '0 8px' }}>
                            <MasterMediaGallery
                                items={galleryItems}
                                showFilters={false}
                                layout="trencadis"
                            />
                        </div>
                    </section>
                );
            })()}
        </div >
    );
};

export default PublicProfile;

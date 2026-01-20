import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link2, MessageCircle, Share2, MoreHorizontal, Building2, Store, Users, User, Loader2 } from 'lucide-react';
import { supabaseService } from '../services/supabaseService';
import { useAppContext } from '../context/AppContext';
import CreatePostModal from './CreatePostModal';
import TagSelector from './TagSelector';
import CategoryTabs from './CategoryTabs';
import './Feed.css';

const getAvatarIcon = (type) => {
    switch (type) {
        case 'gov': return <Building2 size={20} />;
        case 'shop': return <Store size={20} />;
        case 'group': return <Users size={20} />;
        case 'coop': return <Store size={20} />;
        default: return <User size={20} />;
    }
};

const getAvatarColor = (type) => {
    switch (type) {
        case 'gov': return 'var(--color-primary)';
        case 'shop': return 'var(--color-secondary)';
        case 'group': return 'var(--color-accent)';
        case 'coop': return '#6B705C';
        default: return '#999';
    }
};

const Feed = () => {
    const [crashError, setCrashError] = useState(null);

    try {
        const { t } = useTranslation();
        const { user, profile } = useAppContext();
        const [posts, setPosts] = useState([]);
        const [loading, setLoading] = useState(true);
        const [userConnections, setUserConnections] = useState({});
        const [isModalOpen, setIsModalOpen] = useState(false);
        const [selectedRole, setSelectedRole] = useState('tot');
        const [showTagsFor, setShowTagsFor] = useState(null);

        const fetchPosts = useCallback(async () => {
            setLoading(true);
            try {
                const data = await supabaseService.getPosts(selectedRole);
                setPosts(data || []);

                if (user && data && data.length > 0) {
                    try {
                        const postIds = data.map(p => p.id);
                        const allConnections = await supabaseService.getPostConnections(postIds);
                        const connectionsState = {};
                        data.forEach(post => {
                            const myConn = allConnections.find(c => c.post_id === post.id && c.user_id === user.id);
                            connectionsState[post.id] = myConn ? (myConn.tags || []) : null;
                        });
                        setUserConnections(connectionsState);
                    } catch (e) { console.error(e); }
                }
            } catch (error) {
                console.error('Error fetching posts:', error);
            } finally {
                setLoading(false);
            }
        }, [selectedRole, user]);

        useEffect(() => {
            fetchPosts();
        }, [selectedRole, fetchPosts]);

        if (crashError) {
            return <div style={{ padding: '20px', color: 'red' }}>ERROR FATAL: {crashError}</div>;
        }

        if (loading && posts.length === 0) {
            return (
                <div className="feed-container loading">
                    <Loader2 className="spinner" />
                    <p>Carregant el mur...</p>
                </div>
            );
        }

        return (
            <div className="feed-container">
                <header className="page-header-with-tabs">
                    <h1>{t('feed.title')}</h1>
                    <CategoryTabs selectedRole={selectedRole} onSelectRole={setSelectedRole} />
                </header>

                <div className="feed-list">
                    <div className="feed-input-trigger" onClick={() => setIsModalOpen(true)}>
                        <div className="user-avatar-small">
                            {profile?.avatar_url ? <img src={profile.avatar_url} alt="Profile" /> : <User size={20} />}
                        </div>
                        <input type="text" placeholder={t('feed.placeholder')} readOnly />
                    </div>

                    <CreatePostModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onPostCreated={fetchPosts}
                    />

                    {(!posts || posts.length === 0) ? (
                        <p className="empty-message">{t('feed.empty')}</p>
                    ) : (
                        posts.map(post => (
                            <article key={post.id} className="post-card">
                                <div className="card-header">
                                    <div className="header-left">
                                        <div className="post-avatar" style={{ backgroundColor: getAvatarColor(post.avatar_type) }}>
                                            {getAvatarIcon(post.avatar_type)}
                                        </div>
                                        <div className="post-meta">
                                            <span className="post-author">{post.author}</span>
                                            <span className="post-time">{post.created_at}</span>
                                        </div>
                                    </div>
                                    <button className="more-btn"><MoreHorizontal size={20} /></button>
                                </div>

                                <div className="card-content">
                                    <p>{post.content}</p>
                                    {post.image_url && (
                                        <div className="post-image">
                                            <img src={post.image_url} alt="Post content" />
                                        </div>
                                    )}
                                </div>

                                <div className="card-actions-wrapper">
                                    <div className="card-actions">
                                        <button className={`action-btn ${userConnections[post.id] ? 'connected' : ''}`}>
                                            <Link2 size={20} />
                                            <span>{post.connections_count || 0}</span>
                                        </button>
                                        <button className="action-btn"><MessageCircle size={20} /><span>{post.comments_count}</span></button>
                                        <button className="action-btn"><Share2 size={20} /></button>
                                    </div>
                                    {userConnections[post.id] && showTagsFor === post.id && (
                                        <TagSelector
                                            postId={post.id}
                                            currentTags={userConnections[post.id]}
                                            onTagsChange={() => { }}
                                        />
                                    )}
                                </div>
                            </article>
                        ))
                    )}
                </div>
            </div>
        );
    } catch (e) {
        return <div style={{ padding: '50px', background: 'white', color: 'red', zIndex: 9999 }}>
            <h2>Crash de Renderizado Detectado</h2>
            <p>{e.message}</p>
            <pre>{e.stack}</pre>
        </div>;
    }
};

export default Feed;

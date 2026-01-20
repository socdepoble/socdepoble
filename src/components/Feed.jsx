import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link2, MessageCircle, Share2, MoreHorizontal, Building2, Store, Users, User, Loader2 } from 'lucide-react';
import { supabaseService } from '../services/supabaseService';
import { useAppContext } from '../context/AppContext';
import CreatePostModal from './CreatePostModal';
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
    console.log('[DEBUG] Feed rendering initiation');
    const { t } = useTranslation();
    const { profile } = useAppContext();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState('tot');

    const fetchPosts = useCallback(async () => {
        console.log('[DEBUG] fetchPosts starting for role:', selectedRole);
        setLoading(true);
        try {
            const data = await supabaseService.getPosts(selectedRole);
            console.log('[DEBUG] Posts received:', data?.length || 0);
            setPosts(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('[DEBUG] Error fetching posts:', error);
        } finally {
            setLoading(false);
            console.log('[DEBUG] fetchPosts finished');
        }
    }, [selectedRole]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    if (loading && (!posts || posts.length === 0)) {
        return (
            <div className="feed-container loading">
                <Loader2 className="spinner" />
                <p>{t('feed.loading_feed') || 'Carregant el mur...'}</p>
            </div>
        );
    }

    return (
        <div className="feed-container">
            <header className="page-header-with-tabs">
                <h1>{t('feed.title') || 'Mur'}</h1>
                <CategoryTabs selectedRole={selectedRole} onSelectRole={setSelectedRole} />
            </header>

            <div className="feed-list">
                <div className="feed-input-trigger" onClick={() => setIsModalOpen(true)}>
                    <div className="user-avatar-small">
                        {profile?.avatar_url ? <img src={profile.avatar_url} alt="Profile" /> : <User size={20} />}
                    </div>
                    <input type="text" placeholder={t('feed.placeholder') || 'Què vols compartir?'} readOnly />
                </div>

                <CreatePostModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onPostCreated={fetchPosts}
                />

                {(!posts || posts.length === 0) ? (
                    <p className="empty-message">{t('feed.empty') || 'No hi ha contingut'}</p>
                ) : (
                    posts.map(post => {
                        if (!post) return null;
                        return (
                            <article key={post.id} className="post-card">
                                <div className="card-header">
                                    <div className="header-left">
                                        <div className="post-avatar" style={{ backgroundColor: getAvatarColor(post.avatar_type) }}>
                                            {getAvatarIcon(post.avatar_type)}
                                        </div>
                                        <div className="post-meta">
                                            <span className="post-author">{post.author}</span>
                                            <span className="post-time">{post.created_at ? new Date(post.created_at).toLocaleDateString() : 'Ara'}</span>
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
                                        <button className="action-btn">
                                            <Link2 size={20} />
                                            <span>{post.connections_count || 0}</span>
                                        </button>
                                        <button className="action-btn">
                                            <MessageCircle size={20} />
                                            <span>{post.comments_count || 0}</span>
                                        </button>
                                        <button className="action-btn"><Share2 size={20} /></button>
                                    </div>
                                </div>
                            </article>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default Feed;

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Heart, MessageCircle, Share2, MoreHorizontal, Building2, Store, Users, User, Loader2 } from 'lucide-react';
import { supabaseService } from '../services/supabaseService';
import { useAppContext } from '../context/AppContext';
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

import CreatePostModal from './CreatePostModal';

const Feed = () => {
    const { t } = useTranslation();
    const { user, profile } = useAppContext();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userLikes, setUserLikes] = useState({}); // { postId: boolean }
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchPosts = async () => {
        try {
            const data = await supabaseService.getPosts();
            setPosts(data);

            // Si hay usuario, cargar sus likes
            if (user) {
                const likesState = {};
                for (const post of data) {
                    const likes = await supabaseService.getPostLikes(post.id);
                    likesState[post.id] = likes.includes(user.id);
                }
                setUserLikes(likesState);
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [user]);

    const handleLike = async (postId) => {
        if (!user) return alert('Debes iniciar sesión para dar like');

        try {
            const { liked } = await supabaseService.togglePostLike(postId, user.id);
            setUserLikes(prev => ({ ...prev, [postId]: liked }));

            // Actualizar contador localmente
            setPosts(prev => prev.map(p =>
                p.id === postId ? { ...p, likes: liked ? p.likes + 1 : p.likes - 1 } : p
            ));
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };

    if (loading) {
        return (
            <div className="feed-container loading">
                <Loader2 className="spinner" />
                <p>{t('feed.loading_feed')}</p>
            </div>
        );
    }

    return (
        <div className="feed-container">
            <header className="page-header">
                <h1>{t('feed.title')}</h1>
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

                {posts.length === 0 ? (
                    <p className="empty-message">{t('feed.empty')}</p>
                ) : (
                    posts.map(post => (
                        <article key={post.id} className="feed-card">
                            <div className="card-header">
                                <div className="header-left">
                                    <div className="post-avatar" style={{ backgroundColor: getAvatarColor(post.avatar_type) }}>
                                        {getAvatarIcon(post.avatar_type)}
                                    </div>
                                    <div className="post-meta">
                                        <span className="post-author">{post.author}</span>
                                        <span className="post-time">{new Date(post.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <button className="more-btn">
                                    <MoreHorizontal size={20} />
                                </button>
                            </div>

                            <div className="card-content">
                                <p>{post.content}</p>
                                {post.image_url && (
                                    <div className="post-image">
                                        <img src={post.image_url} alt="Post content" />
                                    </div>
                                )}
                            </div>

                            <div className="card-actions">
                                <button className="action-btn">
                                    <Heart size={20} />
                                    <span>{post.likes}</span>
                                </button>
                                <button className="action-btn">
                                    <MessageCircle size={20} />
                                    <span>{post.comments_count}</span>
                                </button>
                                <button className="action-btn">
                                    <Share2 size={20} />
                                </button>
                            </div>
                        </article>
                    ))
                )}
            </div>
        </div>
    );
};

export default Feed;

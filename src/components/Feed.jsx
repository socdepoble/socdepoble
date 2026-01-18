import { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, Building2, Store, Users, User, Loader2 } from 'lucide-react';
import { supabase } from '../supabaseClient';
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
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            const { data, error } = await supabase
                .from('posts')
                .select('*')
                .order('id', { ascending: false });

            if (error) {
                console.error('Error fetching posts:', error);
            } else {
                setPosts(data);
            }
            setLoading(false);
        };

        fetchPosts();
    }, []);

    if (loading) {
        return (
            <div className="feed-container loading">
                <Loader2 className="spinner" />
                <p>Carregant el mur...</p>
            </div>
        );
    }

    return (
        <div className="feed-container">
            <header className="page-header">
                <h1>Mur</h1>
            </header>

            <div className="feed-list">
                <div className="feed-input-trigger">
                    <div className="user-avatar-small">
                        <User size={20} />
                    </div>
                    <input type="text" placeholder="Què està passant al poble?" readOnly />
                </div>

                {posts.length === 0 ? (
                    <p className="empty-message">No hi ha novetats al mur.</p>
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

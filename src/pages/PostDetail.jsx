import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, Clock, MapPin, User } from 'lucide-react';
import { supabaseService } from '../services/supabaseService';
import { logger } from '../utils/logger';
import Avatar from '../components/Avatar';
import SEO from '../components/SEO';
import ShareHub from '../components/ShareHub';
import NanoLoader from '../components/NanoLoader';
import './PostDetail.css';

const PostDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                // We might need a getPostById method in supabaseService
                const data = await supabaseService.getPostById(id);
                setPost(data);
            } catch (error) {
                logger.error('[PostDetail] Error fetching post:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    if (loading) return <NanoLoader message="Preparant la lectura..." />;
    if (!post) return <div className="error-page">Publicació no trobada.</div>;

    return (
        <div className="post-detail-container animate-in">
            <SEO
                title={post.author_name || 'Publicació'}
                description={post.content.substring(0, 160)}
                url={`/post/${id}`}
            />

            <header className="post-detail-header">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ArrowLeft size={24} />
                    <span>Tornar</span>
                </button>
                <ShareHub
                    title={post.author_name}
                    text={post.content.substring(0, 100)}
                    url={window.location.href}
                />
            </header>

            <article className="post-full-article">
                <div className="author-context">
                    <Avatar
                        src={post.profiles?.avatar_url}
                        name={post.author_name}
                        size={60}
                    />
                    <div className="author-meta">
                        <h2>{post.author_name}</h2>
                        <div className="meta-row">
                            <Clock size={14} />
                            <span>{new Date(post.created_at).toLocaleDateString()}</span>
                            <MapPin size={14} style={{ marginLeft: '10px' }} />
                            <span>{post.towns?.name || 'Comunitat'}</span>
                        </div>
                    </div>
                </div>

                {post.image_url && (
                    <div className="post-main-image">
                        <img src={post.image_url} alt="Portada" />
                    </div>
                )}

                <div className="post-rich-content" dangerouslySetInnerHTML={{ __html: post.content }} />
            </article>

            <footer className="post-detail-footer">
                <p>Publicat a Sóc de Poble • Memòria viva del territori.</p>
            </footer>
        </div>
    );
};

export default PostDetail;

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Share2, Download, Lightbulb } from 'lucide-react';
import { MOCK_FEED } from '../data';
import SEO from '../components/SEO';
import './DidacticPage.css';

const DidacticPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const post = MOCK_FEED.find(p => p.id === id);

    if (!post) {
        return (
            <div className="didactic-page-error">
                <ArrowLeft onClick={() => navigate(-1)} className="back-btn" />
                <h2>Contingut no trobat</h2>
                <p>Aquesta lliçó encara no ha sigut bategada al Mas.</p>
                <button className="btn-primary" onClick={() => navigate('/')}>Tornar a l'Inici</button>
            </div>
        );
    }

    return (
        <div className="didactic-page-container">
            <SEO
                title={`${post.metadata?.title || 'Lliçó Master'} - Sóc de Poble`}
                description={post.content.substring(0, 160)}
            />

            <header className="didactic-header">
                <button onClick={() => navigate(-1)} className="back-btn-didactic">
                    <ArrowLeft size={24} />
                </button>
                <div className="header-title">
                    <BookOpen size={20} color="var(--color-primary)" />
                    <span>AULA MASTER</span>
                </div>
                <div className="header-actions">
                    <button className="action-btn-didactic"><Share2 size={18} /></button>
                </div>
            </header>

            <main className="didactic-content">
                <div className="content-hero">
                    {post.image_url && post.image_url.length > 0 && (
                        <div className="didactic-image-wrapper">
                            <img src={post.image_url[0]} alt={post.metadata?.title} />
                        </div>
                    )}
                    <h1 className="didactic-main-title">{post.metadata?.title || 'Lliçó Magistral'}</h1>
                </div>

                <div className="didactic-body">
                    <div className="didactic-main-text">
                        {/* Simplistic rendering of "markdown-like" content from feed */}
                        {post.content.split('\n').map((line, i) => {
                            if (line.startsWith('# ')) return <h2 key={i}>{line.replace('# ', '')}</h2>;
                            if (line.startsWith('## ')) return <h3 key={i}>{line.replace('## ', '')}</h3>;
                            if (line.startsWith('**')) return <p key={i}><strong>{line.replace(/\*\*/g, '')}</strong></p>;
                            if (line.match(/^\d\./)) return <li key={i} className="list-item-didactic">{line}</li>;
                            return <p key={i}>{line}</p>;
                        })}
                    </div>

                    <div className="didactic-insight-box">
                        <div className="insight-header">
                            <Lightbulb size={24} color="var(--color-warning)" />
                            <h4>Trellat de l'IAIA</h4>
                        </div>
                        <p>{post.metadata?.didactic_text || "Aquesta lliçó ens ajuda a posar els peus a la terra y el cap a les estrelles."}</p>
                    </div>
                </div>

                <div className="didactic-footer">
                    <p>Creat per {post.author} • {post.time}</p>
                    <div className="footer-badges">
                        <span className="badge-master">NIVELL DÉU</span>
                        <span className="badge-master">SMART VILLAGE</span>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DidacticPage;

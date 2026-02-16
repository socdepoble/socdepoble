import React, { useState } from 'react';
import { Share2, MessageCircle, Send, Facebook, Twitter, Link as LinkIcon, X, CheckCircle } from 'lucide-react';
import './ShareHub.css';
import { logger } from '../utils/logger';

/**
 * ShareHub [VIRAL NEXUS VOS]
 * Gestiona la compartició de contingut optimitzada per a previsualitzacions mòbils.
 * Prioritza la dignitat del contingut en WhatsApp i Telegram.
 */
const ShareHub = ({ title, text, url, onShareSuccess, customTrigger }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const baseUrl = 'https://soc-de-poble.vercel.app';
    const finalUrl = url?.startsWith('http') ? url : `${baseUrl}${url || window.location.pathname}`;

    const shareData = {
        title: title || 'Sóc de Poble',
        text: text || 'Mira el que he trobat a Sóc de Poble! 🥘',
        url: finalUrl
    };

    const handleOpenModal = () => {
        if (navigator.share) {
            handleNativeShare();
        } else {
            setIsModalOpen(true);
        }
    };

    const handleNativeShare = async () => {
        try {
            // [VOS] WhatsApp native preview works best if text and url are well combined
            await navigator.share({
                title: shareData.title,
                text: `${shareData.text}\n\n`,
                url: shareData.url
            });
            if (onShareSuccess) onShareSuccess();
        } catch (err) {
            if (err.name !== 'AbortError') {
                logger.error('Error sharing:', err);
                setIsModalOpen(true);
            }
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareData.url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const socialLinks = [
        {
            name: 'WhatsApp',
            icon: <MessageCircle size={24} />,
            // [VOS] Optimització específica per a previsualització rica
            url: `https://wa.me/?text=${encodeURIComponent(`*${shareData.title}*\n${shareData.text}\n\n🔗 ${shareData.url}`)}`,
            color: '#25D366'
        },
        {
            name: 'Telegram',
            icon: <Send size={24} />,
            url: `https://t.me/share/url?url=${encodeURIComponent(shareData.url)}&text=${encodeURIComponent(shareData.title + '\n' + shareData.text)}`,
            color: '#0088cc'
        },
        {
            name: 'Facebook',
            icon: <Facebook size={24} />,
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}`,
            color: '#1877F2'
        }
    ];

    return (
        <div className="share-hub-container">
            {customTrigger ? (
                React.cloneElement(customTrigger, {
                    onClick: (e) => {
                        e.stopPropagation();
                        if (customTrigger.props.onClick) customTrigger.props.onClick(e);
                        handleOpenModal();
                    }
                })
            ) : (
                <button onClick={(e) => { e.stopPropagation(); handleOpenModal(); }} className="share-main-btn" title="Compartir">
                    <Share2 size={24} />
                </button>
            )}

            {isModalOpen && (
                <div className="share-modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="share-modal-content glass-morphism" onClick={e => e.stopPropagation()}>
                        <header className="share-modal-header">
                            <div className="header-icon-hub">
                                <Share2 size={20} />
                            </div>
                            <div className="header-info">
                                <h3>{shareData.title}</h3>
                                <p>Comparteix el bategat del poble</p>
                            </div>
                            <button className="share-close-btn" onClick={() => setIsModalOpen(false)}>
                                <X size={24} />
                            </button>
                        </header>
                        <div className="share-modal-body">
                            <div className="share-url-preview">
                                <span>{shareData.url}</span>
                                <button onClick={copyToClipboard} className={copied ? 'copied' : ''}>
                                    {copied ? <CheckCircle size={18} /> : <LinkIcon size={18} />}
                                </button>
                            </div>

                            <div className="share-grid">
                                {socialLinks.map(link => (
                                    <a
                                        key={link.name}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="share-option-btn"
                                        style={{ '--brand-color': link.color }}
                                        onClick={() => setIsModalOpen(false)}
                                    >
                                        <div className="share-icon-circle">
                                            {link.icon}
                                        </div>
                                        <span className="share-label">{link.name}</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShareHub;

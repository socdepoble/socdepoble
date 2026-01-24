import React, { useState } from 'react';
import { Share2, MessageCircle, Send, Facebook, Twitter, Link as LinkIcon, X } from 'lucide-react';
import './ShareHub.css';
import { logger } from '../utils/logger';

/**
 * Component ShareHub
 * Gestiona la compartició de contingut utilitzant l'API nativa o fallback a xarxes socials.
 */
const ShareHub = ({ title, text, url, onShareSuccess }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const shareData = {
        title: title || 'Sóc de Poble',
        text: text || 'Mira el que he trobat a Sóc de Poble!',
        url: url || window.location.href
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
            await navigator.share(shareData);
            if (onShareSuccess) onShareSuccess();
        } catch (err) {
            if (err.name !== 'AbortError') {
                logger.error('Error sharing:', err);
                setIsModalOpen(true); // Fallback to modal on error
            }
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareData.url);
        alert('Enllaç copiat al porta-retalls!');
    };

    const socialLinks = [
        {
            name: 'WhatsApp',
            icon: <MessageCircle size={20} />,
            url: `https://wa.me/?text=${encodeURIComponent(shareData.text + ' ' + shareData.url)}`,
            color: '#25D366'
        },
        {
            name: 'Telegram',
            icon: <Send size={20} />,
            url: `https://t.me/share/url?url=${encodeURIComponent(shareData.url)}&text=${encodeURIComponent(shareData.text)}`,
            color: '#0088cc'
        },
        {
            name: 'Facebook',
            icon: <Facebook size={20} />,
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}`,
            color: '#1877F2'
        },
        {
            name: 'X',
            icon: <Twitter size={20} />,
            url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareData.url)}&text=${encodeURIComponent(shareData.text)}`,
            color: '#000000'
        }
    ];

    return (
        <div className="share-hub-container">
            <button onClick={handleOpenModal} className="share-main-btn" title="Compartir">
                <Share2 size={24} />
            </button>

            {isModalOpen && (
                <div className="share-modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="share-modal-content" onClick={e => e.stopPropagation()}>
                        <header className="share-modal-header">
                            <h3>Compartir</h3>
                            <button className="share-close-btn" onClick={() => setIsModalOpen(false)}>
                                <X size={24} />
                            </button>
                        </header>
                        <div className="share-modal-body">
                            <p className="share-modal-text">{shareData.text}</p>
                            <div className="share-grid">
                                {socialLinks.map(link => (
                                    <a
                                        key={link.name}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="share-option-card"
                                        style={{ '--hover-color': link.color }}
                                        onClick={() => setIsModalOpen(false)}
                                    >
                                        <div className="share-icon-wrapper">
                                            {link.icon}
                                        </div>
                                        <span>{link.name}</span>
                                    </a>
                                ))}
                                <button onClick={() => { copyToClipboard(); setIsModalOpen(false); }} className="share-option-card">
                                    <div className="share-icon-wrapper">
                                        <LinkIcon size={20} />
                                    </div>
                                    <span>Copiar</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShareHub;

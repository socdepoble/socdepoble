import React from 'react';
import { ExternalLink, MapPin, Users, Landmark } from 'lucide-react';
import './WikiPulseSheet.css';

const WikiPulseSheet = ({ wikiData, status }) => {
    if (!wikiData) return null;

    return (
        <div className="wiki-pulse-container institution-glass animate-in animate-slide-up">
            <div className="pulse-header">
                <div className="pulse-icon">
                    <BookOpen size={20} className="text-blue-400" />
                </div>
                <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-blue-400">Memòria Universal</h3>
                    <p className="text-[10px] opacity-50 uppercase tracking-tighter">Powered by Wikipedia</p>
                </div>
            </div>

            <div className="pulse-content">
                <p className="pulse-extract">
                    {wikiData.extract}
                </p>

                <div className="pulse-stats-grid">
                    {wikiData.coordinates && (
                        <div className="pulse-stat-item">
                            <MapPin size={14} className="opacity-50" />
                            <div className="stat-info">
                                <span className="stat-label">Ubicació</span>
                                <span className="stat-value">{wikiData.coordinates.lat.toFixed(3)}, {wikiData.coordinates.lon.toFixed(3)}</span>
                            </div>
                        </div>
                    )}
                    <div className="pulse-stat-item">
                        <Landmark size={14} className="opacity-50" />
                        <div className="stat-info">
                            <span className="stat-label">Entitat</span>
                            <span className="stat-value">{status || 'Municipi'}</span>
                        </div>
                    </div>
                </div>

                {wikiData.page_url && (
                    <a
                        href={wikiData.page_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pulse-link-btn"
                    >
                        <span>LLEGIR ARXIU COMPLET</span>
                        <ExternalLink size={14} />
                    </a>
                )}
            </div>
        </div>
    );
};

export default WikiPulseSheet;

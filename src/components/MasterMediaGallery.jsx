import React, { useState } from 'react';
import { Search, Filter, Grid, List, Shield, Users, Lock, Globe, Maximize2 } from 'lucide-react';
import ImageProjector from './ImageProjector';
import './MasterMediaGallery.css';
import '../design-system/nano_banana.css';

const MasterMediaGallery = ({ items = [], title, showFilters = true, layout = 'grid' }) => {
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [projectorIndex, setProjectorIndex] = useState(null);

    const filteredItems = items.filter(item => {
        const matchesFilter = selectedFilter === 'all' || item.context === selectedFilter || item.permissions === selectedFilter;
        const matchesSearch = !searchQuery ||
            (item.description?.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (item.context?.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesFilter && matchesSearch;
    });

    const getPermissionIcon = (perm) => {
        switch (perm) {
            case 'private': return <Lock size={12} />;
            case 'workgroup': return <Users size={12} />;
            case 'public': return <Globe size={12} />;
            default: return <Shield size={12} />;
        }
    };

    return (
        <div className="master-gallery-container">
            {(title || showFilters) && (
                <div className="gallery-header">
                    {title && <h2>{title}</h2>}
                    {showFilters && (
                        <div className="gallery-controls">
                            <div className="gallery-search">
                                <Search size={18} />
                                <input
                                    type="text"
                                    placeholder="Cercar actius..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="gallery-filter-chips">
                                <button className={selectedFilter === 'all' ? 'active' : ''} onClick={() => setSelectedFilter('all')}>Tots</button>
                                <button className={selectedFilter === 'public' ? 'active' : ''} onClick={() => setSelectedFilter('public')}>Públics</button>
                                <button className={selectedFilter === 'workgroup' ? 'active' : ''} onClick={() => setSelectedFilter('workgroup')}>Grup</button>
                                <button className={selectedFilter === 'private' ? 'active' : ''} onClick={() => setSelectedFilter('private')}>Privats</button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div className={`gallery-content ${layout}-view ${layout === 'trencadis' ? 'trencadis-container' : ''}`}>
                {filteredItems.length > 0 ? (
                    filteredItems.map((item, index) => (
                        layout === 'trencadis' ? (
                            <div
                                key={item.id || index}
                                className="trencadis-card"
                                onClick={() => setProjectorIndex(index)}
                            >
                                {item.asset?.url ? (
                                    <img src={item.asset.url} alt={item.context} loading="lazy" />
                                ) : (
                                    <div className="file-avatar">
                                        <span>{item.asset?.mime_type?.split('/')[1]?.toUpperCase() || 'FILE'}</span>
                                    </div>
                                )}
                                <div className="trencadis-overlay">
                                    <h3 className="trencadis-title">{item.context || 'Actiu'}</h3>
                                    {item.description && <span className="trencadis-context">{item.description}</span>}
                                </div>
                            </div>
                        ) : (
                            <div
                                key={item.id || index}
                                className="gallery-item-card"
                                onClick={() => setProjectorIndex(index)}
                            >
                                <div className="item-preview">
                                    {item.asset?.mime_type?.startsWith('image/') ? (
                                        <img src={item.asset.url} alt={item.context} loading="lazy" />
                                    ) : (
                                        <div className="file-avatar">
                                            <span>{item.asset?.mime_type?.split('/')[1]?.toUpperCase() || 'FILE'}</span>
                                        </div>
                                    )}
                                    <div className="item-overlay">
                                        <Maximize2 size={24} />
                                    </div>
                                    <div className="item-badges">
                                        <span className={`perm-badge ${item.permissions}`}>
                                            {getPermissionIcon(item.permissions)}
                                        </span>
                                    </div>
                                </div>
                                <div className="item-info">
                                    <div className="item-main-info">
                                        <h3>{item.context || 'Actiu Multimedia'}</h3>
                                        <p>{item.description || 'Sense descripció'}</p>
                                    </div>
                                    {item.user && (
                                        <div className="item-uploader">
                                            {item.user.avatar_url ? (
                                                <img src={item.user.avatar_url} alt={item.user.full_name} className="uploader-avatar" />
                                            ) : (
                                                <div className="uploader-avatar-placeholder">{item.user.full_name?.charAt(0)}</div>
                                            )}
                                            <span className="uploader-name">{item.user.full_name}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    ))
                ) : (
                    <div className="gallery-empty">
                        <p>No s'han trobat actius que coincideixin amb la cerca.</p>
                    </div>
                )}
            </div>

            {projectorIndex !== null && (
                <ImageProjector
                    items={filteredItems}
                    currentIndex={projectorIndex}
                    onClose={() => setProjectorIndex(null)}
                    onNavigate={(newIndex) => setProjectorIndex(newIndex)}
                />
            )}
        </div>
    );
};

export default MasterMediaGallery;

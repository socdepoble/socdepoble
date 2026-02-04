import React, { useState, useEffect } from 'react';
import { Pin, ArrowUp, ArrowDown, X, Save, Loader2, Sparkles, LayoutGrid, List } from 'lucide-react';
import { supabaseService } from '../services/supabaseService';
import { useAuth } from '../context/AuthContext';
import { hapticService } from '../services/hapticService';
import { logger } from '../utils/logger';
import './AdminPinnedManager.css';

const AdminPinnedManager = ({ type = 'post', onClose }) => {
    const { isSuperAdmin } = useAuth();
    const [pinnedItems, setPinnedItems] = useState([null, null, null]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        if (isSuperAdmin) {
            loadPinnedItems();
        }
    }, [isSuperAdmin, type]);

    const loadPinnedItems = async () => {
        setLoading(true);
        try {
            const result = type === 'post'
                ? await supabaseService.getPosts('tot', null, 0, 50)
                : await supabaseService.getMarketItems('tot', null, 0, 50);

            const items = result.data || [];
            const pins = [null, null, null];

            items.forEach(item => {
                if (item.pinned_position >= 1 && item.pinned_position <= 3) {
                    pins[item.pinned_position - 1] = item;
                }
            });

            setPinnedItems(pins);
        } catch (error) {
            logger.error('[AdminPinnedManager] Error loading pins:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (query.length < 3) {
            setSearchResults([]);
            return;
        }

        try {
            const result = type === 'post'
                ? await supabaseService.getPosts('tot', null, 0, 20)
                : await supabaseService.getMarketItems('tot', null, 0, 20);

            const filtered = (result.data || []).filter(item =>
                (item.content || item.title || '').toLowerCase().includes(query.toLowerCase())
            );
            setSearchResults(filtered);
        } catch (error) {
            logger.error('[AdminPinnedManager] Search error:', error);
        }
    };

    const assignPin = (item, position) => {
        const newPins = [...pinnedItems];
        newPins[position] = item;
        setPinnedItems(newPins);
        hapticService.bategat();
    };

    const removePin = (position) => {
        const newPins = [...pinnedItems];
        newPins[position] = null;
        setPinnedItems(newPins);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // This would ideally be a batch update in supabaseService
            for (let i = 0; i < 3; i++) {
                const item = pinnedItems[i];
                if (item) {
                    const id = item.uuid || item.id;
                    const payload = { pinned_position: i + 1, is_pinned: true };
                    if (type === 'post') {
                        await supabaseService.updatePost(id, payload, false);
                    } else {
                        await supabaseService.updateMarketItem(id, payload);
                    }
                }
            }
            hapticService.notifySuccess();
            if (onClose) onClose();
        } catch (error) {
            logger.error('[AdminPinnedManager] Save error:', error);
            alert('Error al guardar els pins. Revisa la connexió.');
        } finally {
            setSaving(false);
        }
    };

    if (!isSuperAdmin) return null;

    return (
        <div className="admin-pinned-manager animate-in-up">
            <header className="admin-pinned-header">
                <div className="header-title">
                    <Pin size={20} className="icon-gold" />
                    <h2 className="m3-headline-small">Gestor de Posicions Fixes</h2>
                </div>
                <button className="m3-icon-button" onClick={onClose}>
                    <X size={24} />
                </button>
            </header>

            <div className="admin-pinned-body">
                <p className="m3-body-medium description">
                    Fixa fins a 3 publicacions al capdamunt del {type === 'post' ? 'Mur' : 'Mercat'}.
                    Aquestes posicions tenen prioritat sobre la data.
                </p>

                <div className="pinned-slots">
                    {[0, 1, 2].map(i => (
                        <div key={i} className={`pin-slot pos-${i + 1} ${pinnedItems[i] ? 'occupied' : 'empty'}`}>
                            <div className="slot-badge">{i + 1}</div>
                            {pinnedItems[i] ? (
                                <div className="slot-content">
                                    <img src={pinnedItems[i].image_url?.[0] || pinnedItems[i].image_url} alt="" className="item-thumb" />
                                    <div className="item-info">
                                        <span className="item-title m3-label-large">{pinnedItems[i].title || pinnedItems[i].content?.substring(0, 30) + '...'}</span>
                                        <span className="item-author m3-label-small">{pinnedItems[i].author || pinnedItems[i].seller}</span>
                                    </div>
                                    <button className="remove-btn" onClick={() => removePin(i)}>
                                        <X size={16} />
                                    </button>
                                </div>
                            ) : (
                                <div className="slot-placeholder m3-label-medium">Buit</div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="search-section">
                    <div className="m3-search-bar">
                        <input
                            type="text"
                            placeholder={`Cerca ${type === 'post' ? 'posts' : 'productes'} per a fixar...`}
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                    </div>

                    <div className="search-results scrollable">
                        {loading ? (
                            <div className="loading-state"><Loader2 className="animate-spin" /></div>
                        ) : searchResults.length > 0 ? (
                            searchResults.map(item => (
                                <div key={item.id} className="search-item">
                                    <img src={item.image_url?.[0] || item.image_url} alt="" className="item-thumb" />
                                    <div className="item-info">
                                        <span className="item-title m3-label-medium">{item.title || item.content?.substring(0, 40) + '...'}</span>
                                        <span className="item-author m3-label-small">{item.author || item.seller}</span>
                                    </div>
                                    <div className="assign-actions">
                                        {[0, 1, 2].map(pos => (
                                            <button
                                                key={pos}
                                                className="m3-button-tonal slot-assign-btn"
                                                onClick={() => assignPin(item, pos)}
                                            >
                                                {pos + 1}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : searchQuery.length >= 3 ? (
                            <div className="empty-results m3-body-small">No s'han trobat bategats.</div>
                        ) : null}
                    </div>
                </div>
            </div>

            <footer className="admin-pinned-footer">
                <button className="m3-button-filled" onClick={handleSave} disabled={saving}>
                    {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    <span>GUARDAR POSICIONS</span>
                </button>
            </footer>
        </div>
    );
};

export default AdminPinnedManager;

import { useState } from 'react';
import './IconPicker.css';

const LUCIDE_SUGGESTIONS = [
    // Essentials
    'Home', 'User', 'Heart', 'Star', 'Bell', 'MapPin', 'Search', 'Settings', 'Shield',
    // Work & Business
    'Briefcase', 'Building', 'Store', 'Landmark', 'Factory', 'Hammer', 'Wrench', 'Lightbulb',
    // Community & Social
    'Users', 'UserPlus', 'MessagesSquare', 'Share2', 'Globe', 'Handshake', 'Gift', 'Info',
    // Nature & Rural
    'Trees', 'Leaf', 'Sprout', 'Flower2', 'Grape', 'Apple', 'Beef', 'Bird', 'Mountain', 'Waves', 
    'Sun', 'Moon', 'Cloud', 'CloudRain', 'Wind',
    // Tools & Media
    'Camera', 'Image', 'Video', 'Music', 'FileText', 'Folder', 'FolderOpen', 'Archive', 'Library',
    // Life & Hobbies
    'Tent', 'Utensils', 'Wine', 'Coffee', 'Pizza', 'Cake', 'Calendar', 'Clock', 'Compass',
    'Pocket', 'Book', 'BookOpen', 'GraduationCap', 'Rocket', 'Zap'
];

const EMOJI_SUGGESTIONS = [
    '🏺', '⚡️', '🚜', '🌿', '🥘', '🍊', '🏡', '⛪️', '🌄', '🌳', 
    '🐕', '🐑', '🍇', '🏠', '✨', '💎', '🔑', '📍', '📜', '🍎'
];

const IconPicker = ({ currentIcon, onSelect }) => {
    const [activeTab, setActiveTab] = useState('lucide');
    const [searchTerm, setSearchTerm] = useState('');
    const [customUrl, setCustomUrl] = useState('');

    const handleSelect = (iconName) => {
        onSelect(iconName);
    };

    const handleCustomSubmit = (e) => {
        if (e.key === 'Enter' || e.type === 'blur') {
            if (customUrl) handleSelect(customUrl);
        }
    };

    return (
        <div className="icon-picker-omega glass-premium">
            <header className="picker-tabs">
                <button 
                    className={`tab-btn ${activeTab === 'lucide' ? 'active' : ''}`}
                    onClick={() => setActiveTab('lucide')}
                >
                    <Sparkles size={16} /> Lucide
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'emoji' ? 'active' : ''}`}
                    onClick={() => setActiveTab('emoji')}
                >
                    <Smile size={16} /> Emojis
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'custom' ? 'active' : ''}`}
                    onClick={() => setActiveTab('custom')}
                >
                    <Globe size={16} /> Noun Project / URL
                </button>
            </header>

            <div className="picker-content">
                {activeTab === 'lucide' && (
                    <div className="tab-pane animate-in">
                        <div className="picker-search">
                            <Search size={14} className="search-icon" />
                            <input 
                                type="text" 
                                placeholder="Cerca icones Lucide..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="icon-grid">
                            {LUCIDE_SUGGESTIONS.filter(name => 
                                name.toLowerCase().includes(searchTerm.toLowerCase())
                            ).map(iconName => (
                                <button 
                                    key={iconName}
                                    className={`icon-btn ${currentIcon === iconName ? 'active' : ''}`}
                                    onClick={() => handleSelect(iconName)}
                                    title={iconName}
                                >
                                    <DynamicIcon name={iconName} size={24} />
                                    {currentIcon === iconName && <div className="selected-badge"><Check size={8} /></div>}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'emoji' && (
                    <div className="tab-pane animate-in">
                        <div className="icon-grid emoji-grid">
                            {EMOJI_SUGGESTIONS.map(emoji => (
                                <button 
                                    key={emoji}
                                    className={`icon-btn emoji-btn ${currentIcon === emoji ? 'active' : ''}`}
                                    onClick={() => handleSelect(emoji)}
                                >
                                    <span className="emoji-text">{emoji}</span>
                                    {currentIcon === emoji && <div className="selected-badge"><Check size={8} /></div>}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'custom' && (
                    <div className="tab-pane animate-in custom-pane">
                        <div className="custom-input-wrapper">
                            <input 
                                type="text" 
                                placeholder="Enganxa URL de Noun Project o icon name..." 
                                value={customUrl}
                                onChange={(e) => setCustomUrl(e.target.value)}
                                onKeyDown={handleCustomSubmit}
                                onBlur={handleCustomSubmit}
                            />
                            <p className="hint text-xs mt-2 opacity-50">
                                Protip: Pots usar noms de Lucide (icon:Home) o URLs directes de Noun Project.
                            </p>
                        </div>
                        {customUrl && (
                            <div className="custom-preview-box">
                                <p className="text-xs opacity-50 mb-2">Previsualització:</p>
                                <div className="preview-icon">
                                    <DynamicIcon name={customUrl} size={48} solid={true} />
                                </div>
                                <button 
                                    className="use-icon-btn master-button-canonic mt-4 w-full"
                                    onClick={() => handleSelect(customUrl)}
                                >
                                    Usar aquesta icona
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <footer className="picker-footer">
                <div className="current-selection">
                    <span className="text-xs opacity-50">Actual:</span>
                    <div className="current-preview">
                        <DynamicIcon name={currentIcon} size={20} />
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default IconPicker;

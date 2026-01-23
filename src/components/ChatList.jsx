import { Building2, Loader2, MapPin, User, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocial } from '../context/SocialContext';
import { isFictiveProfile, supabaseService } from '../services/supabaseService';
import { logger } from '../utils/logger';
import CategoryTabs from './CategoryTabs';
import UnifiedStatus from './UnifiedStatus';
import TownSelectorModal from './TownSelectorModal';
import './ChatList.css';

const GUEST_PREVIEW_IMAGE = '/assets/images/chat_preview_guest.png';

const getParticipantInfo = (chat, currentId, t) => {
    // Determine which participant is the "other" one
    const isP1Current = chat.participant_1_id === currentId;
    const otherInfo = isP1Current ? chat.p2_info : chat.p1_info;
    const otherType = isP1Current ? chat.participant_2_type : chat.participant_1_type;
    const otherRole = isP1Current ? chat.p2_role : chat.p1_role;
    const isOtherAI = isP1Current ? chat.p2_is_ai : chat.p1_is_ai;
    const otherId = isP1Current ? chat.participant_2_id : chat.participant_1_id;

    return {
        id: otherId,
        name: otherInfo?.name || t('common.unknown'),
        type: otherType,
        avatar: otherInfo?.avatar_url,
        role: otherRole,
        isAI: isOtherAI || otherRole === 'ambassador' || otherId?.startsWith('11111111-1111-4111-a111-')
    };
};

const getAvatarIcon = (type, avatarUrl) => {
    if (avatarUrl) {
        // Robust check: if it looks like a URL/path, render img. If it's short (emoji), render as text.
        const isUrl = avatarUrl.includes('://') || avatarUrl.includes('/') || avatarUrl.includes('.');
        if (isUrl) {
            return (
                <img
                    src={avatarUrl}
                    alt="Avatar"
                    className="avatar-img"
                    onError={(e) => {
                        e.target.style.display = 'none';
                        // We use the parent element to inject the fallback icon
                        const fallback = document.createElement('div');
                        fallback.className = 'avatar-placeholder';
                        fallback.innerHTML = type === 'entity' ? '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-building-2"><rect width="16" height="20" x="4" y="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M8 10h.01"/><path d="M16 10h.01"/><path d="M8 14h.01"/><path d="M16 14h.01"/></svg>' : '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
                        e.target.parentNode.appendChild(fallback);
                    }}
                />
            );
        }
        return <span className="avatar-emoji">{avatarUrl}</span>;
    }
    switch (type) {
        case 'entity': return <Building2 size={24} />;
        default: return <User size={24} />;
    }
};

const getAvatarColor = (type, avatarUrl) => {
    if (avatarUrl) {
        const isUrl = avatarUrl.includes('://') || avatarUrl.includes('/') || avatarUrl.includes('.');
        return isUrl ? 'transparent' : '#f0f0f0';
    }
    switch (type) {
        case 'entity': return 'var(--color-primary)';
        default: return '#999';
    }
};

const ChatList = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user, profile, impersonatedProfile, activeEntityId, isSuperAdmin, isPlayground } = useAuth();
    const { activeCategories } = useSocial();
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('xat');
    const [selectedTown, setSelectedTown] = useState(null);
    const [isTownModalOpen, setIsTownModalOpen] = useState(false);

    const chatTabs = [
        { id: 'xat', label: t('common.role_xat') },
        { id: 'gent', label: t('common.role_gent') },
        { id: 'grup', label: t('common.role_grup') },
        { id: 'treball', label: t('common.role_treball') },
        { id: 'pobo', label: t('common.role_pobo') }
    ].filter(tab => tab.id === 'xat' || activeCategories.includes(tab.id));

    // Fallback logic: if current category is disabled, go back to 'xat'
    useEffect(() => {
        if (selectedCategory !== 'xat' && selectedCategory !== 'pobo' && !activeCategories.includes(selectedCategory)) {
            setSelectedCategory('xat');
        }
    }, [activeCategories, selectedCategory]);

    // Si somos Super Admin y estamos personificando a alguien, usamos ese ID
    const currentId = activeEntityId || (isSuperAdmin && impersonatedProfile ? impersonatedProfile.id : user?.id);

    useEffect(() => {
        let isMounted = true;
        const fetchChats = async () => {
            if (!currentId) {
                setLoading(false);
                return;
            }

            logger.log('[ChatList] Fetching chats for currentId:', currentId);
            setError(null);
            try {
                // Fetch both real conversations and all possible AI personas
                const [dbConvs, allPersonas] = await Promise.all([
                    supabaseService.getConversations(currentId),
                    supabaseService.getAllPersonas(isPlayground)
                ]);

                if (!isMounted) return;

                // Create a map of personas by ID for quick access
                const personaMap = {};
                allPersonas.forEach(p => { personaMap[p.id] = p; });

                // Filter personas that are ambassadors (AI IAIAs)
                const ambassadors = allPersonas.filter(p =>
                    p.id.startsWith('11111111-1111-4111-a111-') || p.role === 'ambassador'
                );

                // Create a map of existing participant IDs to avoid duplicates
                const existingParticipantIds = new Set();
                dbConvs.forEach(c => {
                    existingParticipantIds.add(c.participant_1_id);
                    existingParticipantIds.add(c.participant_2_id);
                });

                // Convert ambassadors who don't have a chat yet into "virtual" conversations
                const virtualConvs = ambassadors
                    .filter(a => a.id !== currentId && !existingParticipantIds.has(a.id))
                    .map(a => ({
                        id: `new-iaia-${a.id}`,
                        last_message_content: t('chats.start_iaia') || `Hola! Sóc la ${a.full_name.split(' ')[0]}, vols que parlem?`,
                        last_message_at: new Date(0).toISOString(),
                        p1_info: { id: currentId, name: profile?.full_name || 'Jo' },
                        p2_info: { id: a.id, name: a.full_name, avatar_url: a.avatar_url, primary_town: a.primary_town, category: a.category },
                        participant_1_id: currentId,
                        participant_2_id: a.id,
                        participant_1_type: 'user',
                        participant_2_type: 'user',
                        p1_role: profile?.role || 'user',
                        p2_role: a.role || 'ambassador',
                        p1_is_ai: false,
                        p2_is_ai: true,
                        is_iaia: true
                    }));

                // Merge and filter based on category and playground rules
                let allMerged = [...dbConvs, ...virtualConvs];

                // Attach persona data to DB conversations for better filtering
                allMerged = allMerged.map(c => {
                    const otherInfo = c.participant_1_id === currentId ? c.p2_info : c.p1_info;
                    const persona = personaMap[otherInfo.id];
                    if (persona) {
                        return {
                            ...c,
                            other_town: persona.primary_town,
                            other_category: persona.category || (c.participant_1_id === currentId ? c.participant_2_type : c.participant_1_type)
                        };
                    }
                    return {
                        ...c,
                        other_town: otherInfo.primary_town,
                        other_category: (c.participant_1_id === currentId ? c.participant_2_type : c.participant_1_type)
                    };
                });

                // Optimized Filtering Logic (Single Pass)
                const inProduction = !isPlayground && !profile?.is_demo;

                const filtered = allMerged.filter(c => {
                    // 1. Production Security Filter
                    if (inProduction) {
                        const otherInfo = c.participant_1_id === currentId ? c.p2_info : c.p1_info;
                        const otherType = c.participant_1_id === currentId ? c.participant_2_type : c.participant_1_type;

                        const fictive = isFictiveProfile(otherInfo);
                        const isHuman = otherType === 'user' || otherType === 'person' || otherInfo.type === 'person';

                        if (fictive && !isHuman) return false;
                    }
                    // 1b. Playground specific NPC filtering
                    else if (isPlayground || profile?.is_demo) {
                        const other = getParticipantInfo(c, currentId, t);
                        const isLore = other.id?.startsWith('11111111-1111-4111-a111-');
                        if (!other.isAI && !isLore) return false;
                    }

                    // 2. Category Filter
                    if (selectedCategory !== 'xat' && selectedCategory !== 'pobo') {
                        if (c.other_category !== selectedCategory) return false;
                    }

                    // 3. Town Filter
                    if (selectedTown && c.other_town !== selectedTown.name) return false;

                    return true;
                });

                const mergedSorted = filtered.sort((a, b) => {
                    return new Date(b.last_message_at) - new Date(a.last_message_at);
                });

                setChats(mergedSorted);
            } catch (error) {
                if (isMounted) {
                    logger.error('[ChatList] Error fetching chats:', error);
                    setError(error.message);
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchChats();
        return () => { isMounted = false; };
    }, [currentId, selectedCategory, selectedTown, isPlayground]);

    const handleChatClick = async (chat) => {
        if (chat.id.startsWith('new-iaia-')) {
            const ambassadorId = chat.participant_2_id;
            try {
                // Create a real conversation in DB when first clicked
                const newConv = await supabaseService.getOrCreateConversation(
                    currentId, 'user', ambassadorId, 'user'
                );
                navigate(`/chats/${newConv.id}`);
            } catch (err) {
                logger.error('[ChatList] Error creating IAIA conversation:', err);
                // Fallback to navigating with virtual ID if DB fails
                navigate(`/chats/${chat.id}`);
            }
        } else {
            navigate(`/chats/${chat.id}`);
        }
    };

    const handleCategorySelect = (categoryId) => {
        if (categoryId === 'pobo') {
            setIsTownModalOpen(true);
        } else {
            setSelectedCategory(categoryId);
            setSelectedTown(null); // Clear town filter when switching to other categories
        }
    };

    if (error) {
        return (
            <div className="chat-list-container">
                <UnifiedStatus
                    type="error"
                    message={error}
                    onRetry={() => window.location.reload()}
                />
            </div>
        );
    }

    if (loading) {
        return (
            <div className="chat-list-container">
                <UnifiedStatus type="loading" message={t('chats.loading_chats')} />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="chat-list-container guest-view">
                <div className="guest-overlay">
                    <div className="guest-content">
                        <h2>{t('chats.registration_required_title', 'Xateja amb el teu poble')}</h2>
                        <p>{t('chats.registration_required_desc', 'Registra\'t per a connectar amb els teus veïns, entitats i comerços.')}</p>
                        <button className="auth-button register-cta" onClick={() => navigate('/register')}>
                            {t('auth.signUp')}
                        </button>
                    </div>
                </div>
                <div className="guest-preview-wrapper">
                    <img src={GUEST_PREVIEW_IMAGE} alt="Chat Preview" className="guest-preview-img" />
                    <div className="preview-blur-overlay"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="chat-list-container">
            <header className="page-header-with-tabs">
                <div className="header-tabs-wrapper">
                    <CategoryTabs
                        selectedRole={selectedCategory}
                        onSelectRole={handleCategorySelect}
                        tabs={chatTabs}
                    />
                </div>
                {selectedTown && (
                    <div className="active-filters">
                        <div className="filter-badge town">
                            <MapPin size={12} />
                            <span>{selectedTown.name}</span>
                            <button className="remove-filter" onClick={() => setSelectedTown(null)}>
                                <X size={12} />
                            </button>
                        </div>
                    </div>
                )}
            </header>
            <div className="chat-list">
                {!Array.isArray(chats) || chats.length === 0 ? (
                    <UnifiedStatus
                        type="empty"
                        message={selectedTown ? t('chats.empty_town', `No hi ha xats en ${selectedTown.name}`) : t('chats.empty')}
                    />
                ) : (
                    chats.map(chat => {
                        const otherParticipant = getParticipantInfo(chat, currentId, t);
                        const isIAIA = chat.is_iaia ||
                            otherParticipant.isAI ||
                            otherParticipant.name?.includes('IAIA') ||
                            otherParticipant.id?.startsWith('11111111-1111-4111-a111-');

                        return (
                            <div key={chat.id} className="chat-item" onClick={() => handleChatClick(chat)}>
                                <div className="chat-avatar" style={{ backgroundColor: getAvatarColor(otherParticipant.type, otherParticipant.avatar) }}>
                                    {getAvatarIcon(otherParticipant.type, otherParticipant.avatar)}
                                </div>
                                <div className="chat-content">
                                    <div className="chat-header">
                                        <div className="chat-name-row">
                                            <span className="chat-name">{otherParticipant.name}</span>
                                            {isIAIA && <span className="identity-badge ai" title="Informació i Acció Artificial" style={{ marginLeft: '8px', fontSize: '9px' }}>IAIA</span>}
                                        </div>
                                        <span className="chat-time">
                                            {chat.last_message_at !== new Date(0).toISOString()
                                                ? new Date(chat.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                                : `${Math.floor(Math.random() * 12) + 1}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')} p. m.`}
                                        </span>
                                    </div>
                                    <div className="chat-preview">
                                        <span className="chat-message">{chat.last_message_content || t('common.write_message')}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <TownSelectorModal
                isOpen={isTownModalOpen}
                onClose={() => setIsTownModalOpen(false)}
                onSelect={(town) => {
                    setSelectedTown(town);
                    setSelectedCategory('pobo');
                }}
            />
        </div>
    );
};

export default ChatList;

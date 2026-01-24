import { useState, useEffect } from 'react';
import { X, Users, Search, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabaseService } from '../services/supabaseService';
import groupChatService from '../services/groupChatService';
import { logger } from '../utils/logger';
import Avatar from './Avatar';
import './GroupCreationModal.css';

const GroupCreationModal = ({ isOpen, onClose, onGroupCreated }) => {
    const { user } = useAuth();
    const [step, setStep] = useState(1); // 1: Name, 2: Members
    const [groupName, setGroupName] = useState('');
    const [groupDescription, setGroupDescription] = useState('');
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [availableUsers, setAvailableUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        if (isOpen && step === 2) {
            fetchAvailableUsers();
        }
    }, [isOpen, step]);

    const fetchAvailableUsers = async () => {
        setLoading(true);
        try {
            // Get user's connections as potential members
            const connections = await supabaseService.getUserConnections(user.id);
            setAvailableUsers(connections || []);
        } catch (error) {
            logger.error('[GroupCreationModal] Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateGroup = async () => {
        if (!groupName.trim()) return;

        setCreating(true);
        try {
            const memberIds = selectedMembers.map(m => m.user_id);
            const group = await groupChatService.createGroup(
                user.id,
                groupName.trim(),
                groupDescription.trim() || null,
                memberIds
            );

            logger.log('[GroupCreationModal] Group created:', group);

            // Reset form
            setGroupName('');
            setGroupDescription('');
            setSelectedMembers([]);
            setStep(1);

            onGroupCreated && onGroupCreated(group);
            onClose();
        } catch (error) {
            logger.error('[GroupCreationModal] Error creating group:', error);
            alert('Error creant el grup. Intenta-ho de nou.');
        } finally {
            setCreating(false);
        }
    };

    const toggleMember = (user) => {
        setSelectedMembers(prev => {
            const exists = prev.find(m => m.user_id === user.user_id);
            if (exists) {
                return prev.filter(m => m.user_id !== user.user_id);
            } else {
                return [...prev, user];
            }
        });
    };

    const filteredUsers = availableUsers.filter(u =>
        u.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.username?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content group-creation-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>
                        <Users size={24} />
                        {step === 1 ? 'Crear Grup Nou' : 'Afegir Membres'}
                    </h2>
                    <button className="close-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <div className="modal-body">
                    {step === 1 ? (
                        <div className="group-info-step">
                            <div className="form-group">
                                <label htmlFor="group-name">Nom del Grup *</label>
                                <input
                                    id="group-name"
                                    type="text"
                                    value={groupName}
                                    onChange={(e) => setGroupName(e.target.value)}
                                    placeholder="Ex: Amics del poble, Veïns de carrer..."
                                    maxLength={100}
                                    autoFocus
                                />
                                <small>{groupName.length}/100</small>
                            </div>

                            <div className="form-group">
                                <label htmlFor="group-desc">Descripció (opcional)</label>
                                <textarea
                                    id="group-desc"
                                    value={groupDescription}
                                    onChange={(e) => setGroupDescription(e.target.value)}
                                    placeholder="Descriu de què va el grup..."
                                    rows={3}
                                    maxLength={500}
                                />
                                <small>{groupDescription.length}/500</small>
                            </div>
                        </div>
                    ) : (
                        <div className="members-selection-step">
                            <div className="search-box">
                                <Search size={20} />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Cercar persones..."
                                />
                            </div>

                            <div className="selected-members-preview">
                                {selectedMembers.length > 0 ? (
                                    <>
                                        <p className="selected-count">
                                            {selectedMembers.length} {selectedMembers.length === 1 ? 'membre seleccionat' : 'membres seleccionats'}
                                        </p>
                                        <div className="selected-chips">
                                            {selectedMembers.map(member => (
                                                <div key={member.user_id} className="member-chip">
                                                    <Avatar
                                                        src={member.avatar_url}
                                                        name={member.full_name}
                                                        size={24}
                                                    />
                                                    <span>{member.full_name}</span>
                                                    <button onClick={() => toggleMember(member)}>
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <p className="no-selection">Selecciona almenys un membre per al grup</p>
                                )}
                            </div>

                            <div className="available-users-list">
                                {loading ? (
                                    <div className="loading-state">
                                        <Loader2 className="spinner" size={32} />
                                        <p>Carregant contactes...</p>
                                    </div>
                                ) : filteredUsers.length === 0 ? (
                                    <p className="empty-state">
                                        {searchQuery ? 'No s\'han trobat resultats' : 'Connecta amb veïns per crear grups'}
                                    </p>
                                ) : (
                                    filteredUsers.map(availableUser => {
                                        const isSelected = selectedMembers.some(m => m.user_id === availableUser.user_id);
                                        return (
                                            <div
                                                key={availableUser.user_id}
                                                className={`user-item ${isSelected ? 'selected' : ''}`}
                                                onClick={() => toggleMember(availableUser)}
                                            >
                                                <Avatar
                                                    src={availableUser.avatar_url}
                                                    name={availableUser.full_name}
                                                    size={40}
                                                />
                                                <div className="user-info">
                                                    <p className="user-name">{availableUser.full_name}</p>
                                                    {availableUser.username && (
                                                        <p className="user-username">@{availableUser.username}</p>
                                                    )}
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    readOnly
                                                />
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="modal-footer">
                    {step === 1 ? (
                        <>
                            <button className="btn-secondary" onClick={onClose}>
                                Cancel·lar
                            </button>
                            <button
                                className="btn-primary"
                                onClick={() => setStep(2)}
                                disabled={!groupName.trim()}
                            >
                                Següent
                            </button>
                        </>
                    ) : (
                        <>
                            <button className="btn-secondary" onClick={() => setStep(1)}>
                                Enrere
                            </button>
                            <button
                                className="btn-primary"
                                onClick={handleCreateGroup}
                                disabled={creating}
                            >
                                {creating ? (
                                    <>
                                        <Loader2 className="spinner" size={16} />
                                        Creant...
                                    </>
                                ) : (
                                    'Crear Grup'
                                )}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GroupCreationModal;

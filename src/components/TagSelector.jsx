import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, X, Tag as TagIcon, Check, Loader2, Trash2, Sparkles } from 'lucide-react';
import { supabaseService } from '../services/supabaseService';
import { useAuth } from '../context/AuthContext';
import { logger } from '../utils/logger';
import './TagSelector.css';

const TagSelector = ({ currentTags = [], onTagsChange }) => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [availableTags, setAvailableTags] = useState([]);
    const [newTagName, setNewTagName] = useState('');
    const [loading, setLoading] = useState(false);
    const [isAdding, setIsAdding] = useState(false);

    const loadUserTags = useCallback(async () => {
        try {
            const tags = await supabaseService.getUserTags(user.id);
            setAvailableTags(Array.isArray(tags) ? tags : []);
        } catch (error) {
            logger.error('Error loading tags:', error);
        }
    }, [user?.id]);

    useEffect(() => {
        if (user) {
            loadUserTags();
        }
    }, [user, loadUserTags]);

    const toggleTag = (tag) => {
        const isSelected = currentTags.includes(tag);
        const newTags = isSelected
            ? currentTags.filter(t => t !== tag)
            : [...currentTags, tag];
        onTagsChange(newTags);
    };

    const handleAddTag = async (e) => {
        e.preventDefault();
        const name = newTagName.trim().toLowerCase();
        if (!name) return;

        if (availableTags.includes(name)) {
            if (!currentTags.includes(name)) toggleTag(name);
            setNewTagName('');
            setIsAdding(false);
            return;
        }

        setLoading(true);
        try {
            await supabaseService.addUserTag(user.id, name);
            setAvailableTags(prev => [...prev, name].sort());
            toggleTag(name);
            setNewTagName('');
            setIsAdding(false);
        } catch (error) {
            logger.error('Error adding tag:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTag = async (e, tag) => {
        e.stopPropagation();
        if (!window.confirm(t('feed.confirm_delete_tag') || `Vols esborrar l'etiqueta "${tag}" del teu diccionari?`)) return;

        try {
            await supabaseService.deleteUserTag(user.id, tag);
            setAvailableTags(prev => prev.filter(t => t !== tag));
            if (currentTags.includes(tag)) {
                onTagsChange(currentTags.filter(t => t !== tag));
            }
        } catch (error) {
            logger.error('Error deleting tag:', error);
        }
    };

    return (
        <div className="tag-selector">
            <div className="tag-selector-header">
                <TagIcon size={14} />
                <span>{t('feed.personal_tags') || 'Etiquetes privades'}</span>
            </div>

            <div className="tags-container">
                {Array.isArray(availableTags) && availableTags.map(tag => (
                    <div
                        key={tag}
                        className={`tag-item-wrapper ${currentTags.includes(tag) ? 'selected' : ''}`}
                        onClick={() => toggleTag(tag)}
                    >
                        <button className="tag-item-btn">
                            {tag}
                            {currentTags.includes(tag) && <Check size={12} />}
                        </button>
                        <button
                            className="delete-tag-action"
                            onClick={(e) => handleDeleteTag(e, tag)}
                            title="Esborrar"
                        >
                            <Trash2 size={12} />
                        </button>
                    </div>
                ))}

                {!isAdding ? (
                    <button className="add-tag-btn" onClick={() => setIsAdding(true)} title="Afegir etiqueta">
                        <Plus size={14} />
                    </button>
                ) : (
                    <form onSubmit={handleAddTag} className="add-tag-form">
                        <input
                            type="text"
                            value={newTagName}
                            onChange={(e) => setNewTagName(e.target.value)}
                            placeholder={t('feed.new_tag_placeholder') || '...'}
                            autoFocus
                            onBlur={() => !newTagName && setIsAdding(false)}
                        />
                        <button type="submit" disabled={loading}>
                            {loading ? <Loader2 size={12} className="spinner" /> : <Check size={14} />}
                        </button>
                        <button type="button" onClick={() => setIsAdding(false)}>
                            <X size={14} />
                        </button>
                    </form>
                )}
            </div>

            {/* [PROTOCOL ARMARI NET] RECOMANACIONS DE L'IAIA */}
            <div className="iaia-recommendations p-4 mt-6 bg-[rgba(255,109,35,0.05)] border border-[rgba(255,109,35,0.2)] rounded-[28px] relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Sparkles size={40} color="#FF6D23" />
                </div>
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-[28px] bg-[var(--sdp-terracotta)] flex items-center justify-center text-white shadow-lg">
                        <Sparkles size={16} />
                    </div>
                    <div>
                        <h4 className="text-[11px] font-black uppercase tracking-widest text-[var(--sdp-terracotta)]">IAIA: Armari Net</h4>
                        <p className="text-[10px] text-gray-400 italic">"Deixa que t'organitze les idees, bonico..."</p>
                    </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                    {['#territori', '#proximitat', '#sobirania', '#família'].map(rec => (
                        <button 
                            key={rec}
                            className={`px-3 py-1.5 rounded-full border border-dashed border-[var(--sdp-terracotta)]/30 text-[var(--sdp-terracotta)] text-[11px] font-bold hover:bg-[var(--sdp-terracotta)]/10 transition-all ${currentTags.includes(rec) ? 'bg-[var(--sdp-terracotta)]/20 border-solid opacity-50' : ''}`}
                            onClick={() => !currentTags.includes(rec) && toggleTag(rec)}
                            disabled={currentTags.includes(rec)}
                        >
                            {rec}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TagSelector;

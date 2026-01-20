import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, X, Tag as TagIcon, Check, Loader2, Trash2 } from 'lucide-react';
import { supabaseService } from '../services/supabaseService';
import { useAppContext } from '../context/AppContext';
import './TagSelector.css';

const TagSelector = ({ currentTags = [], onTagsChange }) => {
    const { t } = useTranslation();
    const { user } = useAppContext();
    const [availableTags, setAvailableTags] = useState([]);
    const [newTagName, setNewTagName] = useState('');
    const [loading, setLoading] = useState(false);
    const [isAdding, setIsAdding] = useState(false);

    const loadUserTags = useCallback(async () => {
        try {
            const tags = await supabaseService.getUserTags(user.id);
            setAvailableTags(Array.isArray(tags) ? tags : []);
        } catch (error) {
            console.error('Error loading tags:', error);
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
            console.error('Error adding tag:', error);
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
            console.error('Error deleting tag:', error);
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
        </div>
    );
};

export default TagSelector;

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, X, Tag as TagIcon, Check, Loader2 } from 'lucide-react';
import { supabaseService } from '../services/supabaseService';
import { useAppContext } from '../context/AppContext';
import './TagSelector.css';

const TagSelector = ({ postId, currentTags = [], onTagsChange }) => {
    const { t } = useTranslation();
    const { user } = useAppContext();
    const [availableTags, setAvailableTags] = useState([]);
    const [newTagName, setNewTagName] = useState('');
    const [loading, setLoading] = useState(false);
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        if (user) {
            loadUserTags();
        }
    }, [user]);

    const loadUserTags = async () => {
        try {
            const tags = await supabaseService.getUserTags(user.id);
            setAvailableTags(tags);
        } catch (error) {
            console.error('Error loading tags:', error);
        }
    };

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
        if (!name || availableTags.includes(name)) {
            if (name && !currentTags.includes(name)) {
                toggleTag(name);
            }
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

    return (
        <div className="tag-selector">
            <div className="tag-selector-header">
                <TagIcon size={14} />
                <span>{t('feed.personal_tags') || 'Etiquetes privades'}</span>
            </div>

            <div className="tags-container">
                {availableTags.map(tag => (
                    <button
                        key={tag}
                        className={`tag-item ${currentTags.includes(tag) ? 'selected' : ''}`}
                        onClick={() => toggleTag(tag)}
                    >
                        {tag}
                        {currentTags.includes(tag) && <Check size={12} />}
                    </button>
                ))}

                {!isAdding ? (
                    <button className="add-tag-btn" onClick={() => setIsAdding(true)}>
                        <Plus size={14} />
                    </button>
                ) : (
                    <form onSubmit={handleAddTag} className="add-tag-form">
                        <input
                            type="text"
                            value={newTagName}
                            onChange={(e) => setNewTagName(e.target.value)}
                            placeholder={t('feed.new_tag') || 'Nueva...'}
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

import React, { useState, useEffect, useCallback } from 'react';
import { X, Clock, RotateCcw, AlertTriangle, User } from 'lucide-react';
import { supabase } from '../supabaseClient';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';

const HistoryModal = ({ isOpen, onClose, pageId, onRestore }) => {
    const [versions, setVersions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedVersionId, setSelectedVersionId] = useState(null);

    const fetchVersions = useCallback(async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('cms_page_versions')
                .select('id, title, subtitle, created_at, author_id, html_content')
                .eq('page_id', pageId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setVersions(data || []);
        } catch (error) {
            console.error('Error fetching version history:', error);
        } finally {
            setIsLoading(false);
        }
    }, [pageId]);

    useEffect(() => {
        if (isOpen && pageId) {
            fetchVersions();
        }
    }, [isOpen, pageId, fetchVersions]);

    const handleRestoreClick = () => {
        if (!selectedVersionId) return;
        const selectedVersion = versions.find(v => v.id === selectedVersionId);
        
        if (selectedVersion && window.confirm("Estás segur de voler restaurar aquesta versió? Aquest canvi serà visible de immediat si ho guardes.")) {
            onRestore(selectedVersion.html_content, selectedVersion.title, selectedVersion.subtitle);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm sm:items-center sm:p-0">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-2xl bg-[var(--bg-panel)] rounded-2xl shadow-2xl overflow-hidden border border-[var(--border-master)] max-h-[85vh] flex flex-col"
                >
                    <div className="flex items-center justify-between p-5 border-b border-[var(--border-master)] bg-gradient-to-r from-[var(--theme-accent-primary)]/10 to-transparent">
                        <div className="flex items-center gap-3">
                            <Clock className="text-[var(--theme-accent-primary)]" size={24} />
                            <h2 className="text-xl font-black uppercase tracking-tight text-[var(--text-main)]">Historial de Versions</h2>
                        </div>
                        <button 
                            onClick={onClose}
                            className="p-2 bg-[var(--bg-app)] text-[var(--text-muted)] hover:text-white rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-6 overflow-y-auto flex-1">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-10">
                                <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--theme-accent-primary)]"></span>
                            </div>
                        ) : versions.length === 0 ? (
                            <div className="text-center py-10 opacity-60">
                                <AlertTriangle className="mx-auto mb-3" size={32} />
                                <p>No hi ha un historial de versions per a aquesta pàgina encara.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {versions.map((v, idx) => {
                                    const isCurrent = idx === 0;
                                    const dateObj = new Date(v.created_at);
                                    const formattedDate = dateObj.toLocaleDateString('ca-ES', { 
                                        day: '2-digit', month: 'short', year: 'numeric', 
                                        hour: '2-digit', minute: '2-digit' 
                                    });

                                    return (
                                        <div 
                                            key={v.id} 
                                            onClick={() => !isCurrent && setSelectedVersionId(v.id)}
                                            className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between transition-all ${
                                                isCurrent ? 'bg-[var(--theme-accent-primary)]/10 border-[var(--theme-accent-primary)]/50 cursor-default' : 
                                                selectedVersionId === v.id ? 'bg-[var(--bg-app)] border-[var(--theme-accent-primary)] cursor-pointer' : 
                                                'bg-[var(--bg-app)] border-[var(--border-master)] hover:border-white/20 cursor-pointer'
                                            }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="mt-1 bg-black/40 p-2 rounded-full">
                                                    {isCurrent ? <Clock size={16} className="text-[var(--theme-accent-primary)]" /> : <User size={16} />}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-[var(--text-main)] flex items-center gap-2">
                                                        {formattedDate} 
                                                        {isCurrent && <span className="text-[10px] bg-[var(--theme-accent-primary)] text-black px-2 py-0.5 rounded-full uppercase tracking-wider">Actual</span>}
                                                    </p>
                                                    <p className="text-xs text-[var(--text-muted)] line-clamp-1 mt-1">
                                                        {v.title || 'Sense títol'} {v.subtitle ? ` - ${v.subtitle}` : ''}
                                                    </p>
                                                    <p className="text-xs font-mono text-[var(--text-muted)] opacity-60 mt-2">
                                                        By: {v.author_id ? 'Author ID: ' + v.author_id.substring(0, 8) + '...' : 'Auto / Unknown'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="p-5 border-t border-[var(--border-master)] bg-[var(--bg-panel)] flex justify-end gap-3">
                        <button 
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-lg font-bold uppercase tracking-wider text-sm transition-colors hover:bg-white/5"
                        >
                            Cancel·lar
                        </button>
                        <button 
                            onClick={handleRestoreClick}
                            disabled={!selectedVersionId}
                            className={`px-5 py-2.5 rounded-lg font-bold uppercase tracking-wider text-sm flex items-center gap-2 transition-colors ${
                                selectedVersionId 
                                    ? 'bg-[var(--theme-accent-primary)] text-black hover:bg-[var(--theme-accent-primary)]/90' 
                                    : 'bg-white/10 text-white/40 cursor-not-allowed'
                            }`}
                        >
                            <RotateCcw size={18} /> Restaurar Versió
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default HistoryModal;

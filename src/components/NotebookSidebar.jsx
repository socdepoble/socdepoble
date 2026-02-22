import React, { useState } from 'react';
import { Folder, FolderPlus, Tag, ChevronRight, ChevronDown, Plus, Trash2, Edit2, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const NotebookSidebar = ({ 
    folders, 
    activeFolder, 
    onSelectFolder, 
    onAddFolder, 
    onDeleteFolder,
    categories,
    activeCategory,
    onSelectCategory
}) => {
    const { t } = useTranslation();
    const [expandedFolders, setExpandedFolders] = useState({});

    const toggleExpand = (id, e) => {
        e.stopPropagation();
        setExpandedFolders(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const renderFolder = (folder, depth = 0) => {
        const isExpanded = expandedFolders[folder.id];
        const isActive = activeFolder === folder.id;
        const children = folders.filter(f => f.parentId === folder.id);

        return (
            <div key={folder.id} className="folder-item-wrapper">
                <div 
                    className={`folder-item flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all ${isActive ? 'bg-orange-600/20 text-orange-400' : 'hover:bg-white/5 text-gray-400'}`}
                    style={{ paddingLeft: `${depth * 12 + 12}px` }}
                    onClick={() => onSelectFolder(folder.id)}
                >
                    <div className="flex items-center gap-2 overflow-hidden">
                        {children.length > 0 ? (
                            <button onClick={(e) => toggleExpand(folder.id, e)} className="p-0.5 hover:bg-white/10 rounded">
                                {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                            </button>
                        ) : <div className="w-5" />}
                        <Folder size={16} fill={isActive ? "currentColor" : "none"} className="shrink-0" />
                        <span className="text-xs font-bold truncate">{folder.name}</span>
                    </div>
                    {isActive && (
                        <button 
                            onClick={(e) => { e.stopPropagation(); onDeleteFolder(folder.id); }}
                            className="p-1 hover:text-red-500 opacity-40 hover:opacity-100 transition-opacity"
                        >
                            <Trash2 size={12} />
                        </button>
                    )}
                </div>
                {isExpanded && children.map(child => renderFolder(child, depth + 1))}
            </div>
        );
    };

    const rootFolders = folders.filter(f => !f.parentId);

    return (
        <div className="notebook-sidebar w-64 h-full bg-[#0a0a0a] border-r border-white/5 flex flex-col p-4">
            <header className="flex items-center justify-between mb-6 px-2">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">{t('notebook.library') || 'BIBLIOTECA'}</h3>
                <button 
                    onClick={() => onAddFolder(activeFolder)}
                    className="p-1.5 hover:bg-white/5 rounded-lg text-orange-500 transition-all active:scale-90"
                    title={t('notebook.new_folder') || 'Nova Carpeta'}
                >
                    <FolderPlus size={16} />
                </button>
            </header>

            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1">
                {rootFolders.map(folder => renderFolder(folder))}
                {rootFolders.length === 0 && (
                    <p className="text-[10px] text-center opacity-20 py-4 italic font-bold">{t('notebook.empty_folders') || 'Cap carpeta bategada...'}</p>
                )}
                
                <div className="mt-4 pt-4 border-t border-white/5 opacity-60">
                    <div 
                        className={`folder-item flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all ${activeFolder === 'trash' ? 'bg-red-600/20 text-red-500' : 'hover:bg-red-500/5 text-gray-500'}`}
                        onClick={() => onSelectFolder('trash')}
                    >
                        <Trash2 size={14} />
                        <span className="text-[11px] font-black uppercase tracking-wider">{t('notebook.trash.bucket')}</span>
                    </div>
                </div>
            </div>

            <div className="mt-8 border-t border-white/5 pt-6">
                <header className="flex items-center justify-between mb-4 px-2">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">{t('notebook.trellat_title') || 'TRELLAT'}</h3>
                </header>
                <div className="space-y-1">
                    {categories.map(cat => (
                        <div 
                            key={cat}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all ${activeCategory === cat ? 'bg-fuchsia-600/20 text-fuchsia-400' : 'hover:bg-white/5 text-gray-500'}`}
                            onClick={() => onSelectCategory(cat)}
                        >
                            <Tag size={14} />
                            <span className="text-[11px] font-black uppercase tracking-wider">{t(`notebook.categories.${cat.toLowerCase()}`) || cat}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-auto pt-6 border-t border-white/5">
                <div className="bg-orange-600/10 rounded-2xl p-4 border border-orange-500/20">
                    <p className="text-[9px] font-black uppercase text-orange-400 mb-2 leading-tight">Sincronització Archon</p>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-500 w-[80%]" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotebookSidebar;

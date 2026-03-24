import React, { useState } from 'react';
import { Folder, FolderPlus, Tag, ChevronRight, ChevronDown, Plus, Trash2, Edit2, Search, Menu } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const NotebookSidebar = ({ 
    folders, 
    activeFolder, 
    onSelectFolder, 
    onAddFolder, 
    onDeleteFolder,
    categories,
    activeCategory,
    onSelectCategory,
    isCollapsed,
    onToggleCollapse
}) => {
    const { t } = useTranslation();
    const [expandedFolders, setExpandedFolders] = useState({});

    const bgColor = 'bg-orange-50/40 dark:bg-[#050B14] border-orange-200/50 dark:border-indigo-900/40';
    const textColor = 'text-orange-950/80 dark:text-indigo-200/80';
    const hoverBg = 'hover:bg-orange-100/60 dark:hover:bg-indigo-900/30';
    const titleColor = 'text-orange-800/50 dark:text-indigo-400/50';

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
                    className={`folder-item flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all ${isActive ? 'bg-orange-100/80 text-orange-600 dark:bg-orange-600/20 dark:text-orange-400' : `${hoverBg} ${textColor}`}`}
                    style={{ paddingLeft: isCollapsed ? '12px' : `${depth * 12 + 12}px` }}
                    onClick={() => onSelectFolder(folder.id)}
                    title={folder.name}
                >
                    <div className="flex items-center gap-2 overflow-hidden">
                        {(children.length > 0 && !isCollapsed) ? (
                            <button onClick={(e) => toggleExpand(folder.id, e)} className="p-0.5 rounded hover:bg-orange-200/50 dark:hover:bg-indigo-800/50">
                                {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                            </button>
                        ) : (!isCollapsed && <div className="w-5" />)}
                        <Folder size={20} fill={isActive ? "currentColor" : "none"} className={`shrink-0 ${isActive ? 'text-orange-600 dark:text-orange-500' : 'text-orange-900/60 dark:text-indigo-300/60'}`} />
                        {!isCollapsed && <span className="text-sm font-bold truncate">{folder.name}</span>}
                    </div>
                    {!isCollapsed && isActive && (
                        <button 
                            onClick={(e) => { e.stopPropagation(); onDeleteFolder(folder.id); }}
                            className="p-1 hover:text-red-500 opacity-40 hover:opacity-100 transition-opacity"
                        >
                            <Trash2 size={12} />
                        </button>
                    )}
                </div>
                {!isCollapsed && isExpanded && children.map(child => renderFolder(child, depth + 1))}
            </div>
        );
    };

    const rootFolders = folders.filter(f => !f.parentId);

    return (
        <div className={`notebook-sidebar transition-all duration-300 ${isCollapsed ? 'w-[70px] px-2' : 'w-64 px-4'} shrink-0 h-full ${bgColor} border-r flex flex-col py-4 z-20`}>
            <header className={`flex items-center ${isCollapsed ? 'justify-center flex-col gap-4' : 'justify-between'} mb-6 px-2`}>
                <button onClick={onToggleCollapse} className="p-1.5 hover:bg-orange-500/10 rounded-[20px] text-orange-950/80 dark:text-indigo-200/80 transition-all">
                    <Menu size={20} />
                </button>
                {!isCollapsed && <h3 className={`text-[11px] font-black uppercase tracking-[0.2em] ${titleColor}`}>{t('notebook.library') || 'BIBLIOTECA'}</h3>}
                <button 
                    onClick={() => onAddFolder(activeFolder)}
                    className="p-1.5 hover:bg-orange-500/10 rounded-[20px] text-orange-500 transition-all active:scale-90"
                    title={t('notebook.new_folder') || 'Nova Carpeta'}
                >
                    <FolderPlus size={isCollapsed ? 24 : 16} />
                </button>
            </header>

            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1">
                {rootFolders.map(folder => renderFolder(folder))}
                {rootFolders.length === 0 && (
                    <p className="text-[11px] text-center opacity-20 py-4 italic font-bold">{t('notebook.empty_folders') || 'Cap carpeta bategada...'}</p>
                )}
                
                <div className={`mt-4 pt-4 border-t border-orange-200/50 dark:border-indigo-900/40 ${isCollapsed ? 'opacity-100' : 'opacity-80'}`}>
                    <div 
                        className={`folder-item flex items-center ${isCollapsed ? 'justify-center py-3' : 'gap-3 px-3 py-2'} rounded-lg cursor-pointer transition-all ${activeFolder === 'trash' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'hover:bg-red-50 text-orange-900/60 dark:hover:bg-red-900/20 dark:text-indigo-300/60'}`}
                        onClick={() => onSelectFolder('trash')}
                        title={t('notebook.trash.bucket')}
                    >
                        <Trash2 size={20} className={activeFolder !== 'trash' ? 'text-orange-900/50 dark:text-indigo-300/50' : ''} />
                        {!isCollapsed && <span className="text-sm font-black uppercase tracking-wider">{t('notebook.trash.bucket')}</span>}
                    </div>
                </div>
            </div>

            <div className={`mt-8 border-t border-orange-200/50 dark:border-indigo-900/40 pt-6`}>
                {!isCollapsed && (
                    <header className="flex items-center justify-between mb-4 px-2">
                        <h3 className={`text-[11px] font-black uppercase tracking-[0.2em] ${titleColor}`}>{t('notebook.categories_title') || 'CATEGORIES'}</h3>
                    </header>
                )}
                <div className="space-y-1">
                    {categories.map(cat => (
                        <div 
                            key={cat}
                            className={`flex items-center ${isCollapsed ? 'justify-center py-3' : 'gap-3 px-3 py-2'} rounded-lg cursor-pointer transition-all ${activeCategory === cat ? 'bg-fuchsia-100 text-fuchsia-600 dark:bg-fuchsia-900/30 dark:text-fuchsia-400' : `${hoverBg} ${textColor}`}`}
                            onClick={() => onSelectCategory(cat)}
                            title={cat}
                        >
                            <Tag size={20} className={activeCategory !== cat ? 'text-orange-900/50 dark:text-indigo-300/50' : ''} />
                            {!isCollapsed && <span className="text-sm font-black uppercase tracking-wider">{t(`notebook.categories.${cat.toLowerCase()}`) || cat}</span>}
                        </div>
                    ))}
                </div>
            </div>

            <div className={`mt-auto pt-6 border-t border-orange-200/50 dark:border-indigo-900/40`}>
                <div className={`rounded-[28px] ${isCollapsed ? 'p-2' : 'p-4'} bg-orange-100/50 border-orange-200/60 dark:bg-indigo-900/30 dark:border-indigo-500/20 border`}>
                    {!isCollapsed && <p className="text-[10px] font-black uppercase text-orange-600 dark:text-orange-400 mb-2 leading-tight">Sincronització</p>}
                    <div className={`h-1 bg-orange-200 dark:bg-indigo-950/50 rounded-[28px] overflow-hidden`}>
                        <div className="h-full bg-orange-500 w-[80%]" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotebookSidebar;

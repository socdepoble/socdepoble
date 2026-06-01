import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronRight, Folder, FolderPlus, Trash2, Tag, Library, Tags } from 'lucide-react';
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
    onToggleCollapse,
    onBackup,
    onImport,
    width
}) => {
    const { t } = useTranslation();
    const [expandedFolders, setExpandedFolders] = useState({});

    const bgColor = 'bg-[#f4f4f4] dark:bg-[#1e1e1e] border-r border-gray-200 dark:border-[#333] text-base';
    const textColor = 'text-gray-800 dark:text-gray-200';
    const hoverBg = 'hover:bg-gray-200 dark:hover:bg-[#2c2c2c]';
    const activeBg = 'bg-[#e5e5e5] dark:bg-[#333] text-black dark:text-white font-medium';
    const titleColor = 'text-gray-700 dark:text-gray-300 font-medium text-sm';

    const toggleExpand = (id, e) => {
        e.stopPropagation();
        setExpandedFolders(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const renderFolder = (folder, depth = 0) => {
        const isExpanded = expandedFolders[folder.id];
        const isActive = activeFolder === folder.id;
        const children = folders.filter(f => f.parentId === folder.id);

        const siblingsHaveChildren = folders
            .filter(f => f.parentId === folder.parentId)
            .some(sibling => folders.some(child => child.parentId === sibling.id));

        return (
            <div key={folder.id} className="folder-item-wrapper">
                <div 
                    className={`folder-item flex items-center justify-between pr-3 py-1.5 rounded-md cursor-pointer transition-colors sidebar-row-element ${isActive ? activeBg : `${hoverBg} ${textColor}`}`}
                    style={{ paddingLeft: isCollapsed ? '8px' : `${depth * 16 + 8}px` }}
                    onClick={() => onSelectFolder(folder.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            onSelectFolder(folder.id);
                        }
                    }}
                    title={folder.name}
                >
                    <div className="flex items-center overflow-hidden">
                        {/* Contenidor del Chevron amb amplada fixa xicoteta, només si cal */}
                        {siblingsHaveChildren && (
                            <div className="w-5 flex items-center justify-center shrink-0 sidebar-chevron-element">
                                {(children.length > 0 && !isCollapsed) && (
                                    <button 
                                        onClick={(e) => toggleExpand(folder.id, e)} 
                                        className="p-0.5 rounded-md hover:bg-black/10 dark:hover:bg-white/10 text-gray-500 transition-colors"
                                        aria-label={isExpanded ? "Plegar carpeta" : "Desplegar carpeta"}
                                    >
                                        <ChevronRight size={14} className={`transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
                                    </button>
                                )}
                            </div>
                        )}
                        
                        {/* Contenidor de la Icona i el Text */}
                        <div className={`flex items-center gap-2 flex-1 min-w-0 pr-1 sidebar-icon-container ${!siblingsHaveChildren ? 'ml-1' : ''}`}>
                            <Folder size={18} fill={isActive ? "currentColor" : "none"} className={`shrink-0 ${isActive ? 'text-orange-500' : 'text-orange-400'}`} />
                            {!isCollapsed && <span className="truncate text-sm font-medium sidebar-text-element">{folder.name}</span>}
                        </div>
                    </div>
                    {!isCollapsed && isActive && (
                        <button 
                            onClick={(e) => { e.stopPropagation(); onDeleteFolder(folder.id); }}
                            className="p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity sidebar-action-element"
                            aria-label="Esborrar carpeta"
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
        <div 
            id="notebook-sidebar"
            className={`notebook-sidebar h-full ${bgColor} flex flex-col py-2 z-20 shrink-0 overflow-hidden`}
            style={{ width: width || '100%' }}
        >
            <div role="region" aria-label="Capçalera de Secció" className="flex items-center gap-2 px-3 py-3 mb-1 sidebar-row-element">
                <Library size={18} className="sidebar-icon-container text-blue-500 dark:text-blue-400 shrink-0" />
                <h3 className={`flex-1 font-semibold ${titleColor} sidebar-text-element truncate text-sm`}>Carpetes</h3>
                <button 
                    onClick={() => onAddFolder(activeFolder)}
                    className="p-1 rounded text-gray-500 hover:bg-gray-200 dark:hover:bg-[#333] sidebar-action-element shrink-0"
                    title={t('notebook.new_folder') || 'Nova Carpeta'}
                    aria-label={t('notebook.new_folder') || 'Nova Carpeta'}
                >
                    <FolderPlus size={18} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar px-2 space-y-1">
                {rootFolders.map(folder => renderFolder(folder))}
                {rootFolders.length === 0 && (
                    <p className="text-sm text-center opacity-40 py-4 italic">Cap carpeta</p>
                )}
                
                <div className="mt-4 pt-2 border-t border-gray-200 dark:border-[#333]">
                    <div 
                        className={`flex items-center gap-3 px-2 py-2 rounded-md cursor-pointer transition-colors sidebar-row-element ${activeFolder === 'trash' ? activeBg : `${hoverBg} ${textColor}`}`}
                        onClick={() => onSelectFolder('trash')}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                onSelectFolder('trash');
                            }
                        }}
                        title={t('notebook.trash.bucket')}
                    >
                        <Trash2 size={18} className="ml-1 sidebar-icon-container" />
                        <span className="truncate text-sm font-medium sidebar-text-element">{t('notebook.trash.bucket')}</span>
                    </div>
                </div>
            </div>

            <div className="mt-4 pt-2 border-t border-gray-200 dark:border-[#333]">
                <div role="region" aria-label="Capçalera de Secció" className="flex items-center gap-2 px-3 py-2 mb-1 sidebar-row-element">
                    <Tags size={18} className="sidebar-icon-container text-blue-500 dark:text-blue-400 shrink-0" />
                    <h3 className={`flex-1 font-semibold ${titleColor} sidebar-text-element truncate text-sm`}>Categories</h3>
                </div>
                <div className="space-y-1 px-2">
                    {categories.map(cat => (
                        <div 
                            key={cat}
                            className={`flex items-center gap-3 px-2 py-2 rounded-md cursor-pointer transition-colors sidebar-row-element ${activeCategory === cat ? activeBg : `${hoverBg} ${textColor}`}`}
                            onClick={() => onSelectCategory(cat)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    onSelectCategory(cat);
                                }
                            }}
                            title={cat}
                        >
                            <Tag size={18} className="opacity-50 ml-1 sidebar-icon-container" />
                            <span className="truncate text-sm font-medium sidebar-text-element">{cat}</span>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default NotebookSidebar;

import React from 'react';
import { Search, Plus, Clock, FileText, ChevronRight, Menu } from 'lucide-react';

const NotebookList = ({ 
    notes, 
    activeNoteId, 
    onSelectNote, 
    onAddNote, 
    onReorderNotes,
    searchQuery, 
    onSearchChange,
    isCollapsed,
    onToggleCollapse
}) => {
    const bgColor = 'bg-orange-50/20 dark:bg-[#070D18] border-orange-200/50 dark:border-indigo-900/40';
    const textColor = 'text-orange-950/90 dark:text-indigo-100';
    const activeColor = 'text-orange-600 dark:text-orange-400';
    const inputBg = 'bg-white/70 border-orange-200/60 text-orange-950 focus:bg-white dark:bg-indigo-950/40 dark:border-indigo-500/30 dark:text-indigo-50 dark:focus:bg-indigo-950/60';

    const handleDragStart = (e, index) => {
        e.dataTransfer.setData('text/plain', index);
        e.currentTarget.classList.add('dragging');
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.currentTarget.classList.add('drag-over');
    };

    const handleDragLeave = (e) => {
        e.currentTarget.classList.remove('drag-over');
    };

    const handleDrop = (e, targetIndex) => {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-over');
        const sourceIndex = parseInt(e.dataTransfer.getData('text/plain'));
        if (sourceIndex === targetIndex) return;
        
        const newNotes = [...notes];
        const [movedNote] = newNotes.splice(sourceIndex, 1);
        newNotes.splice(targetIndex, 0, movedNote);
        onReorderNotes(newNotes);
    };

    const filteredNotes = notes
        .filter(n => n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                    n.content.toLowerCase().includes(searchQuery.toLowerCase()))
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    return (
        <div className={`notebook-list transition-all duration-300 ${isCollapsed ? 'w-[70px]' : 'w-80'} shrink-0 h-full ${bgColor} border-r flex flex-col z-10 shadow-[4px_0_24px_-10px_rgba(249,115,22,0.1)] dark:shadow-[4px_0_24px_-10px_rgba(6,182,212,0.1)]`}>
            <div className={`p-4 border-b border-orange-200/50 dark:border-indigo-900/40 ${bgColor} flex flex-col gap-4`}>
                <div className="flex justify-between items-center w-full">
                    <button onClick={onToggleCollapse} className="p-1.5 rounded-[20px] transition-all shrink-0 text-orange-950/80 hover:bg-orange-100/60 dark:text-indigo-200/80 dark:hover:bg-indigo-800/40">
                        <Menu size={20} />
                    </button>
                    {!isCollapsed && (
                        <button 
                            onClick={onAddNote}
                            className="flex-1 ml-3 h-10 bg-orange-100 text-orange-600 border-orange-200 hover:bg-orange-200 dark:bg-orange-600/10 dark:text-orange-400 dark:border-orange-500/20 dark:hover:bg-orange-600/20 border rounded-[28px] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm"
                        >
                            <Plus size={14} strokeWidth={3} /> Nova
                        </button>
                    )}
                </div>

                {!isCollapsed && (
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-900/40 dark:text-indigo-300/40" size={14} />
                        <input 
                            type="text" 
                            placeholder="Cerca en el Quadern..."
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className={`w-full ${inputBg} rounded-[28px] py-2.5 pl-9 pr-4 text-sm font-medium focus:border-orange-500/50 outline-none transition-all placeholder:opacity-50`}
                        />
                    </div>
                )}
                
                {isCollapsed && (
                    <button 
                        onClick={onAddNote}
                        className="w-10 h-10 mx-auto bg-orange-100 text-orange-600 dark:bg-orange-600/20 dark:text-orange-400 rounded-full flex items-center justify-center hover:scale-105 transition-all shadow-md shadow-orange-500/10"
                        title="Nova Nota"
                    >
                        <Plus size={20} strokeWidth={3} />
                    </button>
                )}
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1 p-2">
                {filteredNotes.map((note, index) => {
                    const isActive = activeNoteId === note.id;
                    const date = new Date(note.updatedAt);
                    const dateStr = date.toLocaleDateString('ca-ES', { day: 'numeric', month: 'short' });

                    // Strip HTML for preview. Handle arrays for checklists.
                    let previewText = 'Sense contingut...';
                    if (typeof note.content === 'string') {
                        previewText = note.content.replace(/<[^>]*>/g, ' ').substring(0, 80);
                    } else if (Array.isArray(note.content)) {
                        previewText = note.content.map(item => `${item.completed ? '☑' : '☐'} ${item.text}`).join(', ').substring(0, 80);
                    }

                    return (
                        <div 
                            key={note.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, index)}
                            className={`p-3 rounded-xl cursor-pointer transition-all relative group note-item ${isActive ? 'bg-white/80 shadow-[0_4px_20px_-4px_rgba(249,115,22,0.15)] border border-orange-200 dark:bg-indigo-900/40 dark:border-indigo-500/30' : 'hover:bg-white/60 dark:hover:bg-indigo-800/20'} ${isCollapsed ? 'flex justify-center' : ''}`}
                            onClick={() => onSelectNote(note.id)}
                            title={note.title}
                        >
                            {isCollapsed ? (
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isActive ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30' : 'bg-orange-100/50 text-orange-900/50 dark:bg-indigo-900/30 dark:text-indigo-300/50'}`}>
                                    <FileText size={16} />
                                </div>
                            ) : (
                                <>
                                    <div className="flex justify-between items-start mb-1 gap-2">
                                        <h4 className={`text-sm font-black truncate flex-1 ${isActive ? activeColor : textColor}`}>
                                            {note.title || 'Sense títol'}
                                        </h4>
                                        <span className="text-[10px] font-bold shrink-0 text-orange-900/40 dark:text-indigo-200/40 mt-0.5">{dateStr}</span>
                                    </div>
                                    
                                    <p className="text-xs line-clamp-2 leading-relaxed font-medium text-orange-950/60 dark:text-indigo-100/60">
                                        {previewText}
                                    </p>
                                    
                                    <div className="mt-3 flex items-center gap-2 overflow-hidden">
                                        {note.category && (
                                            <span className="text-[9px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-sm bg-fuchsia-100 text-fuchsia-600 dark:bg-fuchsia-900/20 dark:text-fuchsia-400">
                                                {note.category}
                                            </span>
                                        )}
                                        {note.tags?.slice(0, 2).map(tag => (
                                            <span key={tag} className="text-[9px] font-bold truncate text-orange-900/40 dark:text-indigo-300/40">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}
                {filteredNotes.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-40 opacity-20 p-8 text-center">
                        <FileText size={32} className="mb-4" />
                        <p className="text-xs font-black uppercase tracking-widest">Cap nota bategant...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotebookList;

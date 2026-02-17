import React from 'react';
import { Search, Plus, Clock, FileText, ChevronRight } from 'lucide-react';

const NotebookList = ({ 
    notes, 
    activeNoteId, 
    onSelectNote, 
    onAddNote, 
    onReorderNotes,
    searchQuery, 
    onSearchChange 
}) => {
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
        <div className="notebook-list w-80 h-full bg-[#111] border-r border-white/5 flex flex-col">
            <div className="p-4 border-b border-white/5 bg-[#111]">
                <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                    <input 
                        type="text" 
                        placeholder="Cerca en el Quadern..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-xs font-medium focus:border-orange-500/50 outline-none transition-all"
                    />
                </div>
                <button 
                    onClick={onAddNote}
                    className="w-full h-10 bg-orange-600/10 text-orange-500 border border-orange-500/20 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-orange-600/20 transition-all active:scale-95"
                >
                    <Plus size={14} strokeWidth={3} /> Nova Nota
                </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2">
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
                            className={`p-4 cursor-pointer transition-all relative group note-item ${isActive ? 'active' : ''}`}
                            onClick={() => onSelectNote(note.id)}
                        >
                            
                            <div className="flex justify-between items-start mb-1">
                                <h4 className={`text-xs font-black truncate max-w-[180px] ${isActive ? 'text-orange-400' : 'text-gray-200'}`}>
                                    {note.title || 'Sense títol'}
                                </h4>
                                <span className="text-[9px] font-bold opacity-30 shrink-0">{dateStr}</span>
                            </div>
                            
                            <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed font-medium">
                                {previewText}
                            </p>
                            
                            <div className="mt-3 flex items-center gap-2">
                                {note.category && (
                                    <span className="text-[8px] font-black uppercase tracking-tighter px-1.5 py-0.5 bg-fuchsia-600/10 text-fuchsia-400 rounded-sm">
                                        {note.category}
                                    </span>
                                )}
                                {note.tags?.slice(0, 2).map(tag => (
                                    <span key={tag} className="text-[8px] font-bold text-gray-600">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    );
                })}
                {filteredNotes.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-40 opacity-20 p-8 text-center">
                        <FileText size={32} className="mb-4" />
                        <p className="text-[10px] font-black uppercase tracking-widest">Cap nota bategant...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotebookList;

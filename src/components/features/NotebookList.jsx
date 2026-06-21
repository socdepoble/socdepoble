import { Plus, Search, FileText, ChevronLeft, PanelLeft } from 'lucide-react';

const NotebookList = ({ 
    notes, 
    activeNoteId, 
    onSelectNote, 
    onAddNote, 
    onReorderNotes,
    searchQuery, 
    onSearchChange,
    isCollapsed,
    onToggleCollapse,
    sidebarVisible,
    isMobile,
    onBackToFolders,
    width
}) => {
    const bgColor = 'bg-white dark:bg-[#1e1e1e] border-r border-gray-200 dark:border-[#333]';
    const textColor = 'text-black dark:text-white';
    const activeColor = 'text-black dark:text-white';
    const inputBg = 'bg-gray-100 border-transparent text-black focus:bg-white dark:bg-[#333] dark:text-white dark:focus:bg-[#444]';

    const handleDragStart = (e, index) => {
        e.dataTransfer.setData('text/plain', index);
        e.currentTarget.classList.add('opacity-50');
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
        <div 
            id="notebook-list"
            className={`flex flex-col h-full bg-[#fcfcfc] dark:bg-[#252525] border-r border-gray-200 dark:border-[#333] shrink-0`}
            style={{ width: width || '100%' }}
        >
            <div className={`p-4 pb-2 border-b border-gray-200 dark:border-[#333] ${bgColor} flex flex-col gap-3 sticky top-0 z-10`}>
                <div className="flex justify-between items-center w-full">
                    {isMobile ? (
                        <button onClick={onBackToFolders} className="text-orange-500 flex items-center gap-1 font-medium">
                            <ChevronLeft size={20} /> Carpetes
                        </button>
                    ) : (
                        <button onClick={onToggleCollapse} className="p-1.5 rounded text-gray-500 hover:bg-gray-100 dark:hover:bg-[#333] transition-colors" title="Alternar Carpetes" aria-label="Alternar Carpetes">
                            <PanelLeft size={20} className={sidebarVisible ? "text-orange-500" : "opacity-70"} />
                        </button>
                    )}
                    <button 
                        onClick={onAddNote}
                        className="p-1 rounded text-orange-500 hover:bg-orange-50 dark:hover:bg-[#333] transition-colors"
                        title="Nova Nota"
                        aria-label="Crear nova nota"
                    >
                        <Plus size={20} strokeWidth={2.5} />
                    </button>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Cerca"
                        aria-label="Cerca notes"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className={`w-full ${inputBg} rounded-lg py-2.5 pl-10 pr-4 text-base font-medium outline-none transition-all placeholder:text-gray-400`}
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
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
                            className={`px-6 py-3 cursor-pointer transition-colors relative border-b border-gray-100 dark:border-[#2a2a2a] ${isActive ? 'bg-[#ffeedd] dark:bg-[#4a3622]' : 'hover:bg-gray-50 dark:hover:bg-[#252525]'}`}
                            onClick={() => onSelectNote(note.id)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    onSelectNote(note.id);
                                }
                            }}
                            aria-selected={isActive}
                        >
                            <h4 className={`text-base font-bold truncate mb-1.5 ${isActive ? activeColor : textColor}`}>
                                {note.title || 'Sense títol'}
                            </h4>
                            
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold shrink-0 text-gray-700 dark:text-gray-300">{dateStr}</span>
                                <p className="text-sm truncate text-gray-600 dark:text-gray-400">
                                    {previewText}
                                </p>
                            </div>
                        </div>
                    );
                })}
                {filteredNotes.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-40 opacity-40 p-8 text-center text-gray-500">
                        <FileText size={32} className="mb-3" />
                        <p className="text-base font-medium">Cap nota trobada</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotebookList;

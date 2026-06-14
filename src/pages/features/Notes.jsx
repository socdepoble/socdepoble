import React, { useState, useMemo } from 'react';
import { ChevronLeft, FileText, Folder, List } from 'lucide-react';
import NotebookSidebar from '../../components/layout/NotebookSidebar';
import NotebookList from '../../components/features/NotebookList';
import MasterEditor from '../../components/features/MasterEditor';
import { UniversalHeader } from '../../components/ui/universal-header';

const INITIAL_FOLDERS = [
  { id: 'f-root', name: 'General', parentId: null },
  { id: 'f-art', name: 'Articles', parentId: null },
  { id: 'f-poble', name: 'Histories del Poble', parentId: null },
  { id: 'f-prompts', name: 'Prompts de Recerca', parentId: null },
  { id: 'f-captures', name: 'Captures Web', parentId: null }
];

const INITIAL_NOTES = [
  {
    id: 'n1',
    title: 'Benvinguda al Quadern de Trellat 📓🏺',
    type: 'rich-text',
    content: `<h1>Benvingut al teu nou espai editorial!</h1><p>Quadern de Trellat v2.0</p>`,
    folderId: 'f-root',
    category: 'Trellat',
    tags: ['#benvinguda', '#manual'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const Notes = () => {
  const [folders, setFolders] = useState(INITIAL_FOLDERS);
  const [notes, setNotes] = useState(INITIAL_NOTES);
  const [activeFolderId, setActiveFolderId] = useState('f-root');
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  
  // MÀQUINA D'ESTATS "BANCAL MODE" (Mòbil):
  const [mobileView, setMobileView] = useState('folders'); // 'folders' | 'list' | 'editor'

  const activeNote = useMemo(() => notes.find(n => n.id === activeNoteId) || null, [notes, activeNoteId]);

  // Gestors de Flux purs (Zero listeners de resize)
  const handleSelectFolder = (id) => {
    setActiveFolderId(id);
    setActiveCategory(null);
    setMobileView('list');
  };

  const handleSelectCategory = (cat) => {
    setActiveCategory(cat);
    setActiveFolderId(null);
    setMobileView('list');
  };
  
  const handleSelectNote = (id) => {
    setActiveNoteId(id);
    setMobileView('editor');
  };

  const handleBack = () => {
    if (mobileView === 'editor') setMobileView('list');
    else if (mobileView === 'list') setMobileView('folders');
    else window.history.back();
  };

  return (
    <article className="flex flex-col w-full h-full bg-white sm:rounded-xl shadow-lg border-0 sm:border border-neutral-200 overflow-hidden relative">
      
      {/* CAPÇALERA UNIVERSAL */}
      <UniversalHeader className="shrink-0 bg-neutral-900 text-white">
        <UniversalHeader.Group className="flex items-center gap-2 pl-2">
           <UniversalHeader.Button 
             onClick={handleBack} 
             className="text-white hover:text-orange-500 transition-colors"
             aria-label="Tornar arrere"
           >
             <ChevronLeft size={24} />
           </UniversalHeader.Button>
           <h1 className="text-lg md:text-xl font-black tracking-widest uppercase truncate max-w-[150px] sm:max-w-none">
             Quadern
           </h1>
        </UniversalHeader.Group>
        
        {/* Controls inferiors geomètrics només visibles a mòbil per navegar per panells */}
        <UniversalHeader.Group className="md:hidden pr-2 flex gap-1">
          <UniversalHeader.Button 
            onClick={() => setMobileView('folders')}
            className={`p-1.5 transition-colors ${mobileView === 'folders' ? 'text-orange-500' : 'text-white'}`}
            aria-label="Veure Carpetes"
          >
            <Folder size={20} />
          </UniversalHeader.Button>
          <UniversalHeader.Button 
            onClick={() => setMobileView('list')}
            className={`p-1.5 transition-colors ${mobileView === 'list' ? 'text-orange-500' : 'text-white'}`}
            aria-label="Veure Llista"
          >
            <List size={20} />
          </UniversalHeader.Button>
        </UniversalHeader.Group>
      </UniversalHeader>

      {/* 
        EL GRID PANÒPTIC ("BANCAL MODE"):
        - Mòbil (< md): 1 columna única. 'mobileView' domina i decideix 'flex' o 'hidden'.
        - Tablet (md): 2 columnes establertes (Carpetes ocultes. Llista i Editor viuen costat a costat).
        - Desktop (lg): 3 columnes harmòniques (`lg:grid-cols-[240px_300px_1fr]`). Tot autolocalitzat pel C++.
      */}
      <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-[280px_1fr] lg:grid-cols-[240px_300px_1fr] overflow-hidden bg-neutral-100">
        
        {/* COLUMNA 1: Explorador del Mas (Carpetes) */}
        <aside className={`
          bg-neutral-50 border-r border-neutral-200 overflow-y-auto custom-scrollbar flex-col
          ${mobileView === 'folders' ? 'flex' : 'hidden lg:flex'}
        `}>
          <div className="p-4 border-b border-neutral-200 font-bold text-neutral-500 text-xs uppercase tracking-widest shrink-0 sticky top-0 bg-neutral-50 z-10">
            Arxiu del Poble
          </div>
          <NotebookSidebar 
            folders={folders} 
            activeFolder={activeFolderId} 
            onSelectFolder={handleSelectFolder} 
            categories={['Trellat', 'Patrimoni', 'Dades', 'Social']} 
            activeCategory={activeCategory} 
            onSelectCategory={handleSelectCategory} 
          />
        </aside>

        {/* COLUMNA 2: Llistat de Notes */}
        <section className={`
          bg-white border-r border-neutral-200 overflow-y-auto custom-scrollbar flex-col
          ${mobileView === 'list' ? 'flex' : 'hidden md:flex lg:flex'}
        `}>
          <div className="p-4 border-b border-neutral-100 shrink-0 sticky top-0 bg-white/95 backdrop-blur z-10">
             <input 
               type="search" 
               placeholder="Cerca al bancal..." 
               value={searchQuery}
               onChange={e => setSearchQuery(e.target.value)}
               className="w-full bg-neutral-100 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-shadow text-neutral-900 placeholder:text-neutral-400 font-medium"
             />
          </div>
          <NotebookList 
            notes={notes} 
            activeNoteId={activeNoteId} 
            onSelectNote={handleSelectNote} 
            searchQuery={searchQuery} 
            onSearchChange={setSearchQuery} 
          />
        </section>

        {/* COLUMNA 3: MasterEditor Central */}
        <main className={`
          bg-white overflow-y-auto custom-scrollbar relative flex-col
          ${mobileView === 'editor' ? 'flex' : 'hidden md:flex lg:flex'}
        `}>
          {activeNote ? (
            <div className="max-w-4xl mx-auto w-full p-4 sm:p-6 md:p-10 flex flex-col min-h-full">
              <header className="mb-6 flex justify-between items-start border-b border-neutral-200 pb-4 shrink-0 focus-within:border-orange-500 transition-colors">
                <input 
                  type="text" 
                  value={activeNote.title || ''} 
                  onChange={() => {}} 
                  className="bg-transparent border-none outline-none text-2xl md:text-3xl lg:text-4xl font-black w-full text-black placeholder:text-neutral-300 focus:ring-0 tracking-tight px-0" 
                  placeholder="Bateja aquesta memòria..." 
                />
              </header>
              <div className="flex-1 max-w-none">
                <MasterEditor note={activeNote} />
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center opacity-40 flex-col select-none text-center p-6">
              <FileText size={80} className="mb-6 text-orange-500" strokeWidth={1} />
              <p className="text-2xl md:text-3xl font-black tracking-tight text-neutral-800 uppercase">Obre un solc</p>
              <p className="text-sm md:text-base font-medium mt-2 text-neutral-600 max-w-xs">
                La terra digital espera les teues paraules. Selecciona un document a l'esquerra.
              </p>
            </div>
          )}
        </main>

      </div>
    </article>
  );
};

export default Notes;
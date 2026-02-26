import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import NotebookSidebar from '../components/NotebookSidebar';
import NotebookList from '../components/NotebookList';
import MasterEditor from '../components/MasterEditor';
import AccessibilitatUniversal from '../components/AccessibilitatUniversal';
import { useNavigation } from '../context/NavigationContext';
import { hapticService } from '../services/hapticService';
import { Sparkles, Trash2, Share, Folder, Tag, MessageSquare, Info } from 'lucide-react';
import './Notebook.css';

const INITIAL_FOLDERS = [
    { id: 'f-root', name: 'General', parentId: null },
    { id: 'f-art', name: 'Articles', parentId: null },
    { id: 'f-poble', name: 'Histories del Poble', parentId: null },
    { id: 'f-prompts', name: 'Prompts de Recerca', parentId: null },
    { id: 'f-captures', name: 'Captures Web', parentId: null }
];

const INITIAL_NOTES = [
    {
        id: 'n-prompt-subvencions-2026',
        title: '🎯 Prompt Mestre: Recerca de Subvencions 2026',
        type: 'rich-text',
        content: `
<h1>Protocol de Recerca de Finançament Sobirà</h1>
<p>Aquest és el prompt utilitzat per a identificar les oportunitats de febrer de 2026. Està dissenyat per a alinear la tecnologia cívica amb els fons europeus i nacionals.</p>

<div class="prompt-box" style="background: #1a1a1a; padding: 20px; border-radius: 12px; border: 1px solid #333; margin: 20px 0;">
    <p style="color: #f97316; font-family: monospace; font-size: 14px;">
        "Actua com un consultor expert en captació de fons per al Tercer Sector i Innovació Rural. Analitza el projecte 'Sóc de Poble' (tecnologia Local-First, App Offline, economia circular, memòria viva de la tercera edat i sobirania digital). 
        <br><br>
        Identifica les subvencions més rellevants disponibles a finals de febrer de 2026 a nivell Europeu (Horizon Europe), Nacional (MITECO, Red.es) i Autonòmic (Generalitat Valenciana, LEADER). 
        <br><br>
        Destaquen aquelles que financen tant hardware com recursos humans i desenvolupament de software per a entitats sense ànim de lucre. Proporciona terminis, quanties i justificació de per què encaixen amb la missió del Mas."
    </p>
</div>

<p><em>Nota de l'Archon: Aquest prompt ha de ser actualitzat cada trimestre per a captar les noves finestres d'oportunitat de la Séquia Mare Financera.</em></p>
        `,
        folderId: 'f-prompts',
        category: 'Dades',
        tags: ['#prompts', '#funding', '#subvencions'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastOpenedAt: new Date().toISOString(),
        contentCreatedAt: new Date().toISOString()
    },
    { 
        id: 'n1', 
        title: 'Benvinguda al Quadern de Trellat 📓🏺', 
        type: 'rich-text',
        content: `
<h1>Benvingut al teu nou espai editorial!</h1>
<p>Aquest és el <strong>Quadern de Trellat v2.0</strong>, dissenyat per a bategar la història del territori amb la màxima elegància i potència.</p>

<h2>✨ Editor Unificat i Net</h2>
<p>Hem creat un sistema que t'entén. Pots enganxar text de qualsevol lloc i l'editor el netejarà automàticament per a que mantingui l'estètica del poble, sense codi brut.</p>

<ul class="checklist-block">
    <li draggable="true">
        <div class="checklist-drag-handle" contenteditable="false">⋮⋮</div>
        <input type="checkbox" checked> 
        <span>Editor de blocs actiu</span>
        <button class="checklist-item-remove" contenteditable="false"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg></button>
    </li>
</ul>

<h2>🏺 Dades i Planificació</h2>
<p>Fes clic a la icona d'informació (i) a la part superior dreta per a veure la traçabilitat de la nota i planificar la seva <strong>data prevista</strong>.</p>

<p><em>Gaudeix de l'escriptura, Archon.</em></p>
        `, 
        folderId: 'f-root', 
        category: 'Trellat', 
        tags: ['#benvinguda', '#manual'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastOpenedAt: new Date().toISOString(),
        contentCreatedAt: new Date().toISOString()
    }
];

const Notes = () => {
    const { isAccessibilitatOpen, setIsAccessibilitatOpen } = useNavigation();
    const { t } = useTranslation();
    const { openIAIASidebar } = useNavigation();
    const [searchParams, setSearchParams] = useSearchParams();
    const [folders, setFolders] = useState(() => {
        const saved = localStorage.getItem('sdoc_folders');
        return saved ? JSON.parse(saved) : INITIAL_FOLDERS;
    });
    
    const [notes, setNotes] = useState(() => {
        const saved = localStorage.getItem('sdoc_notes');
        return saved ? JSON.parse(saved) : INITIAL_NOTES;
    });

    const [activeFolderId, setActiveFolderId] = useState('f-root');
    const [activeNoteId, setActiveNoteId] = useState(notes[0]?.id || INITIAL_NOTES[0].id);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState(null);
    const [showInfo, setShowInfo] = useState(false);

    // Persistence Effect
    useEffect(() => {
        localStorage.setItem('sdoc_folders', JSON.stringify(folders));
    }, [folders]);

    useEffect(() => {
        localStorage.setItem('sdoc_notes', JSON.stringify(notes));
    }, [notes]);

    const activeNote = useMemo(() => 
        notes.find(n => n.id === activeNoteId) || notes[0]
    , [notes, activeNoteId]);

    // [PROTOCOL CAPTURA] Snippet Extraction Logic
    useEffect(() => {
        const action = searchParams.get('action');
        if (action === 'capture') {
            const url = searchParams.get('url');
            const title = searchParams.get('title') || 'Nova Captura Web';
            
            if (url) {
                const captureId = `n-capture-${Date.now()}`;
                const captureNote = {
                    id: captureId,
                    title: title,
                    type: 'rich-text',
                    content: `
                        <div class="capture-card" style="background: #111; padding: 20px; border-radius: 20px; border: 1px solid #333; margin-bottom: 20px;">
                            <h2 style="color: #f97316;">🔗 Enllaç Capturat</h2>
                            <p style="color: #0ea5e9; font-weight: bold; font-family: monospace;">${url}</p>
                            <p style="color: #888; font-size: 12px; margin-top: 10px;">Capturat el ${new Date().toLocaleString('ca-ES')}</p>
                            <hr style="border: 0.5px solid #222; margin: 20px 0;">
                            <p><em>Escriu aquí les teves notes sobre aquest enllaç...</em></p>
                        </div>
                    `,
                    folderId: 'f-captures',
                    category: 'Dades',
                    tags: ['#capture', '#web'],
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    lastOpenedAt: new Date().toISOString(),
                    contentCreatedAt: new Date().toISOString()
                };
                
                // [BATEGAT ASÍNCROC] Evitem renders en cascada síncrons
                setTimeout(() => {
                    setNotes(prev => [captureNote, ...prev]);
                    setActiveNoteId(captureId);
                    setActiveFolderId('f-captures');
                    hapticService.notifySuccess();
                }, 10);
                
                // Clear params immediatament
                setSearchParams({}, { replace: true });
            }
        }
    }, [searchParams, setSearchParams]);


    const folderNotes = useMemo(() => {
        let filtered = notes;
        if (activeFolderId === 'trash') {
            return filtered.filter(n => n.status === 'trash');
        }
        filtered = filtered.filter(n => n.status !== 'trash');
        if (activeCategory) {
            filtered = filtered.filter(n => n.category === activeCategory);
        } else if (activeFolderId) {
            filtered = filtered.filter(n => n.folderId === activeFolderId);
        }
        return filtered;
    }, [notes, activeFolderId, activeCategory]);

    const handleAddNote = (type = 'rich-text') => {
        const newNote = {
            id: `n-${Date.now()}`,
            title: type === 'checklist' ? t('notebook.new_list') : t('notebook.new_note'),
            type: type,
            content: type === 'checklist' ? [] : '',
            folderId: activeFolderId || 'f-root',
            category: activeCategory || 'Trellat',
            tags: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            lastOpenedAt: new Date().toISOString(),
            contentCreatedAt: new Date().toISOString(),
            plannedAt: null
        };
        setNotes([newNote, ...notes]);
        setActiveNoteId(newNote.id);
    };

    const handleDeleteNote = (id) => {
        hapticService.batec();
        setNotes(notes.map(n => 
            n.id === id ? { ...n, status: 'trash', deletedAt: new Date().toISOString() } : n
        ));
        if (activeNoteId === id) {
            const remaining = folderNotes.filter(n => n.id !== id);
            if (remaining.length > 0) {
                setActiveNoteId(remaining[0].id);
            }
        }
    };

    const handleRestoreNote = (id) => {
        hapticService.notifySuccess();
        setNotes(notes.map(n => 
            n.id === id ? { ...n, status: 'active', deletedAt: null } : n
        ));
    };

    const handlePermanentlyDeleteNote = (id) => {
        if (window.confirm(t('notebook.trash.confirm_delete'))) {
            hapticService.batec();
            setNotes(notes.filter(n => n.id !== id));
            if (activeNoteId === id) {
                setActiveNoteId(null);
            }
        }
    };

    const handleUpdateNote = (id, updates) => {
        setNotes(prev => prev.map(n => 
            n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n
        ));
    };

    const handleAddFolder = (parentId = null) => {
        const name = prompt('Nom de la carpeta:');
        if (name) {
            const newFolder = {
                id: `f-${Date.now()}`,
                name: name,
                parentId: parentId
            };
            setFolders([...folders, newFolder]);
        }
    };

    const handleDeleteFolder = (id) => {
        if (window.confirm('Vols esborrar aquesta carpeta i tot el seu contingut?')) {
            setFolders(folders.filter(f => f.id !== id && f.parentId !== id));
            setNotes(notes.filter(n => n.folderId !== id));
        }
    };

    return (
        <div className="notebook-app flex-1 flex h-full bg-black overflow-hidden animate-in fade-in duration-500">
            <NotebookSidebar 
                folders={folders}
                activeFolder={activeFolderId}
                onSelectFolder={(id) => { setActiveFolderId(id); setActiveCategory(null); }}
                onAddFolder={handleAddFolder}
                onDeleteFolder={handleDeleteFolder}
                categories={['Trellat', 'Patrimoni', 'Dades', 'Social']}
                activeCategory={activeCategory}
                onSelectCategory={(cat) => { setActiveCategory(cat); setActiveFolderId(null); }}
            />

            <NotebookList 
                notes={folderNotes}
                activeNoteId={activeNoteId}
                onSelectNote={(id) => {
                    setActiveNoteId(id);
                    setNotes(prev => prev.map(n => 
                        n.id === id ? { ...n, lastOpenedAt: new Date().toISOString() } : n
                    ));
                }}
                onAddNote={() => handleAddNote('rich-text')}
                onReorderNotes={(newNotes) => setNotes(newNotes)}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
            />

            <div className="flex-1 flex flex-col bg-black min-w-0">
                {activeNote ? (
                    <>
                        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-black/50 backdrop-blur-xl shrink-0">
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                                <input 
                                    type="text" 
                                    value={activeNote.title}
                                    onChange={(e) => handleUpdateNote(activeNote.id, { title: e.target.value })}
                                    className="bg-transparent border-none outline-none text-xl font-black uppercase tracking-tighter text-white w-full placeholder:opacity-20"
                                    placeholder="Títol de la nota..."
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => openIAIASidebar({ context: `Editing ${activeNote.type}: ${activeNote.title}` })}
                                    className="flex items-center gap-2 px-4 py-2 bg-fuchsia-600/10 text-fuchsia-400 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-fuchsia-600/20 transition-all"
                                >
                                    <MessageSquare size={14} /> Assistent
                                </button>
                                <button 
                                    className="p-2 hover:bg-red-500/10 text-gray-500 hover:text-red-400 rounded-xl transition-all"
                                    onClick={() => activeNote.status === 'trash' ? handlePermanentlyDeleteNote(activeNote.id) : handleDeleteNote(activeNote.id)}
                                    title={activeNote.status === 'trash' ? t('notebook.trash.permanent_delete') : t('notebook.trash.send_to_trash')}
                                >
                                    <Trash2 size={20} />
                                </button>
                                {activeNote.status === 'trash' && (
                                    <button 
                                        className="px-4 py-2 bg-emerald-600/10 text-emerald-500 border border-emerald-500/20 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-600/20 transition-all"
                                        onClick={() => handleRestoreNote(activeNote.id)}
                                    >
                                        {t('notebook.trash.restore')}
                                    </button>
                                )}
                                <button 
                                    className="p-2.5 text-gray-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                                    onClick={() => setShowInfo(!showInfo)}
                                    title="Informació de la nota"
                                >
                                    <Info size={18} />
                                </button>
                                <button 
                                    className="p-2.5 text-gray-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                                    onClick={() => alert('Funció de compartició bategant próximament!')}
                                >
                                    <Share size={18} />
                                </button>
                            </div>
                        </header>

                        {showInfo && (
                            <div className="bg-white/5 border-b border-white/5 px-8 py-4 animate-in fade-in slide-in-from-top-2">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-[10px] font-black uppercase text-gray-500 tracking-widest">{t('notebook.info')}</h3>
                                    <button onClick={() => setShowInfo(false)} className="text-[10px] text-gray-500 hover:text-white uppercase font-bold">{t('common.back')}</button>
                                </div>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                                    <div className="space-y-1">
                                        <div className="text-[9px] font-bold text-gray-600 uppercase">{t('notebook.creation')}</div>
                                        <div className="text-xs text-gray-400 font-medium">{new Date(activeNote.createdAt || activeNote.updatedAt).toLocaleString('ca-ES')}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-[9px] font-bold text-gray-600 uppercase">{t('notebook.modification')}</div>
                                        <div className="text-xs text-gray-400 font-medium">{new Date(activeNote.updatedAt).toLocaleString('ca-ES')}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-[9px] font-bold text-gray-600 uppercase">{t('notebook.last_opened')}</div>
                                        <div className="text-xs text-gray-400 font-medium">{new Date(activeNote.lastOpenedAt || activeNote.updatedAt).toLocaleString('ca-ES')}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-[9px] font-bold text-gray-600 uppercase">{t('notebook.content_creation')}</div>
                                        <div className="text-xs text-gray-400 font-medium">{new Date(activeNote.contentCreatedAt || activeNote.createdAt || activeNote.updatedAt).toLocaleString('ca-ES')}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-[9px] font-bold text-gray-600 uppercase">{t('notebook.planned_date')}</div>
                                        <input 
                                            type="datetime-local" 
                                            value={activeNote.plannedAt ? activeNote.plannedAt.substring(0, 16) : ''}
                                            onChange={(e) => handleUpdateNote(activeNote.id, { plannedAt: e.target.value })}
                                            className="bg-transparent border-none outline-none text-xs text-orange-500 font-bold cursor-pointer"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="p-8 pb-4 flex items-center gap-6 overflow-x-auto shrink-0 border-b border-white/5">
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/5">
                                <Folder size={12} className="text-orange-500" />
                                <span className="text-[10px] font-bold text-gray-400">
                                    {folders.find(f => f.id === activeNote.folderId)?.name || 'General'}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/5">
                                <Tag size={12} className="text-fuchsia-500" />
                                <select 
                                    className="bg-transparent border-none outline-none text-[10px] font-bold text-gray-400 cursor-pointer"
                                    value={activeNote.category}
                                    onChange={(e) => handleUpdateNote(activeNote.id, { category: e.target.value })}
                                >
                                    {['Trellat', 'Patrimoni', 'Dades', 'Social'].map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex-1 overflow-hidden p-8 flex flex-col">
                            <div className="flex-1 bg-[#050505] border border-white/5 rounded-[40px] overflow-hidden shadow-2xl relative">
                                {isAccessibilitatOpen ? (
                                    <AccessibilitatUniversal embedded={true} />
                                ) : (
                                    <MasterEditor 
                                        note={activeNote}
                                        onAIA={() => setIsAccessibilitatOpen(true)}
                                        onChange={(val) => handleUpdateNote(activeNote.id, { content: val })}
                                        placeholder={t('notebook.placeholder')}
                                    />
                                )}
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center opacity-10">
                        <Sparkles size={64} className="mb-6" />
                        <h2 className="text-2xl font-black uppercase tracking-widest">{t('notebook.title')}</h2>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notes;

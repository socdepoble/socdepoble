import { useState, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { useNavigation } from '../../app/context/NavigationContext';
import { useAuth } from '../../app/context/AuthContext';
import { hapticService } from '../../core/services/hapticService';
import { supabase } from '../../supabaseClient';
import { Download, Upload, Globe, MessageSquare, Trash2, Share, Sparkles, ChevronLeft, MoreHorizontal, FileText, List } from 'lucide-react';
import { get, set } from 'idb-keyval';
import NotebookSidebar from '../../components/layout/NotebookSidebar';
import NotebookList from '../../components/features/NotebookList';
import AccessibilitatUniversal from '../../components/ui/AccessibilitatUniversal';
import MasterEditor from '../../components/features/MasterEditor';
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
    const { isGuest } = useAuth();
    const [showIndex, setShowIndex] = useState(false);
    const { t } = useTranslation();
    const { openIAIASidebar } = useNavigation();
    const [searchParams, setSearchParams] = useSearchParams();
    
    // Data State
    const [folders, setFolders] = useState([]);
    const [notes, setNotes] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // UI State
    const [activeFolderId, setActiveFolderId] = useState('f-root');
    const [activeNoteId, setActiveNoteId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState(null);
    const [showActionsMenu, setShowActionsMenu] = useState(false);
    const fileInputRef = useRef(null);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [mobilePane, setMobilePane] = useState('list'); // 'folders', 'list', 'editor'
    const [sidebarVisible, setSidebarVisible] = useState(window.innerWidth >= 1100); // Hidden on tablet by default

    const isMobile = windowWidth < 768;
    const isTablet = windowWidth >= 768 && windowWidth < 1100;
    const isDesktop = windowWidth >= 1100;

    // Resizable State
    const [sidebarWidth, setSidebarWidth] = useState(() => {
        const saved = localStorage.getItem('notebookSidebarWidth');
        return saved ? parseInt(saved, 10) : 240;
    });
    const [listWidth, setListWidth] = useState(() => {
        const saved = localStorage.getItem('notebookListWidth');
        return saved ? parseInt(saved, 10) : 288;
    });
    const dragSidebarStart = useRef({ x: 0, width: 0, active: false });
    const dragListStart = useRef({ x: 0, width: 0, active: false });
    const currentSidebarWidth = useRef(sidebarWidth);
    const currentListWidth = useRef(listWidth);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (dragSidebarStart.current.active) {
                const deltaX = e.clientX - dragSidebarStart.current.x;
                const newWidth = Math.max(64, Math.min(400, dragSidebarStart.current.width + deltaX));
                currentSidebarWidth.current = newWidth;
                const sidebarEl = document.getElementById('notebook-sidebar-wrapper');
                if (sidebarEl) sidebarEl.style.width = newWidth + 'px';
                document.body.style.cursor = 'col-resize';
                document.body.style.userSelect = 'none';
            } else if (dragListStart.current.active) {
                const deltaX = e.clientX - dragListStart.current.x;
                const newWidth = Math.max(150, Math.min(600, dragListStart.current.width + deltaX));
                currentListWidth.current = newWidth;
                const listEl = document.getElementById('notebook-list-wrapper');
                if (listEl) listEl.style.width = newWidth + 'px';
                document.body.style.cursor = 'col-resize';
                document.body.style.userSelect = 'none';
            }
        };
        const handleMouseUp = () => {
            if (dragSidebarStart.current.active) {
                setSidebarWidth(currentSidebarWidth.current);
                localStorage.setItem('notebookSidebarWidth', currentSidebarWidth.current.toString());
            }
            if (dragListStart.current.active) {
                setListWidth(currentListWidth.current);
                localStorage.setItem('notebookListWidth', currentListWidth.current.toString());
            }
            if (dragSidebarStart.current.active || dragListStart.current.active) {
                dragSidebarStart.current.active = false;
                dragListStart.current.active = false;
                document.body.style.cursor = '';
                document.body.style.userSelect = '';
            }
        };
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [sidebarVisible, isTablet, isMobile]);

    useEffect(() => {
        let prevWidth = window.innerWidth;
        const handleResize = () => {
            const width = window.innerWidth;
            setWindowWidth(width);
            
            // Auto-collapse when moving from desktop to tablet
            if (prevWidth >= 1100 && width < 1100 && width >= 768) {
                setSidebarVisible(false);
            }
            // Auto-expand when moving from tablet to desktop
            if (prevWidth < 1100 && width >= 1100) {
                setSidebarVisible(true);
            }
            
            if (width < 768 && prevWidth >= 768) {
                setMobilePane('list');
            }
            
            prevWidth = width;
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Persistence Effect (idb-keyval with localStorage fallback migration)
    useEffect(() => {
        const loadData = async () => {
            try {
                let storedFolders = await get('sdoc_folders');
                let storedNotes = await get('sdoc_notes');

                const localFolders = localStorage.getItem('sdoc_folders');
                const localNotes = localStorage.getItem('sdoc_notes');

                if (!storedFolders && localFolders) {
                    storedFolders = JSON.parse(localFolders);
                    await set('sdoc_folders', storedFolders);
                }
                if (!storedNotes && localNotes) {
                    storedNotes = JSON.parse(localNotes);
                    await set('sdoc_notes', storedNotes);
                }

                setFolders(storedFolders && storedFolders.length > 0 ? storedFolders : INITIAL_FOLDERS);
                setNotes(storedNotes && storedNotes.length > 0 ? storedNotes : INITIAL_NOTES);
                
                // Set initial active note if none selected
                if (!activeNoteId && storedNotes && storedNotes.length > 0) {
                    setActiveNoteId(storedNotes[0].id);
                }
            } catch (error) {
                console.error("Error carregant dades de Notes:", error);
                setFolders(INITIAL_FOLDERS);
                setNotes(INITIAL_NOTES);
            } finally {
                setIsLoaded(true);
            }
        };
        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (isLoaded) {
            set('sdoc_folders', folders).catch(console.error);
        }
    }, [folders, isLoaded]);

    useEffect(() => {
        if (isLoaded) {
            set('sdoc_notes', notes).catch(console.error);
        }
    }, [notes, isLoaded]);

    const activeNote = useMemo(() => 
        notes.find(n => n.id === activeNoteId) || null
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

    const handleBackupJSON = () => {
        hapticService.notifySuccess();
        const data = {
            folders,
            notes,
            version: '2.0',
            exportedAt: new Date().toISOString()
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `SocDePoble_Notes_Backup_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleImportFile = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
            if (file.name.endsWith('.json')) {
                const text = await file.text();
                const data = JSON.parse(text);
                if (data.notes && data.folders) {
                    if (window.confirm('Vols sobreescriure les notes actuals amb aquest backup?')) {
                        setFolders(data.folders);
                        setNotes(data.notes);
                        hapticService.notifySuccess();
                        alert('Backup restaurat correctament.');
                    }
                } else {
                    alert('Format d\'arxiu invàlid.');
                }
            } else if (file.name.endsWith('.docx')) {
                const mammoth = await import('mammoth');
                const arrayBuffer = await file.arrayBuffer();
                const result = await mammoth.convertToHtml({ arrayBuffer });
                
                const newNote = {
                    id: 'n-' + Date.now(),
                    folderId: activeFolderId !== 'trash' ? activeFolderId : 'f-root',
                    title: file.name.replace('.docx', ''),
                    content: result.value || '<p>Document buit</p>',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    status: 'active'
                };
                
                setNotes(prev => [newNote, ...prev]);
                setActiveNoteId(newNote.id);
                hapticService.notifySuccess();
                alert(`Document Word importat correctament.`);
            }
        } catch (err) {
            alert('Error llegint l\'arxiu: ' + err.message);
        }
        e.target.value = ''; // reset
    };

    const handleExportEpub = async () => {
        hapticService.notifySuccess();
        try {
            const { generateEpub } = await import('../../utils/epubGenerator');
            
            const chapter = {
                title: activeNote.title || 'Sense Títol',
                html: activeNote.content || '<p></p>'
            };

            await generateEpub({
                title: activeNote.title || 'Llibre de Sóc de Poble',
                author: 'Archon',
                language: 'ca',
                chapters: [chapter],
                filename: `${(activeNote.title || 'Llibre').replace(/\s+/g, '_')}_Amazon_KDP.epub`
            });
            alert('EPUB generat correctament. Descarregant...');
        } catch (error) {
            console.error(error);
            alert("Error al generar l'EPUB: " + error.message);
        }
    };

    const handleExportDocx = async () => {
        if (!activeNote) return;
        try {
            const { asBlob } = await import('html-docx-js-typescript');
            const { saveAs } = await import('file-saver');
            
            const htmlString = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>${activeNote.title}</title>
                    <style>
                        body { font-family: 'Noto Sans', Arial, sans-serif; }
                    </style>
                </head>
                <body>
                    <h1>${activeNote.title || 'Sense Títol'}</h1>
                    ${activeNote.content || '<p></p>'}
                </body>
                </html>
            `;
            const docData = await asBlob(htmlString);
            saveAs(docData, `${(activeNote.title || 'Nota').replace(/\s+/g, '_')}.docx`);
            hapticService.notifySuccess();
            alert('Document exportat correctament a Word / LibreOffice (.docx).');
        } catch (error) {
            console.error('Error exportant DOCX:', error);
            alert("Error a l'exportar: " + error.message);
        }
    };

    const handlePublishCMS = async () => {
        const slugInput = prompt('Entra el SLUG de la pàgina on vols publicar (ex: /la-meva-ruta o /el-projecte):', '/p/' + activeNote.id.substring(2));
        if (!slugInput) return;
        
        let targetSlug = slugInput;
        if (!targetSlug.startsWith('/')) targetSlug = '/' + targetSlug;

        const isSuperAdmin = localStorage.getItem('isSuperAdmin') === 'true';
        if (!isSuperAdmin) {
            alert('Error: Necessites permisos de SuperAdmin per publicar al CMS!');
            return;
        }

        try {
            const { error } = await supabase
                .from('cms_pages')
                .upsert({
                    slug: targetSlug,
                    title: activeNote.title,
                    subtitle: 'Publicat des del Quadern',
                    html_content: activeNote.content,
                    status: 'published',
                    updated_at: new Date().toISOString()
                }, { onConflict: 'slug' });

            if (error) throw error;
            
            hapticService.notifySuccess();
            alert(`Pàgina publicada correctament a ${targetSlug}!`);
        } catch(e) {
            alert('Error publicant: ' + e.message);
        }
    };

    if (!isLoaded) return <div className="flex-1 flex items-center justify-center"><Sparkles className="animate-pulse opacity-50" /></div>;

    const showSidebarPane = !isMobile ? sidebarVisible : mobilePane === 'folders';
    const showListPane = !isMobile || mobilePane === 'list';
    const showEditorPane = !isMobile || mobilePane === 'editor';

    return (
        <div className="notebook-app flex-1 flex h-full bg-[#1e1e1e] dark:bg-[#121212] overflow-hidden animate-in fade-in duration-300 notranslate font-sans text-white relative">
            
            {/* Tablet Sidebar Backdrop */}
            {isTablet && sidebarVisible && (
                <div 
                    className="absolute inset-0 bg-black/20 dark:bg-black/50 z-40 transition-opacity"
                    onClick={() => setSidebarVisible(false)}
                />
            )}

            {showSidebarPane && (
                <div 
                    id="notebook-sidebar-wrapper"
                    className={`${isTablet ? 'absolute left-0 top-0 h-full z-50 shadow-2xl animate-in slide-in-from-left-10 duration-200' : 'h-full shrink-0 z-30 shadow-[4px_0_15px_rgba(0,0,0,0.06)] dark:shadow-[4px_0_15px_rgba(0,0,0,0.3)]'} relative min-w-[64px]`}
                    style={{ width: isMobile ? undefined : sidebarWidth }}
                >
                    <NotebookSidebar 
                    folders={folders}
                    activeFolder={activeFolderId}
                    onSelectFolder={(id) => { 
                        setActiveFolderId(id); 
                        setActiveCategory(null); 
                        if(isMobile) setMobilePane('list'); 
                    }}
                    onAddFolder={handleAddFolder}
                    onDeleteFolder={handleDeleteFolder}
                    categories={['Trellat', 'Patrimoni', 'Dades', 'Social']}
                    activeCategory={activeCategory}
                    onSelectCategory={(cat) => { 
                        setActiveCategory(cat); 
                        setActiveFolderId(null); 
                        if(isMobile) setMobilePane('list'); 
                    }}
                    isCollapsed={false}
                    onToggleCollapse={() => setSidebarVisible(false)}

                    width="100%"
                />
                {!isMobile && (
                    <div 
                        className="w-2 cursor-col-resize absolute right-[-4px] top-0 h-full z-50 hover:bg-orange-500/20"
                        onMouseDown={(e) => { 
                            e.preventDefault(); 
                            dragSidebarStart.current = { x: e.clientX, width: currentSidebarWidth.current, active: true }; 
                        }}
                        title="Arrossega per redimensionar"
                    />
                )}
                </div>
            )}

            {showListPane && (
                <div 
                    id="notebook-list-wrapper"
                    className="h-full shrink-0 z-20 relative shadow-[4px_0_15px_rgba(0,0,0,0.04)] dark:shadow-[4px_0_15px_rgba(0,0,0,0.2)] min-w-[150px]"
                    style={{ width: isMobile ? undefined : listWidth }}
                >
                    <NotebookList 
                        notes={folderNotes}
                        activeNoteId={activeNoteId}
                        onSelectNote={(id) => {
                            setActiveNoteId(id);
                            setNotes(prev => prev.map(n => 
                                n.id === id ? { ...n, lastOpenedAt: new Date().toISOString() } : n
                            ));
                            if(isMobile) setMobilePane('editor');
                        }}
                        onAddNote={() => {
                            handleAddNote('rich-text');
                            if(isMobile) setMobilePane('editor');
                        }}
                        onReorderNotes={(newNotes) => setNotes(newNotes)}
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        isCollapsed={false}
                        onToggleCollapse={() => setSidebarVisible(!sidebarVisible)}
                        sidebarVisible={sidebarVisible}
                        isMobile={isMobile}
                        onBackToFolders={() => setMobilePane('folders')}
                        width="100%"
                    />
                    {!isMobile && (
                        <div 
                            className="w-2 cursor-col-resize absolute right-[-4px] top-0 h-full z-50 hover:bg-orange-500/20"
                            onMouseDown={(e) => { 
                                e.preventDefault(); 
                                dragListStart.current = { x: e.clientX, width: currentListWidth.current, active: true }; 
                            }}
                            title="Arrossega per redimensionar"
                        />
                    )}
                </div>
            )}

            {showEditorPane && (
                <div className="flex-1 flex flex-col min-w-[350px] bg-[#ffffff] dark:bg-[#1e1e1e] text-black dark:text-white relative z-10">

                    {activeNote ? (
                    <>
                    <div role="region" aria-label="Capçalera de Secció" className="h-14 border-b border-gray-200 dark:border-[#333] flex items-center justify-between px-4 bg-[#ffffff]/90 dark:bg-[#1e1e1e]/90 backdrop-blur-md shrink-0 sticky top-0 z-20">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                            {isMobile && (
                                <button 
                                    onClick={() => setMobilePane('list')}
                                    className="p-2 -ml-2 text-orange-500 hover:text-orange-600 flex items-center gap-1"
                                    aria-label="Tornar a la llista"
                                >
                                    <ChevronLeft size={24} />
                                    <span className="text-sm font-medium">Notes</span>
                                </button>
                            )}
                            {activeNote && (
                                <input 
                                    type="text" 
                                    value={activeNote.title}
                                    onChange={(e) => handleUpdateNote(activeNote.id, { title: e.target.value })}
                                    className="bg-transparent border-none outline-none text-xl font-bold w-full text-black dark:text-white placeholder:opacity-30"
                                    placeholder="Sense títol"
                                    aria-label="Títol de la nota"
                                    spellCheck="false"
                                />
                            )}
                        </div>
                        
                        {activeNote && (
                            <div className="flex items-center gap-1 ml-4 text-gray-500 dark:text-gray-400 relative">
                                {activeNote.status === 'trash' && (
                                    <button 
                                        className="px-4 py-2 bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-500/30 border rounded-[28px] text-xs font-black uppercase tracking-widest hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-all shadow-sm"
                                        onClick={() => handleRestoreNote(activeNote.id)}
                                        aria-label="Restaurar nota"
                                    >
                                        {t('notebook.trash.restore')}
                                    </button>
                                )}

                                <button 
                                    className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-[#333] transition-colors"
                                    onClick={() => setShowActionsMenu(!showActionsMenu)}
                                    aria-label="Més accions"
                                    title="Més accions"
                                    aria-haspopup="true"
                                    aria-expanded={showActionsMenu}
                                >
                                    <MoreHorizontal size={20} />
                                </button>
                                
                                {showActionsMenu && (
                                    <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-[#333] rounded-xl shadow-xl z-dropdown overflow-hidden animate-in fade-in zoom-in duration-200">
                                        <div className="px-4 py-3 bg-gray-50 dark:bg-[#252525] border-b border-gray-200 dark:border-[#333] text-xs flex flex-col gap-2 cursor-default">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-500 dark:text-gray-400">Creada</span>
                                                <span className="font-medium text-gray-800 dark:text-gray-200">{new Date(activeNote.createdAt).toLocaleString('ca-ES', { dateStyle: 'short', timeStyle: 'short' })}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-500 dark:text-gray-400">Modificada</span>
                                                <span className="font-medium text-gray-800 dark:text-gray-200">{new Date(activeNote.updatedAt).toLocaleString('ca-ES', { dateStyle: 'short', timeStyle: 'short' })}</span>
                                            </div>
                                        </div>
                                        <div className="py-1">
                                            <button 
                                                className="w-full text-left px-4 py-3 text-sm hover:bg-gray-100 dark:hover:bg-[#333] flex items-center gap-3 transition-colors text-fuchsia-600 dark:text-fuchsia-400 font-medium"
                                                onClick={() => {
                                                    openIAIASidebar({ context: `Editing ${activeNote.type}: ${activeNote.title}` });
                                                    setShowActionsMenu(false);
                                                }}
                                                aria-label="Obrir assistent d'intel·ligència artificial IAIAs"
                                            >
                                                <MessageSquare size={16} /> Assistent IAIA
                                            </button>
                                            <button 
                                                className="w-full text-left px-4 py-3 text-sm hover:bg-gray-100 dark:hover:bg-[#333] flex items-center gap-3 transition-colors text-gray-700 dark:text-gray-300"
                                                onClick={() => {
                                                    handleExportEpub();
                                                    setShowActionsMenu(false);
                                                }}
                                                aria-label="Descarregar la nota com a llibre EPUB"
                                            >
                                                <Download size={16} /> Exportar a EPUB
                                            </button>
                                            <button 
                                                className="w-full text-left px-4 py-3 text-sm hover:bg-gray-100 dark:hover:bg-[#333] flex items-center gap-3 transition-colors text-gray-700 dark:text-gray-300"
                                                onClick={() => {
                                                    handleExportDocx();
                                                    setShowActionsMenu(false);
                                                }}
                                                aria-label="Descarregar la nota com a document de Word"
                                            >
                                                <FileText size={16} /> Exportar a Word (.docx)
                                            </button>
                                            <button 
                                                className="w-full text-left px-4 py-3 text-sm hover:bg-blue-50 dark:hover:bg-blue-900/20 flex items-center gap-3 transition-colors text-blue-600 dark:text-blue-400 font-medium"
                                                onClick={() => {
                                                    alert('Sincronitzant amb Google Drive... (funció bategant pròximament)');
                                                    setShowActionsMenu(false);
                                                }}
                                                aria-label="Guardar còpia a Google Drive"
                                            >
                                                <Globe size={16} /> Guardar a Google Drive
                                            </button>
                                            <button 
                                                className="w-full text-left px-4 py-3 text-sm hover:bg-gray-100 dark:hover:bg-[#333] flex items-center gap-3 transition-colors text-gray-700 dark:text-gray-300"
                                                onClick={() => {
                                                    handlePublishCMS();
                                                    setShowActionsMenu(false);
                                                }}
                                                aria-label="Publicar aquesta nota com a pàgina web al CMS"
                                            >
                                                <Globe size={16} /> Publicar al CMS
                                            </button>
                                            <button 
                                                className="w-full text-left px-4 py-3 text-sm hover:bg-gray-100 dark:hover:bg-[#333] flex items-center gap-3 transition-colors text-gray-700 dark:text-gray-300"
                                                onClick={() => {
                                                    alert('Funció de compartició bategant próximament!');
                                                    setShowActionsMenu(false);
                                                }}
                                                aria-label="Compartir aquesta nota"
                                            >
                                                <Share size={16} /> Compartir
                                            </button>
                                            <div className="h-px bg-gray-200 dark:bg-[#333] my-1"></div>
                                            <button 
                                                className="w-full text-left px-4 py-3 text-sm hover:bg-red-50 text-red-600 dark:hover:bg-red-900/20 dark:text-red-400 flex items-center gap-3 transition-colors"
                                                onClick={() => {
                                                    activeNote.status === 'trash' ? handlePermanentlyDeleteNote(activeNote.id) : handleDeleteNote(activeNote.id);
                                                    setShowActionsMenu(false);
                                                }}
                                                aria-label={activeNote.status === 'trash' ? "Esborrar nota definitivament" : "Moure nota a la paperera"}
                                            >
                                                <Trash2 size={16} /> {activeNote.status === 'trash' ? 'Esborrar definitivament' : 'Moure a la paperera'}
                                            </button>
                                            <div className="h-px bg-gray-200 dark:bg-[#333] my-1"></div>
                                            <button 
                                                className="w-full text-left px-4 py-3 text-sm hover:bg-gray-100 dark:hover:bg-[#333] flex items-center gap-3 transition-colors text-gray-700 dark:text-gray-300"
                                                onClick={() => {
                                                    setShowIndex(!showIndex);
                                                    setShowActionsMenu(false);
                                                }}
                                                aria-label="Activar o desactivar índex de continguts"
                                            >
                                                <List size={16} /> {showIndex ? 'Amagar Índex' : 'Mostrar Índex'}
                                            </button>
                                            <div className="h-px bg-gray-200 dark:bg-[#333] my-1"></div>
                                            <button 
                                                className="w-full text-left px-4 py-3 text-sm hover:bg-gray-100 dark:hover:bg-[#333] flex items-center gap-3 transition-colors text-gray-700 dark:text-gray-300"
                                                onClick={() => {
                                                    handleBackupJSON();
                                                    setShowActionsMenu(false);
                                                }}
                                            >
                                                <Download size={16} /> Exportar Llibreta JSON
                                            </button>
                                            <button 
                                                className="w-full text-left px-4 py-3 text-sm hover:bg-gray-100 dark:hover:bg-[#333] flex items-center gap-3 transition-colors text-gray-700 dark:text-gray-300"
                                                onClick={() => {
                                                    fileInputRef.current?.click();
                                                    setShowActionsMenu(false);
                                                }}
                                            >
                                                <Upload size={16} /> Importar Llibreta JSON
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    {isGuest && (
                        <div className="bg-yellow-100 text-yellow-800 text-[12px] px-4 py-1 text-center font-medium shrink-0 w-full">
                            <span>Aquest és un Bloc de Notes temporal. </span>
                            <a href="/registre" className="underline cursor-pointer">Registra't per a guardar les notes.</a>
                        </div>
                    )}



                        <div className="flex-1 overflow-hidden p-6 md:p-12 flex flex-col items-center bg-white dark:bg-[#1e1e1e] min-h-0">
                            <div className="w-full max-w-3xl flex-1 flex flex-col min-h-0 text-lg leading-relaxed text-black dark:text-white">

                                {isAccessibilitatOpen ? (
                                    <AccessibilitatUniversal embedded={true} />
                                ) : (
                                    <MasterEditor 
                                        note={activeNote}
                                        showIndex={showIndex}
                                        onAIA={() => setIsAccessibilitatOpen(true)}
                                        onChange={(val) => handleUpdateNote(activeNote.id, { content: val })}
                                        placeholder={t('notebook.placeholder', 'Escriu una nota...')}
                                    />
                                )}
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 bg-[#f9f9f9] dark:bg-[#1e1e1e]">
                        <FileText size={48} className="mb-4 opacity-20" />
                        <h2 className="text-xl font-medium mb-6">Sense cap nota seleccionada</h2>
                        
                        <div className="flex gap-4">
                            <button 
                                className="flex items-center gap-2 px-6 py-2.5 bg-white dark:bg-[#252525] border border-gray-200 dark:border-[#333] rounded-full shadow-sm hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition-all text-sm font-medium text-gray-700 dark:text-gray-300"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Upload size={16} /> Restaurar Llibreta JSON
                            </button>
                        </div>
                    </div>
                )}
            </div>
            )}
            <input type="file" accept=".json,.docx" className="hidden" ref={fileInputRef} onChange={handleImportFile} />
        </div>
    );
};

export default Notes;

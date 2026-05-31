import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { MEDIA_REGISTRY } from '../../data/media_registry';
import SEO from '../../components/core/SEO';
import { useTheme } from '../../app/context/ThemeContext';
import { Folder, Info, Film, FileText, X, Trash2, ArrowRight, ChevronLeft, ChevronRight, CheckCircle2, MousePointerSquareDashed, Maximize2, Search, ArrowLeft, Link } from 'lucide-react';
import axios from 'axios';
import { GroupedVirtuoso } from 'react-virtuoso';
import { useNavigate } from 'react-router-dom';

const MediaManager = () => {
    const navigate = useNavigate();
    const [localMedia, setLocalMedia] = useState(MEDIA_REGISTRY.media || []);
    const [selectedFolder, setSelectedFolder] = useState('all');
    const [linkFilter, setLinkFilter] = useState('all'); // 'all', 'linked', 'orphaned'
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isMoving, setIsMoving] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');
    const [imageUsages, setImageUsages] = useState({});
    const [isUsagesLoaded, setIsUsagesLoaded] = useState(false);

    // Carregar usos d'imatges (Indexació asíncrona)
    useEffect(() => {
        Promise.all([
            import('../../data/mockLoreData'),
            import('../../data/genotip_registry.json')
        ]).then(([mockLore, genotipModule]) => {
            const usages = {};
            const addUsage = (url, usage) => {
                if (!url) return;
                const normalizedUrl = url.split('?')[0]; 
                const parts = normalizedUrl.split('/');
                const filename = parts[parts.length - 1];
                if (!filename) return;
                if (!usages[filename]) usages[filename] = [];
                usages[filename].push(usage);
            };

            const mockLorePosts = mockLore.MOCK_LORE_POSTS || {};
            Object.values(mockLorePosts).forEach(townPosts => {
                townPosts.forEach(post => {
                    const title = post.title || (post.content ? post.content.substring(0,30) + '...' : 'Post sense títol');
                    if (post.image_url) {
                        const urls = Array.isArray(post.image_url) ? post.image_url : [post.image_url];
                        urls.forEach(url => addUsage(url, { type: 'Mur', title, id: post.id }));
                    }
                    if (post.coverImage) {
                        addUsage(post.coverImage, { type: 'Mur', title, id: post.id });
                    }
                });
            });

            const mockLoreItems = mockLore.MOCK_LORE_ITEMS || {};
            Object.values(mockLoreItems).forEach(townItems => {
                townItems.forEach(item => {
                    const title = item.name || item.title || 'Perfil';
                    if (item.avatar) addUsage(item.avatar, { type: 'Perfil', title, id: item.id });
                    if (item.coverImage) addUsage(item.coverImage, { type: 'Portada', title, id: item.id });
                    if (item.image) addUsage(item.image, { type: 'Pàgina', title, id: item.id });
                });
            });

            const genotipData = genotipModule.default || genotipModule;
            if (Array.isArray(genotipData)) {
                genotipData.forEach(skill => {
                    if (skill.image_url) addUsage(skill.image_url, { type: 'Genotip', title: skill.title, id: skill.id });
                });
            }

            setImageUsages(usages);
            setIsUsagesLoaded(true);
        }).catch(err => console.error("Error carregant index d'usos", err));
    }, []);
    
    // UI States
    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';
    const [isScrolling, setIsScrolling] = useState(false);
    const [currentTopDate, setCurrentTopDate] = useState('');
    const scrollTimeoutRef = useRef(null);
    const [touchStart, setTouchStart] = useState(null);
    
    // Virtuoso ref
    const virtuosoRef = useRef(null);

    // Selection States
    const [selectionMode, setSelectionMode] = useState(false);
    const [selectedItems, setSelectedItems] = useState(new Set());
    const [isDragging, setIsDragging] = useState(false);

    // Handle Drag To Select
    useEffect(() => {
        const handleMouseUp = () => {
            if (isDragging) setIsDragging(false);
        };
        window.addEventListener('mouseup', handleMouseUp);
        return () => window.removeEventListener('mouseup', handleMouseUp);
    }, [isDragging]);

    const handleMouseEnter = (id) => {
        if (selectionMode && isDragging) {
            setSelectedItems(prev => {
                const newSet = new Set(prev);
                newSet.add(id);
                return newSet;
            });
        }
    };

    // Calcular columnes de forma reactiva
    const [cols, setCols] = useState(5);
    useEffect(() => {
        const updateCols = () => {
            if (window.innerWidth >= 1024) setCols(5);
            else if (window.innerWidth >= 768) setCols(4);
            else setCols(2);
        };
        updateCols();
        window.addEventListener('resize', updateCols);
        return () => window.removeEventListener('resize', updateCols);
    }, []);

    // Compteig d'arxius per carpeta
    const folderStats = useMemo(() => {
        const stats = { all: localMedia.length };
        localMedia.forEach(m => {
            const f = m.folder;
            stats[f] = (stats[f] || 0) + 1;
        });
        return stats;
    }, [localMedia]);

    const folders = useMemo(() => {
        const unique = new Set(localMedia.map(m => m.folder));
        return ['all', ...Array.from(unique)].sort();
    }, [localMedia]);

    // Compteig d'estat d'enllaços
    const linkStats = useMemo(() => {
        const stats = { all: localMedia.length, linked: 0, orphaned: 0 };
        if (!isUsagesLoaded) return stats;
        localMedia.forEach(m => {
            const parts = m.path.split('/');
            const filename = parts[parts.length - 1];
            if (imageUsages[filename] && imageUsages[filename].length > 0) {
                stats.linked += 1;
            } else {
                stats.orphaned += 1;
            }
        });
        return stats;
    }, [localMedia, imageUsages, isUsagesLoaded]);

    const filteredMedia = useMemo(() => {
        let result = localMedia;
        
        // Filter by folder
        if (selectedFolder !== 'all') {
            result = result.filter(m => m.folder === selectedFolder);
        }
        
        // Filter by search query (filename or folder)
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(m => 
                (m.filename && m.filename.toLowerCase().includes(q)) || 
                (m.folder && m.folder.toLowerCase().includes(q))
            );
        }

        // Filter by link status
        if (isUsagesLoaded && linkFilter !== 'all') {
            if (linkFilter === 'linked') {
                result = result.filter(m => {
                    const parts = m.path.split('/');
                    const filename = parts[parts.length - 1];
                    return imageUsages[filename] && imageUsages[filename].length > 0;
                });
            } else if (linkFilter === 'orphaned') {
                result = result.filter(m => {
                    const parts = m.path.split('/');
                    const filename = parts[parts.length - 1];
                    return !imageUsages[filename] || imageUsages[filename].length === 0;
                });
            }
        }
        
        return [...result].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
    }, [selectedFolder, searchQuery, localMedia, linkFilter, isUsagesLoaded, imageUsages]);

    // Calcular dades per a GroupedVirtuoso
    const { groupCounts, rowGroups, flatRows } = useMemo(() => {
        const groupsMap = new Map();
        
        filteredMedia.forEach(item => {
            const dateObj = new Date(item.date || 0);
            const monthYear = new Intl.DateTimeFormat('ca-ES', { month: 'long', year: 'numeric' }).format(dateObj);
            const title = monthYear.charAt(0).toUpperCase() + monthYear.slice(1);
            
            if (!groupsMap.has(title)) {
                groupsMap.set(title, []);
            }
            groupsMap.get(title).push(item);
        });

        const rGroups = [];
        const fRows = [];
        const gCounts = [];

        for (const [title, items] of groupsMap.entries()) {
            const rows = [];
            for (let i = 0; i < items.length; i += cols) {
                const row = items.slice(i, i + cols);
                rows.push(row);
                fRows.push(row);
            }
            rGroups.push({ title, rows });
            gCounts.push(rows.length);
        }

        return { groupCounts: gCounts, rowGroups: rGroups, flatRows: fRows };
    }, [filteredMedia, cols]);

    // Clic a la bombolla per saltar al següent mes
    const handleBubbleClick = () => {
        if (!rowGroups.length) return;
        const currentGroupIdx = rowGroups.findIndex(g => g.title === currentTopDate);
        if (currentGroupIdx !== -1) {
            const nextIdx = (currentGroupIdx + 1) % rowGroups.length;
            
            // Trobar l'índex absolut de la fila per passar-ho a virtuoso
            let flatIndex = 0;
            for (let i = 0; i < nextIdx; i++) {
                flatIndex += groupCounts[i];
            }
            
            virtuosoRef.current?.scrollToIndex({
                index: flatIndex,
                align: 'start',
                behavior: 'smooth'
            });
        }
    };

    // Handle Keyboard Navigation per al Carrusel
    const handleKeyDown = useCallback((e) => {
        if (!selectedImage) return;
        
        const currentIndex = filteredMedia.findIndex(m => m.id === selectedImage.id);
        if (currentIndex === -1) return;

        if (e.key === 'ArrowRight') {
            const nextIndex = (currentIndex + 1) % filteredMedia.length;
            setSelectedImage(filteredMedia[nextIndex]);
        } else if (e.key === 'ArrowLeft') {
            const prevIndex = (currentIndex - 1 + filteredMedia.length) % filteredMedia.length;
            setSelectedImage(filteredMedia[prevIndex]);
        } else if (e.key === 'Escape') {
            setSelectedImage(null);
        }
    }, [selectedImage, filteredMedia]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    const goNext = (e) => {
        if (e) e.stopPropagation();
        if (!selectedImage) return;
        const currentIndex = filteredMedia.findIndex(m => m.id === selectedImage.id);
        const nextIndex = (currentIndex + 1) % filteredMedia.length;
        setSelectedImage(filteredMedia[nextIndex]);
    };

    const goPrev = (e) => {
        if (e) e.stopPropagation();
        if (!selectedImage) return;
        const currentIndex = filteredMedia.findIndex(m => m.id === selectedImage.id);
        const prevIndex = (currentIndex - 1 + filteredMedia.length) % filteredMedia.length;
        setSelectedImage(filteredMedia[prevIndex]);
    };

    // Swipe handlers per a mòbils
    const handleTouchStart = (e) => setTouchStart(e.touches[0].clientX);
    const handleTouchEnd = (e) => {
        if (!touchStart) return;
        const touchEnd = e.changedTouches[0].clientX;
        if (touchStart - touchEnd > 50) goNext();
        if (touchStart - touchEnd < -50) goPrev();
        setTouchStart(null);
    };

    const toggleSelectionMode = () => {
        setSelectionMode(!selectionMode);
        setSelectedItems(new Set());
    };

    const toggleSelectItem = (id) => {
        const newSelected = new Set(selectedItems);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedItems(newSelected);
    };

    const handleBulkDelete = async () => {
        if (selectedItems.size === 0 || isDeleting) return;
        
        const confirmDelete = window.confirm(`Segur que vols esborrar permanentment ${selectedItems.size} elements?`);
        if (!confirmDelete) return;

        setIsDeleting(true);
        
        // --- ESBORRAT OPTIMÍSTIC ---
        const idsToDelete = Array.from(selectedItems);
        const updatedMedia = localMedia.filter(m => !selectedItems.has(m.id));
        setLocalMedia(updatedMedia);
        setSelectionMode(false);
        setSelectedItems(new Set());
        // ---------------------------

        try {
            const res = await axios.post('/api/media/bulk-delete', { ids: idsToDelete });
            if (!res.data.success) {
                console.error("Error al servidor:", res.data.error);
            }
        } catch (err) {
            console.error("Error esborrant imatges en bloc:", err);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedImage || isDeleting) return;
        
        const confirmDelete = window.confirm(`Segur que vols esborrar permanentment "${selectedImage.filename}"?`);
        if (!confirmDelete) return;

        setIsDeleting(true);
        const idToDelete = selectedImage.id;

        // --- ESBORRAT OPTIMÍSTIC ---
        const updatedMedia = localMedia.filter(m => m.id !== idToDelete);
        setLocalMedia(updatedMedia);
        
        const currentFilteredIndex = filteredMedia.findIndex(m => m.id === idToDelete);
        const remainingFiltered = filteredMedia.filter(m => m.id !== idToDelete);
        
        if (remainingFiltered.length === 0) {
            setSelectedImage(null);
        } else {
            const nextTargetIndex = currentFilteredIndex >= remainingFiltered.length ? 0 : currentFilteredIndex;
            setSelectedImage(remainingFiltered[nextTargetIndex]);
        }
        // ---------------------------

        try {
            await axios.delete(`/api/media/${idToDelete}`);
        } catch (err) {
            console.error("Error esborrant imatge:", err);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleMove = async () => {
        if (!selectedImage || isMoving || !newFolderName.trim()) return;

        setIsMoving(true);
        try {
            const res = await axios.post(`/api/media/move/${selectedImage.id}`, { folder: newFolderName.trim() });
            
            if (res.data && res.data.success && res.data.item) {
                const updatedMedia = localMedia.map(m => m.id === selectedImage.id ? res.data.item : m);
                setLocalMedia(updatedMedia);
                
                if (selectedFolder !== 'all' && newFolderName !== selectedFolder) {
                    const currentFilteredIndex = filteredMedia.findIndex(m => m.id === selectedImage.id);
                    const remainingFiltered = filteredMedia.filter(m => m.id !== selectedImage.id);
                    if (remainingFiltered.length === 0) {
                        setSelectedImage(null);
                    } else {
                        const nextTargetIndex = currentFilteredIndex >= remainingFiltered.length ? 0 : currentFilteredIndex;
                        setSelectedImage(remainingFiltered[nextTargetIndex]);
                    }
                } else {
                    setSelectedImage(res.data.item);
                }
                setNewFolderName('');
            }
        } catch (err) {
            console.error("Error movent imatge:", err);
            alert("Hi ha hagut un error movent la imatge.");
        } finally {
            setIsMoving(false);
        }
    };

    // --- ESTILS DINÀMICS PER A TEMA CLAR/FOSC ---
    const bgMain = isDarkMode ? 'bg-[#050505]' : 'bg-gray-50';
    const textMain = isDarkMode ? 'text-white' : 'text-gray-900';
    const textDim = isDarkMode ? 'text-white/60' : 'text-gray-500';
    const borderMain = isDarkMode ? 'border-[#222]' : 'border-gray-200';
    const cardBg = isDarkMode ? 'bg-[#111]' : 'bg-gray-100';

    // To Blau (Fosc) / Taronja (Clar) per a la barra unificada
    // Ajustat l'alçada a 56px per aliniar amb el botó Connectar del Sidebar
    const toolbarBg = isDarkMode ? 'bg-[#4F46E5] text-white' : 'bg-[#F97316] text-white';
    const toolbarBorder = 'border-transparent';

    return (
        <div className={`flex flex-col h-full overflow-hidden w-full relative pb-20 md:pb-0 transition-colors duration-300 ${bgMain} ${textMain}`} id="media-scroll-container">
            <SEO title="Banc d'Imatges (Local Photos)" description="Directori Multimèdia del sistema Sóc de Poble." url="/media" />

            {/* COMPACT UNIFIED TOOLBAR - Height 56px exactly */}
            <div className={`w-full h-[56px] min-h-[56px] shrink-0 flex items-center justify-between px-2 sm:px-4 border-b z-30 transition-colors duration-300 ${toolbarBg} ${toolbarBorder}`}>
                
                {/* Left: Filters */}
                <div className="flex items-center gap-1.5 sm:gap-2 h-full">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="flex items-center justify-center w-9 h-9 rounded-full bg-black/10 hover:bg-black/20 transition-colors text-white shrink-0"
                        title="Tornar Enrere"
                    >
                        <ArrowLeft size={18} strokeWidth={2.5} />
                    </button>
                    
                    <div className="h-4 sm:h-5 w-[1px] bg-white opacity-30 mx-0.5 shrink-0"></div>
                    
                    {/* Folders Dropdown */}
                    <div className="relative flex items-center justify-center w-9 h-9 sm:w-auto sm:h-9 bg-black/20 hover:bg-black/30 rounded-full transition-colors shrink-0">
                        <div className="absolute left-[10px] sm:left-3 pointer-events-none text-white flex items-center justify-center z-10">
                            <Folder size={16} />
                        </div>
                        <select 
                            value={selectedFolder}
                            onChange={(e) => setSelectedFolder(e.target.value)}
                            className="absolute inset-0 sm:static w-full h-full opacity-0 sm:opacity-100 sm:appearance-none bg-transparent cursor-pointer text-white font-bold uppercase tracking-wider text-[11px] sm:text-xs pl-0 sm:pl-9 pr-0 sm:pr-8 outline-none z-20"
                        >
                            {folders.map(folder => (
                                <option key={folder} value={folder} className="text-black bg-white">
                                    {folder === 'all' ? `Tots (${folderStats.all})` : `${folder.substring(0,8)} (${folderStats[folder]})`}
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-2.5 pointer-events-none text-white/70 hidden sm:block z-10">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                        </div>
                    </div>

                    {/* Link Status Dropdown */}
                    <div className="relative flex items-center justify-center w-9 h-9 sm:w-auto sm:h-9 bg-black/20 hover:bg-black/30 rounded-full transition-colors shrink-0">
                        <div className="absolute left-[10px] sm:left-3 pointer-events-none text-white flex items-center justify-center z-10">
                            <Link size={16} />
                        </div>
                        <select 
                            value={linkFilter}
                            onChange={(e) => setLinkFilter(e.target.value)}
                            className="absolute inset-0 sm:static w-full h-full opacity-0 sm:opacity-100 sm:appearance-none bg-transparent cursor-pointer text-white font-bold uppercase tracking-wider text-[11px] sm:text-xs pl-0 sm:pl-9 pr-0 sm:pr-8 outline-none z-20"
                        >
                            <option value="all" className="text-black bg-white">All ({linkStats.all})</option>
                            <option value="linked" className="text-black bg-white">On ({linkStats.linked})</option>
                            <option value="orphaned" className="text-black bg-white">Off ({linkStats.orphaned})</option>
                        </select>
                        <div className="absolute right-2.5 pointer-events-none text-white/70 hidden sm:block z-10">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                        </div>
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-1.5 sm:gap-2 h-full">
                    {/* Search Field */}
                    <div className="relative flex items-center justify-start w-9 h-9 sm:w-32 lg:w-48 bg-black/20 hover:bg-black/30 focus-within:bg-black/30 focus-within:w-48 focus-within:absolute focus-within:right-2 sm:focus-within:relative sm:focus-within:w-full rounded-full transition-all shrink-0 z-30 group">
                        <div className="absolute left-[10px] sm:left-3 pointer-events-none text-white flex items-center justify-center z-10 transition-colors">
                            <Search size={16} />
                        </div>
                        <input 
                            id="media-search"
                            type="text" 
                            placeholder="Cercar..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="absolute inset-0 sm:static w-full h-full bg-transparent text-white placeholder-transparent sm:placeholder-white/60 focus:placeholder-white/60 text-xs pl-9 pr-3 outline-none cursor-pointer focus:cursor-text opacity-0 sm:opacity-100 focus:opacity-100 transition-all rounded-full z-20"
                        />
                    </div>

                    {/* Info Button */}
                    <button 
                        className="flex items-center justify-center w-9 h-9 bg-black/20 hover:bg-black/30 rounded-full transition-all text-white relative shrink-0"
                        onClick={() => {
                            if (MEDIA_REGISTRY.duplicates?.length > 0) {
                                alert(`Hi ha ${MEDIA_REGISTRY.duplicates.length} arxius duplicats al sistema (detectats via hash MD5):\n\n` + MEDIA_REGISTRY.duplicates.map(d => `- ${d.filename}`).join('\n') + `\n\nEl sistema els ha saltat per estalviar espai.`);
                            } else {
                                alert('Indexació Local-First.\nZero arxius duplicats al sistema (0 conflictes MD5).');
                            }
                        }}
                        title="Informació d'Indexació"
                    >
                        <Info size={16} />
                        {MEDIA_REGISTRY.duplicates?.length > 0 && (
                            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-lg"></span>
                        )}
                    </button>

                    <button 
                        onClick={toggleSelectionMode}
                        className={`flex items-center justify-center gap-1.5 h-9 px-3 sm:px-4 rounded-full text-[11px] sm:text-xs font-bold transition-all shrink-0 ${selectionMode ? 'bg-white text-black shadow-lg' : 'bg-black/20 hover:bg-black/30 text-white'}`}
                    >
                        <MousePointerSquareDashed size={14} /> 
                        <span className="hidden lg:inline">{selectionMode ? 'Cancel·lar' : 'Seleccionar'}</span>
                    </button>
                </div>
            </div>

            {/* BULK ACTIONS BAR */}
            {selectionMode && selectedItems.size > 0 && (
                <div className={`w-full shrink-0 border-b px-4 md:px-8 py-2.5 flex items-center justify-between animate-in slide-in-from-top-2 z-20 ${isDarkMode ? 'bg-blue-900/20 border-blue-500/30' : 'bg-orange-50 border-orange-200'}`}>
                    <div className={`flex items-center gap-2 font-bold text-xs ${isDarkMode ? 'text-blue-500' : 'text-orange-600'}`}>
                        <CheckCircle2 size={16} /> {selectedItems.size} seleccionats
                    </div>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={handleBulkDelete}
                            disabled={isDeleting}
                            className="flex items-center gap-1.5 bg-red-600 hover:bg-red-500 text-white px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase tracking-wider transition-all disabled:opacity-50"
                        >
                            <Trash2 size={14} /> {isDeleting ? 'Esborrant...' : 'Esborrar Seleccionats'}
                        </button>
                    </div>
                </div>
            )}

            {/* BODY (Scrollable Area handled by GroupedVirtuoso) */}
            <div className="flex-1 flex flex-col w-full max-w-7xl mx-auto px-4 md:px-8 py-4 gap-6 relative">
                
                {/* BOMBOLLA D'SCROLL ESTIL GOOGLE PHOTOS (PINCHABLE) */}
                <div 
                    onClick={handleBubbleClick}
                    onMouseEnter={() => {
                        setIsScrolling(true);
                        clearTimeout(scrollTimeoutRef.current);
                    }}
                    onMouseLeave={() => {
                        scrollTimeoutRef.current = setTimeout(() => setIsScrolling(false), 2000);
                    }}
                    className={`fixed right-4 top-1/2 -translate-y-1/2 z-40 bg-black/80 backdrop-blur-md text-white px-4 py-2 rounded-full font-black text-sm shadow-2xl transition-all duration-300 border border-white/10 cursor-pointer hover:bg-black hover:scale-105 active:scale-95 ${isScrolling ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8 pointer-events-none'}`}
                    title="Clica per passar de mes"
                >
                    {currentTopDate}
                </div>
                
                {/* GROUPED VIRTUOSO */}
                <div className="flex-1 relative">
                    {filteredMedia.length > 0 ? (
                        <GroupedVirtuoso
                            ref={virtuosoRef}
                            style={{ height: '100%', width: '100%' }}
                            className="custom-scrollbar"
                            groupCounts={groupCounts}
                            overscan={400}
                            onScroll={() => {
                                setIsScrolling(true);
                                clearTimeout(scrollTimeoutRef.current);
                                // S'allarga l'estada a 2.5 segons
                                scrollTimeoutRef.current = setTimeout(() => setIsScrolling(false), 2500);
                            }}
                            itemsRendered={(items) => {
                                if (items.length > 0) {
                                    const firstItemIndex = items[0].index;
                                    const row = flatRows[firstItemIndex];
                                    if (row && row[0]) {
                                        const dateObj = new Date(row[0].date || 0);
                                        const monthYear = new Intl.DateTimeFormat('ca-ES', { month: 'long', year: 'numeric' }).format(dateObj);
                                        setCurrentTopDate(monthYear.charAt(0).toUpperCase() + monthYear.slice(1));
                                    }
                                }
                            }}
                            groupContent={(index) => {
                                return (
                                    <div className={`pt-4 pb-2 border-b mb-3 sticky top-0 z-10 w-full transition-colors ${isDarkMode ? 'bg-[#050505]/95 backdrop-blur-sm border-white/5 text-white/90' : 'bg-gray-50/95 backdrop-blur-sm border-gray-200 text-gray-800'}`}>
                                        <h2 className="font-black text-lg tracking-wider">
                                            {rowGroups[index].title}
                                        </h2>
                                    </div>
                                );
                            }}
                            itemContent={(index) => {
                                const row = flatRows[index];
                                return (
                                    <div className="flex w-full gap-2 md:gap-4 mb-2 md:mb-4">
                                        {row.map(item => {
                                            const isSelected = selectedItems.has(item.id);
                                            return (
                                                <div 
                                                    key={item.id} 
                                                    style={{ flex: `1 1 calc(${100 / cols}% - 16px)`, aspectRatio: '1 / 1', maxWidth: `calc(${100 / cols}% - 16px)` }}
                                                    onMouseDown={() => {
                                                        if (selectionMode) {
                                                            setIsDragging(true);
                                                            toggleSelectItem(item.id);
                                                        }
                                                    }}
                                                    onMouseEnter={() => handleMouseEnter(item.id)}
                                                    onClick={(e) => {
                                                        if (!selectionMode) {
                                                            setSelectedImage(item);
                                                        }
                                                    }}
                                                    onDragStart={(e) => e.preventDefault()}
                                                    className={`${cardBg} border rounded-xl overflow-hidden group relative transition-all ${isSelected ? (isDarkMode ? 'border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)] scale-95' : 'border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.3)] scale-95') : (isDarkMode ? 'border-[#222] hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]' : 'border-gray-200 shadow-sm hover:border-orange-400 hover:shadow-md cursor-pointer')}`}
                                                >
                                                    {item.type === 'image' || !item.type ? (
                                                        <img 
                                                            src={item.path} 
                                                            alt={item.filename} 
                                                            draggable={false}
                                                            className={`w-full h-full object-cover transition-all duration-300 ${isSelected ? 'opacity-50 scale-110' : ''}`} 
                                                            loading="lazy"
                                                            onError={(e) => {
                                                                if (!e.target.dataset.failed) {
                                                                    e.target.dataset.failed = 'true';
                                                                    e.target.src = '/default-avatar.png';
                                                                }
                                                            }}
                                                        />
                                                    ) : item.type === 'video' ? (
                                                        <div className={`w-full h-full flex flex-col items-center justify-center ${isDarkMode ? 'text-white/50 bg-[#1a1a1a]' : 'text-gray-400 bg-gray-200'}`}>
                                                            <Film size={48} className="opacity-50" />
                                                        </div>
                                                    ) : (
                                                        <div className={`w-full h-full flex flex-col items-center justify-center ${isDarkMode ? 'text-white/50 bg-[#1a1a1a]' : 'text-gray-400 bg-gray-200'}`}>
                                                            <FileText size={48} className="opacity-50" />
                                                        </div>
                                                    )}

                                                    {/* Checkbox per Selecció */}
                                                    {selectionMode && (
                                                        <div className="absolute top-2 left-2 z-10">
                                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? (isDarkMode ? 'bg-blue-500 border-blue-500 text-white scale-110' : 'bg-orange-500 border-orange-500 text-white scale-110') : 'border-white/50 bg-black/30 text-transparent'}`}>
                                                                <CheckCircle2 size={12} />
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Hover Overlay "El pinchable" */}
                                                    {!selectionMode && (
                                                        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-2 transition-all p-4 text-center cursor-pointer">
                                                            <div className={`${isDarkMode ? 'bg-blue-600/90' : 'bg-orange-500/90'} text-white rounded-full p-2.5 shadow-lg transform scale-90 group-hover:scale-100 transition-all flex items-center justify-center gap-2 mb-1`}>
                                                                <Maximize2 size={16} />
                                                            </div>
                                                            <span className="text-[9px] uppercase tracking-widest text-[#aaa] bg-black/80 px-2 py-0.5 rounded border border-[#444]">{item.folder}</span>
                                                            <span className="text-[10px] font-bold text-white max-w-full truncate">{item.filename}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                        {/* Espais buits flex */}
                                        {Array.from({ length: cols - row.length }).map((_, i) => (
                                            <div key={`empty-${i}`} style={{ flex: `1 1 calc(${100 / cols}% - 16px)`, maxWidth: `calc(${100 / cols}% - 16px)` }} />
                                        ))}
                                    </div>
                                );
                            }}
                        />
                    ) : (
                        <div className="w-full h-64 flex flex-col items-center justify-center font-bold tracking-widest uppercase opacity-50">
                            No hi ha arxius que coincidisquen amb la cerca
                        </div>
                    )}
                </div>
            </div>

            {/* MODAL DETALL / CARRUSEL */}
            {selectedImage && !selectionMode && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4 bg-black/95 backdrop-blur-md" onClick={() => setSelectedImage(null)}>
                    <div className={`w-full h-full md:h-auto md:max-w-6xl border rounded-2xl overflow-hidden flex flex-col md:flex-row relative shadow-2xl ${isDarkMode ? 'bg-[#0a0a0c] border-[#333]' : 'bg-white border-gray-300'}`} onClick={e => e.stopPropagation()}>
                        <button className="absolute top-4 right-4 z-20 w-8 h-8 bg-black/50 hover:bg-red-600 rounded-full flex items-center justify-center text-white transition-all backdrop-blur" onClick={() => setSelectedImage(null)}>
                            <X size={18} />
                        </button>
                        
                        <div 
                            className="w-full md:w-2/3 h-[50vh] md:h-auto bg-black flex items-center justify-center p-4 relative md:!min-h-[500px] group"
                            onTouchStart={handleTouchStart}
                            onTouchEnd={handleTouchEnd}
                        >
                            <button onClick={goPrev} className="absolute left-2 md:left-4 z-10 w-10 h-10 md:w-12 md:h-12 bg-black/50 hover:bg-white/20 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur">
                                <ChevronLeft size={24} className="md:w-7 md:h-7" />
                            </button>
                            <button onClick={goNext} className="absolute right-2 md:right-4 z-10 w-10 h-10 md:w-12 md:h-12 bg-black/50 hover:bg-white/20 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur">
                                <ChevronRight size={24} className="md:w-7 md:h-7" />
                            </button>

                            <img 
                                src={selectedImage.path} 
                                alt={selectedImage.filename} 
                                draggable={false}
                                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl transition-transform"
                                onError={(e) => {
                                    if (!e.target.dataset.failed) {
                                        e.target.dataset.failed = 'true';
                                        e.target.src = '/default-avatar.png';
                                    }
                                }}
                            />
                            
                            {/* Mobile Swipe Hint */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white/60 px-4 py-1 rounded-full text-[10px] uppercase tracking-widest md:hidden backdrop-blur">
                                Llisca per navegar
                            </div>
                        </div>

                        <div className={`w-full md:w-1/3 flex-1 border-t md:border-t-0 md:border-l flex flex-col overflow-y-auto custom-scrollbar ${borderMain}`}>
                           <div className={`p-4 md:p-6 pb-2 border-b ${borderMain}`}>
                                <h2 className={`text-lg md:text-xl font-bold word-break hyphens-auto break-all leading-tight ${textMain}`}>{selectedImage.filename}</h2>
                           </div>
                           
                           <div className={`p-4 md:p-6 space-y-3 md:space-y-4 text-sm flex-1 ${textDim}`}>
                               <div>
                                   <label className="text-[10px] uppercase tracking-widest font-bold mb-1 block opacity-50">Carpeta Actual</label>
                                   <div className={`inline-flex items-center border rounded-full px-3 py-1 text-xs ${isDarkMode ? 'border-[#444] bg-white/5 text-white' : 'border-gray-300 bg-gray-100 text-gray-800'}`}>
                                       <Folder size={12} className="inline mr-1" /> {selectedImage.folder}
                                   </div>
                               </div>
                               <div>
                                   <label className="text-[10px] uppercase tracking-widest font-bold mb-1 block opacity-50">Hash Únic (MD5 ID)</label>
                                   <div className={`font-mono border rounded p-2 text-[10px] truncate ${isDarkMode ? 'bg-[#111] border-[#222] text-white/90' : 'bg-gray-100 border-gray-200 text-gray-800'}`}>
                                       {selectedImage.id}
                                   </div>
                               </div>
                               <div>
                                   <label className="text-[10px] uppercase tracking-widest font-bold mb-1 block opacity-50">Ruta Interna</label>
                                   <div className={`font-mono border rounded p-2 text-[10px] break-all ${isDarkMode ? 'bg-[#111] border-[#222] text-white/80' : 'bg-gray-100 border-gray-200 text-gray-800'}`}>
                                       {selectedImage.path}
                                   </div>
                               </div>

                               <div className="pt-2 hidden md:block">
                                   <label className="text-[10px] uppercase tracking-widest font-bold mb-1 block opacity-50">Metadades (EXIF)</label>
                                   <div className={`border rounded-lg p-3 text-xs space-y-2 ${isDarkMode ? 'bg-[#111] border-[#222]' : 'bg-gray-50 border-gray-200'}`}>
                                       <div className="flex justify-between">
                                           <span className="opacity-60">Origen</span>
                                           <span className="font-bold">{selectedImage.folder === 'Records IAIA' ? 'Generat per IAIA' : 'Pujada per usuari'}</span>
                                       </div>
                                       <div className="flex justify-between">
                                           <span className="opacity-60">Data</span>
                                           <span className="font-bold">{new Date(selectedImage.date).toLocaleDateString()}</span>
                                       </div>
                                   </div>
                               </div>

                                <div className="pt-2">
                                    <label className="text-[10px] uppercase tracking-widest font-bold mb-1 block opacity-50">Enllaços de la Imatge</label>
                                    <div className={`border rounded-lg p-3 text-xs space-y-2 ${isDarkMode ? 'bg-[#111] border-[#222]' : 'bg-gray-50 border-gray-200'}`}>
                                        {!isUsagesLoaded ? (
                                            <div className="text-orange-500 animate-pulse">Indexant connexions...</div>
                                        ) : (() => {
                                            const filename = selectedImage.path.split('/').pop();
                                            const usages = imageUsages[filename];
                                            if (usages && usages.length > 0) {
                                                return (
                                                    <div className="space-y-2">
                                                        <div className="text-green-600 dark:text-green-400 font-bold mb-2">
                                                            ✓ Utilitzada en {usages.length} lloc(s)
                                                        </div>
                                                        <div className="max-h-32 overflow-y-auto custom-scrollbar pr-2 space-y-1">
                                                            {usages.map((usage, idx) => (
                                                                <div 
                                                                    key={idx} 
                                                                    className={`p-2 rounded border flex items-center justify-between gap-2 cursor-pointer transition-colors ${isDarkMode ? 'bg-[#222] border-[#333] hover:border-blue-500 hover:bg-[#333]' : 'bg-white border-gray-200 hover:border-blue-500 hover:bg-blue-50'}`}
                                                                    onClick={() => {
                                                                        if (usage.type === 'Mur') navigate(`/post/${usage.id}`);
                                                                        else if (usage.type === 'Genotip') navigate(`/genotip`);
                                                                        else navigate(`/gent/${usage.id}`);
                                                                    }}
                                                                >
                                                                    <span className="font-semibold text-[10px] uppercase tracking-wide opacity-70 shrink-0 bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded">{usage.type}</span>
                                                                    <span className="truncate flex-1 text-blue-500 dark:text-blue-400 hover:underline" title={usage.title}>{usage.title}</span>
                                                                    <Link size={12} className="opacity-50 shrink-0" />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                );
                                            } else {
                                                return (
                                                    <div className="text-red-500 font-bold">
                                                        ✗ Imatge Òrfena (No s'utilitza enlloc)
                                                    </div>
                                                );
                                            }
                                        })()}
                                    </div>
                                </div>
                           </div>

                           <div className={`p-4 md:p-6 border-t flex flex-col gap-3 shrink-0 ${isDarkMode ? 'bg-[#0d0d12] border-[#222]' : 'bg-gray-50 border-gray-200'}`}>
                               <div className="flex flex-col gap-2">
                                    <label className="text-[10px] uppercase tracking-widest font-bold opacity-50 block">Moure a una carpeta</label>
                                    <div className="flex gap-2">
                                        <input 
                                            type="text" 
                                            list="folder-options"
                                            placeholder="Ex: posts" 
                                            className={`flex-1 border text-xs rounded-lg px-3 py-1.5 outline-none focus:border-blue-500 transition-colors ${isDarkMode ? 'bg-black border-[#333] text-white' : 'bg-white border-gray-300 text-black'}`}
                                            value={newFolderName}
                                            onChange={(e) => setNewFolderName(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleMove()}
                                        />
                                        <datalist id="folder-options">
                                            {folders.filter(f => f !== 'all').map(f => (
                                                <option key={f} value={f} />
                                            ))}
                                        </datalist>
                                        <button 
                                            onClick={handleMove}
                                            disabled={isMoving || !newFolderName.trim()}
                                            className={`disabled:opacity-50 rounded-lg px-3 py-1.5 flex items-center transition-colors ${isDarkMode ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-gray-200 hover:bg-gray-300 text-black'}`}
                                        >
                                            <ArrowRight size={14} />
                                        </button>
                                    </div>
                               </div>
                               
                               <div className={`flex gap-2 pt-2 border-t ${borderMain}`}>
                                    <button 
                                        onClick={handleDelete}
                                        disabled={isDeleting}
                                        className="flex-1 flex items-center justify-center gap-2 bg-red-600/10 hover:bg-red-600/20 text-red-600 border border-red-600/30 rounded-xl py-2 md:py-3 font-bold text-xs tracking-wide transition-all uppercase disabled:opacity-50"
                                    >
                                        <Trash2 size={14} /> Esborrar
                                    </button>
                                    <button className={`flex-1 rounded-xl py-2 md:py-3 font-black text-xs tracking-wide transition-all uppercase ${isDarkMode ? 'bg-white hover:bg-gray-200 text-black' : 'bg-black hover:bg-gray-800 text-white'}`}>
                                        Utilitzar
                                    </button>
                               </div>
                           </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MediaManager;

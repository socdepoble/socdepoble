import { useState, useRef, useEffect } from 'react';
import { X, List, Search, Type, Menu } from 'lucide-react';
import { ReactReader } from 'react-reader';

// Utility for local storage
const useLocalStorage = (key, initialValue) => {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.log(error);
            return initialValue;
        }
    });

    const setValue = (value) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.log(error);
        }
    };
    return [storedValue, setValue];
};

const EpubViewer = ({ 
    url, 
    title = "Sóc de Reader", 
    onClose 
}) => {
    const [location, setLocation] = useLocalStorage(`epub-location-${title}`, null);
    const [selections, setSelections] = useLocalStorage(`epub-highlights-${title}`, []);
    
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [tocOpen, setTocOpen] = useState(false);
    
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    
    const [toc, setToc] = useState([]);

    // Config controls
    const [theme, setTheme] = useLocalStorage('epub-theme', 'light'); // light, dark
    const [fontSize, setFontSize] = useLocalStorage('epub-font-size', 100);
    const [fontFamily, setFontFamily] = useLocalStorage('epub-font-family', 'Noto Sans');

    const renditionRef = useRef(null);

    // Dynamic theming injection
    useEffect(() => {
        if (renditionRef.current) {
            const rendition = renditionRef.current;
            
            // Themes definition
            rendition.themes.register('light', {
                body: { background: '#ffffff', color: '#0e0e0e' },
            });
            rendition.themes.register('dark', {
                body: { background: '#0e0e0e', color: '#f3f4f6' },
            });

            rendition.themes.select(theme);
            rendition.themes.fontSize(`${fontSize}%`);
            rendition.themes.font(fontFamily === 'Serif' ? 'Georgia, serif' : 'Noto Sans, sans-serif');
        }
    }, [theme, fontSize, fontFamily]);

    // Apply saved highlights when rendition changes
    useEffect(() => {
        if (renditionRef.current) {
            selections.forEach(({ cfiRange }) => {
                renditionRef.current.annotations.highlight(cfiRange, {}, (e) => {
                    console.log("Clicked highlight", e);
                });
            });
        }
    }, [selections]);

    const performSearch = async () => {
        if (!searchQuery || !renditionRef.current) return;
        setIsSearching(true);
        setSearchResults([]);
        try {
            const book = renditionRef.current.book;
            let results = [];
            for (let i = 0; i < book.spine.spineItems.length; i++) {
                const item = book.spine.spineItems[i];
                await item.load(book.load.bind(book));
                const itemResults = await item.find(searchQuery);
                item.unload();
                if(itemResults) {
                    results = results.concat(itemResults);
                }
            }
            setSearchResults(results);
        } catch (e) {
            console.error("Search failed", e);
        } finally {
            setIsSearching(false);
        }
    };

    const handleSearchClick = () => {
        setSearchOpen(!searchOpen);
        setSettingsOpen(false);
        setTocOpen(false);
    };

    const handleTocClick = () => {
        setTocOpen(!tocOpen);
        setSearchOpen(false);
        setSettingsOpen(false);
    };

    const handleSettingsClick = () => {
        setSettingsOpen(!settingsOpen);
        setSearchOpen(false);
        setTocOpen(false);
    };

    return (
        <div className="fixed inset-0 z-[5000] bg-black text-white flex flex-col animate-in fade-in duration-300">
            {/* Toolbar */}
            <div className="flex-none h-16 w-full flex items-center justify-between px-3 md:px-6 border-b border-white/10 bg-[#0e0e0e] z-20">
                <div className="flex items-center gap-2 md:gap-4">
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors active:scale-95">
                        <X size={24} />
                    </button>
                    <h2 className="font-bold tracking-widest uppercase text-sm truncate max-w-[120px] sm:max-w-md hidden md:block">
                        {title}
                    </h2>
                </div>
                
                <div className="flex items-center gap-1 md:gap-2">
                    <button 
                        onClick={handleTocClick}
                        className={`p-2 rounded-full transition-colors hidden md:block ${tocOpen ? 'bg-[var(--theme-accent-primary)] text-white' : 'hover:bg-white/10'}`}
                        title="Índex"
                    >
                        <List size={20} />
                    </button>
                    
                    <button 
                        onClick={handleSearchClick}
                        className={`p-2 rounded-full transition-colors ${searchOpen ? 'bg-[var(--theme-accent-primary)] text-white' : 'hover:bg-white/10'}`}
                        title="Cercar al libre"
                    >
                        <Search size={20} />
                    </button>

                    <button 
                        onClick={handleSettingsClick}
                        className={`p-2 rounded-full transition-colors ${settingsOpen ? 'bg-[var(--theme-accent-primary)] text-white' : 'hover:bg-white/10'}`}
                        title="Aparença"
                    >
                        <Type size={20} />
                    </button>
                    
                    {/* Mobile Index Toggle */}
                    <button 
                        onClick={handleTocClick}
                        className={`p-2 rounded-full transition-colors md:hidden ${tocOpen ? 'bg-[var(--theme-accent-primary)] text-white' : 'hover:bg-white/10'}`}
                    >
                        <Menu size={20} />
                    </button>
                </div>
            </div>

            {/* Table of Contents Popover */}
            {tocOpen && (
                <div className="absolute top-16 left-0 bottom-10 w-full md:w-80 bg-[#1a1a1a] border-r border-white/10 shadow-2xl z-20 overflow-y-auto animate-in slide-in-from-left">
                    <div className="p-4 border-b border-white/10 sticky top-0 bg-[#1a1a1a]/90 backdrop-blur-md">
                        <h3 className="text-xs uppercase font-bold tracking-widest text-[#a0a0a0]">Índex de Continguts</h3>
                    </div>
                    <ul className="p-2 space-y-1">
                        {toc.length === 0 ? (
                            <div className="p-4 text-center text-white/50 text-sm">Carregant índex...</div>
                        ) : toc.map((item, index) => (
                            <li key={index}>
                                <button
                                    onClick={() => {
                                        setLocation(item.href);
                                        if(window.innerWidth < 768) setTocOpen(false);
                                    }}
                                    className="w-full text-left p-3 hover:bg-white/5 rounded-lg transition-colors overflow-hidden"
                                >
                                    <span className="text-sm text-white/90 truncate block">{item.label}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Search Popover */}
            {searchOpen && (
                <div className="absolute top-16 right-0 md:right-4 w-full md:w-96 bg-[#1a1a1a] md:border border-white/10 md:rounded-b-2xl md:shadow-2xl z-20 max-h-[80vh] flex flex-col animate-in slide-in-from-top-2">
                    <div className="p-4 border-b border-white/10 shrink-0">
                        <h3 className="text-xs uppercase font-bold tracking-widest text-[#a0a0a0] mb-3">Cercar al llibre</h3>
                        <div className="flex gap-2">
                            <input 
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && performSearch()}
                                placeholder="Busca paraules..."
                                className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--theme-accent-primary)]"
                            />
                            <button 
                                onClick={performSearch}
                                disabled={isSearching || !searchQuery}
                                className="bg-[var(--theme-accent-primary)] hover:bg-[var(--theme-accent-primary)]/80 text-white px-4 py-2 rounded-lg text-sm font-bold disabled:opacity-50 transition-colors"
                            >
                                {isSearching ? '...' : 'Cercar'}
                            </button>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2">
                        {searchResults.length === 0 && searchQuery && !isSearching && (
                            <div className="p-4 text-center text-white/50 text-sm">Cap resultat trobat</div>
                        )}
                        {searchResults.map((res, idx) => (
                            <button 
                                key={idx}
                                onClick={() => {
                                    setLocation(res.cfi);
                                    if(window.innerWidth < 768) setSearchOpen(false);
                                }}
                                className="w-full text-left p-3 hover:bg-white/5 rounded-lg mb-1 transition-colors border border-transparent hover:border-white/5"
                            >
                                <p className="text-xs text-white/80 line-clamp-3 leading-relaxed" dangerouslySetInnerHTML={{ __html: res.excerpt.replace(new RegExp(`(${searchQuery})`, 'gi'), '<strong class="text-[var(--theme-accent-primary)] bg-white/10 px-0.5 rounded">$1</strong>') }} />
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Settings Popover */}
            {settingsOpen && (
                <div className="absolute top-16 right-0 md:right-4 w-full md:w-72 bg-[#1a1a1a] md:border border-white/10 md:rounded-b-2xl md:shadow-2xl p-5 z-20 animate-in slide-in-from-top-2">
                    <h3 className="text-xs uppercase font-bold tracking-widest text-[#a0a0a0] mb-4">Aparença i Tipografia</h3>
                    
                    {/* Font Size */}
                    <div className="flex items-center justify-between bg-black/40 rounded-xl mb-4 overflow-hidden border border-white/5">
                        <button 
                            onClick={() => setFontSize(Math.max(50, fontSize - 10))}
                            className="flex-1 py-3 text-lg font-medium hover:bg-white/5 disabled:opacity-50"
                        >
                            A-
                        </button>
                        <span className="text-sm font-bold text-white/50">{fontSize}%</span>
                        <button 
                            onClick={() => setFontSize(Math.min(200, fontSize + 10))}
                            className="flex-1 py-3 text-lg font-medium hover:bg-white/5 disabled:opacity-50"
                        >
                            A+
                        </button>
                    </div>

                    {/* Font Family */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                        <button 
                            onClick={() => setFontFamily('Sans')}
                            className={`py-2 px-3 rounded-lg text-sm transition-colors border ${fontFamily === 'Sans' ? 'bg-[var(--theme-accent-primary)] border-transparent font-bold' : 'bg-transparent border-white/10 hover:bg-white/5'} font-sans`}
                        >
                            MODERN<br/><span className="text-[10px] opacity-70 font-normal">Sans-Serif</span>
                        </button>
                        <button 
                            onClick={() => setFontFamily('Serif')}
                            className={`py-2 px-3 rounded-lg text-sm transition-colors border ${fontFamily === 'Serif' ? 'bg-[var(--theme-accent-primary)] border-transparent font-bold' : 'bg-transparent border-white/10 hover:bg-white/5'} font-serif`}
                        >
                            CLÀSSIC<br/><span className="text-[10px] opacity-70 font-normal">Serif</span>
                        </button>
                    </div>

                    {/* Theme */}
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setTheme('light')}
                            className={`flex-1 w-10 h-10 rounded-full border-2 transition-transform ${theme === 'light' ? 'border-[var(--theme-accent-primary)] scale-110' : 'border-white/20'} bg-white`}
                        />
                        <button 
                            onClick={() => setTheme('dark')}
                            className={`flex-1 w-10 h-10 rounded-full border-2 transition-transform ${theme === 'dark' ? 'border-[var(--theme-accent-primary)] scale-110' : 'border-white/20'} bg-[#0e0e0e]`}
                        />
                    </div>
                </div>
            )}

            {/* Reader Container */}
            <div className="flex-1 w-full relative bg-white overflow-hidden">
                <ReactReader
                    url={url}
                    title={title}
                    location={location}
                    locationChanged={(epubcifi) => setLocation(epubcifi)}
                    tocChanged={(tocItem) => setToc(tocItem)}
                    getRendition={(rendition) => {
                        renditionRef.current = rendition;

                        // Setup event listeners for highlights
                        rendition.on('selected', (cfiRange, contents) => {
                            const newSelections = [...selections, { cfiRange }];
                            setSelections(newSelections);
                            rendition.annotations.highlight(cfiRange, {}, () => {});
                            contents.window.getSelection().removeAllRanges();
                        });
                    }}
                    swipeable={true}
                    epubOptions={{
                        flow: "scrolled-doc",
                        width: "100%",
                        height: "100%"
                    }}
                    readerStyles={{
                        container: {
                            overflow: 'hidden',
                            position: 'relative',
                            height: '100%',
                            width: '100%',
                            backgroundColor: theme === 'dark' ? '#0e0e0e' : '#ffffff'
                        },
                        readerArea: { position: 'relative', zIndex: 1, height: '100%', width: '100%', overflow: 'auto', transition: 'background-color 0.3s' },
                        titleArea: { display: 'none' },
                        tocArea: { display: 'none' }, // Using our custom TOC button and popover instead
                        tocAreaButton: { display: 'none' }
                    }}
                />
            </div>
            
            {/* Progress / Footer */}
            <div className="flex-none h-10 w-full flex items-center justify-center border-t border-white/10 bg-[#0e0e0e] z-10 text-[10px] text-white/50 tracking-widest uppercase font-bold shadow-[0_-5px_20px_rgba(0,0,0,0.5)] leading-none pt-0.5">
                Mòdul eReader (Powered by epub.js)
            </div>
        </div>
    );
};

export default EpubViewer;

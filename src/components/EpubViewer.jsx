import React, { useState, useRef, useEffect } from 'react';
import { ReactReader } from 'react-reader';
import { X, Type, Bookmark, ChevronLeft, ChevronRight, Check } from 'lucide-react';

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

    return (
        <div className="fixed inset-0 z-[5000] bg-black text-white flex flex-col animate-in fade-in duration-300">
            {/* Toolbar */}
            <div className="flex-none h-16 w-full flex items-center justify-between px-6 border-b border-white/10 bg-[#0e0e0e] z-10">
                <div className="flex items-center gap-4">
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors active:scale-95">
                        <X size={24} />
                    </button>
                    <h2 className="font-bold tracking-widest uppercase text-sm truncate max-w-[200px] sm:max-w-md">
                        {title}
                    </h2>
                </div>
                
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => setSettingsOpen(!settingsOpen)}
                        className={`p-2 rounded-full transition-colors ${settingsOpen ? 'bg-[var(--theme-accent-primary)] text-white' : 'hover:bg-white/10'}`}
                    >
                        <Type size={20} />
                    </button>
                </div>
            </div>

            {/* Settings Popover */}
            {settingsOpen && (
                <div className="absolute top-20 right-4 w-72 bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl p-5 z-20 animate-in slide-in-from-top-4">
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
            <div className="flex-1 w-full relative bg-white">
                <ReactReader
                    url={url}
                    title={title}
                    location={location}
                    locationChanged={(epubcifi) => setLocation(epubcifi)}
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
                        flow: "paginated",
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
                        readerArea: { position: 'relative', zIndex: 1, height: '100%', width: '100%', overflow: 'hidden' },
                        titleArea: { display: 'none' },
                        tocArea: {
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            bottom: 0,
                            zIndex: 2,
                            width: '300px',
                            background: '#1a1a1a', 
                            color: 'white',
                            padding: '1rem',
                            overflowY: 'auto'
                        },
                        tocAreaButton: { display: 'none' }, // We will use our own custom TOC button later
                        arrow: {
                            background: 'transparent',
                            color: theme === 'dark' ? 'white' : 'black',
                            opacity: 0.3,
                            outline: 'none',
                            border: 'none',
                        },
                        arrowHover: { color: 'var(--theme-accent-primary)', opacity: 1 }
                    }}
                />
            </div>
            
            {/* Progress / Footer */}
            <div className="h-10 w-full flex items-center justify-center border-t border-black/5 bg-[#0e0e0e] z-10 text-[10px] text-white/50 tracking-widest uppercase font-bold">
                Mòdul eReader (Powered by epub.js)
            </div>
        </div>
    );
};

export default EpubViewer;

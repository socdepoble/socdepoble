const fs = require('fs');

let projectContent = fs.readFileSync('src/pages/public/ProjectPresentationNew.jsx', 'utf-8');

// Ensure state imports
if (!projectContent.includes('const [showIndex, setShowIndex] = useState(false);')) {
    projectContent = projectContent.replace(
        `const [currentViewMode, setCurrentViewMode] = useState(defaultViewMode || (viewModes ? viewModes[0] : 'document'));`,
        `const [currentViewMode, setCurrentViewMode] = useState(defaultViewMode || (viewModes ? viewModes[0] : 'document'));
    const [showIndex, setShowIndex] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    
    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log(\`Error attempting to enable fullscreen: \${err.message}\`);
            });
            setIsFullscreen(true);
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                setIsFullscreen(false);
            }
        }
    };`
    );
}

// Add the icons we need
if (!projectContent.includes('ArrowLeft')) {
    projectContent = projectContent.replace(
        `import { Book } from 'lucide-react';`,
        `import { Book, ArrowLeft, Search, Maximize, Minimize } from 'lucide-react';`
    );
}

// Replace PageHeader with the blue action bar
let oldHeader = `<PageHeader title={title} sticky={false} />`;
let newHeader = `
            {/* 3. ACTION BAR: PATRÓN PRIORITY+ (ARRIBA, FUERA DEL SCROLL) */}
            <header className="z-[var(--z-sticky,200)] w-full max-w-full overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.1)] bg-[#4F46E5] text-white dark:bg-[#F97316] dark:text-[#111111] transition-all shrink-0 touch-manipulation border-b border-black/10 dark:border-white/10">
                <div className="flex items-center justify-between min-h-[56px] px-2 sm:px-4 w-full max-w-7xl mx-auto overflow-hidden">
                    
                    {/* Esquerra: Tornar i Llibre */}
                    <div className="flex items-center justify-start gap-1 flex-1 min-w-0 shrink-0">
                        <button 
                            onClick={() => window.history.back()} 
                            className="flex items-center justify-center min-h-[44px] w-[44px] rounded-xl hover:bg-white/20 dark:hover:bg-black/10 active:scale-95 transition-colors touch-manipulation shrink-0"
                            aria-label="Tornar arrere"
                        >
                            <ArrowLeft size={20} strokeWidth={2.5} />
                        </button>
                        
                        <button 
                            className={\`flex items-center justify-center gap-1.5 min-h-[44px] px-3 sm:px-4 rounded-xl hover:bg-white/20 dark:hover:bg-black/10 active:scale-95 transition-colors touch-manipulation font-bold uppercase text-sm \${showIndex ? 'bg-white/20 dark:bg-black/20 opacity-100 shadow-inner' : ''}\`}
                            aria-label="Obrir Índex i Pàgines"
                            onClick={() => setShowIndex(!showIndex)}
                        >
                            <Book size={20} strokeWidth={2.5} />
                            <span className="font-extrabold tracking-wide hidden sm:inline">Llibre</span>
                        </button>
                    </div>

                    {/* Centre: Buit en aquesta configuració */}
                    <div className="flex items-center justify-center shrink-0 mx-2">
                    </div>

                    {/* Dreta: Cercar, Traduir, Comentar, etc. */}
                    <div className="flex items-center justify-end gap-1 sm:gap-2 flex-1 min-w-0 overflow-x-auto no-scrollbar scroll-smooth">
                        <button 
                            className={\`flex items-center justify-center gap-2 min-h-[44px] px-2 sm:px-3 rounded-xl hover:bg-white/20 dark:hover:bg-black/10 active:scale-95 transition-colors touch-manipulation font-bold uppercase text-sm shrink-0 \${isSearchOpen ? 'bg-white/20 dark:bg-black/20' : ''}\`}
                            aria-label="Obrir Cercador"
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                        >
                            <Search size={20} strokeWidth={2.5} />
                        </button>

                        <button 
                            className="hidden md:flex items-center justify-center min-h-[44px] w-[44px] hover:bg-white/20 dark:hover:bg-black/10 rounded-xl active:scale-95 touch-manipulation shrink-0" 
                            title={isFullscreen ? "Surt de Pantalla Completa" : "Llegit a Pantalla Completa"}
                            onClick={toggleFullscreen}
                        >
                            {isFullscreen ? <Minimize size={20} strokeWidth={2.5} /> : <Maximize size={20} strokeWidth={2.5} />}
                        </button>
                    </div>
                </div>
            </header>
`;

projectContent = projectContent.replace(oldHeader, newHeader);

// Replace FloatingIndex call
projectContent = projectContent.replace(
    `<FloatingIndex scrollRef={scrollContainerRef} />`,
    `<FloatingIndex scrollRef={scrollContainerRef} isOpen={showIndex} onToggle={setShowIndex} />`
);

fs.writeFileSync('src/pages/public/ProjectPresentationNew.jsx', projectContent, 'utf-8');
console.log('Patched ProjectPresentationNew.jsx successfully');

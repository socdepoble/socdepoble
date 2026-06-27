const fs = require('fs');

let projectContent = fs.readFileSync('src/pages/ProjectPresentation.jsx', 'utf-8');
let universalContent = fs.readFileSync('src/pages/public/UniversalPage.jsx', 'utf-8');

// Extract the action bar from ProjectPresentation
let startPattern = '{/* 5. ACTION BAR: PATRÓN PRIORITY+ (Format Barra Total) */}';
let endPattern = '{/* 6. FONS DEL LLIBRE */}';

let actionBar = projectContent.substring(
    projectContent.indexOf(startPattern),
    projectContent.indexOf(endPattern)
);

// We need to replace the header in UniversalPage.jsx
let uniStart = '{/* 3. ACTION BAR: PATRÓN PRIORITY+ (ARRIBA, FUERA DEL SCROLL) */}';
let uniEnd = '{/* Buscador Desplegable con 44x44px Targets */}';

let beforeHeader = universalContent.substring(0, universalContent.indexOf(uniStart));
let afterHeader = universalContent.substring(universalContent.indexOf(uniEnd));

let newHeader = `            {/* 3. ACTION BAR: PATRÓN PRIORITY+ (ARRIBA, FUERA DEL SCROLL) */}
            <header className="z-[var(--z-sticky,200)] w-full max-w-full overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.1)] bg-[#4F46E5] text-white dark:bg-[#F97316] dark:text-[#111111] transition-all shrink-0 touch-manipulation border-b border-black/10 dark:border-white/10">
                <div className="flex items-center justify-between min-h-[56px] px-2 sm:px-4 w-full max-w-7xl mx-auto overflow-hidden">
                    
                    {/* Esquerra: Tornar i Llibre */}
                    <div className="flex items-center justify-start gap-1 flex-1 min-w-0 shrink-0">
                        <button 
                            onClick={() => navigate(-1)} 
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
                            <span className="font-extrabold tracking-wide hidden sm:inline">Llibre{htmlContent ? ',' : ''}</span>
                            {htmlContent && (
                                <span className="tabular-nums font-black tracking-widest whitespace-nowrap ml-1 opacity-90">
                                    <span ref={pageNumberRef}>1</span>/{totalPages}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Centre: Buit en aquesta configuració */}
                    <div className="flex items-center justify-center shrink-0 mx-2">
                    </div>

                    {/* Dreta: Cercar, Traduir, Comentar, etc. */}
                    <div className="flex items-center justify-end gap-1 sm:gap-2 flex-1 min-w-0 overflow-x-auto no-scrollbar scroll-smooth">
                        <button 
                            className={\`flex items-center justify-center gap-2 min-h-[44px] px-2 sm:px-3 rounded-xl hover:bg-white/20 dark:hover:bg-black/10 active:scale-95 transition-colors touch-manipulation font-bold uppercase text-sm shrink-0 \${isSearchOpen ? 'bg-white/20 dark:bg-black/20' : ''}\`}
                            aria-label={t('project.open_search', "Obrir Cercador")}
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

fs.writeFileSync('src/pages/public/UniversalPage.jsx', beforeHeader + newHeader + afterHeader, 'utf-8');
console.log('Action bar replaced in UniversalPage.jsx');

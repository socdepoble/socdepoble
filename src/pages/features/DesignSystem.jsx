import React from 'react';
import UniversalPage from '../public/UniversalPage';
import { ArrowLeft, Book, MessageCircle, Share2, Plus, Globe, ChevronLeft, Menu, Search, User, Moon } from 'lucide-react';
import UniversalCardHeader from '../../components/ui/universal-card/UniversalCard.Header';

export default function DesignSystem() {
  
  // Faux data per als components
  const mockItem = {
    doc_type: 'projecte',
    slug: 'genotip',
    title: 'Genotip',
    authorName: 'Sóc de Poble',
    authorLocation: 'La Torre de les Maçanes',
    avatarUrl: '/assets/system/ui/logo-socdepoble-cuadrat-verd.svg',
    created_at: new Date().toISOString()
  };

  return (
    <UniversalPage 
      standAlone={false} 
      forcedTitle="Cànon Sóc de Poble"
      forcedHtml=" "
      forcedHeroImage="/assets/uploads/empresa/soc-de-poble/posts/disseny/5-section-media.jpg"
    >
      <div className="w-full bg-white pb-24 font-sans text-black">
        
        {/* Capçalera del Design System */}
        <div className="w-full px-4 py-8 md:py-12 mb-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-[#F97316] mb-2">
              El Cànon (Design System)
            </h1>
            <p className="text-lg text-gray-700 max-w-2xl leading-relaxed">
              Catàleg immutable de les 8 peces estructurals que formen qualsevol interfície de Sóc de Poble. 
              Aquest document és el <strong>Source of Truth</strong>. Cada secció s'explica de forma didàctica.
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 space-y-16">
          
          {/* Peça 0 */}
          <section>
            <h2 className="text-2xl font-black text-[#F97316] mb-2 uppercase flex items-center gap-3">
              <span className="w-8 h-8 rounded bg-[#F97316] text-white flex items-center justify-center text-sm">0</span>
              El Contenidor (AppLayout)
            </h2>
            <div className="bg-white dark:bg-[#1a1a1a] p-4 rounded-xl border border-black/10 dark:border-white/10 mb-4 shadow-sm">
              <p className="text-sm opacity-80 mb-2"><strong>Què és i per a què serveix:</strong> És l'esquelet invisible que ho aguanta tot. Gestiona l'alçada total de la pantalla (100vh), el fons de l'aplicació, i assegura que tot es mantinga en el seu lloc evitant que el scroll trenque la interfície.</p>
              <p className="text-sm opacity-80"><strong>Què conté:</strong> Fons fosc/clar, marges de seguretat (safe-areas), i flexbox mestre per a distribuir el Sidebar i el Contingut.</p>
            </div>
            <div className="w-full border-2 border-dashed border-red-300 rounded-2xl flex relative overflow-hidden bg-white/5 h-[300px]">
                <div className="absolute top-0 left-0 right-0 h-6 bg-red-100/50 border-b border-red-200 flex items-center justify-center text-[10px] text-red-500 font-bold">SAFE AREA TOP</div>
                
                {/* Simulació Sidebar */}
                <div className="w-16 md:w-64 border-r-2 border-dashed border-red-300 h-full flex flex-col items-center pt-8 bg-black/5">
                    <div className="hidden md:block text-xs text-red-400 font-bold rotate-90 mt-10 whitespace-nowrap">SIDEBAR</div>
                </div>
                
                {/* Simulació Contingut */}
                <div className="flex-1 h-full flex flex-col items-center justify-center p-4">
                    <div className="text-3xl font-black text-black/10 dark:text-white/10">100vh</div>
                    <div className="text-center text-sm opacity-40 mt-2 max-w-[200px]">
                        Estructura base indestructible i fons general de l'App.
                    </div>
                </div>
            </div>
          </section>

          {/* Peça 1 */}
          <section>
            <h2 className="text-2xl font-black text-[#F97316] mb-2 uppercase flex items-center gap-3">
              <span className="w-8 h-8 rounded bg-[#F97316] text-white flex items-center justify-center text-sm">1</span>
              La Capçalera de Secció (SystemNavBar)
            </h2>
            <div className="bg-white dark:bg-[#1a1a1a] p-4 rounded-xl border border-black/10 dark:border-white/10 mb-4 shadow-sm">
              <p className="text-sm opacity-80 mb-2"><strong>Què és i per a què serveix:</strong> És el menú superior dins d'una ruta. La via d'escapatòria o d'acció ràpida de l'usuari estiga on estiga.</p>
              <p className="text-sm opacity-80"><strong>Què conté:</strong> Botons d'acció global com Connectar, Traductor, Xat, Compartir i el botó per llegir l'OS.</p>
            </div>
            
            <div className="w-full flex flex-col border border-black/10 rounded-xl overflow-hidden shadow-2xl relative">
                <header className="w-full bg-[#4F46E5] text-white flex flex-col shrink-0 z-20 shadow-md">
                    <div className="flex items-center justify-between min-h-[50px] sm:min-h-[56px] px-2 sm:px-4 flex-wrap relative">
                        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                            <button className="flex items-center justify-center p-2 rounded-xl hover:bg-white/20 active:scale-95 transition-all text-white font-bold" aria-label="Tornar">
                                <ArrowLeft size={24} strokeWidth={3} />
                            </button>
                            <button className="flex items-center justify-center p-2 rounded-xl hover:bg-white/20 active:scale-95 transition-all text-white font-bold">
                                <Book size={24} strokeWidth={2.5} />
                            </button>
                        </div>

                        <div className="flex items-center justify-end gap-1 sm:gap-2 flex-1 min-w-0">
                            <button className="flex items-center justify-center min-h-[44px] px-2 sm:px-3 rounded-xl hover:bg-white/20 active:scale-95 transition-all">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/d/d7/Google_Translate_logo.svg" alt="Translate" className="w-[20px] h-[20px] drop-shadow-sm brightness-110" />
                            </button>
                            <button className="flex items-center justify-center min-h-[44px] px-2 sm:px-3 rounded-xl hover:bg-white/20 active:scale-95 transition-all text-white">
                                <MessageCircle size={20} />
                            </button>
                            <button className="flex items-center justify-center min-h-[44px] px-2 sm:px-3 rounded-xl hover:bg-white/20 active:scale-95 transition-all text-white">
                                <Share2 size={20} />
                            </button>
                            <button className="flex items-center justify-center gap-2 min-h-[44px] px-3 sm:px-4 rounded-full bg-white text-[#4F46E5] hover:bg-white/90 active:scale-95 transition-all font-black uppercase text-sm shadow-md ml-1">
                                <Plus size={20} strokeWidth={3} className="hidden sm:block" />
                                CONNECTAR
                            </button>
                        </div>
                    </div>
                </header>
            </div>
          </section>

          {/* Peça 2 */}
          <section>
            <h2 className="text-2xl font-black text-[#F97316] mb-2 uppercase flex items-center gap-3">
              <span className="w-8 h-8 rounded bg-[#F97316] text-white flex items-center justify-center text-sm">2</span>
              El Menú Lateral (DesktopSidebar)
            </h2>
            <div className="bg-white dark:bg-[#1a1a1a] p-4 rounded-xl border border-black/10 dark:border-white/10 mb-4 shadow-sm">
              <p className="text-sm opacity-80 mb-2"><strong>Què és i per a què serveix:</strong> La navegació principal del lloc web, només visible sencera en pantalles grans (ordinador/tablet).</p>
              <p className="text-sm opacity-80"><strong>Què conté:</strong> L'escut/logo principal de dalt a l'esquerra, el botó "+ CONNECTAR" blau, i la llista de rutes.</p>
            </div>
            
            <div className="w-full md:w-64 h-[400px] border border-black/10 rounded-xl overflow-hidden shadow-2xl bg-black text-white flex flex-col items-center py-6">
                 {/* This simulates the dark sidebar exactly as it is in the app */}
                 <div className="w-full flex items-center justify-center mb-6 px-4">
                     <img src="/assets/system/ui/logo-socdepoble-rect-blanc.svg" className="h-12 object-contain" alt="Logo Sóc de Poble" />
                 </div>
                 <button className="bg-[#4F46E5] text-white w-[90%] py-2.5 rounded-full font-bold flex items-center justify-center gap-2 mb-8 uppercase text-sm">
                     <Plus size={18} strokeWidth={3} /> CONNECTAR
                 </button>
                 <div className="w-full px-4 flex flex-col gap-1">
                     {['Xat', 'Mur', 'Mercat', 'Pobles'].map(item => (
                         <div key={item} className="flex items-center gap-4 py-2.5 px-4 text-white/80 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer transition-colors">
                             <Menu size={18} />
                             <span className="font-bold">{item}</span>
                         </div>
                     ))}
                 </div>
            </div>
          </section>

          {/* Peça 3 */}
          <section>
            <h2 className="text-2xl font-black text-[#F97316] mb-2 uppercase flex items-center gap-3">
              <span className="w-8 h-8 rounded bg-[#F97316] text-white flex items-center justify-center text-sm">3</span>
              La Zona de Contingut (MainScrollArea)
            </h2>
            <div className="bg-white dark:bg-[#1a1a1a] p-4 rounded-xl border border-black/10 dark:border-white/10 mb-4 shadow-sm">
              <p className="text-sm opacity-80 mb-2"><strong>Què és i per a què serveix:</strong> El full en blanc. És l'espai central on viu la informació de cada pàgina. És l'única part de la pantalla que fa "scroll" vertical independentment de la resta.</p>
              <p className="text-sm opacity-80"><strong>Què conté:</strong> És un espai buit que es reomple amb les peces 4, 5, 6, 7 i el contingut final.</p>
            </div>
            
            <div className="w-full h-[300px] border-4 border-dashed border-indigo-300 rounded-2xl bg-indigo-50/50 dark:bg-indigo-900/20 relative overflow-y-auto flex flex-col items-center">
                 <div className="w-full max-w-md bg-white dark:bg-[#1a1a1a] shadow-lg rounded-xl h-[500px] my-8 p-8 flex flex-col items-center justify-center text-center">
                     <ChevronLeft className="rotate-90 text-indigo-300 w-12 h-12 animate-bounce" />
                     <p className="font-bold text-indigo-400 mt-4">Àrea de Scroll Independent</p>
                     <p className="text-sm opacity-50 mt-2">La resta de l'App (Barra Blava, Sidebar) es queda fixa mentres açò fa scroll.</p>
                 </div>
            </div>
          </section>

          {/* Peça 4 */}
          <section>
            <h2 className="text-2xl font-black text-[#F97316] mb-2 uppercase flex items-center gap-3">
              <span className="w-8 h-8 rounded bg-[#F97316] text-white flex items-center justify-center text-sm">4</span>
              Capçalera de Secció (SectionTitleHeader)
            </h2>
            <div className="bg-white dark:bg-[#1a1a1a] p-4 rounded-xl border border-black/10 dark:border-white/10 mb-4 shadow-sm">
              <p className="text-sm opacity-80 mb-2"><strong>Què és i per a què serveix:</strong> L'encapçalament que anuncia on estem dins del contingut (ex: quan canviem de secció dins d'un text llarg).</p>
              <p className="text-sm opacity-80"><strong>Què conté:</strong> Títol gran, i un subtítol opcional, alineats normalment per a separar blocs de text.</p>
            </div>
            
            <div className="w-full bg-white dark:bg-black/20 p-8 rounded-2xl border border-black/10 dark:border-white/10 flex flex-col shadow-sm">
                <h2 className="text-3xl font-black text-black dark:text-white uppercase tracking-tight">Capçalera de Secció</h2>
                <p className="text-lg text-[#F97316] font-bold uppercase mt-1">Això és el subtítol que acompanya la capçalera</p>
                <div className="w-12 h-1 bg-[#F97316] mt-4"></div>
            </div>
          </section>

          {/* Peça 5 */}
          <section>
            <h2 className="text-2xl font-black text-[#F97316] mb-2 uppercase flex items-center gap-3">
              <span className="w-8 h-8 rounded bg-[#F97316] text-white flex items-center justify-center text-sm">5</span>
              Contingut Multimèdia (HeroMedia)
            </h2>
            <div className="bg-white dark:bg-[#1a1a1a] p-4 rounded-xl border border-black/10 dark:border-white/10 mb-4 shadow-sm">
              <p className="text-sm opacity-80 mb-2"><strong>Què és i per a què serveix:</strong> L'impacte visual de la pàgina. La portada (la imatge de les eines del camp o el paisatge).</p>
              <p className="text-sm opacity-80"><strong>Què conté:</strong> Una imatge (o carrusel/vídeo) en format horitzontal que omple l'amplada de la zona de contingut. Sense text a sobre.</p>
            </div>
            
            <div className="w-full h-64 bg-[#222] rounded-2xl overflow-hidden relative shadow-lg">
                <img src="/uploads/avatars/iaia_comic_matriarch.png" className="w-full h-full object-cover opacity-70 mix-blend-luminosity" alt="Hero" />
                <div className="absolute inset-0 border-[6px] border-dashed border-[#F97316] m-4 flex items-center justify-center opacity-80 pointer-events-none">
                    <span className="bg-[#F97316] text-white font-black px-4 py-2 uppercase tracking-widest text-xl">Hero Media (Imatge Principal)</span>
                </div>
            </div>
          </section>

          {/* Peça 6 */}
          <section>
            <h2 className="text-2xl font-black text-[#F97316] mb-2 uppercase flex items-center gap-3">
              <span className="w-8 h-8 rounded bg-[#F97316] text-white flex items-center justify-center text-sm">6</span>
              Caputxa d'Identitat (UniversalCardHeader)
            </h2>
            <div className="bg-white dark:bg-[#1a1a1a] p-4 rounded-xl border border-black/10 dark:border-white/10 mb-4 shadow-sm">
              <p className="text-sm opacity-80 mb-2"><strong>Què és i per a què serveix:</strong> El segell d'autoria. Diu a l'usuari qui ha escrit allò que està llegint. És la famosa "barra taronja" oficial.</p>
              <p className="text-sm opacity-80"><strong>Què conté:</strong> Avatar en cercle verd (Sóc de Poble), el nom de l'autor, ubicació ("La Torre de les Maçanes"), i a la dreta la versió i la data.</p>
            </div>
            
            <div className="w-full bg-white dark:bg-black/20 p-8 rounded-2xl border border-black/10 flex items-center justify-center shadow-inner">
                 <UniversalCardHeader
                    item={null}
                    cardVariant="project"
                    displayTown={mockItem.authorLocation}
                    displayAuthor={mockItem.authorName}
                    avatarSrc={mockItem.avatarUrl}
                    avatarRole="official"
                    infoText="V10.38.21"
                    displayDate="15/5/2026"
                    displayTime="12:00"
                    isPageHeader={true}
                 />
            </div>
          </section>

          {/* Peça 7 */}
          <section>
            <h2 className="text-2xl font-black text-[#F97316] mb-2 uppercase flex items-center gap-3">
              <span className="w-8 h-8 rounded bg-[#F97316] text-white flex items-center justify-center text-sm">7</span>
              Decoració del Títol (DecoratedTitle)
            </h2>
            <div className="bg-white dark:bg-[#1a1a1a] p-4 rounded-xl border border-black/10 dark:border-white/10 mb-4 shadow-sm">
              <p className="text-sm opacity-80 mb-2"><strong>Què és i per a què serveix:</strong> El quadre de presentació del document. Dona una sensació de "Llibre" o "Dossier" oficial al lector.</p>
              <p className="text-sm opacity-80"><strong>Què conté:</strong> Fons blanc amb vores arrodonides, pot contindre el gran Logo negre de Sóc de Poble i el títol de la pàgina en taronja.</p>
            </div>
            
            <div className="w-full bg-gray-100 dark:bg-[#222] p-8 sm:p-12 rounded-3xl flex items-center justify-center shadow-inner">
                <div className="bg-white rounded-[28px] shadow-xl p-8 flex flex-col items-center justify-center text-center border-4 border-white w-full max-w-2xl transform hover:scale-[1.02] transition-transform">
                    <img 
                        src="/assets/system/ui/logo-socdepoble-rect-negre.svg" 
                        alt="Logo Sóc de Poble" 
                        className="h-24 sm:h-28 w-auto mb-6 object-contain dark:invert"
                    />
                    <h1 className="text-4xl sm:text-5xl font-black text-[#F97316] uppercase tracking-tight leading-none max-w-2xl break-words">
                        GENOTIP
                    </h1>
                </div>
            </div>
          </section>

        </div>
      </div>
    </UniversalPage>
  );
}

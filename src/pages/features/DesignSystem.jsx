import React from 'react';
import UniversalPage from '../public/UniversalPage';
import { ArrowLeft, Book, MessageCircle, Share2, Plus, Search, Moon, UserPlus, Info, X, ShieldCheck } from 'lucide-react';
import UniversalCardHeader from '../../components/ui/universal-card/UniversalCard.Header';
import UniversalCard from '../../components/ui/universal-card';
import { Button } from '../../components/ui/Button';
import IAIAIcon from '../../components/icons/IAIAIcon';
import LanguageSelector from '../../components/ui/LanguageSelector';

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

  const mockPoble = {
    id: 'mock-poble',
    name: 'La Torre de les Maçanes',
    image_url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=1000',
    description: "Poble de muntanya amagat entre bancals de secà i pinedes de l'Alacantí."
  };

  return (
    <UniversalPage 
      standAlone={false} 
      forcedTitle="Cànon Sóc de Poble"
      forcedHtml=" "
      forcedHeroImage="/assets/uploads/brain/ibanez_design_system_1780246898431.png"
    >
      <div className="w-full max-w-4xl mx-auto app-cms-content pb-32">
        
        <p className="lead text-center max-w-2xl mx-auto mb-12">
          Aquest és el Llibre Oficial del Sistema de Disseny (Inspirat en M3). Un catàleg immutable de les peces estructurals que formen qualsevol interfície de Sóc de Poble. Aquest document és el <strong>Source of Truth</strong>.
        </p>

        {/* =========================================
            PART 1: FONAMENTS
            ========================================= */}
        <h2 id="fonaments">1. FONAMENTS (Foundations)</h2>
        <p>La base atòmica del sistema. Regles inquebrantables que sostenen la resta de l'arquitectura.</p>
        
        <h3 id="principi-trellat">1.1. Filosofia "Trellat"</h3>
        <div className="bg-m3-primary/10 dark:bg-m3-primary/15 border border-m3-primary/20 p-5 rounded-2xl mb-6">
          <p className="mb-0 text-sm">
            <strong>Accessibilitat Rural (Mode Bancal):</strong> Dissenyem per ser llegits a ple sol a la serra amb un iPad, i per iaies amb visió reduïda. Contrast AAA, formes geomètriques amples (GEM 28px) i zero animacions innecessàries que saturen el xip A10.
          </p>
        </div>

        <h3 id="colors">1.2. Identitat Cromàtica (Colors)</h3>
        <p>Colors purs i vibrants preparats per al contrast màxim en mode fosc i clar. Calcats de la normativa oficial de disseny.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-8 notranslate">
          {/* Primary */}
          <div className="flex flex-col gap-2">
            <div className="bg-m3-primary text-m3-on-primary rounded-3xl p-5 flex flex-col justify-between h-40 shadow-sm border border-black/5">
              <div className="flex justify-between font-bold text-sm">
                <span>Primary</span>
                <span className="opacity-80 font-mono">var(--md-sys-color-primary)</span>
              </div>
            </div>
            <div className="flex w-full h-8 rounded-full overflow-hidden border border-black/5">
              {['bg-orange-950','bg-orange-900','bg-orange-800','bg-orange-700','bg-orange-600','bg-orange-500','bg-orange-400','bg-orange-300','bg-orange-200','bg-orange-100'].map(cls => (
                <div key={cls} className={`flex-1 ${cls}`}></div>
              ))}
            </div>
          </div>

          {/* Secondary */}
          <div className="flex flex-col gap-2">
            <div className="bg-m3-secondary text-m3-on-secondary rounded-3xl p-5 flex flex-col justify-between h-40 shadow-sm border border-black/5">
              <div className="flex justify-between font-bold text-sm">
                <span>Secondary</span>
                <span className="opacity-80 font-mono">var(--md-sys-color-secondary)</span>
              </div>
            </div>
            <div className="flex w-full h-8 rounded-full overflow-hidden border border-black/5">
              {['bg-sky-950','bg-sky-900','bg-sky-800','bg-sky-700','bg-sky-600','bg-sky-500','bg-sky-400','bg-sky-300','bg-sky-200','bg-sky-100'].map(cls => (
                <div key={cls} className={`flex-1 ${cls}`}></div>
              ))}
            </div>
          </div>

          {/* Tertiary */}
          <div className="flex flex-col gap-2">
            <div className="bg-m3-surface text-m3-on-surface rounded-3xl p-5 flex flex-col justify-between h-40 shadow-sm border border-black/10">
              <div className="flex justify-between font-bold text-sm">
                <span>Tertiary / Surface</span>
                <span className="opacity-80 font-mono">var(--md-sys-color-surface)</span>
              </div>
            </div>
            <div className="flex w-full h-8 rounded-full overflow-hidden border border-black/10">
              {['bg-gray-900','bg-gray-800','bg-gray-700','bg-gray-600','bg-gray-500','bg-gray-400','bg-gray-300','bg-gray-200','bg-gray-100','bg-white'].map(cls => (
                <div key={cls} className={`flex-1 ${cls}`}></div>
              ))}
            </div>
          </div>

          {/* Neutral */}
          <div className="flex flex-col gap-2">
            <div className="bg-m3-on-surface text-m3-surface rounded-3xl p-5 flex flex-col justify-between h-40 shadow-sm border border-white/10">
              <div className="flex justify-between font-bold text-sm">
                <span>Neutral / Base</span>
                <span className="opacity-80 font-mono">var(--md-sys-color-on-surface)</span>
              </div>
            </div>
            <div className="flex w-full h-8 rounded-full overflow-hidden border border-white/20">
              {['bg-black','bg-zinc-900','bg-zinc-800','bg-zinc-700','bg-zinc-600','bg-zinc-500','bg-zinc-400','bg-zinc-300','bg-zinc-200','bg-zinc-100'].map(cls => (
                <div key={cls} className={`flex-1 ${cls}`}></div>
              ))}
            </div>
          </div>
        </div>

        <h3 id="tipografia">1.3. Tipografia, Textos i "Dark Mode"</h3>
        <p><strong>Què és i per a què serveix:</strong> El manual definitiu de tipografia per a tota l'App. Resolucions al mil·límetre per a garantir la perfecció visual i contrast adequat (Light vs Dark).</p>
        <p>En el mode fosc (<code>Dark Mode</code>), l'aplicació usa fons <code>#111827</code> (Gris molt fosc, gairebé negre) i el text general s'inverteix a <code>#F3F4F6</code> per garantir la llegibilitat. En el mode clar, el fons és <code>#F3F4F6</code> i el text <code>#1F2937</code>.</p>
        
          <h1>H1: Títol de Pàgina (Blau)</h1>
          <p><strong>Color H1:</strong> var(--theme-accent-secondary) / Blau Fuerte (#0984E3).</p>

          <h2>H2: Subtítol Principal (Taronja)</h2>
          <p className="lead">
            Això és un exemple d'entradilla lleugera (lead). Una <strong>presentació opcional</strong> dissenyada específicament per a introduir el context sota els grans titulars amb la màxima elegància SEO i un text més prim per contrastar.
          </p>
          <p><strong>Color H2:</strong> var(--theme-accent-primary) / Taronja Fuerte (#F97316).</p>

          <h3>H3: Component o Subsecció (Blau)</h3>
          <p><strong>Color H3:</strong> var(--theme-accent-secondary) / Blau (#0984E3).</p>
          
          <h4>H4: Etiqueta Destacada</h4>
          <p>Titulars de llistes, formularis o blocs secundaris. Color: Taronja.</p>
          
          <h5>H5: Títol de Targeta Xicoteta</h5>
          <p>Text de suport on l'espai és reduït. Color: Blau.</p>
          
          <h6>H6: Micro-etiqueta (Kicker)</h6>
          <p>Dates, tags, o petites instruccions. Color: Negre / Blanc.</p>

        <h3 id="espaiat">1.4. Lleis d'Espaiat i Contenidors</h3>
        <ol>
          <li><strong>Cap duplicació de Paddings:</strong> Si <code>AppLayout</code> o <code>UniversalPage</code> ja proporcionen <code>px-6</code>, cap element fill hauria de tindre <code>px-4</code> a menys que siga explícitament una targeta interior (<code>card</code>).</li>
          <li><strong>Ritme Vertical (Vertical Rhythm):</strong> L'espai entre grans seccions (H2) es gestiona de forma centralitzada mitjançant pare flex amb <code>gap-12</code> (48px) o <code>gap-16</code> (64px). Dins de les seccions s'usa <code>gap-4</code>.</li>
          <li><strong>Relació Títol-Text:</strong> Mai separar un H3 del seu paràgraf amb més de 16px (<code>mb-4</code> o <code>gap-4</code>). Ha de semblar que el títol "cau" sobre el text.</li>
        </ol>

        {/* =========================================
            PART 2: COMPONENTS
            ========================================= */}
        <hr className="my-16 border-white/10" />
        <h2 id="components">2. COMPONENTS (Elements d'Interfície)</h2>
        <p>Peces reutilitzables que componen l'aplicació.</p>

        <h3 id="botons">2.1. Botons (Interactive Buttons)</h3>
        <p><strong>Què és i per a què serveix:</strong> L'element atòmic d'interacció. Tenim botons primaris (crida a l'acció forta), secundaris (opcions alternatives), i perillosos (esborrar).</p>
        
        <div className="flex flex-wrap gap-4 p-6 bg-theme-panel rounded-3xl border border-white/10 shadow-sm my-6 items-center">
          <Button intent="primary">Botó Primari</Button>
          <Button intent="secondary">Botó Secundari</Button>
          <Button intent="danger">Acció de Perill</Button>
          <Button intent="ghost">Botó Fantasma</Button>
          <Button intent="canonic">Botó Canònic</Button>
          <Button intent="primary" isLoading={true}>Carregant...</Button>
        </div>

        <h3 id="alertes">2.2. Banners i Alertes</h3>
        <p><strong>Què és i per a què serveix:</strong> Banners horitzontals que avisen a l'usuari d'alguna cosa important o contextual. S'adhereixen dalt dels continguts, o es mostren intercalats.</p>
        
        <div className="my-6 flex flex-col gap-4">
          {/* Info Banner */}
          <div className="w-full bg-m3-secondary/10 dark:bg-m3-secondary/15 border border-m3-secondary/20 px-3 py-2 flex items-center justify-between gap-3 shadow-inner z-40 rounded-xl">
            <div className="flex items-center gap-2 flex-1 min-w-0">
               <Info size={18} className="text-m3-secondary flex-shrink-0" />
               <p className="text-[11px] sm:text-xs text-gray-800 dark:text-gray-200 leading-tight md:whitespace-normal mb-0">
                 <span className="font-black mr-1 hidden sm:inline">Avís Normal:</span> 
                 Aquest és un banner blau per a notificacions de sistema o consells.
               </p>
            </div>
            <button className="flex-shrink-0 text-gray-500 hover:text-m3-secondary transition-colors bg-white/50 dark:bg-black/20 rounded-lg p-1 border border-black/5 dark:border-white/5" aria-label="Tancar avís">
              <X size={20} strokeWidth={2.5} />
            </button>
          </div>

          {/* Alert Banner */}
          <div className="w-full bg-m3-primary/10 dark:bg-m3-primary/15 border border-m3-primary/20 px-3 py-2 flex items-center justify-between gap-3 shadow-inner z-40 rounded-xl">
            <div className="flex items-center gap-2 flex-1 min-w-0">
               <ShieldCheck size={18} className="text-m3-primary flex-shrink-0" />
               <p className="text-[11px] sm:text-xs text-gray-800 dark:text-gray-200 leading-tight md:whitespace-normal mb-0">
                 <span className="font-black mr-1 hidden sm:inline">Patrimoni Obert Connectat:</span> 
                 Banner taronja corporatiu per a avisos importants (Ex. Mode Viquipèdia).
               </p>
            </div>
            <button className="flex-shrink-0 text-gray-500 hover:text-m3-primary transition-colors bg-white/50 dark:bg-black/20 rounded-lg p-1 border border-black/5 dark:border-white/5" aria-label="Tancar avís">
              <X size={20} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        <h3 id="cites">2.3. Cites i Destacats (Blockquotes)</h3>
        <p><strong>Què és i per a què serveix:</strong> Per destacar fragments de text importants, resums o citacions de personatges dins del cos del text.</p>
        
        <blockquote className="my-6 border-l-4 border-[var(--theme-accent-primary)] pl-4 italic opacity-90 text-lg">
          "El 'Trellat' és la nostra arma secreta. Construïm programari pensant en les iaies i en el lent 3G de la serra."
          <footer className="mt-2 text-sm font-bold opacity-70 not-italic">— Javi Llinares, Creador de Sóc de Poble</footer>
        </blockquote>

        <h3 id="universal-header">2.4. Caputxa d'Identitat (UniversalCardHeader)</h3>
        <p><strong>Què és i per a què serveix:</strong> El segell d'autoria de Sóc de Poble. Diu a l'usuari qui ha escrit allò que està llegint (Poble, Nom, Data).</p>
        
        <div className="my-6 max-w-md">
          <UniversalCardHeader
              item={null}
              cardVariant="project"
              displayTown={mockItem.authorLocation}
              displayAuthor={mockItem.authorName}
              avatarSrc={mockItem.avatarUrl}
              avatarRole="official"
              infoText="V10.38.26"
              displayDate="15/5/2026"
              displayTime="12:00"
              isPageHeader={true}
          />
        </div>

        <h3 id="universal-card">2.5. Targeta Universal (UniversalCard)</h3>
        <p><strong>Què és i per a què serveix:</strong> El contenidor mestre de la informació. La famosa `Card` (targeta). S'usa en les llistes de pobles, el mercat o les publicacions. Conté el seu propi header, body (amb foto) i footer.</p>
        
        <div className="my-6 max-w-sm">
          <UniversalCard
            item={mockPoble}
            subtitle="L'Alacantí"
            avatarSrc={mockPoble.image_url}
            avatarName="Gent de La Torre"
            excerpt={mockPoble.description}
            className="town-card w-full"
            image={mockPoble.image_url}
            mode="pobles"
            isBating={false}
            viewMode="grid"
          />
        </div>

        {/* =========================================
            PART 3: PATRONS I ARQUITECTURA
            ========================================= */}
        <hr className="my-16 border-white/10" />
        <h2 id="patrons">3. PATRONS I ARQUITECTURA (Layout)</h2>
        <p>Com s'uneixen els components atòmics per crear les grans plantilles de les pàgines de l'aplicació.</p>

        <h3 id="universal-header">3.1. La Capçalera Mestra (UniversalHeader)</h3>
        <p>El nucli indestructible. Aquesta capçalera s'encarrega de contindre la identitat visual i eines globals.</p>
        
        <h4>Format Desktop / Tablet</h4>
        <header className="notranslate h-[64px] min-h-[64px] w-full flex items-center justify-between pr-6 z-50 bg-black border-b border-white/10 shrink-0 shadow-lg relative my-6 rounded-lg overflow-hidden">
          <div className="flex items-center justify-start pl-[30px] shrink-0 z-10 gap-3">
            <img src="/assets/system/ui/logo-socdepoble-rect-blanc.svg" alt="Sóc de Poble" className="h-[45px] w-auto object-contain filter shrink min-w-0" />
          </div>
          <div className="flex items-center gap-[20px] ml-auto h-full z-10 relative shrink-0 pr-[32px]">
            <div className="shrink-0 z-50"><LanguageSelector variant="header" /></div>
            <div className="shrink-0 w-12 h-12 flex items-center justify-center transition-all text-white/70"><IAIAIcon size={36} color="currentColor" className="shrink-0 w-[36px] h-[36px] opacity-60" /></div>
            <div className="shrink-0 w-12 h-12 flex items-center justify-center text-white/70 hover:text-white"><Search className="shrink-0 w-[36px] h-[36px]" /></div>
            <div className="shrink-0 w-12 h-12 flex items-center justify-center text-white/70 hover:text-white"><Moon className="shrink-0 w-[36px] h-[36px]" /></div>
            <div className="shrink-0 w-12 h-12 flex items-center justify-center text-white/70"><UserPlus className="shrink-0 w-[36px] h-[36px]" /></div>
          </div>
        </header>

        <h4>Format Mòbil</h4>
        <header className="notranslate h-[56px] min-h-[56px] w-full max-w-[460px] flex items-center justify-between pr-2 z-50 bg-black border-b border-white/10 shrink-0 shadow-lg relative my-6 rounded-lg overflow-hidden">
          <div className="flex items-center justify-start pl-[20px] shrink-0 z-10 gap-3">
            <img src="/assets/system/ui/logo-socdepoble-rect-blanc.svg" alt="Sóc de Poble" className="h-[32px] w-auto object-contain filter shrink min-w-0" />
          </div>
          <div className="flex items-center gap-[4px] ml-auto h-full z-10 relative shrink-0 pr-[2px]">
            <div className="shrink-0 z-50"><LanguageSelector variant="header" /></div>
            <div className="shrink-0 w-10 h-10 flex items-center justify-center transition-all scale-95 text-white/70"><IAIAIcon size={36} color="currentColor" className="shrink-0 w-[36px] h-[36px] opacity-60" /></div>
            <div className="shrink-0 w-10 h-10 flex items-center justify-center text-white/70 hover:text-white"><Search className="shrink-0 w-[36px] h-[36px]" /></div>
            <div className="shrink-0 w-10 h-10 flex items-center justify-center text-white/70 hover:text-white"><Moon className="shrink-0 w-[36px] h-[36px]" /></div>
            <div className="shrink-0 w-10 h-10 flex items-center justify-center text-white/70"><UserPlus className="shrink-0 w-[36px] h-[36px]" /></div>
          </div>
        </header>

        <h3 id="system-nav-bar">3.2. Capçalera de Secció (SystemNavBar)</h3>
        <p>Menú superior dins d'una ruta. La via d'escapatòria o d'acció ràpida de l'usuari.</p>
        
        <header className="w-full bg-indigo-600 text-white flex flex-col shrink-0 z-20 shadow-md my-6 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between min-h-[50px] sm:min-h-[56px] px-2 sm:px-4 flex-wrap relative">
                <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                    <button className="flex items-center justify-center p-2 rounded-xl hover:bg-white/20 active:scale-95 transition-all text-white font-bold" aria-label="Tornar">
                        <ArrowLeft size={24} strokeWidth={3} />
                    </button>
                    <button className="flex items-center justify-center p-2 rounded-xl hover:bg-white/20 active:scale-95 transition-all text-white font-bold" aria-label="Llegir Sistema Operatiu">
                        <Book size={24} strokeWidth={2.5} />
                    </button>
                </div>
                <div className="flex items-center justify-end gap-1 sm:gap-2 flex-1 min-w-0">
                    <button className="flex items-center justify-center min-h-[44px] px-2 sm:px-3 rounded-xl hover:bg-white/20 active:scale-95 transition-all" aria-label="Traduir pàgina">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/d/d7/Google_Translate_logo.svg" alt="Translate" className="w-[20px] h-[20px] drop-shadow-sm brightness-110" />
                    </button>
                    <button className="flex items-center justify-center min-h-[44px] px-2 sm:px-3 rounded-xl hover:bg-white/20 active:scale-95 transition-all text-white" aria-label="Obrir xat">
                        <MessageCircle size={20} />
                    </button>
                    <button className="flex items-center justify-center min-h-[44px] px-2 sm:px-3 rounded-xl hover:bg-white/20 active:scale-95 transition-all text-white" aria-label="Compartir pàgina">
                        <Share2 size={20} />
                    </button>
                    <button className="flex items-center justify-center gap-2 min-h-[44px] px-3 sm:px-4 rounded-full bg-white text-indigo-600 font-black uppercase text-sm shadow-md ml-1">
                        <Plus size={20} strokeWidth={3} className="hidden sm:block" />
                        CONNECTAR
                    </button>
                </div>
            </div>
        </header>

        <h3 id="sidebar">3.3. El Menú Lateral (DesktopSidebar)</h3>
        <p>La navegació principal del lloc web, només visible sencera en pantalles grans (a partir de 1024px). Conté l'escut principal, el botó blau, i la llista de rutes.</p>

        <h3 id="contingut">3.4. La Zona de Contingut (MainScrollArea)</h3>
        <p>És l'única part de la pantalla que fa "scroll" vertical independentment de la resta. Tot el contingut que esteu llegint ara mateix es troba dins d'aquesta àrea segura amb el seu propi <code>content-visibility: auto</code> per estalviar memòria al navegador.</p>

      </div>
    </UniversalPage>
  );
}

import React from 'react';
import UniversalPage from '../public/UniversalPage';
import { ArrowLeft, Book, MessageCircle, Share2, Plus, Search, Moon, UserPlus } from 'lucide-react';
import UniversalCardHeader from '../../components/ui/universal-card/UniversalCard.Header';
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

  return (
    <UniversalPage 
      standAlone={false} 
      forcedTitle="Cànon Sóc de Poble"
      forcedHtml=" "
      forcedHeroImage="/assets/uploads/brain/ibanez_design_system_1780246898431.png"
    >
      <div className="w-full max-w-4xl mx-auto app-cms-content">
        
        <h2>El Cànon (Design System)</h2>
        <p className="lead">
          Catàleg immutable de les peces estructurals que formen qualsevol interfície de Sóc de Poble. Aquest document és el <strong>Source of Truth</strong>. Cada secció s'explica de forma didàctica.
        </p>

        <h3>Branding i Paleta de Colors</h3>
        <p>Aquesta és la definició de la nostra identitat cromàtica. Colors purs i vibrants preparats per al contrast màxim en mode fosc i clar, calcats de la normativa oficial de disseny.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-8 notranslate">
          {/* Primary */}
          <div className="flex flex-col gap-2">
            <div className="bg-[#F97316] text-black rounded-3xl p-5 flex flex-col justify-between h-40 shadow-sm border border-black/5">
              <div className="flex justify-between font-bold text-sm">
                <span>Primary</span>
                <span className="opacity-80 font-mono">#F97316</span>
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
            <div className="bg-[#169CF9] text-black rounded-3xl p-5 flex flex-col justify-between h-40 shadow-sm border border-black/5">
              <div className="flex justify-between font-bold text-sm">
                <span>Secondary</span>
                <span className="opacity-80 font-mono">#169CF9</span>
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
            <div className="bg-[#FFFFFF] text-black rounded-3xl p-5 flex flex-col justify-between h-40 shadow-sm border border-black/10">
              <div className="flex justify-between font-bold text-sm">
                <span>Tertiary</span>
                <span className="opacity-80 font-mono">#FFFFFF</span>
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
            <div className="bg-[#000000] text-white rounded-3xl p-5 flex flex-col justify-between h-40 shadow-sm border border-white/10">
              <div className="flex justify-between font-bold text-sm">
                <span>Neutral</span>
                <span className="opacity-80 font-mono">#000000</span>
              </div>
            </div>
            <div className="flex w-full h-8 rounded-full overflow-hidden border border-white/20">
              {['bg-black','bg-zinc-900','bg-zinc-800','bg-zinc-700','bg-zinc-600','bg-zinc-500','bg-zinc-400','bg-zinc-300','bg-zinc-200','bg-zinc-100'].map(cls => (
                <div key={cls} className={`flex-1 ${cls}`}></div>
              ))}
            </div>
          </div>
        </div>

        <h3>0. El Contenidor (AppLayout)</h3>
        <p><strong>Què és i per a què serveix:</strong> És l'esquelet invisible que ho aguanta tot. Gestiona l'alçada total de la pantalla (100vh), el fons de l'aplicació, i assegura que tot es mantinga en el seu lloc evitant que el scroll trenque la interfície.</p>
        <p><strong>Què conté:</strong> Fons fosc/clar, marges de seguretat (safe-areas), i flexbox mestre per a distribuir el Sidebar i el Contingut.</p>
        
        <h3>1. La Capçalera Mestra (UniversalHeader)</h3>
        <p><strong>Què és i per a què serveix:</strong> L'escut d'armes de l'aplicació. El nucli nuclear indestructible. Aquesta capçalera s'encarrega de contindre la identitat visual (logotip) i les eines globals (idioma, visió IAIA, cercador, tema i perfil).</p>
        <p><strong>Què conté:</strong> Fons negre absolut. L'alçada, els marges i els "gaps" estan calculats òpticament.</p>
        
        <h4>Format Desktop / Tablet</h4>
        <header className="notranslate h-[64px] min-h-[64px] w-full flex items-center justify-between pr-6 z-50 bg-[#000000] border-b border-white/10 shrink-0 shadow-lg relative my-6 rounded-lg overflow-hidden">
          <div className="flex items-center justify-start pl-[30px] shrink-0 z-10 gap-3">
            <img src="/assets/system/ui/logo-socdepoble-rect-blanc.svg" alt="Sóc de Poble" className="h-[45px] w-auto object-contain filter drop-shadow-md shrink min-w-0" />
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
        <header className="notranslate h-[56px] min-h-[56px] w-full max-w-[460px] flex items-center justify-between pr-2 z-50 bg-[#000000] border-b border-white/10 shrink-0 shadow-lg relative my-6 rounded-lg overflow-hidden">
          <div className="flex items-center justify-start pl-[20px] shrink-0 z-10 gap-3">
            <img src="/assets/system/ui/logo-socdepoble-rect-blanc.svg" alt="Sóc de Poble" className="h-[32px] w-auto object-contain filter drop-shadow-md shrink min-w-0" />
          </div>
          <div className="flex items-center gap-[4px] ml-auto h-full z-10 relative shrink-0 pr-[2px]">
            <div className="shrink-0 z-50"><LanguageSelector variant="header" /></div>
            <div className="shrink-0 w-10 h-10 flex items-center justify-center transition-all scale-95 text-white/70"><IAIAIcon size={36} color="currentColor" className="shrink-0 w-[36px] h-[36px] opacity-60" /></div>
            <div className="shrink-0 w-10 h-10 flex items-center justify-center text-white/70 hover:text-white"><Search className="shrink-0 w-[36px] h-[36px]" /></div>
            <div className="shrink-0 w-10 h-10 flex items-center justify-center text-white/70 hover:text-white"><Moon className="shrink-0 w-[36px] h-[36px]" /></div>
            <div className="shrink-0 w-10 h-10 flex items-center justify-center text-white/70"><UserPlus className="shrink-0 w-[36px] h-[36px]" /></div>
          </div>
        </header>
        
        <p><strong>ESTAT: TANCAT I ACORDAT (Source of Truth)</strong>. Aquesta arquitectura de capçalera ha arribat al seu zenit i no patirà cap mutació visual.</p>

        <h3>2. La Capçalera de Secció (SystemNavBar)</h3>
        <p><strong>Què és i per a què serveix:</strong> És el menú superior dins d'una ruta. La via d'escapatòria o d'acció ràpida de l'usuari.</p>
        <p><strong>Què conté:</strong> Botons d'acció global com Connectar, Traductor, Xat, Compartir i el botó per llegir l'OS.</p>
        
        <header className="w-full bg-[#4F46E5] text-white flex flex-col shrink-0 z-20 shadow-md my-6 rounded-lg overflow-hidden">
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
                    <button className="flex items-center justify-center gap-2 min-h-[44px] px-3 sm:px-4 rounded-full bg-white text-[#4F46E5] font-black uppercase text-sm shadow-md ml-1">
                        <Plus size={20} strokeWidth={3} className="hidden sm:block" />
                        CONNECTAR
                    </button>
                </div>
            </div>
        </header>

        <h3>3. El Menú Lateral (DesktopSidebar)</h3>
        <p><strong>Què és i per a què serveix:</strong> La navegació principal del lloc web, només visible sencera en pantalles grans.</p>
        <p><strong>Què conté:</strong> L'escut principal, el botó blau, i la llista de rutes.</p>

        <h3>4. La Zona de Contingut (MainScrollArea)</h3>
        <p><strong>Què és i per a què serveix:</strong> El full en blanc. És l'única part de la pantalla que fa "scroll" vertical independentment de la resta.</p>
        <p><strong>Què conté:</strong> Tota la resta d'informació.</p>

        <h3>5. Capçalera de Secció (SectionTitleHeader)</h3>
        <p><strong>Què és i per a què serveix:</strong> L'encapçalament que anuncia on estem dins del contingut.</p>
        <p><strong>Què conté:</strong> Títol gran, i un subtítol opcional.</p>

        <h3>6. Contingut Multimèdia (HeroMedia)</h3>
        <p><strong>Què és i per a què serveix:</strong> L'impacte visual de la pàgina. La portada.</p>
        <p><strong>Què conté:</strong> Una imatge (o carrusel/vídeo) en format horitzontal.</p>

        <h3>7. Caputxa d'Identitat (UniversalCardHeader)</h3>
        <p><strong>Què és i per a què serveix:</strong> El segell d'autoria. Diu a l'usuari qui ha escrit allò que està llegint.</p>
        <p><strong>Què conté:</strong> Avatar en cercle verd (Sóc de Poble), el nom de l'autor, ubicació, i metadades temporals.</p>
        
        <div className="my-6">
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

        <h3>8. Decoració del Títol (DecoratedTitle)</h3>
        <p><strong>Què és i per a què serveix:</strong> El quadre de presentació del document. Dona una sensació de "Llibre" oficial.</p>
        <p><strong>Què conté:</strong> Fons blanc amb vores arrodonides, el logo negre i el títol.</p>

        <h3>9. Normativa Tipogràfica i Espaiat (Typography)</h3>
        <p><strong>Què és i per a què serveix:</strong> El manual definitiu de tipografia per a tota l'App de Sóc de Poble. Resolucions al mil·límetre per a garantir la perfecció visual.</p>
        <p><strong>Què conté:</strong> Tota la col·lecció des d'H1 fins a H6, colors oficials i escales augmentades per mantindre l'efecte de títol.</p>

        <h4>Jerarquia Tipogràfica i Colors Oficials</h4>
        
        <h1>H1: Títol de Pàgina</h1>
        <p>Només un per pàgina. Normalment generat per l'UniversalPage.</p>
        <p><strong>REGLA D'ARQUITECTURA:</strong> Sempre que després d'un H1 ve un H2, el nostre sistema de treball és col·locar l'H2 <strong>directament</strong>. Entre H1 i H2 en principi pot haver-hi el que siga, però <strong>per defecte és H2 directament</strong> sense elements intermedis.</p>
        <ul>
          <li><strong>Color:</strong> var(--theme-accent-secondary) / Blau Fuerte (#0984E3).</li>
          <li><strong>Mida:</strong> 32px a 44px (Augmentat).</li>
          <li><strong>Pes:</strong> Black (900).</li>
        </ul>

        <h2>H2: Subtítol Principal</h2>
        <p className="lead">
          Això és un exemple d'entradilla lleugera. Una <strong>presentació opcional</strong> dissenyada específicament per a introduir el context sota els grans titulars amb la màxima elegància SEO. L'entradilla associada sempre ha d'anar emmarcada per un H2; si no el té, l'arquitectura està fallant.
        </p>
        <p>Seccions mestres de la pàgina. Ara centrat per defecte.</p>
        <ul>
          <li><strong>Color:</strong> var(--theme-accent-primary) / Taronja Fuerte (#f97316).</li>
          <li><strong>Mida:</strong> 24px a 30px.</li>
          <li><strong>Entradilla associada (p.lead):</strong> Text introductori <strong>TOTALMENT OPCIONAL</strong> (<code>&lt;p className="lead"&gt;</code>) sota l'H2. Pots posar un paràgraf normal just davall si vols. Quan s'activa l'entradilla, utilitza un pes tipogràfic Normal (400) que fa de contrapès elegant al Black (900) del títol.</li>
        </ul>

        <h3>H3: Component o Subsecció</h3>
        <p>Blocs interns o components dins d'un H2.</p>
        <ul>
          <li><strong>Color:</strong> var(--theme-accent-secondary) / Blau (#0984E3).</li>
          <li><strong>Mida:</strong> 18px a 24px (Augmentat).</li>
          <li><strong>Pes:</strong> Bold (700).</li>
        </ul>

        <h4>H4: Etiqueta Destacada</h4>
        <p>Titulars de llistes, formularis o blocs secundaris.</p>
        <ul>
          <li><strong>Color:</strong> var(--theme-accent-primary) / Taronja Fuerte (#f97316).</li>
          <li><strong>Mida:</strong> 18px a 22px (Augmentat per compensar pes visual).</li>
          <li><strong>Pes:</strong> Extra-Bold (800).</li>
        </ul>

        <h5>H5: Títol de Targeta Xicoteta</h5>
        <p>Text de suport on l'espai és reduït.</p>
        <ul>
          <li><strong>Color:</strong> var(--theme-accent-secondary) / Blau (#0984E3).</li>
          <li><strong>Mida:</strong> 16px a 20px (Augmentat en proporció a H4).</li>
          <li><strong>Pes:</strong> Bold (700).</li>
        </ul>

        <h6>H6: Micro-etiqueta (Kicker)</h6>
        <p>Dates, tags, o petites instruccions.</p>
        <ul>
          <li><strong>Color:</strong> var(--text-main) / Negre per Light Mode i invers per Dark Mode.</li>
          <li><strong>Mida:</strong> 12px a 16px.</li>
          <li><strong>Pes:</strong> Black (900).</li>
        </ul>

        <p><strong>P (Cos de Text):</strong> Exemple per veure com respira la tipografia. Utilitzem un interlineat obert (1.625) pensat per a lectures llargues, com llibres o documents. El color hereta sempre del contenidor per adaptar-se perfectament al Light/Dark mode.</p>
        <p>Articles, contingut principal.</p>
        <ul>
          <li><strong>Color:</strong> Text Main (#f3f4f6 o #1f2937).</li>
          <li><strong>Mida:</strong> 16.8px a 18.4px.</li>
          <li><strong>Pes:</strong> Regular (400).</li>
        </ul>

        <h4>Lleis d'Espaiat i Contenidors</h4>
        <ol>
          <li><strong>Cap duplicació de Paddings:</strong> Si <code>AppLayout</code> o <code>UniversalPage</code> ja proporcionen <code>px-6</code>, cap element fill hauria de tindre <code>px-4</code> a menys que siga explícitament una targeta interior (<code>card</code>).</li>
          <li><strong>Ritme Vertical (Vertical Rhythm):</strong> L'espai entre grans seccions (H2) es gestiona de forma centralitzada mitjançant pare flex amb <code>gap-12</code> (48px) o <code>gap-16</code> (64px). Dins de les seccions s'usa <code>gap-4</code>.</li>
          <li><strong>Relació Títol-Text:</strong> Mai separar un H3 del seu paràgraf amb més de 16px (<code>mb-4</code> o <code>gap-4</code>). Ha de semblar que el títol "cau" sobre el text.</li>
        </ol>

      </div>
    </UniversalPage>
  );
}

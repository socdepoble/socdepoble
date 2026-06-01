import React from 'react';
import UniversalPage from '../public/UniversalPage';
import { ArrowLeft, Book, MessageCircle, Share2, Plus, Search, Moon, UserPlus, Info, X } from 'lucide-react';
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
    description: 'Poble de muntanya amagat entre bancals de secà i pinedes de l\'Alacantí.'
  };

  return (
    <UniversalPage 
      standAlone={false} 
      forcedTitle="Cànon Sóc de Poble"
      forcedHtml=" "
      forcedHeroImage="/assets/uploads/brain/ibanez_design_system_1780246898431.png"
    >
      <div className="w-full max-w-4xl mx-auto app-cms-content pb-20">
        
        <h2>El Cànon (Design System)</h2>
        <p className="lead">
          Catàleg immutable de les peces estructurals que formen qualsevol interfície de Sóc de Poble. Aquest document és el <strong>Source of Truth</strong>. Cada secció s'explica de forma didàctica i funciona a nivell atòmic.
        </p>

        <h3>1. Branding i Paleta de Colors</h3>
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
        </div>

        <h3>2. Tipografia, Textos i "Dark Mode"</h3>
        <p><strong>Què és i per a què serveix:</strong> El manual definitiu de tipografia per a tota l'App. Resolucions al mil·límetre per a garantir la perfecció visual i contrast adequat (Light vs Dark).</p>
        <p>En el mode fosc (<code>Dark Mode</code>), l'aplicació usa fons <code>#111827</code> (Gris molt fosc, gairebé negre) i el text general s'inverteix a <code>#F3F4F6</code> per garantir la llegibilitat. En el mode clar, el fons és <code>#F3F4F6</code> i el text <code>#1F2937</code>.</p>
        
        <div className="p-6 border border-white/10 rounded-3xl bg-theme-panel my-6 shadow-sm">
          <h1>H1: Títol de Pàgina (Blau)</h1>
          <p><strong>Color H1:</strong> var(--theme-accent-secondary) / Blau Fuerte (#0984E3).</p>
          <hr className="my-4 border-white/10" />

          <h2>H2: Subtítol Principal (Taronja)</h2>
          <p className="lead">
            Això és un exemple d'entradilla lleugera (lead). Una <strong>presentació opcional</strong> dissenyada específicament per a introduir el context sota els grans titulars amb la màxima elegància SEO i un text més prim per contrastar.
          </p>
          <p><strong>Color H2:</strong> var(--theme-accent-primary) / Taronja Fuerte (#F97316).</p>
          <hr className="my-4 border-white/10" />

          <h3>H3: Component o Subsecció (Blau)</h3>
          <p><strong>Color H3:</strong> var(--theme-accent-secondary) / Blau (#0984E3).</p>
        </div>

        <h3>3. Botons (Components Interactius)</h3>
        <p><strong>Què és i per a què serveix:</strong> L'element atòmic d'interacció. Tenim botons primaris (crida a l'acció forta), secundaris (opcions alternatives), i perillosos (esborrar).</p>
        
        <div className="flex flex-wrap gap-4 p-6 bg-theme-panel rounded-3xl border border-white/10 shadow-sm my-6 items-center">
          <Button intent="primary">Botó Primari</Button>
          <Button intent="secondary">Botó Secundari</Button>
          <Button intent="danger">Acció de Perill</Button>
          <Button intent="ghost">Botó Fantasma</Button>
          <Button intent="canonic">Botó Canònic</Button>
          <Button intent="primary" isLoading={true}>Carregant...</Button>
        </div>

        <h3>4. Banners i Avisos (Alerts)</h3>
        <p><strong>Què és i per a què serveix:</strong> Banners horitzontals que avisen a l'usuari d'alguna cosa important o contextual. S'adhereixen dalt dels continguts, o es mostren intercalats.</p>
        
        <div className="my-6 flex flex-col gap-4">
          <div className="w-full bg-[#FF6D23]/10 dark:bg-[#FF6D23]/15 border border-[#FF6D23]/20 px-3 py-2 flex items-center justify-between gap-3 shadow-inner z-40 rounded-xl">
            <div className="flex items-center gap-2 flex-1 min-w-0">
               <Info size={18} className="text-[#FF6D23] flex-shrink-0" />
               <p className="text-[11px] sm:text-xs text-gray-800 dark:text-gray-200 leading-tight md:whitespace-normal mb-0">
                 <span className="font-black mr-1 hidden sm:inline">Patrimoni Obert Connectat:</span> 
                 Aquest és el banner d'avís informatiu (Ex. Wikipedia). Usa el taronja corporatiu amb opacitat baixa de fons.
               </p>
            </div>
            <button className="flex-shrink-0 text-gray-500 hover:text-[#FF6D23] transition-colors bg-white/50 dark:bg-black/20 rounded-lg p-1 border border-black/5 dark:border-white/5">
              <X size={20} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        <h3>5. Cites i Destacats (Blockquotes)</h3>
        <p><strong>Què és i per a què serveix:</strong> Per destacar fragments de text importants, resums o citacions de personatges dins del cos del text.</p>
        
        <blockquote className="my-6 border-l-4 border-[var(--theme-accent-primary)] pl-4 italic opacity-90 text-lg">
          "El 'Trellat' és la nostra arma secreta. Construïm programari pensant en les iaies i en el lent 3G de la serra."
          <footer className="mt-2 text-sm font-bold opacity-70 not-italic">— Javi Llinares, Creador de Sóc de Poble</footer>
        </blockquote>

        <h3>6. Caputxa d'Identitat (UniversalCardHeader)</h3>
        <p><strong>Què és i per a què serveix:</strong> El segell d'autoria de Sóc de Poble. Diu a l'usuari qui ha escrit allò que està llegint (Poble, Nom, Data).</p>
        
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

        <h3>7. Targeta Universal (UniversalCard)</h3>
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

      </div>
    </UniversalPage>
  );
}

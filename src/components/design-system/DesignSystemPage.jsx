import React, { Suspense } from 'react';
import UniversalPage from '../../pages/public/UniversalPage';
import '../../pages/features/sosp-components.css';

// Lazy loading de les seccions (resolució d'exports nominals)
const ColorPalette = React.lazy(() => import('./sections/ColorPalette').then(m => ({ default: m.ColorPalette })));
const Typography = React.lazy(() => import('./sections/Typography').then(m => ({ default: m.Typography })));
const SpacingAndGrid = React.lazy(() => import('./sections/SpacingAndGrid').then(m => ({ default: m.SpacingAndGrid })));
const Buttons = React.lazy(() => import('./sections/Buttons').then(m => ({ default: m.Buttons })));
const FormsAndInputs = React.lazy(() => import('./sections/FormsAndInputs').then(m => ({ default: m.FormsAndInputs })));
const Cards = React.lazy(() => import('./sections/Cards').then(m => ({ default: m.Cards })));
const Alerts = React.lazy(() => import('./sections/Alerts').then(m => ({ default: m.Alerts })));

export default function DesignSystemPage() {
  return (
    <UniversalPage
      standAlone={false}
      forcedTitle="Sistema de Disseny Sóc de Poble"
      forcedSubtitle="Arquitectura Pedra Seca per a interfícies que han de funcionar a ple sol en un iPad A10 amb gent major que mira de prop."
      forcedHeroImage="/assets/uploads/brain/ibanez_pedra_seca_design_1780873465211.png"
    >
      {/* Eliminat content-visibility i contain-intrinsic-size per donar suport correcte a Safari/iPad A10 */}
      <main className="universal-content w-full sosp-design-system max-w-5xl mx-auto p-6 pb-24 grid grid-cols-1 gap-y-12">
        
        <section role="status" aria-live="polite" className="sosp-alert sosp-alert-info mb-8 flex items-start gap-3">
          <span aria-hidden="true" className="sosp-alert-icon mt-0.5">ℹ️</span>
          <section className="flex flex-col gap-1">
            <strong className="leading-none">Construcció en curs</strong>
            <p className="text-sm m-0 text-stone-700">Hem començat a aplanar l'arbre DOM.</p>
          </section>
        </section>

        <figure className="mb-12 flex gap-4 text-sm text-stone-500 border-b-2 border-stone-300 pb-6 justify-center">
          <dl className="flex gap-4 m-0">
            <div><dt className="sr-only">Filosofia</dt><dd>🎯 Trellat</dd></div>
            <div><dt className="sr-only">Base</dt><dd>📐 1rem = 16px</dd></div>
            <div><dt className="sr-only">Accessibilitat</dt><dd>♿ WCAG 2.1 AA</dd></div>
            <div><dt className="sr-only">Compatibilitat</dt><dd>📱 iOS Safari 14+</dd></div>
          </dl>
        </figure>

        <Suspense fallback={<div className="sosp-skeleton w-full h-64 rounded-xl" />}>
          <ColorPalette />
          <Typography />
          <SpacingAndGrid />
          <Buttons />
          <FormsAndInputs />
          <Cards />
          <Alerts />
        </Suspense>
        
        <div className="text-center p-12 bg-stone-100 rounded-xl border border-dashed border-stone-300 mt-16">
            <h3 className="text-xl font-bold text-stone-600">Treball en Progrés 🚜</h3>
            <p className="text-stone-500">Les següents seccions estan sent migrades cap al patró Slot per reduir el DOM_DEPTH.</p>
        </div>

      </main>
    </UniversalPage>
  );
}

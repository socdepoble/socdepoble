import SectionChrome from '../../components/SectionChrome';
import '../../pages/features/sosp-components.css';
import { useAppData } from '../../app/AppDataContext';

import { ColorPalette } from '../../components/design-system/sections/ColorPalette';
import { Typography } from '../../components/design-system/sections/Typography';
import { SpacingAndGrid } from '../../components/design-system/sections/SpacingAndGrid';
import { Buttons } from '../../components/design-system/sections/Buttons';
import { FormsAndInputs } from '../../components/design-system/sections/FormsAndInputs';
import { Cards } from '../../components/design-system/sections/Cards';
import { Alerts } from '../../components/design-system/sections/Alerts';
import { LegacySections } from '../../components/design-system/sections/LegacySections';

export default function DesignSection() {
  const { t } = useAppData();
  return (
    <SectionChrome
      kicker={t('section.disseny.kicker', 'Disseny')}
      title={t('section.disseny.title', 'Sistema de Disseny Sóc de Poble')}
      subtitle={t('section.disseny.subtitle', 'Arquitectura Pedra Seca per a interfícies clares i resistents.')}
    >
      <main className="universal-content w-full sosp-design-system max-w-5xl mx-auto p-6 pb-24 grid grid-cols-1 gap-y-12">
        <ColorPalette />
        <Typography />
        <SpacingAndGrid />
        <Buttons />
        <FormsAndInputs />
        <Cards />
        <Alerts />
        <LegacySections />

        <div className="text-center p-12 bg-stone-100 rounded-xl border border-dashed border-stone-300 mt-16">
          <h3 className="text-xl font-bold text-stone-600">{t('section.disseny.workInProgress', 'Treball en Progrés')}</h3>
          <p className="text-stone-500">{t('section.disseny.note', 'Les següents seccions estan sent migrades cap al patró Slot per reduir el DOM_DEPTH.')}</p>
        </div>
      </main>
    </SectionChrome>
  );
}

import React from 'react';
import UniversalPageLayout from '../components/layout/UniversalPageLayout';

export default function ProjectePage() {
  return (
    <UniversalPageLayout
      title="EL PROJECTE"
      subtitle="Per què existim?"
      coverImage="/assets/media/backgrounds/landscape_placeholder.jpg"
    >
      <p className="text-[19px] leading-relaxed text-gray-800 font-medium">
        Sóc de Poble és una manera de construir tecnologia arrelada al territori. No naixem per seguir modes ni tendències. Naixem perquè la tecnologia rural necessita ser clara, resistent i comprensible per a tothom.
      </p>
    </UniversalPageLayout>
  );
}

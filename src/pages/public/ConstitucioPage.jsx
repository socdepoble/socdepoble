import React from 'react';
import UniversalPageLayout from '../../components/layout/UniversalPageLayout';
import { CONSTITUCIO_HTML } from '../../data/ConstitucioContent';
import { sanitizeHtml } from '../../utils/sanitizeHtml';

export default function ConstitucioPage() {
  return (
    <UniversalPageLayout 
      id="constitucio"
      title="Les Lleis de Pedra Seca" 
      subtitle="El Trellat Codi" 
      coverImage={'/assets/uploads/brain/nano_mixa_socis_1774215027069.png'}
      type="page"
    >
      <div 
        className="universal-content markdown-body w-full" 
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(CONSTITUCIO_HTML) }} 
      />
    </UniversalPageLayout>
  );
}

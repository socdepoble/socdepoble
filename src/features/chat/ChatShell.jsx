import React from 'react';
import UniversalCard from '../../components/ui/universal-card/UniversalCard';

/**
 * 🏺 ChatShell [ARQUITECTURA AÏLLADA]
 * Aquest component actua com a "sandbox" (entorn aïllat) per a la futura funcionalitat del xat.
 * Tot el codi, estils, crides a base de dades i estats del xat quedaran encapsulats ací dins,
 * garantint que cap error o canvi afecte el "core" de La Masia.
 * Quan siga el moment de programar el xat, només modificarem aquesta carpeta (src/features/chat).
 */
export default function ChatShell() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 acte-reflex">
        <UniversalCard>
          <div className="text-center">
            <h2 className='mb-2 text-sdp-theme-accent-primary'>Xat (En Construcció)</h2>
            <p className="text-sm opacity-80">
              L'arquitectura d'aquesta funcionalitat està completament aïllada del nucli.
              Cap canvi ací trencarà La Masia.
            </p>
          </div>
        </UniversalCard>
      </div>
  );
}
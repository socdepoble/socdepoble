import React, { useMemo } from 'react';
import UniversalPage from './UniversalPage';
import { UniversalGridWrapper, UniversalGridRow } from '../components/ui/UniversalGrid';
import UniversalCard from "../components/ui/universal-card";

// En aquesta pàgina va per ordre qui publica i l'ordre és per pobles. Y punto.
const publications = [
  { id: 'p1', author: 'Vicent', town: 'Agres', content: 'Oferisc ametles de la serra d\'Agres.' },
  { id: 'p2', author: 'Maria', town: 'Banyeres de Mariola', content: 'Llibre sobre la història de la nostra filà.' },
  { id: 'p3', author: 'Joan', town: 'Cocentaina', content: 'Tinc eines per al camp per intercanviar.' },
  { id: 'p4', author: 'Lluïsa', town: 'Cocentaina', content: 'Marmelada casolana de nispro.' },
  { id: 'p5', author: 'Pep', town: 'Muro d\'Alcoi', content: 'Busquem gent per a la recollida de l\'oliva.' }
];

export default function Pobles() {

  const orderedPublications = useMemo(() => {
    return [...publications].sort((a, b) => a.town.localeCompare(b.town));
  }, []);

  return (
    <UniversalPage
      title="Pobles i Veïns"
      subtitle="Publicacions ordenades per poble"
      icon="🏘️"
      backUrl="/"
    >
      <UniversalGridWrapper>
        {orderedPublications.map(pub => (
          <UniversalGridRow key={pub.id} pb={6}>
            <div className="mb-2 px-2 text-sm font-black uppercase tracking-widest text-orange-600">
              {pub.town}
            </div>
            <UniversalCard 
              id={pub.id}
              title={pub.author} 
              body={pub.content} 
            />
          </UniversalGridRow>
        ))}
      </UniversalGridWrapper>
    </UniversalPage>
  );
}
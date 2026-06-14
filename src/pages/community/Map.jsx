import React from 'react';
import UniversalPage from '../public/UniversalPage';
import { UniversalGridWrapper, UniversalGridRow } from '../../components/ui/UniversalGrid';
import UniversalCard from "../../components/ui/universal-card";

export default function Map() {
  const mapData = [
    { id: 'pin1', title: 'Plaça de l\'Ajuntament', type: 'Localització' }
  ];

  return (
    <UniversalPage
      title="Mapa"
      subtitle="Geolocalització"
      icon="📍"
      backUrl="/"
    >
      <UniversalGridWrapper>
        {mapData.map(pin => (
          <UniversalGridRow key={pin.id} pb={6}>
            <UniversalCard item={pin} />
          </UniversalGridRow>
        ))}
      </UniversalGridWrapper>
    </UniversalPage>
  );
}
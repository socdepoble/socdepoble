import React from 'react';
import UniversalPage from '../public/UniversalPage';
import { UniversalGridWrapper, UniversalGridRow } from '../../components/ui/UniversalGrid';
import UniversalCard from "../../components/ui/universal-card";

export default function MediaManager() {
  const media = [
    { id: 1, title: 'Foto de Festes', type: 'Multimèdia' }
  ];

  return (
    <UniversalPage
      title="Multimèdia"
      subtitle="Arxiu gràfic del Mas"
      icon="🖼️"
      backUrl="/"
    >
      <UniversalGridWrapper>
        {media.map(item => (
          <UniversalGridRow key={item.id} pb={6}>
            <UniversalCard item={item} />
          </UniversalGridRow>
        ))}
      </UniversalGridWrapper>
    </UniversalPage>
  );
}
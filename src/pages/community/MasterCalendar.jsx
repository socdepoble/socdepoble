import React from 'react';
import UniversalPage from '../public/UniversalPage';
import { UniversalGridWrapper, UniversalGridRow } from '../../components/ui/UniversalGrid';
import UniversalCard from "../../components/ui/universal-card";

export default function MasterCalendar() {
  const events = [
    { id: 1, title: 'Fira de Tots Sants', type: 'Event', date: '2026-11-01' }
  ];

  return (
    <UniversalPage
      title="Esdeveniments"
      subtitle="Filtre per data"
      icon="📅"
      backUrl="/"
    >
      <UniversalGridWrapper>
        {events.map(event => (
          <UniversalGridRow key={event.id} pb={6}>
            <UniversalCard item={event} />
          </UniversalGridRow>
        ))}
      </UniversalGridWrapper>
    </UniversalPage>
  );
}
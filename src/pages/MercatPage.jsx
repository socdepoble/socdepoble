import React from 'react';
import UniversalPage from './public/UniversalPage';
import { UniversalGridWrapper, UniversalGridRow } from '../components/ui/UniversalGrid';
import UniversalCard from '../components/ui/universal-card';

export default function MercatPage() {
  const posts = [
    { id: 1, authorName: 'Vicent', content: 'Venc caixa de llimones de la meua horta. 10€.', type: 'Mercat', price: '10€' },
    { id: 2, authorName: 'Carme', content: 'Canvie llibres de cuina per una paella.', type: 'Mercat', price: 'Intercanvi' }
  ];

  return (
    <UniversalPage
      title="El Mercat"
      subtitle="Publicacions amb preu o intercanvi"
      icon="🏪"
      backUrl="/"
    >
      <UniversalGridWrapper>
        {posts.map(post => (
          <UniversalGridRow key={post.id} pb={6}>
            <UniversalCard item={post} />
          </UniversalGridRow>
        ))}
      </UniversalGridWrapper>
    </UniversalPage>
  );
}

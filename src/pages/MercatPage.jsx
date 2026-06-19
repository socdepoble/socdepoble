import React from 'react';
import TargetaPoble from '../components/ui/TargetaPoble';
import UniversalPageLayout from '../components/layout/UniversalPageLayout';

export default function MercatPage() {
  const productes = [
    { 
      id: 1, 
      title: 'Samarreta Sóc de Poble', 
      author: 'Sóc de Poble', 
      date: 'Fa 2 hores',
      content: 'L\'edició definitiva amb el Logotip Complet (Mapa del Tresor). Cotó Roly de màxima qualitat.' 
    }
  ];

  return (
    <UniversalPageLayout
      title="EL MERCAT"
      subtitle="Publicacions amb preu o intercanvi"
      coverImage="/assets/media/backgrounds/landscape_placeholder.jpg"
    >
      <div className="flex flex-col gap-4">
        {productes.length === 0 && <p className="text-center opacity-50 p-4">El mercat està buit hui.</p>}
        
        {productes.map(post => (
          <TargetaPoble 
            key={post.id}
            id={post.id}
            author={post.author}
            title={post.title}
            content={post.content}
            date={post.date}
            category="mercat"
          />
        ))}
      </div>
    </UniversalPageLayout>
  );
}

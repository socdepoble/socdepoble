import React from 'react';
import TargetaPoble from '../components/ui/TargetaPoble';

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
    <section aria-label="Mercat local">
      <header className="mb-6">
        <h2 className="m-0 font-bold text-2xl" style={{ color: 'var(--sp-orange)' }}>🏪 El Mercat</h2>
        <p className="opacity-70 mt-2">Publicacions amb preu o intercanvi</p>
      </header>

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
    </section>
  );
}

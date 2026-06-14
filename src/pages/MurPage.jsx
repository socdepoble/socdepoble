import React from 'react';
import { useSOSPStore } from '../hooks/useSOSPStore';
import UniversalCard from '../components/ui/UniversalCard';

export default function MurPage() {
  const posts = useSOSPStore(
    state => state.mur || []
  );

  return (
    <section
      aria-label="Mur del poble"
      className="sp-grid"
      style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}
    >
      {posts.length === 0 && <p className="text-center opacity-50 p-4">El mur està buit. Esperant històries...</p>}
      {posts.map(post => (
        <UniversalCard
          key={post.id}
          id={post.id}
          title={post.title}
          subtitle={post.author}
          body={post.excerpt}
          media={post.image}
          category={post.category}
          actions={post.actions}
        />
      ))}
    </section>
  );
}

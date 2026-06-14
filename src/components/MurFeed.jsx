// src/components/MurFeed.jsx
import React from 'react';
// import { useCollection } from 'react-firebase-hooks/firestore';
// import { collection, query, orderBy, limit } from 'firebase/firestore';
// import { db } from '../firebase';
import UniversalCard from './UniversalCard';
// Mcked

const MurFeed = () => {
  // Mock data for now
  const posts = {
    docs: [{
      id: '1',
      data: () => ({
        authorName: 'Tia Pepa',
        content: 'Bon dia a tots! Ja tinc la coca de llanda al forn.',
        likes: 12,
        townId: 'Bocairent'
      })
    }, {
      id: '2',
      data: () => ({
        authorName: 'Oncle Paco',
        content: 'Això de les xarxes socials és una pèrdua de temps, abans anàvem al bar.',
        likes: 4,
        townId: 'Altea'
      })
    }],
    empty: false
  };
  const loading = false;

  // Mocking characters trigger
  const trigger = (char, anim) => {};
  if (loading) {
    return <div className="text-center py-12 font-medium text-slate-500">La IAIA està preparant la coca mentre carrega el Mur...</div>;
  }
  return <div className="max-w-2xl mx-auto py-8">
      {/* Hero amb IAIA */}
      <div className="mb-10 text-center">
        <div className="inline-block bg-white p-6 rounded-3xl border-2 border-orange-400 shadow-sm">
          <p className="text-xl font-medium text-slate-800">Què es cou hui al Mas?</p>
        </div>
      </div>

      <div className="space-y-6">
        {posts?.docs.map(doc => {
        const post = doc.data();
        return <UniversalCard key={doc.id} item={post} variant="feed" onLike={() => trigger('tiaEspantaVirus', 'victory')} onComment={() => trigger('nanoBanana', 'enthusiasm')} />;
      })}

        {/* Estat buit amb Horror Vacui */}
        {posts?.empty && <div className="text-center py-20 border-2 border-dashed border-orange-300 rounded-3xl bg-orange-50/50">
            <div className="text-6xl mb-6">🌾</div>
            <p className="text-2xl font-black mb-3 text-slate-800">Encara no hi ha res al Mur...</p>
            <p className="text-slate-500">La IAIA diu que és bon moment per a publicar alguna cosa del teu poble.</p>
            {/* Micro-gag */}
            <div className="mt-8 text-sm text-slate-400 italic">Reme està intentant connectar el router mentrestant...</div>
          </div>}
      </div>
    </div>;
};
export default MurFeed;
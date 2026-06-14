// src/components/Mercat.jsx
import React from 'react';
// import { useCollection } from 'react-firebase-hooks/firestore';
// import { collection } from 'firebase/firestore';
// import { db } from '../firebase';
import UniversalCard from './UniversalCard';
const Mercat = () => {
  // Mock data for now
  const items = {
    docs: [{
      id: '1',
      data: () => ({
        authorName: 'Vicent',
        title: 'Tractor antic (funciona)',
        description: 'Canvie tractor per 30 gallines i un porc.',
        price: null,
        townId: 'Sueca'
      })
    }, {
      id: '2',
      data: () => ({
        authorName: 'Maria',
        title: 'Caixa de tomaques',
        description: 'Tomaques de la meua horta, 100% ecològiques.',
        price: 15,
        townId: 'Almassora'
      })
    }],
    empty: false
  };
  const trigger = (char, anim) => {};
  return <div className="max-w-4xl mx-auto py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <h1 className="text-4xl font-black text-slate-800">El Mercat del Mas</h1>
        <button onClick={() => trigger('ciberReme', 'excited')} className="bg-orange-500 hover:bg-orange-600 transition-colors text-white px-8 py-4 rounded-2xl font-black shadow-md">
          + Posar Trastos
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {items?.docs.map(doc => {
        const item = doc.data();
        return <UniversalCard key={doc.id} item={item} variant="market" onContact={() => trigger('tiaEspantaVirus', 'alert')} />;
      })}
      </div>

      {/* Estat buit */}
      {items?.empty && <div className="text-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm mt-8">
          <div className="mx-auto w-32 h-32 bg-orange-100 rounded-full flex items-center justify-center text-6xl mb-8">
            🛠️
          </div>
          <p className="text-3xl font-black mb-4 text-slate-800">El Mercat està buit com un corral al matí</p>
          <p className="text-slate-500 max-w-md mx-auto">
            Oncle Paco diu que "abans es canviava de paraula". 
            Potser és hora de posar alguna cosa?
          </p>
        </div>}
    </div>;
};
export default Mercat;
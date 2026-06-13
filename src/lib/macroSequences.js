// src/lib/macroSequences.js
// Macros: encadenen seqüències entre sprites. Cada macro és array de blocs:
// { spriteKey, selectorRootQuery, sequenceName, offset }
// selectorRootQuery: selector per trobar el wrapper DOM del sprite (p.ex. '#sausage-wrapper')

const macros = {
  // Escena Caos al Cup de Dades
  cupChaos: [
    // Toni (sausage) fa overload
    { spriteKey: 'sausage', rootQuery: '#sausage-wrapper', sequenceName: 'overload', offset: 0 },
    // Píxel reacciona una mica després
    { spriteKey: 'pixel', rootQuery: '#pixel-wrapper', sequenceName: 'mischief', offset: 300 },
    // Ratolí solda i fa sparks
    { spriteKey: 'rat', rootQuery: '#rat-wrapper', sequenceName: 'panic', offset: 420 },
    // Worm expulsa bits
    { spriteKey: 'worm', rootQuery: '#worm-wrapper', sequenceName: 'spit', offset: 600 },
    // Ember drift per ambient
    { spriteKey: 'ember', rootQuery: '#ember-wrapper', sequenceName: 'flare', offset: 700 },
    // Sundial tick per rematar
    { spriteKey: 'sundial', rootQuery: '#sundial-wrapper', sequenceName: 'tick', offset: 1200 }
  ],

  // Escena de Celebració (backup OK)
  backupParty: [
    { spriteKey: 'sundial', rootQuery: '#sundial-wrapper', sequenceName: 'tick', offset: 0 },
    { spriteKey: 'pixel', rootQuery: '#pixel-wrapper', sequenceName: 'chew', offset: 120 },
    { spriteKey: 'worm', rootQuery: '#worm-wrapper', sequenceName: 'chew', offset: 200 },
    { spriteKey: 'pigeon', rootQuery: '#pigeon-wrapper', sequenceName: 'fly', offset: 300 },
    { spriteKey: 'sausage', rootQuery: '#sausage-wrapper', sequenceName: 'playful', offset: 400 }
  ]
};

export default macros;

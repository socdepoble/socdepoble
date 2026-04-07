/**
 * src/lib/shared-schema.js
 * 
 * ESQUEMA P2P UNIVERSAL PARA IDENTIDADES (CRDT)
 * Todo perfil es un Y.Map en la capa de persistencia local.
 */

export const EntityTypes = {
  PERSONA: 'persona',
  EMPRESA: 'empresa',
  INSTITUCION: 'institucion'
};

// Objeto base generador de esquemas limpios para inicializar el CRDT
export const createEntitySchema = (type, did) => {
  const baseSchema = {
    // 1. Capa de Identidad (Inmutable / Verificada)
    did: did, // Decentralized Identifier (ej: did:local:12345)
    type: type, // persona, empresa, institucion
    createdAt: Date.now(),
    updatedAt: Date.now(),

    // 2. Capa de Presentación (Básica)
    profile: {
      displayName: "",    // "Panadería L'Espiga"
      handle: "",         // "@lespiga"
      bio: "",
      avatarUrl: "",
      bannerUrl: "",
      location: "",       // Ej: "La Torre de les Maçanes"
    },

    // 3. Capa de Estado y Reputación (Meta)
    state: {
      isVerified: false,
      reputationScore: 0,
      badges: []          // ["pioner", "comerç-local", "associació"]
    },

    // 4. Capa Polimórfica: Rasgos específicos según el tipo
    traits: {} 
  };

  // Mutación según el genotipo seleccionado
  if (type === EntityTypes.EMPRESA) {
    baseSchema.traits = {
      commercialSector: "", // "Alimentació"
      openingHours: {}, 
      contactPhone: "",
      offersDelivery: false
    };
  } else if (type === EntityTypes.PERSONA) {
    baseSchema.traits = {
      skills: [],       // ["Agricultura", "Fusteria"]
      interests: [],
      lookingFor: ""    // "¿Qué busca en la red?"
    };
  } else if (type === EntityTypes.INSTITUCION) {
    baseSchema.traits = {
      officialScope: "", // "Municipal", "Cultural"
      publicServices: []
    };
  }

  // 5. Capa Social (Relaciones como colecciones CRDT)
  baseSchema.connections = []; // DIDs de quienes sigue / aliados
  baseSchema.posts = [];       // Referencias a los posts (cargas pesadas van aparte)

  return baseSchema;
};

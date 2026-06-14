// src/services/messages/TractorMessages.js
export const TractorMessages = {
  // Errors tècnics traduïts a llenguatge rural
  QUOTA_EXCEEDED: {
    title: '🏚️ L\'era està plena',
    message: 'El tractor no pot descarregar més. Fes net o connecta\'t a la cooperativa.',
    action: 'Fer net ara'
  },
  SYNC_FAILED: {
    title: '🚜 El tractor s\'ha calat',
    message: 'No passa res. Totes les dades estan guardades. Torna a arrancar quan tingues cobertura.',
    action: 'Reintentar'
  },
  CRDT_CONFLICT: {
    title: '🐓 Dos gallines al mateix niu',
    message: 'Dos dispositius han modificat el mateix post. La IAIA ho ha resolt amb seny.',
    action: 'Vore resultat'
  },
  STORAGE_EVICTED: {
    title: '📦 Safari ha buidat el graner',
    message: 'Les dades importants estan fora de perill. Si falta alguna cosa, recupera-la amb el teu clauer.',
    action: 'Recuperar del clauer'
  },
  ENCRYPTION_KEY_LOST: {
    title: '🔐 Has perdut el clauer?',
    message: 'Sense la clau no puc obrir les dades xifrades. Usa el QR, les 12 paraules o el fitxer .sdpkey.',
    action: 'Recuperar clauer'
  },
  WORKER_CRASHED: {
    title: '😴 L\'ajudant s\'ha adormit',
    message: 'El treballador de fons ha fet una becadeta. L\'he despertat i tot segueix igual.',
    action: 'Continuar'
  }
};
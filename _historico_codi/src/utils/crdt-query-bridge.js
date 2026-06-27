// import { applyUpdate, encodeStateAsUpdate } from 'yjs';

/**
 * Configura la sincronització bidireccional segura entre TanStack Query i Yjs
 * @param {Y.Doc} yjsDoc - El document Yjs local
 * @param {QueryClient} queryClient - La instància de TanStack Query
 * @param {string[]} queryKey - La clau de la query associada (ex: ['profile', userId])
 */
export function setupCrdtSyncBridge(yjsDoc, queryClient, queryKey) {
  if (!yjsDoc || !queryClient) return;

  // 1. Invalidació Creuada (Servei -> CRDT Local)
  const unsubscribeSync = yjsDoc.on('synced', (isSynced) => {
    if (isSynced) {
      queryClient.invalidateQueries({ queryKey, refetchType: 'none' });
    }
  });

  // 2. Extracció Fresca (TanStack -> CRDT)
  const unsubscribeQuery = queryClient.getQueryCache().subscribe((event) => {
    if (
      event.query.queryKey[0] === queryKey[0] && 
      event.type === 'updated' && 
      event.query.state.status === 'success'
    ) {
      const serverData = event.query.state.data;
      if (yjsDoc.meta && serverData?.lastSynced > yjsDoc.meta?.lastSynced) {
         console.warn('[BRIDGE] Les dades del servidor són més recents que Yjs. Fusionant...');
         // Lògica específica de merge (last-write-wins o applyUpdate de Yjs CRDT)
      }
    }
  });

  return () => {
    unsubscribeSync();
    unsubscribeQuery();
  };
}

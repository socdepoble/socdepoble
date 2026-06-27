import { useEffect, useRef, useCallback } from 'react';
import { get, set } from 'idb-keyval';
import { supabase } from '../supabaseClient';

const QUEUE_KEY = 'sosp-dirty-queue';

export const useBidirectionalSupabaseSync = (postId, document, updateDocument, saveDocument) => {
  const queueRef = useRef([]);
  const channelRef = useRef(null);

  // CARREGAR DIRTY QUEUE
  useEffect(() => {
    const loadQueue = async () => {
      const q = await get(QUEUE_KEY);
      queueRef.current = q || [];
    };
    loadQueue();
  }, []);

  // GUARDAR EN DIRTY QUEUE (offline)
  const enqueueChange = async (change) => {
    queueRef.current.push({ ...change, timestamp: Date.now() });
    await set(QUEUE_KEY, queueRef.current);
  };

  // SYNC CAP A SUPABASE (quan online)
  const syncToSupabase = useCallback(async () => {
    if (!navigator.onLine || queueRef.current.length === 0) return;
    const toSync = [...queueRef.current];
    for (const change of toSync) {
      const { error } = await supabase
        .from('documents')
        .upsert({ id: postId, ...change.payload });
      if (!error) {
        queueRef.current = queueRef.current.filter(c => c.timestamp !== change.timestamp);
      }
    }
    await set(QUEUE_KEY, queueRef.current);
  }, [postId]);

  // REALTIME SUPABASE → LOCAL (bidireccional)
  useEffect(() => {
    if (!postId) return;
    channelRef.current = supabase
      .channel(`document-${postId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'documents', filter: `id=eq.${postId}` }, (payload) => {
        if (payload.new.lastSaved > (document.lastSaved || '')) {
          updateDocument(payload.new); // merge sense conflicte (últim guanya)
          saveDocument(payload.new);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channelRef.current);
    };
  }, [postId, document.lastSaved, updateDocument, saveDocument]);

  // AUTO-SYNC QUAN CANVIA VISIBILITAT O ONLINE
  useEffect(() => {
    const handleOnline = () => syncToSupabase();
    const handleVisibility = () => {
      if (window.document.visibilityState === 'visible') syncToSupabase();
    };
    window.addEventListener('online', handleOnline);
    window.document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [document, syncToSupabase]); // added extra dependency safely

  // EXPOSAR PER A L'EDITOR
  return { enqueueChange, syncToSupabase };
};

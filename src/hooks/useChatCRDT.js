import { useEffect, useState, useRef } from 'react';
import * as Y from 'yjs';
import { IndexeddbPersistence } from 'y-indexeddb';

export function useChatCRDT(roomName = 'soc-de-poble-chat-global') {
  const [messages, setMessages] = useState([]);
  const [isSynced, setIsSynced] = useState(false);
  const docRef = useRef(null);
  const yarrayRef = useRef(null);
  const providerRef = useRef(null);

  useEffect(() => {
    // 1. Inicialitzar el document CRDT (La Matriu Local)
    const doc = new Y.Doc();
    docRef.current = doc;

    // 2. Definir l'Array Compartit per als missatges
    const ymessages = doc.getArray('chat-messages');
    yarrayRef.current = ymessages;

    // 3. Persistència Offline First amb IndexedDB
    const provider = new IndexeddbPersistence(roomName, doc);
    providerRef.current = provider;

    provider.on('synced', () => {
      setIsSynced(true);
      setMessages(ymessages.toArray());
    });

    // 4. Escoltar els canvis en l'Array de Yjs
    const observer = () => {
      setMessages(ymessages.toArray());
    };
    ymessages.observe(observer);

    return () => {
      ymessages.unobserve(observer);
      provider.destroy();
      doc.destroy();
    };
  }, [roomName]);

  const addMessage = (text, author = 'Foraster', role = 'user') => {
    if (!yarrayRef.current) return;
    
    // Inserim el nou missatge al final
    yarrayRef.current.push([{
      id: crypto.randomUUID(),
      text,
      author,
      role, // 'user' o 'ai'
      timestamp: Date.now()
    }]);
  };

  const clearChat = () => {
    if (!yarrayRef.current) return;
    yarrayRef.current.delete(0, yarrayRef.current.length);
  };

  return {
    messages,
    addMessage,
    clearChat,
    isSynced
  };
}

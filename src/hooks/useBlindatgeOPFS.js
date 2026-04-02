import { useEffect, useState } from 'react';

export function useBlindatgeOPFS() {
  const [estatBlindatge, setEstatBlindatge] = useState('comprovant'); // comprovant, blindat, vulnerable

  useEffect(() => {
    async function sol·licitarImortalitat() {
      if (!navigator.storage || !navigator.storage.persist) {
        console.info("⚠️ [OPFS] El navegador no suporta el blindatge de persistència.");
        setEstatBlindatge('vulnerable');
        return;
      }

      try {
        // 1. Comprovem si l'escut ja està activat per l'OS
        let isPersisted = await navigator.storage.persisted();
        
        if (!isPersisted) {
          // 2. Exigim al sistema operatiu immunitat de purga ('Storage Eviction')
          isPersisted = await navigator.storage.persist();
        }
        
        if (isPersisted) {
          console.log("🛡️ [BÚNKER] OPFS i IndexedDB BLINDATS. L'emmagatzematge és 'Persistent'.");
          setEstatBlindatge('blindat');
        } else {
          console.info("❌ [BÚNKER] Blindatge denegat per l'OS. (Requereix instal·lar l'App a Inici).");
          setEstatBlindatge('vulnerable');
        }
      } catch (error) {
        console.error("🔥 [OPFS] Error tècnic forçant la persistència:", error);
        setEstatBlindatge('error');
      }
    }

    sol·licitarImortalitat();
  }, []);

  return estatBlindatge;
}

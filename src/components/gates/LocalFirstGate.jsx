
import { useState, useEffect, useRef, useMemo } from "react";
import { PowerSyncDatabase } from "@powersync/web";
import { PowerSyncContext } from "@powersync/react";
import { AppSchema } from "../../powersync/schema";
import { SupabaseConnector } from "../../powersync/connector";
import { LocalFirstStatusContext } from "../../app/context/LocalFirstStatusContext";
import { WaitingForBackend } from "../boundaries/WaitingForBackend";
import { SyncIndicator } from "../ui/SyncIndicator";
import BrandLogo from "../ui/BrandLogo";

// ─── Tipus d'Estat Honests ──────────────────────────────────────────────────
const STATUS = {
  IDLE: "idle",
  READY: "ready",
  DEGRADED: "degraded",
  ERROR: "error",
};

const OPFS_TIMEOUT_MS = 3500;
const INITIAL_BACKOFF_MS = 1000;
const MAX_BACKOFF_MS = 30000;

export default function LocalFirstGate({ children }) {
  const [status, setStatusState] = useState(STATUS.IDLE);
  const [errorMsg, setErrorMsg] = useState(null);
  const [dbInstance, setDbInstance] = useState(null);

  const statusRef = useRef(STATUS.IDLE);
  const dbRef = useRef(null);
  const connectorRef = useRef(null);
  const isInitializedRef = useRef(false);
  const reconnectTimerRef = useRef(null);
  const reconnectAttemptRef = useRef(0);

  // === FIX PWA (Efecte Túnel) ===
  // Si tornem a estar online (o idle/ready), netejem la memòria de tancament del banner
  useEffect(() => {
    if (status !== STATUS.DEGRADED && sessionStorage.getItem("sp_degraded_dismissed_until_recovery")) {
      sessionStorage.removeItem("sp_degraded_dismissed_until_recovery");
    }
  }, [status]);

  const contextValue = useMemo(() => ({ status }), [status]);

  const setStatus = (newStatus) => {
    statusRef.current = newStatus;
    setStatusState(newStatus);
  };

  useEffect(() => {

    const initDb = async () => {
      if (isInitializedRef.current) return;
      isInitializedRef.current = true;

      // 1. Purga de versió morta (Esquema Migrations)
      // Detectem si l'esquema canvia respecte l'últim conegut
      const currentSchemaVersion = AppSchema.version || "1.0"; // Per defecte o llegit de l'esquema
      const lastSchema = localStorage.getItem("sp_schema_version");
      
      if (lastSchema && lastSchema !== currentSchemaVersion) {
        console.warn(`[Migrations] Esquema canviat de ${lastSchema} a ${currentSchemaVersion}. Purgant OPFS antic.`);
        // No podem esborrar la BD sense instanciar-la o directament usem indexedDB
        // El més segur és esborrar per OPFS manual si podem, però PowerSync esborra si falla.
        try {
            const root = await navigator.storage.getDirectory();
            await root.removeEntry("socdepoble.db", { recursive: true }).catch(() => null);
        } catch(err) {
            console.debug("[Migrations] Cleanup error (safe to ignore):", err);
        }
        localStorage.setItem("sp_schema_version", currentSchemaVersion);
      } else if (!lastSchema) {
        localStorage.setItem("sp_schema_version", currentSchemaVersion);
      }

      if (!dbRef.current) {
        dbRef.current = new PowerSyncDatabase({
          schema: AppSchema,
          database: {
            dbFilename: "socdepoble.db",
            vfs: "OPFSCoopSyncVFS",
          },
          flags: { enableMultiTabs: true },
        });
      }

      if (!connectorRef.current) {
        connectorRef.current = new SupabaseConnector();
      }

      const db = dbRef.current;
      const connector = connectorRef.current;

      try {
        console.log("[LocalFirstGate] Iniciant OPFS (db.init)...");
        const initTimeout = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("TIMEOUT_OPFS")), OPFS_TIMEOUT_MS)
        );

        await Promise.race([db.init(), initTimeout]);
        console.log("[LocalFirstGate] OPFS iniciat amb èxit. Connectant a Supabase...");
        
        // Timeout independent per evitar que la connexió pengi la PWA en "CONNECTANT..." indefinidament
        const connectTimeout = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("TIMEOUT_CONNECT")), OPFS_TIMEOUT_MS + 1500)
        );

        await Promise.race([db.connect(connector), connectTimeout]);
        console.log("[LocalFirstGate] Supabase connectat. Sistema READY.");

        setDbInstance(db);
        setStatus(STATUS.READY);
      } catch (err) {
        console.warn(`[LocalFirstGate] Aturat durant la seqüència d'inici: ${err.message}`);
        const isOpfsError = err.message === "TIMEOUT_OPFS" || String(err).toLowerCase().includes("opfs") || String(err).toLowerCase().includes("lock");
        const isConnectError = err.message === "TIMEOUT_CONNECT";

        if (isOpfsError || isConnectError) {
          console.warn(`[LocalFirstGate] Bypass d'Emergència: Mode degradat actiu (Motiu: ${isConnectError ? 'Timeout Connexió' : 'OPFS Lock'})`);
          setDbInstance(dbRef.current);
          setStatus(STATUS.DEGRADED);
        } else {
          console.error("[LocalFirstGate] Error crític PowerSync:", err);
          setErrorMsg(err.message || "Error desconegut d'emmagatzematge.");
          setStatus(STATUS.ERROR);
        }
      }
    };

    initDb();

    // ─── Exponential Backoff per connexió pèrdua de senyal rural ──────────────
    const triggerReconnect = () => {
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
      
      const db = dbRef.current;
      const connector = connectorRef.current;
      if (!db || !connector || statusRef.current === STATUS.ERROR || statusRef.current === STATUS.IDLE) return;

      const delay = Math.min(INITIAL_BACKOFF_MS * Math.pow(2, reconnectAttemptRef.current), MAX_BACKOFF_MS);
      console.log(`[LocalFirstGate] Preparant reconnexió en ${delay}ms... (Intent ${reconnectAttemptRef.current + 1})`);

      reconnectTimerRef.current = setTimeout(async () => {
        try {
          await db.connect(connector);
          console.log("[LocalFirstGate] Reconnexió reeixida al backend.");
          reconnectAttemptRef.current = 0; // reset on success
        } catch (err) {
          console.warn("[LocalFirstGate] Reconnexió fallida. Backoff...", err);
          reconnectAttemptRef.current += 1;
          triggerReconnect(); // Try again with longer delay
        }
      }, delay);
    };

    const handleOnline = () => {
      console.log("[LocalFirstGate] 🧢 Cobertura de xarxa recuperada visualment.");
      reconnectAttemptRef.current = 0; // Forcem inici ràpid
      triggerReconnect();
    };

    const handleOffline = () => {
      console.log("[LocalFirstGate] 📶 Cobertura de xarxa perduda visualment.");
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // ─── BeforeUnload OPFS Lock Release ─────────────────────────────────────
    const handleBeforeUnload = () => {
      const db = dbRef.current;
      if (db) {
        // console.debug("[LocalFirstGate] Alliberant bloqueig OPFS d'emergència.");
        try {
          db.disconnect();
          db.close();
        } catch(err) {
          console.debug("[LocalFirstGate] Cleanup silent error:", err);
        }
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
    };
  }, []);

  if (status === STATUS.ERROR) {
    return (
      <div className="bg-[#111827] text-white min-h-screen flex items-center justify-center flex-col p-6 text-center">
        <h2 className="text-[#F97316] font-black text-2xl mb-4">Error Crític d'Emmagatzematge</h2>
        <p className="mb-2 text-gray-300">No s'ha pogut inicialitzar la base de dades local.</p>
        <code className="text-sm bg-black p-3 rounded-[20px] mb-6 text-red-400">{errorMsg}</code>
        <button
          onClick={async () => {
            const db = dbRef.current;
            if (db) { 
                try { await db.disconnectAndClear(); } catch (err) { console.debug(err); } 
            }
            const root = await navigator.storage.getDirectory();
            try { 
                await root.removeEntry("socdepoble.db", { recursive: true }); 
            } catch(err) { console.debug(err); }
            window.location.reload();
          }}
          className="bg-[#F97316] text-white font-bold py-3 px-6 rounded-[28px]"
        >
          Re-bategar el Sistema
        </button>
      </div>
    );
  }

  if (status === STATUS.IDLE) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col relative overflow-hidden" style={{ background: "#0b0b0b" }}>
        <div className="absolute inset-0 bg-gradient-to-br from-[#00f2ff]/5 to-transparent pointer-events-none" />
        <BrandLogo className="h-20 w-auto mb-8 opacity-80 animate-pulse text-white" style={{ filter: "drop-shadow(0 0 10px rgba(0,242,255,0.3))" }} />
        <div className="flex justify-center gap-2 mb-6">
          {[0, 150, 300].map((delay) => (
            <div key={delay} className="w-1.5 h-1.5 rounded-full bg-[#00f2ff] animate-pulse opacity-80" style={{ animationDelay: `${delay}ms` }} />
          ))}
        </div>
        <p className="text-[#00f2ff] text-[12px] font-black uppercase tracking-[0.2em] opacity-70">Connectant...</p>
      </div>
    );
  }

  return (
    <LocalFirstStatusContext.Provider value={contextValue}>
      <PowerSyncContext.Provider value={dbInstance}>
        <WaitingForBackend>
          {children}
        </WaitingForBackend>
        <SyncIndicator />
      </PowerSyncContext.Provider>
    </LocalFirstStatusContext.Provider>
  );
}

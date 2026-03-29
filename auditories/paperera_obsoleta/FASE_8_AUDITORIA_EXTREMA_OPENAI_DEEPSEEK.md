# ☢️ FASE 8: AUDITORIA EXTREMA — LLENGUATGES DE RAONAMENT PROFUND

*Aquest document conté el **Suprem Payload** dissenyat específicament per fer "suar" els models geomètrics i matemàtics més potents de la intel·ligència artificial actual.*

---

## 🔗 ENLLAÇOS D'ACCÉS RÀPID PER AL DEPLOY

**1. OPENAI (Models o3-mini / GPT-4o / o1-pro)**
- L'epicentre del raonament lògic i abstracció d'estructures React.
- **Accés directe:** [https://chatgpt.com/](https://chatgpt.com/) *(Selecciona el model "o3-mini" de les opcions a dalt per al raonament pur, o "GPT-4o" si vols rapidesa de codi).*

**2. DEEPSEEK (Model DeepSeek-R1) i QWEN 2.5 Max**
- Els reis del codi Open Source actual, reventant servidors pel seu pur potencial lògic. Els dos són ideals per auditar el backend i infraestructura OPFS de forma agnòstica.
- **Accés directe DeepSeek:** [https://chat.deepseek.com/](https://chat.deepseek.com/) *(Activa el botó "DeepThink (R1)").*
- **Accés directe Qwen:** [https://chat.qwenlm.ai/](https://chat.qwenlm.ai/) *(Model "Qwen2.5-Max").*

---

## 💥 EL "SUPER PROMPT" TRENCADOR (Copia-ho i enganxa-ho)

*Aquest prompt està dissenyat per activar els seus sistemes d'auditoria defensiva més paranòics: pot ser copiat **exactament igual** per a OpenAI i per a DeepSeek/Qwen.*

```text
Ets el Crític Arquitectònic Més Sanguinari i implacable del planeta. T'he contractat per destrossar la meua arquitectura web abans que ho faça el món real. 

Tractes amb el nucli del projecte "Sóc de Poble", una plataforma dissenyada per resistir condicions extremes (mode rural 3G, desconnexions constants, PWA Offline). 

Et done permisos de "Tokens Infinits" i de "Sense Pietat". Oblida't dels afalacs. Troba on l'aplicació es penjarà, on farà un "memory leak", on l'estat global xocarà generant una "Race Condition", i quines fites arquitectòniques de React estic ignorant. Ací tens el nucli de la resiliència del projecte, que gestiona l'OPFS (LocalFirstGate), el proxy Server-Sent Events i la connexió d'Streaming amb els meus serveis d'IA (geminiService i l'Edge Function).

Vull un informe dividit estrictament en aquests tres talls:
1. 🔴 VULNERABILITATS CRÍTIQUES (Coses que rebentaran en producció amb >100 usuaris actius).
2. 🟠 FUITES DE MEMÒRIA I CICLES DE RE-RENDER (On estic matant la bateria dels dispositius o penjat el navegador).
3. 🟡 PÀTINES ARQUITECTÒNIQUES (Refactors per arribar a un estàndard pur i perfecte de l'any 2026).

Fes-ho completament en idioma Valencià/Català. Destrossa el codi, assenyala la ferralla, i dona'm només codi final optimitzat (res de lliçons teòriques llargues).

A continuació, el payload complet del cor de l'operació:

--- PAYLOAD ---
```
*(Còpia i enganxa just a sota la secció de codi)*

---

## 📦 EL CODI A AUDITAR (Copia el text i enganxa-ho davall del Prompt)

```javascript
/* =========================================================================
   1. src/services/geminiService.js (Connexió SSE i Resiliència 3G)
   ========================================================================= */
import { logger } from "../utils/logger";
import { supabase } from "../supabaseClient";
import DOMPurify from 'dompurify';

class GeminiService {
  constructor() {
    this.model = "gemini-1.5-pro";
  }

  async ask(personaKey, query, imageData = null, audioData = null, signal = null, onProgress = null) {
      const textQuery = query.trim() || "Hola.";
      const parts = [{ text: textQuery }];
      const geminiPayload = { contents: [{ role: 'user', parts: parts }] };

      class NonRetryableError extends Error {
        constructor(message) { super(message); this.name = "NonRetryableError"; }
      }

      const executeWithRetry = async (task, maxRetries = 2) => {
        for (let attempt = 0; attempt <= maxRetries; attempt++) {
          try {
            if (signal?.aborted) throw new NonRetryableError("AbortError");
            return await task();
          } catch (err) {
            if (err.name === "NonRetryableError" || signal?.aborted) throw err;
            if (attempt === maxRetries) throw err;
            const delay = Math.pow(2, attempt) * 1000;
            await new Promise(r => setTimeout(r, delay));
          }
        }
      };

      let rawText = await executeWithRetry(async () => {
        const edgeFnUrl = `https://[SUPABASE_PROJECT].supabase.co/functions/v1/gemini-proxy`;
        const { data: session } = await supabase.auth.getSession();
        const token = session?.session?.access_token || 'ANON_KEY';

        const response = await fetch(edgeFnUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ model: this.model, geminiPayload, personaKey }),
            signal
        });

        if (!response.ok) throw new Error(`Fallada xarxa: ${response.status}`);

        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let accumulatedText = ""; let partialChunk = "";

        while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            partialChunk += decoder.decode(value, { stream: true });
            const lines = partialChunk.split('\n');
            partialChunk = lines.pop() || "";
            for (const line of lines) {
                if (line.trim() === "") continue;
                if (line.startsWith('data: ') && line.substring(6).trim() !== "[DONE]") {
                    try {
                        const parsed = JSON.parse(line.substring(6).trim());
                        const textChunk = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
                        if (textChunk) {
                            accumulatedText += textChunk;
                            if (onProgress) onProgress(accumulatedText);
                        }
                    } catch {}
                }
            }
        }
        return accumulatedText;
      });

      return { text: DOMPurify.sanitize(rawText) };
  }
}
export const geminiService = new GeminiService();

/* =========================================================================
   2. supabase/functions/gemini-proxy/index.ts (Proxy Deno EDGE)
   ========================================================================= */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type" }});
  
  try {
    const supabaseClient = createClient(Deno.env.get('SUPABASE_URL') || '', Deno.env.get('SUPABASE_ANON_KEY') || '', { global: { headers: { Authorization: req.headers.get('Authorization')! } } });
    const authUser = await supabaseClient.auth.getUser();
    const userId = authUser.data.user?.id || 'anonymous_rural_guest';
    const jsonBody = await req.json();

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${jsonBody.model}:streamGenerateContent?alt=sse&key=${Deno.env.get('GEMINI_API_KEY')}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(jsonBody.geminiPayload)
    });

    // Validem ús in-situ
    await supabaseClient.from('api_usage_logs').insert([{ user_id: userId, model: jsonBody.model, endpoint: 'gemini-proxy-sse', status: response.status }]).catch(() => {});

    return new Response(response.body, { headers: { "Content-Type": "text/event-stream", "Access-Control-Allow-Origin": "*" } });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
});

/* =========================================================================
   3. src/components/gates/LocalFirstGate.jsx (Gestor OPFS / PWA Offline)
   ========================================================================= */
import React, { useState, useEffect, useRef } from "react";
import { PowerSyncDatabase } from "@powersync/web";
import { AppSchema } from "../../powersync/schema";
import { SupabaseConnector } from "../../powersync/connector";

export default function LocalFirstGate({ children }) {
  const [status, setStatus] = useState("idle");
  const dbRef = useRef(null);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    let isMounted = true;
    const initDb = async () => {
      if (isInitializedRef.current) return;
      isInitializedRef.current = true;
      
      const currentSchemaVersion = AppSchema.version || "1.0";
      const lastSchema = localStorage.getItem("sp_schema_version");
      
      if (lastSchema && lastSchema !== currentSchemaVersion) {
        try {
            const root = await navigator.storage.getDirectory();
            await root.removeEntry("socdepoble.db", { recursive: true }).catch(() => null);
        } catch(err) {}
      }
      localStorage.setItem("sp_schema_version", currentSchemaVersion);

      dbRef.current = new PowerSyncDatabase({ schema: AppSchema, database: { dbFilename: "socdepoble.db", vfs: "OPFSCoopSyncVFS" }});
      const db = dbRef.current;
      const connector = new SupabaseConnector();

      try {
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("TIMEOUT_OPFS")), 3500));
        await Promise.race([db.init(), timeoutPromise]);
        await db.connect(connector);
        if (isMounted) setStatus("ready");
      } catch (err) {
        setStatus("error");
      }
    };
    initDb();

    // Reconnexió Automàtica
    const handleOnline = () => { if (dbRef.current) dbRef.current.connect(new SupabaseConnector()); };
    window.addEventListener("online", handleOnline);

    return () => {
      isMounted = false;
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  if (status === "error") return <div>Error d'emmagatzematge Offline</div>;
  if (status === "idle") return <div>Connectant Base Rural...</div>;
  return children;
}
```

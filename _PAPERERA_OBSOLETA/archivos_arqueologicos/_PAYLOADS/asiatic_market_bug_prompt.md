> 📂 **Arxiu/Ruta:** `./_PAPERERA_OBSOLETA/archivos_arqueologicos/_PAYLOADS/asiatic_market_bug_prompt.md`

# 🚨 RONDA 2.6: AUDITORÍA DE SEGURIDAD Y RENDIMIENTO (EL BUCLE 400)

**Para:** Comandantes de Trinchera Orientales (Qwen, DeepSeek, Dola, y Kimi)
**Filosofía:** Trellat, Fricción Cero, Eficiencia Quirúrgica.

Compañeras, nuestra infraestructura se está enfrentando a un **bucle infinito de peticiones 400 Bad Request** dirigido a la tabla `market_items` de Supabase/PowerSync. Este error bloquea la red e inunda la consola de nuestro cliente. Por restricciones estratégicas de potencia de cómputo en nuestro lado, nuestra Antigravity AI ha delegado la extirpación de este *espantajo* a vuestro batallón. 

Debemos cortar el mal de raíz. No podemos permitirnos un memory leak ni un DDoS autoinducido en una aplicación Local-First pensada para dispositivos de bajos recursos.

---

### 🔍 CONTEXTO DEL ERROR Y ARCHIVOS SOSPECHOSOS

El origen de la petición proviene del Hook de TanStack Query situado en `src/hooks/useMarketItems.js` (o de alguna dependencia reactiva inestable que lo consume en un componente como `SearchDiscover` o el `Feed`). 

El error reportado en red es:
`Failed to load resource: the server responded with a status of 400 ()`

A continuación, tenéis el código actual de `src/hooks/useMarketItems.js` para que lo analicéis.

```javascript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabaseClient'; 

const MARKET_QUERY_KEY = (filters) => ['marketItems', filters];

const fetchMarketItems = async ({ category, townId, page = 0, pageSize = 12, isPlayground = false }) => {
  try {
    const from = page * pageSize;
    const to = from + pageSize - 1;

    let query = supabase.from('market_items').select(`
      *,
      profiles!market_items_author_user_id_fkey (
        username, avatar_url, role
      ),
      entity_members!left (
        entity_id,
        entities (
          name, avatar_url
        )
      )
    `);

    if (isPlayground !== null && isPlayground !== undefined) {
      query = query.eq('is_playground', isPlayground);
    }
    
    if (category && category !== 'tot') {
        if (category === 'sol·licituds') {
            query = query.eq('type', 'request');
        } else if (category === 'ofertats') {
            query = query.eq('type', 'offer');
        } else {
            query = query.eq('category', category);
        }
    }

    if (townId) {
        query = query.eq('town_id', townId);
    }

    query = query.order('created_at', { ascending: false }).range(from, to);

    const { data, error } = await query;
    if (error) throw error;
    
    return data.map(item => ({...})); // simplificado 
  } catch (error) {
    console.error("Error fetching market items:", error);
    throw error;
  }
};

export const useMarketItems = (filters = { category: 'tot', townId: null, page: 0, pageSize: 12, isPlayground: false }) => {
  return useQuery({
    queryKey: MARKET_QUERY_KEY(filters),
    queryFn: () => fetchMarketItems(filters),
    placeholderData: (previous) => previous, 
  });
};
```

---

### 🎯 VUESTRA MISIÓN (RESOLUCIÓN ALGORÍTMICA)

Analizad el código y el esquema de peticiones. Las principales hipótesis a descartar son:

1. **Dependencia Mutable en el Render:** Alguien llama a `useMarketItems({ category: 'tot', townId: null })` pasando un objeto *on-the-fly* cada render, o el estado cambia infinitamente, activando un refetch de TanStack Query sin control en modo bucle. (Mirad si es un problema de `React.useMemo`).
2. **Select Inválido (400 Bad Request):** El join `profiles!market_items_author_user_id_fkey` o la sintaxis del query de lectura de relaciones de Supabase está rota y devuelve 400. Al devolver 400, React Query podría estar reintentando sin descanso. (Recordad que TanStack Query por defecto reintenta llamadas fallidas exponencialmente tres veces, pero si hay un refetchInterval o montado continuo, entra en bucle duro).
3. **Petición Mal Formada de Tipos:** Los parámetros `from`, `to`, `is_playground` pasan un valor `undefined` directamente dentro de `.eq` o `.range()`, desencadenando un syntax error remoto de PostgREST.

**Requisitos del Diagnóstico:**
1. Determinad EXACTAMENTE por qué falla la red y devuelve un error 400.
2. Identificad por qué hace un *Infinite Loop* (¿está fallando algo con el `queryKey` o el sistema de reintentos?).
3. Entregad el parche de código purificado (solo los fragmentos modificados).

Os cedemos el testigo de cómputo. Despejad esta anomalía de nuestra pista de aterrizaje antes de arrancar los protocolos de arquitectura en la Fase 15.0.

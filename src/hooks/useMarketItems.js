import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabaseClient'; // assuming market details are here or in a service

// Aquest arxiu inicialitza els hooks de TanStack per a MarketItems 
// sota l'estàndard V10.34

// 🧠 INJECCIÓ DE DEEPSEEK: Array de primitius (molt més òptim que JSON.stringify)
// React Query fa equality checks molt més ràpids amb strings/numbers plans.
const MARKET_QUERY_KEY = ({ category = 'tot', townId = null, page = 0, pageSize = 12, isPlayground = false } = {}) => [
  'marketItems', 
  category, 
  townId, 
  page, 
  pageSize, 
  isPlayground
];

// Ens assegurem de tindre una crida pura a Supabase per a getMarketItems fora del God Object
const fetchMarketItems = async ({ category = 'tot', townId = null, page = 0, pageSize = 12, isPlayground = null } = {}) => {
  try {
    const from = page * pageSize;
    const to = from + pageSize - 1;

    let query = supabase.from('market_items').select(`
      *,
      profiles!author_user_id (
        username, avatar_url, role
      ),
      entity_members!left (
        entity_id,
        entities (
          name, avatar_url
        )
      )
    `);

    // Normalització defensiva de booleans (evita "false" string)
    const normalizedPlayground = 
      isPlayground === 'true' ? true : 
      isPlayground === 'false' ? false : 
      isPlayground;

    if (normalizedPlayground !== null && normalizedPlayground !== undefined) {
      query = query.eq('is_playground', normalizedPlayground);
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
    
    // FIX #3: Maneig explícit de 400 per evitar throw innecessari i el bucle infinit
    if (error) {
      if (error.status === 400 || error.code?.startsWith('PGRST') || error.message?.includes('400')) {
        console.error("🔍 Supabase 400 Error abordat defensivament:", error);
        return []; 
      }
      throw error;
    }
    
    // Normalitzacions bàsiques per a adaptar-ho al sistema antic
    return data?.map(item => ({
        ...item,
        authorParams: item.author_entity_id ? 
            (item.entity_members && item.entity_members.length > 0 && item.entity_members[0].entities) ? 
                { name: item.entity_members[0].entities.name, avatar_url: item.entity_members[0].entities.avatar_url, id: item.author_entity_id, isEntity: true } 
                : { id: item.author_user_id, name: item.profiles?.username, avatar_url: item.profiles?.avatar_url, isEntity: false }
            : { id: item.author_user_id, name: item.profiles?.username, avatar_url: item.profiles?.avatar_url, isEntity: false }
    })) || [];
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
    // NO reintentar errors 400 (no s'arreglen sols)
    retry: (failureCount, error) => {
      if (error?.status === 400 || error?.message?.includes('400')) return false;
      return failureCount < 2; // Màx 2 reintents
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
    // Cache conscient de recursos limitats (Sóc de Poble iPad A10)
    staleTime: 1000 * 30,      // 30s: dades "fresques"
    gcTime: 1000 * 60 * 5,     // 5min: mantenir en cache abans de buidar
    refetchOnWindowFocus: false, // Evitar refetch brutal al canviar de pestanya
  });
};

// Hook per crear ítems optimísticament
export const useCreateMarketItem = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (newItem) => {
            const { data, error } = await supabase.from('market_items').insert([newItem]).select().single();
            if (error) throw error;
            return data;
        },
        onMutate: async (newItem) => {
            // Cancelem qualsevol fetch per a que no xafe la UI optimista
            await queryClient.cancelQueries({ queryKey: MARKET_QUERY_KEY({ category: 'tot' }) });
            
            // Snapshot estat anterior
            const previousItems = queryClient.getQueryData(MARKET_QUERY_KEY({ category: 'tot' }));
            
            // Afegim l'ítem fals temporalment
            const optimisticItem = { ...newItem, id: `temp-${Date.now()}` }; 

            queryClient.setQueryData(MARKET_QUERY_KEY({ category: 'tot' }), (old) => {
                if (!old) return [optimisticItem];
                return [optimisticItem, ...old];
            });

            return { previousItems };
        },
        onError: (err, newItem, context) => {
            // Rollback si falla
            queryClient.setQueryData(MARKET_QUERY_KEY({ category: 'tot' }), context.previousItems);
        },
        onSettled: () => {
            // Sempre refetch per assegurar dades reals (amb IDs reals)
            queryClient.invalidateQueries({ queryKey: MARKET_QUERY_KEY({ category: 'tot' }) });
        }
    });
};

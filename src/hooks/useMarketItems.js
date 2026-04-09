import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { marketService } from '../services/marketService';

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

// Utilitzem el servei oficial que gestiona correctament la caché i les columnes dinàmiques
// evitant errors 400 Bad Request de relacions que no existeixen.
const fetchMarketItems = async (filters = {}) => {
  try {
    const { data } = await marketService.getMarketItems(
      filters.category,
      filters.townId,
      filters.page,
      filters.pageSize,
      filters.isPlayground
    );
    return data || [];
  } catch (error) {
    if (error?.status === 400 || error?.message?.includes('400')) {
      console.error("🔍 Supabase 400 Error abordat des del service:", error);
      return []; 
    }
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
            const data = await marketService.createMarketItem(newItem, newItem.is_playground || false);
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

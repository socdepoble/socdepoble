import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabaseClient'; // assuming market details are here or in a service

// Aquest arxiu inicialitza els hooks de TanStack per a MarketItems 
// sota l'estàndard V10.34

const MARKET_QUERY_KEY = (filters) => ['marketItems', filters];

// Ens assegurem de tindre una crida pura a Supabase per a getMarketItems fora del God Object
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

    // El filtre isPlayground ja existeix a la db
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
    
    // Normalitzacions bàsiques per a adaptar-ho al sistema antic
    return data.map(item => ({
        ...item,
        authorParams: item.author_entity_id ? 
            (item.entity_members && item.entity_members.length > 0 && item.entity_members[0].entities) ? 
                { name: item.entity_members[0].entities.name, avatar_url: item.entity_members[0].entities.avatar_url, id: item.author_entity_id, isEntity: true } 
                : { id: item.author_user_id, name: item.profiles?.username, avatar_url: item.profiles?.avatar_url, isEntity: false }
            : { id: item.author_user_id, name: item.profiles?.username, avatar_url: item.profiles?.avatar_url, isEntity: false }
    }));
  } catch (error) {
    console.error("Error fetching market items:", error);
    throw error;
  }
};

export const useMarketItems = (filters = { category: 'tot', townId: null, page: 0, pageSize: 12, isPlayground: false }) => {
  return useQuery({
    queryKey: MARKET_QUERY_KEY(filters),
    queryFn: () => fetchMarketItems(filters),
    placeholderData: (previous) => previous, // Mantenir l'UX fluida al paginar
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

import { supabase } from '../supabaseClient';
import { MarketItemSchema } from './schemas';
import { logger } from '../utils/logger';
import { columnCache, setColumnCache, _ensureColumnCache, LocalCache, isRealDBUUID, normalizeContentItem, checkThrottling } from './supabaseService';

export const marketService = {
    async getMarketCategories() {
        const { data, error } = await supabase
            .from('market_categories')
            .select('*')
            .order('id', { ascending: true });
        if (error) throw error;
        return data || [];
    },

    async getMarketItems(categoryFilter = 'tot', townId = null, page = 0, pageSize = 12, isPlayground = false) {
        try {
            await _ensureColumnCache();

            const cacheKey = `market_${categoryFilter || 'all'}_${townId || 'global'}_${page}`;
            const cachedData = LocalCache.get(cacheKey);

            let townJoin = columnCache.market_fk_town_uuid !== false ? 'towns!fk_market_town_uuid(name)' : 'towns(name)';
            let selectStr = `id, uuid, title, description, price, category_slug, created_at, author_user_id, avatar_url, image_url, ${townJoin}`;

            if (columnCache.market_is_playground !== false) selectStr += ', is_playground';
            if (columnCache.market_is_pinned !== false) selectStr += ', is_pinned';
            if (columnCache.market_pinned_position !== false) selectStr += ', pinned_position';
            if (columnCache.market_is_iaia_inspired !== false) selectStr += ', is_iaia_inspired';

            let query = supabase.from('market_items').select(selectStr, { count: 'exact' });

            if (isPlayground && columnCache.market_is_playground !== false) {
                query = query.eq('is_playground', true);
            } else if (columnCache.market_is_playground !== false) {
                // [GHOST-SHIELD] In production, only real products
                query = query.eq('is_playground', false);
            }

            if (categoryFilter && categoryFilter !== 'tot') {
                query = query.eq('category_slug', categoryFilter);
            }

            if (townId && isRealDBUUID(townId)) {
                query = query.eq('town_uuid', townId);
            }

            const from = page * pageSize;
            const to = from + pageSize - 1;

            let queryBuilder = query;
            if (columnCache.market_is_pinned !== false) {
                queryBuilder = queryBuilder.order('is_pinned', { ascending: false });
            }
            if (columnCache.market_pinned_position !== false) {
                queryBuilder = queryBuilder.order('pinned_position', { ascending: true });
            }

            const { data, error, count } = await queryBuilder
                .order('created_at', { ascending: false })
                .range(from, to);

            if (error) {
                // [MASTER] Self-healing logic for PostgREST 400/PGRST204
                const isColumnError = error.code === '42703' || error.code === 'PGRST204' || (error.code === '400' && error.message?.includes('column'));

                if (isColumnError) {
                    logger.warn(`[SupabaseService] Market column error (${error.code}), invalidating cache...`);
                    // Invalidate specific column cache items found in error message or just reset
                    if (error.message?.includes('pinned_position')) setColumnCache('market_pinned_position', false);
                    if (error.message?.includes('is_pinned')) setColumnCache('market_is_pinned', false);
                    if (error.message?.includes('is_playground')) setColumnCache('market_is_playground', false);
                    if (error.message?.includes('fk_market_town_uuid')) setColumnCache('market_fk_town_uuid', false);

                    // Retry once immediately
                    return marketService.getMarketItems(categoryFilter, townId, page, pageSize, isPlayground);
                }
                if (cachedData) {
                    logger.warn('[Market] Network failed, serving from cache.');
                    return { data: cachedData, count: cachedData.length, fromCache: true };
                }
                throw error;
            }

            const normalizedData = (data || []).map(item => normalizeContentItem(item, 'market'));

            // [PILAR 1] Update Cache
            if (page === 0) LocalCache.set(cacheKey, normalizedData);

            return {
                data: normalizedData,
                count: count || 0
            };
        } catch (error) {
            logger.error('Error in getMarketItems:', error);
            // Return empty list on error to keep UI alive
            return { data: [], count: 0 };
        }
    },

    async getMarketFavorites(itemId) {
        const { data, error } = await supabase
            .from('market_favorites')
            .select('user_id')
            .eq('item_uuid', itemId);
        if (error) throw error;
        return (data || []).map(fav => fav.user_id);
    },

    async createMarketItem(itemData, isPlayground = false) {
        const payload = { ...itemData, category_slug: itemData.category_slug || 'tot' };
        if (isPlayground) payload.is_playground = true;

        // Rate limiting / Throttling
        if (payload.author_id || payload.author_user_id) {
            checkThrottling(payload.author_id || payload.author_user_id, 'create_market_item');
        }

        // Multi-Llinatge master: Mapetgem camps del mercat
        const mappedData = {
            ...payload,
            author_user_id: payload.author_id || payload.author_user_id || payload.user_id,
            avatar_url: payload.author_avatar_url || payload.avatar_url,
            author_entity_id: payload.entity_id || payload.author_entity_id
        };

        // Fallback crític per a la IAIA si no ve de sessió d'usuari
        if (!mappedData.author_user_id && (payload.is_iaia || payload.is_iaia_inspired)) {
            mappedData.author_user_id = '11111111-1a1a-0000-0000-000000000000'; // IAIA MarIA default
        }

        // Remove old field names to avoid PGRST204
        delete mappedData.author_id;
        delete mappedData.author_name;
        delete mappedData.seller;
        delete mappedData.seller_name;
        delete mappedData.author_avatar_url;
        delete mappedData.entity_id;

        // Validació estructural amb Zod
        const validated = MarketItemSchema.parse(mappedData);

        const { data, error } = await supabase
            .from('market_items')
            .insert([validated])
            .select();

        if (error && error.code === '42703' && isPlayground) {
            delete validated.is_playground;
            const { data: retryData, error: retryError } = await supabase.from('market_items').insert([validated]).select();
            if (retryError) throw retryError;
            return retryData[0];
        }
        if (error) throw error;
        return data[0];
    },

    async toggleMarketFavorite(itemId, userId) {
        const { data: existingFav } = await supabase
            .from('market_favorites')
            .select('*')
            .eq('item_uuid', itemId)
            .eq('user_id', userId)
            .maybeSingle();

        if (existingFav) {
            await supabase
                .from('market_favorites')
                .delete()
                .eq('item_uuid', itemId)
                .eq('user_id', userId);
            return { favorited: false };
        } else {
            await supabase
                .from('market_favorites')
                .insert([{ item_uuid: itemId, user_id: userId }]);
            return { favorited: true };
        }
    }
};

[TRELLAT]: Ací tens la segona meitat del servei de base de dades per completar el context:

### `src/core/services/supabaseService.js` (PART 2 de 2)
```javascript
        const virtualConns = JSON.parse(localStorage.getItem(virtualKey) || '[]');
        if (virtualConns.includes(targetId)) {
            const filtered = virtualConns.filter(id => id !== targetId);
            localStorage.setItem(virtualKey, JSON.stringify(filtered));
        }

        if (columnCache.connections_table === false) return true;

        try {
            const { error, status } = await supabase
                .from('connections')
                .delete()
                .eq('follower_id', followerId)
                .eq('target_id', targetId);

            if (error) {
                if (error.code === '42P01' || status === 404) {
                    setColumnCache('connections_table', false);
                    return true;
                }
                throw error;
            }
            return true;
        } catch (error) {
            logger.error('[SupabaseService] Error disconnecting:', error);
            return false;
        }
    },

    async isFollowing(followerId, targetId) {
        if (!followerId || !targetId || !isRealDBUUID(followerId) || !isRealDBUUID(targetId)) return false;

        // 1. Check Virtual Persistence first
        const virtualKey = `v_conn_${followerId}`;
        const virtualConns = JSON.parse(localStorage.getItem(virtualKey) || '[]');
        if (virtualConns.includes(targetId)) return true;

        if (columnCache.connections_table === false) return false;

        try {
            const { data, error, status } = await supabase
                .from('connections')
                .select('*')
                .eq('follower_id', followerId)
                .eq('target_id', targetId)
                .maybeSingle();

            if (error) {
                if (error.code === '42P01' || status === 404) {
                    setColumnCache('connections_table', false);
                    return false;
                }
                throw error;
            }
            if (columnCache.connections_table === null) setColumnCache('connections_table', true);
            return !!data;
        } catch {
            return false;
        }
    },

    async getFollowers(targetId) {
        if (!targetId || !isRealDBUUID(targetId)) return [];
        try {
            if (columnCache.connections_table === false) return [];

            const { data, error, status } = await supabase
                .from('connections')
                .select('follower_id')
                .eq('target_id', targetId);

            if (error) {
                if (error.code === '42P01' || status === 404) {
                    setColumnCache('connections_table', false);
                    return [];
                }
                throw error;
            }
            if (columnCache.connections_table === null) setColumnCache('connections_table', true);
            return data || [];
        } catch (error) {
            logger.error('[SupabaseService] Error getting followers:', error);
            return [];
        }
    },

    async getFollowing(userId) {
        if (!userId || !isRealDBUUID(userId)) return [];
        try {
            if (columnCache.connections_table === false) return [];
            const { data, error, status } = await supabase
                .from('connections')
                .select('target_id')
                .eq('follower_id', userId);
            if (error) {
                if (error.code === '42P01' || status === 404) {
                    setColumnCache('connections_table', false);
                    return [];
                }
                throw error;
            }
            if (columnCache.connections_table === null) setColumnCache('connections_table', true);
            return data || [];
        } catch (error) {
            logger.error('[SupabaseService] Error getting following:', error);
            return [];
        }
    },

    async addConnection(userId, postId) {
        if (!userId || !postId) return false;
        try {
            const { error } = await supabase
                .from('post_connections')
                .upsert({ user_id: userId, post_uuid: postId }, { onConflict: 'user_id,post_uuid' });
            if (error) {
                if (error.code === '42P01') {
                    logger.warn('Table post_connections missing, simulating connection');
                    return true;
                }
                throw error;
            }
            return true;
        } catch (e) {
            logger.error('[SupabaseService] Error addConnection:', e);
            return false;
        }
    },

    async removeConnection(userId, postId) {
        if (!userId || !postId) return false;
        try {
            const { error } = await supabase
                .from('post_connections')
                .delete()
                .eq('user_id', userId)
                .eq('post_uuid', postId);
            if (error) throw error;
            return true;
        } catch (e) {
            logger.error('[SupabaseService] Error removeConnection:', e);
            return false;
        }
    },



    async updateConnectionTags(userId, postId, tags) {
        if (!userId || !postId) return false;
        try {
            const { error } = await supabase
                .from('post_connections')
                .update({ tags })
                .eq('user_id', userId)
                .eq('post_uuid', postId);
            if (error) {
                if (error.code === '42P01') {
                    logger.warn('Table post_connections missing, cannot update tags');
                    return true;
                }
                throw error;
            }
            return true;
        } catch (e) {
            logger.error('[SupabaseService] Error updateConnectionTags:', e);
            return false;
        }
    },


    // Feed / Muro
    // Feed / Muro
    async getPosts(roleFilter = 'tot', townId = null, page = 0, pageSize = 10, isPlayground = false) {
        logger.log(`[SupabaseService] Fetching posts with roleFilter: ${roleFilter}, townId: ${townId}, page: ${page}, playground: ${isPlayground}`);
        try {
            // [MASTER] Robust Column Sync with retry limit
            await _ensureColumnCache();
            const retryCount = (typeof arguments[5] === 'number') ? arguments[5] : 0;
            if (retryCount > 3) {
                logger.error('[SupabaseService] Maximum retry limit reached for getPosts. Aborting to prevent infinite loop.');
                return { data: [], count: 0, error: 'Retry limit reached' };
            }

            let selectStr = 'id, content, created_at, author, image_url, image_alt, author_role, author_type, is_playground, author_user_id, author_entity_id, profiles!fk_posts_author_profile(avatar_url, full_name, town_uuid)';
            if (columnCache.posts_pinned_position !== false) {
                selectStr += ', pinned_position';
            }
            if (columnCache.posts_ai_percentage === true) {
                selectStr += ', ai_percentage, human_percentage, is_iaia_inspired';
            }

            let query = supabase
                .from('posts')
                .select(selectStr, { count: 'exact' });

            // [PILAR 1 & 3] Check Local Cache for instant return
            const cacheKey = `posts_${townId || 'global'}_${page}_${pageSize}`;
            const cachedData = LocalCache.get(cacheKey);

            if (isPlayground && columnCache.posts_is_playground !== false) {
                query = query.eq('is_playground', true);
            } else if (columnCache.posts_is_playground !== false) {
                // [GHOST-SHIELD] En producción, filtramos OBLIGATORIAMENTE el contenido de prueba
                query = query.eq('is_playground', false);
            }

            if (roleFilter && roleFilter !== ROLES.ALL && roleFilter !== 'tot') {
                query = query.eq('author_role', roleFilter);
            }

            if (townId) {
                logger.log(`[SupabaseService] townId entry: ${townId} (${typeof townId})`);
                if (!isRealDBUUID(townId)) {
                    let townSearch = supabase.from('towns').select('id');
                    townSearch = townSearch.ilike('name', `%${townId}%`);
                    const { data: townData } = await townSearch.limit(1).maybeSingle();
                    if (townData) {
                        townId = townData.id;
                    } else {
                        townId = null;
                    }
                }

                if (townId && isRealDBUUID(townId)) {
                    logger.log(`[SupabaseService] Applying strict author-territory filter: ${townId}`);
                    // Enforce that the author must belong to this town
                    query = query.eq('profiles.town_uuid', townId);
                }
            }

            const from = page * pageSize;
            const to = from + pageSize - 1;

            const { data, error, count } = await query
                .order('created_at', { ascending: false })
                .range(from, to);

            if (error) {
                // [MASTER] Robust Column Error Detection (42703: undefined_column, PGRST204: PostgREST specific column error)
                const isColumnError = error.code === '42703' || error.code === 'PGRST204' || (error.code === '400' && error.message?.includes('column'));

                if (isColumnError && error.message?.includes('pinned_position')) {
                    setColumnCache('posts_pinned_position', false);
                    logger.warn('[SupabaseService] pinned_position missing in posts, retrying...');
                    return this.getPosts(roleFilter, townId, page, pageSize, isPlayground, retryCount + 1);
                }
                if (isColumnError && (error.message?.includes('ai_percentage') || error.message?.includes('human_percentage'))) {
                    setColumnCache('posts_ai_percentage', false);
                    logger.warn('[SupabaseService] AI columns missing in posts, retrying...');
                    return this.getPosts(roleFilter, townId, page, pageSize, isPlayground, retryCount + 1);
                }
                if (isColumnError && isPlayground) {
                    setColumnCache('posts_is_playground', false);
                    logger.warn('[SupabaseService] is_playground missing in posts, retrying silent...');
                    return this.getPosts(roleFilter, townId, page, pageSize, false, retryCount + 1);
                }
                // [PILAR 3] Offline Resilience: Return cached data if available
                if (cachedData) {
                    logger.warn('[Posts] Network failed, serving from cache.');
                    return { data: cachedData, count: cachedData.length, fromCache: true };
                }
                throw error;
            }

            let normalizedData = (data || []).map(p => normalizeContentItem(p, 'post'));

            // [PILAR 1] Update Cache
            if (page === 0) LocalCache.set(cacheKey, normalizedData);

            // [MASTER PURGE] No fallbacks a Mocks en producción real para evitar "fantasmas"
            if ((!data || data.length === 0) && page === 0 && ENABLE_MOCKS && isPlayground) {
                const { MOCK_FEED } = await import('../../data');
                const normalized = MOCK_FEED.map(p => normalizeContentItem(p, 'post'));
                return { data: normalized, count: normalized.length };
            }

            // INYECCIÓN PREMIUM: Auxili Music Expansion (Only in Playground or Dev)
            const isDev = import.meta.env.MODE === 'development';
            if (page === 0 && (isPlayground || isDev) && normalizedData.length < 3) {
                const auxiliPost = {
                    id: 'didactic-auxili-2026',
                    uuid: 'didactic-auxili-2026',
                    type: 'didactic_presentation',
                    author: 'Auxili (Official)',
                    author_role: 'official',
                    author_avatar: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=200&auto=format&fit=crop', // Reggae vibes
                    content: '# Auxili: Reggae des de l\'Ontinyent\n\nAmb més de 10 anys damunt dels escenaris, **Auxili** s\'ha convertit en el crit musical de tota una generació. Des de la Vall d\'Albaida, han fusionat el reggae amb les arrels valencianes.\n\n## "La música és la nostra eina de transformació."\n\nEste 2026 tornem amb noves energies per a fer vibrar cada racó dels nostres pobles. Gràcies per formar part d\'aquesta família!',
                    image_url: [
                        'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=1000&auto=format&fit=crop', // Festival crowd
                        'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=1000&auto=format&fit=crop', // Band on stage
                        'https://images.unsplash.com/photo-1459749411177-042180ce673c?q=80&w=1000&auto=format&fit=crop'  // Musical instruments
                    ],
                    video_url: 'https://www.youtube.com/watch?v=Fadaa7Kyxm0', // Pàgines Blanques
                    created_at: new Date().toISOString(),
                    metadata: {
                        didactic_text: 'Auxili és un grup de música nascut a Ontinyent l\'any 2005. El seu estil musical és el reggae, amb tocs de ska, raggamuffin i música de banda. Les seues lletres parlen de lluita, amor i territori, amb un fort compromís social i cultural.'
                    },
                    towns: { name: 'Ontinyent (La Vall d\'Albaida)' },
                    connections_count: 850,
                    comments_count: 42
                };
                normalizedData = [auxiliPost, ...normalizedData];
            }

            return { data: normalizedData, count: (count || 0) + 1 };
        } catch (err) {
            logger.error('[SupabaseService] Error in getPosts:', err);
            return { data: [], count: 0 };
        }
    },

    async createPost(postData, isPlayground = false) {
        const payload = { ...postData };
        if (isPlayground) payload.is_playground = true;

        // Rate limiting / Throttling
        if (payload.author_id) {
            checkThrottling(payload.author_id, 'create_post');
        }

        // Multi-Llinatge master: Mapetgem camps si venen de components amb noms antics
        const mappedData = {
            ...payload,
            author_user_id: payload.author_id || payload.author_user_id || payload.user_id,
            author: payload.author_name || payload.author || 'Sóc de Poble',
            author_avatar: payload.author_avatar_url || payload.author_avatar,
            author_entity_id: payload.entity_id || payload.author_entity_id
        };

        // Fallback crític per a la IAIA si no ve de sessió d'usuari
        if (!mappedData.author_user_id && (payload.is_iaia || payload.is_iaia_inspired)) {
            mappedData.author_user_id = payload.iaia_id || '11111111-1a1a-0000-0000-000000000000';
        }

        // Remove old field names to avoid PGRST204
        delete mappedData.author_id;
        delete mappedData.author_name;
        delete mappedData.author_avatar;
        delete mappedData.author_avatar_url;
        delete mappedData.entity_id;
        delete mappedData.town_id;

        // Validació estructural amb Zod
        const validated = PostSchema.parse(mappedData);

        // Pre-generem id si no existeix (FIX 400 Bad Request)
        if (!validated.id && !validated.uuid) {
            validated.uuid = crypto.randomUUID();
        }

        // [MIGRACIÓ 10.33.20] Normalitzar town_uuid per evitar errors de tipat (ex: 'la-torre')
        if (validated.town_uuid === 'la-torre' || validated.town_uuid === '1') {
            validated.town_uuid = 'eecc1a91-db53-4bf0-a3ce-b33df011df6b';
        } else if (validated.town_uuid && !isValidUUID(validated.town_uuid)) {
            validated.town_uuid = null; // Prevent crashes against UUID columns
        }

        const { error } = await supabase
            .from('posts')
            .insert([validated]);

        if (error) {
            // [SUPER-HEALING] Fk_posts_author_profile error (missing user in profiles table locally)
            if (error.code === '23503' && (error.message?.includes('profile') || error.details?.includes('profile'))) {
                logger.warn(`[SupabaseService] Missing profile for user ${validated.author_user_id}. Auto-healing...`);
                try {
                    const profilePayload = {
                        id: validated.author_user_id,
                        full_name: validated.author || 'Sóc de Poble',
                        avatar_url: validated.author_avatar || null,
                        role: 'neighbor',
                        is_certified: false,
                        updated_at: new Date().toISOString()
                    };
                    await supabase.from('profiles').upsert([profilePayload]);
                    logger.info(`[SupabaseService] Profile created. Retrying post...`);
                    const { error: retryFkError } = await supabase.from('posts').insert([validated]);
                    if (retryFkError) throw retryFkError;
                    return validated;
                } catch (healingError) {
                    logger.error(`[SupabaseService] Auto-healing profile failed:`, healingError);
                    throw error;
                }
            }

            // [MASTER] Self-healing: if column not found, invalidate cache and retry
            if (error.code === '42703' || error.code === 'PGRST204') {
                logger.warn(`[SupabaseService] Column sync error (${error.code}) in createPost, invalidating cache...`);
                setColumnCache('posts_ai_percentage', false);
                setColumnCache('posts_human_percentage', false);
                setColumnCache('posts_time_saved', false);
                setColumnCache('posts_is_iaia_inspired', false);

                // Retry once without symbiosis columns
                const cleanPayload = { ...validated };
                delete cleanPayload.ai_percentage;
                delete cleanPayload.human_percentage;
                delete cleanPayload.time_saved_minutes;
                delete cleanPayload.economic_value_saved;
                delete cleanPayload.is_iaia_inspired;

                if (!cleanPayload.uuid) cleanPayload.uuid = crypto.randomUUID();
                const { error: retryError } = await supabase.from('posts').insert([cleanPayload]);
                
                if (retryError) {
                    logger.warn(`[SupabaseService] Second sync error (${retryError.code}), trying minimal payload...`);
                    const minimalPayload = {
                        id: validated.id || undefined,
                        uuid: validated.uuid || cleanPayload.uuid,
                        author_user_id: validated.author_user_id,
                        author: validated.author,
                        content: validated.content,
                        town_uuid: validated.town_uuid || payload.town_uuid
                    };
                    const { error: finalError } = await supabase.from('posts').insert([minimalPayload]);
                    if (finalError) throw finalError;
                    return minimalPayload;
                }
                return cleanPayload;
            }
            if (isPlayground || error.code === '42501' || error.code === '403') {
                // Fallback si la columna no existe o hay RLS restrictivo en campos extra
                logger.warn(`[SupabaseService] Security/RLS block in createPost, retrying minimal payload...`);
                const minimalPayload = {
                    id: validated.id || undefined,
                    uuid: validated.uuid || crypto.randomUUID(),
                    author_user_id: validated.author_user_id,
                    author: validated.author,
                    content: validated.content,
                    town_uuid: validated.town_uuid || payload.town_uuid
                };
                const { error: retryError } = await supabase.from('posts').insert([minimalPayload]);
                if (retryError) throw retryError;
                return minimalPayload;
            }
            throw error;
        }
        return validated;
    },

    // Mercado
    async getMarketCategories() {
        const { data, error } = await supabase
            .from('market_categories')
            .select('*')
            .order('id', { ascending: true });
        if (error) throw error;
        return data || [];
    },

    async getMarketItems(categoryFilter = 'tot', townId = null, page = 0, pageSize = 12, isPlayground = false, _retryCount = 0) {
        try {
            await _ensureColumnCache();

            const cacheKey = `market_${categoryFilter || 'all'}_${townId || 'global'}_${page}`;
            const idbCacheKey = `SDP_${cacheKey}`;
            
            let cachedData = LocalCache.get(cacheKey);
            if (!cachedData) {
                try {
                    const idbData = await get(idbCacheKey);
                    if (idbData) cachedData = idbData;
                } catch(e) {
                    logger.warn('[SupabaseService] Failed reading market from IDB', e);
                }
            }

            let townJoin = ''; // Removed to prevent PGRST200
            let selectStr = `uuid, title, description, price, category_slug, created_at, author_user_id, avatar_url, image_url`;

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
                    logger.warn(`[SupabaseService] Market column error (${error.code}), invalidating cache... retry ${_retryCount}`);
                    
                    // PREVENT INFINITE LOOP (Hard limit super estricto 1)
                    if (_retryCount >= 1) { // ❌ ANTES ERA >= 2 (peligroso en arrays de fallos)
                        logger.error('[SupabaseService] Breaking infinite retry loop HARD.');
                        if (cachedData) return { data: cachedData, count: cachedData.length, fromCache: true };
                        return { data: [], count: 0 };
                    }

                    // Invalidate specific column cache items found in error message or just reset
                    if (error.message?.includes('pinned_position')) setColumnCache('market_pinned_position', false);
                    if (error.message?.includes('is_pinned')) setColumnCache('market_is_pinned', false);
                    if (error.message?.includes('is_playground')) setColumnCache('market_is_playground', false);
                    if (error.message?.includes('fk_market_town_uuid')) setColumnCache('market_fk_town_uuid', false);

                    // Esperar para no bloquear el stack (backoff)
                    await new Promise(resolve => setTimeout(resolve, 300 * (_retryCount + 1)));

                    // Retry with incremented counter
                    return this.getMarketItems(categoryFilter, townId, page, pageSize, isPlayground, _retryCount + 1);
                }
                if (cachedData) {
                    logger.warn('[Market] Network failed, serving from cache.');
                    return { data: cachedData, count: cachedData.length, fromCache: true };
                }
                throw error;
            }

            const normalizedData = (data || []).map(item => normalizeContentItem(item, 'market'));

            // [PILAR 1] Update Cache
            if (page === 0) {
                LocalCache.set(cacheKey, normalizedData);
                set(idbCacheKey, normalizedData).catch(e => logger.warn('[SupabaseService] Failed saving market to IDB', e));
            }

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
            seller: payload.author_name || payload.seller || 'Sóc de Poble',
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
    },

    // Suscripciones en tiempo real y Presencia
    subscribeToConversation(conversationId, options = {}) {
        if (!isRealDBUUID(conversationId) || conversationId?.startsWith('mock-')) {
            return { unsubscribe: () => { } };
        }
        const { onNewMessage, onMessageUpdate } = options;

        const channel = supabase.channel(`conversation:${conversationId}`)
            .on(
                'postgres_changes',
                {
                    event: '*', // Listen to inserts and updates (read status)
                    schema: 'public',
                    table: 'messages',
                    filter: `conversation_id=eq.${conversationId}`
                },
                (payload) => {
                    if (payload.eventType === 'INSERT' && onNewMessage) onNewMessage(payload.new);
                    if (payload.eventType === 'UPDATE' && onMessageUpdate) onMessageUpdate(payload.new);
                }
            );

        return channel.subscribe();
    },

    subscribeToPresence(conversationId, userId, onSync) {
        if (!isRealDBUUID(conversationId) || conversationId?.startsWith('mock-')) {
            return { unsubscribe: () => { } };
        }
        const channel = supabase.channel(`presence:${conversationId}`, {
            config: {
                presence: {
                    key: userId,
                },
            },
        });

        channel
            .on('presence', { event: 'sync' }, () => {
                const state = channel.presenceState();
                onSync(state);
            })
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    await channel.track({
                        online_at: new Date().toISOString(),
                        is_typing: false
                    });
                }
            });

        return channel;
    },

    async updatePresenceTyping(channel, isTyping) {
        if (!channel) return;
        return channel.track({
            online_at: new Date().toISOString(),
            is_typing: isTyping
        });
    },

    // Autenticació s'importa directament d'authService arreu de l'aplicació

    /**
     * Cachea de forma segura la presencia de columnas, evitando bucles de error 42703.
     */
    async checkColumn(tableName, columnName) {
        const cacheKey = `${tableName}_has_${columnName}`;
        if (columnCache[cacheKey] !== null) return columnCache[cacheKey];

        if (!activeChecks[cacheKey]) {
            activeChecks[cacheKey] = (async () => {
                try {
                    const { data, error } = await supabase.from(tableName).select('*').limit(1);
                    if (data && data.length > 0) {
                        const exists = columnName in data[0];
                        setColumnCache(cacheKey, exists);
                        return exists;
                    }
                    if (error) {
                        setColumnCache(cacheKey, false);
                        return false;
                    }
                    setColumnCache(cacheKey, true); // Optimistic true si la taula està buida
                    return true;
                } catch {
                    setColumnCache(cacheKey, false);
                    return false;
                } finally {
                    activeChecks[cacheKey] = null;
                }
            })();
        }
        return await activeChecks[cacheKey];
    },

    async getProfile(id) {
        console.log('[getProfile] Called with id:', id);
        if (!id || !isRealDBUUID(id)) {
            // Check in Lore Personas first
            const lore = LORE_PERSONAS.find(p => p.id === id);
            if (lore) return lore;
            return null;
        }

        if (this._profileCache.has(id)) {
            console.log('[getProfile] Returning from cache');
            return this._profileCache.get(id);
        }

        try {
            const hasPremium = columnCache.profiles_has_premium !== false;
            const fullSelect = 'id, username, full_name, role, avatar_url, cover_url, bio, primary_town, town_uuid, is_demo, created_at, ofici, social_image_preference';
            const baseSelect = 'id, username, full_name, role, avatar_url, cover_url, bio, primary_town, town_uuid, is_demo, created_at';

            const select = hasPremium ? fullSelect : baseSelect;

            console.log(`[getProfile] Fetching from supabase with select: ${select}...`);
            
            // [BATEGAT FAILSAFE] Timeout de 6s per previndre deadlock del mutex de Supabase
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Supabase getProfile FETCH TIMEOUT')), 6000);
            });

            const queryPromise = supabase
                .from('profiles')
                .select(select)
                .eq('id', id)
                .maybeSingle();

            let { data, error } = await Promise.race([queryPromise, timeoutPromise]);
            
            console.log(`[getProfile] Supabase response received. Error:`, error);

            if (error) {
                if (hasPremium && (error.code === '42703' || error.message?.includes('ofici'))) {
                    setColumnCache('profiles_has_premium', false);
                    return this.getProfile(id); // Silent retry with base solo por falta de columnas
                }
                if (error.code === 'PGRST116') return null; // Stop crash loop on 404
                throw error;
            }

            if (hasPremium && data && columnCache.profiles_has_premium === null) {
                setColumnCache('profiles_has_premium', true);
            }

            const normalized = this.normalizeProfile(data);
            this._profileCache.set(id, normalized);
            return normalized;
        } catch (err) {
            logger.error('[SupabaseService] Critical error in getProfile:', err);
            return null;
        }
    },

    // Conexiones (Antiguos Likes)
    async getPostConnections(postIds) {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        const ids = (Array.isArray(postIds) ? postIds : [postIds]).filter(id =>
            typeof id === 'string' && uuidRegex.test(id)
        );
        if (ids.length === 0) return [];

        try {
            const { data, error } = await supabase
                .from('post_connections')
                .select('post_uuid, user_id, tags')
                .in('post_uuid', ids);

            if (error) {
                if (error.code === 'PGRST116' || error.code === '42703' || error.code === '42P01') {
                    logger.warn('[SupabaseService] post_connections table error. Check schema.');
                    return [];
                }
                logger.error('[SupabaseService] Error fetching post connections:', error);
                return [];
            }
            return data || [];
        } catch (err) {
            logger.error('[SupabaseService] Unexpected error in getPostConnections:', err);
            return [];
        }
    },

    async getPostUserConnection(postId, userId) {
        const { data, error } = await supabase
            .from('post_connections')
            .select('*')
            .eq('post_uuid', postId)
            .eq('user_id', userId)
            .maybeSingle();
        if (error) throw error;
        return data;
    },

    async togglePostConnection(postId, userId, tags = []) {
        if (!userId) throw new Error('UserId is required for connection');
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(postId);
        if (!isUUID) {
            logger.warn('[SupabaseService] togglePostConnection blocked for non-UUID postId:', postId);
            return { connected: false, tags: [] };
        }

        const { data: existingConnection } = await supabase
            .from('post_connections')
            .select('*')
            .eq('post_uuid', postId)
            .eq('user_id', userId)
            .maybeSingle();

        if (existingConnection) {
            if (tags.length > 0 || (tags.length === 0 && existingConnection.tags?.length > 0)) {
                const { data, error } = await supabase
                    .from('post_connections')
                    .update({ tags })
                    .eq('post_uuid', postId)
                    .eq('user_id', userId)
                    .select();
                if (error) throw error;
                return { connected: true, tags: data[0].tags };
            } else {
                await supabase
                    .from('post_connections')
                    .delete()
                    .eq('post_uuid', postId)
                    .eq('user_id', userId);
                return { connected: false, tags: [] };
            }
        } else {
            const { data, error } = await supabase
                .from('post_connections')
                .insert([{
                    post_uuid: postId,
                    user_id: userId,
                    tags: tags
                }])
                .select();
            if (error) throw error;
            return { connected: true, tags: data[0].tags };
        }
    },

    async getUserTags(userId) {
        if (!isRealDBUUID(userId)) return [];
        const { data, error } = await supabase
            .from('user_tags')
            .select('tag_name')
            .eq('user_id', userId)
            .order('tag_name', { ascending: true });
        if (error) throw error;
        return (data || []).map(t => t.tag_name);
    },

    async addUserTag(userId, tagName) {
        if (!isRealDBUUID(userId)) return null;
        // Normalizar etiqueta
        const name = tagName.trim().toLowerCase();
        if (!name) return null;

        const { data, error } = await supabase
            .from('user_tags')
            .insert([{ user_id: userId, tag_name: name }])
            .select();

        if (error) {
            if (error.code === '23505') return { tag_name: name }; // Ya existe
            throw error;
        }
        return data[0];
    },

    async deleteUserTag(userId, tagName) {
        if (!isRealDBUUID(userId)) return;
        logger.log(`[SupabaseService] Deleting user tag: ${tagName}`);
        const { error } = await supabase
            .from('user_tags')
            .delete()
            .match({ user_id: userId, tag_name: tagName.toLowerCase() });

        if (error) {
            logger.error('[SupabaseService] Error deleting user tag:', error);
            throw error;
        }
        return true;
    },

    async upsertProfile(userId, data) {
        if (!userId) return null;
        try {
            const payload = { id: userId, ...data };
            
            // [BATEGAT FAILSAFE] Timeout de 6s
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Supabase upsertProfile FETCH TIMEOUT')), 6000);
            });

            const queryPromise = supabase
                .from('profiles')
                .upsert(payload, { onConflict: 'id' })
                .select();
                
            const { data: result, error } = await Promise.race([queryPromise, timeoutPromise]);

            if (error) {
                logger.warn('[SupabaseService] Error upserting profile:', error);
                throw error;
            }
            return result && result.length > 0 ? result[0] : null;
        } catch (error) {
            logger.error('[SupabaseService] Critical error in upsertProfile:', error);
            throw error;
        }
    },

    async updateProfile(userId, updates) {
        if (userId && !updates.is_playground) {
            await checkThrottling(userId, 'update_profile', 3000).catch(e => logger.warn('Throttling warn', e));
        }
        const isLoreCharacter = userId && userId.startsWith('11111111');

        if (isLoreCharacter) {
            logger.log('[SupabaseService] Simulated update for Lore character:', { userId, updates });
            return { id: userId, ...updates };
        }

        const validated = ProfileSchema.partial().parse(updates);

        try {
            const { data, error } = await supabase
                .from('profiles')
                .update(validated)
                .eq('id', userId)
                .select();

            if (error) {
                if (error.code === 'PGRST204' || error.message?.includes('ofici')) {
                    logger.warn('[SupabaseService] Missing column (ofici) detected. Using optimistic fallback.');
                    // Fallback para Sandbox/Demo sin migración SQL ejecutada
                    return { id: userId, ...updates };
                }
                throw error;
            }
            return data[0];
        } catch (error) {
            logger.error('[SupabaseService] Error updating profile:', error);
            throw error;
        }
    },

    async createEntity(payload) {
        try {
            // 1. Crear l'entitat
            const { data: entity, error: entityError } = await supabase
                .from('entities')
                .insert([{
                    name: payload.name,
                    type: payload.type || 'empresa',
                    avatar_url: payload.avatar_url || null,
                    description: payload.description || null,

                    created_at: new Date().toISOString()
                }])
                .select()
                .single();

            if (entityError) throw entityError;

            // 2. Afegir el creador com a 'admin'
            if (payload.creator_id) {
                const { error: memberError } = await supabase
                    .from('entity_members')
                    .insert([{
                        entity_id: entity.id,
                        user_id: payload.creator_id,
                        role: 'admin',
                        created_at: new Date().toISOString()
                    }]);
                
                if (memberError) throw memberError;
            }

            return entity;
        } catch (error) {
            logger.error('[SupabaseService] Error creating entity:', error);
            throw error;
        }
    },

    // Multi-Identidad (Phase 6)
    async getUserEntities(userId) {
        if (!userId) return [];
        try {
            // Obtenemos las entidades donde el usuario es miembro
            const { data, error } = await supabase
                .from('entity_members')
                .select(`
                    role,
                    entities (
                        id,
                        name,
                        type,
                        avatar_url
                    )
                `)
                .eq('user_id', userId);

            if (error) {
                // [RESILIÈNCIA OMEGA] Catch permission errors (401/403/42501) or missing table errors
                const isPermissionError = error.code === '42501' || error.status === 401 || error.status === 403;
                if (isPermissionError || error.code === 'PGRST201' || error.code === '42P01' || error.code === '42703') {
                    logger.warn(`[SupabaseService] getUserEntities blindat: ${error.message || error.code}. Ignorant permisos/esquema.`);
                    return [];
                }
                logger.error('[SupabaseService] Error loading entities:', error);
                return [];
            }

            // SANEJAMENT DE LLINATGE: Transformar Sóc de Poble a Empresa i netejar duplicats
            let processedEntities = (data || []).map(item => ({
                ...item.entities,
                member_role: item.role
            }));

            // If it's Javi, enforce "Sóc de Poble" as Empresa and hide Association duplicate
            const isJavi = userId === '25218ea4-5d7d-4db4-bdc5-7ae035629242' || userId === 'javillinares' || userId === 'mock_javi-llinares';
            if (isJavi) {
                const sdpExists = processedEntities.some(e => e.id === 'socdepoble');
                const rentonarExists = processedEntities.some(e => e.id === 'el-rentonar');

                if (!sdpExists) {
                    const sdp = SYSTEM_ENTITIES.find(e => e.id === 'socdepoble');
                    if(sdp) processedEntities.push({ ...sdp, name: sdp.full_name, member_role: 'admin' });
                }
                if (!rentonarExists) {
                    const rento = SYSTEM_ENTITIES.find(e => e.id === 'el-rentonar');
                    if(rento) processedEntities.push({ ...rento, name: rento.full_name, member_role: 'admin' });
                }

                const socDePobleEmpresa = processedEntities.find(e => e.name?.toLowerCase().includes('sóc de poble') && e.type === 'empresa');
                if (socDePobleEmpresa) {
                    processedEntities = processedEntities.filter(e => !(e.name?.toLowerCase().includes('sóc de poble') && e.type === 'associacio'));
                } else {
                    processedEntities = processedEntities.map(e => {
                        if (e.name?.toLowerCase().includes('sóc de poble') && e.type === 'associacio') {
                            return { ...e, type: 'empresa' };
                        }
                        return e;
                    });
                }
            }

            return processedEntities;
        } catch (err) {
            logger.error('[SupabaseService] Critical error in getUserEntities:', err);
            return []; // Fail safe to avoid white screen
        }
    },

    // Fase 6: Páginas Públicas y Gestión de Entidades
    // [EMERGENCY FIX] Cache for profiles to prevent infinite network loops
    _profileCache: new Map(),

    async getPublicProfile(userId) {
        // [OMNISCIENT] Universal Resolver for System Entities and Lore Personas
        const personas = await this.getAllPersonas();
        const foundPersona = personas.find(p => p.id === userId);
        if (foundPersona) return foundPersona;

        const system = SYSTEM_ENTITIES.find(e => e.id === userId);
        if (system) return system;

        if (!isRealDBUUID(userId)) {
            logger.debug(`[SupabaseService] getPublicProfile: Saltant crida a DB per ID no-UUID o Sobirà: ${userId}`);
            return null; // Silent fail for malformed or sovereign IDs
        }

        // Return from cache if available to prevent generic infinite loops
        if (this._profileCache.has(userId)) {
            return this._profileCache.get(userId);
        }

        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
        
        if (error) {
            if (error.code === 'PGRST116') {
                if (userId === '25218ea4-5d7d-4db4-bdc5-7ae035629242') {
                    const masterProfile = {
                        id: '25218ea4-5d7d-4db4-bdc5-7ae035629242',
                        full_name: 'Javi Llinares',
                        username: 'javillinares',
                        type: 'persona',
                        town_name: 'La Torre de les Maçanes',
                        bio: 'Desenvolupador principal d\'Antigravity i arquitecte de Sóc de Poble. Programant el futur rural.',
                        avatar_url: '/system/master/javi_avatar_cinematic.png',
                        cover_url: '/assets/patterns/hero_pattern.png',
                        category: 'Tecnologia',
                        is_active: true,
                        is_admin: true,
                        created_at: '2025-01-01T00:00:00Z'
                    };
                    this._profileCache.set(userId, masterProfile);
                    return masterProfile;
                }
                return null;
            }
            throw error;
        }
        
        const normalized = this.normalizeProfile(data);
        this._profileCache.set(userId, normalized);
        return normalized;
    },

    async getUserByUsername(username) {
        if (!username) throw new Error('Username is required');
        const cleanUsername = username.toLowerCase();

        // [OMNISCIENT] Search in virtual personas first
        const personas = await this.getAllPersonas();
        const foundPersona = personas.find(p => p.username?.toLowerCase() === cleanUsername);
        if (foundPersona) return foundPersona;

        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('username_lower', cleanUsername)
            .limit(1)
            .maybeSingle();

        if (error) {
            if (error.code === 'PGRST116') {
                return null; // Not found
            }
            throw error;
        }

        return this.normalizeProfile(data);
    },

    async updateProfileBio(userId, bio) {
        const { data, error } = await supabase
            .from('profiles')
            .update({ bio: bio?.substring(0, 160) || null })
            .eq('id', userId)
            .select()
            .single();

        if (error) throw error;
        logger.log('[SupabaseService] Bio updated');
        return data;
    },

    async getAllCitizens() {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('full_name', { ascending: true });
        if (error) throw error;
        return data;
    },

    async updateUserRole(userId, role) {
        const { data, error } = await supabase
            .from('profiles')
            .update({ role: role })
            .eq('id', userId)
            .select();
        if (error) throw error;
        return data[0];
    },

    async getContact(ownerId) {
        if (!ownerId || !isValidUUID(ownerId)) return null;
        try {
            const { data, error } = await supabase
                .from('contacts')
                .select('*')
                .or(`profile_id.eq.${ownerId},entity_id.eq.${ownerId}`)
                .maybeSingle();
            
            if (error) {
                logger.warn(`[SupabaseService] getContact error:`, error);
                return null;
            }
            return data;
        } catch (error) {
            logger.warn(`[SupabaseService] Error in getContact for ${ownerId}:`, error);
            return null;
        }
    },

    async getPublicEntity(entityId) {
        // Intercept System/Mock entities (Blindatge OMNISCIENT)
        const systemMatch = SYSTEM_ENTITIES.find(e => e.id === entityId);
        if (systemMatch) return systemMatch;

        const adminEntities = await this.getAdminEntities(); // Includes system and curated DB entities
        const existingMock = adminEntities.find(e => e.id === entityId);

        if (existingMock) return existingMock;

        if (!isRealDBUUID(entityId)) {
            logger.debug(`[SupabaseService] getPublicEntity: Saltant crida a DB per ID no-UUID o Sobirà: ${entityId}`);
            return null;
        }

        const { data, error } = await supabase
            .from('entities')
            .select('*')
            .eq('id', entityId)
            .limit(1)
            .maybeSingle();
        
        if (error) {
            if (error.code === 'PGRST116' || error.code === '42P01' || String(error.message).includes('404')) return null;
            logger.warn(`[SupabaseService] getPublicEntity error ignorat transversalment:`, error);
            return null;
        }
        
        if (!data) return null;

        const entity = data;
        return {
            ...entity,
            avatar_url: this.normalizeStorageUrl(entity.avatar_url),
            cover_url: this.normalizeStorageUrl(entity.cover_url)
        };
    },

    async getEntityMembers(entityId) {
        // Blindatge OMNISCIENT per a entitats de sistema
        if (entityId === 'socdepoble') {
            return [{
                user_id: '25218ea4-5d7d-4db4-bdc5-7ae035629242', // Javi Real
                role: 'Fundador',
                profiles: {
                    full_name: 'Javi Linares',
                    avatar_url: '/assets/mock-data/test_user.jpg'
                }
            }];
        }

        const { data, error } = await supabase
            .from('entity_members')
            .select('user_id, role, profiles(full_name, avatar_url)')
            .eq('entity_id', entityId);
        if (error) {
            logger.error('[SupabaseService] Error getting entity members:', error);
            return []; // Fail gracefully
        }
        return data;
    },

    async getUserPosts(userId, isPlayground = false) {
        if (!isRealDBUUID(userId)) return [];
        try {
            // [MOCK HEALER] Support for virtual entities / agents in the feed
            let virtualPosts = [];
            const JAVI_REAL_ID = '25218ea4-5d7d-4db4-bdc5-7ae035629242';
            if (userId.startsWith('11111111-') || userId === JAVI_REAL_ID || typeof ENABLE_MOCKS !== 'undefined') {
                try {
                    const { MOCK_FEED } = await import('../../data/index.js');
                    virtualPosts = MOCK_FEED.filter(p => p.author_entity_id === userId || p.author_id === userId || p.author_user_id === userId);
                } catch {
                     logger.warn("Could not import MOCK_FEED for user posts");
                }
            }

            if (!isRealDBUUID(userId)) {
                // Si és un ID sobirà o malformat, mirem si té posts de Lore, si no, retornem buit sense cridar a DB
                const lorePosts = (MOCK_LORE_POSTS[userId] || []).map(p => {
                    const persona = LORE_PERSONAS.find(lp => lp.id === userId);
                    return normalizeContentItem({
                        ...p,
                        author_name: p.author_name || persona?.full_name,
                        author_avatar_url: persona?.avatar_url,
                        author_role: p.author_role || persona?.role,
                        town_name: persona?.primary_town
                    }, 'post');
                });
                return [...lorePosts, ...virtualPosts];
            }
            // const isUcc = localStorage.getItem('active_ucc_view') === 'true';
            if (isPlayground && !userId?.startsWith('11111111-')) {
                // Simplified mock return only for non-demo users in playground
                return [];
            }

            let query = supabase
                .from('posts')
                .select('id, uuid:id, content, created_at, image_url, image_alt, author, author_role, author_type, author_user_id, author_entity_id, is_playground, categories, tags');

            // LLINATGE DE L'ARQUITECTE: Si és en Javi, mostrem els seus posts naturals I els de l'Empresa Sóc de Poble
            if (userId === JAVI_REAL_ID) {
                // Busquem l'ID de l'empresa Sóc de Poble (es pot optimitzar amb un cache o constant)
                query = query.or(`author_user_id.eq.${userId},author.ilike.%Sóc de Poble%`);
            } else {
                query = query.eq('author_user_id', userId);
            }

            if (isPlayground) query = query.eq('is_playground', true);
            else query = query.or('is_playground.is.null,is_playground.eq.false');

            const { data, error } = await query.order('created_at', { ascending: false });
            if (error) throw error;

            // Inyectamos contenido de Lore si existe (Auditoría V3)
            const lorePosts = (MOCK_LORE_POSTS[userId] || []).map(p => {
                const persona = LORE_PERSONAS.find(lp => lp.id === userId);
                return normalizeContentItem({
                    ...p,
                    author_name: p.author_name || persona?.full_name,
                    author_avatar_url: persona?.avatar_url,
                    author_role: p.author_role || persona?.role,
                    town_name: persona?.primary_town
                }, 'post');
            });

            const dbData = (data || []).map(p => normalizeContentItem(p, 'post'));
            return [...lorePosts, ...virtualPosts.map(p => normalizeContentItem(p, 'post')), ...dbData];
        } catch (error) {
            logger.error('[SupabaseService] Error in getUserPosts:', error);
            return [];
        }
    },

    async getImportedPosts(userId) {
        if (!isRealDBUUID(userId)) return { data: [], error: null };
        try {
            return await supabase
                .from('posts')
                .select('*')
                .eq('author_user_id', userId)
                .eq('type', 'imported_story')
                .order('created_at', { ascending: false });
        } catch (error) {
            logger.error('[SupabaseService] Error in getImportedPosts:', error);
            return { data: [], error };
        }
    },

    async getUserPostsCount(userId) {
        if (!isRealDBUUID(userId)) return 0;
        try {
            let virtualCount = 0;
            if (userId.startsWith('11111111-')) {
                 try {
                     const { MOCK_FEED } = await import('../../data/index.js');
                     virtualCount = MOCK_FEED.filter(p => p.author_entity_id === userId || p.author_id === userId).length;
                 } catch {
                     logger.warn("Could not import MOCK_FEED for user posts count");
                 }
                 return virtualCount; // Fast path for agents
            }

            const { count, error } = await supabase
                .from('posts')
                .select('*', { count: 'exact', head: true })
                .eq('author_user_id', userId);
            if (error) throw error;
            return count || 0;
        } catch (err) {
            logger.error('[SupabaseService] Error in getUserPostsCount:', err);
            return 0;
        }
    },

    async getEntityPosts(entityId, isPlayground = false) {
        try {
            // Support for virtual entities in the feed (Lore injection)
            const { MOCK_FEED } = await import('../../data');
            const virtualPosts = MOCK_FEED.filter(p => p.author_entity_id === entityId || p.entity_id === entityId);

            let query = supabase
                .from('posts')
                .select('id, uuid:id, content, created_at, image_url, image_alt, author, author_role, author_type, author_user_id, author_entity_id, is_playground, categories, tags')
                .eq('author_entity_id', entityId);

            if (isPlayground) query = query.eq('is_playground', true);
            else query = query.or('is_playground.is.null,is_playground.eq.false');

            const { data, error } = await query.order('created_at', { ascending: false });
            if (error && virtualPosts.length === 0) throw error;

            const dbData = (data || []).map(p => normalizeContentItem(p, 'post'));
            // Merge virtual and real posts
            return [...virtualPosts, ...dbData].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        } catch (error) {
            logger.error('[SupabaseService] Error in getEntityPosts:', error);
            return [];
        }
    },

    async getUserMarketItems(userId, isPlayground = false) {
        if (!isRealDBUUID(userId)) return [];
        try {
            if (!isRealDBUUID(userId)) {
                // Lore injection for non-DB IDs
                const loreItems = (MOCK_LORE_ITEMS[userId] || []).map(item => {
                    const persona = LORE_PERSONAS.find(p => p.id === userId);
                    return normalizeContentItem({
                        ...item,
                        seller_name: persona?.full_name,
                        author_avatar_url: persona?.avatar_url,
                        author_role: persona?.role,
                        town_name: persona?.primary_town
                    }, 'market');
                });
                return loreItems;
            }
            let query = supabase
                .from('market_items')
                .select('uuid, title, description, price, category_slug, created_at, image_url, author_user_id, is_playground, is_active')
                .eq('author_user_id', userId);

            if (isPlayground) query = query.eq('is_playground', true);
            else query = query.or('is_playground.is.null,is_playground.eq.false');

            const { data, error } = await query.order('created_at', { ascending: false });
            if (error) throw error;

            // Inyectamos artículos de Lore si existe (Auditoría V3)
            const loreItems = (MOCK_LORE_ITEMS[userId] || []).map(item => {
                const persona = LORE_PERSONAS.find(p => p.id === userId);
                return normalizeContentItem({
                    ...item,
                    seller_name: persona?.full_name,
                    author_avatar_url: persona?.avatar_url,
                    author_role: persona?.role,
                    town_name: persona?.primary_town
                }, 'market');
            });
            const dbData = (data || []).map(item => normalizeContentItem(item, 'market'));
            return [...loreItems, ...dbData];
        } catch (error) {
            logger.error('[SupabaseService] Error in getUserMarketItems:', error);
            return [];
        }
    }, async getEntityMarketItems(entityId, isPlayground = false) {
        try {
            // Support for virtual entities in the market (Lore injection)
            const { MOCK_MARKET_ITEMS } = await import('../../data');
            const virtualItems = MOCK_MARKET_ITEMS.filter(item => item.author_entity_id === entityId || item.entity_id === entityId);

            let query = supabase
                .from('market_items')
                .select('uuid, title, description, price, category_slug, created_at, image_url, author_user_id, is_playground, is_active')
                .eq('author_entity_id', entityId);

            if (isPlayground) query = query.eq('is_playground', true);
            else query = query.or('is_playground.is.null,is_playground.eq.false');

            const { data, error } = await query.order('created_at', { ascending: false });
            if (error && virtualItems.length === 0) throw error;

            const dbData = (data || []).map(item => normalizeContentItem(item, 'market'));
            return [...virtualItems, ...dbData].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        } catch (error) {
            logger.error('[SupabaseService] Error in getEntityMarketItems:', error);
            return [];
        }
    },


    async getLexiconTerms() {
        try {
            const { data, error } = await supabase
                .from('lexicon')
                .select('*')
                .order('term', { ascending: true });
            if (error) throw error;
            return data;
        } catch (error) {
            logger.error('[SupabaseService] Error in getLexiconTerms:', error);
            return [];
        }
    },

    async getDailyWord() {
        try {
            const { data, error } = await supabase
                .from('lexicon')
                .select('*');

            if (error) throw error;
            if (!data || data.length === 0) return null;

            const randomIndex = Math.floor(Math.random() * data.length);
            return data[randomIndex];
        } catch (error) {
            logger.error('[SupabaseService] Error in getDailyWord:', error);
            return null;
        }
    },


    async createLexiconEntry(entryData) {
        const { data, error } = await supabase
            .from('lexicon')
            .insert([entryData])
            .select();
        if (error) {
            logger.error('[SupabaseService] Error creating lexicon entry:', error);
            throw error;
        }
        return data[0];
    },

    // Herramientas de Control de Almacenamiento (Auditoría)
    async getStorageStats() {
        try {
            const bucket = 'chat_attachments';
            const { data, error } = await supabase.storage.from(bucket).list('', { recursive: true });

            if (error) throw error;

            // Supabase list() returns metadata including size in bytes
            const totalBytes = data.reduce((acc, file) => acc + (file.metadata?.size || 0), 0);
            const totalMB = (totalBytes / (1024 * 1024)).toFixed(2);

            return {
                count: data.length,
                totalBytes,
                totalMB,
                limitMB: 1024, // Supabase Free Tier: 1GB
                percentage: ((totalBytes / (1024 * 1024 * 1024)) * 100).toFixed(2)
            };
        } catch (err) {
            logger.error('[SupabaseService] Error getting storage stats:', err);
            return null;
        }
    },

    // Subida de imágenes de perfil y portada
    // --- Media Deduplication & Upload Helpers ---

    /**
     * Internal helper to process a media upload with deduplication.
     * Checks hash first, then uploads if necessary, and finally registers usage.
     */
    async processMediaUpload(userId, file, bucket, context, isPublic = true, parentId = null) {
        let processedFile = file;

        // 0. Compress image if it's an image and too large (>500KB)
        if (file.type.startsWith('image/') && file.size > 100 * 1024) {
            try {
                const imageCompression = (await import('browser-image-compression')).default;
                
                // [CRITICAL FIX] BANDWIDTH LEAK
                const isAvatar = context === 'avatar';
                const configuredMaxMB = isAvatar ? 0.08 : 1; 
                const configuredMaxWidth = isAvatar ? 400 : 1920;

                processedFile = await imageCompression(file, {
                    maxSizeMB: configuredMaxMB,
                    maxWidthOrHeight: configuredMaxWidth,
                    useWebWorker: true,
                    fileType: file.type
                });
            } catch (err) {
                logger.error('[SupabaseService] Error compressing image:', err);
            }
        }

        const calculateFileHash = async (f) => {
            const buffer = await f.arrayBuffer();
            const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        };
        const hash = await calculateFileHash(processedFile);

        // 1. Check if asset already exists
        const existingAsset = await this.getMediaAssetByHash(hash);

        if (existingAsset) {
            // Already exists! Just register usage
            await this.registerMediaUsage(existingAsset.id, userId, context, isPublic);
            return { url: existingAsset.url, deduplicated: true, asset: existingAsset };
        }

        // 2. No duplicate, perform actual upload
        const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
        const filePath = `${userId}/${context}_${fileName}`;

        const { error: uploadError, data: _data } = await supabase.storage
            .from(bucket)
            .upload(filePath, processedFile, {
                cacheControl: '3600',
                upsert: true
            });

        if (uploadError) {
            const isPlayground = localStorage.getItem('isPlaygroundMode') === 'true' || userId?.startsWith('11111111-');
            if (isPlayground && (uploadError.code === '42501' || uploadError.status === 400 || uploadError.status === 401 || uploadError.status === 403)) {
                logger.warn(`[SupabaseService] 🛡️ RLS Bypass [${context}]: Creant URL local per a Playground.`);
                const localUrl = URL.createObjectURL(processedFile);
                return { url: localUrl, deduplicated: false, asset: { id: `mock-asset-${Date.now()}`, url: localUrl } };
            }
            throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath);

        const newAsset = await this.createMediaAsset({
            hash,
            url: publicUrl,
            mime_type: processedFile.type,
            size_bytes: processedFile.size,
            parent_id: parentId
        });

        // 4. Register usage
        await this.registerMediaUsage(newAsset.id, userId, context, isPublic);

        return { url: publicUrl, deduplicated: false, asset: newAsset };
    },

    async uploadAvatar(userId, file) {
        const result = await this.processMediaUpload(userId, file, 'profiles', 'avatar', true);
        await this.updateProfile(userId, { avatar_url: result.url });
        return { ...(await this.getProfile(userId)), _deduplicated: result.deduplicated };
    },

    async uploadCover(userId, file) {
        const result = await this.processMediaUpload(userId, file, 'profiles', 'cover', true);
        await this.updateProfile(userId, { cover_url: result.url });
        return { ...(await this.getProfile(userId)), _deduplicated: result.deduplicated };
    },

    async uploadChatAttachment(file, conversationId, userId) {
        const result = await this.processMediaUpload(userId, file, 'chat_attachments', 'chat', true);
        return result.url;
    },

    // --- Media Deduplication System ---

    async getMediaAssetByUrl(url) {
        const { data, error } = await supabase
            .from('media_assets')
            .select('*')
            .eq('url', url)
            .maybeSingle();

        if (error) throw error;
        return data;
    },

    async getUserMediaAssets(userId) {
        const { data, error } = await supabase
            .from('media_usage')
            .select(`
                asset_id,
                context,
                media_assets (*)
            `)
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        const assets = [];
        const seenIds = new Set();
        const seenHashes = new Set();

        const hasPrimarySource = data?.some(u =>
            ['raw', 'post', 'chat', 'direct', 'item'].includes(u.context)
        );

        data?.forEach(usage => {
            const asset = usage.media_assets;
            const context = usage.context;

            if (asset && !seenIds.has(asset.id)) {
                // 1. Never show crops with parents
                if (asset.parent_id) return;

                // 2. Exact file deduplication (legacy support)
                if (seenHashes.has(asset.hash)) return;

                // 3. Hide automated contexts if original source exists
                const isAutomated = context === 'avatar' || context === 'cover';
                if (hasPrimarySource && isAutomated) return;

                if (asset.mime_type?.startsWith('image/')) {
                    assets.push(asset);
                    seenIds.add(asset.id);
                    seenHashes.add(asset.hash);
                }
            }
        });

        return assets;
    },

    async getMediaAssetByHash(hash) {
        const { data, error } = await supabase
            .from('media_assets')
            .select('*')
            .eq('hash', hash)
            .maybeSingle();

        if (error) throw error;
        return data;
    },

    /**
     * Finds and removes media assets that are no longer referenced in media_usage.
     * This is a "blindage" feature to keep storage clean.
     */
    async cleanupOrphanedAssets() {
        try {
            // Find assets NOT present in media_usage
            const { data: orphans, error } = await supabase.rpc('get_orphaned_assets');

            // If RPC is not available, we use a slower query-based approach
            let targetOrphans = orphans;
            if (error) {
                const { data: qOrphans, error: qError } = await supabase
                    .from('media_assets')
                    .select('id, url')
                    .not('id', 'in', supabase.from('media_usage').select('asset_id'));
                if (qError) throw qError;
                targetOrphans = qOrphans;
            }

            if (!targetOrphans || targetOrphans.length === 0) return { count: 0 };

            let deletedCount = 0;
            for (const asset of targetOrphans) {
                // Delete from DB (Storage deletion should be handled by a DB trigger or separate process for safety)
                const { error: delError } = await supabase
                    .from('media_assets')
                    .delete()
                    .eq('id', asset.id);

                if (!delError) deletedCount++;
            }

            return { count: deletedCount };
        } catch (err) {
            logger.error('[SupabaseService] Error in cleanupOrphanedAssets:', err);
            return { count: 0, error: err };
        }
    },

    async getParentAsset(assetId) {
        const { data: asset, error: assetError } = await supabase
            .from('media_assets')
            .select('parent_id')
            .eq('id', assetId)
            .limit(1)
            .maybeSingle();

        if (assetError || !asset.parent_id) return null;

        const { data: parent, error: parentError } = await supabase
            .from('media_assets')
            .select('*')
            .eq('id', asset.parent_id)
            .limit(1)
            .maybeSingle();

        if (parentError) throw parentError;
        return parent;
    },

    async createMediaAsset(assetData) {
        const { data, error } = await supabase
            .from('media_assets')
            .insert(assetData)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async registerMediaUsage(assetId, userId, context, isPublic = true) {
        const { data, error } = await supabase
            .from('media_usage')
            .insert({
                asset_id: assetId,
                user_id: userId,
                context,
                is_public: isPublic
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async getMediaAttribution(assetId) {
        const { data, error } = await supabase
            .from('media_attribution')
            .select('*')
            .eq('asset_id', assetId);

        if (error) throw error;
        return data;
    },

    async getUserMedia(userId, isPlayground = false) {
        let query = supabase
            .from('media_usage')
            .select(`
                *,
                asset:media_assets(*)
            `)
            .eq('user_id', userId);

        if (isPlayground) {
            // Also include media associated with common demo IDs to feel more "filled"
            // but focused on the current character's simulated activity
            // query = query.or(...) // Future expansion: aggregate common persona assets
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    async getGlobalMedia() {
        // [MASTER ASSET HUB] Fetch all media with uploader info
        // Note: Using !user_id as hint if PostgREST cannot find the implicit relationship
        const { data, error } = await supabase
            .from('media_usage')
            .select(`
                *,
                asset:media_assets(*),
                user:profiles!user_id(id, full_name, avatar_url)
            `)
            .order('created_at', { ascending: false });

        if (error) {
            logger.warn('[SupabaseService] Error in primary getGlobalMedia join, attempting robust fallback:', error);
            
            // SECOND ATTEMPT: Try without the profiles join (which sometimes fails if hinted incorrectly)
            const { data: q2Data, error: q2Error } = await supabase
                .from('media_usage')
                .select(`
                    *,
                    media_assets(*)
                `)
                .order('created_at', { ascending: false });

            if (q2Error) {
                logger.error('[SupabaseService] Critical failure in media_usage query:', q2Error);
                // FINAL FALLBACK: Raw media_usage and manual hydration (Maximum Resilience)
                const { data: rawData, error: rawError } = await supabase
                    .from('media_usage')
                    .select('*')
                    .order('created_at', { ascending: false });
                    
                if (rawError) throw rawError;
                
                // Hydrate assets
                const assetIds = [...new Set(rawData.map(d => d.asset_id))].filter(Boolean);
                const { data: assets } = await supabase.from('media_assets').select('*').in('id', assetIds);
                
                // Hydrate users
                const userIds = [...new Set(rawData.map(d => d.user_id))].filter(Boolean);
                const { data: profiles } = await supabase.from('profiles').select('id, full_name, avatar_url').in('id', userIds);
                
                return rawData.map(item => ({
                    ...item,
                    asset: assets?.find(a => a.id === item.asset_id),
                    user: profiles?.find(p => p.id === item.user_id)
                }));
            }

            // Normal retry logic for Q2: Manual profile hydration
            const userIds = [...new Set(q2Data.map(d => d.user_id))].filter(Boolean);
            const { data: profiles } = await supabase
                .from('profiles')
                .select('id, full_name, avatar_url')
                .in('id', userIds);

            return q2Data.map(item => ({
                ...item,
                asset: item.media_assets, // Handle fallback field name
                user: profiles?.find(p => p.id === item.user_id)
            }));
        }
        return data;
    },

    // --- Voice Messages ---

    async uploadVoiceMessage(audioBlob, duration, userId) {
        // Upload logic: user_id / conversation_id (optional) / timestamp
        const timestamp = Date.now();
        const fileName = `${userId}/${timestamp}.webm`;

        const { data: _data, error: uploadError } = await supabase.storage
            .from('voice-messages')
            .upload(fileName, audioBlob, {
                cacheControl: '3600',
                upsert: false
            });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
            .from('voice-messages')
            .getPublicUrl(fileName);

        return { url: publicUrl, path: fileName };
    },

    async sendVoiceMessage(conversationId, senderId, audioBlob, duration, waveform) {
        try {
            // 1. Upload
            const { url } = await this.uploadVoiceMessage(audioBlob, duration, senderId);

            // 2. Send Message (using generic secure message flow)
            // We use 'voice' as attachment type
            const messageData = {
                conversationId,
                senderId,
                content: '🎵 Missatge de veu',
                attachmentUrl: url,
                attachmentType: 'voice',
                attachmentName: duration.toString() // Store duration in name for quick access
            };

            const message = await this.sendSecureMessage(messageData);

            // 3. Store rich metadata (waveform) in separate table
            const { error: metaError } = await supabase
                .from('voice_messages')
                .insert({
                    message_id: message.id,
                    duration_seconds: Math.round(duration),
                    waveform_data: waveform
                });

            if (metaError) {
                logger.error('[SupabaseService] Error saving voice metadata (waveform):', metaError);
                // Continue, as the message itself is sent and playable (metadata is progressive enhancement)
            }

            return { ...message, voice_meta: { duration, waveform } };
        } catch (error) {
            logger.error('[SupabaseService] Error sending voice message:', error);
            throw error;
        }
    },

    /**
     * Purges all ephemeral data generated during a playground session.
     */
    async cleanupPlaygroundSession(userId) {
        if (!userId) return;
        logger.log(`[SupabaseService] Starting cleanup for user ${userId}...`);

        try {
            // 1. Delete posts
            const { error: postError } = await supabase
                .from('posts')
                .delete()
                .eq('author_id', userId)
                .eq('is_playground', true);
            if (postError) logger.error('Error cleaning posts:', postError);

            // 2. Delete market items
            const { error: marketError } = await supabase
                .from('market_items')
                .delete()
                .eq('author_id', userId)
                .eq('is_playground', true);
            if (marketError) logger.error('Error cleaning market items:', marketError);

            // 3. Mark playground messages or delete
            // Note: messages might not have is_playground column, but they belong to playground conversations
            // This is a simplified version, more robust would be deleting by conversation_id

            // 4. Cleanup storage references and files
            // This requires listing from media_usage with a hypothetical 'is_temporary' flag 
            // or by checking the created_at vs session start.

            logger.log(`[SupabaseService] Cleanup finished for ${userId}`);
            return true;
        } catch (err) {
            logger.error('[SupabaseService] Critical error in cleanup:', err);
            return false;
        }
    },

    async getPublicStats() {
        try {
            const [profiles, entities, posts, towns] = await Promise.all([
                supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('is_demo', false),
                supabase.from('entities').select('*', { count: 'exact', head: true }),
                supabase.from('posts').select('*', { count: 'exact', head: true }),
                supabase.from('towns').select('*', { count: 'exact', head: true })
            ]);

            return {
                users: profiles.count || 0,
                entities: entities.count || 0,
                posts: posts.count || 12, // Fallback for visual balance if empty
                towns: towns.count || 0
            };
        } catch (error) {
            logger.error('[SupabaseService] Error fetching stats:', error);
            return { users: 24, entities: 5, posts: 153, towns: 3 }; // Fallback values
        }
    },

    /**
     * Obté una publicació específica per ID [MASTER]
     */
    async getPostById(postId) {
        try {
            const { data, error } = await supabase
                .from('posts_universal_view')
                .select('*, profiles(*), towns(*)')
                .eq('id', postId)
                .limit(1)
                .maybeSingle();

            if (error) throw error;
            return data;
        } catch (err) {
            logger.error(`[SupabaseService] Error fetching post ${postId}:`, err);
            return null;
        }
    },

    /**
     * [PILLAR 3: Rèplica Representant] - Sincronització de xlogs
     */
    async upsertXLogs(userId, xlogs) {
        try {
            // En un entorn real, açò usaria una taula 'account_logs' amb RLS
            logger.log(`[SupabaseService] Sincronitzant ${xlogs.length} xlogs per a l'usuari ${userId}`);
            const { error } = await supabase
                .from('account_logs')
                .upsert(xlogs.map(log => ({ ...log, user_id: userId })), { onConflict: 'id' });

            return { error };
        } catch (err) {
            logger.error('[SupabaseService] Error en upsertXLogs:', err);
            return { error: err };
        }
    },

    /**
     * [PILLAR 3+: Contracte Social] - Crea petició de recuperació.
     */
    async createRecoveryRequest(request) {
        try {
            logger.log(`[SupabaseService] Petició de recuperació bategada per a: ${request.user_id}`);
            // Simulem l'escriptura a una taula 'recovery_requests' via upsert
            const { error } = await supabase
                .from('recovery_requests')
                .upsert([request], { onConflict: 'user_id' });
            return { error };
        } catch (err) {
            logger.error('[SupabaseService] Error en createRecoveryRequest:', err);
            return { error: err };
        }
    },

    /**
     * [PILLAR 3+: Contracte Social] - Signatura de petició.
     */
    async signRecoveryRequest(userId, padrinId) {
        try {
            // En un sistema real, açò incrementaria signatures a la taula 'recovery_requests'
            logger.log(`[SupabaseService] Padrí ${padrinId} signant per a ${userId}`);
            return { success: true };
        } catch (err) {
            logger.error('[SupabaseService] Error en signRecoveryRequest:', err);
            return { error: err };
        }
    },

    /**
     * Obté les entitats (identitats) gestionades per l'usuari actual.
     */
    async getMyEntities() {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return [];

            const { data, error } = await supabase
                .from('entities')
                .select('*')
                .eq('owner_id', user.id);

            if (error) throw error;
            return data;
        } catch (err) {
            logger.error('[SupabaseService] Error en getMyEntities:', err);
            return [];
        }
    },

    /**
     * [Protocol OMEGA: Dumb Pipe]
     * Puja un blob binari opac al relay sense coneixement semàntic.
     */
    async uploadOpaqueBlob(path, packageData) {
        try {
            logger.log(`[SupabaseService] Pujant blob opac a: ${path}`);
            const { error } = await supabase
                .from('opaque_relays')
                .upsert([{ 
                    path, 
                    payload: packageData.payload, 
                    v: packageData.v,
                    updated_at: new Date().toISOString()
                }]);
            return { error };
        } catch (err) {
            logger.error('[SupabaseService] Error pujant blob opac:', err);
            return { error: err };
        }
    },

    /**
     * [CRDT SYNC ENGINE]
     * Robust implementation of offline-first synchronisation
     */
    async syncCRDTs(localDocs) {
        try {
            logger.info('[SupabaseService] Starting CRDT Sync...');
            // In a real scenario, this merges Automerge documents
            const { data, error } = await supabase.rpc('sync_crdt_docs', { docs: localDocs });
            if (error) throw error;
            return data;
        } catch (e) {
            logger.warn('[SupabaseService] Network error during CRDT sync. Saving to IDB queue.');
            // Fallback to IndexedDB queue via idb-keyval
            const queue = await get('crdt_sync_queue') || [];
            await set('crdt_sync_queue', [...queue, ...localDocs]);
            return null;
        }
    }
};

```

**Ara sí, amb tot el codi de la UI, la fortificació de seguretat i el servei sencer (part 1 i 2), dona'm el teu vistiplau definitiu!**
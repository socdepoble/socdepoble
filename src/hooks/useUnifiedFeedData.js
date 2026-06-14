import { useState, useEffect, useMemo } from 'react';
import { useFeedData } from './useFeedData';
import { MOCK_EVENTS, MOCK_MARKET_ITEMS } from '../data';
import { logger } from '../utils/logger';
import { marketService } from '../core/services/marketService';
import { AGENTS_MAP } from '../app/config/agentsMap';
const getDeterministicDate = idStr => {
  let hash = 0;
  const str = String(idStr || Math.random());
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  // Repartir en un abanico de 40 días (Marzo y principios de Abril 2026)
  const daysOffset = Math.abs(hash) % 40;
  const baseDate = new Date('2026-04-06T12:00:00Z');
  baseDate.setDate(baseDate.getDate() - daysOffset);
  return baseDate.toISOString();
};
const safeIsoString = (dateStr, idStr) => {
  if (!dateStr) return getDeterministicDate(idStr);
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) {
    return getDeterministicDate(idStr);
  }
  return d.toISOString();
};
export const useUnifiedFeedData = ({
  activeTown,
  townName,
  isPlayground,
  user,
  iaiaLevel
}) => {
  // 1. Fetch Posts natively (using PowerSync via useFeedData)
  const {
    posts: feedPosts,
    loading: feedLoading
  } = useFeedData({
    activeTown,
    townName,
    isPlayground,
    user,
    iaiaLevel,
    selectedRole: 'tot'
  });
  const [marketItems, setMarketItems] = useState([]);
  const [marketLoading, setMarketLoading] = useState(true);

  // 2. Fetch Market Items from REST API
  useEffect(() => {
    const fetchMarket = async () => {
      try {
        const {
          data
        } = await marketService.getMarketItems({
          page: 0,
          limit: 100,
          // Load a broad spectrum for the unified dashboard
          categorySlug: 'tot'
        });
        const fetchedItems = data || [];
        const fetchedIds = new Set(fetchedItems.map(i => i.id));
        const uniqueMocks = MOCK_MARKET_ITEMS.filter(m => !fetchedIds.has(m.id));
        setMarketItems([...uniqueMocks, ...fetchedItems]);
      } catch (err) {
        logger.error('[UnifiedFeed] Error loading market items:', err);
        // Fallback to mocks if offline
        setMarketItems([...MOCK_MARKET_ITEMS]);
      } finally {
        setMarketLoading(false);
      }
    };
    fetchMarket();
  }, []);

  // 3. Format Mock Events to fit UniversalCard
  const formattedEvents = useMemo(() => {
    return MOCK_EVENTS.map(event => {
      const evId = event.id || `event-${Math.random()}`;
      return {
        ...event,
        uuid: evId,
        type: 'event_announcement',
        created_at: safeIsoString(event.date, evId),
        author_name: event.organizer || 'L\'Ajuntament',
        content: event.description,
        // Ensure visual consistency for UniversalCard defaults
        image_url: event.image ? [event.image] : null,
        author_avatar: null
      };
    });
  }, []);

  // 4. Merge & Sort Chronologically
  const unifiedPosts = useMemo(() => {
    const projectCardPost = {
      id: 'static-project-card',
      uuid: 'static-project-card',
      type: 'page',
      slug: 'el-projecte',
      title: "El Projecte",
      subtitle: "Què és \"Sóc de Poble\"?",
      content: "Més que una aplicació, és una **declaració d'independència digital**. Una eina construïda per durar, per funcionar sempre i per tornar-nos el control de la nostra comunicació i els nostres negocis, sense dependre de les grans tecnològiques.",
      tags: ["Sóc de Poble", "Projecte"],
      author: "Sóc de Poble",
      author_name: "Sóc de Poble",
      author_type: "empresa",
      author_slug: "soc-de-poble",
      author_avatar: "/assets/system/ui/logo-socdepoble-cuadrat-verd.svg",
      author_role: "Portal Oficial",
      is_official: true,
      is_pinned: true,
      pinned_position: 2,
      created_at: new Date().toISOString(),
      image_url: "/assets/uploads/empresa/soc-de-poble/posts/el-projecte/exemple-de-poble-001.png",
      town_name: "La Torre de les Maçanes",
      town_uuid: "201"
    };
    const allItems = [projectCardPost, ...feedPosts.map(p => {
      let enhancedPost = {
        ...p,
        created_at: safeIsoString(p.created_at, p.id || p.uuid)
      };

      // Recover AI ecosystem cards attribution
      if (p.author_user_id && String(p.author_user_id).startsWith('11111111-')) {
        const agent = Object.values(AGENTS_MAP).find(a => String(a.id) === String(p.author_user_id));
        if (agent) {
          enhancedPost.author_avatar = agent.avatar_url;
          enhancedPost.author_name = agent.name;
          enhancedPost.author_role = 'master';
          enhancedPost.is_iaia_inspired = true;
        }
      }
      return enhancedPost;
    }), ...marketItems.map(m => {
      const isSamarreta = String(m.id).includes('samarreta-soc-de-poble');
      return {
        ...m,
        type: 'mercat',
        uuid: m.id,
        is_pinned: isSamarreta ? true : m.is_pinned || m.pinned,
        pinned_position: isSamarreta ? 1 : m.pinned_position,
        created_at: safeIsoString(m.created_at, m.id),
        ...(isSamarreta ? {
          town_name: "La Torre de les Maçanes",
          town_uuid: "201",
          author_name: "Sóc de Poble",
          author_slug: "soc-de-poble",
          author_type: "empresa"
        } : {})
      };
    }), ...formattedEvents];

    // Deduplicate before sorting (force String key to merge UUID 301 and "301" smoothly)
    const uniqueItems = Array.from(new Map(allItems.map(item => [String(item.uuid || item.id), item])).values());
    return uniqueItems.sort((a, b) => {
      // Pineado siempre sale delante
      if (a.is_pinned && !b.is_pinned) return -1;
      if (!a.is_pinned && b.is_pinned) return 1;
      if (a.is_pinned && b.is_pinned) {
        const posA = a.pinned_position || Number.MAX_SAFE_INTEGER;
        const posB = b.pinned_position || Number.MAX_SAFE_INTEGER;
        if (posA !== posB) return posA - posB;
      }
      const dateA = new Date(a.created_at || 0).getTime();
      const dateB = new Date(b.created_at || 0).getTime();
      return dateB - dateA; // Descending (newest first)
    });
  }, [feedPosts, marketItems, formattedEvents]);
  return {
    posts: unifiedPosts,
    loading: feedLoading || marketLoading,
    hasMore: false // Mapat complet a la memòria pel moment
  };
};
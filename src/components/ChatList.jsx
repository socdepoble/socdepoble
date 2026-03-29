import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Search,
  Globe,
  Moon,
  Sun,
  Bell,
  MoreVertical,
  MapPin,
  Menu,
  Plus,
  MessageSquare,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Avatar from "./Avatar";
import TownSelectorModal from "./TownSelectorModal";
import { useDesign } from '../context/DesignContext';
import { useNavigation } from '../context/NavigationContext';
import { AGENTS } from "../constants/agents";
import "./ChatList.css";
import { useTranslation } from "react-i18next";
import { chatService } from '../services/chatService';

// SOCIAL GRAPH MOCK DATA
const STATIC_AVATARS = {
  'Joanet Serra': '/assets/avatars/comic/joanet_serra_comic.png',
  'Carmen la del Forn': '/assets/avatars/comic/carmen_forn_comic.png',
  'Andreu Soler': '/assets/avatars/comic/andreu_soler_comic.png',
  'Carla Soriano': '/assets/avatars/comic/carla_soriano_comic.png',
  'Elena Popova': '/assets/avatars/comic/elena_popova_comic.png',
  'Beatriz Ortega': '/assets/avatars/comic/beatriz_ortega_comic.png',
  'Joan Batiste': '/assets/avatars/comic/joan_batiste_comic.png',
  'Vicent Ferris': '/assets/avatars/comic/vicent_ferris_comic.png',
  'El Viatjant': '/assets/avatars/comic/avatar_samir_comic.png',
  'Mixa': '/assets/avatars/comic/mixa_comic.png'
};

const GENT_DATA = AGENTS.filter(a => a.tag === 'GENT');
const GRUPS_DATA = [
  { id: 'grup-1', name: 'Comissió de Festes 2024', role: 'Grup Local', avatar_url: '/assets/avatars/comic/avatar_mariamel_comic.png', members: '142 membres', tag: 'COL·LECTIU' },
  { id: 'grup-2', name: 'Sindicat de Regants', role: 'Gestió Aigua', avatar_url: '/assets/avatars/comic/vicent_ferris_comic.png', members: '86 membres', tag: 'COL·LECTIU' },
  { id: 'grup-3', name: 'Grup de Muntanya', role: 'Esports', avatar_url: '/assets/avatars/comic/avatar_samir_comic.png', members: '34 membres', tag: 'COL·LECTIU' },
  { id: 'grup-4', name: 'Banda de Música', role: 'Cultura', avatar_url: '/assets/avatars/comic/avatar_mariamel_comic.png', members: '60 membres', tag: 'COL·LECTIU' }
];
const EMPRESES_DATA = [
  { id: 'emp-1', name: 'El Rentonar Cooperativa', role: 'Agricultura Sostenible', avatar_url: '/assets/avatars/comic/vicent_ferris_comic.png', desc: 'Productes KM0', tag: 'EMPRESA' },
  { id: 'emp-2', name: 'Forn de Dalt', role: 'Forn i Pastisseria', avatar_url: '/assets/avatars/comic/carmen_forn_comic.png', desc: 'Obert des del 1940', tag: 'EMPRESA' },
  { id: 'emp-3', name: 'Cooperativa Agrícola', role: 'Sector Primari', avatar_url: '/assets/avatars/comic/andreu_soler_comic.png', desc: 'Venda a l\'engròs', tag: 'EMPRESA' },
  { id: 'emp-4', name: 'Bar del Poble', role: 'Restauració', avatar_url: '/assets/avatars/comic/avatar_marc_comic.png', desc: 'L\'esmorzar de sempre', tag: 'EMPRESA' }
];
const INSTITUCIONS_DATA = [
  { id: 'inst-1', name: "Simulació de l'Ajuntament", role: 'Administració Local', avatar_url: '/assets/avatars/comic/nano_ajuntament_comic.png', desc: 'Tràmits i avisos', tag: 'ADMIN' },
  { id: 'inst-2', name: "Simulació de l'Escola", role: 'Educació', avatar_url: '/assets/avatars/comic/nano_escola_comic.png', desc: 'CEIP El Mas', tag: 'ADMIN' },
  { id: 'inst-3', name: 'Simulació Centre de Salut', role: 'Sanitat', avatar_url: '/assets/avatars/comic/nano_salut_comic.png', desc: 'Atenció primària', tag: 'ADMIN' }
];

const ChatList = () => {
  const { iaiaLevel } = useDesign();
    const { enabledAgentIds } = useNavigation();
    const { user, isSuperAdmin } = useAuth();
  const { visionMode } = useDesign();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [chats, setChats] = useState([]);
  const [isTownModalOpen, setIsTownModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const currentTab = new URLSearchParams(location.search).get('tab') || 'xat';

  useEffect(() => {
    const fetchChats = async () => {
      if (!user?.id) return;
      try {
        const dbConvs = await chatService.getConversations(user.id);
        
        // [HEALING PROTOCOL] Reparem converses de BD antigues que han perdut l'avatar o l'ID de l'agent
        let hybridChats = (dbConvs || []).map(chat => {
            const otherId = chat.participant_1_id === user?.id ? chat.participant_2_id : chat.participant_1_id;
            const otherInfo = chat.participant_1_id === user?.id ? chat.p2_info : chat.p1_info;
            const actualName = chat.other_info?.name || otherInfo?.name;
            const actualId = chat.other_info?.id || otherId;

            const agentMatch = AGENTS.find(a => 
                a.id === actualId || 
                a.name === actualName
            );
            
            if (agentMatch) {
                return {
                    ...chat,
                    other_info: {
                        ...chat.other_info,
                        id: agentMatch.id, // Forcem l'ID canònic perquè no es dupliqui
                        name: agentMatch.name,
                        avatar_url: agentMatch.avatar_url, // Forcem l'avatar local
                        role: agentMatch.role
                    },
                    tag: agentMatch.tag
                };
            } else if (actualName && STATIC_AVATARS[actualName]) {
                return {
                    ...chat,
                    other_info: {
                        ...chat.other_info,
                        ...otherInfo,
                        name: actualName,
                        avatar_url: STATIC_AVATARS[actualName]
                    }
                };
            }
            return chat;
        });

        // [XAT/GENT] Protocol de Visió Granular (v10.33.20)
        // 0: Humana (Sense agents, cap ni un)
        // 1: IAIA (Només la IAIA MarIA bategant)
        // 2: Immersiva (O2) (IAIA + Els escollits manualment a l'espai granular)
        // 3: Creativa (Tots els 15 especialistes visibles, Mode Treball)

        AGENTS.forEach((agent) => {
          let isVisible = false;

          // Evaluació en base al IAIALevel designat
          if (iaiaLevel === 0) {
              isVisible = false; 
          } else if (iaiaLevel === 1) {
              isVisible = agent.id === '11111111-1a1a-0000-0000-000000000000'; // Sols MarIA
          } else if (iaiaLevel === 2) {
              // Si iaiaLevel és buit o null, cau ací com fallback per defecte segons el Context
              isVisible = agent.id === '11111111-1a1a-0000-0000-000000000000' || enabledAgentIds.includes(agent.id);
          } else if (iaiaLevel === 3) {
              isVisible = true; // Tot obert
          }

          if (
            isVisible && 
            !hybridChats.find(
              (c) => c.id === agent.id || c.other_info?.id === agent.id,
            )
          ) {
            hybridChats.push({
              id: agent.id,
              other_info: {
                id: agent.id,
                name: agent.name,
                avatar_url: agent.avatar_url,
                role: agent.role,
              },
              last_message_content: agent.last_message_content,
              last_message_time: agent.last_message_time,
              tag: agent.tag,
            });
          }
        });

        setChats(hybridChats);
      } catch (err) {
        if (import.meta.env.DEV) {
          console.error("[ChatList] Error fetching chats:", err);
        }

        // Fallback a tots els 15 agents de manera blindada
        // Fallback als agents permesos per la visió actual (Blindat contra errors de xarxa)
        const fallbackAgents = AGENTS.filter(agent => {
            if (iaiaLevel === 0) return false;
            if (iaiaLevel === 1) return agent.id === '11111111-1a1a-0000-0000-000000000000';
            if (iaiaLevel === 2) return agent.id === '11111111-1a1a-0000-0000-000000000000' || enabledAgentIds.includes(agent.id);
            return true;
        });

        setChats(
          fallbackAgents.map((a) => ({
            id: a.id,
            other_info: {
              name: a.name,
              avatar_url: a.avatar_url,
              role: a.role,
            },
            last_message_content: a.last_message_content,
            last_message_time: a.last_message_time,
            tag: a.tag,
          })),
        );
      }
    };
    fetchChats();
    
    window.addEventListener('chat_updated', fetchChats);
    return () => {
        window.removeEventListener('chat_updated', fetchChats);
    };
  }, [
    user?.id,
    user?.email,
    user?.isAnonymous,
    iaiaLevel,
    enabledAgentIds,
    isSuperAdmin,
    visionMode,
  ]);

  const filteredChats = useMemo(() => {
    let sourceData = chats;
    
    // Si no estem al xat principal, retornem el graph inventat
    if (currentTab === 'gent') {
        sourceData = GENT_DATA.map(a => ({ id: a.id, other_info: { name: a.name, role: a.role, avatar_url: a.avatar_url }, last_message_content: 'Membre de la comunitat', tag: a.tag }));
    } else if (currentTab === 'grups') {
        sourceData = GRUPS_DATA.map(a => ({ id: a.id, other_info: { name: a.name, role: a.role, avatar_url: a.avatar_url }, last_message_content: a.members, tag: a.tag }));
    } else if (currentTab === 'empreses') {
        sourceData = EMPRESES_DATA.map(a => ({ id: a.id, other_info: { name: a.name, role: a.role, avatar_url: a.avatar_url }, last_message_content: a.desc, tag: a.tag }));
    } else if (currentTab === 'institucions') {
        sourceData = INSTITUCIONS_DATA.map(a => ({ id: a.id, other_info: { name: a.name, role: a.role, avatar_url: a.avatar_url }, last_message_content: a.desc, tag: a.tag }));
    } else {
        // [PROTOCOL JERARQUIA] IAIA MarIA al cim, seguida de TOTS ELS NATIUS IA, i per últim els NPCs estàtics.
        sourceData = [...chats].sort((a, b) => {
            const IAIA_ID = '11111111-1a1a-0000-0000-000000000000';
            const idA = a.id || a.other_info?.id;
            const idB = b.id || b.other_info?.id;
            
            const isIAIA_A = idA === IAIA_ID;
            const isIAIA_B = idB === IAIA_ID;
            
            if (isIAIA_A && !isIAIA_B) return -1;
            if (!isIAIA_A && isIAIA_B) return 1;

            const isNativeA = idA?.startsWith('11111111-');
            const isNativeB = idB?.startsWith('11111111-');

            if (isNativeA && !isNativeB) return -1;
            if (!isNativeA && isNativeB) return 1;

            return 0; // Conservar ordre relatiu original per a la resta
        });
    }

    if (!searchTerm) return sourceData;
    const normalized = searchTerm.toLowerCase();
    return sourceData.filter(
      (chat) =>
        chat.other_info?.name?.toLowerCase().includes(normalized) ||
        chat.other_info?.role?.toLowerCase().includes(normalized) ||
        chat.last_message_content?.toLowerCase().includes(normalized),
    );
  }, [chats, searchTerm, currentTab]);

  const handleChatClick = (chat) => {
    navigate(`/chats/${chat.id}`, { state: { chatInfo: chat } });
  };

  const formatBategatDate = (date) => {
    if (!date) return { day: t("chat.now"), time: "" };
    const d = new Date(date);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = d.toDateString() === yesterday.toDateString();

    const timeStr = d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (isToday) return { day: t("chat.today"), time: timeStr };
    if (isYesterday) return { day: t("chat.yesterday"), time: timeStr };

    return {
      day: d.toLocaleDateString([], { day: "2-digit", month: "2-digit" }),
      time: timeStr,
    };
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-theme-base relative overflow-hidden h-full chat-list-container">
      {/* SCANLINES RETRO-FUTURISTES */}
      <div className="chat-list-scanlines" />

      {/* HEADER CANÒNIC (RESTAURAT I REFINAT) */}
      <header className="h-16 min-h-[64px] flex flex-col justify-center px-4 bg-[var(--theme-accent-primary)] border-b border-[var(--border-master)] relative z-10 shrink-0">
        <div className="relative group w-full">
          <Search
            size={22}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-main)] opacity-60 group-focus-within:opacity-100 transition-opacity"
          />
          <label htmlFor="chat-search-input" className="sr-only">{t("chat.search_aria")}</label>
          <input
            id="chat-search-input"
            name="chat_search"
            type="text"
            placeholder={t("chat.search_placeholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 bg-[var(--bg-master)] border border-[var(--border-master)] rounded-[28px] pl-12 pr-4 text-sm font-black text-[var(--text-main)] focus:outline-none focus:border-[var(--text-main)]/30 focus:bg-[var(--bg-master)] transition-all placeholder:text-[var(--text-muted)] shadow-inner shadow-black/5"
          />
        </div>
      </header>

      {/* LLISTA D'AGENTS */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-theme-base min-h-0">
        {filteredChats.length > 0 ? (
          filteredChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => handleChatClick(chat)}
              className={`flex items-center space-x-3 h-[80px] px-4 border-b border-[var(--border-master)] cursor-pointer transition-all relative
                        ${
                          location.pathname.includes(chat.id) ? "active bg-white/5" : ""
                        } chat-item hover:bg-[var(--bg-panel)]`}
            >
              {chat.tag && (
                <span className="absolute top-3 right-4 bg-[var(--theme-accent-primary)]/10 backdrop-blur-md text-[var(--theme-accent-primary)] text-[9px] px-2.5 py-1 rounded-full border border-[var(--theme-accent-primary)]/30 font-black tracking-[0.15em] uppercase shadow-sm leading-none z-10">
                  {chat.tag}
                </span>
              )}
              <div className="flex-shrink-0">
                <Avatar
                  src={chat.other_info?.avatar_url}
                  name={chat.other_info?.name}
                  role={chat.other_info?.role}
                  size={56}
                />
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-center ml-2">
                 <div className="flex justify-between items-center mb-[2px]">
                  <h4 className="text-lg font-black text-[var(--theme-accent-secondary)] m-0 truncate pr-20 block transition-colors flex-1 tracking-tight leading-tight drop-shadow-sm">
                    {chat.other_info?.name ||
                      (chat.participant_1_id === user?.id
                        ? chat.p2_info?.name
                        : chat.p1_info?.name) ||
                      "Sóc de Poble"}
                  </h4>
                </div>
                <div className="flex justify-between items-center gap-2">
                  <div 
                    className="text-[16px] truncate leading-none flex-1 font-medium"
                    style={{ color: 'var(--text-chat-snippet)' }}
                  >
                    {chat.last_message_content ||
                      t("chat.beating_with_socdepoble")}
                  </div>
                  <div className="flex flex-col items-end shrink-0 leading-none">
                    {currentTab === 'xat' && (() => {
                      const { day, time } = formatBategatDate(
                        chat.last_message_time,
                      );
                      return (
                        <div 
                          className="text-[14px] font-bold"
                          style={{ color: 'var(--text-chat-time)' }}
                        >
                          {time || day}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="h-full flex flex-col items-center justify-center opacity-20 p-12 text-center">
            <MessageSquare
              size={56}
              className="mb-6 text-[var(--theme-accent-primary)] mx-auto opacity-50"
            />
            <p className="text-[var(--text-main)] text-sm font-black uppercase tracking-[0.2em]">
              {t("chat.silence_total")}
            </p>
            <p className="text-gray-500 text-xs mt-2 uppercase tracking-widest">
              {t("chat.start_conversation_wall")}
            </p>
          </div>
        )}
      </div>

      <TownSelectorModal
        isOpen={isTownModalOpen}
        onClose={() => setIsTownModalOpen(false)}
        onSelect={(townId) => {
          navigate(`/pobles/${townId}`);
        }}
      />

      <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #333; border-radius: 99px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: var(--theme-accent-primary); }
            `}</style>
    </div>
  );
};

export default ChatList;

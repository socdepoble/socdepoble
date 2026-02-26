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
import { supabaseService } from "../services/supabaseService";
import Avatar from "./Avatar";
import TownSelectorModal from "./TownSelectorModal";
import { useDesign } from '../context/DesignContext';
import { useNavigation } from '../context/NavigationContext';
import ContextualHeader from "./ContextualHeader";
import { AGENTS, IAIA_MARIA_ID, LORE_AGENT_IDS } from "../constants/agents";
import "./ChatList.css";

const ChatList = () => {
  const { iaiaLevel } = useDesign();
    const { enabledAgentIds } = useNavigation();
    const { user, isSuperAdmin } = useAuth();
  const { visionMode } = useDesign();
  const location = useLocation();
  const navigate = useNavigate();

  const [chats, setChats] = useState([]);
  const [isTownModalOpen, setIsTownModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchChats = async () => {
      if (!user?.id) return;
      try {
        const dbConvs = await supabaseService.getConversations(user.id);
        // Injecció Híbrida: Combinem missatges reals amb l'equip d'Agents IAIA
        let hybridChats = [...(dbConvs || [])];

        // [XAT/GENT] Protocol de Visió Granular (v10.33.20)
        // 0: Humana (Sense agents)
        // 1: IAIA (Lore i Tradició)
        // Lògica simplificada: tots els agents es mostren per defecte

        const LORE_AGENTS_IDS = AGENTS.map((a) => a.id); // BLINDAT: Tots els 15 agents

        // Forcem que tots els 15 agents bateguen al panell, sense restriccions
        AGENTS.forEach((agent) => {
          if (
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
        const fallbackAgents = AGENTS;

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
    if (!searchTerm) return chats;
    const normalized = searchTerm.toLowerCase();
    return chats.filter(
      (chat) =>
        chat.other_info?.name?.toLowerCase().includes(normalized) ||
        chat.other_info?.role?.toLowerCase().includes(normalized) ||
        chat.last_message_content?.toLowerCase().includes(normalized),
    );
  }, [chats, searchTerm]);

  const handleChatClick = (chat) => {
    navigate(`/chats/${chat.id}`, { state: { chatInfo: chat } });
  };

  const formatBategatDate = (date) => {
    if (!date) return { day: "ARA", time: "" };
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

    if (isToday) return { day: "HUI", time: timeStr };
    if (isYesterday) return { day: "AHIR", time: timeStr };

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
          <label htmlFor="chat-search-input" className="sr-only">Cerca un xat</label>
          <input
            id="chat-search-input"
            name="chat_search"
            type="text"
            placeholder="CERCA UN XAT..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 bg-[var(--bg-master)] border border-[var(--border-master)] rounded-xl pl-12 pr-4 text-sm font-black text-[var(--text-main)] focus:outline-none focus:border-[var(--text-main)]/30 focus:bg-[var(--bg-master)] transition-all placeholder:text-[var(--text-muted)] uppercase tracking-widest shadow-inner shadow-black/5"
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
              className={`flex items-center space-x-3 h-[80px] px-4 border-b border-gray-800/20 cursor-pointer transition-all relative
                        ${
                          location.pathname.includes(chat.id) ? "active" : ""
                        } chat-item ${chat.tag === "IAIA" ? "iaia-agent" : ""}`}
            >
              {chat.tag && (
                <span className="absolute top-3 right-3 bg-theme-base text-[var(--theme-accent-primary)] text-[10px] px-2 py-1 rounded border border-[var(--theme-accent-primary)]/40 font-black tracking-wider uppercase shadow-md leading-none z-10">
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
                  <div className="font-bold text-[19px] text-[var(--theme-accent-primary)] truncate pr-16 group-hover:text-theme-text transition-colors flex-1 tracking-tight leading-tight">
                    {chat.other_info?.name ||
                      (chat.participant_2_id === user?.id
                        ? chat.p1_info?.name
                        : chat.p2_info?.name) ||
                      "Foraster"}
                  </div>
                </div>
                <div className="flex justify-between items-center gap-2">
                  <div className="text-[16px] text-theme-text truncate leading-none flex-1 opacity-80 font-medium">
                    {chat.last_message_content ||
                      "Bategant amb Sóc de Poble..."}
                  </div>
                  <div className="flex flex-col items-end shrink-0 leading-none">
                    {(() => {
                      const { day, time } = formatBategatDate(
                        chat.last_message_time,
                      );
                      return (
                        <div className="text-[14px] text-gray-500 font-bold">
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
            <p className="text-white text-sm font-black uppercase tracking-[0.2em]">
              Silence total.
            </p>
            <p className="text-gray-500 text-xs mt-2 uppercase tracking-widest">
              Inicia la conversa al mur
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

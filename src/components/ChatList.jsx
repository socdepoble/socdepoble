import React, { useState, useEffect, useMemo, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Search,
  MessageSquare,
  Settings,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Avatar from "./Avatar";
import TownSelectorModal from "./TownSelectorModal";
import { useDesign } from '../context/DesignContext';
import { useNavigation } from '../context/NavigationContext';
import { AGENTS } from "../constants/agents";
import "./ChatList.css";
import { useTranslation } from "react-i18next";
import { LocalFirstStatusContext } from '../context/LocalFirstStatusContext';
import { chatService } from '../services/chatService';

// SOCIAL GRAPH MOCK DATA
const STATIC_AVATARS = {
  'Joanet Serra': '/assets/brand/joanet_serra_comic.png',
  'Carmen la del Forn': '/assets/brand/carmen_forn_comic.png',
  'Andreu Soler': '/assets/brand/andreu_soler_comic.png',
  'Carla Soriano': '/assets/brand/carla_soriano_comic.png',
  'Elena Popova': '/assets/brand/elena_popova_comic.png',
  'Beatriz Ortega': '/assets/avatars/beatriz_ortega_comic.png',
  'Joan Batiste': '/assets/brand/joan_batiste_comic.png',
  'Vicent Ferris': '/assets/brand/vicent_ferris_comic.png',
  'El Viatjant': '/assets/avatars/avatar_samir_comic.png',
  'Mixa': '/assets/brand/mixa_comic.png'
};

const GENT_DATA = AGENTS.filter(a => a.tag === 'GENT');
const GRUPS_DATA = [
  { id: 'grup-1', name: 'Comissió de Festes 2024', role: 'Grup Local', avatar_url: '/assets/products/avatar_mariamel_comic.png', members: '142 membres', tag: 'COL·LECTIU' },
  { id: 'grup-2', name: 'Sindicat de Regants', role: 'Gestió Aigua', avatar_url: '/assets/brand/vicent_ferris_comic.png', members: '86 membres', tag: 'COL·LECTIU' },
  { id: 'grup-3', name: 'Grup de Muntanya', role: 'Esports', avatar_url: '/assets/avatars/avatar_samir_comic.png', members: '34 membres', tag: 'COL·LECTIU' },
  { id: 'grup-4', name: 'Banda de Música', role: 'Cultura', avatar_url: '/assets/products/avatar_mariamel_comic.png', members: '60 membres', tag: 'COL·LECTIU' }
];
const EMPRESES_DATA = [
  { id: 'emp-1', name: 'El Rentonar Cooperativa', role: 'Agricultura Sostenible', avatar_url: '/assets/brand/vicent_ferris_comic.png', desc: 'Productes KM0', tag: 'EMPRESA' },
  { id: 'emp-2', name: 'Forn de Dalt', role: 'Forn i Pastisseria', avatar_url: '/assets/brand/carmen_forn_comic.png', desc: 'Obert des del 1940', tag: 'EMPRESA' },
  { id: 'emp-3', name: 'Cooperativa Agrícola', role: 'Sector Primari', avatar_url: '/assets/brand/andreu_soler_comic.png', desc: 'Venda a l\'engròs', tag: 'EMPRESA' },
  { id: 'emp-4', name: 'Bar del Poble', role: 'Restauració', avatar_url: '/assets/avatars/avatar_marc_comic.png', desc: 'L\'esmorzar de sempre', tag: 'EMPRESA' }
];
const INSTITUCIONS_DATA = [
  { id: 'inst-1', name: "Simulació de l'Ajuntament", role: 'Administració Local', avatar_url: '/assets/places/nano_ajuntament_comic.png', desc: 'Tràmits i avisos', tag: 'ADMIN' },
  { id: 'inst-2', name: "Simulació de l'Escola", role: 'Educació', avatar_url: '/assets/avatars/nano_escola_comic.png', desc: 'CEIP El Mas', tag: 'ADMIN' },
  { id: 'inst-3', name: 'Simulació Centre de Salut', role: 'Sanitat', avatar_url: '/assets/avatars/nano_salut_comic.png', desc: 'Atenció primària', tag: 'ADMIN' }
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
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);
  
  const handleNotReady = () => {
      alert(t('chat.dev_feature'));
  };
  
  // Consumimos el contexto para saber si el scroll necesita ajustarse al banner
  const { status } = useContext(LocalFirstStatusContext);
  const isDegraded = status === 'degraded' && sessionStorage.getItem("sp_degraded_dismissed_until_recovery") !== "true";
  
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
    <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-[#0e0e0e] relative overflow-hidden h-full chat-list-container font-['Noto_Sans',sans-serif] transition-colors border-r border-[#0000000a] dark:border-transparent">
      {/* HEADER CANÒNIC (Tech-Huerta V12) - OBSIDIAN MODE */}
      <header className="shrink-0 flex items-center justify-between px-4 h-[56px] min-h-[56px] bg-[#F97316] dark:bg-[#4F46E5] sticky top-0 z-20 transition-colors gap-2">
        <div className="flex items-center flex-1 h-[36px] bg-white rounded-[28px] overflow-hidden focus-within:ring-2 focus-within:ring-[#169CF9] transition-all group">
          <div className="flex items-center justify-center pl-4 pr-2 h-full">
            <Search
              size={18}
              strokeWidth={3}
              className="text-gray-400 group-focus-within:text-[#F97316] transition-colors"
            />
          </div>
          <input
            id="chat-search-input"
            name="chat_search"
            type="text"
            aria-label={t("chat.search_aria")}
            placeholder={t("chat.search_placeholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 w-full h-full bg-transparent text-gray-900 pr-4 py-0 m-0 text-[14px] leading-none font-bold outline-none placeholder:text-gray-800 placeholder:font-bold"
          />
        </div>
        
        <div className="relative flex-shrink-0">
            <button 
                onClick={() => setIsSettingsMenuOpen(!isSettingsMenuOpen)}
                className="w-[36px] h-[36px] flex items-center justify-center rounded-full text-white hover:bg-white/20 transition-colors"
                title={t('chat.chat_options', 'Opcions de xat')}
            >
                <Settings size={22} strokeWidth={2.5} />
            </button>

            {isSettingsMenuOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsSettingsMenuOpen(false)}></div>
                    <div className="absolute right-0 top-14 z-50 w-72 origin-top-right animate-in fade-in zoom-in-95 rounded-[28px] bg-white dark:bg-[#1a1a1a] py-3 text-[16px] text-theme-text shadow-[0_8px_32px_rgba(0,0,0,0.25)] border border-gray-100 dark:border-gray-800 duration-200">
                        {/* Header del menú */}
                        <div className="px-5 pb-3 mb-2 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                            <span className="font-['Noto_Sans'] font-bold text-[18px] text-gray-900 dark:text-white capitalize">{t('chat.chat_control', 'Control general')}</span>
                        </div>
                        {/* Opcions Mestre */}
                        <button onClick={() => { setIsSettingsMenuOpen(false); navigate('/control-general'); }} className="w-full px-5 py-3 text-left font-['Noto_Sans'] font-bold text-theme-accent-primary hover:bg-theme-accent-primary/10 transition-colors uppercase tracking-wider text-[14px]">
                            {t('chat.open_general_control', '⚙️ Entrar al Control General')}
                        </button>
                        <div className="mx-5 my-1 border-b border-gray-100 dark:border-gray-800"></div>
                        
                        {/* Opcions Ràpides */}
                        <button onClick={() => { setIsSettingsMenuOpen(false); handleNotReady(); }} className="w-full px-5 py-3 text-left font-['Noto_Sans'] font-medium transition-colors hover:bg-theme-accent-primary/10 hover:text-theme-accent-primary">{t('chat.add_members', 'Afegir membres')}</button>
                        <button onClick={() => { setIsSettingsMenuOpen(false); handleNotReady(); }} className="w-full px-5 py-3 text-left font-['Noto_Sans'] font-medium transition-colors hover:bg-theme-accent-primary/10 hover:text-theme-accent-primary">{t('chat.group_info', 'Informació del grup')}</button>
                        <button onClick={() => { setIsSettingsMenuOpen(false); handleNotReady(); }} className="w-full px-5 py-3 text-left font-['Noto_Sans'] font-medium transition-colors hover:bg-theme-accent-primary/10 hover:text-theme-accent-primary">{t('chat.group_media', 'Multimèdia del grup')}</button>
                        <button onClick={() => { setIsSettingsMenuOpen(false); handleNotReady(); }} className="w-full px-5 py-3 text-left font-['Noto_Sans'] font-medium transition-colors hover:bg-theme-accent-primary/10 hover:text-theme-accent-primary">{t('chat.search', 'Cercar')}</button>
                        <button onClick={() => { setIsSettingsMenuOpen(false); handleNotReady(); }} className="w-full px-5 py-3 text-left font-['Noto_Sans'] font-medium transition-colors hover:bg-theme-accent-primary/10 hover:text-theme-accent-primary">{t('chat.mute_notifications', 'Silenciar')}</button>
                        <button onClick={() => { setIsSettingsMenuOpen(false); handleNotReady(); }} className="w-full px-5 py-3 text-left font-['Noto_Sans'] font-medium transition-colors hover:bg-theme-accent-primary/10 hover:text-theme-accent-primary">{t('chat.temporary_messages', 'Missatges temporals')}</button>
                        <button onClick={() => { setIsSettingsMenuOpen(false); handleNotReady(); }} className="w-full px-5 py-3 text-left font-['Noto_Sans'] font-medium transition-colors hover:bg-theme-accent-primary/10 hover:text-theme-accent-primary">{t('chat.wallpaper', 'Fons de pantalla')}</button>
                        <button onClick={() => { setIsSettingsMenuOpen(false); handleNotReady(); }} className="w-full px-5 py-3 text-left font-['Noto_Sans'] font-medium transition-colors hover:bg-theme-accent-primary/10 hover:text-theme-accent-primary text-gray-500">{t('chat.more', 'Més opcions...')}</button>
                    </div>
                </>
            )}
        </div>
      </header>
      {/* LLISTA D'AGENTS (M3) */}
      <div 
        className="flex-1 overflow-y-auto bg-white dark:bg-[#0e0e0e] min-h-0 custom-scrollbar overscroll-contain transition-colors"
        style={{ scrollPaddingTop: isDegraded ? '56px' : '0px' }}
      >
        {filteredChats.length > 0 ? (
          filteredChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => handleChatClick(chat)}
              className={`flex items-center space-x-4 h-[84px] px-4 cursor-pointer transition-all relative chat-item group
                        ${
                          location.pathname.includes(chat.id) ? "bg-[#169CF9]/10 dark:bg-[#169CF9]/5" : ""
                        } hover:bg-gray-50 dark:hover:bg-[#1a1919]`}
            >
              {/* Protocol 'Zero Elements Distractors' aplicat: Eliminat el tag de tipus de xat */}
              
              {/* Avatar Táctil con tamaño correcto M3 i Badge IA */}
              <div className="flex-shrink-0 relative">
                <Avatar
                  src={chat.other_info?.avatar_url}
                  name={chat.other_info?.name}
                  role={chat.other_info?.role}
                  size={56}
                />
                {chat.id?.startsWith('11111111') && (
                  <div className="absolute -bottom-1 -right-1 bg-white dark:bg-[#0e0e0e] rounded-[10px] px-1.5 py-0.5 z-10 shadow-sm border border-gray-200 dark:border-[rgba(255,255,255,0.1)] flex items-center justify-center">
                    <span className="text-[#FF6D00] text-[9px] font-black tracking-widest uppercase">IA</span>
                  </div>
                )}
              </div>

              {/* Contenido Core del Chat (Blanco sobre Negro) */}
              <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
                 <div className="flex justify-between items-center text-[18px] font-bold text-[#169CF9] dark:text-white transition-colors tracking-tight">
                  <h4 className="m-0 truncate pr-16 block flex-1">
                    {chat.other_info?.name ||
                      (chat.participant_1_id === user?.id
                        ? chat.p2_info?.name
                        : chat.p1_info?.name) ||
                      "Sóc de Poble"}
                  </h4>
                </div>
                
                <div className="flex justify-between items-center gap-3 text-[16px] font-medium transition-colors">
                  <p className="truncate flex-1 text-gray-900 dark:text-white/90">
                    {chat.last_message_content || t("chat.beating_with_socdepoble")}
                  </p>
                  
                  {/* Hora o Fecha - Alt Contrast */}
                  <div className="flex flex-col items-end shrink-0 text-[13px] text-gray-900 dark:text-white font-bold">
                    {currentTab === 'xat' && (() => {
                      const { day, time } = formatBategatDate(chat.last_message_time);
                      return (
                        <div>
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
          <div className="h-full flex flex-col items-center justify-center p-12 text-center opacity-80">
            <MessageSquare
              size={64}
              className="mb-6 text-[#169CF9] mx-auto opacity-70"
            />
            <p className="text-gray-900 dark:text-white text-[16px] font-bold tracking-wide">
              {t("chat.silence_total")}
            </p>
            <p className="text-gray-500 dark:text-white/50 text-[14px] mt-2">
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
    </div>
  );
};

export default ChatList;

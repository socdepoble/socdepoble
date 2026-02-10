// ☢️ [NOTA NUCLEAR PER A FLASH]: NOMÉS estem tocant el contenidor de continguts estandarditzats.
// NO TOCAR l'estructura (Sidebar/Header) que ja està bategada i blindada.
import React, { useEffect } from "react";
import Navigation from "./Navigation";
import Header from "./Header";
import CreationHub from "./CreationHub";
import { useNavigate, NavLink, Outlet, useLocation } from "react-router-dom";
import { logger } from "../utils/logger";
import "./Layout.css";
import {
  Plus,
  MessageSquare,
  Newspaper,
  Store,
  MapPin,
  Sparkles,
  Database,
  Calendar,
  Image,
  User,
  Shield,
} from "lucide-react";

import BackToTop from "./BackToTop";
import GlobalModals from "./GlobalModals";
import OmniscientViewer from "./OmniscientViewer";
import { useUI } from "../context/UIContext";
import { iaiaAuditor } from "../services/iaiaAuditor";
import NotePad from "./NotePad";
import { APP_VERSION } from "../constants";

const Layout = () => {
  const uiContext = useUI();
  const { isViewerOpen, globalDesign } = uiContext || {
    isViewerOpen: false,
    globalDesign: "standard",
  };
  const navigate = useNavigate();

  useEffect(() => {
    logger.log("[Layout] Bategat de Ferro:", { isViewerOpen, globalDesign });
  }, [isViewerOpen, globalDesign]);

  const location = useLocation();

  useEffect(() => {
    // [MASTER IAIA AUDIT]
    const isStable = iaiaAuditor.auditPulse();
    if (isStable) {
      iaiaAuditor.auditLayout();
    }
  }, []);

  useEffect(() => {
    const baseTitle = "Sóc de Poble";
    const pageTitle =
      location.pathname === "/"
        ? "Inici"
        : location.pathname.startsWith("/chats")
        ? "Xat"
        : location.pathname.split("/").filter(Boolean).pop() || "Portal";

    document.title = `${
      pageTitle.charAt(0).toUpperCase() + pageTitle.slice(1)
    } | ${baseTitle} ${APP_VERSION}`;
  }, [location]);

  return (
    <div className="layout-iron flex h-screen w-screen overflow-hidden bg-black text-white font-inter">
      {/* [MASTER] SIDEBAR BLINDAT - LLEI ESTRICTA: hidden md:flex */}
      <aside className="hidden md:flex flex-col w-72 h-full !bg-[#050505] border-r border-white/5 flex-shrink-0 z-[1001]">
        {/* ... (contingut de la sidebar) ... */}
        <div className="logo-box-iron p-8" onClick={() => navigate("/")}>
          <img
            src="/logo-soc-de-poble.png"
            alt="Sóc de Poble"
            className="h-8 cursor-pointer"
            onError={(e) => {
              e.target.style.display = "none";
              const fallback = document.createElement("h2");
              fallback.className =
                "text-xl font-black italic tracking-tighter text-white";
              fallback.innerText = "SÓC DE POBLE";
              e.target.parentNode.appendChild(fallback);
            }}
          />
        </div>

        <div className="afegir-box-iron px-6 mb-6">
          <button
            className="btn-harmony w-full py-3 bg-[#5D5FEF] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:brightness-110 transition-all font-display text-sm tracking-widest"
            onClick={() =>
              window.dispatchEvent(new CustomEvent("toggle-creation-hub"))
            }
          >
            <Plus size={18} strokeWidth={3} /> AFEGIR
          </button>
        </div>

        <nav className="nav-iron flex-1 px-4 overflow-y-auto custom-scrollbar">
          <NavLink
            to="/chats"
            className={({ isActive }) =>
              `nav-item-iron flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? "bg-white/10 text-white font-bold"
                  : "text-gray-400 hover:text-white"
              }`
            }
          >
            <MessageSquare size={18} /> Xat
          </NavLink>
          <NavLink
            to="/mur"
            className={({ isActive }) =>
              `nav-item-iron flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? "bg-white/10 text-white font-bold"
                  : "text-gray-400 hover:text-white"
              }`
            }
          >
            <Newspaper size={18} /> Mur d'Històries
          </NavLink>
          <NavLink
            to="/mercat"
            className={({ isActive }) =>
              `nav-item-iron flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? "bg-white/10 text-white font-bold"
                  : "text-gray-400 hover:text-white"
              }`
            }
          >
            <Store size={18} /> Mercat Rural
          </NavLink>
          <NavLink
            to="/pobles"
            className={({ isActive }) =>
              `nav-item-iron flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? "bg-white/10 text-white font-bold"
                  : "text-gray-400 hover:text-white"
              }`
            }
          >
            <MapPin size={18} /> El Meu Territori
          </NavLink>

          <div className="section-label-iron mt-8 mb-2 px-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">
            Organització
          </div>

          <NavLink
            to="/iaia"
            className={({ isActive }) =>
              `nav-item-iron flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? "bg-white/10 text-white font-bold"
                  : "text-gray-400 hover:text-white"
              }`
            }
          >
            <Sparkles size={18} className="text-[#5D5FEF]" /> La IAIA (Hub)
          </NavLink>
          <NavLink
            to="/arxiu"
            className={({ isActive }) =>
              `nav-item-iron flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? "bg-white/10 text-white font-bold"
                  : "text-gray-400 hover:text-white"
              }`
            }
          >
            <Database size={18} /> Arxiu d'Or
          </NavLink>
          <NavLink
            to="/agenda"
            className={({ isActive }) =>
              `nav-item-iron flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? "bg-white/10 text-white font-bold"
                  : "text-gray-400 hover:text-white"
              }`
            }
          >
            <Calendar size={18} /> Calendari Master
          </NavLink>
          <NavLink
            to="/album"
            className={({ isActive }) =>
              `nav-item-iron flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? "bg-white/10 text-white font-bold"
                  : "text-gray-400 hover:text-white"
              }`
            }
          >
            <Image size={18} /> Àlbum Global
          </NavLink>

          <div className="section-label-iron mt-8 mb-2 px-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">
            Col·leccions
          </div>

          <NavLink
            to="/perfil"
            className={({ isActive }) =>
              `nav-item-iron flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? "bg-white/10 text-white font-bold"
                  : "text-gray-400 hover:text-white"
              }`
            }
          >
            <User size={18} /> El meu Perfil
          </NavLink>
          <NavLink
            to="/solatge"
            className={({ isActive }) =>
              `nav-item-iron flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? "bg-white/10 text-white font-bold"
                  : "text-gray-400 hover:text-white"
              }`
            }
          >
            <Shield size={18} className="text-[#00f2ff]" /> Consola Solatge
          </NavLink>

          <div className="mt-8 pt-8 mb-8 border-t border-white/5 text-[10px] font-black text-gray-700 uppercase tracking-widest text-center">
            {APP_VERSION}
          </div>
        </nav>
      </aside>

      {/* [MASTER] MAIN VIEWPORT - LLEI D'ESPAI: flex-1 */}
      <div className="main-viewport flex-1 flex flex-col min-w-0 h-full relative bg-black">
        <Header />
        <main className="flex-1 overflow-y-auto relative custom-scrollbar pb-24 md:pb-0">
          <Outlet />
          <BackToTop />
        </main>

        {/* BOTTOM BAR - LLEI ESTRICTA: md:hidden */}
        <div className="bottom-navigation fixed bottom-0 left-0 right-0 z-[100] md:hidden">
          <Navigation />
        </div>

        <GlobalModals />
        <NotePad />
        <CreationHub />
        <OmniscientViewer />
      </div>
    </div>
  );
};

export default Layout;

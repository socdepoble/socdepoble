import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useModalDispatch } from "../app/context/ModalContext";

// [PROTOCOL v15.1 - ZERO PATCH] Extracción estructural del Drag & Drop Root.
// Previene el Re-Render en cascada de AppLayout al aislar el estado "isDragging"
// a nivel global usando window events.
const GlobalDropZone = () => {
  const { t } = useTranslation();
  const { openPostModal } = useModalDispatch();
  const [isGlobalDragging, setIsGlobalDragging] = useState(false);
  const globalDragCounter = useRef(0);

  const dragTimeoutRef = useRef(null);

  const resetDragTimeout = useCallback(() => {
    if (dragTimeoutRef.current) clearTimeout(dragTimeoutRef.current);
    dragTimeoutRef.current = setTimeout(() => {
      setIsGlobalDragging(false);
      globalDragCounter.current = 0;
    }, 2500); // Timeout per tancar si l'usuari cancel·la el drag natiu
  }, []);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    globalDragCounter.current += 1;
    if (globalDragCounter.current === 1) {
      setIsGlobalDragging(true);
    }
    resetDragTimeout();
  }, [resetDragTimeout]);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    globalDragCounter.current -= 1;
    if (globalDragCounter.current <= 0) {
      globalDragCounter.current = 0;
      setIsGlobalDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    resetDragTimeout();
  }, [resetDragTimeout]);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (dragTimeoutRef.current) clearTimeout(dragTimeoutRef.current);
      setIsGlobalDragging(false);
      globalDragCounter.current = 0;

      const files = Array.from(e.dataTransfer?.files || []);
      if (files && files.length > 0) {
        openPostModal({ isPrivate: false, initialFile: files[0] });
      }
    },
    [openPostModal]
  );

  useEffect(() => {
    window.addEventListener("dragenter", handleDragEnter);
    window.addEventListener("dragleave", handleDragLeave);
    window.addEventListener("dragover", handleDragOver);
    window.addEventListener("drop", handleDrop);

    return () => {
      window.removeEventListener("dragenter", handleDragEnter);
      window.removeEventListener("dragleave", handleDragLeave);
      window.removeEventListener("dragover", handleDragOver);
      window.removeEventListener("drop", handleDrop);
    };
  }, [handleDragEnter, handleDragLeave, handleDragOver, handleDrop]);

  if (!isGlobalDragging) return null;

  return (
    <div className="fixed inset-0 z-[var(--z-overlay,9999)] bg-[var(--theme-accent-primary)]/90 backdrop-blur-md flex flex-col items-center justify-center text-white pointer-events-none transition-all duration-300 animate-in fade-in zoom-in-95">
      <div className="w-32 h-32 rounded-full bg-white/20 flex items-center justify-center mb-6 animate-pulse">
        <UploadCloud size={64} className="text-white drop-shadow-xl" />
      </div>
      <h2 className="text-4xl font-black uppercase tracking-widest drop-shadow-md">
        {t("common.drop_anar", "Deixa Anar")}
      </h2>
      <p className="text-xl opacity-90 font-bold mt-2">
        {t("common.drop_publish", "per a publicar ràpidament")}
      </p>
    </div>
  );
};

export default GlobalDropZone;

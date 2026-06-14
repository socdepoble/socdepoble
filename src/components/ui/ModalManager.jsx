import React, { useEffect, useRef, useCallback } from "react";
import { useSOSPStore } from "../../hooks/useSOSPStore";
import { SOSPStore } from "../../stores/SOSPStore";
import "../../styles/matrioixca.css";

const ModalManager = React.memo(function ModalManager() {
  const modal = useSOSPStore((state) => state.ui.currentModal);
  const dialogRef = useRef(null);
  const lastTriggerRef = useRef(null);

  // Capturem el trigger ABANS que el modal canvie
  useEffect(() => {
    if (modal) {
      lastTriggerRef.current = document.activeElement;
    }
  }, [modal]);

  const trapFocus = useCallback((e) => {
    if (e.key !== "Tab") return;
    const focusable = dialogRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable?.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }, []);

  // Gestió del dialog natiu
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (modal) {
      if (!dialog.open) {
        dialog.showModal();
        dialog.addEventListener("keydown", trapFocus);
      }
    } else {
      if (dialog.open) {
        dialog.close();
        dialog.removeEventListener("keydown", trapFocus);
      }
    }

    return () => dialog?.removeEventListener("keydown", trapFocus);
  }, [modal, trapFocus]);

  const handleClose = useCallback(() => {
    const trigger = lastTriggerRef.current;
    SOSPStore.actions.modal.close();

    requestAnimationFrame(() => {
      if (trigger && typeof trigger.focus === "function") {
        trigger.focus();
      }
    });
  }, []);

  const titles = {
    translate: "Traducció",
    comment: "Comentaris",
    connect: "Connectar",
  };

  return (
    <dialog
      ref={dialogRef}
      onCancel={handleClose}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-modal="true"
      className="sp-matrioixca"
      data-escala="mitjana"
    >
      <div className="sp-matrioixca-head">
        <h2 id="modal-title" className="m-0 text-xl font-bold leading-tight">
          {modal?.payload?.title || titles[modal?.type] || "Sóc de Poble"}
        </h2>
      </div>

      <div className="sp-matrioixca-body">
        {modal?.type === "translate" && (
          <div role="status" aria-live="polite">
            <p className="m-0">S'està traduint l'ítem...</p>
          </div>
        )}
        {modal?.type === "comment" && (
          <div>
            <p className="m-0 mb-4">Escriu el teu comentari:</p>
            <textarea
              className="w-full p-3 rounded-lg border border-gray-200 min-h-[120px]"
              placeholder="El teu comentari..."
              aria-label="Comentari"
            />
          </div>
        )}
        {modal?.type === "connect" && (
          <div>
            <p className="m-0 mb-4">Amb qui vols connectar?</p>
            <div className="flex flex-col gap-2">
              <button className="sp-btn-primary w-full justify-center">
                Entitat Oficial
              </button>
              <button className="sp-btn-primary w-full justify-center">
                Contacte Directe
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="sp-matrioixca-foot">
        <button onClick={handleClose} className="sp-btn-primary">
          Tancar
        </button>
      </div>
    </dialog>
  );
});

export default ModalManager;

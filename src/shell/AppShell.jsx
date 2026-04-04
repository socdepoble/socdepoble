import React from "react";
import TopBar from "../components/ContextualMenu"; // Adaptado al nombre actual
import BottomNav from "../components/MobileBottomNav"; // Adaptado al nombre actual
import Viewport from "./Viewport";

const AppShell = () => {
  return (
    <div className="h-screen w-full grid grid-rows-[auto_1fr_auto] overflow-hidden bg-theme-base">
      <TopBar /> {/* Nunca depende de location */}

      <Viewport /> {/* Aquí vive la reactividad */}

      <BottomNav /> {/* Aislado */}
    </div>
  );
};

export default React.memo(AppShell);

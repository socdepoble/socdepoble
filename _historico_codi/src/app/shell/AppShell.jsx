import React from "react";
// Adaptado al nombre actual
// Adaptado al nombre actual

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

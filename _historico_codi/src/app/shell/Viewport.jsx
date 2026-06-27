import React from "react";
import { useLocation } from "react-router-dom";

const Feed = React.lazy(() => import("../pages/Feed"));
//const ChatLayout = React.lazy(() => import("../pages/ChatLayout")); // Asegurar que existe y descomentar

const Viewport = () => {
  const location = useLocation();
  const isChat = location.pathname.startsWith("/chats");

  return (
    <main className={`flex-1 min-h-0 ${isChat ? "overflow-hidden" : "overflow-y-auto"}`}>
      <Suspense fallback={<div className="flex h-full w-full items-center justify-center"><p className="text-white/50">Carregant...</p></div>}>
        <Routes>
          <Route path="/mur" element={<Feed />} />
          {/* <Route path="/chats/*" element={<ChatLayout />} /> */}
        </Routes>
      </Suspense>
    </main>
  );
};

export default React.memo(Viewport);

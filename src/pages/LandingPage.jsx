import React from 'react';
import ChatList from '../components/features/ChatList';
import Map from './community/Map';

export default function LandingPage() {
  return (
    <div className="flex-1 flex w-full h-full bg-theme-base">
      {/* Columna esquerra: El Xat (sempre visible, full width en mòbil) */}
      <div className="w-full lg:w-96 flex-shrink-0 h-full border-r border-border-master bg-theme-panel overflow-hidden relative z-20">
        <ChatList />
      </div>

      {/* Columna dreta: El contenidor de la Universal Page (Mapa incrustat) - Només visible lg >= 1024px */}
      <div className="hidden lg:flex flex-1 h-full relative overflow-y-auto bg-theme-base">
        <Map />
      </div>
    </div>
  );
}

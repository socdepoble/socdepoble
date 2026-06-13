// src/AppRouter.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './AppShell';

// Dummy components for now
const MurFeed = () => <div className="p-4">El Mur (Feed Social)</div>;
const Mercat = () => <div className="p-4">El Mercat (Intercanvis)</div>;
const XatGlobal = () => <div className="p-4">Xat Comunitari</div>;
const AdminGuard = ({ children }) => <div className="p-4">Admin Guard {children}</div>;
const Moderacio = () => <div className="p-4">Moderació</div>;
const ConfigMas = () => <div className="p-4">Configuració del Mas</div>;

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<AppShell />}>
        {/* Seccions principals */}
        <Route index element={<Navigate to="/mur" replace />} />
        
        <Route path="mur" element={<MurFeed />} />           {/* Feed social */}
        <Route path="mercat" element={<Mercat />} />        {/* Marketplace */}
        <Route path="xat" element={<XatGlobal />} />        {/* Xat comunitari */}
        
        {/* Rutes protegides per rol */}
        <Route path="admin/*" element={<AdminGuard />}>
          <Route path="moderacio" element={<Moderacio />} />
          <Route path="config-mas" element={<ConfigMas />} />
        </Route>
      </Route>
    </Routes>
  );
}

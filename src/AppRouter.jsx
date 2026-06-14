// src/AppRouter.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './AppShell';

import SessionRulesPage from './pages/SessionRulesPage';

import MurPage from './pages/MurPage';
import MercatPage from './pages/MercatPage';
import Towns from './pages/community/Towns';
import MasterCalendar from './pages/community/MasterCalendar';
import Map from './pages/community/Map';
import MediaManager from './pages/features/MediaManager';

// Dummy components for now
const XatGlobal = () => <div className="p-4">Xat Comunitari</div>;
const AdminGuard = ({
  children
}) => <div className="p-4">Admin Guard {children}</div>;
const Moderacio = () => <div className="p-4">Moderació</div>;
const ConfigMas = () => <div className="p-4">Configuració del Mas</div>;
export default function AppRouter() {
  return <Routes>
      <Route path="/" element={<AppShell />}>
        {/* Seccions principals */}
        <Route index element={<Navigate to="/mur" replace />} />
        
        <Route path="mur" element={<MurPage />} />
        <Route path="mercat" element={<MercatPage />} />
        <Route path="pobles" element={<Towns />} />
        <Route path="events" element={<MasterCalendar />} />
        <Route path="mapa" element={<Map />} />
        <Route path="multimedia" element={<MediaManager />} />
        
        <Route path="xat" element={<XatGlobal />} />        {/* Xat comunitari */}
        <Route path="genoma" element={<SessionRulesPage />} /> {/* Regles de la Iaia */}
        
        {/* Rutes protegides per rol */}
        <Route path="admin/*" element={<AdminGuard />}>
          <Route path="moderacio" element={<Moderacio />} />
          <Route path="config-mas" element={<ConfigMas />} />
        </Route>
      </Route>
    </Routes>;
}
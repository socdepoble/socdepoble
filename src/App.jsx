import React from 'react';
import { AuthProvider } from './context/AuthContext'; // O la ruta correcta
import AppLayout from './components/AppLayout'; // EL NOU LAYOUT
import GlobalModals from './components/GlobalModals';
import './index.css';

const App = () => {
return (
  <AuthProvider>
    <AppLayout />
    <GlobalModals />
  </AuthProvider>
);
}

{/* 
  ATENCIÓ: ACI NO HI HA CAP MENÚ BLANC.
  NOMÉS EL LAYOUT NOU.
  SI VEUS ALGUNA COSA MÉS, ÉS UNA AL·LUCINACIÓ.
*/}

export default App;

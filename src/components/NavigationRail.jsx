// src/components/NavigationRail.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
// fallback icons until lucide-react is verified
const HomeIcon = () => <span>🏠</span>;
const StoreIcon = () => <span>🏪</span>;
const MessageIcon = () => <span>💬</span>;
const ShieldIcon = () => <span>🛡️</span>;

const NavigationRail = () => {
  // const { user } = useAuth(); // mocked for now
  const user = { role: 'user' };

  const navItems = [
    { to: '/mur', icon: <HomeIcon />, label: 'El Mur' },
    { to: '/mercat', icon: <StoreIcon />, label: 'Mercat' },
    { to: '/xat', icon: <MessageIcon />, label: 'Xat' },
  ];

  return (
    <nav className="hidden md:flex w-16 lg:w-64 bg-black text-white flex-col border-r border-white/10 z-10">
      <div className="p-4 flex items-center justify-center">
        {/* <img src="/logo-mas.svg" alt="Sóc de Poble" className="h-10" /> */}
        <span className="font-bold text-xl text-orange-500">Sóc de Poble</span>
      </div>

      <div className="flex-1 px-3 py-6 space-y-2">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `
              flex items-center gap-4 px-4 py-4 rounded-2xl transition-all
              ${isActive ? 'bg-orange-500 text-white' : 'hover:bg-white/10'}
            `}
          >
            {item.icon}
            <span className="font-medium hidden lg:block">{item.label}</span>
          </NavLink>
        ))}
      </div>

      {user?.role === 'admin' && (
        <div className="p-4 border-t border-white/10">
          <NavLink to="/admin/moderacio" className="flex items-center gap-3 text-orange-400 hover:text-orange-300">
            <ShieldIcon /> <span className="hidden lg:block">Administrar Mas</span>
          </NavLink>
        </div>
      )}
    </nav>
  );
};

export default NavigationRail;

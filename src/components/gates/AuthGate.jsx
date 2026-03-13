import React from 'react';
import { useAuth } from '../../context/AuthContext';
import BrandLogo from '../BrandLogo';

/**
 * [GATEKEEPER] AuthGate
 * Garanteix que l'aplicació no es renderitze fins que l'estat d'autenticació (Supabase/Local)
 * s'haja resolt completament. Evita race conditions o accessos a user.id quan encara està "loading".
 */
export default function AuthGate({ children }) {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col relative overflow-hidden" style={{ background: '#0b0b0b' }}>
        {/* Fons subtil abstracte */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#00f2ff]/5 to-transparent pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#00f2ff] opacity-[0.03] blur-[60px] rounded-full pointer-events-none"></div>

        <BrandLogo className="h-10 w-auto mb-8 opacity-80 animate-pulse text-[var(--theme-text)]" style={{ filter: 'drop-shadow(0 0 10px rgba(0,242,255,0.3))' }} />
        
        <div className="flex justify-center gap-2 mb-6">
          <div className="w-1.5 h-1.5 rounded-full bg-[#00f2ff] animate-pulse opacity-80"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-[#00f2ff] animate-pulse opacity-80" style={{ animationDelay: '150ms' }}></div>
          <div className="w-1.5 h-1.5 rounded-full bg-[#00f2ff] animate-pulse opacity-80" style={{ animationDelay: '300ms' }}></div>
        </div>
        
        <p className="font-['Inter_Tight',sans-serif] text-[#00f2ff] text-[12px] font-black uppercase tracking-[0.2em] opacity-70">
          Llegint la clau
        </p>
      </div>
    );
  }

  return children;
}

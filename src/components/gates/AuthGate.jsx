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

        <BrandLogo className="h-10 w-auto mb-8 opacity-90 animate-pulse text-white" style={{ filter: 'drop-shadow(0 0 10px rgba(0,242,255,0.3))' }} />
        
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes bategant {
            0%, 100% { color: #f97316; text-shadow: 0 0 10px rgba(249,115,22,0.4); opacity: 1; transform: scale(1); }
            50% { color: #ffffff; text-shadow: 0 0 5px rgba(255,255,255,0.2); opacity: 0.7; transform: scale(0.98); }
          }
          .animate-bategant {
            animation: bategant 1.5s ease-in-out infinite;
          }
        `}} />
        
        <p className="font-['Inter_Tight',sans-serif] text-[13px] font-black uppercase tracking-[0.2em] animate-bategant select-none">
          CONNECTANT
        </p>
      </div>
    );
  }

  return children;
}

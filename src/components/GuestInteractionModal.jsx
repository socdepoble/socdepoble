import React from 'react';
import { useUI } from '../context/UIContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { UserPlus, LogIn, X, Info, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const GuestInteractionModal = () => {
    const { isGuestInteractionModalOpen, setIsGuestInteractionModalOpen } = useUI();
    const { setLanguage } = useAuth();
    const { i18n } = useTranslation();
    const navigate = useNavigate();
    const activeLang = i18n.language || 'va';

    if (!isGuestInteractionModalOpen) return null;

    const handleAction = (path) => {
        setIsGuestInteractionModalOpen(false);
        navigate(path);
    };

    const languages = [
        { code: 'va', label: 'VAL' },
        { code: 'es', label: 'CAS' },
        { code: 'en', label: 'ENG' },
        { code: 'gl', label: 'GAL' },
        { code: 'eu', label: 'EUS' }
    ];

    return (
        <div className="fixed inset-0 z-[20000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in zoom-in duration-300">
            <div className="max-w-md w-full bg-[#111] border border-white/10 rounded-[32px] p-8 shadow-2xl relative overflow-hidden">
                {/* Decoració de fons */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-[60px] rounded-full -mr-10 -mt-10"></div>
                
                <button 
                    onClick={() => setIsGuestInteractionModalOpen(false)}
                    className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
                >
                    <X size={24} />
                </button>

                <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-orange-500/20 rounded-2xl flex items-center justify-center mb-6">
                        <Info size={32} className="text-[#FF6B00]" />
                    </div>

                    <h2 className="text-2xl font-black mb-4 tracking-tight">Vols bategar amb nosaltres? 🏺✨</h2>
                    
                    <p className="text-gray-400 mb-6 leading-relaxed">
                        Per a interactuar amb la comunitat (publicar, comentar o xatejar), necessitem saber qui ets. Registra't o entra per a formar part activa de <strong>Sóc de Poble</strong>!
                    </p>

                    <div className="flex flex-wrap justify-center gap-2 mb-8">
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => setLanguage(lang.code)}
                                className={`px-3 py-2 rounded-xl text-xs font-black transition-all ${activeLang.startsWith(lang.code) ? 'bg-[#FF6B00] text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                            >
                                {lang.label}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 w-full gap-3">
                        <button 
                            onClick={() => handleAction('/register')}
                            className="w-full h-15 bg-gradient-to-r from-[#FF6B00] to-[#FF8A00] hover:scale-[1.02] text-white rounded-2xl font-black flex items-center justify-center gap-3 shadow-lg transition-all active:scale-95"
                        >
                            <UserPlus size={22} strokeWidth={3} />
                            <span className="text-lg">CREAR COMPTE</span>
                        </button>

                        <button 
                            onClick={() => handleAction('/login')}
                            className="w-full h-15 bg-white/5 hover:bg-white/10 hover:scale-[1.02] text-white rounded-2xl font-black border border-white/10 flex items-center justify-center gap-3 transition-all active:scale-95"
                        >
                            <LogIn size={22} strokeWidth={3} />
                            <span className="text-lg">JA TINC COMPTE</span>
                        </button>

                        <button 
                            onClick={() => setIsGuestInteractionModalOpen(false)}
                            className="mt-2 text-sm font-bold text-gray-500 hover:text-white transition-colors py-2"
                        >
                            Seguir navegant tranquil·lament
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GuestInteractionModal;

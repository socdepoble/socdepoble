import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
    Settings, User, Bell, Shield, 
    MessageSquare, Database, Smartphone, 
    ArrowLeft, HelpCircle, Palette, Activity,
    LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const ControlGeneral = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { signOut } = useAuth();
    const { toggleTheme } = useTheme();

    const handleLogout = async () => {
        if (window.confirm("N'estàs segur que vols abandonar el poble un ratet?")) {
            await signOut();
            navigate('/');
        }
    };

    const sections = [
        { id: 'account', icon: User, title: 'Compte', desc: 'Gestiona la teua informació personal i perfil' },
        { id: 'privacy', icon: Shield, title: 'Privacitat', desc: 'Controla qui pot veure la teua informació' },
        { id: 'chats', icon: MessageSquare, title: 'Xats', desc: 'Fons de pantalla, historial i opcions de conversa' },
        { id: 'notifications', icon: Bell, title: 'Notificacions', desc: 'Tons, vibració i alertes' },
        { id: 'storage', icon: Database, title: 'Emmagatzematge i dades', desc: 'Ús de xarxa, descàrrega automàtica i espai' },
        { id: 'appearance', icon: Palette, title: 'Aparença (Tema)', desc: 'Alterna entre el Dia i la Nit al mas', action: toggleTheme },
        { id: 'iaia', icon: Activity, title: 'IAIA (Agents d\'IA)', desc: 'Configuració del comportament i nivell d\'assistència' },
        { id: 'help', icon: HelpCircle, title: 'Ajuda', desc: 'Centre d\'ajuda, contacta amb nosaltres' },
        { id: 'logout', icon: LogOut, title: 'Tancar Sessió', desc: 'Desconnecta el teu compte del dispositiu', action: handleLogout, color: 'text-red-500' }
    ];

    return (
        <div className="flex flex-col h-full bg-[#f0f2f5] dark:bg-[#0a0a0a] overflow-y-auto custom-scrollbar font-['Noto_Sans']">
            {/* Header Mestre */}
            <header className="flex items-center px-4 md:px-6 h-[56px] shrink-0 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#121212] sticky top-0 z-10 shadow-sm">
                <button 
                    onClick={() => navigate(-1)} 
                    className="p-2 -ml-2 mr-3 rounded-full hover:bg-gray-100 dark:hover:bg-[#2a2a2a] transition-colors text-[#F97316] dark:text-[#169CF9]"
                >
                    <ArrowLeft size={24} strokeWidth={2.5} />
                </button>
                <h1 className="text-[20px] font-bold text-gray-900 dark:text-white tracking-tight">
                    {t('settings.general_control', 'Control General')}
                </h1>
            </header>
            
            <div className="max-w-3xl mx-auto w-full p-4 md:p-8 space-y-4">
                <div className="bg-white dark:bg-[#121212] rounded-[28px] overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800/50">
                    {/* Perfil Header */}
                    <div className="flex items-center gap-4 p-6 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-[#1a1a1a] cursor-pointer transition-colors" onClick={() => navigate('/perfil')}>
                        <div className="w-16 h-16 rounded-full bg-theme-accent-primary text-white flex items-center justify-center text-2xl font-bold shadow-md">
                            <User size={32} />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-[18px] font-bold text-gray-900 dark:text-white">Perfil Actiu</h2>
                            <p className="text-[14px] text-gray-500 dark:text-gray-400 mt-1">Configura la teua presència a Sóc de Poble</p>
                        </div>
                    </div>

                    {/* Llista d'opcions */}
                    <div className="flex flex-col">
                        {sections.map((section, idx) => {
                            const Icon = section.icon;
                            return (
                                <button
                                    key={section.id}
                                    className={`flex items-center gap-4 p-5 text-left hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors ${idx !== sections.length - 1 ? 'border-b border-gray-50 dark:border-gray-800/50' : ''}`}
                                    onClick={() => section.action ? section.action() : alert(`Aquesta secció (${section.title}) s'està construint.`)}
                                >
                                    <div className={`flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-[#202020] flex-shrink-0 ${section.color || 'text-gray-600 dark:text-gray-300'}`}>
                                        <Icon size={20} strokeWidth={2.5} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className={`text-[16px] font-bold ${section.color || 'text-gray-900 dark:text-gray-100'}`}>{section.title}</h3>
                                        <p className="text-[13px] text-gray-500 dark:text-gray-400 truncate mt-0.5">{section.desc}</p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="text-center py-6">
                    <p className="text-[12px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-widest">Sóc de Poble v16</p>
                    <p className="text-[12px] text-gray-400 dark:text-gray-600 mt-1">Gènesi · Cimentació Mestre</p>
                </div>
            </div>
        </div>
    );
};

export default ControlGeneral;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import SystemPageLayout from '../components/SystemPageLayout';
import { 
    Lightbulb, 
    ArrowLeft, 
    ExternalLink,
    Server,
    Menu,
    Blocks,
    Activity,
    Fingerprint,
    Wrench,
    Archive
} from 'lucide-react';

const IDEAS_DATABASE = [
    {
        id: 'hub',
        title: 'Hub Creació',
        path: '/hub',
        icon: Server,
        status: 'prototype',
        description: 'Hub centralitzat de creació de contingut multimèdia. S\'ha d\'estudiar com integrar amb el sistema local-first.'
    },
    {
        id: 'gestio-menu',
        title: 'Gestió Dinàmica de Menús',
        path: '/gestio-menu',
        icon: Menu,
        status: 'draft',
        description: 'Interfície per administrar i organitzar nav links de manera customitzable pels usuaris administradors.'
    },
    {
        id: 'categories',
        title: 'Sistema de Categories',
        path: '/gestio/categories',
        icon: Blocks,
        status: 'draft',
        description: 'Administració de la taxonomia i categories del sistema. Model de dades complex a integrar.'
    },
    {
        id: 'auditoria-xats',
        title: 'Auditoria de Xats',
        path: '/gestio/xats',
        icon: Activity,
        status: 'frozen',
        description: 'Eina de monitorització i moderació de canals privats de comunicació. Posposat per qüestions legals i de privacitat.'
    },
    {
        id: 'visio',
        title: 'Visió Artificial IA',
        path: '/visio',
        icon: Fingerprint,
        status: 'frozen',
        description: 'Motor experimental de visió per ordinador per detectar tipologies d\'imatges al mur.'
    },
    {
        id: 'utilitats',
        title: 'Utilitats Core M3',
        path: '/utilitats',
        icon: Wrench,
        status: 'prototype',
        description: 'Calbot d\'eines genèriques per als administradors i depuració en calent.'
    }
];

const getStatusBadge = (status) => {
    switch(status) {
        case 'prototype':
            return <div className="text-[10px] uppercase tracking-widest px-2 py-1 bg-yellow-500/20 text-yellow-500 border border-yellow-500/30 rounded font-bold">Prototip</div>;
        case 'draft':
            return <div className="text-[10px] uppercase tracking-widest px-2 py-1 bg-blue-500/20 text-blue-500 border border-blue-500/30 rounded font-bold">Esborrany</div>;
        case 'frozen':
            return <div className="text-[10px] uppercase tracking-widest px-2 py-1 bg-gray-500/20 text-gray-400 border border-gray-500/30 rounded font-bold">Congelada</div>;
        default:
            return null;
    }
}

const Ideoteca = () => {
    const navigate = useNavigate();

    return (
        <SystemPageLayout>
            <header className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-[#222] rounded-xl flex items-center justify-center border border-[#333] shadow-md">
                    <Archive size={24} className="text-gray-400" />
                </div>
                <div>
                    <h1 className="text-xl font-black text-white tracking-widest uppercase">Auditoria d'Idees</h1>
                    <p className="text-sm text-gray-500 font-semibold tracking-wide">MAGATZEM DE FUNCIONALITATS EN QUARANTENA</p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {IDEAS_DATABASE.map(item => {
                    const Icon = item.icon;
                    return (
                        <div 
                            key={item.id} 
                            onClick={() => navigate(item.path)}
                            className="bg-[#111] border border-[#222] rounded-xl p-5 hover:bg-[#1a1a1a] transition-colors cursor-pointer group flex flex-col h-full"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white/5 rounded-lg group-hover:bg-[#F97316]/10 group-hover:text-[#F97316] transition-colors text-gray-400">
                                        <Icon size={20} />
                                    </div>
                                    <h3 className="text-white font-bold tracking-wide">{item.title}</h3>
                                </div>
                                {getStatusBadge(item.status)}
                            </div>
                            
                            <p className="text-sm text-gray-500 leading-relaxed mb-6 flex-1">
                                {item.description}
                            </p>

                            <div className="flex justify-end mt-auto pt-4 border-t border-[#222]">
                                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-600 group-hover:text-white transition-colors duration-300">
                                    <span>INSPECCIONAR PROTOTIP</span>
                                    <ExternalLink size={14} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            
            <div className="mt-12 text-center p-6 border border-dashed border-[#333] rounded-xl bg-white/5">
                <Lightbulb size={24} className="mx-auto mb-3 text-[#F97316] opacity-50" />
                <h4 className="text-white font-bold tracking-widest text-sm uppercase mb-1">El calaix de sastre</h4>
                <p className="text-xs text-gray-500 max-w-md mx-auto">Aquestes eines foren ideades als albors del sistema operatiu M3 i actualment no es mostren als usuaris finals per falta de definició estructural o legal.</p>
            </div>
        </SystemPageLayout>
    );
};

export default Ideoteca;

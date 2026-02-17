import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Tag, Layout, Save, ArrowLeft } from 'lucide-react';

const CategoryManager = () => {
    const navigate = useNavigate();

    return (
        <div className="p-6 lg:p-10 max-w-4xl mx-auto space-y-8 animate-fade-in relative">
            <header className="space-y-4 border-b border-white/10 pb-8">
                <button 
                    onClick={() => navigate(-1)} 
                    className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors border border-white/10 shrink-0 mb-4"
                    title="Tornar"
                >
                    <ArrowLeft size={20} />
                </button>
                <div className="flex items-center gap-3">
                    <Settings className="text-[#FF6B00]" size={32} />
                    <h1 className="text-3xl font-black text-white tracking-tight uppercase">
                        GESTIÓ DE CATEGORIES
                    </h1>
                </div>
                <p className="text-slate-400 font-medium">Personalitza el teu menú contextual i organitza el territori.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* CONFIGURACIÓ DE MENÚS */}
                <div className="bg-[#111111] border border-white/5 rounded-[28px] overflow-hidden">
                    <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Layout className="text-[#00D2FF]" size={20} />
                            <span className="font-black text-xs tracking-widest text-white">MENÚS ACTIUS</span>
                        </div>
                        <button className="text-[10px] font-bold text-[#FF6B00] hover:underline">RESTAURAR</button>
                    </div>
                    <div className="p-6 space-y-4">
                        {['MUR', 'MERCAT', 'XAT', 'IAIA'].map(menu => (
                            <div key={menu} className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-white/5">
                                <span className="font-bold text-sm text-slate-300">{menu}</span>
                                <div className="flex gap-2">
                                    <button className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-black text-white hover:bg-white/10 transition-colors">EDITAR</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ETIQUETES DE BATEGAT */}
                <div className="bg-[#111111] border border-white/5 rounded-[28px] overflow-hidden">
                    <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Tag className="text-[#FF6B00]" size={20} />
                            <span className="font-black text-xs tracking-widest text-white">ETIQUETES DE BATEGAT</span>
                        </div>
                        <button className="p-2 bg-[#FF6B00] rounded-full text-white">
                            <Tag size={16} />
                        </button>
                    </div>
                    <div className="p-6 space-y-2 flex flex-wrap gap-2">
                        {['#poble', '#territori', '#festa', '#trellat', '#horta', '#mar'].map(tag => (
                            <span key={tag} className="px-4 py-2 bg-black border border-white/10 rounded-full text-xs font-bold text-slate-400 hover:border-[#FF6B00] cursor-pointer transition-colors">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <footer className="pt-10 flex justify-end">
                <button className="master-button-canonic bg-[#FF6B00] text-white gap-2 px-8">
                    <Save size={20} />
                    GUARDAR CONFIGURACIÓ
                </button>
            </footer>
        </div>
    );
};

export default CategoryManager;

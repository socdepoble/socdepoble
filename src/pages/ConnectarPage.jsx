import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FolderPlus, Tag, CheckCircle2, Sparkles, AlertTriangle, Layers, Save } from 'lucide-react';
import ContextualHeader from '../components/ContextualHeader';

const ConnectarPage = () => {
    const { isAnonymous } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const itemId = searchParams.get('item_id');
    const variant = searchParams.get('variant') || 'contingut';

    const [selectedFolder, setSelectedFolder] = useState(null);
    const [customTags, setCustomTags] = useState([]);
    const [tagInput, setTagInput] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    // AI Suggested Categories (Mock data based on context)
    const suggestedFolders = [
        { id: 'guardats', label: 'Guardats generals', icon: '📁', count: 12 },
        { id: 'esdeveniments', label: 'Calendari i Rutes', icon: '📅', count: 4 },
        { id: 'desitjos', label: 'Coses pendent de vore', icon: '⭐', count: 8 },
        { id: 'projectes', label: 'Inspiració Projectes', icon: '💡', count: 2 },
    ];

    const suggestedTags = ['Història local', 'Interessant', 'Patrimoni', 'Gent del Poble', 'Debat'];

    const handleAddTag = (tag) => {
        if (tag && !customTags.includes(tag)) {
            setCustomTags([...customTags, tag]);
            setTagInput('');
        }
    };

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            setIsSaved(true);
            setTimeout(() => {
                navigate(-1);
            }, 1500);
        }, 1000);
    };

    return (
        <div className="flex flex-col h-full w-full bg-theme-base animate-in fade-in relative z-10">
            <ContextualHeader 
                title={`Connectar ${variant.charAt(0).toUpperCase() + variant.slice(1)}`}
                onBack={() => navigate(-1)}
            />

            <div className="flex-1 overflow-y-auto no-scrollbar w-full max-w-3xl mx-auto px-4 md:px-8 pt-6 pb-32">
                
                {/* Mode Foraster Banner */}
                {isAnonymous && (
                    <div className="mb-8 p-4 bg-[#F97316]/10 border-2 border-[#F97316]/30 rounded-[20px] flex items-start gap-4 animate-pulse-subtle">
                        <div className="bg-[#F97316] p-2 rounded-full text-white shrink-0 mt-1">
                            <AlertTriangle size={20} />
                        </div>
                        <div>
                            <h3 className="font-black text-[#F97316] tracking-wide uppercase text-sm mb-1">Mode Foraster Actiu</h3>
                            <p className="text-sm opacity-80 leading-relaxed">
                                Estàs provant la funcionalitat en mode simulació. Explora, crea carpetes i organitza este element com vullgues. Quan et registres, el teu MAS guardarà els elements permanentment de debò.
                            </p>
                        </div>
                    </div>
                )}

                {/* Hero Contextual */}
                <div className="text-center mb-10 mt-4">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-[var(--theme-accent-primary)]/10 text-[var(--theme-accent-primary)] rounded-[28px] mb-6 shadow-[-4px_4px_15px_rgba(255,107,0,0.2)]">
                        <Layers size={36} />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black mb-3">On vols guardar açò?</h1>
                    <p className="text-lg opacity-60">
                        Classifica i ordena la teua connexió amb el registre: 
                        <span className="block mt-1 font-mono text-xs opacity-50">{itemId || 'Element Rebut'}</span>
                    </p>
                </div>

                {/* 1. SELECCIÓ DE CAIXA / CARPETA */}
                <section className="mb-10">
                    <div className="flex items-center justify-between mx-2 mb-4">
                        <h2 className="text-lg font-black tracking-widest uppercase opacity-80">Caixa Principal</h2>
                        <button className="flex items-center gap-1.5 text-xs font-bold text-[var(--theme-accent-primary)] hover:opacity-80 transition-opacity">
                            <FolderPlus size={16} /> CREAR NOVA
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        {suggestedFolders.map((folder) => (
                            <button 
                                key={folder.id}
                                onClick={() => setSelectedFolder(folder.id)}
                                className={`p-4 rounded-[24px] border-2 transition-all duration-300 flex flex-col items-start gap-3 relative overflow-hidden group
                                    ${selectedFolder === folder.id 
                                        ? 'border-[var(--theme-accent-primary)] bg-[var(--theme-accent-primary)]/5 dark:bg-[var(--theme-accent-primary)]/10 scale-[1.02]' 
                                        : 'border-white/10 dark:border-white/5 bg-white/5 hover:border-white/20'
                                    }
                                `}
                            >
                                <span className="text-3xl filter drop-shadow-md group-hover:scale-110 transition-transform">{folder.icon}</span>
                                <div className="text-left">
                                    <h3 className="font-bold text-[15px] leading-tight mb-1">{folder.label}</h3>
                                    <span className="text-xs opacity-50 font-medium">{folder.count} elements</span>
                                </div>
                                {selectedFolder === folder.id && (
                                    <div className="absolute top-3 right-3 text-[var(--theme-accent-primary)] animate-in zoom-in duration-300">
                                        <CheckCircle2 size={20} className="fill-current" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </section>

                {/* 2. ETIQUETAT INTEL·LIGENT (IAIA) */}
                <section className="mb-10 bg-theme-panel p-6 md:p-8 rounded-[32px] border border-white/5 shadow-sm">
                    <div className="flex items-start gap-4 mb-6">
                        <div className="bg-[#E44BCA] p-2.5 rounded-[12px] text-white shadow-[-2px_2px_10px_rgba(228,75,202,0.3)]">
                            <Sparkles size={24} />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-lg font-black tracking-widest uppercase mb-1">Assistent de Context</h2>
                            <p className="text-sm opacity-60">La IAIA et suggereix estes etiquetes en base al sistema de Poble. Afig tu les que vullgues per trobar-ho ràpid.</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                        {suggestedTags.map(tag => (
                            <button 
                                key={tag}
                                onClick={() => handleAddTag(tag)}
                                className={`px-4 py-2 rounded-full text-sm font-bold border transition-all ${
                                    customTags.includes(tag) 
                                        ? 'bg-[var(--theme-accent-primary)] border-[var(--theme-accent-primary)] text-white scale-105'
                                        : 'bg-white/5 border-white/10 hover:border-white/20'
                                }`}
                            >
                                {customTags.includes(tag) && <span className="mr-1.5 opacity-80">✓</span>}
                                {tag}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-3 bg-white/5 dark:bg-black/20 p-2 pl-4 rounded-full border border-white/10 focus-within:border-[var(--theme-accent-primary)]/50 transition-colors">
                        <Tag size={18} className="opacity-40" />
                        <input 
                            type="text" 
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddTag(tagInput)}
                            placeholder="Escriu una etiqueta lliure..."
                            className="bg-transparent border-none outline-none flex-1 text-sm font-medium h-8"
                        />
                        <button 
                            onClick={() => handleAddTag(tagInput)}
                            disabled={!tagInput.trim()}
                            className="bg-[var(--theme-accent-primary)] text-white px-5 py-2 h-10 rounded-full text-sm font-bold uppercase tracking-widest disabled:opacity-30 disabled:grayscale transition-all"
                        >
                            Afegir
                        </button>
                    </div>
                    
                    {customTags.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap gap-2">
                             {customTags.map(tag => (
                                <div key={tag} className="flex items-center gap-2 bg-[var(--theme-accent-primary)]/10 text-[var(--theme-accent-primary)] px-3 py-1.5 rounded-full text-sm font-bold">
                                    {tag}
                                    <button onClick={() => setCustomTags(customTags.filter(t => t !== tag))} className="opacity-50 hover:opacity-100">
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* 3. SUBMIT */}
                <div className="flex flex-col items-center justify-center pt-4">
                    <button 
                        onClick={handleSave}
                        disabled={!selectedFolder || isSaving || isSaved}
                        className={`
                            relative overflow-hidden group w-full md:w-auto h-[64px] min-w-[280px] rounded-full font-black text-[15px] uppercase tracking-widest transition-all duration-300
                            ${isSaved 
                                ? 'bg-green-500 text-white shadow-xl scale-105' 
                                : !selectedFolder
                                    ? 'bg-gray-200 dark:bg-white/5 text-theme-text/40 cursor-not-allowed'
                                    : 'bg-[var(--theme-accent-primary)] text-white shadow-[0_10px_30px_-10px_rgba(255,107,0,0.5)] hover:scale-[1.02]'
                            }
                        `}
                    >
                        <span className="relative z-10 flex items-center justify-center gap-3">
                            {isSaving ? (
                                <>
                                    <Sparkles className="animate-spin" size={20} />
                                    Bategant Connexió...
                                </>
                            ) : isSaved ? (
                                <>
                                    <CheckCircle2 size={24} className="fill-current text-green-500 bg-white rounded-full" />
                                    Connectat al teu Mas
                                </>
                            ) : (
                                <>
                                    <Save size={20} />
                                    {isAnonymous ? "Simular Guardat" : "Connectar a l'Arxiu"}
                                </>
                            )}
                        </span>
                        
                        {!isSaved && selectedFolder && (
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out-expo" />
                        )}
                    </button>
                    {!selectedFolder && !isSaved && (
                         <p className="mt-4 text-xs font-bold uppercase tracking-widest opacity-40 text-center">
                            Selecciona una carpeta o caixa per activar
                         </p>
                    )}
                </div>

            </div>
        </div>
    );
};

export default ConnectarPage;

import React, { useState } from 'react';
import { Sparkles, X, CheckCircle2, BarChart3, Plus, Trash2 } from 'lucide-react';
import './PollManager.css';

const PollManager = ({ onClose }) => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);

  const addOption = () => {
    if (options.length < 5) {
      setOptions([...options, ""]);
    }
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index, val) => {
    const newOptions = [...options];
    newOptions[index] = val;
    setOptions(newOptions);
  };

  const handleCreate = () => {
    if (!question.trim() || options.some(opt => !opt.trim())) {
      alert("Mestre, omple tots els camps del trellat!");
      return;
    }
    alert("Enquesta bategada amb èxit! (Simulat)");
    onClose();
  };

  return (
    <div className="poll-manager-overlay glass-premium animate-in flex items-center justify-center p-6 z-[6000]">
      <div className="poll-card bg-[#111] border border-white/10 rounded-[32px] w-full max-w-md p-8 shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-fuchsia-600" />
        
        <header className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
                <BarChart3 className="text-orange-500" />
                <h2 className="text-xl font-black uppercase text-fuchsia-400">Nova Enquesta</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                <X />
            </button>
        </header>

        <div className="space-y-6">
            <div className="field-group">
                <label className="text-[10px] uppercase font-black opacity-40 mb-2 block">La Pregunta del Mas</label>
                <input 
                    type="text" 
                    placeholder="Què vols bategar?"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-bold focus:border-fuchsia-500/50 outline-none transition-all"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                />
            </div>

            <div className="field-group">
                <div className="flex justify-between items-center mb-2">
                    <label className="text-[10px] uppercase font-black opacity-40 block">Opcions de Trellat</label>
                    <span className="text-[9px] opacity-30 font-black">{options.length}/5</span>
                </div>
                <div className="space-y-3">
                    {options.map((opt, i) => (
                        <div key={i} className="flex gap-2">
                            <input 
                                type="text" 
                                placeholder={`Opció ${i+1}`}
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-xs font-bold outline-none"
                                value={opt}
                                onChange={(e) => updateOption(i, e.target.value)}
                            />
                            {options.length > 2 && (
                                <button onClick={() => removeOption(i)} className="p-2 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all">
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>
                    ))}
                    {options.length < 5 && (
                        <button 
                            onClick={addOption}
                            className="w-full p-3 border border-dashed border-white/10 rounded-xl text-[10px] uppercase font-black opacity-40 hover:opacity-100 hover:border-fuchsia-500/30 transition-all flex items-center justify-center gap-2"
                        >
                            <Plus size={14} /> Afegir Opció
                        </button>
                    )}
                </div>
            </div>

            <button 
                onClick={handleCreate}
                className="w-full bg-fuchsia-600 text-white p-4 rounded-full font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-fuchsia-600/20 flex items-center justify-center gap-2"
            >
                <Sparkles size={16} /> Bategar Enquesta
            </button>
        </div>
      </div>
    </div>
  );
};

export default PollManager;

import React, { useState } from 'react';
import { 
  X, Sparkles, MessageSquare, Scroll, RefreshCw, Wand2, Copy 
} from 'lucide-react';
import { supabase } from '../supabaseClient';

/**
 * 🏺 EL PREGONER MÀGIC - IAIA CORE v1.21
 * Component d'Intel·ligència Artificial per a redactar bategats amb trellat.
 */
const MagicPregoner = ({ onContentGenerated, onClose }) => {
  const [inputText, setInputText] = useState('');
  const [tone, setTone] = useState('iaia');
  const [generatedText, setGeneratedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const generateContent = async () => {
    if (!inputText.trim()) return;
    setIsLoading(true); 
    setError(null);
    try {
      let systemPrompt = tone === 'iaia' 
        ? "Ets la IAIA MarIA. Parles valencià natural de La Torre de les Maçanes (L'Alacantí), amb forta arrel de les comarques de muntanya (El Comtat, L'Alcoià). Usa termes carinyosos, saviesa, 'fill meu', 'trellat', 'xé va'. Missió: fer el text bonic i emotiu per al poble. Emojis rurals."
        : "Ets el Pregoner Oficial. Valencià normatiu, formal, informatiu i clar per a un Bando. Estructura la informació.";
      
      const { data, error: proxyError } = await supabase.functions.invoke('gemini-proxy', {
        body: {
          model: "gemini-2.0-flash-exp",
          geminiPayload: {
            contents: [{ role: 'user', parts: [{ text: `Reescriu aquest text amb el teu estil: "${inputText}"` }] }], 
            system_instruction: { parts: [{ text: systemPrompt }] } 
          }
        }
      });
      
      if (proxyError) throw new Error('La IAIA s\'ha quedat sense cobertura. Fallida del servidor proxy.');
      if (data?.error) throw new Error(data.error.message || 'Error remot a Gemini via proxy.');

      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (text) {
          setGeneratedText(text.trim());
      } else {
          throw new Error('La IAIA està dormint la migdiada.');
      }
    } catch (err) { 
        if (import.meta.env.DEV) {
            console.error(err);
        }
        setError(err.message || "Error de connexió."); 
    } finally { setIsLoading(false); }
  };

  const handleCopy = () => {
    if (onContentGenerated) {
        onContentGenerated(generatedText);
    }
  };

  return (
    <div className="fixed inset-0 z-modal flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-[#1a1a1c] border border-orange-500/30 rounded-[32px] w-full max-w-xl overflow-hidden shadow-[0_0_50px_rgba(249,115,22,0.15)] relative text-white">
        <div className="bg-gradient-to-r from-[#F97316] to-[#EA580C] p-6 flex justify-between items-center relative overflow-hidden">
          <div className="flex items-center gap-3 text-white font-black text-2xl tracking-tight z-10">
            <div className="bg-white/20 p-2 rounded-[28px] backdrop-blur-sm">
                <Sparkles className="text-white w-6 h-6 animate-pulse" />
            </div>
            EL PREGONER MÀGIC
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white transition-colors bg-black/10 hover:bg-black/20 p-2 rounded-[28px] z-10"><X size={24} /></button>
        </div>
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-3 p-1 bg-black/40 rounded-[24px] border border-white/5">
            <button 
                onClick={() => setTone('iaia')} 
                className={`flex flex-col items-center gap-2 py-4 rounded-[20px] text-sm font-black transition-all border-2 ${tone === 'iaia' ? 'bg-[#2a1a10] border-[#F97316] text-[#F97316] shadow-inner' : 'bg-transparent border-transparent text-gray-500 hover:bg-white/5 hover:text-gray-300'}`}
            >
                <MessageSquare size={20} />Estil IAIA
            </button>
            <button 
                onClick={() => setTone('bando')} 
                className={`flex flex-col items-center gap-2 py-4 rounded-[20px] text-sm font-black transition-all border-2 ${tone === 'bando' ? 'bg-[#0c2024] border-[#06B6D4] text-[#06B6D4] shadow-inner' : 'bg-transparent border-transparent text-gray-500 hover:bg-white/5 hover:text-gray-300'}`}
            >
                <Scroll size={20} />Estil Bando
            </button>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-[#F97316] uppercase tracking-widest ml-1">L'esborrany de la terra</label>
            <textarea 
                value={inputText} 
                onChange={(e) => setInputText(e.target.value)} 
                placeholder="Ex: Vinc a dir que demà hi haurà festa a la plaça..." 
                className="w-full h-32 bg-[#050505] border border-white/10 rounded-[24px] p-5 text-lg text-white placeholder:text-gray-700 focus:outline-none focus:border-[#F97316] resize-none transition-all" 
            />
          </div>
          
          {!generatedText && (
            <button 
                onClick={generateContent} 
                disabled={isLoading || !inputText} 
                className={`w-full py-5 rounded-[24px] font-black text-xl flex items-center justify-center gap-4 transition-all transform active:scale-95 ${isLoading ? 'bg-gray-800 text-gray-600' : 'bg-gradient-to-r from-[#06B6D4] to-[#3B82F6] text-white shadow-[0_0_30px_rgba(6,182,212,0.3)]'}`}
            >
                {isLoading ? <RefreshCw className="animate-spin" /> : <Wand2 />} 
                {isLoading ? 'Consultant la IAIA...' : 'Fes la Màgia! ✨'}
            </button>
          )}

          {generatedText && (
            <div className="animate-in slide-in-from-bottom-4 duration-500 space-y-4">
                <div className="bg-[#050505] border border-green-500/30 rounded-[24px] p-6 text-gray-100 text-xl leading-relaxed shadow-inner">
                    <p>{generatedText}</p>
                </div>
                <div className="flex gap-4">
                    <button onClick={() => setGeneratedText('')} className="flex-1 py-4 bg-white/5 hover:bg-white/10 rounded-[20px] text-white font-black text-sm transition-all">Torna-hi</button>
                    <button 
                        onClick={handleCopy} 
                        className="flex-[2] py-4 bg-[#F97316] hover:bg-[#EA580C] rounded-[20px] text-white font-black text-sm shadow-lg flex items-center justify-center gap-2 transition-all transform active:scale-95"
                    >
                        <Copy size={20} /> COPIAR I USAR
                    </button>
                </div>
            </div>
          )}
          {error && <div className="text-red-400 text-sm text-center bg-red-900/20 p-4 rounded-[20px] border border-red-500/30">{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default MagicPregoner;

import React, { useState, useRef, useEffect } from 'react';
import { useChatCRDT } from '../../hooks/useChatCRDT';
import SdpBancalSegur from '../../components/core/SdpBancalSegur';
import { Send, Trash2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const XatContent = () => {
  const { messages, addMessage, clearChat, isSynced } = useChatCRDT();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (inputText.trim()) {
      addMessage(inputText.trim(), 'Veí', 'user');
      setInputText('');
      
      // Simular resposta automàtica de la IAia (Per ara, un mock)
      setTimeout(() => {
        addMessage('He rebut el teu missatge. Prompte tindré el meu cervell connectat!', 'IAia MarIA', 'ai');
      }, 1000);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl overflow-hidden shadow-lg border border-orange-200">
      {/* Header */}
      <div 
        className="flex items-center justify-between p-4 shrink-0 shadow-sm z-10"
        style={{ backgroundColor: 'var(--sp-orange-10)', borderBottom: '1px solid var(--sp-orange-20)' }}
      >
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/')}
            className="p-3 rounded-full hover:bg-white transition-colors"
            aria-label="Tornar a l'inici"
            style={{ minHeight: 'var(--sp-touch-min)', minWidth: 'var(--sp-touch-min)' }}
          >
            <ArrowLeft style={{ color: 'var(--sp-text-fosc)' }} />
          </button>
          <div>
            <h2 className="text-xl font-bold" style={{ color: 'var(--sp-text-fosc)' }}>Xat del Mas</h2>
            <p className="text-sm opacity-70">
              {isSynced ? '🟢 Guardat al teu dispositiu' : '⏳ Connectant...'}
            </p>
          </div>
        </div>
        <button 
          onClick={clearChat}
          className="p-3 rounded-full hover:bg-red-50 text-red-500 transition-colors"
          aria-label="Netejar la conversa"
          style={{ minHeight: 'var(--sp-touch-min)', minWidth: 'var(--sp-touch-min)' }}
        >
          <Trash2 />
        </button>
      </div>

      {/* Messages */}
      <div 
        className="flex-1 overflow-y-auto p-4 space-y-6"
        style={{ backgroundColor: 'var(--sp-fons)' }}
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-60 space-y-4">
            <div className="text-6xl">💬</div>
            <p className="text-lg max-w-sm">Escriu un missatge i es guardarà ací mateix, al teu aparell. Ningú més ho pot llegir.</p>
          </div>
        )}
        
        {messages.map((msg, idx) => {
          const isUser = msg.role === 'user';
          return (
            <div key={msg.id || idx} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
              <div className="text-xs font-bold mb-1 opacity-60 mx-1">
                {msg.author} • {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </div>
              <div 
                className="px-5 py-4 rounded-2xl max-w-[85%] text-[17px] leading-relaxed shadow-sm"
                style={{ 
                  backgroundColor: isUser ? 'var(--sp-orange-100)' : 'var(--sp-white-100)',
                  color: isUser ? 'var(--sp-white-100)' : 'var(--sp-text-fosc)',
                  borderBottomRightRadius: isUser ? '4px' : '1.5rem',
                  borderBottomLeftRadius: isUser ? '1.5rem' : '4px',
                  border: isUser ? 'none' : '1px solid var(--sp-orange-20)'
                }}
              >
                {msg.text}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form 
        onSubmit={handleSend} 
        className="p-3 shrink-0 flex items-center gap-3"
        style={{ backgroundColor: 'var(--sp-white-100)', borderTop: '1px solid var(--sp-orange-20)' }}
      >
        <input 
          type="text" 
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Escriu ací..."
          className="flex-1 px-5 py-4 rounded-full outline-none text-lg border-2 focus:border-orange-500 transition-colors"
          style={{ minHeight: 'var(--sp-touch-cuspide)' }}
          aria-label="Camp de missatge"
        />
        <button 
          type="submit"
          disabled={!inputText.trim()}
          className="rounded-full flex items-center justify-center transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
          style={{ 
            backgroundColor: 'var(--sp-blue-100)', 
            color: 'var(--sp-white-100)',
            width: 'var(--sp-touch-cuspide)', 
            height: 'var(--sp-touch-cuspide)'
          }}
          aria-label="Enviar missatge"
        >
          <Send size={24} />
        </button>
      </form>
    </div>
  );
};

const XatForaster = () => {
  return (
    <SdpBancalSegur>
      <div className="h-[calc(100dvh-5rem)] md:h-[calc(100dvh-6rem)] w-full max-w-3xl mx-auto py-4">
        <XatContent />
      </div>
    </SdpBancalSegur>
  );
};

export default XatForaster;

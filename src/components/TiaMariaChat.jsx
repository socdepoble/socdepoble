import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, ArrowLeft, MoreVertical, ShieldCheck, Smile } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { geminiService } from '../services/geminiService';
import { hapticService } from '../services/hapticService';
import { logger } from '../utils/logger';
import Avatar from './Avatar';
import './TiaMariaChat.css';

const TiaMariaChat = () => {
    const navigate = useNavigate();
    const { isPlayground } = useAuth();
    
    // Inicialització directa per evitar setState en useEffect i renders en cascada
    const [messages, setMessages] = useState([
        {
            id: '1',
            text: "Hola! Sóc la Tia Maria. En què et puc ajudar hui, bonico?",
            sender: 'iaia',
            timestamp: new Date().toISOString()
        }
    ]);
    
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const abortControllerRef = useRef(null);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        return () => {
            if (abortControllerRef.current) abortControllerRef.current.abort();
        };
    }, []);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = {
            id: Date.now().toString(),
            text: input,
            sender: 'user',
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);
        hapticService.light();

        try {
            if (abortControllerRef.current) abortControllerRef.current.abort();
            abortControllerRef.current = new AbortController();

            // Note: If generateResponse is a wrapper, it needs to accept signal. 
            // In geminiService.js we only have ask(). Wait. Is generateResponse implemented somewhere else?
            // Yes, let's pass it anyway.
            const messageId = (Date.now() + 1).toString();
            let isFirstChunk = true;

            const response = await geminiService.ask('IAIA', input, null, null, abortControllerRef.current.signal, (chunkText) => {
                setMessages(prev => {
                    const existingMsg = prev.find(m => m.id === messageId);
                    if (existingMsg) {
                        return prev.map(m => m.id === messageId ? { ...m, text: chunkText } : m);
                    } else {
                        if (isFirstChunk) {
                            setIsTyping(false);
                            isFirstChunk = false;
                        }
                        return [...prev, {
                            id: messageId,
                            text: chunkText,
                            sender: 'iaia',
                            timestamp: new Date().toISOString()
                        }];
                    }
                });
            });
            setIsTyping(false);
            
            setMessages(prev => {
                const existingMsg = prev.find(m => m.id === messageId);
                if (existingMsg) {
                    return prev.map(m => m.id === messageId ? { ...m, text: response.text } : m);
                } else {
                    return [...prev, {
                        id: messageId,
                        text: response.text,
                        sender: 'iaia',
                        timestamp: new Date().toISOString()
                    }];
                }
            });
            hapticService.medium();
        } catch (error) {
            logger.error('[TiaMariaChat] Error generating response:', error);
            setIsTyping(false);
        }
    };

    return (
        <div className="iaia-chat-container flex flex-col h-full bg-[#0a0a0c] text-white">
            <header className="px-6 h-16 flex items-center justify-between border-b border-white/5 bg-black/40 backdrop-blur-xl">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-all">
                        <ArrowLeft size={20} />
                    </button>
                    <div className="flex items-center gap-3">
                        <Avatar name="Tia Maria" size={40} src="/assets/avatars/comic/iaia_comic_matriarch.png" />
                        <div>
                            <div className="flex items-center gap-1.5">
                                <h2 className="text-lg font-black tracking-tight">Tia Maria</h2>
                                <ShieldCheck size={14} className="text-[var(--theme-accent-primary)]" />
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-[28px] bg-orange-500 animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Bategant...</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {isPlayground && <span className="text-[9px] font-black px-2 py-0.5 bg-orange-500/10 text-orange-500 border border-orange-500/20 rounded-[28px] uppercase tracking-widest">Sessió de Prova</span>}
                    <button className="p-2 hover:bg-white/5 rounded-full text-gray-500 transition-all">
                        <MoreVertical size={20} />
                    </button>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar">
                {messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                        <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl p-4 shadow-xl ${
                            msg.sender === 'user' 
                                ? 'bg-[var(--theme-accent-primary)] text-white rounded-tr-none' 
                                : 'bg-[#1a1a1c] text-gray-100 rounded-tl-none border border-white/5'
                        }`}>
                            <p className="text-[15px] leading-relaxed font-medium">{msg.text}</p>
                            <div className={`mt-1.5 text-[9px] font-black uppercase tracking-widest opacity-40 ${msg.sender === 'user' ? 'text-white' : 'text-gray-400'} flex justify-end`}>
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex justify-start animate-in fade-in duration-300">
                        <div className="bg-[#1a1a1c] rounded-[28px] rounded-tl-none p-4 flex gap-1.5 items-center border border-white/5 shadow-xl">
                            <span className="w-1.5 h-1.5 bg-orange-500 rounded-[28px] animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-1.5 h-1.5 bg-orange-500 rounded-[28px] animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-1.5 h-1.5 bg-orange-500 rounded-[28px] animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <footer className="p-4 md:p-6 bg-black/60 backdrop-blur-xl border-t border-white/5 safe-area-bottom">
                <form onSubmit={handleSend} className="max-w-4xl mx-auto flex items-center gap-3">
                    <button type="button" className="w-12 h-12 flex items-center justify-center rounded-[28px] bg-white/5 text-gray-400 hover:bg-white/10 transition-all active:scale-90">
                        <Smile size={22} />
                    </button>
                    <div className="flex-1 relative">
                        <input 
                            type="text" 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Escriu un missatge..."
                            className="w-full h-12 bg-white/5 border border-white/10 rounded-[28px] px-6 text-white focus:outline-none focus:border-[var(--theme-accent-primary)]/40 transition-all font-medium"
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={!input.trim()}
                        className="w-12 h-12 bg-[var(--theme-accent-primary)] hover:bg-[#ff7b20] disabled:bg-gray-800 disabled:opacity-30 text-white rounded-[20px] transition-all shadow-lg active:scale-95 flex items-center justify-center"
                    >
                        <Send size={20} strokeWidth={2.5} />
                    </button>
                </form>
            </footer>
        </div>
    );
};

export default TiaMariaChat;

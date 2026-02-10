import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, ArrowLeft, MoreVertical, ShieldCheck, Sparkles, Smile } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { geminiService } from '../services/geminiService';
import { hapticService } from '../services/hapticService';
import { logger } from '../utils/logger';
import './TiaMariaChat.css';

const TiaMariaChat = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([
        /* [ESTAT CERO] - Silenci Digital: Sense IAIA, espera de connexió humana */
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputValue.trim() || isLoading) return;

        const userMsg = {
            id: Date.now(),
            text: inputValue,
            sender: 'user',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsLoading(true);
        hapticService.batec();

        try {
            const result = await geminiService.ask('TIAMARIA', inputValue);

            const aiMsg = {
                id: Date.now() + 1,
                text: result.text || "Ay fill, no t'he sentit bé, pots tornar-ho a dir?",
                sender: 'ai',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            setMessages(prev => [...prev, aiMsg]);
            if (!result.error) hapticService.notifyAIReady();
        } catch (err) {
            logger.error('[TiaMariaChat] Error:', err);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: "Ho sento cariño, m'he quedat un poc sorda ara mateix. Torna-ho a provar en un ratet.",
                sender: 'ai',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="tia-chat-container">
            <header className="tia-chat-header">
                <div className="header-left">
                    <button onClick={() => navigate(-1)} className="back-button" style={{ color: '#000', marginRight: '8px', opacity: 0.7 }}>
                        <ArrowLeft size={24} />
                    </button>
                    <div className="tia-avatar-wrapper">
                        <img
                            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Maria&top=bobCut&accessories=round"
                            alt="Tia Maria"
                            className="tia-avatar"
                        />
                        <div className="online-indicator"></div>
                    </div>
                    <div className="header-info">
                        <h2>La Tia Maria</h2>
                        <span className="tia-status">En línia ● Poble Actiu</span>
                    </div>
                </div>
                <div className="header-actions">
                    <ShieldCheck size={20} className="text-primary" />
                    <MoreVertical size={20} className="text-gray-400" />
                </div>
            </header>

            <div className="tia-chat-body custom-scrollbar">
                <div className="day-separator">AVUI</div>
                <div className="encryption-notice">
                    <ShieldCheck size={12} />
                    <span>Missatges bategats per la IAIA i protegits pel solatge local.</span>
                </div>

                {messages.map((msg) => (
                    <div key={msg.id} className={`message-row ${msg.sender}`}>
                        <div className="message-bubble">
                            <p>{msg.text}</p>
                            <span className="message-time">{msg.timestamp}</span>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="message-row ai">
                        <div className="message-bubble typing">
                            <div className="dot"></div>
                            <div className="dot"></div>
                            <div className="dot"></div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <footer className="tia-chat-footer">
                <div className="input-wrapper">
                    <button className="emoji-btn">
                        <Smile size={20} />
                    </button>
                    <input
                        type="text"
                        placeholder="Connecta amb algun veí per a parlar..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <button
                        className={`send-btn ${inputValue.trim() ? 'active' : ''}`}
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim() || isLoading}
                    >
                        <Send size={20} />
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default TiaMariaChat;

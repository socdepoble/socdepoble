import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import { MOCK_CHATS, MOCK_MESSAGES } from '../data';
import './ChatDetail.css';

const ChatDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const chat = MOCK_CHATS.find(c => c.id === parseInt(id));
    const messages = MOCK_MESSAGES[id] || [];

    if (!chat) return <div>Chat not found</div>;

    return (
        <div className="chat-detail-container">
            <header className="chat-header-bar">
                <button onClick={() => navigate(-1)} className="back-button">
                    <ArrowLeft size={24} />
                </button>
                <div className="header-info">
                    <h2>{chat.name}</h2>
                    <span className="status">Online</span>
                </div>
            </header>

            <div className="messages-list">
                {messages.map(msg => (
                    <div key={msg.id} className={`message-bubble ${msg.sender === 'me' ? 'me' : 'other'}`}>
                        <p>{msg.text}</p>
                        <span className="message-time">{msg.time}</span>
                    </div>
                ))}
            </div>

            <div className="chat-input-area">
                <input type="text" placeholder="Escriu un missatge..." />
                <button className="send-button">
                    <Send size={20} />
                </button>
            </div>
        </div>
    );
};

export default ChatDetail;

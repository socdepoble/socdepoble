import React from 'react';
import { Outlet, useParams } from 'react-router-dom';
import ChatList from './ChatList';
import './ChatLayout.css';

const ChatLayout = () => {
    const { id } = useParams();

    return (
        <div className="chat-layout">
            {/* LLISTA DE VEÏNS (Esquerra en Desktop, ocupa tot en Mòbil si no hi ha ID) */}
            <div className={`chat-list-wrapper ${id ? 'hidden-mobile' : ''}`}>
                <ChatList />
            </div>

            {/* FINESTRA DE CONVERSA (Dreta en Desktop, ocupa tot en Mòbil si hi ha ID) */}
            <div className={`chat-window ${!id ? 'hidden-mobile' : ''}`}>
                <Outlet />
            </div>
        </div>
    );
};

export default ChatLayout;

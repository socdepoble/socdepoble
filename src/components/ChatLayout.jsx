import React from 'react';
import { Outlet, useParams } from 'react-router-dom';
import ChatList from './ChatList';

const ChatLayout = () => {
    const { id } = useParams();

    return (
        <div className="flex-1 flex overflow-hidden w-full h-full bg-black relative">
            
            {/* 1. LLISTA DE VEÏNS (EL MERCAT - 400px FIXES EN DESKTOP) */}
            <div className={`
                flex-shrink-0 md:w-[400px] border-r border-gray-800 bg-black
                ${id ? 'hidden md:flex' : 'flex w-full'}
                flex-col
            `}>
                <ChatList />
            </div>

            {/* 2. FINESTRA DE CONVERSA (ESCENARI - FLEX 1 EN DESKTOP) */}
            <div className={`
                flex-1 flex flex-col min-w-0 bg-black relative
                ${!id ? 'hidden md:flex' : 'fixed inset-0 z-50 md:static md:z-auto flex chat-detail-mobile-transition'}
            `}>
                <Outlet />
            </div>
        </div>
    );
};

export default ChatLayout;

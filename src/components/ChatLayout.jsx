import React from 'react';
import { Outlet, useParams } from 'react-router-dom';
import ChatList from './ChatList';
import { useUI } from '../context/UIContext';
import BlueprintOverlay from './BlueprintOverlay';

const ChatLayout = () => {
    const { id } = useParams();
    const { blueprintMode } = useUI();

    return (
        <div className="flex-1 flex overflow-hidden w-full h-full bg-black relative">
            
            {/* 1. LLISTA DE VEÏNS (EL MERCAT - 400px FIXES EN DESKTOP) */}
            <div className={`
                flex-shrink-0 lg:w-[400px] border-r border-gray-800 bg-black
                ${id ? 'hidden lg:flex' : 'flex w-full'}
                flex-col relative
            `}>
                {blueprintMode && <BlueprintOverlay label="LIST_COLUMN" dimensions="400px" color="blue" />}
                <ChatList />
            </div>

            {/* 2. FINESTRA DE CONVERSA (ESCENARI - FLEX 1 EN DESKTOP) */}
            <div className={`
                flex-1 flex flex-col min-w-0 bg-black relative
                ${!id ? 'hidden lg:flex' : 'fixed inset-0 z-50 lg:static lg:z-auto flex chat-detail-mobile-transition'}
            `}>
                {blueprintMode && <BlueprintOverlay label="RIGHT_PANEL" dimensions="FLEX_GROW" color="green" />}
                <Outlet />
            </div>
        </div>
    );
};

export default ChatLayout;

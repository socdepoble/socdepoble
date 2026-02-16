import React from 'react';
import { Outlet, useParams } from 'react-router-dom';
import ChatList from './ChatList';
import { useUI } from '../context/UIContext';
import BlueprintOverlay from './BlueprintOverlay';

const ChatLayout = () => {
    const { id } = useParams();
    const { blueprintMode } = useUI();

    return (
        <div className="flex-1 flex overflow-hidden w-full bg-black relative flex-grow min-h-0 h-full">
            
            {/* 1. LLISTA DE VEÏNS (EL MERCAT - 400px FIXES EN DESKTOP) */}
            <div className={`
                flex-shrink-0 lg:w-[400px] border-r border-gray-800 bg-black
                ${id ? 'hidden lg:flex' : 'flex w-full'}
                flex-col relative
            `}>
                {blueprintMode ? (
                    <BlueprintOverlay label="LIST_COLUMN" dimensions={id ? "HIDDEN" : "FULL_WIDTH"} color="blue" className="flex-1 flex flex-col min-h-0 h-full">
                        <ChatList />
                    </BlueprintOverlay>
                ) : (
                    <ChatList />
                )}
            </div>

            {/* 2. FINESTRA DE CONVERSA (ESCENARI - FLEX 1 EN DESKTOP) */}
            <div className={`
                flex-1 flex flex-col min-w-0 bg-black relative min-h-0 h-full
                ${!id ? 'hidden lg:flex' : 'flex lg:static lg:z-auto chat-detail-mobile-transition h-full'}
            `}>
                {blueprintMode ? (
                    <BlueprintOverlay label="RIGHT_PANEL" dimensions="FLEX_GROW" color="green" className="flex-1 flex flex-col min-h-0 h-full">
                        <Outlet />
                    </BlueprintOverlay>
                ) : (
                    <Outlet />
                )}
            </div>
        </div>
    );
};

export default ChatLayout;

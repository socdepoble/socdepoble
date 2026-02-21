import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import ChatList from './ChatList';
import { useUI } from '../context/UIContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import BlueprintOverlay from './BlueprintOverlay';

const ChatLayout = () => {
    const { id } = useParams();
    const { blueprintMode } = useUI();
    const [leftWidth, setLeftWidth] = useState(400);
    const [isResizing, setIsResizing] = useState(false);
    const containerRef = useRef(null);

    const startResizing = (e) => {
        setIsResizing(true);
        e.preventDefault();
    };

    const stopResizing = React.useCallback(() => {
        setIsResizing(false);
    }, []);

    const resize = React.useCallback((e) => {
        if (isResizing && containerRef.current) {
            const newWidth = e.clientX - containerRef.current.getBoundingClientRect().left;
            if (newWidth > 280 && newWidth < 800) {
                setLeftWidth(newWidth);
            }
        }
    }, [isResizing]);

    useEffect(() => {
        if (isResizing) {
            window.addEventListener('mousemove', resize);
            window.addEventListener('mouseup', stopResizing);
        } else {
            window.removeEventListener('mousemove', resize);
            window.removeEventListener('mouseup', stopResizing);
        }
        return () => {
            window.removeEventListener('mousemove', resize);
            window.removeEventListener('mouseup', stopResizing);
        };
    }, [isResizing, resize, stopResizing]);

    return (
        <div ref={containerRef} className="flex-1 flex overflow-hidden w-full bg-black relative flex-grow min-h-0 h-full select-none">
            
            {/* 1. LLISTA DE VEÏNS (DINÀMICA EN DESKTOP) */}
            <div 
                style={{ width: window.innerWidth >= 1024 ? `${leftWidth}px` : '100%' }}
                className={`
                    flex-shrink-0 border-r border-white/5 bg-black
                    ${id ? 'hidden lg:flex' : 'flex w-full'}
                    flex-col relative transition-all duration-75
                `}
            >
                {blueprintMode ? (
                    <BlueprintOverlay label="LIST_COLUMN" dimensions={id ? "HIDDEN" : `${leftWidth}px`} color="blue" className="flex-1 flex flex-col min-h-0 h-full">
                        <ChatList />
                    </BlueprintOverlay>
                ) : (
                    <ChatList />
                )}

                {/* HANDLE DE RESIZE (ESCRIPTORI) */}
                <div 
                    onMouseDown={startResizing}
                    className="hidden lg:flex absolute -right-3 top-0 bottom-0 w-6 cursor-col-resize z-50 items-center justify-center group"
                >
                    <div className={`
                        w-1 h-20 rounded-full transition-all duration-300
                        ${isResizing ? 'bg-[#FF6B00] scale-x-150 shadow-[0_0_15px_rgba(255,107,0,0.5)]' : 'bg-white/10 group-hover:bg-white/30'}
                        relative flex items-center justify-center
                    `}>
                        <div className={`
                            absolute flex items-center justify-center bg-black border border-white/10 rounded-lg p-1 transition-all
                            ${isResizing ? 'scale-110 border-[#FF6B00]/50' : 'opacity-0 group-hover:opacity-100'}
                        `}>
                            <ChevronLeft size={10} className="text-[#FF6B00] -mr-0.5" />
                            <ChevronRight size={10} className="text-[#FF6B00] -ml-0.5" />
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. FINESTRA DE CONVERSA (FLEX 1) */}
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

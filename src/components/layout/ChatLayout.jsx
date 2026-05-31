import { useDesign } from '../../app/context/DesignContext';
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Outlet } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ChatList from '../features/ChatList';
import BlueprintOverlay from '../ui/BlueprintOverlay';
const ChatLayout = () => {
    const { id } = useParams();
    const { blueprintMode } = useDesign();
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

    const rafId = useRef(null);

    const resize = React.useCallback((e) => {
        if (isResizing && containerRef.current) {
            if (rafId.current) cancelAnimationFrame(rafId.current);
            rafId.current = requestAnimationFrame(() => {
                const newWidth = e.clientX - containerRef.current.getBoundingClientRect().left;
                if (newWidth > 280 && newWidth < 800) {
                    setLeftWidth(newWidth);
                }
            });
        }
    }, [isResizing]);

    useEffect(() => {
        if (isResizing) {
            window.addEventListener('mousemove', resize);
            window.addEventListener('mouseup', stopResizing);
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';
        } else {
            window.removeEventListener('mousemove', resize);
            window.removeEventListener('mouseup', stopResizing);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        }
        return () => {
            window.removeEventListener('mousemove', resize);
            window.removeEventListener('mouseup', stopResizing);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        };
    }, [isResizing, resize, stopResizing]);

    return (
        /* 
          🎯 NIVEL DIOS: Grid Estricto de 2 Columnas.
          Nunca más las caras de flex se empujarán la una a la otra.
          Sella la propagación en todo su Universo con "isolate".
        */
        <div 
            ref={containerRef} 
            style={{ '--left-width': `${leftWidth}px` }}
            className="absolute inset-0 w-full h-full bg-theme-base isolate grid grid-cols-1 lg:grid-cols-[var(--left-width)_minmax(0,1fr)]"
        >
            
            {/* 1. LLISTA DE VEÏNS (COLUMNA EXTERNA DEL GRID) */}
            <div 
                className={`
                    bg-theme-base border-ghost-r relative min-h-0 min-w-0 flex-1
                    ${id ? 'hidden lg:flex lg:col-start-1' : 'flex col-start-1 h-full w-full'}
                    flex-col transition-all duration-75
                `}
            >
                {blueprintMode ? (
                    <BlueprintOverlay label="LIST_COLUMN" dimensions={id ? "HIDDEN" : `${leftWidth}px`} color="orange" className="flex-1 flex flex-col min-h-0 h-full">
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
                        w-[1px] h-full transition-all duration-300
                        ${isResizing ? 'bg-[var(--theme-accent-primary)] w-[2px] shadow-[0_0_15px_rgba(255,107,0,0.5)]' : 'bg-blue-500/30 group-hover:bg-blue-400/60'}
                        relative flex items-center justify-center
                    `}>
                        <div className={`
                            absolute flex items-center justify-center bg-theme-base border border-blue-500/30 rounded-lg p-0.5 transition-all
                            ${isResizing ? 'scale-110 border-[var(--theme-accent-primary)]/50' : 'opacity-0 group-hover:opacity-100'}
                        `}>
                            <ChevronLeft size={10} className="text-[var(--theme-accent-primary)] -mr-0.5" />
                            <ChevronRight size={10} className="text-[var(--theme-accent-primary)] -ml-0.5" />
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. FINESTRA DE CONVERSA (LA PARED DE CRISTAL: minmax(0,1fr)) */}
            <div className={`
                flex flex-col min-w-0 min-h-0 h-full relative bg-theme-base isolate
                ${!id ? 'hidden lg:flex lg:col-start-2' : 'flex col-start-1 lg:col-start-2 chat-detail-mobile-transition'}
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

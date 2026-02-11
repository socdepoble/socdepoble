import React from 'react';
import { MessageSquare } from 'lucide-react';

const ChatEmptyState = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8 opacity-40">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                <MessageSquare size={40} />
            </div>
            <h3 className="text-xl font-bold mb-2">Tria un veí</h3>
            <p className="max-w-xs text-sm">Selecciona una conversa per a començar a xatejar amb el teu poble.</p>
        </div>
    );
};

export default ChatEmptyState;

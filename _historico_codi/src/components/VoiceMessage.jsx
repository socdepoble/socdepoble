import { useState, useRef } from 'react';

/**
 * VoiceMessage - Component per reproduir missatges de veu
 */
const VoiceMessage = ({ audioUrl, duration, onRemove }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    const togglePlay = () => {
        if (!audioRef.current) return;
        
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleEnded = () => {
        setIsPlaying(false);
    };

    return (
        <div className="voice-message-bubble flex items-center gap-3 p-3 bg-white/5 rounded-[28px] border border-white/5 max-w-xs transition-all hover:bg-white/[0.08]">
            <button 
                onClick={togglePlay}
                className="w-10 h-10 flex items-center justify-center rounded-[28px] bg-[var(--theme-accent-primary)] text-white shadow-lg active:scale-95 transition-all"
            >
                {isPlaying ? <Pause size={18} /> : <Play size={18} className="translate-x-0.5" />}
            </button>
            
            <div className="flex-1">
                <div className="h-1.5 w-full bg-white/10 rounded-[28px] overflow-hidden relative">
                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                </div>
                <div className="flex justify-between items-center mt-1.5">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                        {duration || '0:00'}
                    </span>
                    <div className="flex items-center gap-1 opacity-40">
                        <Volume2 size={10} className="text-gray-400" />
                    </div>
                </div>
            </div>

            {onRemove && (
                <button 
                    onClick={onRemove}
                    className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                >
                    <Trash2 size={16} />
                </button>
            )}

            <audio 
                ref={audioRef} 
                src={audioUrl} 
                onEnded={handleEnded} 
                className="hidden"
            />
        </div>
    );
};

export default VoiceMessage;

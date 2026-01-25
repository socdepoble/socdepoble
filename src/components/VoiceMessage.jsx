import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';

const VoiceMessage = ({ url, duration, waveform, isOwnMessage }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);
    const [progress, setProgress] = useState(0);

    const togglePlay = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(e => console.error("Playback error:", e));
        }
        setIsPlaying(!isPlaying);
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
        }
    };

    const handleEnded = () => {
        setIsPlaying(false);
        setProgress(0);
    };

    const formatDuration = (secs) => {
        if (!secs) return '0:00';
        const mins = Math.floor(secs / 60);
        const s = Math.round(secs % 60);
        return `${mins}:${s.toString().padStart(2, '0')}`;
    };

    // Default waveform if none provided (simple bars)
    const renderWaveform = () => {
        // If real waveform provided, use it. Otherwise random bars.
        const bars = waveform || Array(20).fill(0).map(() => Math.random());

        return (
            <div className="voice-waveform" style={{ display: 'flex', alignItems: 'center', gap: '2px', height: '24px', flex: 1, margin: '0 8px' }}>
                {bars.map((amp, i) => (
                    <div
                        key={i}
                        style={{
                            width: '3px',
                            height: `${Math.max(20, amp * 100)}%`,
                            backgroundColor: isOwnMessage ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.4)',
                            borderRadius: '2px'
                        }}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="voice-message-player" style={{ display: 'flex', alignItems: 'center', minWidth: '180px', padding: '4px 0' }}>
            <button
                onClick={togglePlay}
                style={{
                    background: 'none',
                    border: 'none',
                    color: isOwnMessage ? 'white' : 'var(--color-text-primary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                }}
            >
                {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
            </button>

            {renderWaveform()}

            <span style={{
                fontSize: '11px',
                fontFamily: 'monospace',
                color: isOwnMessage ? 'rgba(255,255,255,0.9)' : 'var(--color-text-secondary)',
                minWidth: '35px'
            }}>
                {formatDuration(duration)}
            </span>

            <audio
                ref={audioRef}
                src={url}
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleEnded}
                style={{ display: 'none' }}
            />
        </div>
    );
};

export default VoiceMessage;

import React, { useState, useEffect, useRef } from 'react';
import { supabaseService } from '../core/services/supabaseService';
import { useToast } from './ToastProvider';
import { logger } from '../utils/logger';

const TownMediaVoting = ({ townId, uploaderId }) => {
    const { addToast } = useToast();
    const [media, setMedia] = useState([]);
    const [userVotes, setUserVotes] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    const loadMedia = React.useCallback(async () => {
        try {
            setLoading(true);
            const [fetchedMedia, votes] = await Promise.all([
                supabaseService.getTownMedia(townId),
                supabaseService.getUserTownMediaVotes(townId, uploaderId)
            ]);
            setMedia(fetchedMedia || []);
            setUserVotes(new Set(votes || []));
        } catch (error) {
            logger.error('Error carregant Town Media:', error);
            addToast('Error carregant imatges.', 'error');
        } finally {
            setLoading(false);
        }
    }, [townId, uploaderId, addToast]);

    useEffect(() => {
        if (townId) {
            loadMedia();
        }
    }, [townId, loadMedia]);

    const handleVoteToggle = async (mediaItem) => {
        if (!uploaderId) {
            addToast('Has d\'iniciar sessió per votar.', 'warning');
            return;
        }

        const isVoted = userVotes.has(mediaItem.id);
        
        // Optimistic UI update
        const newVotes = new Set(userVotes);
        if (isVoted) newVotes.delete(mediaItem.id);
        else newVotes.add(mediaItem.id);
        setUserVotes(newVotes);
        
        setMedia(prev => prev.map(m => {
            if (m.id === mediaItem.id) {
                return { ...m, votes_count: m.votes_count + (isVoted ? -1 : 1) };
            }
            return m;
        }));

        try {
            if ('vibrate' in navigator) navigator.vibrate(isVoted ? 10 : 30);
            await supabaseService.toggleTownMediaVote(mediaItem.id, uploaderId, isVoted);
        } catch (error) {
            // Revert on error
            logger.error('Error al registrar el vot:', error);
            addToast('Error al registrar el vot.', 'error');
            setUserVotes(userVotes);
            loadMedia(); // Reload to ensure sync
        }
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!uploaderId) {
            addToast('Has d\'iniciar sessió per pujar imatges.', 'warning');
            return;
        }

        try {
            setUploading(true);
            addToast('Pujant imatge...', 'info');
            await supabaseService.uploadTownMedia(townId, uploaderId, file, 'avatar');
            addToast('Imatge pujada amb èxit! Gràcies per col·laborar.', 'success');
            await loadMedia();
        } catch (error) {
            logger.error('Error pujant imatge:', error);
            addToast(error.message || 'Error pujant imatge.', 'error');
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    if (loading && media.length === 0) {
        return (
            <div className="flex justify-center items-center p-8 text-white/50">
                <Loader className="animate-spin" size={24} />
            </div>
        );
    }

    return (
        <div className="town-media-voting-container bg-black/20 rounded-xl overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-white/10">
                <p className="text-sm text-white/70">
                    Les imatges amb més vots seran la portada oficial del poble gràcies a la vostra meritocràcia.
                </p>
                
                <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={handleFileUpload} 
                    disabled={uploading}
                />
                
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="flex items-center gap-2 bg-primary/20 text-primary px-3 py-2 rounded-full font-bold text-xs transition-transform active:scale-95"
                >
                    {uploading ? <Loader size={14} className="animate-spin" /> : <Camera size={14} />}
                    <span>PUJAR</span>
                </button>
            </div>

            <div className="media-gallery p-4 flex gap-4 overflow-x-auto snap-x snap-mandatory hide-scrollbar">
                {media.length === 0 ? (
                    <div className="w-full text-center p-8 border border-dashed border-white/20 rounded-xl text-white/40 flex flex-col items-center gap-3">
                        <ImageIcon size={32} />
                        <p>No hi ha imatges encara. Sigues el primer en representar el teu poble!</p>
                    </div>
                ) : (
                    media.map((item) => {
                        const isVoted = userVotes.has(item.id);
                        return (
                            <div key={item.id} className="media-item shrink-0 w-64 h-64 relative rounded-xl overflow-hidden snap-center border border-white/10 shadow-lg">
                                <img src={item.image_url} alt="Imatge del poble" className="w-full h-full object-cover" />
                                
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 flex justify-between items-end">
                                    <div className="uploader-info flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full overflow-hidden border border-white/20 bg-white/10">
                                            {item.profiles?.avatar_url ? (
                                                <img src={item.profiles.avatar_url} alt="Uploader" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-[10px] text-white">
                                                    {item.profiles?.username?.charAt(0)?.toUpperCase() || '?'}
                                                </div>
                                            )}
                                        </div>
                                        <span className="text-xs text-white/80 font-medium truncate max-w-[100px]">
                                            {item.profiles?.username || 'Anònim'}
                                        </span>
                                    </div>
                                    
                                    <button 
                                        onClick={() => handleVoteToggle(item)}
                                        className={`vote-btn flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md transition-all ${isVoted ? 'bg-primary/90 text-black' : 'bg-black/50 text-white/80 border border-white/20'}`}
                                    >
                                        <Heart size={14} className={isVoted ? "fill-black" : ""} />
                                        <span className="text-xs font-black">{item.votes_count || 0}</span>
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
            
            <style jsx>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
};

export default TownMediaVoting;

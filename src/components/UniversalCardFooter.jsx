import React from 'react';
import { UserPlus, MessageCircle, Share2, Landmark, Edit, Plus, Zap, MapPin, ShieldCheck } from 'lucide-react';
import ShareHub from './ShareHub';

const UniversalCardFooter = ({
    item,
    cardVariant,
    displayTitle,
    displayExcerpt,
    isMaster,
    navigate,
    handleConnectClick
}) => {
    return (
        <div className={`card-footer-master variant-${cardVariant}`}>
            {/* 1. CARDINAL MUR & MERCAT (Social Flow) */}
            {(cardVariant === 'post' || cardVariant === 'mur' || cardVariant === 'mercat' || cardVariant === 'market') && (
                <div className="footer-actions-mur">
                    {item?.type === 'tramit' ? (
                        <button className="master-action-btn connect-btn bg-[var(--sdp-terracotta)] text-white border-none w-full" onClick={(e) => { e.stopPropagation(); navigate('/documentacio'); }}>
                            <Landmark size={22} />
                            <span>{item.actionLabel || 'Tramitar'}</span>
                        </button>
                    ) : isMaster ? (
                        <button 
                            className="master-action-btn connect-btn master-button-canonic h-12 px-5 rounded-[24px] font-black tracking-widest bg-[var(--sdp-terracotta)] text-white"
                            onClick={(e) => { e.stopPropagation(); navigate(`/edit/${item.id}`); }}
                        >
                            <Edit size={22} />
                            <span>RECTIFICAR</span>
                        </button>
                    ) : (
                        <>
                            <button 
                                className="w-full bg-black text-white h-12 rounded-[28px] font-black tracking-[0.2em] flex items-center justify-center gap-2 border-none hover:bg-gray-900 transition-all active:scale-[0.98] shadow-lg shadow-black/20" 
                                onClick={handleConnectClick}
                            >
                                <UserPlus size={18} />
                                <span className="font-black">CONNECTAR</span>
                            </button>
                            <div className="footer-touch-group">
                                <button className="btn-touch iaia-chat" onClick={(e) => { 
                                    e.stopPropagation(); 
                                    navigate('/iaia');
                                }}>
                                    <MessageCircle size={22} />
                                </button>
                                <ShareHub 
                                    title={displayTitle}
                                    text={displayExcerpt}
                                    url={item.uuid ? `/post/${item.uuid}` : (item.id ? `/post/${item.id}` : window.location.pathname)}
                                    customTrigger={
                                        <button className="btn-touch sharing-btn">
                                            <Share2 size={22} />
                                        </button>
                                    }
                                />
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* 3. CARDINAL AGENDA (Cultural Event) */}
            {(cardVariant === 'agenda' || cardVariant === 'event') && (
                <div className="footer-event-master p-4 pt-0">
                    <div className="event-info-notice mb-4">
                        <Zap size={14} className="flash-icon" />
                        <span>Esdeveniment destacat de la setmana</span>
                    </div>
                    <div className="flex gap-2">
                        <button 
                            className="flex-1 bg-black text-white h-12 rounded-[28px] font-black tracking-[0.2em] flex items-center justify-center gap-2 border-none hover:bg-gray-900 transition-all active:scale-[0.98] shadow-lg shadow-black/20" 
                            onClick={handleConnectClick}
                        >
                            <UserPlus size={18} />
                            CONNECTAR
                        </button>
                        <ShareHub 
                            title={displayTitle}
                            text={displayExcerpt}
                            url={item.uuid ? `/post/${item.uuid}` : (item.id ? `/post/${item.id}` : window.location.pathname)}
                            customTrigger={
                                <button className="btn-touch sharing-btn h-12 w-12 flex items-center justify-center bg-white/5 rounded-[28px] border border-white/10 text-white hover:bg-white/10 transition-all">
                                    <Share2 size={22} />
                                </button>
                            }
                        />
                    </div>
                </div>
            )}

            {/* 4. CARDINAL POBLES (Community Gent de...) */}
            {cardVariant === 'pobles' && (
                <div className="footer-pobles-master p-4 pt-0">
                    <button 
                        className="w-full bg-[#002B5B] text-white h-12 rounded-[28px] font-black tracking-[0.2em] flex items-center justify-center gap-2 border-none hover:opacity-90 transition-all active:scale-[0.98] shadow-lg shadow-[#002B5B]/20" 
                        onClick={handleConnectClick}
                    >
                        <UserPlus size={18} />
                        CONNECTAR
                    </button>
                </div>
            )}

            {/* 5. CARDINAL AJUNTAMENT (Official Institutional) */}
            {cardVariant === 'ajuntament' && (
                <div className="footer-ajuntament-master p-4 pt-0">
                    <div className="official-notice-row mb-4 flex items-center gap-2 text-[10px] font-black uppercase text-blue-400 tracking-widest pl-2">
                        <ShieldCheck size={14} className="blue-badge-icon" />
                        <span>Comunicat Oficial de l'Ajuntament</span>
                    </div>
                    <button 
                        className="w-full bg-[#002B5B] text-white h-12 rounded-[28px] font-black tracking-[0.2em] flex items-center justify-center gap-2 border-none hover:opacity-90 transition-all active:scale-[0.98] shadow-lg shadow-[#002B5B]/20" 
                        onClick={handleConnectClick}
                    >
                        <UserPlus size={18} />
                        CONNECTAR
                    </button>
                </div>
            )}

            {/* 6. CARDINAL RUTES / MAPA (Territorial Navigation) */}
            {(cardVariant === 'mapa' || cardVariant === 'ruta') && (
                <div className="footer-mapa-master p-4 pt-0">
                    <div className="map-dist-notice mb-4">
                        <MapPin size={14} />
                        <span>A 2.4 km de tu</span>
                    </div>
                    <button 
                        className="w-full bg-[#10B981] text-white h-12 rounded-[28px] font-black tracking-[0.2em] flex items-center justify-center gap-2 border-none hover:opacity-90 transition-all active:scale-[0.98] shadow-lg shadow-[#10B981]/20" 
                        onClick={handleConnectClick}
                    >
                        <UserPlus size={18} />
                        CONNECTAR
                    </button>
                </div>
            )}
        </div>
    );
};

export default UniversalCardFooter;

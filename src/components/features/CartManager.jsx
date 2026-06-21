import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCart } from '../../app/context/CartContext';
import { hapticService } from '../../core/services/hapticService';
import { paymentService } from '../../core/services/paymentService';
import { ShoppingBag, X, Minus, Plus, Trash2, Loader2, ArrowRight } from 'lucide-react';
import './CartManager.css';

const CartManager = () => {
    const { t } = useTranslation();
    const { cartItems, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, clearCart, totalPrice } = useCart();
    const overlayRef = useRef(null);
    const containerRef = useRef(null);
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    // Handle escape key to close
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isCartOpen) {
                setIsCartOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isCartOpen, setIsCartOpen]);

    // Prevent body scroll when open
    useEffect(() => {
        if (isCartOpen) {
            document.body.style.overflow = 'hidden';
            document.body.style.touchAction = 'none';
        } else {
            document.body.style.overflow = '';
            document.body.style.touchAction = '';
        }
        return () => {
            document.body.style.overflow = '';
            document.body.style.touchAction = '';
        };
    }, [isCartOpen]);

    const handleOverlayClick = (e) => {
        if (e.target === overlayRef.current) {
            setIsCartOpen(false);
        }
    };

    const handleCloseClick = () => {
        hapticService.playAtomicFeedback('action');
        setIsCartOpen(false);
    };

    const handleCheckout = async () => {
        hapticService.playAtomicFeedback('success');
        setIsCheckingOut(true);
        
        try {
            const results = [];
            
            // Agrupar per venedor (author_user_id)
            const grouped = cartItems.reduce((acc, item) => {
                const receiverId = item.author_user_id || item.user_id || '11111111-1a1a-4000-8000-000000000000';
                if (!acc[receiverId]) acc[receiverId] = 0;
                
                const rawPrice = item.price ? parseFloat(item.price.toString().replace('€', '').replace(',', '.')) : 0;
                const price = isNaN(rawPrice) ? 0 : rawPrice;
                
                acc[receiverId] += price * item.quantity;
                return acc;
            }, {});

            for (const [receiverId, amount] of Object.entries(grouped)) {
                if (amount <= 0) continue;
                
                // Assegurem que siga UUIDv4 vàlid per Rhizome (Fallback a UUID generat conegut)
                const validReceiver = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(receiverId) 
                    ? receiverId 
                    : '11111111-1a1a-4000-8000-000000000000';

                const res = await paymentService.sendEconomicBeat({
                    receiver_id: validReceiver,
                    amount: parseFloat(amount.toFixed(2)),
                    reference: "Compra al Mercat (Sóc de Poble)"
                });
                
                results.push(res);
            }

            const anyFailed = results.some(r => !r.success);
            
            if (anyFailed) {
                alert(t('cart.checkout_error', "Hi ha hagut un error processant alguns pagaments."));
            } else {
                hapticService.playAtomicFeedback('success');
                clearCart();
                setIsCartOpen(false);
                alert(t('cart.checkout_success', "Transacció bategada amb èxit via Rhizome!"));
            }
        } catch (err) {
            console.error(err);
            alert(t('cart.checkout_error', "Hi ha hagut un error processant la cistella."));
        } finally {
            setIsCheckingOut(false);
        }
    };

    if (!isCartOpen && typeof window !== 'undefined') {
        // Render hidden for CSS transitions
    }

    return (
        <div 
            className={`cart-manager-overlay ${isCartOpen ? 'open' : ''}`} 
            ref={overlayRef}
            onClick={handleOverlayClick}
            aria-hidden={!isCartOpen ? "true" : undefined}
        >
            <div 
                className={`cart-manager-container ${isCartOpen ? 'open' : ''}`}
                ref={containerRef}
                role="dialog"
                aria-label={t('cart.title', "Cistella")}
            >
                <div className="cart-header">
                    <h2 className="cart-title">
                        <ShoppingBag size={20} />
                        <span>{t('cart.title', "Cistella")}</span>
                    </h2>
                    <button className="cart-close-btn" onClick={handleCloseClick} aria-label={t('common.close', "Tancar")}>
                        <X size={24} strokeWidth={2.5} />
                    </button>
                </div>

                <div className="cart-content">
                    {cartItems.length === 0 ? (
                        <div className="cart-empty-state">
                            <ShoppingBag size={48} strokeWidth={1} opacity={0.5} />
                            <p>{t('cart.empty', "La teua cistella està buida.")}</p>
                        </div>
                    ) : (
                        cartItems.map((item) => {
                            const itemId = item.id || item.uuid;
                            // Extract first image if available
                            let imgUrl = null;
                            if (item.media && item.media.length > 0) {
                                imgUrl = item.media[0].url || item.media[0];
                            }
                            
                            return (
                                <div key={itemId} className="cart-item">
                                    {imgUrl ? (
                                        <img src={imgUrl} alt={item.title} className="cart-item-image" />
                                    ) : (
                                        <div className="cart-item-image flex items-center justify-center">
                                            <ShoppingBag size={24} className="text-gray-400" />
                                        </div>
                                    )}
                                    <div className="cart-item-details">
                                        <h3 className="cart-item-title">{item.title}</h3>
                                        
                                        <div className="cart-item-actions">
                                            <span className="cart-item-price">{item.price ? `${item.price}€` : 'Gratis'}</span>
                                            
                                            <div className="flex items-center gap-3">
                                                <div className="quantity-selector">
                                                    <button 
                                                        className="qty-btn"
                                                        onClick={() => {
                                                            hapticService.playAtomicFeedback('action');
                                                            updateQuantity(itemId, item.quantity - 1);
                                                        }}
                                                        aria-label="Disminuir quantitat"
                                                    >
                                                        <Minus size={14} strokeWidth={3} />
                                                    </button>
                                                    <span className="qty-value">{item.quantity}</span>
                                                    <button 
                                                        className="qty-btn"
                                                        onClick={() => {
                                                            hapticService.playAtomicFeedback('action');
                                                            updateQuantity(itemId, item.quantity + 1);
                                                        }}
                                                        aria-label="Augmentar quantitat"
                                                    >
                                                        <Plus size={14} strokeWidth={3} />
                                                    </button>
                                                </div>
                                                <button 
                                                    className="remove-btn"
                                                    onClick={() => {
                                                        hapticService.playAtomicFeedback('warning');
                                                        removeFromCart(itemId);
                                                    }}
                                                    aria-label="Eliminar element"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {cartItems.length > 0 && (
                    <div className="cart-footer">
                        <div className="cart-summary-row">
                            <span>{t('cart.total', "Total")}</span>
                            <span>{totalPrice.toFixed(2)}€</span>
                        </div>
                        <button 
                            className="cart-checkout-btn" 
                            onClick={handleCheckout}
                            disabled={isCheckingOut}
                        >
                            {isCheckingOut ? (
                                <>
                                    <span>{t('cart.processing', "Processant...")}</span>
                                    <Loader2 size={20} strokeWidth={2.5} className="animate-spin" />
                                </>
                            ) : (
                                <>
                                    <span>{t('cart.checkout', "Finalitzar Compra")}</span>
                                    <ArrowRight size={20} strokeWidth={2.5} />
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartManager;

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { logger } from '../../utils/logger';

const CartContext = createContext();

const CART_STORAGE_KEY = 'sdp_local_cart_v1';

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Initialize cart from local storage (Local-First Offline pattern)
    useEffect(() => {
        try {
            const stored = localStorage.getItem(CART_STORAGE_KEY);
            if (stored) {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setCartItems(JSON.parse(stored));
            }
        } catch (e) {
            logger.warn('[CartContext] Failed to load cart from local storage', e);
        }
    }, []);

    // Sync cart to local storage
    useEffect(() => {
        try {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
        } catch (e) {
            logger.warn('[CartContext] Failed to save cart to local storage', e);
        }
    }, [cartItems]);

    const addToCart = useCallback((item, quantity = 1) => {
        setCartItems(prev => {
            const existingIndex = prev.findIndex(i => i.id === item.id || i.uuid === item.uuid);
            if (existingIndex >= 0) {
                const updated = [...prev];
                updated[existingIndex] = {
                    ...updated[existingIndex],
                    quantity: updated[existingIndex].quantity + quantity
                };
                return updated;
            }
            return [...prev, { ...item, quantity }];
        });
        
        // Auto open cart on first item or conditionally
        // setIsCartOpen(true); 
    }, []);

    const removeFromCart = useCallback((itemId) => {
        setCartItems(prev => prev.filter(i => (i.id !== itemId && i.uuid !== itemId)));
    }, []);

    const updateQuantity = useCallback((itemId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(itemId);
            return;
        }
        setCartItems(prev => prev.map(i => {
            if (i.id === itemId || i.uuid === itemId) {
                return { ...i, quantity };
            }
            return i;
        }));
    }, [removeFromCart]);

    const clearCart = useCallback(() => {
        setCartItems([]);
    }, []);

    const toggleCart = useCallback(() => {
        setIsCartOpen(prev => !prev);
    }, []);

    const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    const totalPrice = cartItems.reduce((acc, item) => {
        // Parse price safely, assuming format like '15.00€' or a number
        const rawPrice = item.price ? parseFloat(item.price.toString().replace('€', '').replace(',', '.')) : 0;
        return acc + (isNaN(rawPrice) ? 0 : rawPrice * item.quantity);
    }, 0);

    const value = {
        cartItems,
        isCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleCart,
        setIsCartOpen,
        totalItems,
        totalPrice
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const saved = localStorage.getItem('vogueloop_cart');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('vogueloop_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (item, startDate, endDate) => {
        const newItem = {
            ...item,
            cartId: Date.now() + Math.random(),
            startDate,
            endDate,
            addedAt: new Date().toISOString(),
        };
        setCartItems([...cartItems, newItem]);
    };

    const removeFromCart = (cartId) => {
        setCartItems(cartItems.filter(item => item.cartId !== cartId));
    };

    const updateCartItem = (cartId, updates) => {
        setCartItems(cartItems.map(item =>
            item.cartId === cartId ? { ...item, ...updates } : item
        ));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => {
            const days = Math.ceil((new Date(item.endDate) - new Date(item.startDate)) / (1000 * 60 * 60 * 24));
            return total + (item.pricePerDay * days);
        }, 0);
    };

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        updateCartItem,
        clearCart,
        getCartTotal,
        itemCount: cartItems.length,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

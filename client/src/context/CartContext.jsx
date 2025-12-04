import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [cartRestaurantId, setCartRestaurantId] = useState(null);

    useEffect(() => {
        // Load cart from localStorage
        const savedCart = localStorage.getItem('cart');
        const savedRestaurantId = localStorage.getItem('cartRestaurantId');
        if (savedCart) {
            setCartItems(JSON.parse(savedCart));
        }
        if (savedRestaurantId) {
            setCartRestaurantId(savedRestaurantId);
        }
    }, []);

    useEffect(() => {
        // Save cart to localStorage whenever it changes
        localStorage.setItem('cart', JSON.stringify(cartItems));
        if (cartRestaurantId) {
            localStorage.setItem('cartRestaurantId', cartRestaurantId);
        } else {
            localStorage.removeItem('cartRestaurantId');
        }
    }, [cartItems, cartRestaurantId]);

    const addToCart = (item) => {
        // Check if item is from a different restaurant
        if (cartRestaurantId && item.restaurantId && cartRestaurantId !== item.restaurantId) {
            const confirmSwitch = window.confirm(
                'Your cart contains items from a different restaurant. Adding this item will clear your current cart. Continue?'
            );
            if (!confirmSwitch) {
                return false;
            }
            // Clear cart and switch restaurant
            setCartItems([]);
            setCartRestaurantId(item.restaurantId);
        }

        // Set restaurant ID if this is the first item
        if (!cartRestaurantId && item.restaurantId) {
            setCartRestaurantId(item.restaurantId);
        }

        setCartItems(prevItems => {
            const existingItem = prevItems.find(i => i.id === item.id);
            if (existingItem) {
                return prevItems.map(i =>
                    i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            return [...prevItems, { ...item, quantity: 1 }];
        });
        return true;
    };

    const removeFromCart = (itemId) => {
        setCartItems(prevItems => {
            const newItems = prevItems.filter(i => i.id !== itemId);
            // Clear restaurant ID if cart becomes empty
            if (newItems.length === 0) {
                setCartRestaurantId(null);
            }
            return newItems;
        });
    };

    const updateQuantity = (itemId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(itemId);
            return;
        }
        setCartItems(prevItems =>
            prevItems.map(i => (i.id === itemId ? { ...i, quantity } : i))
        );
    };

    const clearCart = () => {
        setCartItems([]);
        setCartRestaurantId(null);
    };

    const getTotalPrice = () => {
        return cartItems.reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0);
    };

    const getTotalItems = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                cartRestaurantId,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                getTotalPrice,
                getTotalItems,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

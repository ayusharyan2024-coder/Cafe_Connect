import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import burger from '../assets/burger.png';

const MenuCard = ({ item }) => {
    const { cartItems, addToCart, updateQuantity, removeFromCart } = useCart();
    const [imageError, setImageError] = useState(false);

    // Check if item is in cart
    const cartItem = cartItems.find(i => i.id === item.id);
    const isInCart = !!cartItem;
    const quantity = cartItem?.quantity || 0;

    const handleAddToCart = () => {
        addToCart(item);
    };

    const handleIncrement = () => {
        updateQuantity(item.id, quantity + 1);
    };

    const handleDecrement = () => {
        if (quantity > 1) {
            updateQuantity(item.id, quantity - 1);
        } else {
            removeFromCart(item.id);
        }
    };

    const handleImageError = () => {
        setImageError(true);
    };

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden border border-orange-100 flex flex-col"
        >
            <div className="h-40 bg-orange-50 flex items-center justify-center p-4 relative overflow-hidden">
                <motion.img
                    src={imageError ? burger : item.image}
                    alt={item.name}
                    className="h-32 object-contain z-10"
                    onError={handleImageError}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                />
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-orange-200 rounded-full opacity-50 blur-2xl"></div>
            </div>

            <div className="p-4 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
                    <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded-full">
                        ₹{item.price}
                    </span>
                </div>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-1">{item.description}</p>

                {!isInCart ? (
                    <button
                        onClick={handleAddToCart}
                        className="w-full bg-orange-600 text-white font-semibold py-2 rounded-lg hover:bg-orange-700 transition active:scale-95 flex items-center justify-center gap-2"
                    >
                        <span>Add to Cart</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                        </svg>
                    </button>
                ) : (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleDecrement}
                            className="flex-1 bg-red-50 text-red-600 font-semibold py-2 rounded-lg hover:bg-red-100 transition active:scale-95 flex items-center justify-center"
                        >
                            {quantity === 1 ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                </svg>
                            )}
                        </button>
                        <div className="px-4 py-2 bg-orange-50 text-orange-700 font-bold rounded-lg min-w-[60px] text-center">
                            {quantity}
                        </div>
                        <button
                            onClick={handleIncrement}
                            className="flex-1 bg-orange-600 text-white font-semibold py-2 rounded-lg hover:bg-orange-700 transition active:scale-95 flex items-center justify-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default MenuCard;

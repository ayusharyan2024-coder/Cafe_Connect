import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Store, MapPin, Phone } from 'lucide-react';
import api from '../services/api';

const RestaurantList = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchRestaurants();
    }, []);

    const fetchRestaurants = async () => {
        try {
            const data = await api.getRestaurants();
            setRestaurants(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching restaurants:', error);
            setLoading(false);
        }
    };

    const handleRestaurantClick = (restaurantId) => {
        navigate(`/dashboard/user?restaurant=${restaurantId}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-orange-50 flex items-center justify-center">
                <div className="text-xl text-orange-600">Loading restaurants...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-orange-50 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl font-bold text-orange-600 mb-2">
                        Explore Restaurants
                    </h1>
                    <p className="text-gray-600">
                        Choose from our amazing selection of restaurants
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {restaurants.map((restaurant, index) => (
                        <motion.div
                            key={restaurant._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => handleRestaurantClick(restaurant._id)}
                            className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transform transition hover:scale-105 hover:shadow-xl"
                        >
                            <div className="h-48 bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                                <Store className="w-20 h-20 text-white opacity-80" />
                            </div>
                            <div className="p-6">
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                    {restaurant.name}
                                </h3>
                                <p className="text-gray-600 mb-4 line-clamp-2">
                                    {restaurant.description || 'Delicious food awaits you!'}
                                </p>
                                <div className="space-y-2 text-sm text-gray-500">
                                    {restaurant.address && (
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4" />
                                            <span>{restaurant.address}</span>
                                        </div>
                                    )}
                                    {restaurant.phone && (
                                        <div className="flex items-center gap-2">
                                            <Phone className="w-4 h-4" />
                                            <span>{restaurant.phone}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {restaurants.length === 0 && (
                    <div className="text-center text-gray-500 mt-12">
                        <Store className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p>No restaurants available at the moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RestaurantList;

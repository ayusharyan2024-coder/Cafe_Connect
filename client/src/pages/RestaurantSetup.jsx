import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Store, MapPin, Phone } from 'lucide-react';
import Logo from '../components/Logo';

const RestaurantSetup = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        address: '',
        phone: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { user, token } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.name.trim()) {
            setError('Restaurant name is required');
            return;
        }

        setLoading(true);

        try {
            const restaurantData = {
                ...formData,
                ownerId: user.id
            };

            const response = await api.createRestaurant(restaurantData, token);

            if (response.restaurant) {
                // Update user object with restaurantId
                const updatedUser = {
                    ...user,
                    restaurantId: response.restaurant._id
                };
                localStorage.setItem('user', JSON.stringify(updatedUser));

                // Force page reload to update context
                window.location.href = '/dashboard/admin';
            } else {
                setError(response.message || 'Failed to create restaurant');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
            console.error('Restaurant setup error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-orange-50 flex items-center justify-center py-10 px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl border border-orange-100"
            >
                <div className="flex justify-center mb-6">
                    <Logo />
                </div>

                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                        <Store className="w-8 h-8 text-orange-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-orange-600 mb-2">
                        Set Up Your Restaurant
                    </h2>
                    <p className="text-gray-500">
                        Tell us about your restaurant to get started
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            Restaurant Name *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition"
                            placeholder="e.g., Cool Cafe"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="3"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition resize-none"
                            placeholder="Tell customers about your restaurant..."
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            Address
                        </label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition"
                            placeholder="123 Main Street, City"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition"
                            placeholder="+1 234 567 8900"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-orange-600 text-white font-bold py-3 rounded-lg hover:bg-orange-700 transition transform hover:scale-[1.02] shadow-md mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Creating Restaurant...' : 'Complete Setup'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default RestaurantSetup;

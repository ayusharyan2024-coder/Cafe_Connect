import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import chai from '../assets/chai.png';
import momos from '../assets/momos.png';

import Logo from '../components/Logo';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'user' // 'user' or 'restaurant'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const { confirmPassword, ...signupData } = formData;
            const response = await api.signup(signupData);

            if (response.token) {
                login(response.user, response.token);
                // Redirect based on role
                if (response.user.role === 'restaurant') {
                    navigate('/restaurant-setup');
                } else {
                    navigate('/restaurants');
                }
            } else {
                setError(response.message || 'Signup failed');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
            console.error('Signup error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-orange-50 flex items-center justify-center relative overflow-hidden py-10">
            {/* Background Decorations */}
            <motion.img
                src={chai}
                alt="Chai"
                className="absolute top-20 right-10 w-28 opacity-20 rotate-12"
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
            <motion.img
                src={momos}
                alt="Momos"
                className="absolute bottom-20 left-10 w-36 opacity-20 -rotate-12"
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md z-10 border border-orange-100"
            >
                <div className="flex justify-center mb-6">
                    <Logo />
                </div>
                <h2 className="text-3xl font-bold text-center text-orange-600 mb-2">Join CafeConnect</h2>
                <p className="text-center text-gray-500 mb-8">Start your delicious journey today.</p>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition"
                            placeholder="John Doe"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition"
                            placeholder="you@example.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-2">I am a...</label>
                        <div className="flex gap-4">
                            <label className={`flex-1 p-3 border rounded-lg cursor-pointer text-center transition ${formData.role === 'user' ? 'border-orange-500 bg-orange-50 text-orange-700 font-semibold' : 'border-gray-200 text-gray-600'}`}>
                                <input
                                    type="radio"
                                    name="role"
                                    value="user"
                                    checked={formData.role === 'user'}
                                    onChange={handleChange}
                                    className="hidden"
                                />
                                Customer
                            </label>
                            <label className={`flex-1 p-3 border rounded-lg cursor-pointer text-center transition ${formData.role === 'restaurant' ? 'border-orange-500 bg-orange-50 text-orange-700 font-semibold' : 'border-gray-200 text-gray-600'}`}>
                                <input
                                    type="radio"
                                    name="role"
                                    value="restaurant"
                                    checked={formData.role === 'restaurant'}
                                    onChange={handleChange}
                                    className="hidden"
                                />
                                Restaurant
                            </label>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-orange-600 text-white font-bold py-3 rounded-lg hover:bg-orange-700 transition transform hover:scale-[1.02] shadow-md mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <div className="mt-6 text-center text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="text-orange-600 font-semibold hover:underline">
                        Login
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Signup;

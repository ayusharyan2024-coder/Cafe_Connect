import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import burger from '../assets/burger.png';
import coffee from '../assets/coffee.png';
import chai from '../assets/chai.png';
import momos from '../assets/momos.png';

import Logo from '../components/Logo';

const LandingPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-orange-50 overflow-hidden relative">
            {/* Navbar */}
            <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
                <Logo />
                <div className="flex gap-4">
                    {user ? (
                        <Link
                            to={user.role === 'restaurant' ? "/dashboard/admin" : "/restaurants"}
                            className="px-6 py-2 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition shadow-md"
                        >
                            Go to Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link to="/login" className="px-6 py-2 text-orange-600 font-semibold hover:bg-orange-100 rounded-lg transition">
                                Login
                            </Link>
                            <Link to="/signup" className="px-6 py-2 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition shadow-md">
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </nav>

            {/* Hero Section with Floating Elements */}
            <div className="relative min-h-screen">
                <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4 relative z-10">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 leading-tight"
                    >
                        Skip the Queue,<br />
                        <span className="text-orange-600">Savor the Taste.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl"
                    >
                        Order your favorite food online and pick it up without waiting in line.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="flex gap-4"
                    >
                        <button
                            onClick={() => {
                                if (user) {
                                    navigate(user.role === 'restaurant' ? '/dashboard/admin' : '/dashboard/user');
                                } else {
                                    navigate('/login');
                                }
                            }}
                            className="px-8 py-4 bg-orange-600 text-white text-lg font-bold rounded-lg hover:bg-orange-700 transition shadow-lg transform hover:scale-105"
                        >
                            Order Now
                        </button>
                        <Link
                            to="/signup"
                            className="px-8 py-4 bg-white text-orange-600 text-lg font-bold rounded-lg hover:bg-gray-50 transition shadow-lg border-2 border-orange-600 transform hover:scale-105"
                        >
                            Register Restaurant
                        </Link>
                    </motion.div>
                </div>

                {/* Floating Elements */}
                <FloatingImage src={burger} alt="Burger" className="absolute top-20 left-10 w-24 md:w-40 opacity-80 z-20" delay={0} />
                <FloatingImage src={coffee} alt="Coffee" className="absolute top-40 right-20 w-20 md:w-32 opacity-80 z-20" delay={0.5} />
                <FloatingImage src={chai} alt="Chai" className="absolute bottom-40 left-20 w-20 md:w-32 opacity-80 z-20" delay={1} />
                <FloatingImage src={momos} alt="Momos" className="absolute bottom-20 right-10 w-24 md:w-40 opacity-80 z-20" delay={1.5} />
            </div>

            {/* How It Works Section */}
            <div className="bg-white py-20 px-4 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl md:text-5xl font-extrabold text-center text-gray-900 mb-4"
                    >
                        How It Works
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-center text-gray-600 text-lg mb-16 max-w-2xl mx-auto"
                    >
                        Get your favorite food in four simple steps
                    </motion.p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <StepCard
                            number="1"
                            title="Browse Menus"
                            description="Explore menus from local cafes and restaurants"
                            icon="🍽️"
                            delay={0}
                        />
                        <StepCard
                            number="2"
                            title="Place Order"
                            description="Order your favorites and pay securely online"
                            icon="🛒"
                            delay={0.1}
                        />
                        <StepCard
                            number="3"
                            title="Get Notified"
                            description="Receive updates when your order is ready"
                            icon="🔔"
                            delay={0.2}
                        />
                        <StepCard
                            number="4"
                            title="Pick Up"
                            description="Skip the queue and grab your order"
                            icon="✨"
                            delay={0.3}
                        />
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="bg-gradient-to-b from-orange-50 to-white py-20 px-4 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl md:text-5xl font-extrabold text-center text-gray-900 mb-4"
                    >
                        Why Choose CafeConnect?
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-center text-gray-600 text-lg mb-16 max-w-2xl mx-auto"
                    >
                        Experience the future of food ordering
                    </motion.p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <FeatureCard
                            icon="⚡"
                            title="Quick & Easy"
                            description="Order in seconds and skip the queue entirely"
                            delay={0}
                        />
                        <FeatureCard
                            icon="🍔"
                            title="Wide Selection"
                            description="Browse multiple cafes and restaurants in one place"
                            delay={0.1}
                        />
                        <FeatureCard
                            icon="⏰"
                            title="Real-time Updates"
                            description="Get instant notifications when your order is ready"
                            delay={0.2}
                        />
                        <FeatureCard
                            icon="💳"
                            title="Secure Payments"
                            description="Safe and secure online payment processing"
                            delay={0.3}
                        />
                        <FeatureCard
                            icon="📱"
                            title="Mobile Friendly"
                            description="Order from anywhere, anytime on any device"
                            delay={0.4}
                        />
                        <FeatureCard
                            icon="🎯"
                            title="For Restaurants"
                            description="Easy-to-use dashboard for managing orders efficiently"
                            delay={0.5}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

const FloatingImage = ({ src, alt, className, delay }) => {
    return (
        <motion.img
            src={src}
            alt={alt}
            className={className}
            animate={{
                y: [0, -20, 0],
                rotate: [0, 5, -5, 0],
            }}
            transition={{
                y: {
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: delay,
                },
                rotate: {
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: delay,
                }
            }}
        />
    );
};

const StepCard = ({ number, title, description, icon, delay }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay }}
            className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-orange-100 hover:border-orange-300 group"
        >
            <div className="absolute -top-6 left-8 w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                {number}
            </div>
            <div className="text-5xl mb-4 mt-4 group-hover:scale-110 transition-transform duration-300">
                {icon}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
            <p className="text-gray-600 leading-relaxed">{description}</p>
        </motion.div>
    );
};

const FeatureCard = ({ icon, title, description, delay }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay }}
            className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-orange-300 group cursor-pointer"
        >
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {icon}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors duration-300">
                {title}
            </h3>
            <p className="text-gray-600 leading-relaxed">{description}</p>
        </motion.div>
    );
};

export default LandingPage;

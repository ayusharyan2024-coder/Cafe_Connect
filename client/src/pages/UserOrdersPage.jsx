import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../services/api';

import Logo from '../components/Logo';

const CountdownTimer = ({ targetDate }) => {
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    function calculateTimeLeft() {
        const difference = new Date(targetDate) - new Date();
        if (difference <= 0) return null;

        return {
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60)
        };
    }

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    if (!timeLeft) return <span className="text-green-600 font-bold">Time's up!</span>;

    return (
        <span className="font-mono font-bold text-orange-600">
            {String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
        </span>
    );
};

const UserOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user, logout } = useAuth();
    const { getTotalItems } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            fetchOrders();
            // Poll for updates every 30 seconds
            const interval = setInterval(fetchOrders, 30000);
            return () => clearInterval(interval);
        }
    }, [user]);

    const fetchOrders = async () => {
        try {
            const data = await api.getUserOrders(user.id);
            // Map _id to id
            const ordersWithIds = data.map(order => ({
                ...order,
                id: order._id || order.id
            }));
            setOrders(ordersWithIds);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setLoading(false);
        }
    };

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            logout();
            navigate('/');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Preparing': return 'bg-blue-100 text-blue-800';
            case 'Ready': return 'bg-green-100 text-green-800';
            case 'Completed': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const activeOrders = orders.filter(order => ['Pending', 'Preparing', 'Ready'].includes(order.status));
    const pastOrders = orders.filter(order => order.status === 'Completed');

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <nav className="bg-white shadow-sm sticky top-0 z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Link to="/"><Logo /></Link>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link to="/dashboard/user" className="text-gray-600 hover:text-orange-600 font-medium">Menu</Link>
                            <button onClick={() => navigate('/cart')} className="p-2 text-gray-600 hover:text-orange-600 transition relative">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-orange-600 rounded-full">{getTotalItems()}</span>
                            </button>
                            <div className="relative group">
                                <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold border border-orange-200 cursor-pointer">
                                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200">
                                    <div className="px-4 py-2 border-b border-gray-100">
                                        <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                                        <p className="text-xs text-gray-500">{user?.email}</p>
                                    </div>
                                    <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50">My Orders</Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
                        <p className="mt-4 text-gray-500">Loading your orders...</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Active Orders */}
                        <section>
                            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                Active Orders
                            </h2>
                            {activeOrders.length === 0 ? (
                                <div className="bg-white rounded-xl p-8 text-center border border-dashed border-gray-300">
                                    <p className="text-gray-500">No active orders right now.</p>
                                    <Link to="/dashboard/user" className="text-orange-600 font-semibold hover:underline mt-2 inline-block">
                                        Browse Menu
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {activeOrders.map(order => {
                                        // Calculate target time for countdown
                                        // Assuming updatedAt is when the status changed to Preparing
                                        const targetTime = order.status === 'Preparing' && order.estimatedWaitTime
                                            ? new Date(new Date(order.updatedAt).getTime() + order.estimatedWaitTime * 60000)
                                            : null;

                                        return (
                                            <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                                <div className="p-6">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div>
                                                            <div className="flex items-center gap-3 mb-1">
                                                                <h3 className="text-lg font-bold text-gray-900">Order #{order.id}</h3>
                                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                                                                    {order.status}
                                                                </span>
                                                            </div>
                                                            <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                                                        </div>
                                                        {order.status === 'Preparing' && targetTime && (
                                                            <div className="text-right bg-orange-50 px-4 py-2 rounded-lg border border-orange-100">
                                                                <p className="text-xs text-orange-600 font-semibold uppercase tracking-wider mb-1">Estimated Time</p>
                                                                <CountdownTimer targetDate={targetTime} />
                                                            </div>
                                                        )}
                                                        {order.status === 'Ready' && (
                                                            <div className="text-right bg-green-50 px-4 py-2 rounded-lg border border-green-100 animate-bounce">
                                                                <p className="text-sm text-green-700 font-bold">Ready for Pickup! 🎉</p>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="border-t border-gray-100 pt-4">
                                                        <ul className="space-y-2 mb-4">
                                                            {order.OrderItems?.map((item, idx) => (
                                                                <li key={idx} className="flex justify-between text-sm">
                                                                    <span className="text-gray-700">
                                                                        <span className="font-semibold text-gray-900">{item.quantity}x</span> {item.Menu?.name}
                                                                    </span>
                                                                    <span className="text-gray-600">₹{(item.price * item.quantity).toFixed(2)}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                                                            <span className="font-medium text-gray-600">Total Amount</span>
                                                            <span className="text-xl font-bold text-orange-600">₹{parseFloat(order.totalAmount).toFixed(2)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* Progress Bar */}
                                                <div className="h-1 w-full bg-gray-100">
                                                    <div
                                                        className={`h-full transition-all duration-500 ${order.status === 'Pending' ? 'w-1/4 bg-yellow-400' :
                                                            order.status === 'Preparing' ? 'w-2/4 bg-blue-500' :
                                                                order.status === 'Ready' ? 'w-full bg-green-500' : 'w-0'
                                                            }`}
                                                    ></div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </section>

                        {/* Past Orders */}
                        {pastOrders.length > 0 && (
                            <section>
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">Past Orders</h2>
                                <div className="space-y-4 opacity-75 hover:opacity-100 transition-opacity">
                                    {pastOrders.map(order => (
                                        <div key={order.id} className="bg-white rounded-lg border border-gray-200 p-4 flex justify-between items-center">
                                            <div>
                                                <div className="flex items-center gap-3">
                                                    <span className="font-bold text-gray-700">#{order.id}</span>
                                                    <span className="text-sm text-gray-500">{formatDate(order.createdAt)}</span>
                                                </div>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    {order.OrderItems?.map(i => `${i.quantity}x ${i.Menu?.name}`).join(', ')}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <span className="block font-bold text-gray-900">₹{parseFloat(order.totalAmount).toFixed(2)}</span>
                                                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">Completed</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default UserOrdersPage;

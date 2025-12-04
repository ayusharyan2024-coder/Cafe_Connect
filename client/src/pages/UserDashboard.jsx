import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import MenuCard from '../components/MenuCard';
import burger from '../assets/burger.png';
import coffee from '../assets/coffee.png';
import chai from '../assets/chai.png';
import momos from '../assets/momos.png';
import { ArrowLeft } from 'lucide-react';

import Logo from '../components/Logo';

// Image mapping for menu items
const imageMap = {
    '/assets/burger.png': burger,
    '/assets/coffee.png': coffee,
    '/assets/chai.png': chai,
    '/assets/momos.png': momos,
};

const UserDashboard = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [restaurant, setRestaurant] = useState(null);
    const [searchParams] = useSearchParams();
    const itemsPerPage = 9;
    const { user, logout } = useAuth();
    const { getTotalItems } = useCart();
    const navigate = useNavigate();

    const restaurantId = searchParams.get('restaurant');

    useEffect(() => {
        if (restaurantId) {
            fetchRestaurant();
        }
        fetchMenu();
    }, [restaurantId]);

    const fetchRestaurant = async () => {
        try {
            const data = await api.getRestaurantById(restaurantId);
            setRestaurant(data);
        } catch (error) {
            console.error('Error fetching restaurant:', error);
        }
    };

    const fetchMenu = async () => {
        setLoading(true);
        try {
            const url = restaurantId ? `?restaurantId=${restaurantId}` : '';
            const data = await api.getMenu();

            // Filter by restaurant on client side if restaurantId is provided
            const filteredData = restaurantId
                ? data.filter(item => item.restaurantId === restaurantId)
                : data;

            // Map imageUrl to local images, or use the URL directly
            const menuWithImages = filteredData.map(item => {
                let imageUrl = item.image;

                // If it's a local path reference, map it to imported image
                if (imageUrl && imageUrl.startsWith('/assets/')) {
                    imageUrl = imageMap[imageUrl] || burger;
                }
                // Otherwise use the URL as-is (external URL)

                return {
                    ...item,
                    id: item._id || item.id,
                    image: imageUrl || burger,
                };
            });
            setMenuItems(menuWithImages);
        } catch (error) {
            console.error('Error fetching menu:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredItems = selectedCategory === 'All'
        ? menuItems
        : menuItems.filter(item => item.category === selectedCategory);

    // Pagination logic
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = filteredItems.slice(startIndex, endIndex);

    // Reset to page 1 when category changes
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory]);

    const categories = ['All', ...new Set(menuItems.map(item => item.category))];

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            logout();
            navigate('/');
        }
    };

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
                            <button
                                onClick={() => navigate('/orders')}
                                className="p-2 text-gray-600 hover:text-orange-600 transition"
                                title="My Orders"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                </svg>
                            </button>
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
                                    <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 transition">
                                        My Orders
                                    </Link>
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

            {/* Restaurant Header */}
            {restaurant && (
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-6">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <button
                            onClick={() => navigate('/restaurants')}
                            className="flex items-center gap-2 text-white/90 hover:text-white mb-3 transition"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Back to Restaurants</span>
                        </button>
                        <h1 className="text-3xl font-bold">{restaurant.name}</h1>
                        {restaurant.description && (
                            <p className="text-white/90 mt-2">{restaurant.description}</p>
                        )}
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Category Filter */}
                <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-6 py-2 rounded-full font-semibold transition whitespace-nowrap ${selectedCategory === category
                                ? 'bg-orange-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-orange-50 border border-gray-200'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Menu Grid */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
                        <p className="mt-4 text-gray-500">Loading menu...</p>
                    </div>
                ) : currentItems.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                        <p className="text-gray-500 text-lg">No items found in this category</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {currentItems.map(item => (
                                <MenuCard key={item.id} item={item} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2 mt-8">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                >
                                    Previous
                                </button>

                                <div className="flex gap-2">
                                    {[...Array(totalPages)].map((_, index) => (
                                        <button
                                            key={index + 1}
                                            onClick={() => setCurrentPage(index + 1)}
                                            className={`w-10 h-10 rounded-lg font-semibold transition ${currentPage === index + 1
                                                ? 'bg-orange-600 text-white'
                                                : 'bg-white border border-gray-300 text-gray-700 hover:bg-orange-50'
                                                }`}
                                        >
                                            {index + 1}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
};

export default UserDashboard;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

import Logo from '../components/Logo';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('orders');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user, token, logout } = useAuth();

    const [menuItems, setMenuItems] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentMenuItems = menuItems.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(menuItems.length / itemsPerPage);

    useEffect(() => {
        if (activeTab === 'orders') {
            fetchOrders();
        } else if (activeTab === 'menu') {
            fetchMenu();
        }
    }, [activeTab]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            // Fetch orders for this restaurant only
            const url = user.restaurantId
                ? `?restaurantId=${user.restaurantId}`
                : '';

            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/orders/all${url}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();

            // Map _id to id
            const ordersWithIds = data.map(order => ({
                ...order,
                id: order._id || order.id
            }));
            setOrders(ordersWithIds);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMenu = async () => {
        setLoading(true);
        try {
            // Fetch menu items for this restaurant only
            const url = user.restaurantId
                ? `?includeUnavailable=true&restaurantId=${user.restaurantId}`
                : '?includeUnavailable=true';

            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/menu${url}`);
            const data = await response.json();

            // Sort by createdAt to maintain consistent order
            const sortedData = data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

            // Map _id to id for frontend compatibility
            const menuWithIds = sortedData.map(item => ({
                ...item,
                id: item._id || item.id
            }));
            setMenuItems(menuWithIds);
        } catch (error) {
            console.error('Error fetching menu:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveItem = async (e) => {
        e.preventDefault();

        // Check if user has a restaurant
        if (!user.restaurantId) {
            alert('Please complete your restaurant setup first before adding menu items.');
            return;
        }

        const formData = new FormData(e.target);
        const itemData = {
            name: formData.get('name'),
            description: formData.get('description'),
            price: parseFloat(formData.get('price')),
            category: formData.get('category'),
            image: formData.get('image'),
            available: formData.get('available') === 'on',
            restaurantId: user.restaurantId,
        };

        try {
            if (editingItem) {
                // Update existing item
                const response = await api.updateMenuItem(editingItem.id, itemData, token);
                if (response.message) {
                    alert(response.message);
                }
            } else {
                // Create new item
                const response = await api.createMenuItem(itemData, token);
                if (response.message) {
                    alert(response.message);
                }
            }
            setShowModal(false);
            setEditingItem(null);
            fetchMenu();
        } catch (error) {
            console.error('Error saving menu item:', error);
            alert('Failed to save menu item. Please try again.');
        }
    };

    const handleDeleteItem = async (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                await api.deleteMenuItem(id, token);
                fetchMenu();
            } catch (error) {
                console.error('Error deleting item:', error);
                alert('Failed to delete item');
            }
        }
    };

    const handleToggleAvailability = async (item) => {
        try {
            const updatedData = {
                name: item.name,
                description: item.description,
                price: item.price,
                category: item.category,
                imageUrl: item.imageUrl,
                available: !item.available, // Toggle the availability
            };
            await api.updateMenuItem(item.id, updatedData, token);
            fetchMenu();
        } catch (error) {
            console.error('Error toggling availability:', error);
            alert('Failed to update availability');
        }
    };

    const handleStatusUpdate = async (orderId, newStatus, estimatedTime = null) => {
        try {
            const updateData = { status: newStatus };
            if (estimatedTime !== null) {
                updateData.estimatedTime = estimatedTime;
            }
            await api.updateOrderStatus(orderId, updateData, token);
            // Refresh orders after update
            fetchOrders();
        } catch (error) {
            console.error('Error updating order status:', error);
            alert('Failed to update order status');
        }
    };

    const getOrdersByStatus = (status) => {
        return orders.filter(order => order.status === status);
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md hidden md:flex flex-col z-10">
                <div className="p-6 border-b border-gray-100">
                    <Link to="/"><Logo /></Link>
                    <p className="text-xs text-gray-400 mt-1">Admin Portal</p>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeTab === 'orders' ? 'bg-orange-50 text-orange-600 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                        Live Orders
                    </button>
                    <button
                        onClick={() => setActiveTab('menu')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeTab === 'menu' ? 'bg-orange-50 text-orange-600 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                        </svg>
                        Menu Management
                    </button>
                </nav>
                <div className="p-4 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center font-bold text-orange-600">
                            {user?.name?.charAt(0).toUpperCase() || 'A'}
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-800">{user?.name || 'Admin User'}</p>
                            <p className="text-xs text-gray-500">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            if (window.confirm('Are you sure you want to logout?')) {
                                logout();
                                // Admin usually goes to login, but user asked for landing page
                                window.location.href = '/';
                            }
                        }}
                        className="w-full mt-3 text-sm text-red-600 hover:bg-red-50 py-2 rounded-lg transition"
                    >
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            {activeTab === 'orders' ? 'Live Orders' : 'Menu Management'}
                        </h1>
                        {activeTab === 'orders' && (
                            <p className="text-gray-500 mt-1">Manage incoming orders in real-time</p>
                        )}
                    </div>
                    <button
                        onClick={fetchOrders}
                        className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Refresh
                    </button>
                </div>

                {activeTab === 'orders' && (
                    loading ? (
                        <div className="text-center py-20">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
                            <p className="mt-4 text-gray-500">Loading orders...</p>
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <p className="text-gray-500 text-lg">No orders yet</p>
                            <p className="text-gray-400 text-sm mt-2">Orders will appear here when customers place them</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Pending Column */}
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 h-fit">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-gray-700">Pending</h3>
                                    <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full">
                                        {getOrdersByStatus('Pending').length}
                                    </span>
                                </div>
                                <div className="space-y-4">
                                    {getOrdersByStatus('Pending').map(order => (
                                        <OrderCard
                                            key={order.id}
                                            order={order}
                                            onStatusUpdate={handleStatusUpdate}
                                            formatTime={formatTime}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Preparing Column */}
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 h-fit">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-gray-700">Preparing</h3>
                                    <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full">
                                        {getOrdersByStatus('Preparing').length}
                                    </span>
                                </div>
                                <div className="space-y-4">
                                    {getOrdersByStatus('Preparing').map(order => (
                                        <OrderCard
                                            key={order.id}
                                            order={order}
                                            onStatusUpdate={handleStatusUpdate}
                                            formatTime={formatTime}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Ready Column */}
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 h-fit">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-gray-700">Ready</h3>
                                    <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full">
                                        {getOrdersByStatus('Ready').length}
                                    </span>
                                </div>
                                <div className="space-y-4">
                                    {getOrdersByStatus('Ready').map(order => (
                                        <OrderCard
                                            key={order.id}
                                            order={order}
                                            onStatusUpdate={handleStatusUpdate}
                                            formatTime={formatTime}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )
                )}

                {activeTab === 'menu' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                            <h2 className="text-xl font-bold text-gray-800">Menu Items</h2>
                            <button
                                onClick={() => {
                                    setEditingItem(null);
                                    setShowModal(true);
                                }}
                                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition flex items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                                Add New Item
                            </button>
                        </div>

                        {loading ? (
                            <div className="text-center py-20">
                                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
                                <p className="mt-4 text-gray-500">Loading menu...</p>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {currentMenuItems.map((item) => (
                                        <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition group">
                                            <div className="relative h-48 bg-gray-100">
                                                <img
                                                    src={item.image || '/assets/burger.png'}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = '/assets/burger.png';
                                                    }}
                                                />
                                                <div className="absolute top-2 right-2">
                                                    <span className={`px-2 py-1 text-xs font-bold rounded-full shadow-sm ${item.available
                                                        ? 'bg-green-100 text-green-800 border border-green-200'
                                                        : 'bg-red-100 text-red-800 border border-red-200'
                                                        }`}>
                                                        {item.available ? 'Available' : 'Unavailable'}
                                                    </span>
                                                </div>
                                                <div className="absolute top-2 left-2">
                                                    <span className="px-2 py-1 text-xs font-bold rounded-full bg-white/90 text-gray-800 shadow-sm backdrop-blur-sm">
                                                        {item.category}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="p-4">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="font-bold text-gray-900 text-lg">{item.name}</h3>
                                                    <span className="font-bold text-orange-600">₹{item.price}</span>
                                                </div>
                                                <p className="text-sm text-gray-500 mb-4 line-clamp-2 h-10">{item.description}</p>

                                                <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
                                                    <button
                                                        onClick={() => handleToggleAvailability(item)}
                                                        className={`w-full py-2 text-sm font-semibold rounded-lg transition flex items-center justify-center gap-2 ${item.available
                                                            ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                                                            : 'bg-green-50 text-green-700 hover:bg-green-100'
                                                            }`}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                            {item.available ? (
                                                                <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                                                            ) : (
                                                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                            )}
                                                            {item.available ? (
                                                                <path d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" />
                                                            ) : (
                                                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                                            )}
                                                        </svg>
                                                        {item.available ? 'Mark as Unavailable' : 'Mark as Available'}
                                                    </button>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => {
                                                                setEditingItem(item);
                                                                setShowModal(true);
                                                            }}
                                                            className="flex-1 py-2 bg-indigo-50 text-indigo-600 text-sm font-semibold rounded-lg hover:bg-indigo-100 transition flex items-center justify-center gap-2"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                            </svg>
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteItem(item.id)}
                                                            className="flex-1 py-2 bg-red-50 text-red-600 text-sm font-semibold rounded-lg hover:bg-red-100 transition flex items-center justify-center gap-2"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                            </svg>
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Pagination Controls */}
                                {totalPages > 1 && (
                                    <div className="flex justify-center items-center gap-2 mt-8">
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1}
                                            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                        <span className="text-sm font-medium text-gray-600">
                                            Page {currentPage} of {totalPages}
                                        </span>
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                            disabled={currentPage === totalPages}
                                            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}

                {/* Menu Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">
                                {editingItem ? 'Edit Menu Item' : 'Add New Item'}
                            </h3>
                            <form onSubmit={handleSaveItem} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                    <input
                                        type="text"
                                        required
                                        defaultValue={editingItem?.name}
                                        name="name"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        required
                                        defaultValue={editingItem?.description}
                                        name="description"
                                        rows="3"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                                    ></textarea>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                                        <input
                                            type="number"
                                            required
                                            defaultValue={editingItem?.price}
                                            name="price"
                                            min="0"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                        <select
                                            name="category"
                                            defaultValue={editingItem?.category || 'Meals'}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                                        >
                                            <option value="Meals">Meals</option>
                                            <option value="Beverages">Beverages</option>
                                            <option value="Snacks">Snacks</option>
                                            <option value="Desserts">Desserts</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                                    <input
                                        type="text"
                                        defaultValue={editingItem?.image || '/assets/burger.png'}
                                        name="image"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Use local assets (e.g., /assets/burger.png) or paste any valid image URL.</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        name="available"
                                        defaultChecked={editingItem ? editingItem.available : true}
                                        id="available"
                                        className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="available" className="text-sm text-gray-700">Available for ordering</label>
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition"
                                    >
                                        {editingItem ? 'Save Changes' : 'Add Item'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

const OrderCard = ({ order, onStatusUpdate, formatTime }) => {
    const [showTimeInput, setShowTimeInput] = React.useState(false);
    const [estimatedTime, setEstimatedTime] = React.useState(order.estimatedTime || 15);

    const handleAccept = () => {
        setShowTimeInput(true);
    };

    const handleConfirmTime = () => {
        onStatusUpdate(order.id, 'Preparing', estimatedTime);
        setShowTimeInput(false);
    };

    const statusColors = {
        Pending: 'border-l-4 border-blue-500',
        Preparing: 'border-l-4 border-orange-500',
        Ready: 'border-l-4 border-green-500',
        Completed: 'border-l-4 border-gray-500',
    };

    return (
        <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow ${statusColors[order.status]}`}>
            {/* Header */}
            <div className="flex justify-between items-start mb-3">
                <div>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Order #{order.id}</span>
                    <h4 className="font-bold text-gray-800 text-lg">{order.User?.name || 'Customer'}</h4>
                </div>
                <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full border border-gray-100">
                    {formatTime(order.createdAt)}
                </span>
            </div>

            {/* Items List */}
            <div className="bg-gray-50 rounded-lg p-3 mb-3">
                <ul className="space-y-1">
                    {order.OrderItems?.map((item, idx) => (
                        <li key={idx} className="text-sm text-gray-700 flex justify-between">
                            <span>{item.Menu?.name || 'Item'}</span>
                            <span className="font-semibold text-gray-900">x{item.quantity}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Estimated Time Badge */}
            {order.estimatedTime && (
                <div className="flex items-center gap-2 mb-3 text-xs text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md border border-blue-100 w-fit">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Est: {order.estimatedTime} mins</span>
                </div>
            )}

            {/* Footer & Actions */}
            <div className="pt-3 border-t border-gray-100 flex flex-col gap-3">
                {/* Price Row */}
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 font-medium">Total Amount</span>
                    <span className="text-xl font-bold text-gray-900">₹{parseFloat(order.totalAmount).toFixed(0)}</span>
                </div>

                {/* Action Buttons */}
                <div className="w-full">
                    {order.status === 'Pending' && !showTimeInput && (
                        <button
                            onClick={handleAccept}
                            className="w-full py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 active:scale-95 transition-all shadow-sm flex items-center justify-center gap-2"
                        >
                            <span>Accept Order</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </button>
                    )}

                    {showTimeInput && (
                        <div className="flex gap-2 items-center bg-gray-50 p-2 rounded-lg border border-gray-200 animate-fadeIn">
                            <div className="relative flex-1">
                                <input
                                    type="number"
                                    value={estimatedTime}
                                    onChange={(e) => setEstimatedTime(parseInt(e.target.value) || 0)}
                                    className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    placeholder="Min"
                                    autoFocus
                                />
                                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500">min</span>
                            </div>
                            <button
                                onClick={handleConfirmTime}
                                className="p-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition shadow-sm"
                                title="Confirm"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </button>
                            <button
                                onClick={() => setShowTimeInput(false)}
                                className="p-2 bg-gray-200 text-gray-600 rounded-md hover:bg-gray-300 transition"
                                title="Cancel"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    )}

                    {order.status === 'Preparing' && (
                        <button
                            onClick={() => onStatusUpdate(order.id, 'Ready')}
                            className="w-full py-2.5 bg-orange-500 text-white text-sm font-semibold rounded-lg hover:bg-orange-600 active:scale-95 transition-all shadow-sm flex items-center justify-center gap-2"
                        >
                            <span>Mark as Ready</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                            </svg>
                        </button>
                    )}

                    {order.status === 'Ready' && (
                        <button
                            onClick={() => onStatusUpdate(order.id, 'Completed')}
                            className="w-full py-2.5 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 active:scale-95 transition-all shadow-sm flex items-center justify-center gap-2"
                        >
                            <span>Complete Order</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

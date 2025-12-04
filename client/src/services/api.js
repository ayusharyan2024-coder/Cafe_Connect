// Use environment variable if available, otherwise fallback to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Helper to add timeout to fetch requests
const fetchWithTimeout = async (url, options = {}, timeout = 30000) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(id);
        return response;
    } catch (error) {
        clearTimeout(id);
        if (error.name === 'AbortError') {
            throw new Error('Request timeout - please try again');
        }
        throw error;
    }
};

const api = {
    // Auth endpoints
    signup: async (userData) => {
        const response = await fetchWithTimeout(`${API_BASE_URL}/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        }, 30000);
        return response.json();
    },

    login: async (credentials) => {
        const response = await fetchWithTimeout(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        }, 30000);
        return response.json();
    },

    // Menu endpoints
    getMenu: async (includeUnavailable = false) => {
        const url = includeUnavailable
            ? `${API_BASE_URL}/menu?includeUnavailable=true`
            : `${API_BASE_URL}/menu`;
        const response = await fetchWithTimeout(url, {}, 30000);
        return response.json();
    },

    createMenuItem: async (menuData, token) => {
        const response = await fetch(`${API_BASE_URL}/menu`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(menuData),
        });
        return response.json();
    },

    updateMenuItem: async (id, menuData, token) => {
        const response = await fetch(`${API_BASE_URL}/menu/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(menuData),
        });
        return response.json();
    },

    deleteMenuItem: async (id, token) => {
        const response = await fetch(`${API_BASE_URL}/menu/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        return response.json();
    },

    // Order endpoints
    placeOrder: async (orderData, token) => {
        const response = await fetch(`${API_BASE_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(orderData),
        });
        return response.json();
    },

    getUserOrders: async (userId, token) => {
        const response = await fetch(`${API_BASE_URL}/orders/user/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        return response.json();
    },

    getAllOrders: async (token) => {
        const response = await fetch(`${API_BASE_URL}/orders/all`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        return response.json();
    },

    updateOrderStatus: async (id, statusData, token) => {
        const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(statusData),
        });
        return response.json();
    },

    // Restaurant endpoints
    getRestaurants: async () => {
        const response = await fetchWithTimeout(`${API_BASE_URL}/restaurants`, {}, 30000);
        return response.json();
    },

    getRestaurantById: async (id) => {
        const response = await fetchWithTimeout(`${API_BASE_URL}/restaurants/${id}`, {}, 30000);
        return response.json();
    },

    createRestaurant: async (restaurantData, token) => {
        const response = await fetch(`${API_BASE_URL}/restaurants`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(restaurantData),
        });
        return response.json();
    },

    updateRestaurant: async (id, restaurantData, token) => {
        const response = await fetch(`${API_BASE_URL}/restaurants/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(restaurantData),
        });
        return response.json();
    },
};

export default api;

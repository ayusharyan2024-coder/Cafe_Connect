// Prefer explicit VITE_API_URL. When running in a browser (deployed), use a relative
// `/api` path so the frontend talks to the same origin (useful for Vercel rewrites).
// Fall back to localhost for local development when no window is available.
let API_BASE_URL = import.meta.env.VITE_API_URL || '';
if (!API_BASE_URL) {
    if (typeof window !== 'undefined' && window.location) {
        // Use a relative path so deployed frontend doesn't attempt to contact localhost
        API_BASE_URL = `${window.location.origin}/api`;
    } else {
        API_BASE_URL = 'http://localhost:5001/api';
    }
}

const api = {
    // Auth endpoints
    signup: async (userData) => {
        const response = await fetch(`${API_BASE_URL}/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        return response.json();
    },

    login: async (credentials) => {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });
        return response.json();
    },

    // Menu endpoints
    getMenu: async (includeUnavailable = false) => {
        const url = includeUnavailable
            ? `${API_BASE_URL}/menu?includeUnavailable=true`
            : `${API_BASE_URL}/menu`;
        const response = await fetch(url);
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
};

export default api;

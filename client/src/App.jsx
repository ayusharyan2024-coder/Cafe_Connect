import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CartPage from './pages/CartPage';
import UserOrdersPage from './pages/UserOrdersPage';
import RestaurantList from './pages/RestaurantList';
import RestaurantSetup from './pages/RestaurantSetup';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/restaurants" element={<RestaurantList />} />
            <Route path="/restaurant-setup" element={<RestaurantSetup />} />
            <Route path="/dashboard/user" element={<UserDashboard />} />
            <Route path="/dashboard/admin" element={<AdminDashboard />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/orders" element={<UserOrdersPage />} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import axios from 'axios';

function Dashboard() {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();
  const { getTotalItems, orders } = useCart();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check if user is logged in
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    // You can fetch user data here if needed
    // For now, we'll just show a basic dashboard
  }, [isLoggedIn, navigate]);

  const handleLogout = () => {
    logout();
    delete axios.defaults.headers.common['Authorization'];
    navigate('/login');
  };

  return (
    <div className="pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Welcome!</h3>
                <p className="text-blue-700">You have successfully logged in to your account.</p>
              </div>

              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-green-900 mb-2">Menu</h3>
                <p className="text-green-700">Browse our delicious menu items and place orders.</p>
                <button
                  onClick={() => navigate('/')}
                  className="mt-3 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  🍜 Browse Menu
                </button>
              </div>

              <div className="bg-orange-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-orange-900 mb-2">Cart</h3>
                <p className="text-orange-700">
                  {getTotalItems() > 0
                    ? `You have ${getTotalItems()} item${getTotalItems() > 1 ? 's' : ''} in your cart.`
                    : 'Your cart is empty.'
                  }
                </p>
                <button
                  onClick={() => navigate('/cart')}
                  className="mt-3 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
                >
                  View Cart
                </button>
              </div>

              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-900 mb-2">Orders</h3>
                <p className="text-purple-700">
                  {orders.length > 0
                    ? `You have ${orders.length} order${orders.length > 1 ? 's' : ''}.`
                    : 'No orders yet.'
                  }
                </p>
                <button
                  onClick={() => navigate('/orders')}
                  className="mt-3 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                >
                  View Orders
                </button>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => navigate('/')}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Browse Menu
                </button>
                <button
                  onClick={() => navigate('/cart')}
                  className="px-6 py-3 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
                >
                  View Cart ({getTotalItems()})
                </button>
                <button
                  onClick={() => navigate('/orders')}
                  className="px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                >
                  Order History
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

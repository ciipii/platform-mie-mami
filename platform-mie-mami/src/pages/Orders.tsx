import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

function Orders() {
  const { isLoggedIn } = useAuth();
  const { orders } = useCart();

  // Redirect to login if not authenticated
  if (!isLoggedIn) {
    return (
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Please Login</h1>
            <p className="text-gray-600 mb-6">You need to be logged in to view your orders.</p>
            <Link
              to="/login"
              className="bg-[#441E1B] hover:bg-[#5a2826] text-white px-6 py-3 rounded-md transition-colors"
            >
              Login Now
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-orange-100 text-orange-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'delivered': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'unpaid': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (orders.length === 0) {
    return (
      <div className="pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-6">
              <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">No Orders Yet</h1>
            <p className="text-gray-600 mb-6">You haven't placed any orders yet. Start browsing our menu!</p>
            <Link
              to="/"
              className="bg-[#441E1B] hover:bg-[#5a2826] text-white px-6 py-3 rounded-md transition-colors"
            >
              Browse Menu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Orders</h1>
          <Link
            to="/"
            className="bg-[#441E1B] hover:bg-[#5a2826] text-white px-4 py-2 rounded-md transition-colors"
          >
            Order More
          </Link>
        </div>

        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Order Header */}
              <div className="bg-gray-50 px-6 py-4 border-b">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Order #{order.id.split('-')[1]}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Placed on {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="space-y-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                      <br />
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(order.paymentStatus)}`}>
                        {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                      </span>
                    </div>
                    <p className="text-lg font-bold text-[#E64516] mt-2">
                      Rp {order.total.toLocaleString()}
                    </p>
                    {order.paymentMethod && (
                      <p className="text-sm text-gray-600 mt-1">
                        via {order.paymentMethod.toUpperCase()}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="px-6 py-4">
                <h4 className="font-medium text-gray-900 mb-3">Items Ordered:</h4>
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <span className="text-gray-600">{item.quantity}x</span>
                        <span className="text-gray-900">{item.name}</span>
                      </div>
                      <span className="text-gray-600">
                        Rp {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Customer Info */}
                {(order.customerName || order.customerPhone || order.deliveryAddress) && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-2">Delivery Information:</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      {order.customerName && (
                        <p><span className="font-medium">Name:</span> {order.customerName}</p>
                      )}
                      {order.customerPhone && (
                        <p><span className="font-medium">Phone:</span> {order.customerPhone}</p>
                      )}
                      {order.deliveryAddress && (
                        <p><span className="font-medium">Address:</span> {order.deliveryAddress}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Order Notes */}
                {order.notes && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-2">Order Notes:</h4>
                    <p className="text-sm text-gray-600">{order.notes}</p>
                  </div>
                )}
              </div>

              {/* Order Actions */}
              <div className="bg-gray-50 px-6 py-3 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Order ID: {order.id}
                </div>
                <div className="space-x-2">
                  {order.status === 'pending' && (
                    <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                      Cancel Order
                    </button>
                  )}
                  <button className="text-[#441E1B] hover:text-[#5a2826] text-sm font-medium">
                    Reorder
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 text-center">
          <div className="inline-flex space-x-4">
            <Link
              to="/cart"
              className="text-[#441E1B] hover:text-[#5a2826] font-medium"
            >
              View Cart
            </Link>
            <span className="text-gray-300">|</span>
            <Link
              to="/dashboard"
              className="text-[#441E1B] hover:text-[#5a2826] font-medium"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Orders;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import QRISPayment from '../components/QRISPayment';

function Cart() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice, clearCart, placeOrder, updateOrderPaymentStatus } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [showQRISPayment, setShowQRISPayment] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'cash' | 'transfer'>('qris');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    address: '',
    notes: ''
  });

  // Debug info
  console.log('Cart Debug Info:', {
    isLoggedIn,
    cartItemsLength: cartItems.length,
    cartItems: cartItems
  });

  // Redirect to login if not authenticated
  if (!isLoggedIn) {
    return (
      <div className="pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Please Login</h1>
            <p className="text-gray-600 mb-6">You need to be logged in to view your cart.</p>
            <div className="bg-yellow-100 p-4 rounded-md mb-4">
              <p className="text-sm text-yellow-800">
                Debug: isLoggedIn = {isLoggedIn.toString()}
              </p>
            </div>
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

  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleCheckout = async () => {
    console.log('🔥 CHECKOUT CLICKED!');
    console.log('Customer Info:', customerInfo);
    console.log('Payment Method:', paymentMethod);

    if (!customerInfo.name || !customerInfo.phone) {
      console.log('❌ Validation failed - missing name or phone');
      alert('Please fill in your name and phone number');
      return;
    }

    console.log('✅ Validation passed, starting checkout...');
    setIsCheckingOut(true);

    try {
      console.log('📦 Calling placeOrder...');
      const orderId = await placeOrder(customerInfo, paymentMethod);
      console.log('✅ Order placed successfully, ID:', orderId);
      setCurrentOrderId(orderId);

      if (paymentMethod === 'qris') {
        console.log('💳 QRIS payment selected, showing payment modal...');
        setShowCheckoutForm(false);
        setShowQRISPayment(true);
        console.log('🎯 QRIS modal should be visible now');
      } else {
        console.log('💰 Non-QRIS payment, redirecting to orders...');
        alert(`Order placed successfully! Order ID: ${orderId}`);
        navigate('/orders');
      }
    } catch (error) {
      console.error('❌ Error placing order:', error);
      alert(`Failed to place order: ${error.message || 'Unknown error'}`);
    } finally {
      console.log('🏁 Checkout process finished');
      setIsCheckingOut(false);
    }
  };

  const handlePaymentSuccess = () => {
    console.log('🎉 Payment successful! Order ID:', currentOrderId);
    updateOrderPaymentStatus(currentOrderId, 'paid');
    clearCart(); // Clear cart after successful payment
    setShowQRISPayment(false);
    alert('Payment successful! Your order has been confirmed.');
    navigate('/orders');
  };

  const handlePaymentCancel = () => {
    setShowQRISPayment(false);
    setShowCheckoutForm(true);
  };

  if (cartItems.length === 0) {
    return (
      <div className="pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-6">
              <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-6">Add some delicious items to your cart to get started!</p>

            {/* Debug Info */}
            <div className="bg-blue-100 p-4 rounded-md mb-4 text-left max-w-md mx-auto">
              <h3 className="font-semibold text-blue-900 mb-2">Debug Info:</h3>
              <p className="text-sm text-blue-800">isLoggedIn: {isLoggedIn.toString()}</p>
              <p className="text-sm text-blue-800">cartItems.length: {cartItems.length}</p>
              <p className="text-sm text-blue-800">localStorage cart: {localStorage.getItem('cart') || 'null'}</p>
            </div>

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
          <h1 className="text-3xl font-bold text-gray-900">Your Cart</h1>
          <div className="flex space-x-2">
            <button
              onClick={clearCart}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Clear Cart
            </button>
          </div>
        </div>

        {/* Debug Info Panel */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
          <h3 className="font-semibold text-yellow-900 mb-2">🔧 Debug Info:</h3>
          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
            <div>
              <p className="text-yellow-800">isLoggedIn: <span className="font-mono">{isLoggedIn.toString()}</span></p>
              <p className="text-yellow-800">cartItems.length: <span className="font-mono">{cartItems.length}</span></p>
              <p className="text-yellow-800">showCheckoutForm: <span className="font-mono">{showCheckoutForm.toString()}</span></p>
            </div>
            <div>
              <p className="text-yellow-800">showQRISPayment: <span className="font-mono">{showQRISPayment.toString()}</span></p>
              <p className="text-yellow-800">paymentMethod: <span className="font-mono">{paymentMethod}</span></p>
              <p className="text-yellow-800">isCheckingOut: <span className="font-mono">{isCheckingOut.toString()}</span></p>
            </div>
          </div>

          {/* Test Buttons */}
          <div className="flex space-x-2">
            <button
              onClick={() => {
                console.log('🧪 Test: Opening checkout form');
                setShowCheckoutForm(true);
              }}
              className="px-3 py-1 bg-blue-500 text-white text-xs rounded"
            >
              Test: Open Form
            </button>
            <button
              onClick={() => {
                console.log('🧪 Test: Opening QRIS payment');
                setCurrentOrderId('TEST-123');
                setShowQRISPayment(true);
              }}
              className="px-3 py-1 bg-green-500 text-white text-xs rounded"
            >
              Test: Open QRIS
            </button>
            <button
              onClick={() => {
                console.log('🧪 Test: Resetting all modals');
                setShowCheckoutForm(false);
                setShowQRISPayment(false);
              }}
              className="px-3 py-1 bg-red-500 text-white text-xs rounded"
            >
              Test: Reset
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Cart Items */}
          <div className="divide-y divide-gray-200">
            {cartItems.map((item) => (
              <div key={item.id} className="p-6 flex items-center space-x-4">
                <div className="flex-shrink-0">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-16 w-16 rounded-md object-cover"
                    />
                  ) : (
                    <div className="h-16 w-16 bg-gray-200 rounded-md flex items-center justify-center">
                      <span className="text-gray-400 text-xs">No Image</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                  <p className="text-[#E64516] font-semibold">Rp {item.price.toLocaleString()}</p>
                  {item.notes && (
                    <p className="text-sm text-gray-500 mt-1">Note: {item.notes}</p>
                  )}
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                  >
                    +
                  </button>
                </div>

                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">
                    Rp {(item.price * item.quantity).toLocaleString()}
                  </p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-600 hover:text-red-800 text-sm mt-1"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="bg-gray-50 px-6 py-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-medium text-gray-900">Total:</span>
              <span className="text-2xl font-bold text-[#E64516]">
                Rp {getTotalPrice().toLocaleString()}
              </span>
            </div>

            <div className="flex space-x-4">
              <Link
                to="/"
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-4 rounded-md text-center transition-colors"
              >
                Continue Shopping
              </Link>
              <button
                onClick={() => {
                  console.log('🛒 Checkout button clicked!');
                  setShowCheckoutForm(true);
                  console.log('📋 Checkout form should be visible now');
                }}
                className="flex-1 bg-[#441E1B] hover:bg-[#5a2826] text-white py-3 px-4 rounded-md transition-colors"
              >
                Checkout
              </button>
            </div>

          </div>
        </div>

        {/* Checkout Form Modal */}
        {showCheckoutForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h2 className="text-xl font-bold mb-4">Checkout Information</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Method *
                  </label>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('qris')}
                      className={`p-3 border rounded-md text-center transition-colors ${
                        paymentMethod === 'qris'
                          ? 'border-[#441E1B] bg-[#441E1B] text-white'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="text-sm font-medium">QRIS</div>
                      <div className="text-xs">Scan & Pay</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cash')}
                      className={`p-3 border rounded-md text-center transition-colors ${
                        paymentMethod === 'cash'
                          ? 'border-[#441E1B] bg-[#441E1B] text-white'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="text-sm font-medium">Cash</div>
                      <div className="text-xs">Pay on Delivery</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('transfer')}
                      className={`p-3 border rounded-md text-center transition-colors ${
                        paymentMethod === 'transfer'
                          ? 'border-[#441E1B] bg-[#441E1B] text-white'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="text-sm font-medium">Transfer</div>
                      <div className="text-xs">Bank Transfer</div>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#441E1B]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#441E1B]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Delivery Address
                  </label>
                  <textarea
                    value={customerInfo.address}
                    onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#441E1B]"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Order Notes
                  </label>
                  <textarea
                    value={customerInfo.notes}
                    onChange={(e) => setCustomerInfo({...customerInfo, notes: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#441E1B]"
                    rows={2}
                    placeholder="Any special instructions..."
                  />
                </div>
              </div>

              <div className="flex space-x-4 mt-6">
                <button
                  onClick={() => setShowCheckoutForm(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="flex-1 bg-[#441E1B] hover:bg-[#5a2826] text-white py-2 px-4 rounded-md transition-colors disabled:opacity-50"
                >
                  {isCheckingOut
                    ? 'Placing Order...'
                    : paymentMethod === 'qris'
                      ? 'Pay with QRIS'
                      : paymentMethod === 'cash'
                        ? 'Order (Pay on Delivery)'
                        : 'Order (Bank Transfer)'
                  }
                </button>
              </div>
            </div>
          </div>
        )}

        {/* QRIS Payment Modal */}
        {showQRISPayment && (
          <QRISPayment
            amount={getTotalPrice()}
            orderId={currentOrderId}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentCancel={handlePaymentCancel}
          />
        )}
      </div>
    </div>
  );
}

export default Cart;

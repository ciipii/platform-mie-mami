import React, { useState } from 'react';
import { MenuItem } from '../services/menuService';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

interface MenuCardProps {
  item: MenuItem;
}

function MenuCard({ item }: MenuCardProps) {
  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      alert('Please login to add items to cart');
      return;
    }

    setIsAdding(true);
    try {
      addToCart(item, 1);
      // Show success feedback
      setTimeout(() => setIsAdding(false), 500);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setIsAdding(false);
    }
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <div className="relative">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        {item.popular && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            Popular
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
          <h3 className="text-white font-bold text-lg">{item.name}</h3>
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-500 text-sm">{item.category}</span>
          <span className="text-[#E64516] font-semibold">Rp {item.price.toLocaleString()}</span>
        </div>
        <p className="text-gray-600 text-sm line-clamp-2 mb-3">{item.description}</p>
        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className={`w-full py-2 rounded-md transition-colors ${
            isAdding
              ? 'bg-green-500 text-white'
              : 'bg-[#441E1B] hover:bg-[#5a2826] text-white'
          }`}
        >
          {isAdding ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Added!
            </span>
          ) : (
            'Add to Cart'
          )}
        </button>
      </div>
    </div>
  );
}

export default MenuCard;

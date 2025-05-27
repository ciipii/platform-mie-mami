import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MenuItem } from '../services/menuService';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  notes?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  paymentStatus: 'unpaid' | 'pending' | 'paid' | 'failed';
  paymentMethod?: 'qris' | 'cash' | 'transfer';
  createdAt: Date;
  customerName?: string;
  customerPhone?: string;
  deliveryAddress?: string;
  notes?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  orders: Order[];
  addToCart: (item: MenuItem, quantity?: number, notes?: string) => void;
  removeFromCart: (itemId: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  placeOrder: (customerInfo: { name: string; phone: string; address?: string; notes?: string }, paymentMethod?: 'qris' | 'cash' | 'transfer') => Promise<string>;
  updateOrderPaymentStatus: (orderId: string, paymentStatus: 'unpaid' | 'pending' | 'paid' | 'failed') => void;
  getOrderById: (orderId: string) => Order | undefined;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // Load cart and orders from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const savedOrders = localStorage.getItem('orders');

    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }

    if (savedOrders) {
      try {
        const parsedOrders = JSON.parse(savedOrders);
        // Convert date strings back to Date objects
        const ordersWithDates = parsedOrders.map((order: any) => ({
          ...order,
          createdAt: new Date(order.createdAt)
        }));
        setOrders(ordersWithDates);
      } catch (error) {
        console.error('Error loading orders from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Save orders to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  const addToCart = (item: MenuItem, quantity: number = 1, notes?: string) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(cartItem => cartItem.id === item.id);

      if (existingItem) {
        return prevItems.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + quantity, notes: notes || cartItem.notes }
            : cartItem
        );
      } else {
        return [...prevItems, {
          id: item.id,
          name: item.name,
          price: item.price,
          quantity,
          image: item.image,
          notes
        }];
      }
    });
  };

  const removeFromCart = (itemId: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const placeOrder = async (customerInfo: { name: string; phone: string; address?: string; notes?: string }, paymentMethod: 'qris' | 'cash' | 'transfer' = 'qris'): Promise<string> => {
    console.log('🏪 PlaceOrder called with:', { customerInfo, paymentMethod, cartItemsLength: cartItems.length });

    if (cartItems.length === 0) {
      console.log('❌ Cart is empty, throwing error');
      throw new Error('Cart is empty');
    }

    const orderId = `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    console.log('🆔 Generated order ID:', orderId);

    const newOrder: Order = {
      id: orderId,
      items: [...cartItems],
      total: getTotalPrice(),
      status: 'pending',
      paymentStatus: paymentMethod === 'cash' ? 'unpaid' : 'pending',
      paymentMethod,
      createdAt: new Date(),
      customerName: customerInfo.name,
      customerPhone: customerInfo.phone,
      deliveryAddress: customerInfo.address,
      notes: customerInfo.notes
    };

    console.log('📋 Created order object:', newOrder);
    setOrders(prevOrders => [newOrder, ...prevOrders]);

    // Only clear cart for cash payments (immediate completion)
    // For QRIS and transfer, keep cart until payment is confirmed
    if (paymentMethod === 'cash') {
      console.log('💰 Cash payment - clearing cart immediately');
      clearCart();
    } else {
      console.log('💳 Digital payment - keeping cart until payment confirmation');
    }

    console.log('✅ Order placed successfully, returning ID:', orderId);
    return orderId;
  };

  const updateOrderPaymentStatus = (orderId: string, paymentStatus: 'unpaid' | 'pending' | 'paid' | 'failed') => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId
          ? { ...order, paymentStatus, status: paymentStatus === 'paid' ? 'confirmed' : order.status }
          : order
      )
    );
  };

  const getOrderById = (orderId: string): Order | undefined => {
    return orders.find(order => order.id === orderId);
  };

  const value = {
    cartItems,
    orders,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    placeOrder,
    updateOrderPaymentStatus,
    getOrderById,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { cartService } from '../api/supabase';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  const loadCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCartItems([]);
      return;
    }

    try {
      setLoading(true);
      const items = await cartService.get();
      setCartItems(items || []);
    } catch (err) {
      console.error('Failed to load cart:', err);
      setError('Failed to load cart');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      loadCart();
    } else {
      setCartItems([]);
    }
  }, [isAuthenticated, loadCart]);

  const addToCart = async (productId, quantity = 1) => {
    try {
      setError(null);
      await cartService.add(productId, quantity);
      await loadCart();
      return { success: true };
    } catch (err) {
      const errorMessage = err.message || 'Failed to add item to cart';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const removeFromCart = async (productId) => {
    try {
      setError(null);
      // Find cart item by product_id
      const cartItem = cartItems.find(item => item.product_id === productId);
      if (cartItem) {
        await cartService.remove(cartItem.id);
      }
      await loadCart();
      return { success: true };
    } catch (err) {
      const errorMessage = err.message || 'Failed to remove item from cart';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      return removeFromCart(productId);
    }

    try {
      setError(null);
      const cartItem = cartItems.find(item => item.product_id === productId);
      if (cartItem) {
        await cartService.update(cartItem.id, quantity);
      }
      await loadCart();
      return { success: true };
    } catch (err) {
      const errorMessage = err.message || 'Failed to update quantity';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const clearCart = async () => {
    try {
      setError(null);
      await cartService.clear();
      setCartItems([]);
      return { success: true };
    } catch (err) {
      const errorMessage = err.message || 'Failed to clear cart';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.subtotal || item.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartItem = (productId) => {
    return cartItems.find(item => item.product_id === productId);
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    cartItems,
    loading,
    error,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
    getCartItem,
    clearError,
    isEmpty: cartItems.length === 0,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
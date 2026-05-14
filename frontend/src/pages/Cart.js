import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

  const cartTotal = getCartTotal();
  const tax = cartTotal * 0.08;
  const shipping = cartTotal >= 50 ? 0 : 5.99;
  const total = cartTotal + tax + shipping;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag size={64} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">购物车是空的</h2>
          <p className="text-gray-600 mb-6">开始添加商品到购物车吧</p>
          <Link to="/products" className="btn-primary">
            浏览商品
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">购物车</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-soft">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">购物车商品 ({cartItems.length})</h2>
              </div>

              <div className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <div key={item.product_id} className="p-6 flex items-center space-x-4">
                    <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                      {item.image_url ? (
                        <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="w-full h-full object-contain rounded-lg"
                          />
                        </div>
                      ) : (
                        <span className="text-gray-400 text-lg">📦</span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-gray-900 truncate">{item.name}</h3>
                      <p className="text-gray-500">{formatPrice(item.price)} / 件</p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>
                      <span className="text-lg font-medium text-gray-900 w-12 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-medium text-gray-900">
                        {formatPrice(item.subtotal)}
                      </p>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product_id)}
                      className="p-2 text-gray-400 hover:text-accent-600 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              <div className="p-6 border-t border-gray-200">
                <button
                  onClick={clearCart}
                  className="text-accent-600 hover:text-accent-700 font-medium"
                >
                  清空购物车
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-soft p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">订单摘要</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>小计</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>税费 (8%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>运费</span>
                  <span>{shipping === 0 ? '免费' : formatPrice(shipping)}</span>
                </div>
                {shipping > 0 && (
                  <div className="text-xs text-primary-600">
                    再消费 ${(50 - cartTotal).toFixed(2)} 即可享受免费配送
                  </div>
                )}
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-semibold text-gray-900">
                    <span>合计</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => window.location.href = '/checkout'}
                  className="w-full btn-primary py-3 text-lg font-medium"
                >
                  去结账
                </button>

                <Link
                  to="/products"
                  className="w-full btn-secondary py-3 text-lg font-medium text-center block"
                >
                  继续购物
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
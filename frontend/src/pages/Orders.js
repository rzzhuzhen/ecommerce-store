import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../api/supabase';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      loadOrders();
    }
  }, [isAuthenticated]);

  const loadOrders = async () => {
    try {
      const data = await orderService.getUserOrders();
      setOrders(data || []);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: '处理中' },
      processing: { color: 'bg-blue-100 text-blue-800 border-blue-200', label: '配送中' },
      shipped: { color: 'bg-purple-100 text-purple-800 border-purple-200', label: '已发货' },
      delivered: { color: 'bg-green-100 text-green-800 border-green-200', label: '已送达' },
      cancelled: { color: 'bg-red-100 text-red-800 border-red-200', label: '已取消' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'CNY',
    }).format(price);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">请先登录</h2>
          <p className="text-gray-600 mb-6">登录后即可查看您的订单</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">我的订单</h1>

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">暂无订单</h3>
            <p className="text-gray-600 mb-6">开始购物吧！</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">订单 #{order.id.slice(0, 8)}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        下单于 {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-3">
                    {order.order_items?.map((item, index) => (
                      <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center shadow-sm border border-gray-200 flex-shrink-0">
                          {item.image_url ? (
                            <div className="w-14 h-14 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                              <img
                                src={item.image_url}
                                alt={item.name}
                                className="w-full h-full object-contain rounded-md"
                              />
                            </div>
                          ) : (
                            <span className="text-gray-400 text-lg">📦</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">{item.name}</h4>
                          <p className="text-sm text-gray-500">数量: {item.quantity}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className="font-semibold text-gray-900 text-lg">
                            {formatPrice(item.subtotal)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>小计</span>
                      <span>{formatPrice(order.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>税费</span>
                      <span>{formatPrice(order.tax)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>运费</span>
                      <span>{formatPrice(order.shipping)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold text-gray-900 pt-2 border-t border-gray-200">
                      <span>合计</span>
                      <span>{formatPrice(order.total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
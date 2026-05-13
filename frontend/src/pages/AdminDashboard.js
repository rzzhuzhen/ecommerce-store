import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { productService } from '../api/supabase';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total_products: 0,
    total_orders: 0,
    total_revenue: 0,
    pending_orders: 0,
    low_stock_products: 0
  });
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, isAdmin } = useAuth();

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      loadStats();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, isAdmin]);

  const loadStats = async () => {
    try {
      const products = await productService.getAll();
      const lowStock = products?.filter(p => p.stock <= 10 && p.stock > 0).length || 0;

      setStats({
        total_products: products?.length || 0,
        total_orders: 0,
        total_revenue: 0,
        pending_orders: 0,
        low_stock_products: lowStock
      });
    } catch (error) {
      console.error('Failed to load admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Please sign in</h2>
          <p className="text-gray-600 mb-6">You need to be signed in to access the admin dashboard</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">You don't have permission to access the admin dashboard</p>
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-soft p-6">
            <div className="flex items-center">
              <div className="p-3 bg-primary-100 rounded-lg">
                <span className="text-2xl">📦</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total_products}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-soft p-6">
            <div className="flex items-center">
              <div className="p-3 bg-success-100 rounded-lg">
                <span className="text-2xl">📋</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total_orders}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-soft p-6">
            <div className="flex items-center">
              <div className="p-3 bg-accent-100 rounded-lg">
                <span className="text-2xl">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${stats.total_revenue.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-soft p-6">
            <div className="flex items-center">
              <div className="p-3 bg-warning-100 rounded-lg">
                <span className="text-2xl">⏳</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending_orders}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-soft p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link to="/products" className="w-full btn-primary py-2 text-center block">
                View All Products
              </Link>
              <button className="w-full btn-secondary py-2">
                Manage Orders (Coming Soon)
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-soft p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                <span className="text-sm text-gray-600">Admin dashboard ready</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-success-600 rounded-full"></div>
                <span className="text-sm text-gray-600">Products loaded from Supabase</span>
              </div>
            </div>
          </div>
        </div>

        {/* Low Stock Alert */}
        {stats.low_stock_products > 0 && (
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">⚠️</span>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-yellow-800">
                  Low Stock Alert
                </h3>
                <p className="text-yellow-700">
                  You have {stats.low_stock_products} products with low stock that need attention.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
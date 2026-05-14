import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { productService, storageService } from '../api/supabase';
import { createClient } from '../utils/supabase';

const supabase = createClient();

const AdminDashboard = () => {
  const [view, setView] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);
  const { isAuthenticated, isAdmin } = useAuth();

  const [stats, setStats] = useState({
    total_products: 0,
    total_orders: 0,
    total_revenue: 0,
    pending_orders: 0,
    low_stock_products: 0
  });

  const [editProduct, setEditProduct] = useState({
    id: null,
    name: '',
    description: '',
    price: 0,
    category: '',
    image_url: '',
    stock: 0,
    rating: 0,
    is_featured: false
  });

  const categories = ['Electronics', 'Clothing', 'Sports', 'Home & Garden', 'Other'];

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, isAdmin]);

  const loadData = async () => {
    try {
      const productsData = await productService.getAll();
      setProducts(productsData || []);
      const lowStock = productsData?.filter(p => p.stock <= 10 && p.stock > 0).length || 0;
      setStats({
        total_products: productsData?.length || 0,
        total_orders: 0,
        total_revenue: 0,
        pending_orders: 0,
        low_stock_products: lowStock
      });
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      const imageUrl = await storageService.uploadProductImage(file, user.id);
      setEditProduct(prev => ({ ...prev, image_url: imageUrl }));
      setSuccess('Image uploaded successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to upload image: ' + err.message);
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleSaveProduct = async () => {
    setSaving(true);
    setError('');
    try {
      if (editProduct.id) {
        const { error } = await supabase
          .from('products')
          .update({
            name: editProduct.name,
            description: editProduct.description,
            price: parseFloat(editProduct.price),
            category: editProduct.category,
            image_url: editProduct.image_url,
            stock: parseInt(editProduct.stock),
            is_featured: editProduct.is_featured,
          })
          .eq('id', editProduct.id);
        if (error) throw error;
        setSuccess('Product updated successfully!');
      } else {
        const { error } = await supabase
          .from('products')
          .insert({
            name: editProduct.name,
            description: editProduct.description,
            price: parseFloat(editProduct.price),
            category: editProduct.category,
            image_url: editProduct.image_url,
            stock: parseInt(editProduct.stock),
          });
        if (error) throw error;
        setSuccess('Product created successfully!');
      }
      setEditProduct({ id: null, name: '', description: '', price: 0, category: '', image_url: '', stock: 0, rating: 0, is_featured: false });
      await loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const handleDeleteProduct = async (id) => {
    // eslint-disable-next-line no-restricted-globals
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      setSuccess('Product deleted successfully!');
      await loadData();
    } catch (err) {
      setError('Failed to delete product: ' + err.message);
    }
    setTimeout(() => setSuccess(''), 3000);
  };

  const startEdit = (product) => {
    setEditProduct({
      id: product.id,
      name: product.name,
      description: product.description || '',
      price: product.price,
      category: product.category || '',
      image_url: product.image_url || '',
      stock: product.stock,
      rating: product.rating || 0,
      is_featured: product.is_featured || false
    });
    setView('edit');
  };

  const startCreate = () => {
    setEditProduct({ id: null, name: '', description: '', price: 0, category: '', image_url: '', stock: 0, rating: 0, is_featured: false });
    setView('edit');
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

  if (view === 'edit') {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {editProduct.id ? 'Edit Product' : 'Add New Product'}
            </h1>
            <button onClick={() => setView('dashboard')} className="text-gray-600 hover:text-gray-900">
              ← Back to Dashboard
            </button>
          </div>

          {error && <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4">{error}</div>}
          {success && <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-4">{success}</div>}

          <div className="bg-white rounded-lg shadow-soft p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Product Name</label>
                <input type="text" value={editProduct.name} onChange={e => setEditProduct(p => ({ ...p, name: e.target.value }))}
                  className="input-field mt-1" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select value={editProduct.category} onChange={e => setEditProduct(p => ({ ...p, category: e.target.value }))}
                  className="input-field mt-1">
                  <option value="">Select category</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea value={editProduct.description} onChange={e => setEditProduct(p => ({ ...p, description: e.target.value }))}
                rows={3} className="input-field mt-1" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Price ($)</label>
                <input type="number" step="0.01" value={editProduct.price} onChange={e => setEditProduct(p => ({ ...p, price: e.target.value }))}
                  className="input-field mt-1" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Stock</label>
                <input type="number" value={editProduct.stock} onChange={e => setEditProduct(p => ({ ...p, stock: e.target.value }))}
                  className="input-field mt-1" required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Product Image</label>
              {editProduct.image_url && (
                <div className="mt-2 mb-2">
                  <img src={editProduct.image_url} alt="Preview" className="h-32 w-32 object-cover rounded" />
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleImageUpload} ref={fileInputRef} className="mt-1" />
              <p className="text-xs text-gray-500 mt-1">Upload an image to set as product image</p>
            </div>

            <div className="flex items-center">
              <input type="checkbox" id="is_featured" checked={editProduct.is_featured}
                onChange={e => setEditProduct(p => ({ ...p, is_featured: e.target.checked }))} className="mr-2" />
              <label htmlFor="is_featured" className="text-sm font-medium text-gray-700">Featured Product</label>
            </div>

            <div className="flex gap-3">
              <button onClick={handleSaveProduct} disabled={saving}
                className="btn-primary">
                {saving ? 'Saving...' : 'Save Product'}
              </button>
              <button onClick={() => setView('dashboard')} className="btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        {error && <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4">{error}</div>}
        {success && <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-4">{success}</div>}

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

        {/* Products Management */}
        <div className="bg-white rounded-lg shadow-soft p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Products</h2>
            <button onClick={startCreate} className="btn-primary">
              + Add Product
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Image</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Name</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Category</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Price</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Stock</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Featured</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map(product => (
                  <tr key={product.id}>
                    <td className="px-4 py-2">
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="h-12 w-12 object-cover rounded" />
                      ) : (
                        <div className="h-12 w-12 bg-gray-200 rounded flex items-center justify-center text-gray-400">-</div>
                      )}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900">{product.name}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">{product.category || '-'}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">${product.price?.toFixed(2)}</td>
                    <td className="px-4 py-2 text-sm">
                      <span className={product.stock <= 10 ? 'text-red-600 font-medium' : 'text-gray-900'}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-sm">{product.is_featured ? '✓' : '-'}</td>
                    <td className="px-4 py-2 text-sm">
                      <button onClick={() => startEdit(product)} className="text-primary-600 hover:text-primary-800 mr-3">
                        Edit
                      </button>
                      <button onClick={() => handleDeleteProduct(product.id)} className="text-red-600 hover:text-red-800">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
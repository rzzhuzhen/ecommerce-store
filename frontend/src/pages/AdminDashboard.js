import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { productService, storageService, orderService, profileService } from '../api/supabase';
import { createClient } from '../utils/supabase';
import { Search, Package, Users, FileText, BarChart3, ChevronRight, X } from 'lucide-react';

const supabase = createClient();

const AdminDashboard = () => {
  const [view, setView] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [profiles, setProfiles] = useState([]);
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

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [customerSearch, setCustomerSearch] = useState('');
  const [orderFilter, setOrderFilter] = useState('all');
  const [salesStats, setSalesStats] = useState(null);

  const categories = ['Electronics', 'Clothing', 'Sports', 'Home & Garden', 'Other'];

  const navItems = [
    { id: 'dashboard', label: '控制台', icon: '📊' },
    { id: 'products', label: '商品管理', icon: '📦' },
    { id: 'customers', label: '客户管理', icon: '👥' },
    { id: 'orders', label: '订单管理', icon: '📋' },
    { id: 'reports', label: '销售报表', icon: '📈' },
  ];

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, isAdmin]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsData, ordersData, profilesData] = await Promise.all([
        productService.getAll(),
        orderService.getAllOrders(),
        profileService.getAll(),
      ]);
      setProducts(productsData || []);
      setOrders(ordersData || []);
      setProfiles(profilesData || []);

      const lowStock = productsData?.filter(p => p.stock <= 10 && p.stock > 0).length || 0;
      const pendingCount = ordersData?.filter(o => o.status === 'pending' || o.status === 'processing').length || 0;
      const totalRevenue = ordersData?.reduce((sum, o) => {
        if (o.status === 'delivered' || o.status === 'completed') {
          return sum + parseFloat(o.total || 0);
        }
        return sum;
      }, 0) || 0;

      setStats({
        total_products: productsData?.length || 0,
        total_orders: ordersData?.length || 0,
        total_revenue: totalRevenue,
        pending_orders: pendingCount,
        low_stock_products: lowStock
      });
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSalesStats = async () => {
    try {
      const data = await orderService.getSalesStats();
      setSalesStats(data);
    } catch (error) {
      console.error('Failed to load sales stats:', error);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      const imageUrl = await storageService.uploadProductImage(file, user.id);
      setEditProduct(prev => ({ ...prev, image_url: imageUrl }));
      setSuccess('图片上传成功！');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('图片上传失败: ' + err.message);
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
        setSuccess('商品更新成功！');
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
        setSuccess('商品创建成功！');
      }
      setEditProduct({ id: null, name: '', description: '', price: 0, category: '', image_url: '', stock: 0, rating: 0, is_featured: false });
      await loadData();
      setView('products');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const handleDeleteProduct = async (id) => {
    // eslint-disable-next-line no-restricted-globals
    if (!confirm('确定要删除此商品吗？')) return;
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      setSuccess('商品删除成功！');
      await loadData();
    } catch (err) {
      setError('删除商品失败: ' + err.message);
    }
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await orderService.updateStatus(orderId, status);
      setSuccess('订单状态已更新！');
      await loadData();
      if (selectedOrder) {
        setSelectedOrder({ ...selectedOrder, status });
      }
    } catch (err) {
      setError('更新订单状态失败: ' + err.message);
    }
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleUpdateProfileRole = async (profileId, newRole) => {
    // eslint-disable-next-line no-restricted-globals
    if (!confirm(`确定要将该用户角色修改为 ${newRole === 'admin' ? '管理员' : '普通用户'} 吗？`)) return;
    try {
      await profileService.updateRole(profileId, newRole);
      setSuccess('用户角色已更新！');
      await loadData();
    } catch (err) {
      setError('更新用户角色失败: ' + err.message);
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
    setView('edit-product');
  };

  const startCreate = () => {
    setEditProduct({ id: null, name: '', description: '', price: 0, category: '', image_url: '', stock: 0, rating: 0, is_featured: false });
    setView('edit-product');
  };

  const viewOrderDetail = (order) => {
    setSelectedOrder(order);
    setView('order-detail');
  };

  const filteredProfiles = profiles.filter(p => {
    const searchLower = customerSearch.toLowerCase();
    return (
      (!customerSearch) ||
      (p.full_name && p.full_name.toLowerCase().includes(searchLower)) ||
      (p.email && p.email.toLowerCase().includes(searchLower))
    );
  });

  const filteredOrders = orders.filter(o => {
    if (orderFilter === 'all') return true;
    return o.status === orderFilter;
  });

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    const labels = {
      pending: '待处理',
      processing: '处理中',
      shipped: '已发货',
      delivered: '已送达',
      completed: '已完成',
      cancelled: '已取消',
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
        {labels[status] || status}
      </span>
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">请先登录</h2>
          <p className="text-gray-600 mb-6">登录后才能访问管理后台</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">访问被拒绝</h2>
          <p className="text-gray-600 mb-6">您没有权限访问管理后台</p>
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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-strong border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">管理后台</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                setView(item.id);
                if (item.id === 'reports') loadSalesStats();
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                view === item.id || view === item.id + '-detail'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {error && <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4">{error}</div>}
          {success && <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-4">{success}</div>}

          {/* Dashboard View */}
          {view === 'dashboard' && (
            <>
              <h1 className="text-3xl font-bold text-gray-900 mb-8">控制台</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-soft p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-primary-100 rounded-lg">
                      <span className="text-2xl">📦</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">商品总数</p>
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
                      <p className="text-sm font-medium text-gray-600">订单总数</p>
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
                      <p className="text-sm font-medium text-gray-600">总收入</p>
                      <p className="text-2xl font-bold text-gray-900">¥{stats.total_revenue.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-soft p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-warning-100 rounded-lg">
                      <span className="text-2xl">⏳</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">待处理订单</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.pending_orders}</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Products View */}
          {view === 'products' && (
            <>
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-900">商品管理</h1>
                <button onClick={startCreate} className="btn-primary">
                  + 添加商品
                </button>
              </div>
              <div className="bg-white rounded-lg shadow-soft p-6">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">图片</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">名称</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">分类</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">价格</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">库存</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">精选</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">操作</th>
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
                          <td className="px-4 py-2 text-sm text-gray-900">¥{product.price?.toFixed(2)}</td>
                          <td className="px-4 py-2 text-sm">
                            <span className={product.stock <= 10 ? 'text-red-600 font-medium' : 'text-gray-900'}>
                              {product.stock}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-sm">{product.is_featured ? '✓' : '-'}</td>
                          <td className="px-4 py-2 text-sm">
                            <button onClick={() => startEdit(product)} className="text-primary-600 hover:text-primary-800 mr-3">
                              编辑
                            </button>
                            <button onClick={() => handleDeleteProduct(product.id)} className="text-red-600 hover:text-red-800">
                              删除
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* Customers View */}
          {view === 'customers' && (
            <>
              <h1 className="text-3xl font-bold text-gray-900 mb-8">客户管理</h1>
              <div className="bg-white rounded-lg shadow-soft p-6 mb-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="搜索客户姓名或邮箱..."
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-soft overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">用户</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">邮箱</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">角色</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">注册时间</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">操作</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredProfiles.map(profile => (
                      <tr key={profile.id}>
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-medium">
                              {profile.full_name ? profile.full_name.charAt(0).toUpperCase() : profile.email.charAt(0).toUpperCase()}
                            </div>
                            <span className="ml-3 text-sm text-gray-900">{profile.full_name || '-'}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{profile.email}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            profile.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {profile.role === 'admin' ? '管理员' : '普通用户'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {new Date(profile.created_at).toLocaleDateString('zh-CN')}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleUpdateProfileRole(profile.id, profile.role === 'admin' ? 'customer' : 'admin')}
                            className="text-primary-600 hover:text-primary-800 text-sm"
                          >
                            改为{profile.role === 'admin' ? '普通用户' : '管理员'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Orders View */}
          {view === 'orders' && (
            <>
              <h1 className="text-3xl font-bold text-gray-900 mb-8">订单管理</h1>
              <div className="bg-white rounded-lg shadow-soft p-4 mb-6">
                <div className="flex space-x-2">
                  {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(status => (
                    <button
                      key={status}
                      onClick={() => setOrderFilter(status)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        orderFilter === status
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {status === 'all' ? '全部' :
                       status === 'pending' ? '待处理' :
                       status === 'processing' ? '处理中' :
                       status === 'shipped' ? '已发货' :
                       status === 'delivered' ? '已完成' : '已取消'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-soft overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">订单号</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">客户</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">金额</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">状态</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">时间</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">操作</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredOrders.map(order => (
                      <tr key={order.id}>
                        <td className="px-4 py-3 text-sm text-gray-900 font-mono">{order.id.slice(0, 8)}...</td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {order.profiles?.full_name || order.profiles?.email?.split('@')[0] || '-'}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 font-medium">¥{parseFloat(order.total).toFixed(2)}</td>
                        <td className="px-4 py-3">{getStatusBadge(order.status)}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {new Date(order.created_at).toLocaleDateString('zh-CN')}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => viewOrderDetail(order)}
                            className="text-primary-600 hover:text-primary-800 text-sm"
                          >
                            查看详情
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Order Detail View */}
          {view === 'order-detail' && selectedOrder && (
            <>
              <div className="flex items-center mb-6">
                <button onClick={() => setView('orders')} className="text-gray-600 hover:text-gray-900 mr-4">
                  ← 返回订单列表
                </button>
                <h1 className="text-3xl font-bold text-gray-900">订单详情</h1>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-soft p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">订单信息</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">订单号</span>
                      <span className="text-gray-900 font-mono text-sm">{selectedOrder.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">状态</span>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(selectedOrder.status)}
                        <select
                          value={selectedOrder.status}
                          onChange={(e) => handleUpdateOrderStatus(selectedOrder.id, e.target.value)}
                          className="text-sm border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="pending">待处理</option>
                          <option value="processing">处理中</option>
                          <option value="shipped">已发货</option>
                          <option value="delivered">已送达</option>
                          <option value="cancelled">已取消</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">下单时间</span>
                      <span className="text-gray-900">{new Date(selectedOrder.created_at).toLocaleString('zh-CN')}</span>
                    </div>
                    {selectedOrder.shipping_address && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">收货地址</span>
                        <span className="text-gray-900 text-right text-sm">
                          {typeof selectedOrder.shipping_address === 'string'
                            ? selectedOrder.shipping_address
                            : JSON.stringify(selectedOrder.shipping_address)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-soft p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">金额明细</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">商品小计</span>
                      <span className="text-gray-900">¥{parseFloat(selectedOrder.subtotal || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">税费</span>
                      <span className="text-gray-900">¥{parseFloat(selectedOrder.tax || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">运费</span>
                      <span className="text-gray-900">¥{parseFloat(selectedOrder.shipping || 0).toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-3 flex justify-between">
                      <span className="font-semibold text-gray-900">总计</span>
                      <span className="font-bold text-xl text-primary-600">¥{parseFloat(selectedOrder.total || 0).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-soft p-6 mt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">商品列表</h2>
                <div className="space-y-4">
                  {selectedOrder.order_items?.map((item, index) => (
                    <div key={index} className="flex items-center border-b border-gray-100 pb-4">
                      {item.image_url && (
                        <img src={item.image_url} alt={item.name} className="w-16 h-16 object-cover rounded" />
                      )}
                      <div className="ml-4 flex-1">
                        <p className="text-gray-900 font-medium">{item.name}</p>
                        <p className="text-gray-600 text-sm">¥{parseFloat(item.price).toFixed(2)} x {item.quantity}</p>
                      </div>
                      <span className="text-gray-900 font-medium">¥{parseFloat(item.subtotal).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Reports View */}
          {view === 'reports' && (
            <>
              <h1 className="text-3xl font-bold text-gray-900 mb-8">销售报表</h1>
              {salesStats && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-soft p-6">
                      <p className="text-sm font-medium text-gray-600 mb-2">总销售额</p>
                      <p className="text-3xl font-bold text-primary-600">¥{salesStats.total_revenue.toFixed(2)}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-soft p-6">
                      <p className="text-sm font-medium text-gray-600 mb-2">完成订单数</p>
                      <p className="text-3xl font-bold text-success-600">{salesStats.completed_orders}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-soft p-6">
                      <p className="text-sm font-medium text-gray-600 mb-2">平均订单金额</p>
                      <p className="text-3xl font-bold text-accent-600">
                        ¥{salesStats.completed_orders > 0 ? (salesStats.total_revenue / salesStats.completed_orders).toFixed(2) : '0.00'}
                      </p>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow-soft p-6 mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">月度销售趋势</h2>
                    <div className="flex items-end justify-around h-48 space-x-2">
                      {Object.entries(salesStats.monthly_data || {}).slice(-6).map(([month, data]) => {
                        const maxRevenue = Math.max(...Object.values(salesStats.monthly_data || {}).map(m => m.revenue), 1);
                        const height = (data.revenue / maxRevenue) * 100;
                        return (
                          <div key={month} className="flex flex-col items-center">
                            <div className="w-12 bg-primary-500 rounded-t" style={{ height: `${height}%`, minHeight: '4px' }}></div>
                            <span className="text-xs text-gray-600 mt-2">{month.slice(5)}月</span>
                            <span className="text-xs text-gray-500">¥{data.revenue.toFixed(0)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {/* Edit Product View */}
          {view === 'edit-product' && (
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                  {editProduct.id ? '编辑商品' : '添加新商品'}
                </h1>
                <button onClick={() => setView('products')} className="text-gray-600 hover:text-gray-900">
                  ← 返回商品管理
                </button>
              </div>

              <div className="bg-white rounded-lg shadow-soft p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">商品名称</label>
                    <input type="text" value={editProduct.name} onChange={e => setEditProduct(p => ({ ...p, name: e.target.value }))}
                      className="input-field mt-1" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">分类</label>
                    <select value={editProduct.category} onChange={e => setEditProduct(p => ({ ...p, category: e.target.value }))}
                      className="input-field mt-1">
                      <option value="">选择分类</option>
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">商品描述</label>
                  <textarea value={editProduct.description} onChange={e => setEditProduct(p => ({ ...p, description: e.target.value }))}
                    rows={3} className="input-field mt-1" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">价格 (¥)</label>
                    <input type="number" step="0.01" value={editProduct.price} onChange={e => setEditProduct(p => ({ ...p, price: e.target.value }))}
                      className="input-field mt-1" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">库存</label>
                    <input type="number" value={editProduct.stock} onChange={e => setEditProduct(p => ({ ...p, stock: e.target.value }))}
                      className="input-field mt-1" required />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">商品图片</label>
                  {editProduct.image_url && (
                    <div className="mt-2 mb-2">
                      <img src={editProduct.image_url} alt="预览" className="h-32 w-32 object-cover rounded" />
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handleImageUpload} ref={fileInputRef} className="mt-1" />
                  <p className="text-xs text-gray-500 mt-1">上传图片以设置为商品图片</p>
                </div>

                <div className="flex items-center">
                  <input type="checkbox" id="is_featured" checked={editProduct.is_featured}
                    onChange={e => setEditProduct(p => ({ ...p, is_featured: e.target.checked }))} className="mr-2" />
                  <label htmlFor="is_featured" className="text-sm font-medium text-gray-700">精选商品</label>
                </div>

                <div className="flex gap-3">
                  <button onClick={handleSaveProduct} disabled={saving} className="btn-primary">
                    {saving ? '保存中...' : '保存商品'}
                  </button>
                  <button onClick={() => setView('products')} className="btn-secondary">
                    取消
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Low Stock Alert */}
          {stats.low_stock_products > 0 && view === 'dashboard' && (
            <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-2xl">⚠️</span>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-yellow-800">库存不足提醒</h3>
                  <p className="text-yellow-700">您有 {stats.low_stock_products} 个商品库存不足，需要关注。</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
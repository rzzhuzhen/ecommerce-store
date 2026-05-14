import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { productService } from '../api/supabase';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      setLoading(true);
      const [products, categoryList] = await Promise.all([
        productService.getFeatured(),
        productService.getCategories(),
      ]);
      setFeaturedProducts(products || []);
      setCategories(categoryList?.map(cat => ({ id: cat, name: cat })) || []);
    } catch (error) {
      console.error('Failed to load home data:', error);
    } finally {
      setLoading(false);
    }
  };

  const heroCategories = [
    { name: '电子产品', icon: '📱', color: 'bg-blue-500' },
    { name: '服装', icon: '👕', color: 'bg-pink-500' },
    { name: '家居园艺', icon: '🏠', color: 'bg-green-500' },
    { name: '运动', icon: '⚽', color: 'bg-orange-500' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                发现惊喜商品
                <span className="block text-primary-200">发现您喜爱的产品</span>
              </h1>
              <p className="text-xl text-primary-100 max-w-lg">
                浏览最新潮流商品，享受高品质产品。快速配送，实惠价格，优质服务。
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/products"
                  className="btn-accent text-lg px-8 py-3 inline-flex items-center space-x-2"
                >
                  <span>立即购物</span>
                  <ArrowRight size={20} />
                </Link>
                <Link
                  to="/products"
                  className="btn-secondary text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-primary-600"
                >
                  浏览分类
                </Link>
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-primary-600 rounded-3xl transform rotate-6"></div>
                <div className="relative bg-white rounded-3xl p-8 shadow-strong">
                  <div className="grid grid-cols-2 gap-4">
                    {heroCategories.map((category, index) => (
                      <div
                        key={category.name}
                        className={`${category.color} rounded-2xl p-6 text-white text-center transform hover:scale-105 transition-transform duration-300`}
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="text-4xl mb-2">{category.icon}</div>
                        <div className="font-semibold">{category.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              浏览分类
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              探索我们广泛的商品，按分类组织，方便浏览
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/products?category=${encodeURIComponent(category.name)}`}
                className="group"
              >
                <div className="bg-white rounded-xl p-6 text-center shadow-soft hover:shadow-medium transition-all duration-300 transform hover:-translate-y-1">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-200 transition-colors">
                    <span className="text-2xl text-primary-600">
                      {category.name === 'Electronics' ? '📱' :
                       category.name === 'Clothing' ? '👕' :
                       category.name === 'Home & Garden' ? '🏠' :
                       category.name === 'Sports' ? '⚽' : '🛍️'}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                精选商品
              </h2>
              <p className="text-lg text-gray-600">
                精心挑选的热门商品
              </p>
            </div>
            <Link
              to="/products"
              className="btn-primary inline-flex items-center space-x-2"
            >
              <span>查看全部</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-secondary-800 to-secondary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            准备好开始购物了吗？
          </h2>
          <p className="text-xl text-secondary-200 mb-8 max-w-2xl mx-auto">
            加入数千名满意顾客的行列，体验优质商品和卓越服务。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="btn-accent text-lg px-8 py-3"
            >
              浏览商品
            </Link>
            <Link
              to="/signup"
              className="btn-secondary text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-secondary-800"
            >
              创建账户
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
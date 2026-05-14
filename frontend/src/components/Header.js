import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, ChevronDown, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { favoritesService } from '../api/supabase';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [favoritesCount, setFavoritesCount] = useState(0);
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (location.pathname === '/products' && !searchQuery) {
      const urlSearchQuery = searchParams.get('search') || '';
    }
  }, [location.pathname, searchParams]);

  // Close account dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.account-dropdown')) {
        setIsAccountOpen(false);
      }
    };
    if (isAccountOpen) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isAccountOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      navigate(`/products?page=1&limit=12&sort_by=name&sort_order=asc&search=${encodeURIComponent(trimmedQuery)}`);
      setSearchQuery('');
    } else {
      navigate('/products?page=1&limit=12&sort_by=name&sort_order=asc');
      setSearchQuery('');
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    if (location.pathname === '/products') {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('search');
      newParams.set('page', '1');
      navigate(`/products?${newParams.toString()}`);
    }
  };

  const handleLogout = () => {
    logout();
    setIsAccountOpen(false);
    navigate('/');
  };

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const updateFavoritesCount = async () => {
      if (!isAuthenticated) {
        setFavoritesCount(0);
        return;
      }

      try {
        const data = await favoritesService.get();
        setFavoritesCount(data?.length || 0);
      } catch (error) {
        console.error('Failed to get favorites count:', error);
        setFavoritesCount(0);
      }
    };

    updateFavoritesCount();

    const handleFavoritesChange = () => {
      updateFavoritesCount();
    };

    window.addEventListener('favoritesUpdated', handleFavoritesChange);

    return () => {
      window.removeEventListener('favoritesUpdated', handleFavoritesChange);
    };
  }, [isAuthenticated]);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-medium border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:block">
              E-commerce Store
            </span>
          </Link>

          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-20 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      title="Clear search"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                  <button
                    type="submit"
                    className="p-1 text-gray-400 hover:text-primary-600 transition-colors"
                    title="Search"
                  >
                    <Search size={20} />
                  </button>
                </div>
              </div>
            </form>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated && (
              <Link
                to="/favorites"
                className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors"
              >
                <Heart size={24} />
                {favoritesCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {favoritesCount > 99 ? '99+' : favoritesCount}
                  </span>
                )}
              </Link>
            )}

            <Link
              to="/cart"
              className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors"
            >
              <ShoppingCart size={24} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative account-dropdown">
                <button
                  onClick={() => setIsAccountOpen(!isAccountOpen)}
                  className="flex items-center space-x-2 p-2 text-gray-600 hover:text-primary-600 transition-colors rounded-lg hover:bg-gray-50"
                >
                  <User size={20} />
                  <span className="hidden sm:block">{user.email?.split('@')[0]}</span>
                  <ChevronDown size={16} />
                </button>

                {isAccountOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-strong border border-gray-200 py-2 z-50">
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsAccountOpen(false)}
                    >
                      My Orders
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsAccountOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <hr className="my-2" />
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-primary-600 transition-colors font-medium"
                >
                  Sign In
                </Link>
                <span className="text-gray-300">|</span>
                <Link
                  to="/signup"
                  className="btn-primary text-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-primary-600 transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-20 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      title="Clear search"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                  <button
                    type="submit"
                    className="p-1 text-gray-400 hover:text-primary-600 transition-colors"
                    title="Search"
                  >
                    <Search size={20} />
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="space-y-2">
              <Link
                to="/products"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                All Products
              </Link>
              {isAuthenticated && (
                <Link
                  to="/favorites"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Favorites {favoritesCount > 0 && `(${favoritesCount})`}
                </Link>
              )}
              <Link
                to="/orders"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                My Orders
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin Dashboard
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
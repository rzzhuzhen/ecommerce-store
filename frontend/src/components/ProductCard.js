import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { favoritesService } from '../api/supabase';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setIsFavorited(false);
      return;
    }

    const checkFavorite = async () => {
      try {
        const result = await favoritesService.check(product.id);
        setIsFavorited(result);
      } catch (error) {
        console.error('Failed to check favorite status:', error);
        setIsFavorited(false);
      }
    };

    checkFavorite();
  }, [product.id, isAuthenticated]);

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      addToast('请先登录以添加收藏', 'warning');
      window.location.href = '/login';
      return;
    }

    try {
      if (isFavorited) {
        await favoritesService.remove(product.id);
        setIsFavorited(false);
      } else {
        await favoritesService.add(product.id);
        setIsFavorited(true);
      }

      window.dispatchEvent(new CustomEvent('favoritesUpdated'));
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      addToast('请先登录以添加到购物车', 'warning');
      window.location.href = '/login';
      return;
    }

    setIsAdding(true);
    try {
      await addToCart(product.id, 1);
      addToast(`${product.name} 已添加到购物车！`, 'success');
    } catch (error) {
      console.error('Failed to add to cart:', error);
      addToast('添加到购物车失败', 'error');
    } finally {
      setIsAdding(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <div className="product-card group">
      <div className="relative overflow-hidden bg-gray-100">
        <Link to={`/products/${product.id}`}>
          {product.image_url && !imageError ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-48 flex items-center justify-center bg-gray-200">
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
          )}
        </Link>

        {isAuthenticated && (
          <button
            onClick={handleToggleFavorite}
            className={`absolute top-2 right-2 p-2 rounded-full shadow-soft opacity-0 group-hover:opacity-100 transition-all duration-200 ${
              isFavorited
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-white hover:bg-gray-50'
            }`}
            title={isFavorited ? '取消收藏' : '添加收藏'}
          >
            <Heart
              size={16}
              className={`${
                isFavorited
                  ? 'text-white fill-current'
                  : 'text-gray-600'
              }`}
            />
          </button>
        )}

        {product.stock <= 10 && product.stock > 0 && (
          <span className="absolute top-2 left-2 badge badge-warning">
            库存不足
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute top-2 left-2 badge badge-error">
            缺货
          </span>
        )}
      </div>

      <div className="p-4">
        <div className="text-xs text-primary-600 font-medium mb-1">
          {product.category}
        </div>

        <Link to={`/products/${product.id}`}>
          <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 hover:text-primary-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        {product.rating && (
          <div className="flex items-center space-x-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={`${
                    i < Math.floor(product.rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        <div className="mt-2 mb-3">
          <span className="text-lg font-bold text-gray-900">
            {formatPrice(product.price)}
          </span>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={isAdding || product.stock === 0}
          className={`w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
            product.stock === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-primary-600 hover:bg-primary-700 text-white hover:shadow-medium'
          }`}
        >
          {isAdding ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>添加中...</span>
            </>
          ) : (
            <>
              <ShoppingCart size={16} />
              <span>
                {product.stock === 0 ? '缺货' : '加入购物车'}
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
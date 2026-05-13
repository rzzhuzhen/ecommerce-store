import { createClient } from '../utils/supabase';

const supabase = createClient();

// Product queries
export const productService = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  getFeatured: async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_featured', true)
      .order('rating', { ascending: false });
    if (error) throw error;
    return data;
  },

  getById: async (id) => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  getByCategory: async (category) => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  getCategories: async () => {
    const { data, error } = await supabase
      .from('products')
      .select('category')
      .order('category');
    if (error) throw error;
    return [...new Set(data.map(p => p.category))];
  },

  search: async (query) => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .ilike('name', `%${query}%`);
    if (error) throw error;
    return data;
  },
};

// Cart queries
export const cartService = {
  get: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('cart_items')
      .select('*, products(*)')
      .eq('user_id', user.id);
    if (error) throw error;
    return data;
  },

  add: async (productId, quantity = 1) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const product = await productService.getById(productId);
    const subtotal = product.price * quantity;

    const { data, error } = await supabase
      .from('cart_items')
      .upsert({
        user_id: user.id,
        product_id: productId,
        name: product.name,
        price: product.price,
        quantity,
        subtotal,
        image_url: product.image_url,
      }, {
        onConflict: 'user_id,product_id',
      });
    if (error) throw error;
    return data;
  },

  update: async (cartItemId, quantity) => {
    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity, subtotal: 0 }) // TODO: recalculate subtotal
      .eq('id', cartItemId);
    if (error) throw error;
    return data;
  },

  remove: async (cartItemId) => {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', cartItemId);
    if (error) throw error;
  },

  clear: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user.id);
    if (error) throw error;
  },
};

// Order queries
export const orderService = {
  create: async (orderData) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: cartItems } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', user.id);

    if (!cartItems || cartItems.length === 0) {
      throw new Error('Cart is empty');
    }

    const subtotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
    const tax = subtotal * 0.1;
    const shipping = subtotal > 100 ? 0 : 10;
    const total = subtotal + tax + shipping;

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        subtotal,
        tax,
        shipping,
        total,
        shipping_address: orderData.shippingAddress,
        status: 'pending',
      });
    if (orderError) throw orderError;

    // Create order items
    const orderItems = cartItems.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      subtotal: item.subtotal,
      image_url: item.image_url,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);
    if (itemsError) throw itemsError;

    // Clear cart
    await cartService.clear();

    return order;
  },

  getUserOrders: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  getOrderDetail: async (orderId) => {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', orderId)
      .single();
    if (error) throw error;
    return data;
  },
};

// Favorites queries
export const favoritesService = {
  get: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('favorites')
      .select('*, products(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  add: async (productId) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('favorites')
      .insert({ user_id: user.id, product_id: productId });
    if (error) throw error;
    return data;
  },

  remove: async (productId) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('product_id', productId);
    if (error) throw error;
  },

  check: async (productId) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('product_id', productId)
      .single();
    if (error) return false;
    return !!data;
  },
};
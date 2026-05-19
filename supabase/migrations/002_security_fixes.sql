-- Security fixes migration
-- Fixes: prevent users from elevating their own role, add search_path to functions, add missing indexes

-- ============================================
-- Fix 1: Prevent role elevation via trigger
-- ============================================
CREATE OR REPLACE FUNCTION public.prevent_role_change()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM set_config('search_path', 'public', true);
    IF OLD.role != NEW.role AND auth.uid() = NEW.id THEN
        IF NOT EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        ) THEN
            NEW.role := OLD.role;
        END IF;
    END IF;
    IF auth.uid() = NEW.id AND NEW.role NOT IN ('customer', 'admin') THEN
        NEW.role := OLD.role;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS prevent_profile_role_change ON public.profiles;
CREATE TRIGGER prevent_profile_role_change
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.prevent_role_change();

-- ============================================
-- Fix 2: Admin-only function to change user roles
-- ============================================
CREATE OR REPLACE FUNCTION public.admin_change_user_role(p_user_id UUID, p_new_role TEXT)
RETURNS void AS $$
BEGIN
    PERFORM set_config('search_path', 'public', true);
    IF NOT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    ) THEN
        RAISE EXCEPTION 'Unauthorized: Admin access required';
    END IF;
    IF p_new_role NOT IN ('customer', 'admin') THEN
        RAISE EXCEPTION 'Invalid role. Must be customer or admin';
    END IF;
    UPDATE public.profiles
    SET role = p_new_role, updated_at = NOW()
    WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

GRANT EXECUTE ON FUNCTION public.admin_change_user_role TO authenticated;

-- ============================================
-- Fix 3: Add search_path to existing functions
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM set_config('search_path', 'public', true);
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM set_config('search_path', 'public', true);
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- ============================================
-- Fix 4: Add missing indexes for performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON public.cart_items(product_id);
CREATE INDEX IF NOT EXISTS idx_favorites_product_id ON public.favorites(product_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '../utils/supabase';

const AuthContext = createContext();
const supabase = createClient();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check initial session
    checkAuthStatus();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email,
            role: session.user.user_metadata?.role || 'customer',
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Get profile for role info
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        setUser({
          id: session.user.id,
          email: session.user.email,
          role: profile?.role || 'customer',
        });
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setError(null);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      // Check email confirmation
      if (!data.user.email_confirmed_at) {
        await supabase.auth.signOut();
        return {
          success: false,
          error: 'Please confirm your email address. Check your inbox for the confirmation link.'
        };
      }

      // Get profile for role
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      setUser({
        id: data.user.id,
        email: data.user.email,
        role: profile?.role || 'customer',
      });

      return { success: true };
    } catch (error) {
      const errorMessage = error.message || 'Invalid email or password';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const signup = async (userData) => {
    setError(null);

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            full_name: `${userData.firstName} ${userData.lastName}`,
          }
        }
      });

      if (authError) throw authError;

      // If email confirmation is enabled, show message
      if (!data.user?.email_confirmed_at) {
        return {
          success: true,
          needsConfirmation: true,
          message: 'Please check your email and click the confirmation link to activate your account.'
        };
      }

      // Profile will be created automatically via trigger

      return { success: true };
    } catch (error) {
      const errorMessage = error.message || 'Signup failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setError(null);
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    signup,
    logout,
    clearError,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
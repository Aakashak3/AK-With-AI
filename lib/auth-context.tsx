'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabase';
import type { User } from '@supabase/supabase-js';

import { SITE_URL, ADMIN_EMAILS } from './config';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Strictly check if users email is the authorized one
  const isAdmin = user ? (ADMIN_EMAILS.includes(user.email?.toLowerCase() || '')) : false;

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        setUser(authUser);
      } catch (err) {
        console.error('Error checking user:', err);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }

      // Wait for auth state to update via onAuthStateChange
      // This ensures the user state is properly set before we check admin status
      await new Promise(resolve => setTimeout(resolve, 100));

      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser && !ADMIN_EMAILS.includes(authUser.email?.toLowerCase() || '')) {
        await supabase.auth.signOut();
        setUser(null);
        throw new Error('Unauthorized: Only admins can access this area');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setError(null);
      setLoading(true);
      
      // First, check if the user is already authenticated and is an admin
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      if (currentUser) {
        // User is already logged in, check if they're an admin
        const userEmail = currentUser.email?.toLowerCase() || '';
        if (!ADMIN_EMAILS.includes(userEmail)) {
          // Already logged in but not admin - sign them out first
          await supabase.auth.signOut();
          setUser(null);
          throw new Error('Unauthorized: Only admins can access this area. Please sign in with the authorized admin Gmail account.');
        }
        // User is admin, redirect to dashboard
        window.location.href = '/admin/dashboard';
        return;
      }
      
      // No existing session - start OAuth flow
      // Use SITE_URL from config for redirect
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${SITE_URL}/api/auth/callback`,
          queryParams: {
            prompt: 'select_account' // Force account selection to avoid auto-logging into wrong Gmail
          }
        },
      });
      if (error) throw error;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Google login failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await supabase.auth.signOut();
      setUser(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Logout failed';
      setError(message);
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, loginWithGoogle, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

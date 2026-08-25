import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../utils/supabase';

const AdminAuthContext = createContext(null);

const SESSION_KEY = 'lunar_admin_session';

// Fallback credentials in case Supabase connection is offline / unconfigured
const FALLBACK_CREDENTIALS = {
  username: 'admin',
  password: 'lunar@2024',
};

export function AdminAuthProvider({ children }) {
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.user || null;
      }
    } catch {
      // Ignore parse error
    }
    return null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!sessionStorage.getItem(SESSION_KEY);
  });

  const [authLoading, setAuthLoading] = useState(false);

  // Synchronize authentication status with session storage
  useEffect(() => {
    const saved = sessionStorage.getItem(SESSION_KEY);
    setIsAuthenticated(!!saved);
  }, []);

  const login = useCallback(async (identifier, password) => {
    setAuthLoading(true);
    const cleanId = (identifier || '').trim();
    const cleanPass = (password || '').trim();

    if (!cleanId || !cleanPass) {
      setAuthLoading(false);
      return { success: false, error: 'Please enter both username/email and password.' };
    }

    try {
      // 1. Query Supabase 'admin_users' table
      let { data, error } = await supabase
        .from('admin_users')
        .select('id, username, email, role, is_active, created_at')
        .eq('username', cleanId)
        .eq('password', cleanPass)
        .maybeSingle();

      // If not found by username and input has '@', try searching by email
      if (!data && !error && cleanId.includes('@')) {
        const emailRes = await supabase
          .from('admin_users')
          .select('id, username, email, role, is_active, created_at')
          .eq('email', cleanId.toLowerCase())
          .eq('password', cleanPass)
          .maybeSingle();
        data = emailRes.data;
        error = emailRes.error;
      }

      // 2. If user found in Supabase
      if (data) {
        if (data.is_active === false) {
          setAuthLoading(false);
          return { success: false, error: 'This admin account has been deactivated.' };
        }

        const sessionPayload = {
          token: `lunar_sb_${data.id}_${Date.now()}`,
          user: data,
          authenticatedAt: new Date().toISOString(),
        };

        sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionPayload));
        setAdminUser(data);
        setIsAuthenticated(true);
        setAuthLoading(false);
        return { success: true, user: data };
      }

      // 3. If table does not exist or Supabase threw an error
      if (error) {
        console.warn('Supabase admin login query notice:', error.message);

        // If table doesn't exist yet, fallback to default credentials
        if (
          error.message?.toLowerCase().includes('relation') ||
          error.message?.toLowerCase().includes('does not exist') ||
          error.code === '42P01'
        ) {
          if (
            cleanId === FALLBACK_CREDENTIALS.username &&
            cleanPass === FALLBACK_CREDENTIALS.password
          ) {
            const fallbackUser = {
              id: 'local_admin',
              username: FALLBACK_CREDENTIALS.username,
              role: 'admin',
              fallback: true,
            };
            const sessionPayload = {
              token: `lunar_fallback_${Date.now()}`,
              user: fallbackUser,
              authenticatedAt: new Date().toISOString(),
            };
            sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionPayload));
            setAdminUser(fallbackUser);
            setIsAuthenticated(true);
            setAuthLoading(false);
            return {
              success: true,
              user: fallbackUser,
              notice: "Logged in via fallback. Please run the SQL query in Supabase to set up your 'admin_users' table.",
            };
          }

          setAuthLoading(false);
          return {
            success: false,
            error: "Supabase 'admin_users' table not found. Run the setup SQL query in your Supabase SQL Editor.",
          };
        }

        setAuthLoading(false);
        return {
          success: false,
          error: error.message || 'Database error during authentication.',
        };
      }

      // 4. Invalid credentials
      setAuthLoading(false);
      return { success: false, error: 'Invalid username/email or password.' };
    } catch (err) {
      console.error('Supabase admin auth exception:', err);

      // Emergency local fallback if network/client error occurs
      if (
        cleanId === FALLBACK_CREDENTIALS.username &&
        cleanPass === FALLBACK_CREDENTIALS.password
      ) {
        const fallbackUser = {
          id: 'local_admin',
          username: FALLBACK_CREDENTIALS.username,
          role: 'admin',
          fallback: true,
        };
        sessionStorage.setItem(SESSION_KEY, JSON.stringify({ token: 'fallback', user: fallbackUser }));
        setAdminUser(fallbackUser);
        setIsAuthenticated(true);
        setAuthLoading(false);
        return { success: true, user: fallbackUser };
      }

      setAuthLoading(false);
      return {
        success: false,
        error: err.message || 'Authentication service unavailable. Please check your connection.',
      };
    }
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    setAdminUser(null);
    setIsAuthenticated(false);
  }, []);

  return (
    <AdminAuthContext.Provider
      value={{
        isAuthenticated,
        adminUser,
        authLoading,
        login,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
}

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../utils/supabase';
import {
  loginCustomer,
  registerCustomer,
  updateCustomerProfile,
  getCustomerOrders,
  sendPasswordResetOtp,
  verifyPasswordResetOtp,
  updateSupabaseAuthPassword,
  maskIdentifier,
} from '../utils/customerStore';

const CustomerAuthContext = createContext(null);
const SESSION_KEY = 'lunar_customer_session';

export function CustomerAuthProvider({ children }) {
  const [customer, setCustomer] = useState(() => {
    try {
      const saved = localStorage.getItem(SESSION_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem(SESSION_KEY);
  });

  const [orders, setOrders] = useState([]);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login'); // 'login' | 'register' | 'forgot' | 'verify-otp' | 'profile' | 'orders' | 'wishlist'
  const [loading, setLoading] = useState(false);

  // Recovery / Reset Session State
  const [resetState, setResetState] = useState({
    identifier: '',
    maskedTarget: '',
    method: 'email', // 'email' | 'phone'
    otpVerified: false,
  });

  // Listen for Supabase password recovery event from email magic link
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setResetState({
          identifier: session?.user?.email || '',
          maskedTarget: maskIdentifier(session?.user?.email || ''),
          method: 'email',
          otpVerified: true,
        });
        setAuthModalTab('verify-otp');
        setAuthModalOpen(true);
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // Sync state with storage
  useEffect(() => {
    if (customer) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(customer));
      setIsAuthenticated(true);
      refreshOrders(customer);
    } else {
      localStorage.removeItem(SESSION_KEY);
      setIsAuthenticated(false);
      setOrders([]);
    }
  }, [customer]);

  const refreshOrders = useCallback(async (custObj = customer) => {
    if (!custObj) return;
    try {
      const history = await getCustomerOrders(custObj.id, custObj.email, custObj.phone);
      setOrders(history || []);
    } catch (e) {
      console.warn('Failed to load customer orders:', e);
    }
  }, [customer]);

  const login = useCallback(async (identifier, password) => {
    setLoading(true);
    const res = await loginCustomer(identifier, password);
    setLoading(false);
    if (res.success && res.customer) {
      setCustomer(res.customer);
      return { success: true, customer: res.customer };
    }
    return { success: false, error: res.error || 'Login failed' };
  }, []);

  const register = useCallback(async (formData) => {
    setLoading(true);
    const res = await registerCustomer(formData);
    setLoading(false);
    if (res.success && res.customer) {
      setCustomer(res.customer);
      return { success: true, customer: res.customer };
    }
    return { success: false, error: res.error || 'Registration failed' };
  }, []);

  const logout = useCallback(async () => {
    setCustomer(null);
    localStorage.removeItem(SESSION_KEY);
    try {
      await supabase.auth.signOut();
    } catch (e) {
      // Silent catch
    }
  }, []);

  const updateProfile = useCallback(async (updates) => {
    if (!customer?.id) return { success: false, error: 'Not authenticated' };
    setLoading(true);
    const res = await updateCustomerProfile(customer.id, updates);
    setLoading(false);
    if (res.success && res.customer) {
      setCustomer((prev) => ({ ...prev, ...res.customer }));
      return { success: true, customer: res.customer };
    }
    return { success: false, error: res.error || 'Profile update failed' };
  }, [customer]);

  // Request Password Reset OTP (Email or Mobile)
  const sendResetOtp = useCallback(async (identifier) => {
    setLoading(true);
    const res = await sendPasswordResetOtp(identifier);
    setLoading(false);
    if (res.success) {
      setResetState({
        identifier,
        maskedTarget: res.maskedTarget || maskIdentifier(identifier),
        method: res.method || 'email',
        sessionOtp: res.sessionOtp,
        otpVerified: false,
      });
      return {
        success: true,
        maskedTarget: res.maskedTarget,
        sessionOtp: res.sessionOtp,
        message: res.message,
      };
    }
    return {
      success: false,
      notRegistered: res.notRegistered,
      error: res.error || 'Failed to send verification code.',
    };
  }, []);


  // Verify the OTP code
  const verifyResetOtp = useCallback(async (identifier, otpCode) => {
    setLoading(true);
    const res = await verifyPasswordResetOtp(identifier, otpCode);
    setLoading(false);
    if (res.success) {
      setResetState((prev) => ({
        ...prev,
        otpVerified: true,
      }));
      return { success: true, message: res.message };
    }
    return { success: false, error: res.error || 'OTP verification failed.' };
  }, []);

  // Update password in Supabase Auth
  const updatePassword = useCallback(async (newPassword, identifier = '') => {
    setLoading(true);
    const targetId = identifier || resetState.identifier;
    const res = await updateSupabaseAuthPassword(newPassword, targetId);
    setLoading(false);
    if (res.success) {
      setResetState({
        identifier: '',
        maskedTarget: '',
        method: 'email',
        otpVerified: false,
      });
      return { success: true, message: res.message };
    }
    return { success: false, error: res.error || 'Failed to update password.' };
  }, [resetState.identifier]);

  const openAuthModal = useCallback((tab = 'login') => {
    setAuthModalTab(tab);
    setAuthModalOpen(true);
  }, []);

  return (
    <CustomerAuthContext.Provider
      value={{
        customer,
        isAuthenticated,
        loading,
        orders,
        resetState,
        setResetState,
        login,
        register,
        logout,
        updateProfile,
        refreshOrders,
        sendResetOtp,
        verifyResetOtp,
        updatePassword,
        authModalOpen,
        setAuthModalOpen,
        authModalTab,
        setAuthModalTab,
        openAuthModal,
      }}
    >
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  const ctx = useContext(CustomerAuthContext);
  if (!ctx) throw new Error('useCustomerAuth must be used within CustomerAuthProvider');
  return ctx;
}


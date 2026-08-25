import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  loginCustomer,
  registerCustomer,
  updateCustomerProfile,
  getCustomerOrders,
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
  const [authModalTab, setAuthModalTab] = useState('login'); // 'login' | 'register' | 'profile' | 'orders'
  const [loading, setLoading] = useState(false);

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

  const logout = useCallback(() => {
    setCustomer(null);
    localStorage.removeItem(SESSION_KEY);
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
        login,
        register,
        logout,
        updateProfile,
        refreshOrders,
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

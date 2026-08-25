import React, { createContext, useContext, useState, useCallback } from 'react';

const AdminAuthContext = createContext(null);

// Dummy credentials — swap for real auth later
const VALID_CREDENTIALS = {
  username: 'admin',
  password: 'lunar@2024',
};

// Simple hash to avoid storing plaintext in sessionStorage
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return 'lunar_session_' + Math.abs(hash).toString(36);
}

const SESSION_KEY = 'lunar_admin_session';
const SESSION_TOKEN = simpleHash(VALID_CREDENTIALS.username + VALID_CREDENTIALS.password);

export function AdminAuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem(SESSION_KEY) === SESSION_TOKEN;
  });

  const login = useCallback((username, password) => {
    if (
      username === VALID_CREDENTIALS.username &&
      password === VALID_CREDENTIALS.password
    ) {
      sessionStorage.setItem(SESSION_KEY, SESSION_TOKEN);
      setIsAuthenticated(true);
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials' };
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    setIsAuthenticated(false);
  }, []);

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
}

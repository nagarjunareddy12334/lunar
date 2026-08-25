import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Lock, Eye, EyeOff, AlertCircle, Moon } from 'lucide-react';
import './AdminStyles.css';

export default function AdminLogin() {
  const { login, isAuthenticated } = useAdminAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // If already authenticated, redirect to dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }

    setIsLoading(true);

    try {
      const result = await login(username.trim(), password);
      if (result.success) {
        navigate('/admin/dashboard', { replace: true });
      } else {
        setError(result.error || 'Invalid credentials. Access denied.');
        setIsLoading(false);
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-root">
      <div className="admin-login-page">
        <form className="admin-login-card" onSubmit={handleSubmit}>
          {/* Logo & Branding */}
          <div className="admin-login-logo">
            <div className="admin-login-lock">
              <Lock size={24} />
            </div>
            <h1>LUNAR</h1>
            <p>Admin Control Panel</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="admin-error">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {/* Username / Email */}
          <div className="admin-field">
            <label className="admin-label" htmlFor="admin-username">
              Username or Email
            </label>
            <input
              id="admin-username"
              className={`admin-input ${error ? 'admin-input-error' : ''}`}
              type="text"
              placeholder="admin or admin@lunar.com"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError('');
              }}
              autoComplete="off"
              autoFocus
            />
          </div>

          {/* Password */}
          <div className="admin-field">
            <label className="admin-label" htmlFor="admin-password">
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="admin-password"
                className={`admin-input ${error ? 'admin-input-error' : ''}`}
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                autoComplete="off"
                style={{ paddingRight: '3rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  cursor: 'pointer',
                  padding: '0.25rem',
                  display: 'flex',
                }}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="admin-btn-primary"
            disabled={isLoading}
            style={{ marginTop: '0.5rem' }}
          >
            {isLoading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <Moon size={16} style={{ animation: 'spin 1s linear infinite' }} />
                Authenticating...
              </span>
            ) : (
              'Access Admin Dashboard'
            )}
          </button>

          {/* Quick Demo Credentials Fill Button */}
          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <button
              type="button"
              onClick={() => {
                setUsername('admin');
                setPassword('lunar@2024');
              }}
              style={{
                background: 'rgba(197, 168, 128, 0.1)',
                border: '1px dashed rgba(197, 168, 128, 0.3)',
                color: '#C5A880',
                padding: '0.4rem 0.8rem',
                borderRadius: '0.5rem',
                fontSize: '0.72rem',
                fontFamily: 'monospace',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              title="Click to fill default admin login credentials"
            >
              ⚡ Quick Fill Admin (admin / lunar@2024)
            </button>
          </div>

          {/* Hint */}
          <p
            style={{
              textAlign: 'center',
              marginTop: '1rem',
              fontSize: '0.72rem',
              color: '#475569',
              letterSpacing: '0.05em',
            }}
          >
            Authorized personnel only. All sessions are logged.
          </p>
        </form>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

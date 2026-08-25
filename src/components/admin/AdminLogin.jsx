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

    // Simulate a brief loading state for realism
    await new Promise((r) => setTimeout(r, 600));

    const result = login(username.trim(), password);
    if (result.success) {
      navigate('/admin/dashboard', { replace: true });
    } else {
      setError('Invalid credentials. Access denied.');
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

          {/* Username */}
          <div className="admin-field">
            <label className="admin-label" htmlFor="admin-username">
              Username
            </label>
            <input
              id="admin-username"
              className={`admin-input ${error ? 'admin-input-error' : ''}`}
              type="text"
              placeholder="Enter admin username"
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
              'Access Dashboard'
            )}
          </button>

          {/* Hint */}
          <p
            style={{
              textAlign: 'center',
              marginTop: '1.5rem',
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

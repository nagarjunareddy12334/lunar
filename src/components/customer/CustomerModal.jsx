import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  Package,
  Heart,
  LogOut,
  Save,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Clock,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Banknote,
  ShoppingBag,
  Trash2,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { useScrollLock } from '../../hooks/useScrollLock';
import { formatPrice } from '../../utils/formatters';

export default function CustomerModal() {
  const {
    customer,
    isAuthenticated,
    loading,
    orders,
    login,
    register,
    logout,
    updateProfile,
    authModalOpen,
    setAuthModalOpen,
    authModalTab,
    setAuthModalTab,
  } = useCustomerAuth();

  const { wishlistItems, removeFromWishlist, wishlistCount } = useWishlist();
  const { addToCart, setIsCartOpen } = useCart();
  const { showToast } = useToast();
  useScrollLock(authModalOpen);

  // Form states for login (supports Email OR Mobile Number)
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Form states for register
  const [regForm, setRegForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
  });
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regError, setRegError] = useState('');

  // Form states for profile / address edit
  const [profileForm, setProfileForm] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
  });
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  // Selected sizes for items in wishlist tab
  const [wishlistSelectedSizes, setWishlistSelectedSizes] = useState({});

  // Sync profile form when customer changes
  useEffect(() => {
    if (customer) {
      setProfileForm({
        fullName: customer.fullName || '',
        phone: customer.phone || '',
        address: customer.address || '',
        city: customer.city || '',
        state: customer.state || '',
        postalCode: customer.postalCode || '',
        country: customer.country || 'United States',
      });
      if (authModalTab === 'login' || authModalTab === 'register') {
        setAuthModalTab('profile');
      }
    } else {
      if (authModalTab === 'profile' || authModalTab === 'orders' || authModalTab === 'wishlist') {
        setAuthModalTab('login');
      }
    }
  }, [customer, authModalTab, setAuthModalTab]);

  if (!authModalOpen) return null;

  const handleClose = () => {
    setLoginError('');
    setRegError('');
    setProfileSuccess('');
    setProfileError('');
    setAuthModalOpen(false);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    if (!loginIdentifier.trim() || !loginPassword.trim()) {
      setLoginError('Please enter your mobile number or email and password.');
      return;
    }

    const res = await login(loginIdentifier, loginPassword);
    if (res.success) {
      showToast(`Welcome back, ${res.customer.fullName || 'Customer'}!`, 'success');
      setLoginIdentifier('');
      setLoginPassword('');
      setAuthModalTab('profile');
    } else {
      setLoginError(res.error || 'Login failed. Please check your credentials.');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegError('');
    if (!regForm.fullName.trim() || !regForm.email.trim() || !regForm.password.trim()) {
      setRegError('Full Name, Email Address, and Password are required.');
      return;
    }
    if (regForm.password.length < 6) {
      setRegError('Password must be at least 6 characters.');
      return;
    }
    if (regForm.confirmPassword && regForm.password !== regForm.confirmPassword) {
      setRegError('Passwords do not match.');
      return;
    }

    const res = await register(regForm);
    if (res.success) {
      showToast('Account created and saved to Supabase!', 'success');
      setAuthModalTab('profile');
    } else {
      setRegError(res.error || 'Registration failed.');
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');
    const res = await updateProfile(profileForm);
    if (res.success) {
      setProfileSuccess('Delivery details & profile updated in Supabase!');
      showToast('Delivery address saved to your profile', 'success');
      setTimeout(() => setProfileSuccess(''), 4000);
    } else {
      setProfileError(res.error || 'Failed to update profile.');
    }
  };

  // Add Wishlist item to Cart
  const handleMoveWishlistToCart = (product) => {
    const size = wishlistSelectedSizes[product.id] || (product.sizes ? product.sizes[0] : 'L');
    const color = product.colors ? product.colors[0] : 'Onyx Black';
    addToCart(product, size, color, 1);
    showToast(`Added ${product.name} (${size}) to Bag`, 'success');
  };

  const handleMoveAllWishlistToCart = () => {
    wishlistItems.forEach((product) => {
      const size = wishlistSelectedSizes[product.id] || (product.sizes ? product.sizes[0] : 'L');
      const color = product.colors ? product.colors[0] : 'Onyx Black';
      addToCart(product, size, color, 1);
    });
    showToast(`Added all ${wishlistItems.length} items to Bag!`, 'success');
    setIsCartOpen(true);
    setAuthModalOpen(false);
  };

  // Quick Demo credentials fill
  const fillDemoLogin = (type = 'email') => {
    if (type === 'phone') {
      setLoginIdentifier('+1 (555) 019-2834');
    } else {
      setLoginIdentifier('alex.vanguard@lunar.com');
    }
    setLoginPassword('lunar@123');
    setLoginError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div
        className="glass-panel w-full max-w-2xl rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-2xl relative my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-700 text-[#C5A880] border border-slate-600 shadow-md">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold uppercase tracking-wider text-white font-display">
                {isAuthenticated ? `Welcome, ${customer?.fullName || 'Customer'}` : 'Lunar Customer Portal'}
              </h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[11px] font-mono tracking-wider text-[#C5A880] uppercase">
                  {isAuthenticated ? (customer?.phone ? `${customer?.email} • ${customer?.phone}` : customer?.email) : 'AUTHENTICATION & CUSTOMER ACCOUNT'}
                </span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Close portal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 sm:gap-2 mt-5 p-1 bg-slate-900/90 rounded-2xl border border-slate-800 overflow-x-auto">
          {!isAuthenticated ? (
            <>
              <button
                type="button"
                onClick={() => {
                  setAuthModalTab('login');
                  setLoginError('');
                }}
                className={`flex-1 min-w-[120px] py-2.5 text-xs font-mono uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                  authModalTab === 'login'
                    ? 'bg-white text-black font-bold shadow-lg'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthModalTab('register');
                  setRegError('');
                }}
                className={`flex-1 min-w-[140px] py-2.5 text-xs font-mono uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                  authModalTab === 'register'
                    ? 'bg-white text-black font-bold shadow-lg'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Create Account
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setAuthModalTab('profile')}
                className={`flex-1 min-w-[110px] py-2.5 text-xs font-mono uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  authModalTab === 'profile'
                    ? 'bg-white text-black font-bold shadow-lg'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Delivery & Profile</span>
                <span className="sm:hidden">Address</span>
              </button>

              <button
                type="button"
                onClick={() => setAuthModalTab('orders')}
                className={`flex-1 min-w-[110px] py-2.5 text-xs font-mono uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  authModalTab === 'orders'
                    ? 'bg-white text-black font-bold shadow-lg'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                <span>Orders ({orders.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setAuthModalTab('wishlist')}
                className={`flex-1 min-w-[110px] py-2.5 text-xs font-mono uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  authModalTab === 'wishlist'
                    ? 'bg-white text-black font-bold shadow-lg'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Heart className="w-3.5 h-3.5 text-rose-400" />
                <span>Wishlist ({wishlistCount})</span>
              </button>
            </>
          )}
        </div>

        {/* Tab Content */}
        <div className="mt-5">
          {/* ========================================================================= */}
          {/* 1. SIGN IN (Email OR Mobile Number + Password) */}
          {/* ========================================================================= */}
          {!isAuthenticated && authModalTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {loginError && (
                <div className="p-3 bg-red-950/40 border border-red-800/60 rounded-xl text-red-300 text-xs flex items-center gap-2 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              {/* Login identifier field (Email or Phone) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-mono uppercase text-slate-300">
                    Email Address or Mobile Number
                  </label>
                  <span className="text-[10px] font-mono text-slate-500">e.g. user@domain.com or +1 (555) 019-2834</span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Enter your email or phone number"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-[#C5A880] transition-colors"
                  />
                  <div className="absolute right-3.5 top-3.5 flex items-center gap-1 text-slate-500">
                    <Mail className="w-4 h-4" />
                    <span className="text-slate-600">/</span>
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* Password field with show/hide toggle */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-mono uppercase text-slate-300">
                    Password
                  </label>
                  <span className="text-[10px] font-mono text-[#C5A880]">Saved in Supabase</span>
                </div>
                <div className="relative">
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-[#C5A880] transition-colors pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-3 p-0.5 text-slate-400 hover:text-white cursor-pointer"
                    title={showLoginPassword ? 'Hide password' : 'Show password'}
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Sign In button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-white hover:bg-slate-200 text-black font-bold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
                >
                  {loading ? 'Authenticating...' : 'Sign In with Mobile / Email'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Demo Credentials */}
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-xs">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono uppercase text-slate-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#C5A880]" /> Quick Test Auto-fill:
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => fillDemoLogin('email')}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-[11px] font-mono text-slate-300 border border-slate-700 cursor-pointer"
                  >
                    📧 alex.vanguard@lunar.com
                  </button>
                  <button
                    type="button"
                    onClick={() => fillDemoLogin('phone')}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-[11px] font-mono text-slate-300 border border-slate-700 cursor-pointer"
                  >
                    📱 +1 (555) 019-2834
                  </button>
                </div>
              </div>

              <div className="text-center pt-1">
                <p className="text-xs text-slate-400">
                  Don't have an account yet?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthModalTab('register')}
                    className="text-[#C5A880] hover:underline font-mono font-semibold ml-1 cursor-pointer"
                  >
                    Create Account here
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* ========================================================================= */}
          {/* 2. CREATE ACCOUNT / REGISTER */}
          {/* ========================================================================= */}
          {!isAuthenticated && authModalTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              {regError && (
                <div className="p-3 bg-red-950/40 border border-red-800/60 rounded-xl text-red-300 text-xs flex items-center gap-2 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{regError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-[11px] font-mono uppercase text-slate-300 block mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Vanguard"
                    value={regForm.fullName}
                    onChange={(e) => setRegForm({ ...regForm, fullName: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#C5A880]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-mono uppercase text-slate-300 block mb-1">
                    Mobile / Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +1 555 019 2834"
                    value={regForm.phone}
                    onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#C5A880]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-[11px] font-mono uppercase text-slate-300 block mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="you@domain.com"
                    value={regForm.email}
                    onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#C5A880]"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-mono uppercase text-slate-300">
                      Create Password *
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="text-[10px] font-mono text-[#C5A880] hover:underline"
                    >
                      {showRegPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    required
                    placeholder="Min 6 characters"
                    value={regForm.password}
                    onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#C5A880]"
                  />
                </div>
              </div>

              {/* Delivery Address Fields */}
              <div className="pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#C5A880] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" /> Delivery Address (Saved to Supabase)
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">Auto-fills during checkout</span>
                </div>

                <div>
                  <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">
                    Street Address & Suite / Apt
                  </label>
                  <input
                    type="text"
                    placeholder="42 Lunar Boulevard, Suite 800"
                    value={regForm.address}
                    onChange={(e) => setRegForm({ ...regForm, address: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#C5A880]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">City</label>
                  <input
                    type="text"
                    placeholder="San Francisco"
                    value={regForm.city}
                    onChange={(e) => setRegForm({ ...regForm, city: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#C5A880]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">State</label>
                  <input
                    type="text"
                    placeholder="CA"
                    value={regForm.state}
                    onChange={(e) => setRegForm({ ...regForm, state: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#C5A880]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">Postal Code</label>
                  <input
                    type="text"
                    placeholder="94107"
                    value={regForm.postalCode}
                    onChange={(e) => setRegForm({ ...regForm, postalCode: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#C5A880]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-[#C5A880] hover:bg-[#b0936d] text-black font-bold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
                >
                  {loading ? 'Registering Account...' : 'Create Account & Save Profile'}
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>

              <div className="text-center pt-1">
                <p className="text-xs text-slate-400">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthModalTab('login')}
                    className="text-[#C5A880] hover:underline font-mono font-semibold ml-1 cursor-pointer"
                  >
                    Sign In here
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* ========================================================================= */}
          {/* 3. LOGGED IN — DELIVERY ADDRESS & PROFILE TAB */}
          {/* ========================================================================= */}
          {isAuthenticated && authModalTab === 'profile' && (
            <form onSubmit={handleProfileSubmit} className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              {profileSuccess && (
                <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{profileSuccess}</span>
                </div>
              )}
              {profileError && (
                <div className="p-3 bg-red-950/40 border border-red-800/60 rounded-xl text-red-300 text-xs flex items-center gap-2 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{profileError}</span>
                </div>
              )}

              {/* Customer summary card */}
              <div className="p-3.5 bg-slate-900/80 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">Registered Email</span>
                  <span className="text-xs font-mono font-bold text-white">{customer?.email}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">Login Mobile</span>
                  <span className="text-xs font-mono font-bold text-[#C5A880]">{customer?.phone || 'Not provided'}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profileForm.fullName}
                    onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#C5A880]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">
                    Contact Phone / Mobile
                  </label>
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#C5A880]"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#C5A880] flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> Saved Delivery Address (Supabase Synced)
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400">Active</span>
                </div>

                <div>
                  <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">
                    Street Address & Suite / Apt
                  </label>
                  <input
                    type="text"
                    placeholder="42 Lunar Boulevard, Suite 800"
                    value={profileForm.address}
                    onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#C5A880]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">City</label>
                  <input
                    type="text"
                    value={profileForm.city}
                    onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#C5A880]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">State</label>
                  <input
                    type="text"
                    value={profileForm.state}
                    onChange={(e) => setProfileForm({ ...profileForm, state: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#C5A880]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1">Postal Code</label>
                  <input
                    type="text"
                    value={profileForm.postalCode}
                    onChange={(e) => setProfileForm({ ...profileForm, postalCode: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#C5A880]"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    showToast('Logged out of customer account', 'info');
                  }}
                  className="px-4 py-2.5 bg-rose-950/30 hover:bg-rose-900/40 text-rose-300 border border-rose-800/40 rounded-xl text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-white hover:bg-slate-200 text-black font-bold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{loading ? 'Saving...' : 'Save Delivery Address'}</span>
                </button>
              </div>
            </form>
          )}

          {/* ========================================================================= */}
          {/* 4. LOGGED IN — MY ORDERS TAB */}
          {/* ========================================================================= */}
          {isAuthenticated && authModalTab === 'orders' && (
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {orders.length === 0 ? (
                <div className="text-center py-12 bg-slate-900/50 rounded-2xl border border-slate-800">
                  <Package className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-sm font-bold text-slate-200">No Orders Placed Yet</p>
                  <p className="text-xs text-slate-400 font-light mt-1 max-w-sm mx-auto">
                    When you order with Cash on Delivery (COD) or Card, your orders and tracking details will appear here.
                  </p>
                </div>
              ) : (
                orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all space-y-3 shadow-md"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                      <div>
                        <span className="text-[10px] font-mono uppercase text-slate-400 block">Order ID</span>
                        <span className="text-xs font-mono font-bold text-[#C5A880]">{ord.orderNumber}</span>
                      </div>

                      {/* Payment Method Badge */}
                      <div className="flex items-center gap-2">
                        {ord.paymentMethod === 'cod' ? (
                          <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono uppercase font-bold bg-amber-950/60 text-amber-300 border border-amber-800/60 flex items-center gap-1">
                            <Banknote className="w-3 h-3 text-amber-400" />
                            Cash on Delivery
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono uppercase font-bold bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 flex items-center gap-1">
                            <CreditCard className="w-3 h-3 text-emerald-400" />
                            Paid (Card)
                          </span>
                        )}

                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono uppercase bg-slate-800 text-slate-300 border border-slate-700">
                          {ord.orderStatus || 'Processing'}
                        </span>
                      </div>
                    </div>

                    {/* Order items snippet */}
                    <div className="space-y-2">
                      {ord.items?.map((it, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs font-mono bg-slate-950/40 p-2 rounded-xl">
                          <div className="flex items-center gap-2.5 truncate max-w-[300px]">
                            {it.image && (
                              <img
                                src={it.image}
                                alt={it.name}
                                className="w-8 h-8 rounded-lg object-cover bg-slate-800 border border-slate-700"
                              />
                            )}
                            <div className="truncate">
                              <span className="text-slate-200 block truncate font-medium">{it.name}</span>
                              <span className="text-[10px] text-slate-400">Qty: {it.quantity} • Size: {it.size || 'L'}</span>
                            </div>
                          </div>
                          <span className="text-[#C5A880] font-bold shrink-0">{formatPrice(it.price * it.quantity)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Delivery summary */}
                    <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                      <div className="text-slate-400 text-[11px] truncate max-w-[280px]">
                        <span className="text-slate-500">Deliver to: </span>
                        {typeof ord.shippingAddress === 'object'
                          ? `${ord.shippingAddress.address || ''}, ${ord.shippingAddress.city || ''}`
                          : ord.shippingAddress}
                      </div>
                      <div className="font-bold text-white">
                        <span className="text-slate-400 font-normal mr-1">Total:</span>
                        <span className="text-[#C5A880]">{formatPrice(ord.totalAmount)}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* 5. LOGGED IN — MY WISHLIST TAB */}
          {/* ========================================================================= */}
          {isAuthenticated && authModalTab === 'wishlist' && (
            <div className="space-y-3.5 max-h-[60vh] overflow-y-auto pr-1">
              {wishlistItems.length === 0 ? (
                <div className="text-center py-12 bg-slate-900/50 rounded-2xl border border-slate-800">
                  <Heart className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-sm font-bold text-slate-200">Your Wishlist is Empty</p>
                  <p className="text-xs text-slate-400 font-light mt-1 max-w-xs mx-auto mb-4">
                    Explore our heavy GSM blanks and drop releases to save your favorite t-shirts.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      handleClose();
                      const el = document.getElementById('catalog');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-5 py-2.5 bg-[#C5A880] hover:bg-[#b0936d] text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                  >
                    Browse T-Shirts
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-xs font-mono text-slate-400">
                      {wishlistItems.length} saved {wishlistItems.length === 1 ? 'item' : 'items'} in your wishlist
                    </span>
                    <button
                      type="button"
                      onClick={handleMoveAllWishlistToCart}
                      className="text-xs font-mono text-[#C5A880] hover:underline flex items-center gap-1 cursor-pointer font-semibold"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Move All to Bag</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {wishlistItems.map((product) => {
                      const selectedSize = wishlistSelectedSizes[product.id] || (product.sizes ? product.sizes[0] : 'L');
                      return (
                        <div
                          key={product.id}
                          className="p-3.5 bg-slate-900/80 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                        >
                          {/* Image & Product Info */}
                          <div className="flex items-center gap-3">
                            <img
                              src={product.images?.[0] || product.image}
                              alt={product.name}
                              className="w-16 h-16 rounded-xl object-cover bg-slate-800 border border-slate-700 shrink-0"
                            />
                            <div>
                              <span className="text-[10px] font-mono uppercase text-[#C5A880] tracking-wider block">
                                {product.gsm || '360 GSM'} • {product.category || 'Tee'}
                              </span>
                              <h4 className="text-xs font-bold text-white uppercase tracking-wider line-clamp-1">
                                {product.name}
                              </h4>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs font-mono font-bold text-white">
                                  {formatPrice(product.price)}
                                </span>
                                {product.originalPrice && product.originalPrice > product.price && (
                                  <span className="text-[11px] font-mono text-slate-500 line-through">
                                    {formatPrice(product.originalPrice)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Size Selection & Action buttons */}
                          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                            {/* Size selector */}
                            {product.sizes && product.sizes.length > 0 && (
                              <select
                                value={selectedSize}
                                onChange={(e) =>
                                  setWishlistSelectedSizes((prev) => ({
                                    ...prev,
                                    [product.id]: e.target.value,
                                  }))
                                }
                                className="bg-slate-800 border border-slate-700 text-white rounded-xl text-xs px-2.5 py-2 outline-none font-mono cursor-pointer"
                              >
                                {product.sizes.map((s) => (
                                  <option key={s} value={s}>
                                    Size {s}
                                  </option>
                                ))}
                              </select>
                            )}

                            {/* Add to Bag */}
                            <button
                              type="button"
                              onClick={() => handleMoveWishlistToCart(product)}
                              className="px-3.5 py-2 bg-white hover:bg-slate-200 text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow"
                            >
                              <ShoppingBag className="w-3.5 h-3.5" />
                              <span>Add to Bag</span>
                            </button>

                            {/* Remove from Wishlist */}
                            <button
                              type="button"
                              onClick={() => {
                                removeFromWishlist(product.id);
                                showToast(`Removed ${product.name} from Wishlist`, 'info');
                              }}
                              className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-rose-900/40"
                              title="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

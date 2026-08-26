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
  ArrowLeft,
  ShieldCheck,
  CreditCard,
  Banknote,
  ShoppingBag,
  Trash2,
  Sparkles,
  ExternalLink,
  KeyRound,
  RefreshCw,
  Key,
  Shield,
  Check,
} from 'lucide-react';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { useScrollLock } from '../../hooks/useScrollLock';
import { formatPrice } from '../../utils/formatters';

function getPasswordStrength(pass) {
  if (!pass) return { score: 0, label: '', color: '' };
  let score = 0;
  if (pass.length >= 6) score += 1;
  if (pass.length >= 8) score += 1;
  if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 1;
  if (/[0-9]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score += 1;

  if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-red-500' };
  if (score === 2) return { score: 2, label: 'Fair', color: 'bg-amber-500' };
  if (score === 3) return { score: 3, label: 'Good', color: 'bg-blue-400' };
  return { score: 4, label: 'Strong', color: 'bg-emerald-400' };
}

export default function CustomerModal() {
  const {
    customer,
    isAuthenticated,
    loading,
    orders,
    resetState,
    login,
    register,
    logout,
    updateProfile,
    sendResetOtp,
    verifyResetOtp,
    updatePassword,
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

  // Form states for Forgot Password / OTP Flow
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');
  const [resetDone, setResetDone] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Resend OTP countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

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
      if (authModalTab === 'login' || authModalTab === 'register' || authModalTab === 'forgot' || authModalTab === 'verify-otp') {
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
    setForgotError('');
    setResetError('');
    setResetSuccess('');
    setResetDone(false);
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

  // Step 1: Send OTP to email or phone
  const handleSendOtp = async (e) => {
    e?.preventDefault();
    setForgotError('');
    const target = forgotIdentifier.trim();
    if (!target) {
      setForgotError('Please enter your registered email address or mobile number.');
      return;
    }

    const res = await sendResetOtp(target);
    if (res.success) {
      showToast(res.message || 'Verification OTP code dispatched!', 'success');
      setCountdown(60);
      setOtpCode('');
      setResetError('');
      setResetSuccess('');
      setResetDone(false);
      setAuthModalTab('verify-otp');
    } else {
      setForgotError(res.error || 'Failed to send OTP code. Please check your input.');
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (countdown > 0) return;
    setResetError('');
    setResetSuccess('');
    const target = resetState?.identifier || forgotIdentifier.trim();
    if (!target) return;

    const res = await sendResetOtp(target);
    if (res.success) {
      showToast('A new OTP verification code has been sent!', 'success');
      setCountdown(60);
    } else {
      setResetError(res.error || 'Failed to resend OTP.');
    }
  };

  // Step 2: Verify OTP and Set New Password in Supabase Auth
  const handleVerifyAndReset = async (e) => {
    e.preventDefault();
    setResetError('');
    setResetSuccess('');

    const cleanOtp = otpCode.trim().replace(/\s/g, '');
    if (!cleanOtp || cleanOtp.length < 6) {
      setResetError('Please enter the full 6-digit OTP code received.');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setResetError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setResetError('New password and confirm password do not match.');
      return;
    }

    const target = resetState?.identifier || forgotIdentifier.trim();

    // 1. If not already verified via email link, verify OTP token with Supabase Auth
    if (!resetState?.otpVerified) {
      const verifyRes = await verifyResetOtp(target, cleanOtp);
      if (!verifyRes.success) {
        setResetError(verifyRes.error || 'Invalid or expired OTP code.');
        return;
      }
    }

    // 2. Update actual password in Supabase Auth (auth.users)
    const updateRes = await updatePassword(newPassword, target);
    if (updateRes.success) {
      setResetDone(true);
      setResetSuccess('Your Supabase Auth password has been updated successfully!');
      showToast('Password reset successfully! You can now sign in.', 'success');
    } else {
      setResetError(updateRes.error || 'Failed to update password. Please try again.');
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
                  setForgotError('');
                  setResetError('');
                }}
                className={`flex-1 min-w-[100px] py-2.5 text-xs font-mono uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
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
                  setForgotError('');
                  setResetError('');
                }}
                className={`flex-1 min-w-[120px] py-2.5 text-xs font-mono uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                  authModalTab === 'register'
                    ? 'bg-white text-black font-bold shadow-lg'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Create Account
              </button>
              {(authModalTab === 'forgot' || authModalTab === 'verify-otp') && (
                <button
                  type="button"
                  className="flex-1 min-w-[130px] py-2.5 text-xs font-mono uppercase tracking-wider rounded-xl transition-all bg-[#C5A880]/20 text-[#C5A880] border border-[#C5A880]/40 font-bold flex items-center justify-center gap-1.5 cursor-default"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Reset OTP</span>
                </button>
              )}
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

              {/* Password field with show/hide toggle & Forgot Password action */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-mono uppercase text-slate-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotIdentifier(loginIdentifier || '');
                      setForgotError('');
                      setAuthModalTab('forgot');
                    }}
                    className="text-[11px] font-mono text-[#C5A880] hover:text-[#d8be99] hover:underline cursor-pointer flex items-center gap-1 transition-colors"
                  >
                    <KeyRound className="w-3 h-3" />
                    <span>Forgot Password?</span>
                  </button>
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

              <div className="flex items-center justify-between pt-1 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setForgotIdentifier(loginIdentifier || '');
                    setForgotError('');
                    setAuthModalTab('forgot');
                  }}
                  className="text-slate-400 hover:text-[#C5A880] transition-colors text-[11px] font-mono flex items-center gap-1"
                >
                  <Shield className="w-3 h-3 text-[#C5A880]" /> Reset via Supabase OTP
                </button>

                <p className="text-slate-400">
                  New here?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthModalTab('register')}
                    className="text-[#C5A880] hover:underline font-mono font-semibold ml-1 cursor-pointer"
                  >
                    Create Account
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* ========================================================================= */}
          {/* 1.5. FORGOT PASSWORD — STEP 1: REQUEST OTP */}
          {/* ========================================================================= */}
          {!isAuthenticated && authModalTab === 'forgot' && (
            <form onSubmit={handleSendOtp} className="space-y-4 animate-fadeIn">
              <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-2 text-[#C5A880] mb-1.5">
                  <KeyRound className="w-4 h-4" />
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider">
                    Forgot Password / Reset with OTP
                  </h3>
                </div>
                <p className="text-[12px] text-slate-400 leading-relaxed">
                  Enter your registered <strong className="text-slate-200">Email Address</strong> or <strong className="text-slate-200">Mobile Phone Number</strong>. Supabase Auth will generate and dispatch a secure one-time verification code (OTP).
                </p>
              </div>

              {forgotError && (
                <div className="p-3 bg-red-950/40 border border-red-800/60 rounded-xl text-red-300 text-xs flex items-center gap-2 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{forgotError}</span>
                </div>
              )}

              <div>
                <label className="text-[11px] font-mono uppercase text-slate-300 block mb-1">
                  Email Address or Mobile Number *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    autoFocus
                    placeholder="e.g. alex.vanguard@lunar.com or +1 555 019 2834"
                    value={forgotIdentifier}
                    onChange={(e) => setForgotIdentifier(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-[#C5A880] transition-colors"
                  />
                  <div className="absolute right-3.5 top-3.5 flex items-center gap-1 text-slate-500">
                    <Mail className="w-4 h-4" />
                    <span className="text-slate-600">/</span>
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2.5">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-gradient-to-r from-[#C5A880] to-[#dfc49d] hover:from-[#b89b73] hover:to-[#d0b48d] text-black font-bold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Sending OTP Code...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Verification Code (OTP)</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAuthModalTab('login');
                    setForgotError('');
                  }}
                  className="w-full py-2.5 text-xs font-mono text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Sign In</span>
                </button>
              </div>
            </form>
          )}

          {/* ========================================================================= */}
          {/* 1.6. RESET PASSWORD — STEP 2: VERIFY OTP & UPDATE SUPABASE PASSWORD */}
          {/* ========================================================================= */}
          {!isAuthenticated && authModalTab === 'verify-otp' && (
            <div className="space-y-4 animate-fadeIn">
              {resetDone ? (
                /* Celebratory Success Screen */
                <div className="p-6 bg-slate-900/90 rounded-2xl border border-emerald-500/30 text-center space-y-4">
                  <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 animate-bounce">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white font-display">
                      Password Successfully Updated!
                    </h3>
                    <p className="text-xs text-slate-300 mt-1.5 leading-relaxed max-w-sm mx-auto">
                      Your Supabase Auth credentials have been updated securely. You can now log in with your newly created password.
                    </p>
                  </div>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthModalTab('login');
                        setResetDone(false);
                        setLoginPassword('');
                        if (resetState?.identifier || forgotIdentifier) {
                          setLoginIdentifier(resetState?.identifier || forgotIdentifier);
                        }
                      }}
                      className="w-full py-3.5 bg-white hover:bg-slate-200 text-black font-bold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                    >
                      <span>Proceed to Sign In</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                /* Verification Form */
                <form onSubmit={handleVerifyAndReset} className="space-y-4">
                  {/* Status Banner */}
                  <div className="p-3.5 bg-slate-900/80 rounded-2xl border border-slate-800 flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-[#C5A880]/10 text-[#C5A880] border border-[#C5A880]/20 shrink-0">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono text-[#C5A880] uppercase tracking-wider font-bold">
                          Verification OTP Sent
                        </span>
                        <button
                          type="button"
                          onClick={() => setAuthModalTab('forgot')}
                          className="text-[10px] font-mono text-slate-400 hover:text-white underline cursor-pointer"
                        >
                          Change
                        </button>
                      </div>
                      <p className="text-xs text-slate-300 mt-0.5">
                        Code sent to <strong className="text-white font-mono">{resetState?.maskedTarget || forgotIdentifier || 'your destination'}</strong>
                      </p>
                    </div>
                  </div>

                  {resetError && (
                    <div className="p-3 bg-red-950/40 border border-red-800/60 rounded-xl text-red-300 text-xs flex items-center gap-2 animate-fadeIn">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{resetError}</span>
                    </div>
                  )}

                  {/* 6-Digit OTP Input */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-mono uppercase text-slate-300">
                        6-Digit Verification Code (OTP) *
                      </label>
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={countdown > 0 || loading}
                        className={`text-[10px] font-mono flex items-center gap-1 transition-colors ${
                          countdown > 0 ? 'text-slate-500 cursor-not-allowed' : 'text-[#C5A880] hover:underline cursor-pointer'
                        }`}
                      >
                        <RefreshCw className={`w-3 h-3 ${countdown > 0 ? '' : 'animate-pulse'}`} />
                        {countdown > 0 ? `Resend code in ${countdown}s` : 'Resend OTP Code'}
                      </button>
                    </div>
                    <input
                      type="text"
                      maxLength={8}
                      required
                      autoFocus
                      placeholder="e.g. 123456"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9a-zA-Z]/g, '').slice(0, 6))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-center text-lg font-mono tracking-[0.4em] text-white outline-none focus:border-[#C5A880] transition-colors"
                    />
                  </div>

                  {/* New Password */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-mono uppercase text-slate-300">
                        New Supabase Auth Password *
                      </label>
                      {newPassword && (
                        <div className="flex items-center gap-1 text-[10px] font-mono">
                          <span className="text-slate-400">Strength:</span>
                          <span className={`px-1.5 py-0.2 rounded text-slate-900 font-bold ${getPasswordStrength(newPassword).color}`}>
                            {getPasswordStrength(newPassword).label}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        required
                        placeholder="Minimum 6 characters"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-[#C5A880] transition-colors pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-3 p-0.5 text-slate-400 hover:text-white cursor-pointer"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm New Password */}
                  <div>
                    <label className="text-[11px] font-mono uppercase text-slate-300 block mb-1">
                      Confirm New Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        placeholder="Re-enter new password"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        className={`w-full bg-slate-900 border rounded-xl px-4 py-3 text-xs text-white outline-none transition-colors pr-10 ${
                          confirmNewPassword && newPassword !== confirmNewPassword
                            ? 'border-red-500 focus:border-red-400'
                            : 'border-slate-700 focus:border-[#C5A880]'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3 p-0.5 text-slate-400 hover:text-white cursor-pointer"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {confirmNewPassword && newPassword !== confirmNewPassword && (
                      <span className="text-[10px] font-mono text-red-400 mt-1 block">
                        Passwords do not match.
                      </span>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2 flex flex-col gap-2.5">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 bg-gradient-to-r from-[#C5A880] to-[#dfc49d] hover:from-[#b89b73] hover:to-[#d0b48d] text-black font-bold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Updating Supabase Password...</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          <span>Verify OTP & Update Password</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setAuthModalTab('login');
                        setResetError('');
                      }}
                      className="w-full py-2.5 text-xs font-mono text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to Sign In</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
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

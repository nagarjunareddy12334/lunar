import React, { useState, useEffect } from 'react';
import { Search, Heart, ShoppingBag, Menu, X, Moon, Sparkles, User, Package } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { useSoundFX } from '../../hooks/useSoundFX';

export default function Navbar({ onOpenSearch, onNavigate, onSelectCategory, onGoHome }) {
  const { setIsCartOpen, totalItemCount } = useCart();
  const { setIsWishlistOpen, wishlistCount } = useWishlist();
  const { customer, isAuthenticated, openAuthModal, orders } = useCustomerAuth();
  const { playClick, playHover } = useSoundFX();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (sectionId, category = null) => {
    playClick();
    setMobileMenuOpen(false);
    if (onGoHome) onGoHome();
    if (category && onSelectCategory) {
      onSelectCategory(category);
    }
    setTimeout(() => {
      if (onNavigate) {
        onNavigate(sectionId);
      } else {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  const handleOpenOrders = () => {
    playClick();
    openAuthModal(isAuthenticated ? 'orders' : 'login');
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#090A0F]/95 backdrop-blur-xl shadow-2xl py-3 border-b border-slate-800'
          : 'bg-[#090A0F]/90 backdrop-blur-md py-4 border-b border-white/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-7 text-xs tracking-[0.18em] uppercase font-medium text-slate-300">
          <button
            onClick={() => handleLinkClick('catalog', 'all')}
            onMouseEnter={playHover}
            className="hover:text-white transition-colors cursor-pointer"
          >
            All Tees
          </button>

          <button
            onClick={() => handleLinkClick('catalog', 'oversized')}
            onMouseEnter={playHover}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Oversized
          </button>

          <button
            onClick={() => handleLinkClick('catalog', 'graphic')}
            onMouseEnter={playHover}
            className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-[#C5A880]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Graphic Drops
          </button>

          <button
            onClick={() => handleLinkClick('catalog', 'minimal')}
            onMouseEnter={playHover}
            className="hover:text-white transition-colors cursor-pointer"
          >
            360 GSM Heavy
          </button>

          <button
            onClick={() => handleLinkClick('fabric-guide')}
            onMouseEnter={playHover}
            className="hover:text-white transition-colors cursor-pointer text-slate-400 hover:text-slate-200"
          >
            Fabric Guide
          </button>
        </nav>

        {/* Center Brand Logo */}
        <div className="flex items-center">
          <button
            onClick={() => {
              playClick();
              if (onGoHome) onGoHome();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onMouseEnter={playHover}
            className="group flex items-center gap-2.5 text-left cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-800 via-slate-600 to-white flex items-center justify-center p-0.5 shadow-md shadow-slate-900/50 group-hover:scale-110 transition-transform duration-300">
              <div className="w-full h-full bg-[#090A0F] rounded-full flex items-center justify-center">
                <Moon className="w-4 h-4 text-slate-200 fill-slate-200/40 transform -rotate-12 group-hover:rotate-12 transition-transform duration-500" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-black tracking-[0.25em] text-white uppercase font-display leading-none">
                LUNAR
              </span>
              <span className="text-[8px] tracking-[0.35em] text-[#C5A880] uppercase font-mono mt-0.5">
                HEAVYWEIGHT TEES
              </span>
            </div>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Search Button */}
          <button
            onClick={() => {
              playClick();
              onOpenSearch();
            }}
            onMouseEnter={playHover}
            className="p-2 sm:p-2.5 text-slate-300 hover:text-white hover:bg-white/5 rounded-full transition-all cursor-pointer"
            aria-label="Search collection"
            title="Search tees (⌘K)"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Wishlist Button */}
          <button
            onClick={() => {
              playClick();
              setIsWishlistOpen(true);
            }}
            onMouseEnter={playHover}
            className="p-2 sm:p-2.5 text-slate-300 hover:text-white hover:bg-white/5 rounded-full transition-all relative cursor-pointer"
            aria-label="Wishlist"
            title="Saved items"
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 w-4 h-4 bg-rose-500 text-white font-bold text-[10px] rounded-full flex items-center justify-center shadow-sm">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Dedicated Orders / My Orders Button */}
          <button
            onClick={handleOpenOrders}
            onMouseEnter={playHover}
            className={`p-2 sm:px-3 sm:py-2 rounded-full transition-all relative flex items-center gap-1.5 cursor-pointer border ${
              isAuthenticated && orders?.length > 0
                ? 'border-[#C5A880]/30 bg-[#C5A880]/10 text-slate-200 hover:bg-[#C5A880]/20 hover:text-white'
                : 'border-transparent text-slate-300 hover:text-white hover:bg-white/5 hover:border-white/10'
            }`}
            aria-label="My Orders"
            title={isAuthenticated ? `My Orders (${orders?.length || 0})` : 'My Orders (Sign in to view)'}
          >
            <div className="relative flex items-center justify-center">
              <Package className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              {isAuthenticated && orders?.length > 0 && (
                <span className="absolute -top-2 -right-2.5 min-w-[15px] h-3.5 px-1 bg-[#C5A880] text-black font-extrabold text-[9px] rounded-full flex items-center justify-center shadow-md font-mono">
                  {orders.length}
                </span>
              )}
            </div>
            <span className="hidden md:inline text-xs font-mono tracking-wider font-semibold">
              Orders
            </span>
          </button>

          {/* Customer Account Button */}
          <button
            onClick={() => {
              playClick();
              openAuthModal(isAuthenticated ? 'profile' : 'login');
            }}
            onMouseEnter={playHover}
            className={`p-2 sm:px-3 sm:py-2 rounded-full transition-all flex items-center gap-2 cursor-pointer ${
              isAuthenticated
                ? 'bg-white/10 text-slate-200 border border-white/20 hover:bg-white/15 hover:text-white'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
            aria-label="Customer Account"
            title={isAuthenticated ? `Account: ${customer?.fullName || 'Profile'}` : 'Sign In / Register'}
          >
            <User className="w-4 h-4" />
            <span className="hidden md:inline text-xs font-mono tracking-wider font-semibold">
              {isAuthenticated ? (customer?.fullName?.split(' ')[0] || 'Account') : 'Sign In'}
            </span>
          </button>

          {/* Bag / Cart Button */}
          <button
            onClick={() => {
              playClick();
              setIsCartOpen(true);
            }}
            onMouseEnter={playHover}
            className="flex items-center gap-2 sm:gap-2.5 px-3 sm:px-4 py-2 bg-white/10 hover:bg-white/15 border border-white/15 hover:border-white/30 rounded-full transition-all text-slate-100 hover:text-white cursor-pointer group"
            aria-label="Shopping bag"
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4 transition-transform group-hover:scale-110" />
              {totalItemCount > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-white text-[#090A0F] font-black text-[10px] rounded-full flex items-center justify-center shadow-md">
                  {totalItemCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline text-xs font-mono tracking-wider font-bold">
              BAG {totalItemCount > 0 && `(${totalItemCount})`}
            </span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => {
              playClick();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="lg:hidden p-2 text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-full bg-[#090A0F]/98 border-b border-slate-800 backdrop-blur-2xl px-6 py-8 shadow-2xl transition-all animate-fadeIn">
          {/* Mobile Customer Status & Quick Actions */}
          <div className="mb-5 pb-5 border-b border-slate-800 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  playClick();
                  openAuthModal(isAuthenticated ? 'profile' : 'login');
                }}
                className="flex items-center gap-2 text-xs font-mono text-[#C5A880] cursor-pointer hover:underline"
              >
                <User className="w-4 h-4" />
                <span>{isAuthenticated ? `Account: ${customer?.fullName || customer?.email}` : 'Sign In / Register Account'}</span>
              </button>
            </div>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleOpenOrders();
              }}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-[#C5A880]/50 text-xs font-mono uppercase tracking-wider text-slate-200 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-[#C5A880]" />
                <span>My Orders</span>
              </div>
              {isAuthenticated && orders?.length > 0 ? (
                <span className="px-2 py-0.5 rounded-full bg-[#C5A880] text-black text-[10px] font-extrabold font-mono">
                  {orders.length} {orders.length === 1 ? 'ORDER' : 'ORDERS'}
                </span>
              ) : (
                <span className="text-[10px] text-slate-400">Track & View &rarr;</span>
              )}
            </button>
          </div>

          <div className="flex flex-col gap-4 text-sm tracking-[0.2em] uppercase font-medium text-slate-300">
            <button
              onClick={() => handleLinkClick('catalog', 'all')}
              className="text-left py-2 hover:text-white border-b border-slate-800/60 cursor-pointer"
            >
              All T-Shirts
            </button>
            <button
              onClick={() => handleLinkClick('catalog', 'oversized')}
              className="text-left py-2 hover:text-white border-b border-slate-800/60 cursor-pointer"
            >
              Oversized & Boxy Fits
            </button>
            <button
              onClick={() => handleLinkClick('catalog', 'graphic')}
              className="text-left py-2 hover:text-[#C5A880] text-[#C5A880] flex items-center justify-between border-b border-slate-800/60 cursor-pointer"
            >
              <span>Graphic & Cyberpunk</span>
              <Sparkles className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleLinkClick('catalog', 'vintage')}
              className="text-left py-2 hover:text-white border-b border-slate-800/60 cursor-pointer"
            >
              Acid Washed & Vintage
            </button>
            <button
              onClick={() => handleLinkClick('catalog', 'minimal')}
              className="text-left py-2 hover:text-white border-b border-slate-800/60 cursor-pointer"
            >
              360 GSM Heavyweight Blanks
            </button>
            <button
              onClick={() => handleLinkClick('fabric-guide')}
              className="text-left py-2 hover:text-white border-b border-slate-800/60 cursor-pointer"
            >
              Fabric & GSM Guide
            </button>
            <button
              onClick={() => handleLinkClick('community')}
              className="text-left py-2 hover:text-white cursor-pointer"
            >
              Customer Reviews
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800 flex flex-wrap justify-between items-center gap-2 text-xs text-slate-400 font-mono">
            <span>SHIPPING: WORLDWIDE OVER $75</span>
            <span className="text-[#C5A880]">CODE: LUNARTEE15</span>
          </div>
        </div>
      )}
    </header>
  );
}

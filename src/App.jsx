import React, { useState } from 'react';
import { ToastProvider } from './context/ToastContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

import AnnouncementBar from './components/layout/AnnouncementBar';
import Navbar from './components/layout/Navbar';
import HeroSection from './components/hero/HeroSection';
import MarqueeTicker from './components/ui/MarqueeTicker';
import DropCountdown from './components/hero/DropCountdown';
import ProductCatalog from './components/products/ProductCatalog';
import LookbookBuilder from './components/lookbook/LookbookBuilder';
import BrandStory from './components/brand/BrandStory';
import CommunityOrbit from './components/brand/CommunityOrbit';
import Footer from './components/layout/Footer';

import CustomCursor from './components/ui/CustomCursor';
import CelestialCanvas from './components/ui/CelestialCanvas';
import ProductQuickView from './components/products/ProductQuickView';
import SizeGuideModal from './components/products/SizeGuideModal';
import CartDrawer from './components/cart/CartDrawer';
import CheckoutModal from './components/cart/CheckoutModal';
import WishlistDrawer from './components/wishlist/WishlistDrawer';
import SearchModal from './components/ui/SearchModal';

function MainApp() {
  // Modal & Drawer State
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleNavigate = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenQuickView = (product) => {
    setQuickViewProduct(product);
  };

  const handleCloseQuickView = () => {
    setQuickViewProduct(null);
  };

  return (
    <div className="min-h-screen bg-[#090A0F] text-slate-100 flex flex-col font-sans selection:bg-[#C5A880]/30 selection:text-white relative">
      {/* Avant-Garde Interactive Cursor Follower */}
      <CustomCursor />

      {/* Dynamic Stardust & Constellation Celestial Background */}
      <CelestialCanvas />

      {/* Top Banner */}
      <AnnouncementBar />

      {/* Navigation */}
      <Navbar
        onOpenSearch={() => setIsSearchOpen(true)}
        onNavigate={handleNavigate}
      />

      {/* Main Content Sections */}
      <main className="flex-1 relative z-10">
        {/* 1. Hero with Interactive 3D Lunar Orb */}
        <HeroSection
          onExplore={() => handleNavigate('catalog')}
          onOpenLookbook={() => handleNavigate('lookbook')}
        />

        {/* Infinite Runway Typography Ticker (Phase 1) */}
        <MarqueeTicker speed={35} />

        {/* 2. Drop Countdown with Radar Scan */}
        <DropCountdown />

        {/* 3. Product Catalog with 3D Tilt Cards & Specular Sheen */}
        <ProductCatalog
          searchQuery={searchQuery}
          onQuickView={handleOpenQuickView}
        />

        {/* Infinite Runway Typography Ticker (Reverse Flow) */}
        <MarqueeTicker reverse speed={40} />

        {/* 4. Lookbook Studio */}
        <LookbookBuilder />

        {/* 5. Brand Story & Craftsmanship */}
        <BrandStory />

        {/* 6. Community & Customer Reviews */}
        <CommunityOrbit />
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Modals and Drawers */}
      <ProductQuickView
        product={quickViewProduct}
        isOpen={Boolean(quickViewProduct)}
        onClose={handleCloseQuickView}
        onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
      />

      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
      />

      <CartDrawer
        onOpenCheckout={() => setIsCheckoutOpen(true)}
      />

      <WishlistDrawer
        onQuickView={handleOpenQuickView}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={(product) => {
          handleOpenQuickView(product);
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <CartProvider>
        <WishlistProvider>
          <MainApp />
        </WishlistProvider>
      </CartProvider>
    </ToastProvider>
  );
}

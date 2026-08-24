import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Heart,
  ShoppingBag,
  Star,
  Ruler,
  ShieldCheck,
  Truck,
  Plus,
  Minus,
  Sparkles,
  Layers,
  RotateCcw,
  Check,
  Share2,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';
import { formatPrice } from '../../utils/formatters';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';
import { useSoundFX } from '../../hooks/useSoundFX';
import { PRODUCTS } from '../../data/products';
import ProductCard from './ProductCard';

export default function ProductDetailPage({
  product,
  onBack,
  onSelectProduct,
  onOpenSizeGuide,
  onOpenCheckout,
  onQuickView
}) {
  const { addToCart, setIsCartOpen } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToast } = useToast();
  const { playClick, playHover, playSuccessChime } = useSoundFX();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(
    product.colors && product.colors.length > 0 ? product.colors[0] : null
  );
  const [selectedSize, setSelectedSize] = useState(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'L'
  );
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [activeTab, setActiveTab] = useState('specs');
  const [expandedSection, setExpandedSection] = useState('fabric');
  const [copiedLink, setCopiedLink] = useState(false);

  // Scroll to top when product changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSelectedImageIndex(0);
    if (product.colors && product.colors.length > 0) {
      setSelectedColor(product.colors[0]);
    }
    if (product.sizes && product.sizes.length > 0) {
      setSelectedSize(product.sizes[0]);
    }
    setQuantity(1);
  }, [product.id]);

  const isSaved = isInWishlist(product.id);
  const images = product.images || [];

  // Related products from same or different categories
  const relatedProducts = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 3);

  const handleColorChange = (color) => {
    playClick(1400);
    setSelectedColor(color);
    const matchIdx = images.findIndex((img) => img === color.image);
    if (matchIdx > -1) {
      setSelectedImageIndex(matchIdx);
    }
  };

  const handleAddToCart = (openDrawer = true) => {
    addToCart(product, selectedSize, selectedColor?.name, quantity);
    playSuccessChime();
    addToast(`Added "${product.name}" (${selectedSize}, ${selectedColor?.name || 'Standard'}) to Bag!`, 'success');
    if (openDrawer) {
      setIsCartOpen(true);
    }
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, selectedColor?.name, quantity);
    playSuccessChime();
    if (onOpenCheckout) {
      onOpenCheckout();
    }
  };

  const handleShare = () => {
    playClick();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      addToast('Product link copied to clipboard!', 'info');
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  const toggleAccordion = (section) => {
    playClick();
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="min-h-screen bg-[#090A0F] text-slate-100 pb-28 animate-fadeIn">
      {/* Top Breadcrumbs & Back Navigation Bar */}
      <div className="border-b border-slate-800/80 bg-[#0C0E15]/90 backdrop-blur-md sticky top-16 z-30 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                playClick();
                onBack();
              }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-mono uppercase tracking-wider transition-all cursor-pointer group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>Back to Collection</span>
            </button>

            {/* Breadcrumbs */}
            <div className="hidden md:flex items-center gap-2 text-xs font-mono text-slate-500">
              <span>Home</span>
              <span>/</span>
              <span>T-Shirts</span>
              <span>/</span>
              <span className="capitalize text-slate-400">{product.category}</span>
              <span>/</span>
              <span className="text-slate-200 truncate max-w-[200px]">{product.name}</span>
            </div>
          </div>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-mono"
            title="Share Product"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{copiedLink ? 'Copied' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* Main Product Showcase Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* LEFT: Multi-Angle Interactive Gallery (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Stage Image with Zoom Lens */}
            <div
              className="relative aspect-[3/4] w-full rounded-3xl overflow-hidden bg-[#0D0E14] border border-slate-800 shadow-2xl cursor-crosshair group"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
            >
              <img
                src={images[selectedImageIndex] || product.images[0]}
                alt={product.name}
                className={`w-full h-full object-cover object-center transition-transform duration-300 ${
                  isZoomed ? 'scale-150' : 'scale-100'
                }`}
                style={
                  isZoomed
                    ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` }
                    : undefined
                }
              />

              {/* Floating Specification Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10 pointer-events-none">
                {product.badge && (
                  <span className="px-3 py-1 rounded-lg bg-[#090A0F]/90 backdrop-blur-md text-[11px] font-mono uppercase tracking-wider text-white font-bold border border-white/20 shadow-lg">
                    {product.badge}
                  </span>
                )}
                {product.gsm && (
                  <span className="px-2.5 py-1 rounded-lg bg-[#C5A880]/20 backdrop-blur-md text-[10px] font-mono uppercase tracking-wider text-[#C5A880] border border-[#C5A880]/40">
                    {product.gsm} GSM HEAVYWEIGHT
                  </span>
                )}
                {product.fit && (
                  <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[10px] font-mono uppercase tracking-wider text-slate-300 border border-white/10">
                    {product.fit}
                  </span>
                )}
              </div>

              {/* Angle Selector Tabs */}
              <div className="absolute bottom-4 left-4 z-10 flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    playClick(1400);
                    setSelectedImageIndex(0);
                  }}
                  className={`px-3 py-1 rounded-lg text-[10px] font-mono uppercase tracking-wider backdrop-blur-md transition-all cursor-pointer ${
                    selectedImageIndex === 0
                      ? 'bg-white text-black font-bold shadow-md'
                      : 'bg-black/70 text-slate-300 hover:bg-black/90 border border-white/10'
                  }`}
                >
                  Front View
                </button>
                {images.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      playClick(1400);
                      setSelectedImageIndex(1);
                    }}
                    className={`px-3 py-1 rounded-lg text-[10px] font-mono uppercase tracking-wider backdrop-blur-md transition-all cursor-pointer ${
                      selectedImageIndex === 1
                        ? 'bg-white text-black font-bold shadow-md'
                        : 'bg-black/70 text-slate-300 hover:bg-black/90 border border-white/10'
                    }`}
                  >
                    Back / Model View
                  </button>
                )}
              </div>

              {/* Hover Zoom Hint */}
              <div className="absolute bottom-4 right-4 z-10 pointer-events-none opacity-80 group-hover:opacity-0 transition-opacity">
                <span className="px-2.5 py-1 rounded-lg bg-black/70 text-[10px] font-mono text-slate-400 border border-white/10">
                  Hover to Zoom 🔍
                </span>
              </div>
            </div>

            {/* Thumbnail Navigation Row */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      playClick(1500);
                      setSelectedImageIndex(idx);
                    }}
                    onMouseEnter={playHover}
                    className={`relative aspect-[3/4] rounded-2xl overflow-hidden bg-slate-900 border-2 transition-all cursor-pointer ${
                      selectedImageIndex === idx
                        ? 'border-white ring-2 ring-[#C5A880] scale-95 shadow-xl'
                        : 'border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/70 text-[8px] font-mono uppercase text-slate-300">
                      {idx === 0 ? 'Front' : idx === 1 ? 'Back' : `Angle ${idx + 1}`}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Product Specs & Direct Buy Actions (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Header & Rating */}
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                <span className="uppercase tracking-widest text-[#C5A880] font-semibold">
                  LUNAR APPAREL • {product.category.toUpperCase()}
                </span>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Star className="w-4 h-4 text-[#C5A880] fill-[#C5A880]" />
                  <span className="font-bold">{product.rating}</span>
                  <span className="text-slate-500">({product.reviewsCount} verified reviews)</span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold uppercase tracking-tight text-white font-display leading-tight">
                {product.name}
              </h1>

              <p className="text-sm text-slate-400 font-mono mt-2">
                {product.tagline}
              </p>
            </div>

            {/* Price & Installments */}
            <div className="p-4 rounded-2xl bg-[#10121A] border border-slate-800/80 space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black font-mono text-white">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-base font-mono text-slate-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                {product.originalPrice && (
                  <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 text-xs font-mono font-bold border border-emerald-500/30">
                    Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                  </span>
                )}
              </div>
              <p className="text-[11px] font-mono text-slate-400">
                Or 4 interest-free payments of <span className="text-slate-200">{formatPrice(product.price / 4)}</span> with Klarna / Afterpay.
              </p>
            </div>

            {/* Description */}
            <p className="text-sm text-slate-300 font-light leading-relaxed">
              {product.description}
            </p>

            {/* Colorway Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-2.5 pt-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400 uppercase tracking-wider">COLOR:</span>
                  <span className="text-white font-bold">{selectedColor?.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  {product.colors.map((color) => {
                    const isSelected = selectedColor?.name === color.name;
                    return (
                      <button
                        key={color.name}
                        onClick={() => handleColorChange(color)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-white/10 border-white text-white ring-1 ring-[#C5A880]'
                            : 'border-slate-800 text-slate-400 hover:border-slate-600 bg-slate-900/50'
                        }`}
                      >
                        <span
                          className="w-4 h-4 rounded-full border border-white/20"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span className="text-xs font-mono">{color.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Size Selection & Size Guide */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-2.5 pt-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 uppercase tracking-wider">SELECT SIZE:</span>
                    <span className="text-white font-bold">{selectedSize}</span>
                  </div>
                  <button
                    onClick={() => {
                      playClick();
                      onOpenSizeGuide();
                    }}
                    className="text-[#C5A880] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>Size & Fit Guide</span>
                  </button>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {product.sizes.map((s) => {
                    const isSelected = selectedSize === s;
                    return (
                      <button
                        key={s}
                        onClick={() => {
                          playClick(1400);
                          setSelectedSize(s);
                        }}
                        className={`py-3 text-xs font-mono uppercase font-bold rounded-xl border transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                          isSelected
                            ? 'bg-white text-black border-white shadow-xl scale-105'
                            : 'border-slate-800 text-slate-300 hover:border-slate-600 bg-[#10121A]'
                        }`}
                      >
                        <span>{s}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Scarcity / Model Note */}
                <div className="flex items-center justify-between text-[11px] font-mono pt-1 text-slate-400">
                  <span className="text-emerald-400 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> In Stock & Ready to Ship
                  </span>
                  <span>{product.modelInfo ? '📐 True to Boxy Fit' : ''}</span>
                </div>
              </div>
            )}

            {/* Purchasing Controls: Quantity + Add to Bag + Buy Now + Wishlist */}
            <div className="space-y-3 pt-4 border-t border-slate-800/80">
              <div className="flex items-center gap-3">
                {/* Quantity Controls */}
                <div className="flex items-center bg-[#10121A] border border-slate-800 rounded-xl p-1 shrink-0">
                  <button
                    onClick={() => {
                      playClick();
                      setQuantity(Math.max(1, quantity - 1));
                    }}
                    className="p-2.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center text-sm font-mono font-bold text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => {
                      playClick();
                      setQuantity(Math.min(product.stock || 10, quantity + 1));
                    }}
                    className="p-2.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Add to Bag CTA */}
                <button
                  onClick={() => handleAddToCart(true)}
                  className="flex-1 py-4 px-6 bg-white text-black hover:bg-slate-200 font-bold text-xs uppercase tracking-[0.2em] rounded-xl transition-all shadow-xl shadow-white/10 flex items-center justify-center gap-2.5 cursor-pointer group"
                >
                  <ShoppingBag className="w-4 h-4 transition-transform group-hover:scale-110" />
                  <span>Add to Bag — {formatPrice(product.price * quantity)}</span>
                </button>

                {/* Wishlist Button */}
                <button
                  onClick={() => {
                    if (!isSaved) playSuccessChime();
                    else playClick();
                    toggleWishlist(product);
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSaved
                      ? 'bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-500/30'
                      : 'border-slate-800 text-slate-300 hover:text-white hover:border-slate-600 bg-[#10121A]'
                  }`}
                  aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
                >
                  <Heart className={`w-5 h-5 ${isSaved ? 'fill-white' : ''}`} />
                </button>
              </div>

              {/* Buy It Now Secondary Action */}
              <button
                onClick={handleBuyNow}
                className="w-full py-3.5 px-6 bg-[#161824] hover:bg-[#1E2130] text-slate-200 hover:text-white font-semibold text-xs font-mono uppercase tracking-widest rounded-xl border border-slate-700/80 transition-all cursor-pointer"
              >
                Instant Buy It Now ⚡
              </button>
            </div>

            {/* Trust Perks Bar */}
            <div className="grid grid-cols-2 gap-3 pt-3">
              <div className="p-3 rounded-xl bg-[#10121A] border border-slate-800/80 flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-[#C5A880] shrink-0" />
                <div className="text-[11px] font-mono leading-tight">
                  <span className="text-white block font-bold">Free Worldwide Shipping</span>
                  <span className="text-slate-400">On all orders over $75</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#10121A] border border-slate-800/80 flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#C5A880] shrink-0" />
                <div className="text-[11px] font-mono leading-tight">
                  <span className="text-white block font-bold">Zero-Sag Collar</span>
                  <span className="text-slate-400">Reinforced tight rib guarantee</span>
                </div>
              </div>
            </div>

            {/* Technical Specifications Accordion */}
            <div className="pt-4 border-t border-slate-800/80 divide-y divide-slate-800/80">
              {/* Fabric Specs */}
              <div className="py-3">
                <button
                  onClick={() => toggleAccordion('fabric')}
                  className="w-full flex items-center justify-between text-xs font-mono uppercase tracking-wider text-slate-200 hover:text-white cursor-pointer py-1"
                >
                  <span className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#C5A880]" />
                    <span>Fabric Weight & Materials</span>
                  </span>
                  {expandedSection === 'fabric' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {expandedSection === 'fabric' && (
                  <div className="mt-3 text-xs text-slate-300 space-y-2 font-light pl-6 animate-fadeIn">
                    {product.specs ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[11px]">
                        <div className="bg-slate-900/60 p-2.5 rounded-lg">
                          <span className="text-slate-500 block">FABRIC:</span>
                          <span className="text-slate-200">{product.specs.fabric}</span>
                        </div>
                        <div className="bg-slate-900/60 p-2.5 rounded-lg">
                          <span className="text-slate-500 block">DENSITY / WEIGHT:</span>
                          <span className="text-[#C5A880] font-bold">{product.specs.weight}</span>
                        </div>
                        <div className="bg-slate-900/60 p-2.5 rounded-lg">
                          <span className="text-slate-500 block">COLLAR CONSTRUCTION:</span>
                          <span className="text-slate-200">{product.specs.collar}</span>
                        </div>
                        <div className="bg-slate-900/60 p-2.5 rounded-lg">
                          <span className="text-slate-500 block">FINISH:</span>
                          <span className="text-slate-200">{product.specs.finish}</span>
                        </div>
                      </div>
                    ) : (
                      <ul className="list-disc space-y-1">
                        {product.details?.map((d, i) => (
                          <li key={i}>{d}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>

              {/* Fit & Sizing */}
              <div className="py-3">
                <button
                  onClick={() => toggleAccordion('fit')}
                  className="w-full flex items-center justify-between text-xs font-mono uppercase tracking-wider text-slate-200 hover:text-white cursor-pointer py-1"
                >
                  <span className="flex items-center gap-2">
                    <Ruler className="w-4 h-4 text-[#C5A880]" />
                    <span>Fit, Cut & Silhouette</span>
                  </span>
                  {expandedSection === 'fit' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {expandedSection === 'fit' && (
                  <div className="mt-3 text-xs text-slate-300 space-y-2 pl-6 animate-fadeIn">
                    <p className="font-light leading-relaxed">
                      Cut with an exaggerated boxy drape, widened chest, and dropped shoulder seams for a modern streetwear silhouette. Does not cling to the body.
                    </p>
                    {product.modelInfo && (
                      <div className="p-2.5 rounded-lg bg-slate-900 text-xs font-mono text-[#C5A880]">
                        📌 {product.modelInfo}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Wash & Care */}
              <div className="py-3">
                <button
                  onClick={() => toggleAccordion('care')}
                  className="w-full flex items-center justify-between text-xs font-mono uppercase tracking-wider text-slate-200 hover:text-white cursor-pointer py-1"
                >
                  <span className="flex items-center gap-2">
                    <RotateCcw className="w-4 h-4 text-[#C5A880]" />
                    <span>Care & Wash Longevity</span>
                  </span>
                  {expandedSection === 'care' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {expandedSection === 'care' && (
                  <div className="mt-3 text-xs text-slate-300 space-y-1.5 pl-6 font-light animate-fadeIn">
                    <p>• Machine wash cold (30°C / 85°F) inside-out with like colors.</p>
                    <p>• Hang dry in shade to preserve cotton density and graphic prints.</p>
                    <p>• Do not tumble dry. Cool iron inside-out if required.</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* You May Also Like / Related Tees Carousel */}
        <div className="mt-24 pt-16 border-t border-slate-800/80">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-mono text-[#C5A880] uppercase tracking-widest block mb-1">
                COMPLETE YOUR ROTATION
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold uppercase text-white font-display">
                You May Also Like
              </h2>
            </div>
            <button
              onClick={onBack}
              className="text-xs font-mono text-slate-400 hover:text-white underline cursor-pointer"
            >
              View All T-Shirts
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {relatedProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onSelectProduct={onSelectProduct}
                onQuickView={onQuickView}
              />
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}

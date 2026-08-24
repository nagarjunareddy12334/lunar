import React, { useState } from 'react';
import { Heart, Eye, Plus, Star, Check, ArrowUpRight, Sparkles } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useSoundFX } from '../../hooks/useSoundFX';

export default function ProductCard({ product, onQuickView, onSelectProduct }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { playClick, playHover, playSuccessChime } = useSoundFX();

  const [selectedColor, setSelectedColor] = useState(
    product.colors && product.colors.length > 0 ? product.colors[0] : null
  );
  const [isHovered, setIsHovered] = useState(false);
  const [showQuickAddSizes, setShowQuickAddSizes] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const activeImage = selectedColor?.image || product.images[0];
  const secondaryImage = product.images[1] || activeImage;
  const isSaved = isInWishlist(product.id);

  const handleCardClick = () => {
    playClick();
    if (onSelectProduct) {
      onSelectProduct(product);
    } else if (onQuickView) {
      onQuickView(product);
    }
  };

  const handleQuickAdd = (size, e) => {
    if (e) e.stopPropagation();
    addToCart(product, size, selectedColor?.name, 1);
    playSuccessChime();
    setJustAdded(true);
    setShowQuickAddSizes(false);
    setTimeout(() => setJustAdded(false), 1400);
  };

  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    toggleWishlist(product);
    if (!isSaved) {
      playSuccessChime();
    } else {
      playClick(900);
    }
  };

  return (
    <div
      className="group relative flex flex-col h-full rounded-2xl overflow-hidden bg-[#10121A] border border-slate-800/80 hover:border-slate-600 transition-all duration-300 hover:shadow-2xl hover:shadow-black/60 cursor-pointer"
      onMouseEnter={() => {
        setIsHovered(true);
        playHover();
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowQuickAddSizes(false);
      }}
      onClick={handleCardClick}
    >
      {/* 2-Image Showcase Container with Smooth Crossfade */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#0D0E14]">
        {/* Layer 1: Front / Primary Image */}
        <img
          src={activeImage}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Layer 2: Back / Lifestyle Image (Smooth crossfade on hover) */}
        {secondaryImage && secondaryImage !== activeImage && (
          <img
            src={secondaryImage}
            alt={`${product.name} back view`}
            className="absolute inset-0 w-full h-full object-cover object-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out group-hover:scale-105 pointer-events-none"
            loading="lazy"
          />
        )}

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.badge && (
            <span className="px-2.5 py-1 rounded-md bg-[#090A0F]/90 backdrop-blur-md text-[10px] font-mono uppercase tracking-wider text-white font-bold border border-white/15 shadow-md">
              {product.badge}
            </span>
          )}
          {product.gsm && (
            <span className="px-2 py-0.5 rounded-md bg-white/10 backdrop-blur-md text-[9px] font-mono uppercase tracking-wider text-slate-300 border border-white/10">
              {product.gsm} GSM
            </span>
          )}
          {product.stock <= 5 && (
            <span className="px-2 py-0.5 rounded-md bg-rose-950/90 backdrop-blur-md text-[9px] font-mono uppercase tracking-wider text-rose-300 border border-rose-500/30">
              Only {product.stock} left
            </span>
          )}
        </div>

        {/* Back View Indicator Pill (Visible on hover or mobile) */}
        {secondaryImage && secondaryImage !== activeImage && (
          <div className="absolute bottom-16 right-3 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-md text-[9px] font-mono uppercase tracking-wider text-slate-300 border border-white/10">
              Back View
            </span>
          </div>
        )}

        {/* Wishlist Toggle Button */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-3 right-3 z-20 p-2.5 rounded-full backdrop-blur-md transition-all duration-300 cursor-pointer ${
            isSaved
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/40 scale-105'
              : 'bg-[#090A0F]/70 text-slate-300 hover:text-white hover:bg-[#090A0F]/90 border border-white/10 hover:scale-105'
          }`}
          aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart className={`w-4 h-4 transition-transform ${isSaved ? 'fill-white' : ''}`} />
        </button>

        {/* Bottom Quick Action Overlay Bar */}
        <div className="absolute inset-x-3 bottom-3 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          {/* Quick View Modal Trigger */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              playClick();
              if (onQuickView) onQuickView(product);
            }}
            className="flex-1 py-2.5 bg-black/85 hover:bg-black text-white text-xs font-mono uppercase tracking-wider rounded-xl backdrop-blur-md border border-white/15 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg hover:border-white/40"
            title="Quick View Modal"
          >
            <Eye className="w-3.5 h-3.5 text-slate-300" />
            <span>Quick View</span>
          </button>

          {/* Quick Add To Bag with Size Flyout */}
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                playClick();
                if (product.sizes && product.sizes.length > 1) {
                  setShowQuickAddSizes(!showQuickAddSizes);
                } else {
                  handleQuickAdd('ONE SIZE', e);
                }
              }}
              className={`p-2.5 rounded-xl transition-all shadow-lg flex items-center justify-center cursor-pointer ${
                justAdded
                  ? 'bg-emerald-500 text-white'
                  : 'bg-white text-black hover:bg-slate-200'
              }`}
              title="Quick Add Size"
              aria-label="Quick Add Size"
            >
              {justAdded ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </button>

            {/* Quick Size Flyout */}
            {showQuickAddSizes && (
              <div
                className="absolute bottom-full right-0 mb-2 p-2 bg-[#12141F] border border-slate-700 rounded-xl shadow-2xl z-30 flex gap-1 animate-fadeIn"
                onClick={(e) => e.stopPropagation()}
              >
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={(e) => handleQuickAdd(s, e)}
                    className="px-2.5 py-1 text-[11px] font-mono text-slate-200 hover:text-black hover:bg-white rounded-lg transition-colors cursor-pointer"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Details Content */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Fit & Rating Header */}
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">
            <span className="text-[#C5A880] font-semibold">{product.fit || 'Oversized'}</span>
            <div className="flex items-center gap-1 text-slate-300">
              <Star className="w-3 h-3 text-[#C5A880] fill-[#C5A880]" />
              <span>{product.rating}</span>
              <span className="text-slate-500">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Product Name */}
          <h3 className="text-sm sm:text-base font-bold text-slate-100 uppercase tracking-tight group-hover:text-white transition-colors line-clamp-1 flex items-center justify-between gap-2">
            <span>{product.name}</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 shrink-0" />
          </h3>

          <p className="text-xs text-slate-400 line-clamp-1 mt-1 font-light">
            {product.tagline}
          </p>
        </div>

        {/* Bottom Swatches & Price */}
        <div className="pt-2.5 border-t border-slate-800/80 flex items-center justify-between">
          {/* Color Swatches */}
          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            {product.colors &&
              product.colors.map((color) => {
                const isSelected = selectedColor?.name === color.name;
                return (
                  <button
                    key={color.name}
                    onClick={(e) => {
                      e.stopPropagation();
                      playClick(1500);
                      setSelectedColor(color);
                    }}
                    className={`w-4 h-4 rounded-full border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-white scale-125 ring-1 ring-slate-400'
                        : 'border-slate-700 hover:scale-110 opacity-70'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                    aria-label={color.name}
                  />
                );
              })}
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 text-right font-mono">
            {product.originalPrice && (
              <span className="text-xs text-slate-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            <span className="text-sm font-bold text-white">
              {formatPrice(product.price)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

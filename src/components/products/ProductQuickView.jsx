import React, { useState } from 'react';
import { X, Heart, ShoppingBag, Star, Ruler, ShieldCheck, Truck, Plus, Minus, ArrowUpRight } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useScrollLock } from '../../hooks/useScrollLock';
import { useSoundFX } from '../../hooks/useSoundFX';

export default function ProductQuickView({ product, isOpen, onClose, onOpenSizeGuide, onSelectProduct }) {
  useScrollLock(isOpen);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { playClick, playHover, playSuccessChime } = useSoundFX();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);

  if (!isOpen || !product) return null;

  const isSaved = isInWishlist(product.id);
  const currentImages = product.images || [];
  const activeColor = selectedColor || (product.colors && product.colors.length > 0 ? product.colors[0] : null);
  const activeSize = selectedSize || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'L');

  const handleColorChange = (color) => {
    playClick(1400);
    setSelectedColor(color);
    const imgIndex = currentImages.findIndex((img) => img === color.image);
    if (imgIndex > -1) {
      setSelectedImage(imgIndex);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, activeSize, activeColor?.name, quantity);
    playSuccessChime();
    onClose();
  };

  const handleViewDetails = () => {
    playClick();
    onClose();
    if (onSelectProduct) {
      onSelectProduct(product);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-[#10121A] w-full max-w-5xl rounded-3xl border border-slate-700/80 shadow-2xl overflow-hidden relative my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => {
            playClick();
            onClose();
          }}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-[#090A0F]/80 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
          aria-label="Close product view"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
          {/* Left Gallery (6 cols) */}
          <div className="md:col-span-6 bg-[#0D0E14] p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800">
            {/* Main Active Image */}
            <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-slate-950 mb-4 group">
              <img
                src={currentImages[selectedImage] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover object-center transition-all duration-700 group-hover:scale-105"
              />
              <div className="absolute top-3 left-3 flex flex-col gap-1">
                {product.badge && (
                  <span className="px-3 py-1 bg-black/80 backdrop-blur-md text-[10px] font-mono uppercase tracking-wider text-slate-200 border border-white/10 rounded-md">
                    {product.badge}
                  </span>
                )}
                {product.gsm && (
                  <span className="px-2 py-0.5 bg-[#C5A880]/20 text-[#C5A880] text-[9px] font-mono uppercase rounded-md border border-[#C5A880]/30">
                    {product.gsm} GSM
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail Row */}
            {currentImages.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
                {currentImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      playClick(1500);
                      setSelectedImage(idx);
                    }}
                    onMouseEnter={playHover}
                    className={`relative w-16 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                      selectedImage === idx ? 'border-white scale-95 ring-2 ring-[#C5A880]' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Product Information (6 cols) */}
          <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Category & Rating */}
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="uppercase tracking-widest text-[#C5A880] font-semibold">{product.category} TEE</span>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Star className="w-3.5 h-3.5 text-[#C5A880] fill-[#C5A880]" />
                  <span>{product.rating}</span>
                  <span className="text-slate-400">({product.reviewsCount} reviews)</span>
                </div>
              </div>

              {/* Title & Price */}
              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white font-display">
                  {product.name}
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-1">{product.tagline}</p>
                <div className="flex items-baseline gap-3 mt-3">
                  <span className="text-2xl font-bold font-mono text-white">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm font-mono text-slate-500 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                {product.description}
              </p>

              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div className="pt-2">
                  <div className="flex items-center justify-between text-xs font-mono mb-2">
                    <span className="text-slate-400 uppercase">COLOR PALETTE:</span>
                    <span className="text-white font-bold">{activeColor?.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {product.colors.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => handleColorChange(c)}
                        className={`w-7 h-7 rounded-full border-2 transition-all cursor-pointer ${
                          activeColor?.name === c.name
                            ? 'border-white scale-110 ring-2 ring-[#C5A880]'
                            : 'border-slate-700 opacity-60 hover:opacity-100'
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                        aria-label={c.name}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="pt-2">
                  <div className="flex items-center justify-between text-xs font-mono mb-2">
                    <span className="text-slate-400 uppercase">SIZE:</span>
                    <button
                      onClick={() => {
                        playClick();
                        onOpenSizeGuide();
                      }}
                      className="text-[#C5A880] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Ruler className="w-3 h-3" />
                      <span>Size Guide</span>
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((s) => {
                      const isSelected = activeSize === s;
                      return (
                        <button
                          key={s}
                          onClick={() => {
                            playClick(1400);
                            setSelectedSize(s);
                          }}
                          className={`px-4 py-2 text-xs font-mono uppercase rounded-xl border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-white text-black font-bold border-white shadow-lg'
                              : 'border-slate-800 text-slate-300 hover:border-slate-600 bg-slate-900'
                          }`}
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Key Details List */}
              {product.details && (
                <div className="pt-3 border-t border-slate-800/80">
                  <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside font-light">
                    {product.details.slice(0, 3).map((detail, idx) => (
                      <li key={idx}>{detail}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Actions Bar */}
            <div className="mt-6 pt-5 border-t border-slate-800 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                {/* Quantity Controls */}
                <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 shrink-0">
                  <button
                    onClick={() => {
                      playClick();
                      setQuantity(Math.max(1, quantity - 1));
                    }}
                    className="p-2 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-xs font-mono font-bold text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => {
                      playClick();
                      setQuantity(Math.min(product.stock || 10, quantity + 1));
                    }}
                    className="p-2 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3.5 px-6 bg-white text-black hover:bg-slate-200 font-bold text-xs uppercase tracking-[0.2em] rounded-xl transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer group"
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
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSaved
                      ? 'bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-500/30'
                      : 'border-slate-800 text-slate-300 hover:text-white hover:border-slate-600 bg-slate-900'
                  }`}
                  aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
                >
                  <Heart className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
                </button>
              </div>

              {/* View Full Product Page Action */}
              <button
                onClick={handleViewDetails}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-mono uppercase tracking-wider rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>View Full Product Page & Sizing Details</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#C5A880]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

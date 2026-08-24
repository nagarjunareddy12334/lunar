import React, { useState } from 'react';
import { PRODUCTS, TEE_BUNDLES } from '../../data/products';
import { formatPrice } from '../../utils/formatters';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { useSoundFX } from '../../hooks/useSoundFX';
import { Sparkles, Layers, ShoppingBag, ArrowRight, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function LookbookBuilder() {
  const { addToCart, setIsCartOpen } = useCart();
  const { addToast } = useToast();
  const { playClick, playHover, playSuccessChime } = useSoundFX();

  const graphicOptions = PRODUCTS.filter((p) => p.category === 'graphic' || p.category === 'vintage');
  const minimalOptions = PRODUCTS.filter((p) => p.category === 'minimal' || p.category === 'oversized');

  // Active selections
  const [selectedTee1, setSelectedTee1] = useState(graphicOptions[0] || PRODUCTS[0]);
  const [selectedTee2, setSelectedTee2] = useState(minimalOptions[0] || PRODUCTS[1]);

  const [size1, setSize1] = useState('L');
  const [size2, setSize2] = useState('L');

  // Calculate pricing
  const rawTotal = (selectedTee1?.price || 0) + (selectedTee2?.price || 0);
  const bundleDiscountPercent = 15;
  const savings = Math.round((rawTotal * bundleDiscountPercent) / 100);
  const bundlePrice = rawTotal - savings;

  const handleAddBundleToCart = () => {
    if (selectedTee1) addToCart(selectedTee1, size1, selectedTee1.colors?.[0]?.name, 1);
    if (selectedTee2) addToCart(selectedTee2, size2, selectedTee2.colors?.[0]?.name, 1);

    playSuccessChime();

    // Celebration Confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#c5a880', '#e2e8f0', '#ffffff'],
    });

    addToast(`Added 2-Tee Streetwear Bundle to Bag with 15% discount!`, 'success');
    setIsCartOpen(true);
  };

  return (
    <section id="bundle-builder" className="py-20 bg-[#08090D] border-b border-slate-800/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#C5A880] text-xs font-mono tracking-widest uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>CUSTOM 2-TEE ROTATION BUILDER</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white font-display">
              BUILD YOUR <span className="shimmer-text">TEE ROTATION</span>
            </h2>
            <p className="text-slate-400 text-sm sm:text-base font-light mt-2 max-w-xl">
              Pair any Statement Graphic Tee with an Architectural Blank and instantly save 15% with free global express shipping.
            </p>
          </div>
        </div>

        {/* Studio Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: 2-Tee Visual Showcase (7 cols) */}
          <div className="lg:col-span-7 bg-[#10121A] p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-300 uppercase">
                <Layers className="w-4 h-4 text-[#C5A880]" />
                <span>ACTIVE 2-TEE BUNDLE DUO</span>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-500/30">
                15% BUNDLE APPLIED
              </span>
            </div>

            {/* Visual 2-Grid Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Tee 1 Card */}
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#0D0E14] border border-slate-800 group shadow-lg">
                <img
                  key={selectedTee1?.id}
                  src={selectedTee1?.images[0]}
                  alt={selectedTee1?.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-all duration-700 ease-out animate-fadeIn"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-between p-4">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-300 bg-black/70 px-2 py-0.5 rounded w-fit backdrop-blur-md">
                    PIECE 01: GRAPHIC / VINTAGE
                  </span>
                  <div>
                    <span className="text-[10px] font-mono text-[#C5A880] block">{selectedTee1?.gsm} GSM</span>
                    <h4 className="text-sm font-bold text-white uppercase">{selectedTee1?.name}</h4>
                    <span className="text-xs font-mono text-slate-300">{formatPrice(selectedTee1?.price)}</span>
                  </div>
                </div>
              </div>

              {/* Tee 2 Card */}
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#0D0E14] border border-slate-800 group shadow-lg">
                <img
                  key={selectedTee2?.id}
                  src={selectedTee2?.images[0]}
                  alt={selectedTee2?.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-all duration-700 ease-out animate-fadeIn"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-between p-4">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-300 bg-black/70 px-2 py-0.5 rounded w-fit backdrop-blur-md">
                    PIECE 02: ESSENTIAL HEAVYWEIGHT
                  </span>
                  <div>
                    <span className="text-[10px] font-mono text-[#C5A880] block">{selectedTee2?.gsm} GSM</span>
                    <h4 className="text-sm font-bold text-white uppercase">{selectedTee2?.name}</h4>
                    <span className="text-xs font-mono text-slate-300">{formatPrice(selectedTee2?.price)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Selectors & Bundle Summary (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Customizer */}
            <div className="p-6 rounded-3xl bg-[#10121A] border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono flex items-center justify-between">
                <span>SELECT YOUR DUO</span>
                <span className="text-xs text-[#C5A880] font-normal">15% Off Total</span>
              </h3>

              {/* Tee 1 Select */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-slate-400 uppercase">First T-Shirt (Graphic / Washed):</label>
                <select
                  value={selectedTee1?.id}
                  onChange={(e) => {
                    playClick(1300);
                    const match = PRODUCTS.find((p) => p.id === e.target.value);
                    if (match) setSelectedTee1(match);
                  }}
                  className="w-full bg-slate-900 text-slate-200 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-mono uppercase outline-none focus:border-white transition-colors cursor-pointer"
                >
                  {graphicOptions.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} — {formatPrice(item.price)} ({item.gsm} GSM)
                    </option>
                  ))}
                </select>
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[10px] font-mono text-slate-400">Size:</span>
                  {['S', 'M', 'L', 'XL', 'XXL'].map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize1(s)}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors cursor-pointer ${
                        size1 === s ? 'bg-white text-black font-bold' : 'bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tee 2 Select */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <label className="text-[11px] font-mono text-slate-400 uppercase">Second T-Shirt (Blank / Boxy):</label>
                <select
                  value={selectedTee2?.id}
                  onChange={(e) => {
                    playClick(1300);
                    const match = PRODUCTS.find((p) => p.id === e.target.value);
                    if (match) setSelectedTee2(match);
                  }}
                  className="w-full bg-slate-900 text-slate-200 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-mono uppercase outline-none focus:border-white transition-colors cursor-pointer"
                >
                  {minimalOptions.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} — {formatPrice(item.price)} ({item.gsm} GSM)
                    </option>
                  ))}
                </select>
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[10px] font-mono text-slate-400">Size:</span>
                  {['S', 'M', 'L', 'XL', 'XXL'].map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize2(s)}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors cursor-pointer ${
                        size2 === s ? 'bg-white text-black font-bold' : 'bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Pricing & Add to Bag */}
            <div className="p-6 sm:p-8 rounded-3xl border border-[#C5A880]/30 shadow-2xl bg-gradient-to-b from-[#141622] to-[#0A0B10]">
              <div className="space-y-2.5 pb-5 border-b border-slate-800">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>Standard 2-Tee Total</span>
                  <span className="line-through">{formatPrice(rawTotal)}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono text-emerald-400">
                  <span>Duo Rotation Discount (15%)</span>
                  <span>-{formatPrice(savings)}</span>
                </div>
                <div className="flex items-baseline justify-between pt-2">
                  <span className="text-sm font-bold uppercase tracking-wider text-white font-mono">
                    Bundle Total
                  </span>
                  <div className="text-right">
                    <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
                      {formatPrice(bundlePrice)}
                    </span>
                    <span className="block text-[10px] font-mono text-[#C5A880]">
                      Includes Free Global Shipping
                    </span>
                  </div>
                </div>
              </div>

              {/* Add Bundle CTA */}
              <div className="mt-5">
                <button
                  onClick={handleAddBundleToCart}
                  className="w-full py-4 px-6 bg-white text-black hover:bg-slate-200 font-bold text-xs uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3 cursor-pointer group"
                >
                  <ShoppingBag className="w-4 h-4 transition-transform group-hover:scale-110" />
                  <span>Add Duo Pack to Bag</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

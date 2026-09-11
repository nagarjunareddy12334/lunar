import React from 'react';
import { ArrowRight, Sparkles, Layers, ChevronDown } from 'lucide-react';
import { useSoundFX } from '../../hooks/useSoundFX';
import GarmentStage3D from './GarmentStage3D';

export default function HeroSection({ onExplore, onSelectCategory }) {
  const { playClick } = useSoundFX();

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden border-b border-slate-800/80 bg-[#07080C]">
      {/* Background Ambience & Lighting */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=2000&q=85"
          alt="SUKAI Streetwear T-Shirts"
          className="w-full h-full object-cover object-top opacity-20 filter grayscale contrast-125 scale-105"
        />
        {/* Gradients to blend sleek dark luxury mood with warm amber studio glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#090A0F] via-[#090A0F]/85 to-[#090A0F]/90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#C5A880]/15 via-transparent to-transparent" />
      </div>

      {/* Main Grid Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Kinetic Typography & CTAs (6 cols) */}
          <div className="lg:col-span-6 text-left">
            {/* Live Drop Status Pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/5 border border-[#C5A880]/40 text-[#C5A880] text-xs font-mono tracking-widest uppercase mb-6 shadow-lg animate-fadeIn">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C5A880] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C5A880]"></span>
              </span>
              <span>SUKAI DROP 01 // 3D EXHIBITION</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-300 font-normal">280–360 GSM</span>
            </div>

            {/* Kinetic Shimmer Headline */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight leading-[0.95] text-white font-display mb-6">
              THE 3D <br />
              <span className="shimmer-text">STREETWEAR TEE.</span>
            </h1>

            {/* Subtitle */}
            <p className="max-w-xl text-base sm:text-lg text-slate-300 font-light leading-relaxed mb-8 text-balance">
              Engineered boxy silhouettes crafted with dense 280–360 GSM combed cotton. Featuring reinforced zero-sag collars, drop-shoulder architecture, and cybernetic Japanese graphics.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-5 mb-12">
              <button
                onClick={() => {
                  playClick();
                  onExplore();
                }}
                className="px-8 py-4 bg-white text-[#090A0F] font-bold text-xs uppercase tracking-[0.2em] rounded-full hover:bg-[#dfc8a8] transition-all shadow-xl shadow-white/10 flex items-center justify-center gap-3 cursor-pointer group"
              >
                <span>Shop The Drop</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5" />
              </button>

              <button
                onClick={() => {
                  playClick();
                  if (onSelectCategory) onSelectCategory('oversized');
                  onExplore();
                }}
                className="px-8 py-4 bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white font-semibold text-xs uppercase tracking-[0.2em] rounded-full border border-white/15 hover:border-white/30 transition-all flex items-center justify-center gap-2.5 cursor-pointer group"
              >
                <Layers className="w-4 h-4 text-[#C5A880]" />
                <span>Oversized Fits</span>
              </button>
            </div>

            {/* Feature Highlights Spec Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl pt-6 border-t border-slate-800/80">
              <div className="p-3 rounded-xl bg-white/5 border border-slate-800/80 hover:border-slate-600 transition-colors">
                <span className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider">COTTON DENSITY</span>
                <span className="text-xs font-semibold text-white">280–360 GSM</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-slate-800/80 hover:border-slate-600 transition-colors">
                <span className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider">COLLAR GAUGE</span>
                <span className="text-xs font-semibold text-white">3.2cm Tight Rib</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-slate-800/80 hover:border-slate-600 transition-colors">
                <span className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider">SILHOUETTE</span>
                <span className="text-xs font-semibold text-[#C5A880]">Drop-Shoulder</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-slate-800/80 hover:border-slate-600 transition-colors">
                <span className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider">EDITION</span>
                <span className="text-xs font-semibold text-white">Limited 150 Pcs</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive 3D Garment Stage (6 cols) */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center">
            <GarmentStage3D onExplore={onExplore} />
          </div>

        </div>
      </div>

      {/* Scroll Down Indicator */}
      <button
        onClick={onExplore}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 text-slate-500 hover:text-slate-300 transition-colors flex flex-col items-center gap-1 cursor-pointer z-20 group"
        aria-label="Scroll down to collection"
      >
        <span className="text-[9px] font-mono tracking-widest uppercase text-slate-400 group-hover:text-white transition-colors">
          EXPLORE 3D COLLECTION
        </span>
        <ChevronDown className="w-4 h-4 animate-bounce text-slate-400 group-hover:text-white transition-colors" />
      </button>
    </section>
  );
}

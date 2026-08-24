import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useSoundFX } from '../../hooks/useSoundFX';

const CATEGORY_CARDS = [
  {
    id: 'oversized',
    title: 'Oversized & Boxy Fits',
    subtitle: '300-340 GSM Heavyweight Drop-Shoulder Drapes',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=85',
    tag: 'STREETWEAR CUT'
  },
  {
    id: 'graphic',
    title: 'Graphic & Cyberpunk',
    subtitle: 'High-Density Screenprints & Lunar Blueprints',
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=85',
    tag: 'NEW ARTWORK'
  },
  {
    id: 'vintage',
    title: 'Acid Wash & Mineral',
    subtitle: 'Distressed 1-of-1 Stone Washed Vintage Patinas',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=85',
    tag: 'MINERAL WASHED'
  },
  {
    id: 'minimal',
    title: '360 GSM Luxury Blanks',
    subtitle: 'Pure Combed Heavyweight Essentials',
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=85',
    tag: 'ULTRA DENSE'
  }
];

export default function CategoryGrid({ onSelectCategory }) {
  const { playClick, playHover } = useSoundFX();

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#C5A880] text-xs font-mono tracking-widest uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>DISCOVER BY SILHOUETTE</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-white font-display">
            Shop by Fit & Style
          </h2>
        </div>
        <p className="text-xs sm:text-sm font-mono text-slate-400 max-w-md">
          Explore curated cuts crafted with premium combed cotton from 280 to 360 GSM.
        </p>
      </div>

      {/* 4-Card Visual Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {CATEGORY_CARDS.map((cat) => (
          <div
            key={cat.id}
            onClick={() => {
              playClick();
              onSelectCategory(cat.id);
            }}
            onMouseEnter={playHover}
            className="group relative h-96 rounded-3xl overflow-hidden bg-[#10121A] border border-slate-800 hover:border-slate-600 transition-all duration-500 cursor-pointer shadow-xl"
          >
            {/* Background Image with Zoom */}
            <img
              src={cat.image}
              alt={cat.title}
              className="w-full h-full object-cover object-center filter grayscale-[30%] group-hover:grayscale-0 group-hover:scale-108 transition-all duration-700 ease-out"
              loading="lazy"
            />

            {/* Gradient Overlay for Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/10 transition-opacity duration-300" />

            {/* Top Tag */}
            <div className="absolute top-4 left-4 z-10">
              <span className="px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md text-[10px] font-mono uppercase tracking-wider text-slate-300 border border-white/10 shadow-md">
                {cat.tag}
              </span>
            </div>

            {/* Content Bottom */}
            <div className="absolute inset-x-0 bottom-0 p-5 flex flex-col justify-end z-10 transform transition-transform duration-300">
              <h3 className="text-lg font-bold text-white uppercase tracking-tight leading-tight group-hover:text-[#C5A880] transition-colors">
                {cat.title}
              </h3>
              <p className="text-xs text-slate-300 font-light mt-1 line-clamp-2">
                {cat.subtitle}
              </p>

              <div className="mt-4 flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-white group-hover:translate-x-1 transition-transform">
                <span>Explore Pieces</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C5A880]" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

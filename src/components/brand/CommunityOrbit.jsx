import React from 'react';
import { Star, CheckCircle, Sparkles, Camera } from 'lucide-react';
import { REVIEWS } from '../../data/products';
import { useSoundFX } from '../../hooks/useSoundFX';

const COMMUNITY_POSTS = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    handle: '@kai.street',
    city: 'Seoul',
    piece: 'Cyber Astral Graphic Tee (320 GSM)',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80',
    handle: '@astrid.void',
    city: 'Stockholm',
    piece: 'Acid Supermoon Vintage Tee (290 GSM)',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&q=80',
    handle: '@noah.lunar',
    city: 'London',
    piece: 'Void Architecture Heavy Tee (340 GSM)',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80',
    handle: '@sora.zen',
    city: 'Tokyo',
    piece: 'Neo-Tokyo Kanji Backprint Tee',
  },
];

export default function CommunityOrbit() {
  const { playHover } = useSoundFX();

  return (
    <section id="community" className="py-20 bg-[#07080B] border-b border-slate-800/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#C5A880] text-xs font-mono tracking-widest uppercase mb-3">
            <Camera className="w-3.5 h-3.5" />
            <span>COMMUNITY LOOKBOOK // #LUNARTEES</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white font-display mb-4">
            STYLED BY <span className="shimmer-text">THE COMMUNITY</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base font-light">
            Tag @lunar.tees on Instagram with #LunarTees to be featured in our global streetwear styling lookbook.
          </p>
        </div>

        {/* Customer Styling Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-16">
          {COMMUNITY_POSTS.map((post) => (
            <div
              key={post.id}
              onMouseEnter={playHover}
              className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#10121A] border border-slate-800 hover:border-slate-600 shadow-xl transition-all duration-300"
            >
              <img
                src={post.image}
                alt={post.handle}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent opacity-85 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                <span className="text-xs font-bold text-white font-mono">{post.handle}</span>
                <span className="text-[11px] font-mono text-[#C5A880]">{post.piece}</span>
                <span className="text-[10px] font-mono text-slate-400">{post.city}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Verified Reviews Section */}
        <div className="border-t border-slate-800/80 pt-14">
          <div className="text-center mb-10">
            <span className="text-xs font-mono text-[#C5A880] uppercase tracking-widest block mb-1">
              AUTHENTIC CLIENT FEEDBACK
            </span>
            <h3 className="text-2xl font-bold uppercase tracking-tight text-white font-display">
              Verified Buyer Reviews
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {REVIEWS.map((rev) => (
              <div
                key={rev.id}
                onMouseEnter={playHover}
                className="p-6 rounded-2xl bg-[#10121A] border border-slate-800 hover:border-slate-600 relative flex flex-col justify-between h-full shadow-lg transition-all duration-300"
              >
                <div>
                  {/* Star Rating */}
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-[#C5A880] fill-[#C5A880]" />
                    ))}
                  </div>

                  <span className="text-[10px] font-mono text-[#C5A880] block mb-2 font-bold">
                    RE: {rev.item}
                  </span>

                  {/* Comment */}
                  <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed mb-6 italic">
                    "{rev.comment}"
                  </p>
                </div>

                {/* Author Info */}
                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white font-mono block">{rev.author}</span>
                    <span className="text-[10px] font-mono text-slate-500">{rev.city}</span>
                  </div>

                  <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
                    <CheckCircle className="w-3 h-3" />
                    <span>Verified Buyer</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

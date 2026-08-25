import React, { useState } from 'react';
import { Shield, Sparkles, Leaf, Truck, Compass, CheckCircle2 } from 'lucide-react';
import { BRAND_VALUES } from '../../data/products';
import TiltCard from '../ui/TiltCard';
import { useSoundFX } from '../../hooks/useSoundFX';

export default function BrandStory() {
  const { playClick, playHover } = useSoundFX();
  const [isColorized, setIsColorized] = useState(false);

  const iconMap = {
    Shield: Shield,
    Sparkles: Sparkles,
    Leaf: Leaf,
    Truck: Truck,
  };

  const handleImageClick = () => {
    playClick();
    setIsColorized((prev) => !prev);
  };

  return (
    <section id="craftsmanship" className="py-24 bg-[#090A0F] border-b border-slate-800/80 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-0 w-96 max-w-full h-96 bg-slate-800/10 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel-light text-[#C5A880] text-xs font-mono tracking-widest uppercase mb-3">
            <Compass className="w-3.5 h-3.5" />
            <span>MATERIALS & CRAFTSMANSHIP</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white font-display mb-4">
            ENGINEERED FOR <span className="shimmer-text">ORBIT</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base font-light leading-relaxed">
            Every LUNAR piece exists at the intersection of haute couture tailoring and functional aerospace material engineering. We reject mass production in favor of meticulous limited runs.
          </p>
        </div>

        {/* 2-Column Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-20">
          {/* Left Imagery with Click-to-Colorize */}
          <div className="lg:col-span-6 relative">
            <TiltCard maxTilt={4} scale={1.01}>
              <div
                className="relative aspect-[4/5] rounded-3xl overflow-hidden glass-panel border border-slate-700/80 shadow-2xl group cursor-pointer"
                onPointerDown={(e) => {
                  e.stopPropagation();
                  handleImageClick();
                }}
                onMouseEnter={playHover}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleImageClick(); }}
                aria-label={isColorized ? 'Click to revert to black and white' : 'Click to reveal full color'}
              >
                <img
                  src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85"
                  alt="LUNAR Material Craftsmanship"
                  className="w-full h-full object-cover transition-all duration-1000 ease-out"
                  style={{
                    filter: isColorized
                      ? 'grayscale(0%) contrast(100%) saturate(120%)'
                      : 'grayscale(100%) contrast(125%) saturate(0%)',
                    transform: isColorized ? 'scale(1.05)' : 'scale(1)',
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                {/* Color reveal shimmer overlay */}
                <div
                  className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
                  style={{
                    opacity: isColorized ? 0 : 1,
                    background: 'linear-gradient(135deg, rgba(197,168,128,0.08) 0%, transparent 50%, rgba(197,168,128,0.05) 100%)',
                  }}
                />

                {/* Click hint overlay */}
                <div
                  className="absolute inset-0 flex items-center justify-center transition-all duration-700 pointer-events-none"
                  style={{ opacity: isColorized ? 0 : 1 }}
                >
                  <div className="px-5 py-2.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center gap-2.5 shadow-2xl">
                    <span className="w-2 h-2 rounded-full bg-[#C5A880] animate-pulse" />
                    <span className="text-[11px] font-mono text-white uppercase tracking-widest">
                      Click to reveal in color
                    </span>
                  </div>
                </div>

                {/* Colorized state badge */}
                <div
                  className="absolute top-4 right-4 z-20 transition-all duration-700 pointer-events-none"
                  style={{
                    opacity: isColorized ? 1 : 0,
                    transform: isColorized ? 'translateY(0) scale(1)' : 'translateY(-8px) scale(0.9)',
                  }}
                >
                  <div className="px-3 py-1.5 rounded-lg bg-[#C5A880]/20 backdrop-blur-md border border-[#C5A880]/40 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
                    <span className="text-[10px] font-mono text-[#C5A880] uppercase tracking-widest font-bold">
                      True Color
                    </span>
                  </div>
                </div>

                <div className="absolute bottom-6 left-6 right-6 p-6 rounded-2xl glass-panel border border-white/10 pointer-events-none">
                  <span className="text-[10px] font-mono text-[#C5A880] uppercase tracking-widest block mb-1">
                    PATENTED WEAVE SPECIFICATION
                  </span>
                  <h4 className="text-sm font-bold text-white uppercase font-display">
                    Grade 5 Titanium & Micro-Ripstop Nylon Hybrid
                  </h4>
                </div>
              </div>
            </TiltCard>
          </div>

          {/* Right Philosophy & Spec Details */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-4">
              <h3 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white font-display">
                The 0.01% Standard
              </h3>
              <p className="text-slate-300 text-sm sm:text-base font-light leading-relaxed">
                Conventional fashion builds for single seasons. LUNAR builds silhouettes designed to withstand extreme metropolitan climates while maintaining a razor-sharp profile.
              </p>
            </div>

            {/* Spec Checklist */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 p-3.5 rounded-xl glass-panel border border-slate-800 hover:border-slate-600 transition-colors">
                <CheckCircle2 className="w-5 h-5 text-[#C5A880] shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs font-mono font-bold text-white uppercase">Thermo-Regulating Membrane</h5>
                  <p className="text-xs text-slate-400 font-light mt-0.5">
                    Micro-encapsulated phase change materials adapt to ambient body heat, keeping you warm in freezing winds and cool indoors.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl glass-panel border border-slate-800 hover:border-slate-600 transition-colors">
                <CheckCircle2 className="w-5 h-5 text-[#C5A880] shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs font-mono font-bold text-white uppercase">Custom German Fidlock Hardware</h5>
                  <p className="text-xs text-slate-400 font-light mt-0.5">
                    Magnetic mechanical latches allow for one-handed operation and effortless modular reconfiguration.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl glass-panel border border-slate-800 hover:border-slate-600 transition-colors">
                <CheckCircle2 className="w-5 h-5 text-[#C5A880] shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs font-mono font-bold text-white uppercase">Zero-Runoff Mineral Dyeing</h5>
                  <p className="text-xs text-slate-400 font-light mt-0.5">
                    100% closed-loop botanical and mineral dye extraction processes that eliminate toxic water discharge.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Pillars Grid with 3D Tilt */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {BRAND_VALUES.map((item, index) => {
            const IconComp = iconMap[item.icon] || Shield;
            return (
              <TiltCard key={index} maxTilt={6} scale={1.03}>
                <div className="p-6 rounded-2xl glass-panel border border-slate-800/80 hover:border-slate-600 transition-all duration-300 group h-full flex flex-col justify-between shadow-lg">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-[#C5A880] mb-4 group-hover:scale-115 transition-transform">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2 font-mono">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-400 font-light leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </TiltCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}


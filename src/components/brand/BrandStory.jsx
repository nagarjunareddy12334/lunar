import React, { useState } from 'react';
import { Shield, Sparkles, Leaf, Truck, Compass, CheckCircle2, Crosshair } from 'lucide-react';
import { BRAND_VALUES } from '../../data/products';
import TiltCard from '../ui/TiltCard';
import { useSoundFX } from '../../hooks/useSoundFX';

export default function BrandStory() {
  const { playClick, playHover } = useSoundFX();
  const [activeHotspot, setActiveHotspot] = useState(null);

  const iconMap = {
    Shield: Shield,
    Sparkles: Sparkles,
    Leaf: Leaf,
    Truck: Truck,
  };

  const HOTSPOTS = [
    {
      id: 'titanium',
      x: 35,
      y: 40,
      title: 'Titanium Micro-Weave',
      detail: 'Aerospace Grade 5 thread interwoven with ripstop filament for extreme tear resistance.',
    },
    {
      id: 'fidlock',
      x: 65,
      y: 60,
      title: 'Magnetic Latches',
      detail: 'Patented German fidlock system engineered for instant tactile one-handed release.',
    },
  ];

  return (
    <section id="craftsmanship" className="py-24 bg-[#090A0F] border-b border-slate-800/80 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-slate-800/10 blur-[150px] pointer-events-none" />

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
          {/* Left Imagery with Interactive Hotspots */}
          <div className="lg:col-span-6 relative">
            <TiltCard maxTilt={4} scale={1.01}>
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden glass-panel border border-slate-700/80 shadow-2xl group">
                <img
                  src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85"
                  alt="LUNAR Material Craftsmanship"
                  className="w-full h-full object-cover grayscale contrast-125 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                {/* Interactive Hotspot Beacons */}
                {HOTSPOTS.map((spot) => (
                  <div
                    key={spot.id}
                    style={{ top: `${spot.y}%`, left: `${spot.x}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                  >
                    <button
                      onClick={() => {
                        playClick(1500);
                        setActiveHotspot(activeHotspot === spot.id ? null : spot.id);
                      }}
                      onMouseEnter={playHover}
                      className="relative w-8 h-8 rounded-full flex items-center justify-center bg-white/90 text-black shadow-lg cursor-pointer hover:scale-110 transition-transform"
                      aria-label={spot.title}
                    >
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C5A880] opacity-75"></span>
                      <Crosshair className="w-4 h-4 text-black relative z-10" />
                    </button>

                    {/* Popover Detail */}
                    {activeHotspot === spot.id && (
                      <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 w-56 p-3.5 rounded-xl glass-panel bg-black/90 border border-[#C5A880]/40 shadow-2xl z-30 animate-fadeIn text-left">
                        <span className="text-[9px] font-mono text-[#C5A880] uppercase tracking-widest block mb-1">
                          SPECIFICATION NODE
                        </span>
                        <h5 className="text-xs font-bold text-white uppercase mb-1 font-mono">{spot.title}</h5>
                        <p className="text-[11px] text-slate-300 font-light leading-relaxed">{spot.detail}</p>
                      </div>
                    )}
                  </div>
                ))}

                <div className="absolute bottom-6 left-6 right-6 p-6 rounded-2xl glass-panel border border-white/10">
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

import React, { useState } from 'react';
import { Layers, ShieldCheck, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';
import { useSoundFX } from '../../hooks/useSoundFX';

const GSM_TIERS = [
  {
    gsm: '280 GSM',
    title: 'Mid-Heavyweight Washed',
    tag: 'BREEZY STREETWEAR',
    desc: 'Soft, airy drape with a broken-in handfeel. Ideal for summer layering or vintage stone acid washes without losing structural density.',
    features: ['Combed organic ring-spun cotton', 'Fluid relaxed drape', 'Breathable in high humidity', 'Pre-shrunk vintage finish']
  },
  {
    gsm: '320 GSM',
    title: 'Heavyweight Core',
    tag: 'SIGNATURE FIT',
    desc: 'Our most popular streetwear weight. Provides a crisp, sculpted drop-shoulder silhouette that does not crease and drapes cleanly over any frame.',
    features: ['Long-staple Portuguese cotton', 'Zero transparency in light colors', '3.2cm tight crew collar', 'Anti-pilling enzyme wash']
  },
  {
    gsm: '360 GSM',
    title: 'Ultra-Dense Interlock',
    tag: 'ARMOR-GRADE BLANK',
    desc: 'Double-knit luxury interlock weave. Sculptural, substantial, and completely opaque with exceptional longevity that outlasts years of washing.',
    features: ['Double-knit dense interlock', 'Zero body clinging', '3.5cm heavy ribbed tubular neck', 'Milan atelier milling']
  }
];

export default function FabricGuideSection({ onShopWeight }) {
  const { playClick } = useSoundFX();
  const [activeTier, setActiveTier] = useState(1);

  return (
    <section id="fabric-guide" className="py-20 bg-[#0C0E15] border-y border-slate-800/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#C5A880] text-xs font-mono tracking-widest uppercase mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>FABRIC ENGINEERING & SPECS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white font-display mb-4">
            Understanding GSM & Cotton Weight
          </h2>
          <p className="text-slate-400 text-sm sm:text-base font-light">
            GSM stands for <span className="text-slate-200 font-mono">Grams per Square Meter</span>. We mill our tees between 280 and 360 GSM to deliver an unyielding structured streetwear silhouette.
          </p>
        </div>

        {/* 3-Tier Weight Interactive Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {GSM_TIERS.map((tier, idx) => {
            const isSelected = activeTier === idx;
            return (
              <div
                key={tier.gsm}
                onClick={() => {
                  playClick(1400);
                  setActiveTier(idx);
                }}
                className={`p-6 sm:p-8 rounded-3xl border transition-all duration-300 cursor-pointer flex flex-col justify-between relative ${
                  isSelected
                    ? 'bg-[#141724] border-white/40 shadow-2xl scale-[1.02] ring-1 ring-[#C5A880]'
                    : 'bg-[#10121A] border-slate-800 hover:border-slate-700 opacity-80 hover:opacity-100'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl sm:text-3xl font-black font-mono text-white">
                      {tier.gsm}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono uppercase bg-white/10 text-[#C5A880] border border-white/10">
                      {tier.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold uppercase tracking-tight text-white mb-2">
                    {tier.title}
                  </h3>

                  <p className="text-xs text-slate-300 font-light leading-relaxed mb-6">
                    {tier.desc}
                  </p>
                </div>

                <div className="space-y-2 pt-4 border-t border-slate-800">
                  {tier.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-mono text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* The 3 Collar & Fit Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-slate-800/80">
          <div className="p-5 rounded-2xl bg-[#10121A] border border-slate-800">
            <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-[#C5A880] mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold uppercase text-white mb-1">Zero-Sag 3.2cm Collar</h4>
            <p className="text-xs text-slate-400 font-light leading-relaxed">
              Reinforced 1x1 tight heavy ribbing with double-needle topstitch keeps the collar flush against the neck forever.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#10121A] border border-slate-800">
            <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-[#C5A880] mb-3">
              <Layers className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold uppercase text-white mb-1">Drop-Shoulder Boxy Cut</h4>
            <p className="text-xs text-slate-400 font-light leading-relaxed">
              Widened chest circumference with relaxed dropped shoulder seams provides an effortless, structured streetwear drape.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#10121A] border border-slate-800">
            <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-[#C5A880] mb-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold uppercase text-white mb-1">Pre-Shrunk Bio Wash</h4>
            <p className="text-xs text-slate-400 font-light leading-relaxed">
              Every tee undergoes organic silicone bio-washing to lock in dimensional stability and eliminate wash shrinkage.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}

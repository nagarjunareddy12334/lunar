import React from 'react';
import { Sparkles, Zap, Flame, Radio, Disc } from 'lucide-react';

const MARQUEE_ITEMS = [
  { text: 'SUKIA FUNK COUTURE // 3D EXHIBITION', icon: Sparkles, color: 'text-[#d4ff00]' },
  { text: '360 GSM RING-SPUN COMBED GROOVE', icon: Zap, color: 'text-[#ff1f8f]' },
  { text: 'LIMITED DROP 01 // 150 PCS WORLDWIDE', icon: Disc, color: 'text-[#00f0ff]' },
  { text: 'ZERO-SAG 3.2CM REINFORCED RIBS', icon: Sparkles, color: 'text-[#d4ff00]' },
  { text: 'SCULPTURAL BOXY DROP-SHOULDER CUTS', icon: Radio, color: 'text-[#a855f7]' },
  { text: 'ANTI-CRACK HIGH-DENSITY PLASTISOL', icon: Flame, color: 'text-[#ff6b00]' },
  { text: 'TOKYO × BERLIN × LA STREETWEAR ATELIER', icon: Zap, color: 'text-[#d4ff00]' },
  { text: 'NEVER NOT FUNKY // 100% ORGANIC COTTON', icon: Sparkles, color: 'text-[#ff1f8f]' },
];

/**
 * High-Fashion Funky Infinite Runway Typography Ticker
 * Seamless scrolling marquee with hover pause and edge gradient masks.
 */
export default function MarqueeTicker({ reverse = false, speed = 30 }) {
  const content = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <div className="relative w-full overflow-hidden py-3 bg-[#06070A] border-y border-slate-800/80 group">
      {/* Edge Gradient Mask for seamless fade */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#06070A] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#06070A] to-transparent z-10 pointer-events-none" />

      {/* Marquee Track */}
      <div
        className={`flex whitespace-nowrap gap-12 group-hover:[animation-play-state:paused] ${
          reverse ? 'animate-[marqueeReverse_35s_linear_infinite]' : 'animate-[marquee_35s_linear_infinite]'
        }`}
      >
        {content.map((item, idx) => {
          const IconComp = item.icon;
          return (
            <div
              key={idx}
              className="inline-flex items-center gap-3 text-xs font-mono uppercase tracking-[0.25em] text-slate-300 select-none group-hover:text-white transition-colors"
            >
              <IconComp className={`w-3.5 h-3.5 ${item.color} shrink-0 animate-pulse`} />
              <span className="font-semibold">{item.text}</span>
              <span className="text-[#d4ff00]/40 mx-2">★</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

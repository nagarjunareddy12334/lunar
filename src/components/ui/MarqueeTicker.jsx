import React from 'react';
import { Sparkles, Moon, Compass, Shield } from 'lucide-react';

const MARQUEE_ITEMS = [
  { text: 'AEROSPACE GRADE 5 TITANIUM', icon: Shield },
  { text: 'LIMITED RUN 01/150 PCS', icon: Sparkles },
  { text: '580 GSM PORTUGUESE TERRY', icon: Compass },
  { text: 'SUPERMOON PHASE 04 DROP', icon: Moon },
  { text: 'ZERO-RUNOFF BOTANICAL MINERAL DYES', icon: Sparkles },
  { text: 'WEATHERPROOF FIDLOCK HARDWARE', icon: Shield },
  { text: 'INSURED WORLDWIDE DELIVERY', icon: Compass },
];

/**
 * High-Fashion Infinite Runway Typography Ticker
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
              className="inline-flex items-center gap-3 text-xs font-mono uppercase tracking-[0.25em] text-slate-400 select-none group-hover:text-slate-200 transition-colors"
            >
              <IconComp className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
              <span>{item.text}</span>
              <span className="text-slate-700 mx-2">•</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

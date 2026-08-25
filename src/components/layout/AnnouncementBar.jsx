import React, { useState, useEffect } from 'react';
import { Sparkles, ShieldCheck } from 'lucide-react';

const ANNOUNCEMENTS = [
  { text: 'FREE WORLDWIDE EXPRESS SHIPPING ON ALL ORDERS OVER $75', code: null },
  { text: 'USE CODE "LUNARTEE15" FOR 15% OFF ALL GRAPHIC & OVERSIZED TEES', code: 'LUNARTEE15' },
  { text: 'NEW 2026 DROP: 280–360 GSM ULTRA-HEAVYWEIGHT TEES NOW LIVE', code: null },
  { text: 'LIFETIME ZERO-SAG COLLAR GUARANTEE & EASY 30-DAY EXCHANGES', code: null }
];

export default function AnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const current = ANNOUNCEMENTS[currentIndex];

  return (
    <div className="bg-[#050608] border-b border-slate-800/80 text-slate-300 text-xs py-2 px-4 relative overflow-hidden select-none z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between">


        {/* Center Rotating Message */}
        <div className="flex-1 flex items-center justify-center gap-2 text-center font-medium tracking-wider text-[11px] sm:text-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
          <span className="transition-all duration-500 font-mono">{current.text}</span>
          {current.code && (
            <span className="hidden sm:inline-block bg-white/10 text-[#C5A880] font-mono px-2 py-0.5 rounded text-[10px] border border-white/15">
              {current.code}
            </span>
          )}
        </div>

        {/* Right Guarantee */}
        <div className="hidden md:flex items-center gap-2 text-slate-400 text-[11px] font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880]" />
          <span>PRE-SHRUNK 100% COTTON</span>
        </div>
      </div>
    </div>
  );
}

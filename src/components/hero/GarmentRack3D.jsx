import React, { useState, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ShoppingBag, 
  Eye, 
  Sparkles, 
  ArrowRight,
  Flame,
  Layers
} from 'lucide-react';
import { useSoundFX } from '../../hooks/useSoundFX';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

const RACK_ITEMS = [
  {
    id: 'lunar-tee-01',
    name: 'ASTRAL ORBIT HEAVY TEE',
    color: 'Obsidian Black',
    gsm: '360 GSM',
    price: 78,
    originalPrice: 95,
    tag: 'SIGNATURE DROP 01',
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=85',
    category: 'Heavyweight',
    spec: 'Custom 360 GSM Combed Cotton • High-Definition Front & Back Screenprint'
  },
  {
    id: 'lunar-tee-02',
    name: 'TOKYO CYBERPUNK OVERSIZED',
    color: 'Acid Grey',
    gsm: '320 GSM',
    price: 68,
    originalPrice: 85,
    tag: 'LIMITED RUN 150 PCS',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=85',
    category: 'Oversized',
    spec: 'Drop-Shoulder Boxy Silhouette • Anti-Cracking Plastisol Print'
  },
  {
    id: 'lunar-tee-03',
    name: 'RAW MINIMALIST BLANK TEE',
    color: 'Cyber Bone',
    gsm: '340 GSM',
    price: 64,
    originalPrice: 75,
    tag: 'ESSENTIAL FIT',
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=85',
    category: 'Minimal',
    spec: 'Zero-Sag 3.2cm Heavy Collar • Clean Raw Mineral Dyed Finish'
  },
  {
    id: 'lunar-tee-04',
    name: 'ECHO MONOLITH HEAVYWEIGHT',
    color: 'Vintage Slate',
    gsm: '360 GSM',
    price: 74,
    originalPrice: 92,
    tag: 'LIMITED DROP',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=85',
    category: 'Heavyweight',
    spec: 'Sculptural Heavyweight Drape • Preshrunk Organic Combed Cotton'
  },
  {
    id: 'lunar-tee-05',
    name: 'SOLAR ECLIPSE OVERSIZED',
    color: 'Carbon Noir',
    gsm: '300 GSM',
    price: 70,
    originalPrice: 88,
    tag: 'SOLAR SERIES',
    image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&q=85',
    category: 'Graphic',
    spec: '3D Embossed Silicone Sleeve Insignia • Double Needle Hem'
  }
];

export default function GarmentRack3D({ onExplore, onQuickView }) {
  const { playClick, playHover } = useSoundFX();
  const { addToCart, setIsCartOpen } = useCart();
  const { addToast } = useToast();

  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const nextItem = () => {
    playClick(1300, 0.03);
    setActiveIndex((prev) => (prev + 1) % RACK_ITEMS.length);
  };

  const prevItem = () => {
    playClick(1300, 0.03);
    setActiveIndex((prev) => (prev - 1 + RACK_ITEMS.length) % RACK_ITEMS.length);
  };

  const currentItem = RACK_ITEMS[activeIndex];

  const handleQuickAdd = (item) => {
    playClick(1600, 0.05);
    addToCart(
      {
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        category: item.category
      },
      'L', // Default size
      item.color
    );
    addToast(`Added ${item.name} (Size L) to bag`, 'success');
    setIsCartOpen(true);
  };

  return (
    <section className="relative py-20 bg-[#06070a] border-b border-slate-800/80 overflow-hidden">
      {/* Background Ambience & Lighting */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#C5A880]/10 via-slate-900/10 to-transparent blur-3xl opacity-50" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-[#C5A880]/30 text-[#C5A880] text-[10px] font-mono uppercase tracking-widest mb-3">
              <Sparkles className="w-3 h-3" />
              <span>3D BOUTIQUE SHOWCASE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white font-display">
              THE 3D <span className="shimmer-text">GARMENT RACK</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-400 font-light mt-2 max-w-lg">
              Browse hanging silhouettes in 3D perspective. Engineered 280 to 360 GSM heavyweight cotton crafted in numbered editions.
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={prevItem}
              className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-600 transition-all cursor-pointer"
              aria-label="Previous Garment"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-mono text-xs text-slate-400">
              <strong className="text-white">0{activeIndex + 1}</strong> / 0{RACK_ITEMS.length}
            </span>
            <button
              onClick={nextItem}
              className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-600 transition-all cursor-pointer"
              aria-label="Next Garment"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 3D Clothing Rack Visual Construction */}
        <div className="relative w-full pt-8 pb-12">
          {/* Top Metallic Rail */}
          <div className="relative w-full h-3 rounded-full bg-gradient-to-r from-slate-800 via-slate-500 to-slate-800 shadow-[0_4px_15px_rgba(0,0,0,0.8)] border-y border-white/20 mb-8 z-20">
            {/* Ambient metallic sheen */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent rounded-full pointer-events-none" />
          </div>

          {/* 3D Hanging Garments Container */}
          <div 
            className="relative min-h-[460px] sm:min-h-[500px] flex items-center justify-center"
            style={{ perspective: '1400px' }}
          >
            {RACK_ITEMS.map((item, idx) => {
              const offset = idx - activeIndex;
              const isCenter = offset === 0;
              const isHovered = hoveredIndex === idx;

              // Calculate 3D transformation values
              const translateX = offset * 220; // Horizontal spacing
              const translateZ = -Math.abs(offset) * 160; // Depth back
              const rotateY = offset * -18; // Angle towards center
              const opacity = Math.abs(offset) > 2 ? 0 : 1 - Math.abs(offset) * 0.25;
              const scale = isCenter ? 1.05 : 0.9 - Math.abs(offset) * 0.05;
              const zIndex = 30 - Math.abs(offset) * 5;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    playClick();
                    setActiveIndex(idx);
                  }}
                  onMouseEnter={() => {
                    playHover();
                    setHoveredIndex(idx);
                  }}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="absolute transition-all duration-500 ease-out cursor-pointer select-none"
                  style={{
                    transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) rotateZ(${isHovered ? (offset >= 0 ? 2 : -2) : 0}deg) scale(${scale})`,
                    opacity: opacity,
                    zIndex: zIndex,
                    pointerEvents: Math.abs(offset) > 2 ? 'none' : 'auto'
                  }}
                >
                  {/* Hanger Graphic */}
                  <div className="flex flex-col items-center">
                    {/* Metal Hook */}
                    <div className="w-5 h-7 border-t-2 border-r-2 border-slate-300 rounded-tr-full -mb-1 transform -rotate-12 pointer-events-none" />
                    {/* Hanger Bar */}
                    <div className="w-36 h-2 rounded-full bg-[#1c1f2e] border border-slate-600 shadow-md pointer-events-none" />
                  </div>

                  {/* Garment Card */}
                  <div className={`relative w-[260px] sm:w-[300px] rounded-3xl overflow-hidden bg-[#10121A] border transition-all duration-300 shadow-2xl mt-1 ${
                    isCenter 
                      ? 'border-[#C5A880]/60 shadow-[0_15px_40px_rgba(0,0,0,0.9)]' 
                      : 'border-slate-800 hover:border-slate-600 opacity-90'
                  }`}>
                    {/* Tag Badge */}
                    <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5 pointer-events-none">
                      <span className="px-2.5 py-0.5 rounded-full bg-black/80 backdrop-blur-md text-[9px] font-mono uppercase tracking-wider text-white border border-white/10 font-bold">
                        {item.tag}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-[#C5A880]/20 backdrop-blur-md text-[9px] font-mono uppercase tracking-wider text-[#C5A880] border border-[#C5A880]/30">
                        {item.gsm}
                      </span>
                    </div>

                    {/* Image */}
                    <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#090a0f]">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
                        draggable="false"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#10121A] via-transparent to-transparent opacity-80" />
                    </div>

                    {/* Garment Meta */}
                    <div className="p-4 bg-[#10121A]">
                      <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
                        {item.color}
                      </span>
                      <h3 className="text-sm font-bold text-white uppercase tracking-tight truncate mt-0.5">
                        {item.name}
                      </h3>

                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-800">
                        <div>
                          <span className="text-sm font-mono font-bold text-white">${item.price}.00</span>
                          <span className="text-xs font-mono text-slate-500 line-through ml-2">${item.originalPrice}.00</span>
                        </div>

                        {isCenter && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleQuickAdd(item);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-[#C5A880] hover:bg-[#dfc8a8] text-black text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Bag</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Garment Spec Banner */}
        <div className="mt-8 p-6 rounded-3xl bg-[#10121A] border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-[#C5A880]/40 flex items-center justify-center text-[#C5A880] shrink-0">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#C5A880]">
                  SPEC HIGHLIGHT // {currentItem.name}
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-xs font-mono text-slate-400">{currentItem.gsm}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 font-light mt-1">
                {currentItem.spec}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => {
                playClick();
                handleQuickAdd(currentItem);
              }}
              className="flex-1 md:flex-none px-6 py-3 rounded-full bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-[#dfc8a8] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Bag (${currentItem.price})</span>
            </button>

            <button
              onClick={() => {
                playClick();
                if (onExplore) onExplore();
              }}
              className="px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 text-white font-semibold text-xs uppercase tracking-widest border border-white/15 hover:border-white/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

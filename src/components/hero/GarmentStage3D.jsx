import React, { useState } from 'react';
import { 
  RotateCw, 
  Sparkles, 
  Eye, 
  Compass, 
  X,
  Layers,
  Box
} from 'lucide-react';
import { useSoundFX } from '../../hooks/useSoundFX';
import ThreeTShirtCanvas from './ThreeTShirtCanvas';

// 3D Garment Colorway Variants
const GARMENT_VARIANTS = [
  {
    id: 'noir',
    name: 'Obsidian Noir',
    colorHex: '#0c0d12',
    gsm: '360 GSM',
    tag: 'SIGNATURE DROP 01',
    price: '$78.00',
    originalPrice: '$95.00'
  },
  {
    id: 'charcoal',
    name: 'Washed Slate',
    colorHex: '#252932',
    gsm: '340 GSM',
    tag: 'MINIMAL HEAVY',
    price: '$74.00',
    originalPrice: '$88.00'
  },
  {
    id: 'bone',
    name: 'Cyber Bone',
    colorHex: '#dedad3',
    gsm: '320 GSM',
    tag: 'RAW UNBLEACHED',
    price: '$72.00',
    originalPrice: '$90.00'
  },
  {
    id: 'acid',
    name: 'Tokyo Acid',
    colorHex: '#3a443b',
    gsm: '360 GSM',
    tag: 'LIMITED RUN',
    price: '$82.00',
    originalPrice: '$98.00'
  }
];

const HOTSPOT_INFO = {
  collar: {
    label: 'Zero-Sag Collar',
    spec: '3.2cm Heavy Ribbed Collar with internal herringbone stabilization tape.'
  },
  print: {
    label: 'Plastisol HD Print',
    spec: 'SUKAI Cybernetic high-density screenprint with anti-crack stretch polymer.'
  },
  shoulder: {
    label: 'Drop-Shoulder Cut',
    spec: 'Engineered 4.5cm dropped armholes creating a relaxed, structural boxy drape.'
  },
  hem: {
    label: '360 GSM Combed Cotton',
    spec: 'Ring-spun long-staple cotton, double-needle blind hemmed for lifetime shape retention.'
  }
};

export default function GarmentStage3D({ onExplore }) {
  const { playClick, playHover } = useSoundFX();

  const [activeVariant, setActiveVariant] = useState(GARMENT_VARIANTS[0]);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [rotationRad, setRotationRad] = useState(0);
  const [projectedHotspots, setProjectedHotspots] = useState([]);
  const [activeHotspot, setActiveHotspot] = useState(null);

  // Flip 180 degrees
  const handleFlip = () => {
    playClick(1400, 0.04);
    setIsAutoRotating(false);
    setRotationRad((prev) => prev + Math.PI);
  };

  const currentDegrees = Math.round((((rotationRad * 180 / Math.PI) % 360) + 360) % 360);
  const isFacingBack = currentDegrees > 90 && currentDegrees < 270;

  return (
    <div className="relative w-full max-w-xl mx-auto flex flex-col items-center select-none">
      {/* 3D WebGL Stage Container */}
      <div className="relative w-full aspect-[4/5] sm:aspect-[1/1] rounded-3xl overflow-hidden bg-gradient-to-b from-[#141622]/90 via-[#0d0f16]/95 to-[#08090f] border border-slate-700/80 shadow-[0_20px_60px_rgba(0,0,0,0.85)] backdrop-blur-md">
        
        {/* Top Floating Badges */}
        <div className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-[10px] font-mono font-bold uppercase tracking-widest text-[#C5A880] border border-[#C5A880]/30 shadow-lg flex items-center gap-1.5">
              <Box className="w-3 h-3 text-[#C5A880] animate-pulse" />
              <span>REAL 3D WEBGL STAGE</span>
            </span>
            <span className="hidden sm:inline-block px-2.5 py-1 rounded-full bg-white/5 backdrop-blur-md text-[10px] font-mono uppercase tracking-wider text-slate-300 border border-white/10">
              {activeVariant.gsm}
            </span>
          </div>

          <div className="flex items-center gap-1.5 pointer-events-auto">
            <button
              onClick={() => {
                playClick();
                setIsAutoRotating(!isAutoRotating);
              }}
              className={`px-3 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer border ${
                isAutoRotating 
                  ? 'bg-[#C5A880] text-black border-[#C5A880] font-bold shadow-[0_0_12px_rgba(197,168,128,0.4)]' 
                  : 'bg-black/60 text-slate-400 hover:text-white border-white/10 hover:border-white/30'
              }`}
              title="Toggle Auto 360° Rotation"
            >
              <RotateCw className={`w-3 h-3 ${isAutoRotating ? 'animate-spin' : ''}`} />
              <span>{isAutoRotating ? 'Auto Spin' : 'Paused'}</span>
            </button>
          </div>
        </div>

        {/* Ambient Studio Lighting Glow */}
        <div 
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${50 + Math.sin(rotationRad) * 25}% 40%, rgba(197, 168, 128, 0.2) 0%, rgba(20, 25, 45, 0.08) 50%, transparent 80%)`
          }}
        />

        {/* Three.js 3D T-Shirt Canvas */}
        <div className="absolute inset-0 z-10">
          <ThreeTShirtCanvas
            colorway={activeVariant}
            isAutoRotating={isAutoRotating}
            rotationY={rotationRad}
            onRotateChange={setRotationRad}
            onHotspotsUpdate={setProjectedHotspots}
          />
        </div>

        {/* Real-time Projected 3D Specification Hotspot Pins */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          {projectedHotspots.map((spot) => {
            if (!spot.visible) return null;
            const info = HOTSPOT_INFO[spot.id];
            if (!info) return null;
            const isSelected = activeHotspot?.id === spot.id;

            return (
              <div
                key={spot.id}
                className="absolute pointer-events-auto transition-transform duration-75"
                style={{
                  left: `${spot.x}px`,
                  top: `${spot.y}px`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    playClick(1500, 0.03);
                    setActiveHotspot(isSelected ? null : { id: spot.id, ...info });
                  }}
                  onMouseEnter={playHover}
                  className={`group relative flex items-center justify-center w-6 h-6 rounded-full cursor-pointer transition-all duration-300 ${
                    isSelected 
                      ? 'bg-[#C5A880] text-black scale-125 shadow-[0_0_18px_rgba(197,168,128,0.9)]' 
                      : 'bg-black/80 hover:bg-[#C5A880] text-[#C5A880] hover:text-black border border-[#C5A880]/60 shadow-md'
                  }`}
                  aria-label={info.label}
                >
                  <span className="absolute -inset-1 rounded-full bg-[#C5A880]/30 animate-ping pointer-events-none" />
                  <span className="w-2 h-2 rounded-full bg-current" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Hotspot Info Card */}
        {activeHotspot && (
          <div 
            className="absolute bottom-16 left-4 right-4 z-40 p-4 rounded-2xl bg-[#0f1118]/95 border border-[#C5A880]/50 shadow-2xl backdrop-blur-xl animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#C5A880]" />
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#C5A880]">
                    {activeHotspot.label}
                  </h4>
                </div>
                <p className="text-xs text-slate-300 font-light leading-relaxed">
                  {activeHotspot.spec}
                </p>
              </div>
              <button
                onClick={() => setActiveHotspot(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Bottom Interactive Drag Hint & Controls */}
        <div className="absolute bottom-4 left-4 right-4 z-30 flex items-center justify-between pointer-events-none">
          <div className="px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-mono text-slate-400 flex items-center gap-2">
            <Compass className="w-3.5 h-3.5 text-[#C5A880] animate-spin" />
            <span>DRAG 3D MODEL 360° ({currentDegrees}°)</span>
          </div>

          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              onClick={handleFlip}
              className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white text-[10px] font-mono uppercase tracking-wider backdrop-blur-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>{isFacingBack ? 'Front' : 'Back'}</span>
              <RotateCw className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Variant Selector Bar */}
      <div className="w-full mt-4 p-3 rounded-2xl bg-[#10121A] border border-slate-800 flex items-center justify-between gap-2 flex-wrap">
        {/* Colorway Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          {GARMENT_VARIANTS.map((variant) => {
            const isSelected = activeVariant.id === variant.id;
            return (
              <button
                key={variant.id}
                onClick={() => {
                  playClick();
                  setActiveVariant(variant);
                }}
                onMouseEnter={playHover}
                className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white/10 border-[#C5A880] text-white shadow-[0_0_12px_rgba(197,168,128,0.2)]'
                    : 'bg-transparent border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <span 
                  className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm"
                  style={{ backgroundColor: variant.colorHex }}
                />
                <span className="text-[11px] font-mono uppercase tracking-wider font-semibold">
                  {variant.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Inspect Button */}
        <button
          onClick={() => {
            playClick();
            if (onExplore) onExplore();
          }}
          className="px-4 py-2 bg-white text-black font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-[#dfc8a8] transition-all flex items-center gap-2 cursor-pointer shadow-md"
        >
          <Eye className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Inspect Fit</span>
        </button>
      </div>
    </div>
  );
}

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Globe, Orbit } from 'lucide-react';
import { useSoundFX } from '../../hooks/useSoundFX';

const MOON_PHASES = [
  { id: 'new', name: 'Phase 01: Void New Moon', lightAngle: 180, shadowOffset: 100, illumination: '0%' },
  { id: 'crescent', name: 'Phase 02: Waxing Crescent', lightAngle: 135, shadowOffset: 65, illumination: '25%' },
  { id: 'quarter', name: 'Phase 03: Half Orbital', lightAngle: 90, shadowOffset: 50, illumination: '50%' },
  { id: 'gibbous', name: 'Phase 04: Waxing Gibbous', lightAngle: 45, shadowOffset: 25, illumination: '75%' },
  { id: 'supermoon', name: 'Phase 05: Supermoon Prime', lightAngle: 0, shadowOffset: 0, illumination: '100%' },
];

/**
 * 3D Holographic Celestial Lunar Orb
 * Interactive 3D celestial sphere with orbital telemetry rings,
 * mouse drag rotation, and dynamic moon phase lighting simulator.
 */
export default function LunarOrb() {
  const [activePhaseIndex, setActivePhaseIndex] = useState(4); // Default Supermoon
  const [rotation, setRotation] = useState({ x: 15, y: -25 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const rotStart = useRef({ x: 15, y: -25 });
  const { playClick, playHover } = useSoundFX();

  const phase = MOON_PHASES[activePhaseIndex];

  // Mouse drag handlers for 3D rotation
  const handleMouseDown = (e) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    rotStart.current = { ...rotation };
  };

  const handleMouseMove = useCallback((e) => {
    const deltaX = (e.clientX - dragStart.current.x) * 0.5;
    const deltaY = (e.clientY - dragStart.current.y) * 0.5;

    setRotation({
      x: Math.max(-45, Math.min(45, rotStart.current.x - deltaY)),
      y: rotStart.current.y + deltaX,
    });
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div className="relative flex flex-col items-center justify-center select-none">
      {/* 3D Sphere & Orbital Rings Container */}
      <div
        onMouseDown={handleMouseDown}
        data-cursor="orbit"
        data-cursor-text="DRAG"
        className={`relative w-72 h-72 sm:w-88 sm:h-88 md:w-96 md:h-96 flex items-center justify-center cursor-grab ${
          isDragging ? 'cursor-grabbing' : ''
        }`}
        style={{
          perspective: '1200px',
        }}
      >
        {/* Outer Orbit Gyro Ring 1 */}
        <div
          className="absolute inset-0 rounded-full border border-[#C5A880]/20 pointer-events-none animate-[spin_30s_linear_infinite]"
          style={{
            transform: 'rotateX(68deg) rotateY(15deg)',
            boxShadow: '0 0 40px rgba(197, 168, 128, 0.08)',
          }}
        >
          {/* Orbital Satellite Dot */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#C5A880] shadow-[0_0_12px_#C5A880]" />
        </div>

        {/* Outer Orbit Gyro Ring 2 */}
        <div
          className="absolute inset-6 rounded-full border border-slate-400/15 pointer-events-none animate-[spin_45s_linear_infinite_reverse]"
          style={{
            transform: 'rotateX(-60deg) rotateY(40deg)',
          }}
        >
          <div className="absolute bottom-0 right-1/4 w-1.5 h-1.5 rounded-full bg-slate-200 shadow-[0_0_8px_white]" />
        </div>

        {/* Ambient Halo & Corona Glow */}
        <div
          className="absolute inset-8 rounded-full pointer-events-none transition-all duration-1000 blur-2xl opacity-60"
          style={{
            background:
              activePhaseIndex === 4
                ? 'radial-gradient(circle, rgba(226, 232, 240, 0.35) 0%, rgba(197, 168, 128, 0.2) 50%, transparent 75%)'
                : 'radial-gradient(circle, rgba(226, 232, 240, 0.15) 0%, transparent 70%)',
          }}
        />

        {/* Main 3D Moon Sphere */}
        <div
          className="relative w-52 h-52 sm:w-64 sm:h-64 rounded-full overflow-hidden shadow-2xl transition-transform duration-100"
          style={{
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
            transformStyle: 'preserve-3d',
            boxShadow: '0 20px 60px -10px rgba(0,0,0,0.9), 0 0 35px rgba(226, 232, 240, 0.15)',
          }}
        >
          {/* Base Moon Texture Surface */}
          <div
            className="absolute inset-0 bg-cover bg-center grayscale contrast-125"
            style={{
              backgroundImage:
                'url("https://images.unsplash.com/photo-1532693322450-2cb5c511067d?auto=format&fit=crop&w=800&q=85")',
              transform: `scale(1.15) translate3d(${rotation.y * 0.2}px, ${-rotation.x * 0.2}px, 0)`,
              transition: 'transform 0.1s ease-out',
            }}
          />

          {/* Craters & Topography Overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-transparent to-slate-200/20 mix-blend-overlay" />

          {/* Dynamic Moon Phase Shadow Mask */}
          <div
            className="absolute inset-0 transition-all duration-700 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at ${100 - phase.shadowOffset}% 50%, transparent 40%, rgba(5, 6, 8, 0.95) 85%)`,
              mixBlendMode: 'multiply',
            }}
          />

          {/* Top Edge Specular Crescent Glow */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none transition-opacity duration-700"
            style={{
              boxShadow: 'inset 2px 2px 20px rgba(255, 255, 255, 0.6), inset -5px -5px 30px rgba(0,0,0,0.95)',
            }}
          />

          {/* Holographic Radar Coordinates Grid */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />
        </div>

        {/* Telemetry Coordinate Badges Floating in 3D Space */}
        <div className="absolute -top-2 right-4 glass-panel-light px-3 py-1 rounded-full text-[9px] font-mono text-slate-300 border border-slate-700/60 shadow-lg pointer-events-none flex items-center gap-1.5 animate-fadeIn">
          <Globe className="w-3 h-3 text-[#C5A880]" />
          <span>ROT: {Math.round(rotation.y)}° / {Math.round(rotation.x)}°</span>
        </div>

        <div className="absolute -bottom-2 left-4 glass-panel-light px-3 py-1 rounded-full text-[9px] font-mono text-slate-300 border border-slate-700/60 shadow-lg pointer-events-none flex items-center gap-1.5 animate-fadeIn">
          <Orbit className="w-3 h-3 text-[#C5A880]" />
          <span>LUM: {phase.illumination}</span>
        </div>
      </div>

      {/* Moon Phase Selector Controls */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2 max-w-sm px-4">
        {MOON_PHASES.map((p, idx) => {
          const isActive = activePhaseIndex === idx;
          return (
            <button
              key={p.id}
              onClick={() => {
                setActivePhaseIndex(idx);
                playClick(1400 + idx * 100);
              }}
              onMouseEnter={playHover}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-mono uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                isActive
                  ? 'bg-white text-black font-bold shadow-lg shadow-white/20 scale-105'
                  : 'glass-panel text-slate-400 hover:text-white hover:border-slate-500'
              }`}
            >
              {p.name.split(':')[0]}
            </button>
          );
        })}
      </div>
    </div>
  );
}

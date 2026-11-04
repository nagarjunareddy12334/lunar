import React, { useEffect, useRef, useState } from 'react';

/**
 * Avant-Garde Dual-Ring Custom Luxury Cursor
 * Features fluid inertia interpolation, context-aware morphing (Default, Hover, View, Drag, Orbit),
 * and automatic disable on touch devices.
 */
export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [cursorText, setCursorText] = useState('');
  const [cursorMode, setCursorMode] = useState('default'); // default, hover, view, drag, magnetic
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Smooth position state for requestAnimationFrame
  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const isHoveringMagnetic = useRef(null);

  useEffect(() => {
    // Check if device is touch-primary
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouchDevice(true);
      return;
    }

    let animationFrameId;

    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }

      // Check context attributes under cursor
      const target = e.target.closest('[data-cursor]');
      if (target) {
        const mode = target.getAttribute('data-cursor');
        const text = target.getAttribute('data-cursor-text') || '';
        setCursorMode(mode || 'hover');
        setCursorText(text);
      } else {
        const isClickable = e.target.closest('button, a, input, select, textarea, [role="button"]');
        if (isClickable) {
          setCursorMode('hover');
          setCursorText('');
        } else {
          setCursorMode('default');
          setCursorText('');
        }
      }
    };

    // Use direct DOM manipulation for mousedown/mouseup to avoid React re-renders
    // that interfere with click event propagation on interactive elements
    const handleMouseDown = () => {
      if (ringRef.current) {
        ringRef.current.classList.add('scale-90');
      }
    };
    const handleMouseUp = () => {
      if (ringRef.current) {
        ringRef.current.classList.remove('scale-90');
      }
    };
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    // Fluid spring loop for outer ring
    const render = () => {
      // Linear interpolation (Lerp) for smooth trailing
      const ease = 0.16;
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * ease;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * ease;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.body.addEventListener('mouseleave', handleMouseLeave);
    document.body.addEventListener('mouseenter', handleMouseEnter);

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
      document.body.removeEventListener('mouseenter', handleMouseEnter);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible]);

  if (isTouchDevice || !isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden transition-opacity duration-300">
      {/* Precision Core Dot */}
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full transition-[width,height,background-color,opacity] duration-150 ease-out z-50 ${
          cursorMode === 'view' || cursorMode === 'orbit'
            ? 'w-2 h-2 bg-[#d4ff00] opacity-0'
            : cursorMode === 'hover'
            ? 'w-2 h-2 bg-[#d4ff00] shadow-[0_0_10px_#d4ff00]'
            : 'w-1.5 h-1.5 bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]'
        }`}
        style={{ willChange: 'transform' }}
      />

      {/* Fluid Trailing Ring / Aura */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center transition-[width,height,border-color,background-color,transform] duration-200 ease-out backdrop-blur-[1px] ${
          cursorMode === 'view'
            ? 'w-20 h-20 bg-[#ff1f8f]/20 border border-[#ff1f8f] shadow-[0_0_30px_rgba(255,31,143,0.4)]'
            : cursorMode === 'orbit'
            ? 'w-24 h-24 bg-slate-900/60 border border-[#d4ff00]/80 shadow-[0_0_25px_rgba(212,255,0,0.3)]'
            : cursorMode === 'hover'
            ? 'w-10 h-10 border border-[#d4ff00] bg-[#d4ff00]/10 shadow-[0_0_15px_rgba(212,255,0,0.35)] scale-110'
            : 'w-8 h-8 border border-white/25 bg-white/[0.02]'
        }`}
        style={{ willChange: 'transform' }}
      >
        {/* Dynamic Context Label (e.g., VIEW / ORBIT / DRAG) */}
        {cursorText && (
          <span className="text-[9px] font-mono font-bold tracking-widest text-[#d4ff00] uppercase animate-fadeIn">
            {cursorText}
          </span>
        )}
      </div>
    </div>
  );
}

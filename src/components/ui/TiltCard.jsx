import React, { useRef, useCallback } from 'react';

/**
 * 3D Gyroscopic Tilt Card with Specular Light Reflection Sheen
 * Uses direct DOM manipulation (refs) instead of React state to avoid
 * re-renders on every mouse move that can swallow click events in children.
 */
export default function TiltCard({
  children,
  className = '',
  maxTilt = 8,
  glare = true,
  scale = 1.02,
  ...props
}) {
  const cardRef = useRef(null);
  const innerRef = useRef(null);
  const glareRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current || !innerRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();

    const xPct = (e.clientX - rect.left) / rect.width;
    const yPct = (e.clientY - rect.top) / rect.height;

    const rotateX = (0.5 - yPct) * maxTilt * 2;
    const rotateY = (xPct - 0.5) * maxTilt * 2;

    innerRef.current.style.transform =
      `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`;

    if (glareRef.current) {
      glareRef.current.style.opacity = '0.25';
      glareRef.current.style.background =
        `radial-gradient(circle at ${xPct * 100}% ${yPct * 100}%, rgba(255, 255, 255, 0.4) 0%, rgba(197, 168, 128, 0.15) 30%, transparent 70%)`;
    }
  }, [maxTilt, scale]);

  const handleMouseEnter = useCallback(() => {
    // nothing needed — transforms applied on move
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (innerRef.current) {
      innerRef.current.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    }
    if (glareRef.current) {
      glareRef.current.style.opacity = '0';
    }
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative transform-gpu perspective-[1000px] ${className}`}
      style={{
        transformStyle: 'preserve-3d',
      }}
      {...props}
    >
      <div
        ref={innerRef}
        className="w-full h-full relative transition-all duration-300 ease-out"
        style={{
          transform: 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
          willChange: 'transform',
        }}
      >
        {children}

        {/* Specular Light Reflection Glare Overlay */}
        {glare && (
          <div
            ref={glareRef}
            className="pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden transition-opacity duration-300"
            style={{
              opacity: 0,
              mixBlendMode: 'overlay',
            }}
          />
        )}
      </div>
    </div>
  );
}


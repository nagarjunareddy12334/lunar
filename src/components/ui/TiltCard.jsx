import React, { useRef, useState } from 'react';

/**
 * 3D Gyroscopic Tilt Card with Specular Light Reflection Sheen
 * Adds depth, perspective, and dynamic lighting response to product cards and editorial panels.
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
  const [tilt, setTilt] = useState({ x: 0, y: 0, glareX: 50, glareY: 50, glareOpacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width;
    const yPct = mouseY / height;

    const rotateX = (0.5 - yPct) * maxTilt * 2;
    const rotateY = (xPct - 0.5) * maxTilt * 2;

    setTilt({
      x: rotateX,
      y: rotateY,
      glareX: xPct * 100,
      glareY: yPct * 100,
      glareOpacity: 0.25,
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0, glareX: 50, glareY: 50, glareOpacity: 0 });
  };

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
        className="w-full h-full relative transition-all duration-300 ease-out"
        style={{
          transform: isHovered
            ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(${scale}, ${scale}, ${scale})`
            : 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
          willChange: 'transform',
        }}
      >
        {children}

        {/* Specular Light Reflection Glare Overlay */}
        {glare && (
          <div
            className="pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden transition-opacity duration-300"
            style={{
              opacity: isHovered ? tilt.glareOpacity : 0,
              background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255, 255, 255, 0.4) 0%, rgba(197, 168, 128, 0.15) 30%, transparent 70%)`,
              mixBlendMode: 'overlay',
            }}
          />
        )}
      </div>
    </div>
  );
}

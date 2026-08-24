import React, { useRef, useState, useEffect } from 'react';
import { useSoundFX } from '../../hooks/useSoundFX';

/**
 * High-End Magnetic Button Wrapper
 * Dynamically displaces the child element towards the cursor with spring physics on hover.
 */
export default function MagneticButton({
  children,
  className = '',
  strength = 0.35,
  onClick,
  onMouseEnter,
  onMouseLeave,
  sound = 'click',
  ...props
}) {
  const buttonRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const { playClick, playHover } = useSoundFX();

  const handleMouseMove = (e) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;

    setPosition({ x: deltaX, y: deltaY });
  };

  const handleMouseEnter = (e) => {
    setIsHovered(true);
    playHover();
    if (onMouseEnter) onMouseEnter(e);
  };

  const handleMouseLeave = (e) => {
    setIsHovered(false);
    setPosition({ x: 0, y: 0 });
    if (onMouseLeave) onMouseLeave(e);
  };

  const handleClick = (e) => {
    if (sound === 'click') playClick();
    if (onClick) onClick(e);
  };

  return (
    <div
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        transition: isHovered ? 'transform 0.12s ease-out' : 'transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)',
      }}
      className={`inline-block ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

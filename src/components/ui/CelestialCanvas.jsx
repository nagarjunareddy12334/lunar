import React, { useEffect, useRef } from 'react';
import { soundEngine } from '../../hooks/useSoundFX';

/**
 * Procedural Fractal Lightning Bolt Class
 * Generates jagged multi-branching electrical discharges with realistic strobing and aura glow.
 */
class LightningBolt {
  constructor(startX, startY, endX, endY, color = '#00F0FF') {
    this.segments = [];
    this.color = color;
    this.age = 0;
    this.maxAge = 14;
    this.alpha = 1;
    this.branches = [];

    // Generate main jagged path with recursive midpoint displacement
    this.generatePath(startX, startY, endX, endY, 60, 0);
  }

  generatePath(x1, y1, x2, y2, displacement, depth) {
    if (depth > 5 || displacement < 4) {
      this.segments.push({ x1, y1, x2, y2 });
      return;
    }

    const midX = (x1 + x2) / 2 + (Math.random() - 0.5) * displacement;
    const midY = (y1 + y2) / 2 + (Math.random() - 0.5) * displacement;

    this.generatePath(x1, y1, midX, midY, displacement * 0.55, depth + 1);
    this.generatePath(midX, midY, x2, y2, displacement * 0.55, depth + 1);

    // Occasional sub-branch splitting off
    if (depth === 2 && Math.random() < 0.75) {
      const angle = Math.atan2(y2 - y1, x2 - x1) + (Math.random() - 0.5) * 1.3;
      const branchLength = (Math.random() * 0.4 + 0.25) * Math.hypot(x2 - x1, y2 - y1);
      const branchEndX = midX + Math.cos(angle) * branchLength;
      const branchEndY = midY + Math.sin(angle) * branchLength;

      const branch = [];
      this.generateBranchPath(midX, midY, branchEndX, branchEndY, displacement * 0.45, 0, branch);
      this.branches.push(branch);
    }
  }

  generateBranchPath(x1, y1, x2, y2, displacement, depth, branchArr) {
    if (depth > 3 || displacement < 3) {
      branchArr.push({ x1, y1, x2, y2 });
      return;
    }
    const midX = (x1 + x2) / 2 + (Math.random() - 0.5) * displacement;
    const midY = (y1 + y2) / 2 + (Math.random() - 0.5) * displacement;
    this.generateBranchPath(x1, y1, midX, midY, displacement * 0.5, depth + 1, branchArr);
    this.generateBranchPath(midX, midY, x2, y2, displacement * 0.5, depth + 1, branchArr);
  }

  update() {
    this.age++;
    // Atmospheric double-strobe flicker
    if (this.age < 3) {
      this.alpha = 1;
    } else if (this.age < 5) {
      this.alpha = 0.2; // brief blackout flicker
    } else if (this.age < 8) {
      this.alpha = 0.95; // secondary return stroke
    } else {
      this.alpha = Math.max(0, 1 - (this.age - 8) / (this.maxAge - 8));
    }
  }

  draw(ctx) {
    if (this.alpha <= 0.01) return;

    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // 1. Wide Neon Color Glow
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 4.5;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 22;
    ctx.globalAlpha = this.alpha * 0.85;

    ctx.beginPath();
    for (const seg of this.segments) {
      ctx.moveTo(seg.x1, seg.y1);
      ctx.lineTo(seg.x2, seg.y2);
    }
    ctx.stroke();

    // Side branches outer glow
    ctx.lineWidth = 2.5;
    for (const branch of this.branches) {
      ctx.beginPath();
      for (const seg of branch) {
        ctx.moveTo(seg.x1, seg.y1);
        ctx.lineTo(seg.x2, seg.y2);
      }
      ctx.stroke();
    }

    // 2. Crisp White High-Voltage Core
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1.8;
    ctx.shadowBlur = 6;
    ctx.shadowColor = '#FFFFFF';
    ctx.globalAlpha = this.alpha;

    ctx.beginPath();
    for (const seg of this.segments) {
      ctx.moveTo(seg.x1, seg.y1);
      ctx.lineTo(seg.x2, seg.y2);
    }
    ctx.stroke();

    for (const branch of this.branches) {
      ctx.beginPath();
      for (const seg of branch) {
        ctx.moveTo(seg.x1, seg.y1);
        ctx.lineTo(seg.x2, seg.y2);
      }
      ctx.stroke();
    }

    ctx.restore();
  }
}

/**
 * Interactive Celestial & Thunder Background Canvas
 * Blends drifting stardust, proximity constellation links,
 * and high-voltage procedural thunder strikes.
 */
export default function CelestialCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Particle pool
    const particleCount = Math.min(Math.floor((width * height) / 18000), 75);
    const particles = [];

    // Active Lightning bolts & screen flash
    const lightningBolts = [];
    let flashAlpha = 0;
    let flashColor = 'rgba(0, 240, 255,';

    const mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
      active: false,
    };

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.baseSize = Math.random() * 1.6 + 0.4;
        this.size = this.baseSize;
        this.vx = (Math.random() - 0.5) * 0.25;
        this.vy = (Math.random() - 0.5) * 0.25;
        this.alpha = Math.random() * 0.6 + 0.15;
        this.baseAlpha = this.alpha;
        this.twinkleSpeed = Math.random() * 0.02 + 0.005;
        this.twinkleOffset = Math.random() * Math.PI * 2;
        this.colorType = Math.random();
      }

      update(time) {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;

        this.alpha = this.baseAlpha + Math.sin(time * this.twinkleSpeed + this.twinkleOffset) * 0.25;
        if (this.alpha < 0.05) this.alpha = 0.05;

        if (mouse.active) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 180;

          if (dist < maxDist) {
            const force = (1 - dist / maxDist) * 0.8;
            this.x -= (dx / dist) * force;
            this.y -= (dy / dist) * force;
            this.alpha = Math.min(1, this.alpha + force * 0.5);
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        if (this.colorType < 0.15) {
          ctx.fillStyle = `rgba(212, 255, 0, ${this.alpha * 0.95})`;
          ctx.shadowColor = 'rgba(212, 255, 0, 0.6)';
          ctx.shadowBlur = 4;
        } else if (this.colorType < 0.28) {
          ctx.fillStyle = `rgba(255, 31, 143, ${this.alpha * 0.95})`;
          ctx.shadowColor = 'rgba(255, 31, 143, 0.6)';
          ctx.shadowBlur = 4;
        } else if (this.colorType < 0.40) {
          ctx.fillStyle = `rgba(0, 240, 255, ${this.alpha * 0.9})`;
          ctx.shadowColor = 'rgba(0, 240, 255, 0.5)';
          ctx.shadowBlur = 4;
        } else {
          ctx.fillStyle = `rgba(226, 232, 240, ${this.alpha * 0.75})`;
          ctx.shadowColor = 'rgba(255, 255, 255, 0.3)';
          ctx.shadowBlur = 2;
        }
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Function to trigger a thunderbolt strike
    const triggerLightning = (targetX = null, targetY = null) => {
      const colors = ['#00F0FF', '#D4FF00', '#A855F7', '#FFFFFF'];
      const chosenColor = colors[Math.floor(Math.random() * colors.length)];

      let startX, startY, endX, endY;

      if (targetX !== null && targetY !== null) {
        startX = targetX + (Math.random() - 0.5) * 180;
        startY = -10;
        endX = targetX;
        endY = targetY;
      } else {
        startX = Math.random() * width;
        startY = -10;
        endX = startX + (Math.random() - 0.5) * width * 0.4;
        endY = height * (0.6 + Math.random() * 0.4);
      }

      lightningBolts.push(new LightningBolt(startX, startY, endX, endY, chosenColor));

      // Occasional twin bolt for dramatic impact
      if (Math.random() < 0.4) {
        lightningBolts.push(
          new LightningBolt(
            startX + (Math.random() - 0.5) * 80,
            startY,
            endX + (Math.random() - 0.5) * 100,
            endY + (Math.random() - 0.5) * 60,
            chosenColor
          )
        );
      }

      flashAlpha = 0.35;
      flashColor = chosenColor === '#D4FF00' ? 'rgba(212, 255, 0,' : 'rgba(0, 240, 255,';

      // Play audio rumble if unmuted
      soundEngine.playThunder();
    };

    // Periodic automatic thunder strikes (every 9 to 16 seconds)
    let thunderTimer = null;
    const scheduleNextThunder = () => {
      const delay = Math.random() * 7000 + 9000;
      thunderTimer = setTimeout(() => {
        triggerLightning();
        scheduleNextThunder();
      }, delay);
    };
    scheduleNextThunder();

    // Event listener for manual / UI triggers
    const handleCustomTrigger = (e) => {
      const detail = e.detail;
      if (detail && detail.x && detail.y) {
        triggerLightning(detail.x, detail.y);
      } else {
        triggerLightning();
      }
    };
    window.addEventListener('trigger-thunder', handleCustomTrigger);

    // Double-click anywhere to summon thunder
    const handleDoubleClick = (e) => {
      triggerLightning(e.clientX, e.clientY);
    };
    window.addEventListener('dblclick', handleDoubleClick);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.body.addEventListener('mouseleave', handleMouseLeave);

    let time = 0;

    const render = () => {
      time += 1;

      mouse.x += (mouse.targetX - mouse.x) * 0.1;
      mouse.y += (mouse.targetY - mouse.y) * 0.1;

      ctx.clearRect(0, 0, width, height);

      // Atmospheric lightning screen illumination flash
      if (flashAlpha > 0.005) {
        ctx.fillStyle = `${flashColor} ${flashAlpha * 0.22})`;
        ctx.fillRect(0, 0, width, height);
        flashAlpha *= 0.84;
      }

      // Draw faint constellation links between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 85) {
            const lineAlpha = (1 - dist / 85) * 0.08;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(203, 213, 225, ${lineAlpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Update & render individual particles
      for (let i = 0; i < particles.length; i++) {
        particles[i].update(time);
        particles[i].draw();
      }

      // Update & render active lightning bolts
      for (let i = lightningBolts.length - 1; i >= 0; i--) {
        const bolt = lightningBolts[i];
        bolt.update();
        bolt.draw(ctx);
        if (bolt.age >= bolt.maxAge) {
          lightningBolts.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      if (thunderTimer) clearTimeout(thunderTimer);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('dblclick', handleDoubleClick);
      window.removeEventListener('trigger-thunder', handleCustomTrigger);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-80"
      style={{ willChange: 'transform' }}
    />
  );
}

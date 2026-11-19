import React, { useEffect, useRef } from 'react';
import { useFestivalTheme } from '../../../hooks/useFestivalTheme';

/**
 * FestivalInteractiveCanvas
 * 
 * High-performance, GPU-accelerated interactive canvas:
 * - Christmas: Falling crystalline snowflakes with depth parallax and wind drift.
 * - Holi: Ambient drifting color motes + interactive click/tap watercolor splashes!
 * - Diwali: Rising golden embers with warm glow.
 * - Eid: Serene celestial starfield with twinkling stars.
 * - Independence / Republic Day: Subtle tricolor atmospheric particles.
 * - Respects prefers-reduced-motion and pointer-events-none.
 */
export default function FestivalInteractiveCanvas({ containerRef }) {
  const { isFestivalMode, activeFestival } = useFestivalTheme();
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!isFestivalMode || !activeFestival) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = canvas.parentElement.offsetWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement.offsetHeight || 600);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const festivalId = activeFestival.id;

    // Handle Resize
    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    // ── 1. CHRISTMAS SNOW SYSTEM ──
    const snowFlakes = [];
    if (festivalId === 'christmas') {
      const count = Math.min(38, Math.floor(width / 35));
      for (let i = 0; i < count; i++) {
        snowFlakes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 2.8 + 1,
          density: Math.random() * 1.5 + 0.5,
          speedY: Math.random() * 0.9 + 0.4,
          speedX: Math.random() * 0.5 - 0.25,
          opacity: Math.random() * 0.6 + 0.3,
          swing: Math.random() * 2,
          swingSpeed: Math.random() * 0.02 + 0.01
        });
      }
    }

    // ── 2. HOLI COLOR SPLASH & DUST SYSTEM ──
    const holiMotes = [];
    const interactiveSplashes = [];
    const holiColors = ['#E11D48', '#0D9488', '#F59E0B', '#6366F1', '#EC4899', '#10B981'];

    if (festivalId === 'holi') {
      const count = Math.min(25, Math.floor(width / 50));
      for (let i = 0; i < count; i++) {
        holiMotes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 3 + 1.5,
          color: holiColors[Math.floor(Math.random() * holiColors.length)],
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6,
          opacity: Math.random() * 0.4 + 0.2
        });
      }
    }

    // ── 3. DIWALI GOLDEN EMBERS ──
    const diwaliEmbers = [];
    if (festivalId === 'diwali') {
      const count = Math.min(24, Math.floor(width / 55));
      for (let i = 0; i < count; i++) {
        diwaliEmbers.push({
          x: Math.random() * width,
          y: height - Math.random() * (height * 0.6),
          radius: Math.random() * 2 + 0.8,
          speedY: Math.random() * 0.7 + 0.3,
          speedX: (Math.random() - 0.5) * 0.4,
          opacity: Math.random() * 0.7 + 0.3,
          hue: Math.random() > 0.4 ? 43 : 28 // Gold / Amber
        });
      }
    }

    // ── 4. EID CELESTIAL TWINKLE ──
    const eidStars = [];
    if (festivalId === 'eid') {
      const count = Math.min(30, Math.floor(width / 45));
      for (let i = 0; i < count; i++) {
        eidStars.push({
          x: Math.random() * width,
          y: Math.random() * (height * 0.7),
          radius: Math.random() * 1.5 + 0.6,
          alpha: Math.random() * 0.7 + 0.2,
          alphaSpeed: (Math.random() * 0.02 + 0.008) * (Math.random() > 0.5 ? 1 : -1)
        });
      }
    }

    // ── 5. TRICOLOR PARTICLES (Independence / Republic Day) ──
    const tricolorParticles = [];
    if (festivalId === 'independence_day' || festivalId === 'republic_day') {
      const count = Math.min(20, Math.floor(width / 60));
      const colors = ['#FF9933', '#FFFFFF', '#138808', '#000080'];
      for (let i = 0; i < count; i++) {
        tricolorParticles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 2.2 + 0.8,
          color: colors[i % colors.length],
          vy: -Math.random() * 0.5 - 0.2,
          vx: (Math.random() - 0.5) * 0.4,
          opacity: Math.random() * 0.5 + 0.2
        });
      }
    }

    // Interactive Click Handler for Holi Splashes
    const handlePointerDown = (e) => {
      if (festivalId !== 'holi') return;
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      // Create a localized bursting splash of 10-14 soft pigment drops
      const splashColor = holiColors[Math.floor(Math.random() * holiColors.length)];
      const drops = [];
      for (let i = 0; i < 12; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3.5 + 1;
        drops.push({
          x: clickX,
          y: clickY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: Math.random() * 4 + 2,
          color: splashColor,
          alpha: 0.85
        });
      }
      interactiveSplashes.push({ drops, life: 1.0 });
    };

    const targetContainer = containerRef?.current || canvas.parentElement;
    if (targetContainer && festivalId === 'holi') {
      targetContainer.addEventListener('pointerdown', handlePointerDown);
    }

    // ── MAIN RENDER LOOP ──
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // If reduced motion, draw static soft elements once and pause
      if (prefersReducedMotion) {
        if (festivalId === 'christmas') {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
          snowFlakes.slice(0, 15).forEach(f => {
            ctx.beginPath();
            ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
            ctx.fill();
          });
        }
        return;
      }

      // ── Christmas Snow Render ──
      if (festivalId === 'christmas') {
        snowFlakes.forEach((f) => {
          f.y += f.speedY;
          f.x += f.speedX + Math.sin(f.swing) * 0.3;
          f.swing += f.swingSpeed;

          if (f.y > height) {
            f.y = -10;
            f.x = Math.random() * width;
          }
          if (f.x > width) f.x = 0;
          if (f.x < 0) f.x = width;

          ctx.beginPath();
          ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${f.opacity})`;
          ctx.shadowBlur = f.radius * 2;
          ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
          ctx.fill();
          ctx.shadowBlur = 0;
        });
      }

      // ── Holi Motes & Interactive Splashes Render ──
      if (festivalId === 'holi') {
        // Ambient dust
        holiMotes.forEach((m) => {
          m.x += m.vx;
          m.y += m.vy;
          if (m.x < 0 || m.x > width) m.vx *= -1;
          if (m.y < 0 || m.y > height) m.vy *= -1;

          ctx.beginPath();
          ctx.arc(m.x, m.y, m.radius, 0, Math.PI * 2);
          ctx.fillStyle = m.color;
          ctx.globalAlpha = m.opacity;
          ctx.fill();
        });

        // Interactive click bursts
        for (let i = interactiveSplashes.length - 1; i >= 0; i--) {
          const splash = interactiveSplashes[i];
          splash.life -= 0.025; // Dissolves smoothly over ~40 frames

          splash.drops.forEach((d) => {
            d.x += d.vx;
            d.y += d.vy;
            d.vx *= 0.94;
            d.vy *= 0.94;
            d.radius *= 0.98;

            ctx.beginPath();
            ctx.arc(d.x, d.y, Math.max(0.5, d.radius), 0, Math.PI * 2);
            ctx.fillStyle = d.color;
            ctx.globalAlpha = d.alpha * Math.max(0, splash.life);
            ctx.fill();
          });

          if (splash.life <= 0) {
            interactiveSplashes.splice(i, 1);
          }
        }
        ctx.globalAlpha = 1.0;
      }

      // ── Diwali Embers Render ──
      if (festivalId === 'diwali') {
        diwaliEmbers.forEach((e) => {
          e.y -= e.speedY;
          e.x += e.speedX;
          e.opacity -= 0.003;

          if (e.y < 0 || e.opacity <= 0) {
            e.y = height + 10;
            e.x = Math.random() * width;
            e.opacity = Math.random() * 0.7 + 0.3;
          }

          ctx.beginPath();
          ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${e.hue}, 95%, 65%, ${e.opacity})`;
          ctx.shadowBlur = 8;
          ctx.shadowColor = `hsla(${e.hue}, 100%, 55%, 0.9)`;
          ctx.fill();
          ctx.shadowBlur = 0;
        });
      }

      // ── Eid Stars Twinkle Render ──
      if (festivalId === 'eid') {
        eidStars.forEach((s) => {
          s.alpha += s.alphaSpeed;
          if (s.alpha >= 0.85 || s.alpha <= 0.15) {
            s.alphaSpeed *= -1;
          }

          ctx.beginPath();
          ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(245, 158, 11, ${s.alpha})`;
          ctx.shadowBlur = 6;
          ctx.shadowColor = 'rgba(251, 191, 36, 0.7)';
          ctx.fill();
          ctx.shadowBlur = 0;
        });
      }

      // ── Tricolor Embers Render ──
      if (festivalId === 'independence_day' || festivalId === 'republic_day') {
        tricolorParticles.forEach((p) => {
          p.y += p.vy;
          p.x += p.vx;
          if (p.y < 0) {
            p.y = height + 5;
            p.x = Math.random() * width;
          }

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.opacity;
          ctx.fill();
        });
        ctx.globalAlpha = 1.0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (targetContainer && festivalId === 'holi') {
        targetContainer.removeEventListener('pointerdown', handlePointerDown);
      }
    };
  }, [isFestivalMode, activeFestival, containerRef]);

  if (!isFestivalMode || !activeFestival) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-10 w-full h-full select-none"
      aria-hidden="true"
    />
  );
}

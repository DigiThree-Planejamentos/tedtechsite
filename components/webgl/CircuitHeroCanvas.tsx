'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/components/motion/useReducedMotion';
import { capDPR } from '@/lib/glContext';

type Star = {
  x: number;
  y: number;
  r: number;
  chip: boolean;
  phase: number;
  tw: number; // twinkle speed
};
type Filament = { a: number; b: number; d: number };
type Flow = { fil: number; pos: number; speed: number };
type Pulse = { x: number; y: number; t: number };

const LINK_DIST = 128; // px — how far filaments reach between stars
const MAX_LINKS = 4; // filaments per star
const PULSE_SPEED = 560; // px/s the click ripple expands
const PULSE_LIFE = 1.7; // s

/**
 * Hero backdrop: a dense night sky where the "stars" are metallic transistor
 * pads and the constellation lines are circuit filaments, with current pulses
 * running along the wires. Clicking sends an energy ripple that lights up the
 * transistors/filaments it crosses. Transparent canvas — the dark sky is the
 * section background. Runs on desktop and touch laptops; only reduced-motion
 * (or SSR) opts out.
 */
export default function CircuitHeroCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || typeof window === 'undefined') return;
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = capDPR();
    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = true;
    const mouse = { x: -9999, y: -9999 };
    const pulses: Pulse[] = [];
    let stars: Star[] = [];
    let filaments: Filament[] = [];
    let flows: Flow[] = [];

    const rand = (min: number, max: number) => min + Math.random() * (max - min);

    const build = () => {
      stars = [];
      filaments = [];
      const area = w * h;
      const count = Math.max(70, Math.min(280, Math.round(area / 5200)));
      for (let i = 0; i < count; i++) {
        const chip = Math.random() < 0.22;
        stars.push({
          x: rand(0, w),
          y: rand(0, h),
          r: chip ? rand(2.8, 4.2) : rand(1, 2.2),
          chip,
          phase: rand(0, Math.PI * 2),
          tw: rand(0.6, 1.8),
        });
      }
      // Connect each star to its nearest neighbours within LINK_DIST (dedup).
      const seen = new Set<number>();
      for (let i = 0; i < stars.length; i++) {
        const near: Filament[] = [];
        for (let j = 0; j < stars.length; j++) {
          if (i === j) continue;
          const d = Math.hypot(stars[i].x - stars[j].x, stars[i].y - stars[j].y);
          if (d < LINK_DIST) near.push({ a: i, b: j, d });
        }
        near.sort((p, q) => p.d - q.d);
        for (let k = 0; k < Math.min(MAX_LINKS, near.length); k++) {
          const f = near[k];
          const key = Math.min(f.a, f.b) * 100000 + Math.max(f.a, f.b);
          if (seen.has(key)) continue;
          seen.add(key);
          filaments.push(f);
        }
      }
      flows = [];
      const flowCount = Math.min(26, Math.max(10, Math.floor(filaments.length / 18)));
      for (let k = 0; k < flowCount && filaments.length; k++) {
        flows.push({
          fil: Math.floor(Math.random() * filaments.length),
          pos: Math.random(),
          speed: rand(0.14, 0.5),
        });
      }
    };

    const litAt = (x: number, y: number): number => {
      let lit = 0;
      const dm = Math.hypot(x - mouse.x, y - mouse.y);
      if (dm < 170) lit = Math.max(lit, (1 - dm / 170) * 0.65);
      for (const p of pulses) {
        const radius = p.t * PULSE_SPEED;
        const ring = Math.abs(Math.hypot(x - p.x, y - p.y) - radius);
        if (ring < 52) lit = Math.max(lit, (1 - ring / 52) * (1 - p.t / PULSE_LIFE));
      }
      return Math.min(lit, 1);
    };

    const resize = () => {
      w = canvas.clientWidth || window.innerWidth;
      h = canvas.clientHeight || window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    const onDown = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const y = e.clientY - r.top;
      if (y < 0 || y > h) return;
      pulses.push({ x: e.clientX - r.left, y, t: 0 });
    };

    let last = performance.now();
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible || document.hidden) {
        last = now;
        return;
      }
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const time = now * 0.001;

      for (let i = pulses.length - 1; i >= 0; i--) {
        pulses[i].t += dt;
        if (pulses[i].t > PULSE_LIFE) pulses.splice(i, 1);
      }

      ctx.clearRect(0, 0, w, h);
      ctx.lineCap = 'round';

      // Filaments (constellation wires)
      for (const f of filaments) {
        const a = stars[f.a];
        const b = stars[f.b];
        const fade = 1 - f.d / LINK_DIST; // closer = stronger
        const lit = litAt((a.x + b.x) / 2, (a.y + b.y) / 2);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        if (lit > 0.03) {
          ctx.strokeStyle = `rgba(120, 205, 255, ${0.18 + lit * 0.8})`;
          ctx.lineWidth = 1.4;
        } else {
          ctx.strokeStyle = `rgba(130, 160, 190, ${0.1 + fade * 0.16})`;
          ctx.lineWidth = 1;
        }
        ctx.stroke();
      }

      // Current pulses running along the filaments
      for (const fl of flows) {
        fl.pos += fl.speed * dt;
        if (fl.pos > 1) {
          fl.pos = 0;
          fl.fil = Math.floor(Math.random() * filaments.length);
        }
        const f = filaments[fl.fil];
        if (!f) continue;
        const a = stars[f.a];
        const b = stars[f.b];
        const px = a.x + (b.x - a.x) * fl.pos;
        const py = a.y + (b.y - a.y) * fl.pos;
        const grad = ctx.createRadialGradient(px, py, 0, px, py, 5);
        grad.addColorStop(0, 'rgba(190, 236, 255, 0.95)');
        grad.addColorStop(1, 'rgba(30, 158, 219, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(px, py, 5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Stars / transistor pads
      for (const s of stars) {
        const twinkle = 0.55 + 0.45 * Math.sin(time * s.tw + s.phase);
        const g = litAt(s.x, s.y);
        const bright = Math.min(1, twinkle * 0.75 + g);
        if (s.chip) {
          const size = s.r * 2;
          ctx.fillStyle = `rgba(155, 178, 202, ${0.34 + bright * 0.5})`;
          ctx.fillRect(s.x - s.r, s.y - s.r, size, size);
          ctx.lineWidth = 1.2;
          ctx.strokeStyle = `rgba(30, 158, 219, ${0.5 + g * 0.5})`;
          ctx.strokeRect(s.x - s.r, s.y - s.r, size, size);
          if (g > 0.04) {
            ctx.fillStyle = `rgba(127, 208, 245, ${g * 0.9})`;
            ctx.fillRect(s.x - s.r, s.y - s.r, size, size);
          }
        } else {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(180, 205, 230, ${0.42 + bright * 0.5})`;
          ctx.fill();
          if (bright > 0.55 || g > 0.1) {
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r + 2.8, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(30, 158, 219, ${Math.max(g, bright - 0.55) * 0.45})`;
            ctx.fill();
          }
        }
      }
    };

    try {
      resize();
      window.addEventListener('resize', resize);
      window.addEventListener('pointermove', onMove, { passive: true });
      window.addEventListener('pointerdown', onDown, { passive: true });
      canvas.addEventListener('pointerleave', onLeave);
      const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting), {
        threshold: 0,
      });
      io.observe(canvas);
      raf = requestAnimationFrame(frame);

      return () => {
        cancelAnimationFrame(raf);
        window.removeEventListener('resize', resize);
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerdown', onDown);
        canvas.removeEventListener('pointerleave', onLeave);
        io.disconnect();
      };
    } catch {
      cancelAnimationFrame(raf);
      return;
    }
  }, [reduced]);

  return (
    <canvas
      ref={ref}
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
      aria-hidden
    />
  );
}

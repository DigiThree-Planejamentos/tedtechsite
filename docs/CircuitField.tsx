'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';

/**
 * Standalone reusable version of the TedTech circuit background.
 *
 * Usage in a Next/React app:
 *
 *   import { CircuitField } from './CircuitField';
 *
 *   export default function AppLayout({ children }) {
 *     return (
 *       <>
 *         <CircuitField openWhileId="hero" edgeWidth={200} zIndex={-1} />
 *         {children}
 *       </>
 *     );
 *   }
 *
 * Notes:
 * - Add `id="hero"` to the first hero section if you want the field to start
 *   full-screen and shrink into left/right edge bands after the hero.
 * - Set `edgeWidth={null}` to keep the circuit field full-screen everywhere.
 * - Keep the page/background dark enough for the thin circuit lines to read.
 */
export function CircuitField({
  edgeWidth = 200,
  openWhileId = 'hero',
  maxDpr = 2,
  zIndex = -1,
  respectReducedMotion = true,
  className,
  style,
}: CircuitFieldProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion(respectReducedMotion);

  useEffect(() => {
    if (reduced || typeof window === 'undefined') return;
    const canvas = ref.current;
    if (!canvas) return;

    return mountCircuit(canvas, {
      edgeWidth: edgeWidth ?? undefined,
      openWhileId: openWhileId ?? undefined,
      maxDpr,
    });
  }, [edgeWidth, maxDpr, openWhileId, reduced]);

  if (reduced) return null;

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={className}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        display: 'block',
        ...style,
      }}
    />
  );
}

export type CircuitFieldProps = {
  /**
   * Closed-state width of each side band in pixels.
   * Set null to keep the field full-width everywhere.
   */
  edgeWidth?: number | null;
  /**
   * Section id that controls the full-width-to-edge transition.
   * While this section is in view, the field stays more open.
   */
  openWhileId?: string | null;
  /** Caps canvas DPR to protect performance on high-density displays. */
  maxDpr?: number;
  /** Fixed canvas z-index. Use a positive value if your layout hides negative layers. */
  zIndex?: number;
  /** Disable the animation for users who prefer reduced motion. */
  respectReducedMotion?: boolean;
  className?: string;
  style?: CSSProperties;
};

type Star = {
  x: number;
  y: number;
  z: number;
  r: number;
  chip: boolean;
  phase: number;
  tw: number;
  kickX: number;
  kickY: number;
  kickVX: number;
  kickVY: number;
};

type Filament = { a: number; b: number; d: number };
type Flow = { fil: number; pos: number; speed: number };
type Pulse = { x: number; y: number; t: number };
type Hold = { active: boolean; start: number };

type CircuitEngineOptions = {
  edgeWidth?: number;
  openWhileId?: string;
  maxDpr?: number;
};

const LINK_DIST = 128;
const MAX_LINKS = 4;
const PULSE_SPEED = 560;
const PULSE_LIFE = 1.7;
const TILT_STRENGTH = 26;
const DRIFT_STRENGTH = 11;
const HOLD_RADIUS = 260;
const HOLD_CHARGE_TIME = 1.0;
const HOLD_FORCE = 2800;
const BURST_BASE = 90;
const BURST_MAX = 320;
const MIN_HOLD_FOR_BURST = 0.12;
const KICK_SPRING_K = 36;
const KICK_SPRING_DAMPING = 11;
const BREAK_STRETCH_FACTOR = 1.5;
const OPEN_FADE_ZONE = 90;

function usePrefersReducedMotion(enabled: boolean) {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      setReduced(false);
      return;
    }

    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    update();

    if (typeof query.addEventListener === 'function') {
      query.addEventListener('change', update);
      return () => query.removeEventListener('change', update);
    }

    query.addListener(update);
    return () => query.removeListener(update);
  }, [enabled]);

  return reduced;
}

function capDpr(maxDpr: number) {
  if (typeof window === 'undefined') return 1;
  return Math.min(window.devicePixelRatio || 1, maxDpr);
}

function mountCircuit(canvas: HTMLCanvasElement, options: CircuitEngineOptions = {}) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return () => {};

  const dpr = capDpr(options.maxDpr ?? 2);
  let w = 0;
  let h = 0;
  let raf = 0;
  let resizeRaf = 0;
  let visible = true;

  const mouse = { x: -9999, y: -9999, active: false };
  const pulses: Pulse[] = [];
  const hold: Hold = { active: false, start: 0 };

  let stars: Star[] = [];
  let filaments: Filament[] = [];
  let flows: Flow[] = [];
  let disp: Array<{ x: number; y: number }> = [];
  let vis: number[] = [];

  const heroEl =
    options.openWhileId && typeof document !== 'undefined'
      ? document.getElementById(options.openWhileId)
      : null;

  const rand = (min: number, max: number) => min + Math.random() * (max - min);
  const hasEdgeMode = typeof options.edgeWidth === 'number';

  const openness = () => {
    if (!hasEdgeMode) return 1;
    if (!heroEl) return 0;
    const vh = window.innerHeight || h;
    return Math.max(0, Math.min(1, heroEl.getBoundingClientRect().bottom / vh));
  };

  const build = () => {
    stars = [];
    filaments = [];

    const area = w * h;
    const count = Math.max(70, Math.min(280, Math.round(area / 5200)));

    for (let i = 0; i < count; i += 1) {
      const z = rand(0, 1);
      const chip = Math.random() < 0.22;

      stars.push({
        x: rand(0, w),
        y: rand(0, h),
        z,
        r: (chip ? rand(2.6, 3.8) : rand(0.9, 2)) * (0.55 + z * 0.85),
        chip,
        phase: rand(0, Math.PI * 2),
        tw: rand(0.6, 1.8),
        kickX: 0,
        kickY: 0,
        kickVX: 0,
        kickVY: 0,
      });
    }

    const seen = new Set<number>();

    for (let i = 0; i < stars.length; i += 1) {
      const near: Filament[] = [];

      for (let j = 0; j < stars.length; j += 1) {
        if (i === j) continue;
        const d = Math.hypot(stars[i].x - stars[j].x, stars[i].y - stars[j].y);
        if (d < LINK_DIST) near.push({ a: i, b: j, d });
      }

      near.sort((p, q) => p.d - q.d);

      for (let k = 0; k < Math.min(MAX_LINKS, near.length); k += 1) {
        const f = near[k];
        const key = Math.min(f.a, f.b) * 100000 + Math.max(f.a, f.b);
        if (seen.has(key)) continue;
        seen.add(key);
        filaments.push(f);
      }
    }

    flows = [];
    const flowCount = Math.min(26, Math.max(10, Math.floor(filaments.length / 18)));

    for (let k = 0; k < flowCount && filaments.length; k += 1) {
      flows.push({
        fil: Math.floor(Math.random() * filaments.length),
        pos: Math.random(),
        speed: rand(0.14, 0.5),
      });
    }

    disp = stars.map((s) => ({ x: s.x, y: s.y }));
    vis = stars.map(() => 1);
  };

  const litAt = (x: number, y: number) => {
    let lit = 0;

    if (mouse.active) {
      const dm = Math.hypot(x - mouse.x, y - mouse.y);
      if (dm < 170) lit = Math.max(lit, (1 - dm / 170) * 0.65);
    }

    for (const p of pulses) {
      const radius = p.t * PULSE_SPEED;
      const ring = Math.abs(Math.hypot(x - p.x, y - p.y) - radius);
      if (ring < 52) lit = Math.max(lit, (1 - ring / 52) * (1 - p.t / PULSE_LIFE));
    }

    return Math.min(lit, 1);
  };

  const applyOutwardForce = (
    x: number,
    y: number,
    force: number,
    perSecond: boolean,
    dt: number,
  ) => {
    for (const s of stars) {
      const px = s.x + s.kickX;
      const py = s.y + s.kickY;
      const dx = px - x;
      const dy = py - y;
      const dist = Math.hypot(dx, dy) || 0.0001;

      if (dist >= HOLD_RADIUS) continue;

      const falloff = 1 - dist / HOLD_RADIUS;
      const applied = force * falloff * (perSecond ? dt : 1);
      s.kickVX += (dx / dist) * applied;
      s.kickVY += (dy / dist) * applied;
    }
  };

  const resize = () => {
    w = canvas.clientWidth || window.innerWidth;
    h = canvas.clientHeight || window.innerHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    build();
  };

  const scheduleResize = () => {
    cancelAnimationFrame(resizeRaf);
    resizeRaf = requestAnimationFrame(resize);
  };

  const onMove = (event: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;
    mouse.active = true;
  };

  const onLeave = () => {
    mouse.active = false;
  };

  const onDown = (event: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (y < 0 || y > h) return;

    mouse.x = x;
    mouse.y = y;
    mouse.active = true;
    pulses.push({ x, y, t: 0 });
    hold.active = true;
    hold.start = performance.now();
  };

  const onUp = () => {
    if (!hold.active) return;

    hold.active = false;
    const elapsed = (performance.now() - hold.start) / 1000;

    if (elapsed < MIN_HOLD_FOR_BURST) return;

    const charge = Math.min(1, elapsed / HOLD_CHARGE_TIME);
    applyOutwardForce(mouse.x, mouse.y, BURST_BASE + charge * BURST_MAX, false, 0);
    pulses.push({ x: mouse.x, y: mouse.y, t: 0 });
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

    for (let i = pulses.length - 1; i >= 0; i -= 1) {
      pulses[i].t += dt;
      if (pulses[i].t > PULSE_LIFE) pulses.splice(i, 1);
    }

    if (hold.active) {
      const charge = Math.min(1, (now - hold.start) / 1000 / HOLD_CHARGE_TIME);
      applyOutwardForce(mouse.x, mouse.y, HOLD_FORCE * (0.25 + charge * 0.75), true, dt);
    }

    for (const s of stars) {
      const ax = -KICK_SPRING_K * s.kickX - KICK_SPRING_DAMPING * s.kickVX;
      const ay = -KICK_SPRING_K * s.kickY - KICK_SPRING_DAMPING * s.kickVY;
      s.kickVX += ax * dt;
      s.kickVY += ay * dt;
      s.kickX += s.kickVX * dt;
      s.kickY += s.kickVY * dt;
    }

    const nx = mouse.active ? Math.max(-1, Math.min(1, (mouse.x / w) * 2 - 1)) : 0;
    const ny = mouse.active ? Math.max(-1, Math.min(1, (mouse.y / h) * 2 - 1)) : 0;
    const driftX = Math.sin(time * 0.15) * DRIFT_STRENGTH;
    const driftY = Math.cos(time * 0.12) * DRIFT_STRENGTH * 0.6;
    const bandWidth = hasEdgeMode ? Math.min(options.edgeWidth ?? 0, w * 0.18) : w / 2;
    const openCap = w / 2 + OPEN_FADE_ZONE;
    const revealWidth = bandWidth + openness() * (openCap - bandWidth);

    for (let i = 0; i < stars.length; i += 1) {
      const s = stars[i];
      const ox = driftX * s.z + nx * TILT_STRENGTH * s.z;
      const oy = driftY * s.z + ny * TILT_STRENGTH * s.z * 0.7;
      disp[i].x = s.x + ox + s.kickX;
      disp[i].y = s.y + oy + s.kickY;

      const edgeDist = Math.min(disp[i].x, w - disp[i].x);
      vis[i] = Math.max(0, Math.min(1, (revealWidth - edgeDist) / OPEN_FADE_ZONE));
    }

    ctx.clearRect(0, 0, w, h);
    ctx.lineCap = 'round';

    for (const f of filaments) {
      const a = disp[f.a];
      const b = disp[f.b];
      const filVis = Math.min(vis[f.a], vis[f.b]);

      if (filVis < 0.02) continue;

      const stretch = Math.hypot(b.x - a.x, b.y - a.y);
      if (stretch > f.d * BREAK_STRETCH_FACTOR) continue;

      const depth = (stars[f.a].z + stars[f.b].z) / 2;
      const fade = 1 - f.d / LINK_DIST;
      const lit = litAt((a.x + b.x) / 2, (a.y + b.y) / 2);

      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);

      if (lit > 0.03) {
        ctx.strokeStyle = `rgba(120, 205, 255, ${
          (0.18 + lit * 0.8) * (0.5 + depth * 0.5) * filVis
        })`;
        ctx.lineWidth = 1 + depth * 0.8;
      } else {
        ctx.strokeStyle = `rgba(130, 160, 190, ${
          (0.06 + fade * 0.14) * (0.4 + depth * 0.7) * filVis
        })`;
        ctx.lineWidth = 0.7 + depth * 0.6;
      }

      ctx.stroke();
    }

    for (const fl of flows) {
      fl.pos += fl.speed * dt;

      if (fl.pos > 1) {
        fl.pos = 0;
        fl.fil = Math.floor(Math.random() * filaments.length);
      }

      const f = filaments[fl.fil];
      if (!f) continue;

      const flowVis = Math.min(vis[f.a], vis[f.b]);
      if (flowVis < 0.02) continue;

      const a = disp[f.a];
      const b = disp[f.b];
      if (Math.hypot(b.x - a.x, b.y - a.y) > f.d * BREAK_STRETCH_FACTOR) continue;

      const depth = (stars[f.a].z + stars[f.b].z) / 2;
      const px = a.x + (b.x - a.x) * fl.pos;
      const py = a.y + (b.y - a.y) * fl.pos;
      const size = 3.5 + depth * 3;
      const grad = ctx.createRadialGradient(px, py, 0, px, py, size);

      grad.addColorStop(0, `rgba(190, 236, 255, ${0.95 * flowVis})`);
      grad.addColorStop(1, 'rgba(30, 158, 219, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(px, py, size, 0, Math.PI * 2);
      ctx.fill();
    }

    for (let i = 0; i < stars.length; i += 1) {
      const s = stars[i];
      const v = vis[i];

      if (v < 0.02) continue;

      const p = disp[i];
      const twinkle = 0.55 + 0.45 * Math.sin(time * s.tw + s.phase);
      const g = litAt(p.x, p.y);
      const depthAlpha = (0.32 + s.z * 0.68) * v;
      const bright = Math.min(1, (twinkle * 0.75 + g) * depthAlpha);

      if (s.chip) {
        const size = s.r * 2;
        ctx.fillStyle = `rgba(155, 178, 202, ${(0.34 + bright * 0.5) * depthAlpha})`;
        ctx.fillRect(p.x - s.r, p.y - s.r, size, size);
        ctx.lineWidth = 1 + s.z * 0.6;
        ctx.strokeStyle = `rgba(30, 158, 219, ${(0.3 + g * 0.6 + s.z * 0.25) * v})`;
        ctx.strokeRect(p.x - s.r, p.y - s.r, size, size);

        if (g > 0.04) {
          ctx.fillStyle = `rgba(127, 208, 245, ${g * 0.9 * v})`;
          ctx.fillRect(p.x - s.r, p.y - s.r, size, size);
        }
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180, 205, 230, ${(0.3 + bright * 0.55) * v})`;
        ctx.fill();

        if (bright > 0.5 || g > 0.1) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, s.r + 2.2 + s.z * 2.4, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(30, 158, 219, ${
            Math.max(g, bright - 0.5) * (0.35 + s.z * 0.35) * v
          })`;
          ctx.fill();
        }
      }

      if (s.z > 0.72) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, s.r + 5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(90, 190, 255, ${(s.z - 0.72) * 0.28 * v})`;
        ctx.fill();
      }
    }
  };

  let ro: ResizeObserver | undefined;
  let io: IntersectionObserver | undefined;

  try {
    resize();

    window.addEventListener('resize', scheduleResize);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    window.addEventListener('pointercancel', onUp, { passive: true });
    canvas.addEventListener('pointerleave', onLeave);

    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(scheduleResize);
      ro.observe(canvas);
    }

    if (typeof IntersectionObserver !== 'undefined') {
      io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
      });
      io.observe(canvas);
    }

    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(resizeRaf);
      window.removeEventListener('resize', scheduleResize);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      canvas.removeEventListener('pointerleave', onLeave);
      ro?.disconnect();
      io?.disconnect();
    };
  } catch {
    cancelAnimationFrame(raf);
    cancelAnimationFrame(resizeRaf);
    ro?.disconnect();
    io?.disconnect();
    return () => {};
  }
}

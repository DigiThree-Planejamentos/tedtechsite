'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/components/motion/useReducedMotion';
import { mountCircuit } from './circuitEngine';

/**
 * Full-bleed circuit/starfield backdrop for the hero section. See
 * `circuitEngine.ts` for the simulation; this component just owns the canvas
 * element and lifecycle. Runs on desktop and touch laptops; only
 * reduced-motion (or SSR) opts out.
 */
export default function CircuitHeroCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || typeof window === 'undefined') return;
    const canvas = ref.current;
    if (!canvas) return;
    return mountCircuit(canvas);
  }, [reduced]);

  return (
    <canvas
      ref={ref}
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
      aria-hidden
    />
  );
}

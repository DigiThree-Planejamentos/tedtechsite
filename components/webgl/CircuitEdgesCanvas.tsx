'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/components/motion/useReducedMotion';
import { mountCircuit } from './circuitEngine';

const EDGE_WIDTH = 200; // px band width per side, capped further to 18% of viewport in the engine

/**
 * The single site-wide circuit/starfield: one field, pinned to the viewport
 * (fixed) from the very first paint. It fills the whole canvas while the
 * hero fills the screen, then breathes down to left/right edge bands as the
 * hero scrolls past — same star field throughout, just a live scroll-driven
 * width mask, so the hero backdrop and the border read as one continuous
 * sequence rather than two separate simulations.
 */
export default function CircuitEdgesCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || typeof window === 'undefined') return;
    const canvas = ref.current;
    if (!canvas) return;

    return mountCircuit(canvas, { edgeWidth: EDGE_WIDTH, openWhileId: 'hero' });
  }, [reduced]);

  return (
    <canvas
      ref={ref}
      className="pointer-events-none fixed inset-0 -z-10 h-screen w-screen"
      aria-hidden
    />
  );
}

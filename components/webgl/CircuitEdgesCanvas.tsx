'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/components/motion/useReducedMotion';
import { mountCircuit } from './circuitEngine';

const EDGE_WIDTH = 200; // px band width per side, capped further to 18% of viewport in the engine

/**
 * Site-wide circuit border: the same starfield/filament simulation as the
 * hero, but constrained to left/right edge bands and pinned to the viewport
 * (fixed) so it reads as a persistent frame from the very first paint,
 * including behind the hero, and stays put while scrolling through the rest
 * of the page.
 */
export default function CircuitEdgesCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || typeof window === 'undefined') return;
    const canvas = ref.current;
    if (!canvas) return;

    return mountCircuit(canvas, { edgeWidth: EDGE_WIDTH });
  }, [reduced]);

  return (
    <canvas
      ref={ref}
      className="pointer-events-none fixed inset-0 -z-10 h-screen w-screen"
      aria-hidden
    />
  );
}

'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/components/motion/useReducedMotion';
import { mountCircuit } from './circuitEngine';

/**
 * Site-wide circuit/starfield pinned to the viewport. It fills the whole
 * canvas behind every transparent dark section.
 */
export default function CircuitEdgesCanvas() {
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
      className="pointer-events-none fixed inset-0 -z-10 h-screen w-screen"
      aria-hidden
    />
  );
}

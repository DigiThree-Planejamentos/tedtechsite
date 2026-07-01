'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/components/motion/useReducedMotion';

/**
 * A light overlay that pulses when the hero is clicked (pairs with the particle
 * "hold to blast"). Sits behind the hero text, so it lights the background
 * without washing out the copy. Off under reduced motion.
 */
export function HeroClickFlash() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    const section = el.closest('section');
    if (!section) return;

    const onDown = () => {
      el.style.transition = 'none';
      el.style.opacity = '0.9';
      requestAnimationFrame(() => {
        el.style.transition = 'opacity 0.6s ease';
        el.style.opacity = '0';
      });
    };

    section.addEventListener('pointerdown', onDown);
    return () => section.removeEventListener('pointerdown', onDown);
  }, [reduced]);

  return <div ref={ref} className="hero-flash pointer-events-none absolute inset-0 z-0" aria-hidden />;
}

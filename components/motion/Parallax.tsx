'use client';

import { useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useReducedMotion } from './useReducedMotion';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Scroll-scrubbed parallax translate. `speed` is a fraction of the element's
 * travel (0.2 ≈ subtle). No movement under reduced motion.
 */
export function Parallax({
  speed = 0.2,
  axis = 'y',
  className,
  children,
}: {
  speed?: number;
  axis?: 'y' | 'x';
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      const el = ref.current;
      if (!el) return;
      const distance = 100 * speed;
      const prop = axis === 'y' ? 'yPercent' : 'xPercent';
      gsap.fromTo(
        el,
        { [prop]: -distance },
        {
          [prop]: distance,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
        },
      );
    },
    { dependencies: [reduced, speed, axis], scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

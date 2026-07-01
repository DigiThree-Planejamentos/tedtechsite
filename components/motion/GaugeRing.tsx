'use client';

import { useRef, type CSSProperties, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useReducedMotion } from './useReducedMotion';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * The conic-gradient gauge ring (see `.gauge` in globals.css) whose `--val`
 * fills 0→100 when scrolled into view. Full and static under reduced motion.
 */
export function GaugeRing({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      const el = ref.current;
      if (!el) return;
      const state = { v: 0 };
      gsap.to(state, {
        v: 100,
        duration: 1.6,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 75%', once: true },
        onUpdate: () => el.style.setProperty('--val', String(state.v)),
      });
    },
    { dependencies: [reduced], scope: ref },
  );

  return (
    <div ref={ref} className="gauge relative" style={{ ['--val' as string]: reduced ? 100 : 0 } as CSSProperties}>
      {children}
    </div>
  );
}

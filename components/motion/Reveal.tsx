'use client';

import { createElement, useRef, type ElementType, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useReducedMotion } from './useReducedMotion';
import { duration, REVEAL_START } from '@/lib/motion';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Fade/blur/rise reveal on scroll-in. When `stagger` is set, the element's
 * direct children animate in sequence (grids/lists). Under reduced motion the
 * content renders visible with no animation.
 */
export function Reveal({
  as = 'div',
  y = 24,
  blur = 8,
  stagger,
  className,
  children,
}: {
  as?: ElementType;
  y?: number;
  blur?: number;
  stagger?: number;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      const el = ref.current;
      if (!el) return;
      const targets: Element | Element[] =
        stagger != null ? Array.from(el.children) : el;

      gsap.set(targets, { autoAlpha: 0, y, filter: blur ? `blur(${blur}px)` : 'none' });
      gsap.to(targets, {
        autoAlpha: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: duration.base,
        ease: 'power3.out',
        stagger: stagger ?? 0,
        scrollTrigger: {
          trigger: el,
          start: REVEAL_START,
          end: 'bottom top',
          once: true,
          toggleActions: 'play none none none',
        },
      });
    },
    { dependencies: [reduced], scope: ref },
  );

  return createElement(as, { ref, className }, children);
}

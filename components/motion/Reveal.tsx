'use client';

import { createElement, useRef, type ElementType, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useReducedMotion } from './useReducedMotion';
import {
  ARRIVAL_BRIGHTNESS_FROM,
  ARRIVAL_SCALE_FROM,
  duration,
  REVEAL_START,
  REVEAL_TOGGLE,
} from '@/lib/motion';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Reveal on scroll-in. When `stagger` is set, the element's direct children
 * animate in sequence (grids/lists). Under reduced motion the content
 * renders visible with no animation.
 *
 * `variant="arrival"` (default) grows/sharpens/brightens content into place
 * like a near star in the circuit field, and reverses the same way when you
 * scroll back up. `variant="simple"` is the plain fade/blur/rise, played
 * once — for content that shouldn't echo the space-journey motion (footer).
 */
export function Reveal({
  as = 'div',
  y = 24,
  blur = 8,
  stagger,
  variant = 'arrival',
  className,
  children,
}: {
  as?: ElementType;
  y?: number;
  blur?: number;
  stagger?: number;
  variant?: 'arrival' | 'simple';
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
      const arrival = variant === 'arrival';

      gsap.set(targets, {
        autoAlpha: 0,
        y,
        scale: arrival ? ARRIVAL_SCALE_FROM : 1,
        filter: arrival
          ? `blur(${blur}px) brightness(${ARRIVAL_BRIGHTNESS_FROM})`
          : blur
            ? `blur(${blur}px)`
            : 'none',
      });
      gsap.to(targets, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        filter: arrival ? 'blur(0px) brightness(1)' : 'blur(0px)',
        duration: duration.base,
        ease: 'power3.out',
        stagger: stagger ?? 0,
        scrollTrigger: {
          trigger: el,
          start: REVEAL_START,
          end: 'bottom top',
          // Sem isso, um scroll rapido (tecla End, arrastar a barra, fling no
          // trackpad) pode pular a janela start->end inteira num so frame.
          // Para variant="simple" (footer) isso e fatal: once:true mata o
          // trigger e o elemento fica preso em opacity:0 pra sempre.
          fastScrollEnd: true,
          ...(arrival
            ? { toggleActions: REVEAL_TOGGLE }
            : { once: true, toggleActions: 'play none none none' }),
        },
      });
    },
    { dependencies: [reduced, variant], scope: ref },
  );

  return createElement(as, { ref, className }, children);
}

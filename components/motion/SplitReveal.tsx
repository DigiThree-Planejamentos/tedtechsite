'use client';

import { createElement, useRef, type ElementType, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';
import { useReducedMotion } from './useReducedMotion';
import { useReady } from '@/components/providers/ReadyContext';
import { duration, stagger as staggerSteps, REVEAL_START } from '@/lib/motion';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

type SplitKind = 'lines' | 'words' | 'chars';

/**
 * Reveals text with a masked split-text rise. `trigger="scroll"` (default)
 * fires on scroll-in; `trigger="ready"` waits for the preloader curtain.
 * Reverts the split on cleanup so the original text nodes are restored (SEO).
 * Under reduced motion it renders the plain element — no split, no animation.
 */
export function SplitReveal({
  as = 'div',
  type = 'lines',
  trigger = 'scroll',
  stagger = staggerSteps.base,
  className,
  children,
}: {
  as?: ElementType;
  type?: SplitKind;
  trigger?: 'scroll' | 'ready';
  stagger?: number;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();
  const ready = useReady();

  useGSAP(
    () => {
      if (reduced) return;
      const el = ref.current;
      if (!el) return;
      if (trigger === 'ready' && !ready) return;

      const split = new SplitText(el, {
        type,
        mask: type === 'lines' ? 'lines' : undefined,
        linesClass: 'split-line',
      });
      const targets = split[type] as Element[] | undefined;
      if (!targets || targets.length === 0) return;

      gsap.set(targets, { yPercent: type === 'lines' ? 110 : 60, opacity: type === 'lines' ? 1 : 0 });
      const tween = gsap.to(targets, {
        yPercent: 0,
        opacity: 1,
        duration: duration.slow,
        ease: 'power4.out',
        stagger,
        ...(trigger === 'scroll'
          ? {
              scrollTrigger: {
                trigger: el,
                start: REVEAL_START,
                end: 'bottom top',
                once: true,
                toggleActions: 'play none none none',
              },
            }
          : {}),
      });

      return () => {
        const st = (tween as { scrollTrigger?: { kill: () => void } }).scrollTrigger;
        st?.kill();
        tween.kill();
        split.revert();
      };
    },
    { dependencies: [reduced, ready, trigger, type], scope: ref },
  );

  return createElement(as, { ref, className }, children);
}

'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/components/motion/useReducedMotion';
import { useIsTouch } from '@/components/motion/useIsTouch';

/**
 * Custom cursor: a solid dot that tracks the pointer 1:1 and a lerped ring that
 * grows over interactive elements. Desktop / fine-pointer only; disabled under
 * reduced motion and on touch (native cursor stays). Purely decorative.
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const touch = useIsTouch();

  useEffect(() => {
    if (reduced || touch || typeof window === 'undefined') return;
    if (typeof window.matchMedia === 'function' && !window.matchMedia('(pointer: fine)').matches) {
      return;
    }
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const root = document.documentElement;
    root.classList.add('has-custom-cursor');

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
    };
    const onOver = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      const interactive = target?.closest?.(
        'a, button, [role="button"], input, [data-cursor="hover"]',
      );
      ring.dataset.hover = interactive ? 'true' : 'false';
    };
    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerover', onOver, { passive: true });
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onOver);
      root.classList.remove('has-custom-cursor');
    };
  }, [reduced, touch]);

  if (reduced || touch) return null;
  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden />
      <div ref={ringRef} className="cursor-ring" data-hover="false" aria-hidden />
    </>
  );
}

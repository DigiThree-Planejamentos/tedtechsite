'use client';

import { useRef, type PointerEvent, type ReactNode } from 'react';
import gsap from 'gsap';
import { useReducedMotion } from './useReducedMotion';
import { useIsTouch } from './useIsTouch';

/**
 * Wraps an interactive element (e.g. a `Button` link) and pulls it toward the
 * pointer within `radius`. Wrapper only — it never alters the inner `<a href>`,
 * so CTA links/tests keep working. No effect under reduced motion or on touch.
 */
export function MagneticButton({
  strength = 0.4,
  radius = 120,
  className,
  children,
}: {
  strength?: number;
  radius?: number;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const reduced = useReducedMotion();
  const touch = useIsTouch();

  const inner = () => ref.current?.firstElementChild as HTMLElement | null;

  const onMove = (e: PointerEvent<HTMLSpanElement>) => {
    if (reduced || touch) return;
    const el = ref.current;
    const target = inner();
    if (!el || !target) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    const dist = Math.hypot(relX, relY);
    if (dist > radius) {
      gsap.to(target, { x: 0, y: 0, duration: 0.4, ease: 'power3.out' });
      return;
    }
    gsap.to(target, { x: relX * strength, y: relY * strength, duration: 0.4, ease: 'power3.out' });
  };

  const onLeave = () => {
    const target = inner();
    if (!target) return;
    gsap.to(target, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
  };

  return (
    <span
      ref={ref}
      className={`inline-block${className ? ` ${className}` : ''}`}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {children}
    </span>
  );
}

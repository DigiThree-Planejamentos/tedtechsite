'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Intro overlay: counts 0→100, then lifts a curtain and emits `app:ready`
 * (which releases above-the-fold reveals) and refreshes ScrollTrigger.
 * Intentionally does NOT lock scroll — the full-screen overlay already hides
 * the page, and not touching Lenis avoids any chance of leaving scroll stuck.
 * The overlay sits above already-present HTML, so crawlers/no-JS keep the
 * content underneath. Reduced-motion users skip straight to the finished state.
 */
export function Preloader({ onComplete }: { onComplete?: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    let killed = false;

    const finish = () => {
      if (typeof window !== 'undefined') window.dispatchEvent(new Event('app:ready'));
      ScrollTrigger.refresh();
      onCompleteRef.current?.();
    };

    const prefersReduced =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const root = rootRef.current;

    if (prefersReduced || typeof window === 'undefined') {
      if (root) gsap.set(root, { autoAlpha: 0 });
      finish();
      return;
    }

    const counter = counterRef.current;
    const state = { v: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        if (!killed) finish();
      },
    });
    tl.to(state, {
      v: 100,
      duration: 0.9,
      ease: 'power2.out',
      onUpdate: () => {
        if (counter) counter.textContent = String(Math.round(state.v)).padStart(2, '0');
      },
    });
    if (root) {
      tl.set(root, { transformOrigin: '50% 0%' }, 0);
      tl.to(root, { yPercent: -100, duration: 0.7, ease: 'power4.inOut' }, '+=0.08');
      tl.set(root, { autoAlpha: 0 });
    }

    return () => {
      killed = true;
      tl.kill();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="preloader fixed inset-0 z-[100] grid place-items-center bg-bg"
      aria-hidden
    >
      <div className="text-center">
        <div className="font-subtitle text-3xl font-extrabold tracking-tight">
          Ted<span className="text-grad">TECH</span>
        </div>
        <div className="mt-3 font-mono text-sm text-muted">
          <span ref={counterRef}>00</span>
          <span className="text-blue">%</span>
        </div>
      </div>
    </div>
  );
}

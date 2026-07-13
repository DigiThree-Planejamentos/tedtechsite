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
  const bezelRef = useRef<SVGRectElement>(null);
  const screenRef = useRef<SVGRectElement>(null);
  const standRef = useRef<SVGPathElement>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    let killed = false;

    // The page underneath is already fully rendered (tall), so its native
    // scrollbar shows through during preload and shifts the centered CRT
    // off from true viewport-center. Lock scroll for the preload duration
    // only, always restoring on finish/unmount.
    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    const lockScroll = () => {
      html.style.overflow = 'hidden';
      body.style.overflow = 'hidden';
    };
    const unlockScroll = () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
    };

    const finish = () => {
      unlockScroll();
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
    // Monitor line-art "draws itself" in sync with the loading counter —
    // each shape's stroke is dashed to its own length, then wiped from
    // dashoffset:length to 0, bezel first, then screen, then stand.
    const shapes = [bezelRef.current, screenRef.current, standRef.current].filter(
      (el): el is SVGGeometryElement => !!el && typeof el.getTotalLength === 'function',
    );
    shapes.forEach((el) => {
      const len = el.getTotalLength();
      el.style.strokeDasharray = String(len);
      el.style.strokeDashoffset = String(len);
    });

    lockScroll();

    const state = { v: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        if (!killed) finish();
      },
    });
    tl.to(
      state,
      {
        v: 100,
        duration: 2.2,
        ease: 'power2.out',
        onUpdate: () => {
          if (counter) counter.textContent = String(Math.round(state.v)).padStart(2, '0');
        },
      },
      0,
    );
    shapes.forEach((el, i) => {
      tl.to(el, { strokeDashoffset: 0, duration: 1.3, ease: 'power2.out' }, 0.2 + i * 0.35);
    });
    if (root) {
      tl.set(root, { transformOrigin: '50% 0%' }, 0);
      tl.to(root, { yPercent: -100, duration: 1.1, ease: 'power4.inOut' }, '+=0.3');
      tl.set(root, { autoAlpha: 0 });
    }

    return () => {
      killed = true;
      tl.kill();
      unlockScroll();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="preloader fixed inset-0 z-[100] grid place-items-center bg-bg"
      aria-hidden
    >
      {/* Old CRT monitor line-art — the loading logo/counter sit inside its screen. */}
      <div className="relative aspect-[6/5] w-72 sm:w-96">
        <svg
          viewBox="0 0 240 200"
          fill="none"
          className="absolute inset-0 h-full w-full text-blue"
        >
          <rect
            ref={bezelRef}
            x="10"
            y="10"
            width="220"
            height="150"
            rx="14"
            stroke="currentColor"
            strokeWidth="2.5"
          />
          <rect
            ref={screenRef}
            x="26"
            y="26"
            width="188"
            height="118"
            rx="4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeOpacity="0.55"
          />
          <path
            ref={standRef}
            d="M104 160 L136 160 L146 182 L94 182 Z M78 188 L162 188 L162 194 L78 194 Z"
            stroke="currentColor"
            strokeWidth="2"
          />
          <circle cx="216" cy="148" r="2.5" fill="currentColor" />
        </svg>
        <div
          className="absolute flex flex-col items-center justify-center text-center"
          style={{ top: '13%', left: '10.8%', width: '78.4%', height: '59%' }}
        >
          <div className="font-subtitle text-xl font-extrabold tracking-tight sm:text-2xl">
            Ted<span className="text-grad">TECH</span>
          </div>
          <div className="mt-2 font-mono text-sm text-muted sm:text-base">
            <span ref={counterRef}>00</span>
            <span className="text-blue">%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

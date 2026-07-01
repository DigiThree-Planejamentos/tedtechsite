'use client';

import { ReactLenis, type LenisRef } from 'lenis/react';
import { useEffect, useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/components/motion/useReducedMotion';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Global smooth-scroll (Lenis) driven by GSAP's single rAF loop and synced to
 * ScrollTrigger. The ticker reads the Lenis instance every frame, so it starts
 * driving as soon as Lenis is ready (no race). Under reduced motion it renders
 * the plain tree — native scrolling, instant content.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    if (reduced) return;
    let attached = false;

    const update = (time: number) => {
      const lenis = lenisRef.current?.lenis;
      if (!lenis) return;
      if (!attached) {
        lenis.on('scroll', ScrollTrigger.update);
        attached = true;
      }
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    // Recalculate trigger positions once web fonts settle (layout shifts).
    document.fonts?.ready.then(() => ScrollTrigger.refresh()).catch(() => {});

    return () => {
      gsap.ticker.remove(update);
      const lenis = lenisRef.current?.lenis;
      if (lenis) lenis.off('scroll', ScrollTrigger.update);
    };
  }, [reduced]);

  if (reduced) return <>{children}</>;

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{ autoRaf: false, smoothWheel: true, lerp: 0.1, anchors: { offset: -80 } }}
    >
      {children}
    </ReactLenis>
  );
}

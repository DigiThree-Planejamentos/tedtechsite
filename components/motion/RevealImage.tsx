'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useReducedMotion } from './useReducedMotion';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Clip-path/mask image reveal on scroll-in, with a subtle scale settle.
 * Always renders a real `<img alt>` so the image is in the static HTML for SEO.
 * (The WebGL `gl-distort` variant is added in the WebGL phase.)
 */
export function RevealImage({
  src,
  alt,
  className,
  imgClassName,
}: {
  src: string;
  alt: string;
  effect?: 'clip' | 'mask';
  className?: string;
  imgClassName?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      const el = ref.current;
      if (!el) return;
      const img = el.querySelector('img');
      gsap.set(el, { clipPath: 'inset(0 0 100% 0)' });
      if (img) gsap.set(img, { scale: 1.2 });
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
          end: 'bottom top',
          toggleActions: 'restart reverse restart reverse',
        },
      });
      tl.to(el, { clipPath: 'inset(0 0 0% 0)', duration: 1.0, ease: 'power4.inOut' });
      if (img) tl.to(img, { scale: 1, duration: 1.2, ease: 'power3.out' }, 0);
    },
    { dependencies: [reduced], scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className={imgClassName} />
    </div>
  );
}

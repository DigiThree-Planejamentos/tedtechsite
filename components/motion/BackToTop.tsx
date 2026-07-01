'use client';

import { type ReactNode } from 'react';
import { useLenis } from 'lenis/react';

/** Smoothly scrolls to the top via Lenis (falls back to native smooth scroll). */
export function BackToTop({ className, children }: { className?: string; children: ReactNode }) {
  const lenis = useLenis();
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        if (lenis) lenis.scrollTo(0);
        else if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
      }}
    >
      {children}
    </button>
  );
}

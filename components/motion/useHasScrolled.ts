'use client';

import { useEffect, useState } from 'react';

/**
 * True once the user has performed a real scroll gesture. Used to gate
 * scroll-triggered animations so they never fire purely because a section
 * was already inside the viewport at initial load (common on tall/fullscreen
 * screens where little or no scrolling is needed to reveal it).
 */
export function useHasScrolled(): boolean {
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    if (hasScrolled || typeof window === 'undefined') return;
    const onScroll = () => setHasScrolled(true);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [hasScrolled]);

  return hasScrolled;
}

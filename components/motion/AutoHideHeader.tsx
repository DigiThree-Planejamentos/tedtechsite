'use client';

import { useEffect, useRef, type ReactNode } from 'react';

/**
 * Fixed header that hides on scroll-down and reappears on scroll-up, deepening
 * its background/blur once the page has scrolled. Works with Lenis (which
 * scrolls window) and native scroll alike.
 */
export function AutoHideHeader({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === 'undefined') return;
    let last = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      const goingDown = y > last && y > 90;
      el.style.transform = goingDown ? 'translateY(-100%)' : 'translateY(0)';
      const scrolled = y > 20;
      el.style.backgroundColor = scrolled ? 'rgba(6, 8, 13, 0.72)' : 'transparent';
      el.style.backdropFilter = scrolled ? 'blur(12px)' : 'none';
      last = y;
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header ref={ref} className={className}>
      {children}
    </header>
  );
}

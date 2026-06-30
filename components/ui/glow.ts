import type { PointerEvent as ReactPointerEvent } from 'react';

export function trackButtonGlow(event: ReactPointerEvent<HTMLElement>) {
  if (
    event.pointerType === 'touch' ||
    (typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  ) {
    return;
  }

  const element = event.currentTarget;
  const rect = element.getBoundingClientRect();
  element.style.setProperty('--glow-x', `${event.clientX - rect.left}px`);
  element.style.setProperty('--glow-y', `${event.clientY - rect.top}px`);
}

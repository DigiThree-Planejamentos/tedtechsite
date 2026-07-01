// Shared motion config — single source of truth for eases/durations/staggers.
// Keep the CSS eases in app/globals.css in sync with `easeCss` below.

/** GSAP-style cubic-bezier tuples (x1,y1,x2,y2). */
export const ease = {
  /** The trionn signature ease — smooth, weighty. Matches globals.css. */
  trionn: [0.22, 1, 0.36, 1] as [number, number, number, number],
  expoOut: [0.16, 1, 0.3, 1] as [number, number, number, number],
  power: [0.65, 0, 0.35, 1] as [number, number, number, number],
};

/** CSS `cubic-bezier(...)` strings mirroring `ease`. */
export const easeCss = {
  trionn: 'cubic-bezier(0.22, 1, 0.36, 1)',
  expoOut: 'cubic-bezier(0.16, 1, 0.3, 1)',
  power: 'cubic-bezier(0.65, 0, 0.35, 1)',
};

/** Durations in seconds. */
export const duration = {
  fast: 0.4,
  base: 0.7,
  slow: 1.1,
};

/** Stagger steps in seconds. */
export const stagger = {
  tight: 0.06,
  base: 0.1,
  loose: 0.16,
};

/** Breakpoints in px (mirror Tailwind defaults we rely on). */
export const breakpoint = {
  md: 768,
  lg: 1024,
};

/** Default ScrollTrigger start for on-enter reveals. */
export const REVEAL_START = 'top 85%';

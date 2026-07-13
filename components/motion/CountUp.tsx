'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useReducedMotion } from './useReducedMotion';
import { useHasScrolled } from './useHasScrolled';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/** Splits "R$ 297" / "+XXXX" / "6" into prefix + numeric + suffix. */
function parse(value: string): { prefix: string; num: string; suffix: string } | null {
  const match = value.match(/^([^\d]*)([\d.,]+)(.*)$/s);
  if (!match) return null;
  return { prefix: match[1], num: match[2], suffix: match[3] };
}

function format(v: number, decimals: number, original: string): string {
  const hasThousand = original.includes('.') && decimals === 0;
  const fixed = decimals > 0 ? v.toFixed(decimals) : String(Math.round(v));
  const [intPart, decPart] = fixed.split('.');
  const grouped =
    hasThousand || Number(intPart) >= 1000
      ? intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
      : intPart;
  return decPart ? `${grouped},${decPart}` : grouped;
}

/**
 * Counts a numeric value up from 0 when scrolled into view, preserving any
 * currency prefix / suffix. Renders the final value as a single text node so it
 * is present in the static HTML and in tests; only animates client-side.
 */
export function CountUp({
  value,
  duration: dur = 1.4,
  className,
}: {
  value: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const reduced = useReducedMotion();
  const hasScrolled = useHasScrolled();
  const parsed = parse(value);

  useGSAP(
    () => {
      if (reduced || !parsed || !hasScrolled) return;
      const el = ref.current;
      if (!el) return;
      const decimals = (parsed.num.split(',')[1] || '').length;
      const target = Number(parsed.num.replace(/\./g, '').replace(',', '.'));
      if (!isFinite(target)) return;

      const state = { v: 0 };
      gsap.to(state, {
        v: target,
        duration: dur,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          end: 'bottom top',
          toggleActions: 'restart none none none',
        },
        onStart: () => {
          el.textContent = `${parsed.prefix}${format(0, decimals, parsed.num)}${parsed.suffix}`;
        },
        onUpdate: () => {
          el.textContent = `${parsed.prefix}${format(state.v, decimals, parsed.num)}${parsed.suffix}`;
        },
        onComplete: () => {
          el.textContent = value;
        },
      });
    },
    { dependencies: [reduced, value, hasScrolled], scope: ref },
  );

  if (!parsed) return <span className={className}>{value}</span>;
  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}

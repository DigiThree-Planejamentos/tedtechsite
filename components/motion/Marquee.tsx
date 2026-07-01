'use client';

import { type CSSProperties } from 'react';

/**
 * Infinite horizontal ticker. Pure CSS (see `.marquee` in globals.css); the
 * track is duplicated so the loop is seamless. Decorative → `aria-hidden`.
 * Paused under reduced motion via the global media query.
 */
export function Marquee({
  items,
  speed = 40,
  reverse = false,
  separator = '✦',
  className,
}: {
  items: string[];
  speed?: number;
  reverse?: boolean;
  separator?: string;
  className?: string;
}) {
  const track = [...items, ...items];
  const chars = items.join('').length || 20;
  const style = {
    ['--marquee-duration' as string]: `${(chars * 60) / speed}s`,
  } as CSSProperties;

  return (
    <div className={`marquee ${className ?? ''}`} style={style} aria-hidden>
      <div className={`marquee__track${reverse ? ' marquee__track--reverse' : ''}`}>
        {track.map((item, i) => (
          <span key={i} className="marquee__item">
            <span>{item}</span>
            <span className="marquee__sep text-blue">{separator}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

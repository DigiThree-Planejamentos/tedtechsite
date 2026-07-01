'use client';

import dynamic from 'next/dynamic';

// Code-split the canvas; never server-rendered (needs DOM/canvas).
const CircuitHeroCanvas = dynamic(() => import('./CircuitHeroCanvas'), {
  ssr: false,
  loading: () => null,
});

/** Client host for the hero circuit/starfield canvas. Renders nothing on SSR. */
export function CircuitHero() {
  return <CircuitHeroCanvas />;
}

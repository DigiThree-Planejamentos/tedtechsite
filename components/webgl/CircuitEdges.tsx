'use client';

import dynamic from 'next/dynamic';

// Code-split the canvas; never server-rendered (needs DOM/canvas).
const CircuitEdgesCanvas = dynamic(() => import('./CircuitEdgesCanvas'), {
  ssr: false,
  loading: () => null,
});

/** Client host for the global circuit field (hero backdrop + edge border). Renders nothing on SSR. */
export function CircuitEdges() {
  return <CircuitEdgesCanvas />;
}

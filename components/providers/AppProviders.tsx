'use client';

import { useState, type ReactNode } from 'react';
import { SmoothScrollProvider } from './SmoothScrollProvider';
import { Preloader } from './Preloader';
import { ReadyProvider } from './ReadyContext';
import { Cursor } from '@/components/webgl/Cursor';
import { CircuitEdges } from '@/components/webgl/CircuitEdges';

/**
 * Single client entry mounted in the (server) root layout. Composes the
 * smooth-scroll provider, the intro preloader, and the `ready` context that
 * gates above-the-fold reveals. Section content is passed through as
 * server-rendered children, so it stays in the static HTML.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);

  return (
    <ReadyProvider value={ready}>
      <SmoothScrollProvider>
        <Preloader onComplete={() => setReady(true)} />
        <CircuitEdges />
        <Cursor />
        {children}
      </SmoothScrollProvider>
    </ReadyProvider>
  );
}

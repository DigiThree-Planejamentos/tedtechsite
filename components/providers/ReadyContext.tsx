'use client';

import { createContext, useContext } from 'react';

/**
 * Whether the intro/preloader has finished. Above-the-fold reveals
 * (`SplitReveal trigger="ready"`) wait on this so they start only after the
 * curtain lifts. Defaults to `true` when no provider is present (SSR, tests,
 * reduced-motion) so content reveals immediately in those cases.
 */
const ReadyContext = createContext(true);

export const ReadyProvider = ReadyContext.Provider;

export function useReady(): boolean {
  return useContext(ReadyContext);
}

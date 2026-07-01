'use client';

import { useEffect, useState } from 'react';

const QUERY = '(pointer: coarse)';

/**
 * True on coarse-pointer (touch) devices. Used to gate the custom cursor and
 * WebGL hosts — on touch we fall back to the static DOM presentation.
 * SSR-safe: defaults to `false` and hydrates on mount.
 */
export function useIsTouch(): boolean {
  const [touch, setTouch] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const mq = window.matchMedia(QUERY);
    const update = () => setTouch(mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);

  return touch;
}

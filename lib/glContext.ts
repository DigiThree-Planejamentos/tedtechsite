// Small helpers shared by the WebGL canvases. All guard for SSR.

/** True only if a WebGL context can actually be created (false in jsdom/SSR). */
export function canUseGL(): boolean {
  if (typeof window === 'undefined' || typeof document === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return !!gl;
  } catch {
    return false;
  }
}

/** Device pixel ratio capped at 2 to bound GPU cost. */
export function capDPR(): number {
  if (typeof window === 'undefined') return 1;
  return Math.min(window.devicePixelRatio || 1, 2);
}

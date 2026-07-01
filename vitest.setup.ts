import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// --- jsdom environment polyfills (shared by all tests) ---
// jsdom lacks these browser APIs; the motion primitives and WebGL hosts guard
// on them at runtime, but the stubs let components mount cleanly under test.
// Per-test overrides (e.g. reduced-motion in modulos.test) still take priority.
//
// NOTE: intentionally do NOT stub IntersectionObserver / ResizeObserver
// globally. Motion components guard on `typeof IntersectionObserver` and take
// the reveal-immediately fallback when absent — which is the desired test
// behavior and preserves the existing "observer API unavailable" test.

if (typeof window !== 'undefined' && typeof window.matchMedia !== 'function') {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}

if (typeof Element !== 'undefined') {
  if (!Element.prototype.animate) {
    Element.prototype.animate = (() => ({
      cancel() {},
      finish() {},
      play() {},
      pause() {},
      reverse() {},
      onfinish: null,
    })) as unknown as typeof Element.prototype.animate;
  }
  if (!Element.prototype.getAnimations) {
    Element.prototype.getAnimations = (() =>
      []) as unknown as typeof Element.prototype.getAnimations;
  }
  if (!Element.prototype.scrollTo) {
    Element.prototype.scrollTo = (() => {}) as unknown as typeof Element.prototype.scrollTo;
  }
}

// --- Animation library mocks (applied to every test file) ---
// We never unit-test tween behavior; we test that content/children render and
// that the reduced-motion fallback is intact. These dumb stubs make GSAP/Lenis
// imports resolve to no-ops so components mount without touching real timers,
// scroll, or WebGL.

vi.mock('gsap', () => {
  const makeTween = () => {
    const tween: Record<string, unknown> = {};
    const chain = () => tween;
    Object.assign(tween, {
      kill: () => {},
      play: chain,
      pause: chain,
      progress: chain,
      revert: () => {},
      restart: chain,
      scrollTrigger: undefined,
    });
    return tween;
  };
  const makeTimeline = () => {
    const tl: Record<string, unknown> = {};
    const chain = () => tl;
    Object.assign(tl, {
      to: chain,
      from: chain,
      fromTo: chain,
      set: chain,
      add: chain,
      call: chain,
      kill: () => {},
      play: chain,
      pause: chain,
      progress: chain,
      eventCallback: chain,
    });
    return tl;
  };
  const gsap = {
    registerPlugin: () => {},
    to: () => makeTween(),
    from: () => makeTween(),
    fromTo: () => makeTween(),
    set: () => makeTween(),
    timeline: () => makeTimeline(),
    quickTo: () => () => {},
    quickSetter: () => () => {},
    killTweensOf: () => {},
    getProperty: () => 0,
    ticker: { add: () => {}, remove: () => {}, lagSmoothing: () => {} },
    utils: {
      toArray: (x: unknown) => (Array.isArray(x) ? x : x ? [x] : []),
      clamp: (_min: number, _max: number, v: number) => v,
      mapRange: () => 0,
      interpolate: () => () => 0,
    },
    context: (fn?: () => void) => {
      if (typeof fn === 'function') {
        try {
          fn();
        } catch {
          /* ignore */
        }
      }
      return { revert: () => {}, add: () => {}, kill: () => {} };
    },
    matchMedia: () => ({ add: () => {}, revert: () => {}, kill: () => {} }),
    delayedCall: () => makeTween(),
  };
  return { default: gsap, gsap };
});

vi.mock('gsap/ScrollTrigger', () => {
  const ScrollTrigger = {
    create: () => ({ kill: () => {} }),
    refresh: () => {},
    update: () => {},
    register: () => {},
    batch: () => [],
    getAll: () => [],
    killAll: () => {},
    config: () => {},
  };
  return { default: ScrollTrigger, ScrollTrigger };
});

vi.mock('gsap/SplitText', () => {
  class SplitText {
    lines: Element[] = [];
    words: Element[] = [];
    chars: Element[] = [];
    constructor(_target: unknown, _options?: unknown) {}
    split() {
      return this;
    }
    revert() {}
  }
  return { default: SplitText, SplitText };
});

vi.mock('@gsap/react', async () => {
  const React = await import('react');
  const useGSAP = (
    cb?: (ctx: unknown) => void,
    config?: unknown[] | { dependencies?: unknown[] },
  ) => {
    const deps = Array.isArray(config)
      ? config
      : config && typeof config === 'object' && 'dependencies' in config
        ? (config.dependencies ?? [])
        : [];
    React.useEffect(() => {
      if (typeof cb === 'function') {
        try {
          cb({ selector: () => [] });
        } catch {
          /* ignore */
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps as unknown[]);
    return {
      context: { revert: () => {}, add: () => {}, kill: () => {} },
      contextSafe: (fn: unknown) => fn,
    };
  };
  return { useGSAP, default: { useGSAP } };
});

vi.mock('lenis/react', async () => {
  const React = await import('react');
  const ReactLenis = React.forwardRef(
    ({ children }: { children?: React.ReactNode }, _ref: unknown) =>
      React.createElement(React.Fragment, null, children),
  );
  ReactLenis.displayName = 'ReactLenisMock';
  const useLenis = () => undefined;
  return { default: ReactLenis, ReactLenis, Lenis: ReactLenis, useLenis };
});

vi.mock('ogl', () => ({
  Renderer: class {
    gl = { canvas: { style: {}, getBoundingClientRect: () => ({}) }, clearColor() {}, SRC_ALPHA: 0, ONE: 0, POINTS: 0 };
    setSize() {}
    render() {}
  },
  Camera: class {
    position = { z: 0 };
    perspective() {
      return this;
    }
  },
  Geometry: class {},
  Program: class {
    uniforms: Record<string, { value: unknown }> = {};
    setBlendFunc() {}
  },
  Mesh: class {},
}));

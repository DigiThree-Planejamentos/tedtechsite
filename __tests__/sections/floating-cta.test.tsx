import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { FloatingCta } from '@/components/sections/FloatingCta';
import { content } from '@/lib/content';

let offer: HTMLElement;
let offerTop: number;

function setScrollY(value: number) {
  Object.defineProperty(window, 'scrollY', {
    configurable: true,
    value,
  });
}

function makeRect(top: number): DOMRect {
  return {
    x: 0,
    y: top,
    top,
    right: 1000,
    bottom: top + 600,
    left: 0,
    width: 1000,
    height: 600,
    toJSON: () => ({}),
  };
}

describe('FloatingCta', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      value: 1000,
    });
    Object.defineProperty(window, 'requestAnimationFrame', {
      configurable: true,
      value: undefined,
    });
    setScrollY(0);
    offerTop = 2400;
    offer = document.createElement('section');
    offer.id = 'oferta';
    vi.spyOn(offer, 'getBoundingClientRect').mockImplementation(() =>
      makeRect(offerTop),
    );
    document.body.appendChild(offer);
  });

  afterEach(() => {
    offer.remove();
    vi.restoreAllMocks();
  });

  it('renders the configured urgency, desktop price and checkout link', () => {
    const { container } = render(<FloatingCta />);
    expect(screen.getByText(content.floatingCta.urgency)).toBeInTheDocument();
    expect(screen.getByText(content.offer.priceNow)).toBeInTheDocument();
    expect(screen.getByText(content.offer.installments)).toBeInTheDocument();
    expect(container.querySelector('a')).toHaveAttribute(
      'href',
      content.checkoutUrl,
    );
  });

  it('stays hidden before 70% of the first viewport and leaves the tab order', () => {
    setScrollY(699);
    const { container } = render(<FloatingCta />);
    const root = container.querySelector('[data-floating-cta]');
    const link = container.querySelector('a');

    expect(root).toHaveAttribute('data-visible', 'false');
    expect(root).toHaveAttribute('aria-hidden', 'true');
    expect(link).toHaveAttribute('tabindex', '-1');
  });

  it('appears after the threshold, then hides at and below the offer', () => {
    const { container } = render(<FloatingCta />);
    const root = container.querySelector('[data-floating-cta]');
    const link = container.querySelector('a');

    setScrollY(700);
    fireEvent.scroll(window);
    expect(root).toHaveAttribute('data-visible', 'true');
    expect(root).toHaveAttribute('aria-hidden', 'false');
    expect(link).not.toHaveAttribute('tabindex');

    offerTop = 1000;
    fireEvent.scroll(window);
    expect(root).toHaveAttribute('data-visible', 'false');

    offerTop = -700;
    setScrollY(3000);
    fireEvent.scroll(window);
    expect(root).toHaveAttribute('data-visible', 'false');

    offerTop = 1800;
    setScrollY(700);
    fireEvent.scroll(window);
    expect(root).toHaveAttribute('data-visible', 'true');
  });

  it('removes movement when reduced motion is requested', async () => {
    vi.spyOn(window, 'matchMedia').mockImplementation(
      (query) =>
        ({
          matches: query.includes('prefers-reduced-motion'),
          media: query,
          onchange: null,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          addListener: vi.fn(),
          removeListener: vi.fn(),
          dispatchEvent: vi.fn(),
        }) as MediaQueryList,
    );

    const { container } = render(<FloatingCta />);
    await waitFor(() => {
      expect(container.querySelector('[data-floating-cta]')).toHaveClass(
        'translate-y-0',
        'transition-none',
      );
    });
  });
});

import { beforeEach, describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Modulos } from '@/components/sections/Modulos';
import { content } from '@/lib/content';

function installMatchMedia({
  desktop = false,
  reducedMotion = false,
}: {
  desktop?: boolean;
  reducedMotion?: boolean;
} = {}) {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches:
        (query.includes('min-width') && desktop) ||
        (query.includes('prefers-reduced-motion') && reducedMotion),
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

describe('Modulos', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    installMatchMedia();
    Object.defineProperty(window, 'scrollTo', {
      configurable: true,
      value: vi.fn(),
    });
    Object.defineProperty(HTMLElement.prototype, 'scrollTo', {
      configurable: true,
      value: vi.fn(),
    });
    Object.defineProperty(Element.prototype, 'animate', {
      configurable: true,
      value: vi.fn(() => ({ cancel: vi.fn() })),
    });
    Object.defineProperty(Element.prototype, 'getAnimations', {
      configurable: true,
      value: vi.fn(() => []),
    });
  });

  it('has the modulos anchor and renders all 6 module titles', () => {
    const { container } = render(<Modulos />);
    expect(container.querySelector('#modulos')).not.toBeNull();
    for (const m of content.modules) {
      expect(screen.getByText(m.title)).toBeInTheDocument();
    }
  });

  it('shows all module contents without requiring disclosure', () => {
    const { container } = render(<Modulos />);
    expect(container.querySelectorAll('article')).toHaveLength(6);
    expect(container.querySelector('details')).toBeNull();
    for (const module of content.modules) {
      for (const lesson of module.lessons) {
        expect(screen.getByText(lesson)).toBeInTheDocument();
      }
    }
  });

  it('renders the corresponding image and alternative text for every module', () => {
    render(<Modulos />);

    for (const module of content.modules) {
      const image = screen.getByAltText(module.imageAlt);
      expect(decodeURIComponent(image.getAttribute('src') ?? '')).toContain(
        module.image,
      );
    }
  });

  it('provides controls to navigate the horizontal module list', () => {
    render(<Modulos />);
    const previous = screen.getByRole('button', { name: 'Ver módulos anteriores' });
    const next = screen.getByRole('button', { name: 'Ver próximos módulos' });

    expect(previous).toBeDisabled();
    expect(next).toBeEnabled();
    expect(previous).toHaveClass('module-stepper-button');
    expect(next).toHaveAttribute('data-stepper-direction', 'next');
    expect(screen.getByText('01')).toBeInTheDocument();

    fireEvent.click(next);
    expect(previous).toBeEnabled();
    expect(next).toBeEnabled();
    expect(screen.getByText('02')).toBeInTheDocument();
    expect(document.querySelectorAll('[data-active="true"]')).toHaveLength(1);
    expect(Element.prototype.animate).toHaveBeenCalledTimes(2);
  });

  it('does not animate when clicking a disabled stepper control', () => {
    render(<Modulos />);
    const previous = screen.getByRole('button', { name: 'Ver módulos anteriores' });

    fireEvent.click(previous);
    expect(screen.getByText('01')).toBeInTheDocument();
    expect(Element.prototype.animate).not.toHaveBeenCalled();
  });

  it('resets the module list when clicking the stepper value', () => {
    render(<Modulos />);
    const next = screen.getByRole('button', { name: 'Ver próximos módulos' });

    fireEvent.click(next);
    expect(screen.getByText('02')).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Módulo 02 de 06. Voltar ao primeiro módulo',
      }),
    );
    expect(screen.getByText('01')).toBeInTheDocument();
  });

  it('skips the stepper rebound when reduced motion is requested', () => {
    installMatchMedia({ reducedMotion: true });

    render(<Modulos />);
    const next = screen.getByRole('button', { name: 'Ver próximos módulos' });

    fireEvent.click(next);
    expect(screen.getByText('02')).toBeInTheDocument();
    expect(Element.prototype.animate).not.toHaveBeenCalled();
  });

  it('animates the initial visible module when the observer API is unavailable', async () => {
    render(<Modulos />);
    await waitFor(() => {
      expect(document.querySelectorAll('[data-active="true"]')).toHaveLength(1);
    });
  });

  it('renders module cards with the shared site border language', () => {
    const { container } = render(<Modulos />);
    for (const card of container.querySelectorAll('article')) {
      expect(card).toHaveClass('border', 'border-blue/25', 'rounded-[1.5rem]');
      expect(card).not.toHaveClass('clean-border');
      expect(card.className).not.toMatch(/\bbg-/);
    }
  });

  it('keeps module text static when the pointer enters a card', () => {
    const { container } = render(<Modulos />);
    const firstCard = container.querySelector('article')!;

    fireEvent.mouseEnter(firstCard);
    expect(Element.prototype.animate).not.toHaveBeenCalled();
  });

  it('keeps native horizontal scrolling on mobile', () => {
    const { container } = render(<Modulos />);
    const carousel = container.querySelector('[data-module-carousel]');

    expect(carousel).toHaveAttribute('data-desktop-pin', 'false');
    expect(ScrollTrigger.create).not.toHaveBeenCalled();
  });

  it('creates a pinned scrubbed horizontal track on desktop', async () => {
    installMatchMedia({ desktop: true });
    const { container } = render(<Modulos />);

    await waitFor(() => {
      expect(
        container.querySelector('[data-module-carousel]'),
      ).toHaveAttribute('data-desktop-pin', 'true');
    });

    const triggerOptions = vi.mocked(ScrollTrigger.create).mock.calls.at(-1)?.[0];
    expect(triggerOptions?.pin).toBe(container.querySelector('.module-pin'));
    expect(triggerOptions?.pinSpacing).toBe(true);
    expect(triggerOptions?.scrub).toBe(0.6);
    expect(triggerOptions?.invalidateOnRefresh).toBe(true);
    expect(triggerOptions?.anticipatePin).toBe(1);
    expect(triggerOptions?.end).toEqual(expect.any(Function));
    expect(Number(String((triggerOptions?.end as () => string)()).slice(2))).toBeGreaterThanOrEqual(
      180,
    );
  });

  it('moves the page to the module progress when desktop controls are used', async () => {
    installMatchMedia({ desktop: true });
    render(<Modulos />);

    await waitFor(() => {
      expect(ScrollTrigger.create).toHaveBeenCalled();
    });
    fireEvent.click(
      screen.getByRole('button', { name: 'Ver próximos módulos' }),
    );

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 256,
      behavior: 'smooth',
    });
    expect(screen.getByText('02')).toBeInTheDocument();
  });

  it('does not pin on desktop when reduced motion is requested', async () => {
    installMatchMedia({ desktop: true, reducedMotion: true });
    const { container } = render(<Modulos />);

    await waitFor(() => {
      expect(
        container.querySelector('[data-module-carousel]'),
      ).toHaveAttribute('data-desktop-pin', 'false');
    });
    expect(ScrollTrigger.create).not.toHaveBeenCalled();
  });

  it('supports arrow-key navigation from the carousel region', () => {
    render(<Modulos />);
    const carousel = screen.getByRole('region', { name: 'Módulos do curso' });

    fireEvent.keyDown(carousel, { key: 'ArrowRight' });
    expect(screen.getByText('02')).toBeInTheDocument();

    fireEvent.keyDown(carousel, { key: 'ArrowLeft' });
    expect(screen.getByText('01')).toBeInTheDocument();
  });

  it('kills the desktop ScrollTrigger when the section unmounts', async () => {
    installMatchMedia({ desktop: true });
    const { unmount } = render(<Modulos />);

    await waitFor(() => {
      expect(ScrollTrigger.create).toHaveBeenCalled();
    });
    const createdTrigger = vi.mocked(ScrollTrigger.create).mock.results.at(-1)
      ?.value;

    unmount();
    expect(createdTrigger?.kill).toHaveBeenCalled();
  });
});

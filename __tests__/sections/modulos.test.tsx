import { beforeEach, describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Modulos } from '@/components/sections/Modulos';
import { content } from '@/lib/content';

describe('Modulos', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
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
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query.includes('prefers-reduced-motion'),
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

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

  it('renders transparent module cards with the button border color', () => {
    const { container } = render(<Modulos />);
    for (const card of container.querySelectorAll('article')) {
      expect(card).toHaveClass('border', 'border-blue/50', 'rounded-2xl');
      expect(card).not.toHaveClass('clean-border');
      expect(card.className).not.toMatch(/\bbg-/);
    }
  });

  it('replays the module animation when the pointer enters a card', () => {
    const { container } = render(<Modulos />);
    const firstCard = container.querySelector('article')!;

    fireEvent.mouseEnter(firstCard);
    expect(Element.prototype.animate).toHaveBeenCalledTimes(
      content.modules[0].lessons.length + 3,
    );
  });
});

import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/Button';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { Logo } from '@/components/ui/Logo';

describe('ui primitives', () => {
  it('primary button links to href with transparent glow styling', () => {
    render(<Button href="https://x.test" variant="primary">Quero</Button>);
    const a = screen.getByRole('link', { name: 'Quero' });
    expect(a).toHaveAttribute('href', 'https://x.test');
    expect(a).toHaveClass('glow-button');
    expect(a).toHaveClass('border-blue/50');
    expect(a.className).not.toContain('btn-grad');
    expect(a.className).not.toMatch(/\bbg-/);
  });

  it('whatsapp button uses transparent green styling', () => {
    render(<Button href="https://wa.me/1" variant="whatsapp">Zap</Button>);
    const button = screen.getByRole('link', { name: 'Zap' });
    expect(button).toHaveClass('glow-button', 'glow-button--whatsapp');
    expect(button).toHaveClass('border-wa/50', 'text-wa');
    expect(button.className).not.toMatch(/\bbg-/);
  });

  it('tracks the pointer position through CSS glow coordinates', () => {
    Object.defineProperty(window, 'PointerEvent', {
      configurable: true,
      value: MouseEvent,
    });
    render(<Button href="https://x.test">Quero</Button>);
    const button = screen.getByRole('link', { name: 'Quero' });
    vi.spyOn(button, 'getBoundingClientRect').mockReturnValue({
      x: 20,
      y: 30,
      left: 20,
      top: 30,
      right: 220,
      bottom: 80,
      width: 200,
      height: 50,
      toJSON: () => ({}),
    });

    fireEvent.pointerMove(button, { clientX: 80, clientY: 55 });
    expect(button.style.getPropertyValue('--glow-x')).toBe('60px');
    expect(button.style.getPropertyValue('--glow-y')).toBe('25px');
  });

  it('section label has no pill background', () => {
    render(<SectionLabel>Você se identifica?</SectionLabel>);
    const el = screen.getByText('Você se identifica?');
    expect(el.className).not.toContain('rounded-full');
  });

  it('logo renders the brand', () => {
    render(<Logo />);
    expect(screen.getByText('TECH')).toBeInTheDocument();
  });
});

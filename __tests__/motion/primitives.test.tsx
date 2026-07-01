import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { Reveal } from '@/components/motion/Reveal';
import { Parallax } from '@/components/motion/Parallax';
import { CountUp } from '@/components/motion/CountUp';
import { Marquee } from '@/components/motion/Marquee';
import { MagneticButton } from '@/components/motion/MagneticButton';
import { RevealImage } from '@/components/motion/RevealImage';

function setReducedMotion(reduced: boolean) {
  window.matchMedia = ((query: string) => ({
    matches: reduced && query.includes('prefers-reduced-motion'),
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}

describe('motion primitives', () => {
  beforeEach(() => {
    setReducedMotion(false);
  });

  it('SplitReveal renders its element and text', () => {
    render(<SplitReveal as="h2">Título Teste</SplitReveal>);
    const heading = screen.getByRole('heading', { level: 2, name: 'Título Teste' });
    expect(heading).toBeInTheDocument();
  });

  it('Reveal renders all staggered children', () => {
    render(
      <Reveal stagger={0.1}>
        <div>Alpha</div>
        <div>Beta</div>
      </Reveal>,
    );
    expect(screen.getByText('Alpha')).toBeInTheDocument();
    expect(screen.getByText('Beta')).toBeInTheDocument();
  });

  it('Parallax renders its children', () => {
    render(
      <Parallax speed={0.3}>
        <span>Paralaxe</span>
      </Parallax>,
    );
    expect(screen.getByText('Paralaxe')).toBeInTheDocument();
  });

  it('CountUp renders the final value as text (SSG/tests)', () => {
    render(<CountUp value="R$ 297" />);
    expect(screen.getByText('R$ 297')).toBeInTheDocument();
  });

  it('CountUp handles a bare integer', () => {
    render(<CountUp value="6" />);
    expect(screen.getByText('6')).toBeInTheDocument();
  });

  it('Marquee renders duplicated items and is decorative', () => {
    const { container } = render(<Marquee items={['Pix', 'Cartão']} />);
    expect(screen.getAllByText('Pix').length).toBeGreaterThanOrEqual(2);
    expect(container.querySelector('.marquee')).toHaveAttribute('aria-hidden');
  });

  it('MagneticButton wraps a link without changing its href', () => {
    render(
      <MagneticButton>
        <a href="https://checkout.test">Inscrever</a>
      </MagneticButton>,
    );
    const link = screen.getByRole('link', { name: 'Inscrever' });
    expect(link).toHaveAttribute('href', 'https://checkout.test');
    // pointer interaction must not throw
    expect(() => fireEvent.pointerMove(link.parentElement!, { clientX: 10, clientY: 10 })).not.toThrow();
  });

  it('RevealImage renders a real img with alt', () => {
    render(<RevealImage src="/instrutor.jpg" alt="Instrutor TedTech" />);
    expect(screen.getByRole('img', { name: 'Instrutor TedTech' })).toHaveAttribute(
      'src',
      '/instrutor.jpg',
    );
  });

  it('reduced-motion still renders content (SplitReveal + CountUp)', () => {
    setReducedMotion(true);
    render(
      <div>
        <SplitReveal as="h2">Do zero ao avançado</SplitReveal>
        <CountUp value="R$ 297" />
      </div>,
    );
    expect(screen.getByText('Do zero ao avançado')).toBeInTheDocument();
    expect(screen.getByText('R$ 297')).toBeInTheDocument();
  });
});
